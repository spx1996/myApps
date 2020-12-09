<template>
  <span :id="id" :name="field.name+'_show'" class="dept-select-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType.toLowerCase() == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <input type="hidden" v-model="field.value" />
      <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        {{field.data && field.data.length>0?field.data[0].name:''}}
      </div>
    </template>
    <!-- 只读 -->
    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
       <!-- 只读（文本模式） -->
      <template v-if="field.readOnlyShowValOnly">
        <span v-for="(item, index) in field.options" :key="index">
          <span v-if='item.value == field.value'>{{item.option}}</span>
        </span>
      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <el-select 
          disabled
          v-model='field.value'
          :id="field.divId"
          :discript="field.discript"
          :name="field.name"
          :isCommonFilter="field.isCommonFilter"
          :fieldType="field.formField"
        >
          <el-option
            v-for="(option) in field.options"
            :key="option.value"
            :value="option.value"
            :label="option.option"
            :selected="option.value==field.value?'true':'false'">
          </el-option>
        </el-select>
      </template>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <div 
        class="dept-select-wrap"
        @mouseenter="enter()"
      >
        <el-select 
          v-model='field.value'
          :id="field.divId"
          :discript="field.discript"
          :name="field.name"
          :isCommonFilter="field.isCommonFilter"
          :fieldType="field.formField"
          @change="onChange"
        >
          <el-option
            v-for="(option) in field.options"
            :key="option.value"
            :value="option.value"
            :label="option.option"
            :selected="option.value==field.value?'true':'false'">
          </el-option>
        </el-select>
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
  name: "o-dept-select",
  props: ["id"],
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
      return formData;
    }
  },
  data: function() {
    return { 
      Constant, 
      selectedOption: {},
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
    onChange() {
      if (this.field.refreshOnChanged)//判断是否需要刷新
        this.$parent.refresh(this.id);
    },
  },
  
};
</script>