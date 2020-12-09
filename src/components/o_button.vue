<template>
    <span :id="id">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType == 'hidden'"
    >
      <span>{{field.hiddenValue}}</span>
    </template>
    <!--只读-->
    <template v-else-if="field.textType == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        
      </template>
      <template v-else>
        
      </template>
    </template>

    <!-- 可编辑 -->
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY" >
      <a  
        class="vbtn btn btn-success obpm-success" 
        :title="field.title" 
        @click="checkValue" 
        :style="{ 
          background: field.btn.bg?field.btn.bg:'',
          borderColor:field.btn.bd?field.btn.bd:'',
          color:field.btn.fc?field.btn.fc:''
        }"
      >
        <i :class="[field.btn?field.btn.btnIcon:'']"></i>
        {{field.value}}
      </a>
    </template>
    </span>
</template>

<script>
import Constant from "@/Constant.js";
import { constants } from 'crypto';
export default {
  name: "o-button",
  props: ["id"],
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      let data = {
        bg:'', //背景色
        btnIcon: '', //图标
        bd:'' //边框颜色
      }
      let currentColor = '';
      switch(formData.activity.type) {
        case 1: //载入视图
          data = {
            bg:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 2: //创建
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'createBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 3: //删除
          data = {
            bg: currentColor?currentColor:'#d9534f',
            btnIcon: 'deleteBtnicon',
            bd: currentColor?currentColor:'#d9534f',
          };
          formData.btn = data;
          return formData;
          break;
        case 4: //保存并启动流程
          break;
        case 5: //流程处理
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'submitflowicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 8: //关闭窗口
          data = {
            bg: currentColor?currentColor:'#f0ad4e',
            btnIcon: 'closeWindowBtnicon',
            bd: currentColor?currentColor:'#f0ad4e',
          };
          formData.btn = data;
          return formData;
          break;
        case 10: //返回
          data = {
            bg: currentColor?currentColor:'#fff',
            btnIcon: 'backBtnicon',
            bd: currentColor?currentColor:'#ccc',
            fc:'#000',
          };
          formData.btn = data;
          return formData;
          break;
        case 11: //保存并返回
          data = {
            bg: currentColor?currentColor:'#5cb85c',
            btnIcon: 'saveBackBtnicon',
            bd: currentColor?currentColor:'#5cb85c',
          };
          formData.btn = data;
          return formData;
          break;
        case 13: //无
          data = {
            bg: currentColor?currentColor:'#fff',
            btnIcon: 'noneBtnicon',
            bd: currentColor?currentColor:'#ccc',
            fc:'#000',
          };
          formData.btn = data;
          return formData;
          break;
        case 14: //网页打印(表单)
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'htmlPrintBtnicon',
            bd: currentColor?currentColor:'#5bc0de',
          };
          formData.btn = data;
          return formData;
          break;
        case 15: //网页打印含历史
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'htmlPrintWithHisBtnicon',
            bd: currentColor?currentColor:'#5bc0de',
          };
          formData.btn = data;
          return formData;
          break;
        case 16: //导出excel
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'exportToExcelBtnicon',
            bd: currentColor?currentColor:'#5bc0de',
          };
          formData.btn = data;
          return formData;
          break;
        case 19: //保存草稿不校检
          data = {
            bg: currentColor?currentColor:'#5cb85c',
            btnIcon: 'saveWithoutValidateBtnicon',
            bd: currentColor?currentColor:'#5cb85c',
          };
          formData.btn = data;
          return formData;
          break;
        case 18: //清空所有数据
          data = {
            bg: currentColor?currentColor:'#d9534f',
            btnIcon: 'clearAllBtnicon',
            bd: currentColor?currentColor:'#d9534f',
          };
          formData.btn = data;
          return formData;
          break;
        case 20: //批量提交
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'batchApproveBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 21: //保存并复制
          data = {
            bg: currentColor?currentColor:'#5cb85c',
            btnIcon: 'saveCopyBtnicon',
            bd: currentColor?currentColor:'#5cb85c',
          };
          formData.btn = data;
          return formData;
          break;
        case 25: //PDF导出
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'exportToPdfBtnicon',
            bd: currentColor?currentColor:'#5bc0de',
          };
          formData.btn = data;
          return formData;
          break;
        case 26: //文件下载
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'fileDownloadBtnicon',
            bd: currentColor?currentColor:'#5bc0de',
          };
          formData.btn = data;
          return formData;
          break;
        case 27: //导入excel
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'excelImportBtnicon',
            bd: currentColor?currentColor:'#5bc0de',
          };
          formData.btn = data;
          return formData;
          break;
        case 28: //电子签章
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'signatureBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 29: //批量签章
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'batchSignatureBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 33: //流程启动
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 34: //保存
           data = {
            bg: currentColor?currentColor:'#5cb85c',
            btnIcon: 'saveBtnicon',
            bd: currentColor?currentColor:'#5cb85c'
          };
          formData.btn = data;
          return formData;
          break;
        case 36: //网页打印(视图)
          data = {
            bg: currentColor?currentColor:'#5bc0de',
            btnIcon: 'printViewBtnicon',
            bd: currentColor?currentColor:'#5bc0de'
          };
          formData.btn = data;
          return formData;
          break;
        case 37: //邮件短信分享
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 42: //保存并新建
          data = {
            bg: currentColor?currentColor:'#5cb85c',
            btnIcon: 'saveNewBtnicon',
            bd: currentColor?currentColor:'#5cb85c',
          };
          formData.btn = data;
          return formData;
          break;
        case 43: //跳转
          data = {
            bg: currentColor?currentColor:'#f0ad4e',
            btnIcon: 'jumpToBtnicon',
            bd: currentColor?currentColor:'#f0ad4e'
          };
          formData.btn = data;
          return formData;
          break;
        case 45: //归档
          data = {
            bg: currentColor?currentColor:'#fff',
            btnIcon: '',
            bd: currentColor?currentColor:'#ccc',
            fc:'#000',
          };
          formData.btn = data;
          return formData;
          break;
        case 46: //签章
          data = {
            bg: currentColor?currentColor:'#fff',
            btnIcon: '',
            bd: currentColor?currentColor:'#ccc',
            fc:'#000',
          };
          formData.btn = data;
          return formData;
          break;
        case 47: //回退流程
           data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 48: //催办流程
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 49: //挂起流程
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 50: //恢复流程
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 51: //回撤流程
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 52: //终止流程
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 53: //编辑流程审批人
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 54: //调整流程
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 55: //点评
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 56: //补签
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 57: //加签主办
          data = {
            bg: currentColor?currentColor:'#337ab7',
            btnIcon: 'queryBtnicon',
            bd: currentColor?currentColor:'#337ab7',
          };
          formData.btn = data;
          return formData;
          break;
        case 58: //加签协办
        default:
          return formData;
          break;
      }



      // return this.$parent.findField(this.id);
    }
  },
  data: function() {
    return { 
      Constant,
    };
  },
  methods: {
    checkValue(){
      // if(this.field.activityType == 34) {
      //   //校验保存
      //   return this.$parent.$parent.doSave();
      // }else if(this.field.activityType == 14){
      //   //
      //   this.$parent.$parent.printForm();
      // }
      console.log("按钮的id");
      console.log(this.field)
      let divId = this.field.divId;
      let refreshOnChanged = this.field.refreshOnChanged;
      let id = this.id;
      let activityType = this.field.activityType;
      if(this.$parent.$parent.runBeforeAction) {
        this.$parent.$parent.runBeforeAction(divId, refreshOnChanged, id, activityType);
      }else if(this.$parent.$parent.$parent.runBeforeAction) {
        this.$parent.$parent.$parent.runBeforeAction(divId, refreshOnChanged, id, activityType);
      }
      
      // switch (activityType) {
      //   case 34: //校验（保存）数据
      //     this.$parent.$parent.doSave();
      //     break;
      //   case 14: //打印
      //     this.$parent.$parent.printForm();
      //     break;
      //   case 13:
      //     this.$parent.$parent.runBeforeAction(divId, refreshOnChanged, id, activityType);
      //     break;
      //   default:
      //       break;
      // }
    },
  }
};
</script>