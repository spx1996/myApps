<template>
  <span :id="id" :name="field.name+'_show'" class="textarea-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType.toLowerCase() == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input
        type="hidden"
        :title="field.value"
        :style="field.style"
        v-model="field.value"
      ></el-input>
      <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        {{field.printHiddenValue?field.printHiddenValue:field.value}}
      </div>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <div class="text-wrap">
        <div 
          class="area"
          @mouseenter="enter()"
        >
          <el-input
            class="input-width"
            type="textarea"
            rows="2"
            placeholder="请输入内容"
            :title="field.value"
            :style="field.style"
            v-model="field.value"
            @change="onChange"
            @blur="handleBlurChange"
          >
          </el-input>
          <span v-if="field.instantValidate" class="mark">*</span>
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
        <div class="tips" v-show="isActive">
          {{errorMessage}}
        </div>
      </div>
      
    </template>
    <template v-else-if="field.readOnlyShowValOnly">
      <!-- 只读（文本模式） -->
      
      <template>
        <textarea style="display:none" v-model="field.value"></textarea>
        <div>{{field.value}}</div>
      </template>
    </template>
    <template v-else>
      <!-- 只读（控件模式） -->
      <el-input
        type="textarea"
        rows="2"
        :readonly="true"
        placeholder="请输入内容"
        :title="field.value"
        :style="field.style"
        v-model="field.value"
      >
      </el-input>
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-textarea",
  props: ["id"],
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
      showLogsIcon: true,
      tableData:[],
      showLogsDialog: false,
    };
  },
  methods: {
    hiddenLogsDialog() {
      this.showLogsIcon = false;
      this.showLogsDialog = false;
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
     enter(){
      if(this.field.isModified) {
        this.showLogsIcon = true;
      }
    },
    handleBlurChange() {
      if(this.field.instantValidate) {
        let value = true;
        let formData = this.$parent.checkData(value);
          //item[this.field.name] = this.field.value;
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
    },
    onChange(){
      if (this.field.refreshOnChanged){
        this.$parent.refresh(this.id);
      }
    }
  },
  
};
</script>
