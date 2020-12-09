<template>
  <span class="view-dialog">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <input type="hidden" v-model="field.value" />
      <span>{{field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
    <!-- 可编辑 -->
      <el-button @click="onBtnClick">
        {{field.caption==""?"...":field.caption}}
      </el-button>
      <!-- <el-dialog 
        title="选择" 
        :visible.sync="dialogVisible" 
        v-if="dialogVisible"
        :width="field.maximization?'98%':field.divWidth.indexOf('px')>-1?field.divWidth:field.divWidth+'px'" 
        :height="field.maximization?'98%':field.divHeight+'px'" 
        :class="field.maximization?'abow_dialog':'usual_dialog' "
        :before-close="handleClose"> -->
        <el-dialog 
          title="选择" 
          :visible.sync="dialogVisible" 
          v-if="dialogVisible"
          :width="field.maximization?'98%':dialogWidth"
          :height="field.maximization?'98%':dialogHidth"
          :class="field.maximization?'abow_dialog':'' "
          :before-close="handleClose">
          <div :style="{height: dialogHidth}">
            <view_delegate 
              :openParams="params" 
              :clearCheckboxVal="clearCheckboxV" 
              :mutil="field.mutil" 
              :selectOne="field.selectOne" 
              :isView = 'isView'
              :allowOpenDoc = 'field.allow' 
              :selectedRows = "selectedRows"
              v-bind="$attrs"
              v-on="$listeners"
              @updateViewData="checkboxVal"
              @openDoc="openDoc"
            />  
          </div>
        <span 
          slot="footer" 
          class="dialog-footer" 
          v-if="field.selectOne || field.mutil"
        >
          {{field.divWidth}}
          <el-button @click="clearCheckbox">清除</el-button>
          <el-button type="primary" @click="onOk">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <el-button 
        disabled 
        @click="onBtnClick"
      >
        {{field.caption==""?"...":field.caption}}
      </el-button>
    </template>  
    <el-dialog 
      title="新建" 
      v-if="popupVisible" 
      :append-to-body="true"
      :visible.sync="popupVisible" 
      top="10px" 
      :lock-scroll="true"
      width="80%" 
      :before-close="handleDocumentClose"
    >
      <form_normalform
        :openParams="documentData" 
      />
    </el-dialog>
    

    <!-- <el-button type="text" @click="dialog = true">点击打开 Dialog</el-button> -->

    <!-- <el-dialog
      title="提示"
      :visible.sync="dialog"
      :width="field.maximization?'98%':dialogWidth"
    >
      <div :style="{height: dialogHidth}">
        <view_delegate 
              :openParams="params" 
              :clearCheckboxVal="clearCheckboxV" 
              :mutil="field.mutil" 
              :selectOne="field.selectOne" 
              :isView = 'isView'
              :allowOpenDoc = 'field.allow' 
              :selectedRows = "selectedRows"
              v-bind="$attrs"
              v-on="$listeners"
              @updateViewData="checkboxVal"
              @openDoc="openDoc"
            />  
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </span>
</template>

<script>

import Constant from "@/Constant.js";
import API from "@/api.js";
import view_delegate from "@/components/view_delegate.vue";
import form_normalform from "@/components/form_normalform.vue";
export default {
  name: "o-view-dialog",
  props: ["id", "appId"],
  components: {
    view_delegate,
    form_normalform,
  },
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.divWidth) {
        if(formData.divWidth.indexOf('px') > -1) {
          this.dialogWidth = formData.divWidth;
        }else if(formData.divWidth.indexOf('%') > -1) {
          this.dialogWidth = formData.divWidth;
        }else {
          this.dialogWidth = formData.divWidth + 'px';
        }
      }
      if(formData.divHeight) {
        let screen = document.documentElement.clientHeight;
        let h = ''
        if(formData.divHeight.indexOf('px') > -1) {
          h = formData.divHeight.split('px')[0];
          this.dialogHidth = parseInt(h) - 124 + 'px';
        }else if(formData.divHeight.indexOf('%') > -1) {
          h = formData.divHeight;
          let num = h.split("%")[0];
          let he = screen * parseInt(num) / 100;
          this.dialogHidth = he - 124 + 'px';
        }else {
          this.dialogHidth = parseInt(formData.divHeight) - 124 + 'px';
        }
      }else {
        let screen = document.documentElement.clientHeight;
        this.dialogHidth = screen/2 + 'px';
      }
      return this.$parent.findField(this.id);
    },
    params: function() {
      let appId = this.$root.appid;
      return {
        appId: appId,
        actionContent: this.field.dialogView
      };
    },
  },
  data: function() {
    return { 
      dialog: false,
      Constant, 
      dialogVisible: false,
      items:{}, 
      checkboxParams:{},
      newRow:{},
      clearCheckboxV:false,
      selectedValArr:[],
      allParams:[],
      selectedDocIdNum:'',
      isView:true,
      popupVisible:false,
      documentData:'',
      selectedRows:'',
      dialogWidth:'',
      dialogHidth:'',
    };
  },
  methods: {
    dianji(){
      console.log("--------width->",document.documentElement.clientWidth);
      console.log("--------height->",document.documentElement.clientHeight);
    },
    openDoc(params) {
      console.log("打开文档---->",)
      this.documentData = params;
      this.popupVisible = true;

    },
    onBtnClick() {
      this.dialogVisible = true;
    },
    handleDocumentClose() {
      this.popupVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onOk() {
      this.doAction();
    },
    //清除多选框的值
    clearCheckbox(){
      this.clearCheckboxV = parseInt(Math.random()*100+1)+new Date();
    },
    checkboxVal(params, arrRow, isRadio) {//多选时的值
      this.selectedDocIdNum = arrRow;
      let selectedVal = [];
      if(this.field.mapping && this.field.mapping.length > 0) {
        let mapping = this.field.mapping;
        arrRow.forEach( row => {
          for(let item in row) {
            for(let i=0; i<mapping.length; i++) {
              if(item == mapping[i].id) {
                let obj = {};
                obj.id = item;
                obj.value = row[item];
                selectedVal.push(obj);
              }
            }
          }
        })
        let result=[];
        let obj={};
        for(let i=0; i<selectedVal.length; i++) {
          if(!obj[selectedVal[i].id])
          {
            result.push(selectedVal[i]);
            obj[selectedVal[i].id]=true;
          }else {
            if(result.length > 0 ) {
              for(let j=0; j<result.length; j++) {
                if(result[j].id == selectedVal[i].id) {
                  result[j].value = result[j].value + ";" + selectedVal[i].value;
                }
              }
            }
          }
        }
        this.selectedValArr = result;
        this.allParams = params
        if(isRadio) {
          this.doAction();
        }
      // let allVal = '';
      // let newRow = {};
      // let selectVal = this.field.mapping[0];//点击弹出框时选中的单行文本框
      // for(let i=0; i<row.length; i++) {
      //   for(let key in row[i]) {
      //     if(selectVal.id == key) {
      //       allVal += row[i][selectVal.id]+";";
      //     }
      //   }
      // }
      // newRow[selectVal.id] = allVal;
      // this.checkboxParams = params;
      // this.newRow = newRow;
      }
    },
    doAction(){
      //单选
      if(this.selectedDocIdNum.length > 0) {
        this.selectedRows = this.selectedDocIdNum;
        let docId = this.field.docId;
        let inputIdAndName = [] //id+name
        if(this.field.mapping && this.field.mapping.length > 0) {
          let mapping = this.field.mapping;
          for(let i=0; i<mapping.length; i++) {
            for(let j=0; j<this.selectedValArr.length; j++) {
              let obj = {};
              if(mapping[i].id == this.selectedValArr[j].id) {
                obj.id =  docId+"_" + mapping[i].value;
                obj.value = this.selectedValArr[j].value;
                inputIdAndName.push(obj);
              }
            }
          }
        }
        let doc;
        if(this.$parent.findField) {
          inputIdAndName.forEach(item => {
            this.$parent.findField(item.id).value = item.value;
          });
          if(this.$parent.$parent.buildFormData) {
            doc = this.$parent.$parent.buildFormData();
          }else if(this.$parent.$parent.$parent.$parent.$parent.$parent.buildFormData) {
            doc = this.$parent.$parent.$parent.$parent.$parent.$parent.buildFormData();
          }
          
        }else if (this.$parent.$parent.findField) {  //选项卡
          let fieldData = this.$parent.$parent.findField();
          fieldData.fields.forEach(items => {
            if(items.tabs) {
              items.tabs.forEach(item => {
                if(item.fields && item.fields.length > 0) {
                  item.fields.forEach(el => {
                    if(el.id == inputIdAndName) {
                      el.value = selectedVal
                    }
                  })
                }
              })
            }
          });
          doc = this.$parent.$parent.buildFormData();
        }

        let allData = {
          docId: this.field.docId,
          document:doc,
          fieldId: this.field.divId,
          formId: this.field.formId,
          viewId: this.field.dialogView,
          _selects: this.allParams._select,
        }
        API.runViewDialogConfirmScript(allData, {
          onSucess: response => {
            if (response.data.data && response.data.data != "false") {
              this.$message({
                message: response.data.data,
                type: 'error'
              });
            } else if (response.data.data == "false") {
              this.dialogVisible = false;
              this.$message({
                message: response.data.data,
                type: 'error'
              });
            } else if (!response.data.data && response.data.errmsg == "ok") {
              API.runViewDialogCallbackScript(allData, {
                onSucess: response => {
                  if (response.data.errmsg == "ok") {
                    if (this.field.refreshOnChanged) {
                      //刷新
                      if(this.$parent.refresh) {
                        this.$parent.refresh(this.field.id);
                      }else if (this.$parent.$parent.refresh) {
                        this.$parent.$parent.refresh(this.field.id)
                      }
                    }
                    this.dialogVisible = false;
                  }
                }
              });
            }
          }
        });
      }else {
        this.selectedDocIdNum = '';
        this.dialogVisible = false;
      }




      // let itemsData = this.$parent.$parent.buildFormData().items;
      // let items = {};
      // for (let key in itemsData) {//获取单行文本框属性名
      //   if(itemsData[key] != undefined){
      //     items[key] = itemsData[key];
      //   }
      // }
      // delete items.button_act;//删除属性
      // delete items.undefined;
      // let selectVal = this.field.mapping[0];//点击弹出框时选中的单行文本框
      // let currentInputName = '';//每个按钮对应的当前文本框的名字
      // let showInputVal = ''; //选中时展示在输入框中的值
      // for(let key in items) {
      //   if(selectVal.value == key) {
      //     items[key] = row[selectVal.id]
      //     currentInputName = key;
      //     showInputVal = items[key];
      //   }
      // }
      // let docId = this.field.docId;
      // let inputIdAndName = docId+"_"+currentInputName;//id+name
      // this.$parent.findField(inputIdAndName).value = showInputVal;//显示值到文本框
      // let isOrRefresh =  this.field.refreshOnChanged;
      // let applicationId = params.appId;
      // console.log("formid-->");
      // let formId = this.field.formId;
      // let id = this.$parent.$parent.getDocId();
      // let fieldId = this.field.divId;
      // let viewId = params.viewId;
      // let _selects = params._select;
      // let allData = {
      //       "document": {
      //           "applicationId":applicationId,
      //           "formId":formId,
      //           "id":id,
      //           "items":items,
      //           "parentId": "",
      //           "sign": "",
      //           "subDocuments": [],
      //           "versions": "0",
      //       },
      //       "fieldId": fieldId,
      //       "viewId": viewId,
      //       "_selects":_selects,
      //     };
      // API.runViewDialogConfirmScript(
      //   allData,
      //   {
      //     onSucess: response => {
      //       console.log("返回的值");
      //       if(response.data.data && response.data.data !="false") {
      //         alert(response.data.data);
      //       }else if(response.data.data == "false") {
      //         alert(response.data.data);
      //         this.dialogVisible = false;
      //       }else if(!response.data.data && response.data.errmsg == "ok") {
      //         console.log("其他项");
      //         API.runViewDialogCallbackScript(
      //           allData,
      //           {
      //             onSucess: response => {
      //               if(response.data.errmsg == "ok"){
      //                 if(isOrRefresh){
      //                   //刷新
      //                   this.$parent.refresh(this.field.id);
      //                 }
      //                 this.dialogVisible = false;
      //               }
      //             }
      //           }
      //         );
      //       }
      //     }
      //   }
      // );
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
