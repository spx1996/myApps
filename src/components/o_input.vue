<template>
  <span :id="id" :name="field.name+'_show'" class="input-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType.toLowerCase() == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <template>
        <el-input
          :readonly="true"
          type="hidden"
          :style="field.style"
          :name="field.name"
          v-model.lazy="field.value"
          :title="field.title"
        />
        <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
      </template>
      
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div v-if="field.textType == 'password'">
        •••
      </div>
      <div v-else>
        {{field.value}}
      </div>
    </template>
  
    <!-- 只读 -->
    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">

      <template v-if="field.readOnlyShowValOnly">
        <template>{{field.value}}</template>
      </template>
      <template v-else-if="field.textType == 'password'">
        <el-input
          :readonly="true"
          type="password"
          :style="field.style"
          :name="field.name"
          v-model.lazy="field.value"
          :title="field.title"
          @keydown.enter.native="nextFocus($event)"
        />
      </template>
      <template v-else>
        <el-input
          :readonly="true"
          type="text"
          :style="field.style"
          :name="field.name"
          v-model.lazy="field.value"
          :title="field.title"
          @keydown.enter.native="nextFocus($event)"
        />
      </template>
    </template>
    <!--密码-->
    <template v-else-if="field.textType.toLowerCase() == 'password'">
      <el-input
        type="password"
        :style="field.style"
        :name="field.name"
        v-model.lazy="field.value"
        :title="field.title"
        @keydown.enter.native="nextFocus($event)"
      />
    </template>
    <!-- 可编辑 -->
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY" >
      <div 
        class="input-wrap"
        @mouseenter="enter()" 
      >
        <el-input
          class="input-p"
          :ref="field.divId" 
          :placeholder="field.placeholder"
          :type="field.fieldtype=='VALUE_TYPE_NUMBER'?'number':'text'" 
          :style="field.style"
          :name="field.name"
          v-model="field.value"
          :title="field.title"
          @blur="handleBlurChange"
          @change="onChange"
          @keydown.enter.native="nextFocus(field.fieldkeyevent)"
        >
        <i 
          v-if="field.textType=='tel'" 
          class="el-icon-phone el-input__icon tel" 
          slot="suffix">
        </i>
        <span 
          v-if="field.instantValidate" 
          slot="suffix"  
          class="el-input__icon"
          style="color:red;">
            *
        </span>
        </el-input>
        <div class="tips " v-show="isActive">
          <i class="el-icon-close "></i>
          {{errorMessage}}
        </div>
        <i 
          class="fa fa-history icon-log" 
          @click="getOperationLogs" 
          style="color:#46d2db" 
          v-if="showLogsIcon && field.isModified" 
          aria-hidden="true">
        </i>
        <div class="log-box" v-if="showLogsDialog">
          <div class="header">
            <span>历史记录</span>
            <span><i class="el-icon-close" @click="hiddenLogsDialog"></i></span>
          </div>
          <div class="table-list">
            <div class="table-box">
              <el-table
                :data="tableData"
                :header-cell-style="{background:'#F9F9F9',color:'#5A6779'}"
                style="width: 100%">
                <el-table-column
                  prop="modifier"
                  label="修改人">
                </el-table-column>
                <el-table-column
                  prop="time"
                  label="修改时间">
                </el-table-column>
                <el-table-column
                  prop="fieldValue"
                  label="修改值">
                </el-table-column>
              </el-table>
            </div>
            
          </div>
        </div>
      </div>
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-input",
  props: ["id","callback"],
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
      return this.$parent.findField(this.id);
    }
  },
  data: function() {
    return { 
      Constant,
      isActive:false,
      errorMessage:'',
      showLogsDialog: false,
      tableData:[],
      showLogsIcon:true,
    };
  },
  methods: {
    hiddenLogsDialog() {
      this.showLogsIcon = false;
      this.showLogsDialog = false;
    },
    enter(){
      if(this.field.isModified) {
        this.showLogsIcon = true;
      }
    },
    getOperationLogs() {
      this.showLogsDialog = true;
      let data = {
        fieldName: this.field.name,
        _: new Date().getTime(),
      }

      this.$api.getOperationLogs(
        this.$root.appid,
        this.field.docId,
        data,
        {
          onSucess: res => {
            this.tableData = res.data.data;
          }
        }
      )
    },
    handleBlurChange() {
      if(this.field.instantValidate) {
        let value = true;
        let formData = this.$parent.checkData(value);
        this.$api.formValidation(
          this.$root.appid, 
          formData,
          {
            onSucess: response => {
              if(response.data.errcode == 4001) {
                if(response.data.errors && response.data.errors.length > 0) {
                  let arr = response.data.errors;
                  for(let i=0; i<arr.length; i++) {
                    if(this.field.name == arr[i].field) {
                      this.isActive = true;
                      this.errorMessage = arr[i].errmsg
                      return;
                    }else {
                      this.isActive = false;
                      this.errorMessage = '';
                    }
                  }
                }
              }else if(response.data.errcode == 0) {
                this.isActive = false;
              }
            }
          }
        )
      }
      console.log("input----------->",);
      
    },
    nextFocus(value) {
      if(value == "Enterkey") {
        let inputs = document.getElementsByTagName("input"); 
        let arr = [];
        for(let i = 0;i<inputs.length;i++) {
          if(inputs[i].getAttribute('type') != 'hidden') {
            arr.push(inputs[i]);
          }
        }
        if(arr && arr.length > 0) {
          for(let i = 0;i<arr.length;i++){
            if(arr[i] == document.activeElement) {
              if(i==(arr.length-1)){ 
                arr[0].focus(); break; 
              }else { 
                arr[i+1].focus(); break; 
              } 
            }
          } 
        }
      }
      // for(let i = 0;i<inputs.length;i++){
      //   //console.log("inputs[i]------>",inputs[i]);
      //   //console.log(inputs[i].getAttribute('type'));
      //   //console.log(inputs[i].getAttribute('readonly'));
      //   if(inputs[i] == document.activeElement) {
          
      //     // if(i==(inputs.length-1)){ 
      //     //   inputs[0].focus(); break; 
      //     // }else { 
      //     //   inputs[i+3].focus(); break; 
      //     // } 
      //     if(inputs[i+1].getAttribute('type') == 'hidden') {
      //       inputs[i+2].focus(); break;
      //     }else {
      //       console.log("inputs[i+2]-->", inputs[i+2]);
            
      //     }
      //   }else {}
      // } 
      
    },
    onChange() {
      console.log("value------------>",this.field.value);
      if (this.field.refreshOnChanged) {//判断是否需要刷新
        this.$parent.refresh(this.id);
      }
    },
  },
  
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 240px;
}
</style>
