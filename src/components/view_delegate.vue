<template>
  <div class="delegate" ref="viewDelegate" :id="'delegate_'+openParams.actionContent">
    <div 
      class="act-btns" 
      v-if="!isView && 
        view.openType != 288 && 
        view.simpleClassName != 'TreeView' && 
        view.simpleClassName != 'MapView' &&
        view.simpleClassName != 'CalendarView' &&
        showtype!='home'"
      >
      <activity 
        v-for="activity in view.activities" 
        :key="activity.id" 
        :info="activity"
        @action="onAction" 
      />
      <!-- <router-link target="_blank" :to="{path:'/test',query:{id:'1'}}">新页面打开home页</router-link> -->
    </div>
    <!-- <el-divider v-if="showtype!='home'"></el-divider> -->
    <component
      ref="delegate"
      :is="viewType" 
      :view="view"
      :openParams="openParams" 
      :clearCheckboxVal="clearCheckboxVal" 
      :mutil="mutil" 
      :selectOne="selectOne"
      :showtype="showtype"
      :isView = 'isView'
      :allowOpenDoc = "allowOpenDoc"
      :delegateWidth = "delegateWidth"
      v-bind="$attrs"
      v-on="$listeners"
      v-if="isRouterAliveInclude"
      @updateView="updateView"
      @action="closeDialog" 
      @deleted="doRemove"
      @getDocIds="setDocIds"
    >
    </component>

    <el-dialog 
      title="新建" 
      v-if="dialogVisible" 
      :append-to-body="true"
      :visible.sync="dialogVisible" 
      top="10px" 
      :lock-scroll="true"
      width="80%" 
      :before-close="handleClose"
    >
      <form_normalform
        :openParams="newIncludeO"
        @action="closeDialog" 
      />
    </el-dialog>

    <el-dialog 
      title="消息" 
      :visible.sync="popupVisible" 
      :close-on-click-modal="false"
    >
      <div class="bulk-submission">
        <div class="text">
          请输入审批<br/>意见:
        </div>
        <div class="textarea">
          <el-input
            type="textarea"
            rows="8"
            placeholder="请输入内容"
            v-model="attitude">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="popupVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="onOk" size="small">确 定</el-button>
      </span>
    </el-dialog>
    
    <customDialog
      :title="title"
      :width="width"
      v-if="customizeVisible"
      :visible.sync="customizeVisible"
      :lock-scroll="true"
    >
      <excelUpload 
        slot="body"
        :viewId="view.id"
        :act="act"
        @event="hiddenCustomizeVisible"
      />
    </customDialog>
    <div v-show="isPrint">
      <div v-if="printParams">
        <div id="print">
          <div class="view-print">
            <view_listview :openParams="openParams" v-if="viewPrintData" :view="viewPrintData" />
          </div>
          <!-- <view_print v-if="printParams" :openParams="openParams" :printParams="printParams"/> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/api.js";
import view_emptyview from "@/components/view_emptyview.vue";
import view_listview from "@/components/view_listview.vue";
import view_gridview from "@/components/view_gridview.vue";
import view_mapview from "@/components/view_mapview.vue";
import view_treeview from "@/components/view_treeview.vue";
import view_collapsibleview from "@/components/view_collapsibleview.vue";
import view_calendarview from "@/components/view_calendarview.vue";
import activity from "@/components/activity.vue";
import form_normalform from "@/components/form_normalform.vue";
import customDialog from "@/components/dialog.vue";
import excelUpload from "@/components/excel_upload.vue";
import Watermark from '@/assets/js/watermark';  //路径不要写错
import view_print from "@/components/view_print";

export default {
  name: "view-delegate",
  props: [
    "openParams",
    "clearCheckboxVal",
    "mutil", 
    "selectOne", 
    "isView",
    "showtype",
    "allowOpenDoc",
    "toTab"
  ],
  created: function() {
    this.initView({
      appId: this.openParams.appId,
      viewId: this.openParams.actionContent,
      data: {}
    });
  },

  mounted: function () {
    
  },

  components: {
    view_emptyview,
    view_listview,
    view_gridview,
    view_treeview,
    view_mapview,
    view_collapsibleview,
    view_calendarview,
    activity,
    form_normalform,
    customDialog,
    excelUpload,
    view_print,
  },
  data: function() {
    return {
      view: { columns: [] },
      loading:true,
      title:'',
      newIncludeO:'',
      dialogVisible:false,
      isRouterAliveInclude: true,
      currentOpenType:'',
      currentDocIds:[],
      popupVisible:false,
      attitude:'',
      currentAct:'',
      customizeVisible:false,
      width:'40%',
      excelPath:'',
      act:'',
      isPrint:false,
      printParams:'',
      viewPrintData:'',
      delegateWidth:'',
      isSubmissionProcess:'', //是否是视图列的提交流程
      viewRowId:'', //视图列的提交流程docId
    };
  },
  methods: {
    updateView() {
      this.isRouterAliveInclude = false;
      this.$nextTick(() => (this.isRouterAliveInclude = true));
    },
    hiddenCustomizeVisible() {
      this.customizeVisible = false;
      this.isRouterAliveInclude = false;
      this.$nextTick(() => (this.isRouterAliveInclude = true));
    },
    setExcelPath(path) {
      this.excelPath = path;
    },
    //批量提交或者提交流程
    onOk() {
      if(this.isSubmissionProcess) {
        let obj = {
          approveLimit: "",
          attitude: this.attitude,
          docId: this.viewRowId
        }
        this.$api.operateSubmit(
          this.$root.appid,
          this.view.id,
          obj,
          {
            onSucess: res => {
              this.popupVisible = false;
              if(res.data.errcode == 0) {
                this.$notify({
                  title: res.data.data,
                  message: '',
                  type: 'success'
                });
              }else {
                this.$notify.error({
                  title: '错误',
                  message: ''
                });
              }
            }
          }
        )
      }else {
        this.runBeforeAction(this.currentAct,this.currentDocIds)
      }
      
    },
    handleClose() {
      this.dialogVisible = false;
    },
    closeDialog() {
      this.includeReload();
      this.dialogVisible = false;
    },
    includeReload () { //重新刷新组件刷新
      this.$emit("change");
      this.isRouterAliveInclude = false
      this.$nextTick(() => (this.isRouterAliveInclude = true));
    },
    initView({ appId, viewId, exparams}) {
      this.$api.getViewTemplate(appId, viewId, exparams, {
        onSucess: response => {
          if (response.data.data) {
            //this.view = response.data.data;
            console.log("this.viewd--->",this.$refs.viewDelegate.clientWidth);
            this.delegateWidth = this.$refs.viewDelegate.clientWidth;
            let viewData = response.data.data;
            viewData.columns.forEach((item,index) => {
              if(item.iconMapping) {
                viewData.columns[index].iconMapping = JSON.parse(item.iconMapping)
              }
            });
            this.view = viewData;
            this.title =
              response.data.data.description || response.data.data.name;
            this.currentOpenType = response.data.data.openType
            if(this.view.waterMarkText) {
              // console.log("this.view.waterMarkText---->",this.view.waterMarkText);
              let val =response.data.data.waterMarkText;
              let id = 'delegate_' + this.openParams.actionContent;
              Watermark.set(val, id);
            }
          }
        }
      });
      // if (!this.view.data) {
      //   API.getViewTemplate(appId, viewId, exparams, {
      //     onSucess: response => {
      //       if (response.data.data) {
      //         this.view = response.data.data;
      //         API.getViewData(appId, viewId, exparams ? exparams : {}, data, {
      //           onSucess: response => {
      //             this.loading = false;
      //             let viewData = response.data;
      //             this.$set(this.view, "data", viewData.data);
      //           }
      //         });
      //       }
      //     }
      //   });
      // } else {
      //   API.getViewData(appId, viewId, exparams ? exparams : {}, data, {
      //     onSucess: response => {
      //       this.loading = false;
      //       let viewData = response.data;
      //       this.$set(this.view, "data", viewData.data);
      //     }
      //   });
      // }
    },

    openForm(params) {
      this.newIncludeO = params;
      this.dialogVisible = true;
    },

    //创建新表单
    doCreate(act) {
      //this.$emit("add-tab"); //标签栏新增
      if(this.$parent.doAction) {
        if(this.view.openType == 277) {
          let params = {
            linkType: "00",
            appId: this.openParams.appId,
            active: true,
            actionContent: act.onActionForm,
            name: this.view.name,
            refreshId:this.openParams.id,
            type: 277,
          };
          this.newIncludeO = params;
          this.dialogVisible = true;
        }else {
          this.$emit("add-tab", {
            linkType: "00",
            appId: this.openParams.appId,
            active: true,
            actionContent: act.onActionForm,
            name: this.view.name,
            refreshId:this.openParams.id,
          });
        }
         //打开普通视图
        // this.$parent.doAction({
        //   linkType: "00",
        //   appId: this.openParams.appId,
        //   active: true,
        //   actionContent: act.onActionForm
        // });
      }else {
        if(this.showtype == 'include') {
          let params = {
            linkType: "00",
            appId: this.$root.appid,
            actionContent: act.onActionForm,
            parentId:this.openParams.parentId?this.openParams.parentId:'',  //包含元素时判断是否有parentId
            isRelate:this.openParams.isRelate?this.openParams.isRelate:'', 
            isIncludeCreate:"include"
          };
          if(this.currentOpenType == 277) {
            this.newIncludeO = params;
            this.dialogVisible = true;
          }else if(this.currentOpenType == 1) {
            this.$refs.delegate.addRow(params);
          }
          
        }else if(this.showtype == 'tab') {
          this.toTab({
            linkType: "00",
            appId: this.openParams.appId,
            active: true,
            actionContent: act.onActionForm,
            name: this.view.name,
          });
          


          // this.$parent.toTab({
          //   linkType: "00",
          //   appId: this.openParams.appId,
          //   active: true,
          //   actionContent: act.onActionForm,
          //   name: this.view.name,
          // });
        }
        
      }

      //执行后脚本有可能顺序不对
      this.runAfterAction(act)
      
    },

    //删除
    doRemove(act, value) {
      let docIds = '';
      if(this.currentDocIds && this.currentDocIds.length > 0) {
        docIds = this.currentDocIds;
      }else { //树形视图时
        docIds = value;
      }
      if(docIds && docIds.length > 0) {
        this.$confirm(`是否需删除${docIds.length}数据`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.runBeforeAction(act);
        }).then(() => {
          this.$api.batchRemoveDocuments(this.$root.appid, docIds, {
            onSucess: (res) => {
              if(res.data.errcode == 0) {
                this.$notify({
                  title:'成功',
                  message:'',
                  type: 'success'

                })
                this.runAfterAction(act)
                this.includeReload();
              }
            }
          });
        }).catch(() => {
                  
        });
      }else {
        this.$confirm(`请选择至少一条数据`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
        }).catch(() => {
                  
        });
      }
    },

    setDocIds(val) {
      this.currentDocIds = val
    },

    //是否清空所有数据的弹窗
    clearDataPopup(data) {
      this.$confirm(`是否需删除所有数据`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.runBeforeAction(data);
      }).catch(() => {
                
      });
    },
    
    clearAllData(act) {
      let appId = this.$root.appid;
      let formId = this.view.relatedForm;
      this.$api.deleteAllData(appId, formId, {
        onSucess: res => {
          if(res.data.errcode == 0) {
            this.runAfterAction(act);
            this.includeReload();
          }
        }
      })
    },

    //执行脚本前
    runBeforeAction(act, docIds){
      let formData = {
        docId: "",
        document: {},
        formId: this.view.relatedForm,
        parentId: "",
        templateForm: this.view.templateForm,
        viewId: this.openParams.actionContent,
        _selects: docIds && docIds.length>0 ? docIds : [],
      }
      let divId = act.id;
      let actType = act.type;
      this.$api.runBeforeActionScript(this.$root.appid, divId, formData, actType,{
        onSucess: response => {
          if(response.data.errcode == 0 && response.data.data) {
            let errcode = response.data.errcode;
            let errmsg = response.data.data.content;
            this.$notify.error({
              title: errmsg,
              message: ''
            });
          }else if(response.data.errcode == 0){
            if(act.type == 2){
              this.doCreate(act);
            }else if (act.type == 18) {
              this.clearAllData(act);
            }else if(act.type == 1){
              this.getTemplate(act);
            }else if(act.type == 16) {
              this.getExcel(act);
            }else if(act.type == 20) {
              this.onSubmit(act, docIds);
            }else if (act.type == 26) {
              this.fileDownload(act.id);
            }else if (act.type == 36) {
              this.viewPrint(act);
            }
          }
        }
      });
    },
    
     //执行脚本后
    runAfterAction(act, docIds) {
      let formData = {
        docId: "",
        document: {},
        formId: this.view.relatedForm,
        parentId: "",
        templateForm: "",
        viewId: this.openParams.actionContent,
        _selects: docIds && docIds.length>0 ? docIds : [],
      }
      let appId = this.$root.appid;
      let divId = act.id;
      let docId = '';
      let parentId = '';
      let _templateForm = '';
      let _ = '';
      this.$api.runAfterActionScript(
        appId,
        divId,
        docId,
        this.openParams.actionContent,
        this.view.relatedForm,
        _templateForm,
        parentId,
        _,
        formData,
        {
          onSucess: response => {
            if(response.data.errcode == 0) {
              if(response.data.data.content) {
                let errmsg = response.data.data.content.content;
                this.$notify({
                  title: errmsg,
                  message: '',
                  type: 'warning'
                });
              }else {
                if(act.type == 20) {
                  this.popupVisible = false;
                }
              }
            }
          }
        }
      );
    },

    //提交
    onSubmit(act, docIds) {
      let attitude = this.attitude;
      let appId = this.$root.appid;
      let doJson = {
        actId:act.id,
        attitude,
        docIds:docIds,
        limistStrList:'',
        remark: '',
      }
      this.$api.batchApprove(appId, doJson, {
        onSucess: response => {
          if(response.data.errcode==0) {
            this.$notify.error({
              title: '错误',
              message: response.data.data.content,
            });
            this.runAfterAction(act, docIds);
          }else if(response.data.errcode==4001){
            this.$notify.error({
              title: '错误',
              message:  response.data.errmsg,
            });
          }
        }
      });
    },


    getTemplate(act){
      this.view = '';
      let appId = this.$root.appid;
      let viewId = act.onActionView;
      let exparams = "";
      this.$api.getViewTemplate(appId, viewId, exparams, {
        onSucess: response => {
          this.view = response.data.data;
        }
      })
    },

    //批量提交按钮弹窗
    showSubmitPanel(act) {
      if(this.currentDocIds && this.currentDocIds.length>0) {
        this.currentAct = act;
        this.popupVisible = true;
      }else {
        this.$alert('请选择至少一条数据', '提示', {
          confirmButtonText: '确定',
          callback: () => {
          }
        });
      }
    },

     //文件下载
    fileDownload(divId){
      let appId = this.$root.appid;
      let docId = this.view.relatedForm;
      let actId = divId;
      API.documentDownload(
        appId,
        docId,
        actId,
        {
          onSucess: response => {
            console.log("文件下载");
            console.log(response);
            let fileName = "";
            let type = response.headers['content-type'];
            if(response.headers['content-disposition']) {
              fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
            }else {
              fileName="下载";
            }
            this.download(response, type, fileName);
          }
        }
      )
    },
    download(res, type, filename){
        const blob = new Blob([res.data], {
          // 如果后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
          type: type
        });
        const a = document.createElement('a');
        const herf = window.URL.createObjectURL(blob);
        // 下载链接
        a.href = herf;
        // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(herf);
    },

    //Excel导出
    getExcel(act) {
      let applicationId = this.$root.appid,
          viewId = this.view.id,
          actId = act.id,
          name = this.view.name,
          isExpSub = act.expSub,
          parentId = '',
          isRelate = undefined;
      let params = this.$refs.delegate.getExcelParams();
      this.$api.exportExcel(
        applicationId,
        viewId,
        actId,
        name,
        isExpSub,
        parentId,
        isRelate,
        params,
        {
          onSucess: response => {
            console.log("response----->",response);
            let fileName = "";
            let type = response.headers['content-type'];
            if(response.headers['content-disposition']) {
              fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
              let suffix = fileName.split(".")[1]
              fileName = name + "." + suffix;
            }else {
              fileName="下载";
            }
            this.download(response, type, fileName);
          }
        }
      )
    },


    //网页打印
    viewPrint(act) {
      let routeData = this.$router.resolve({
        name: "printView",
        query: {
          viewId: this.view.id,
          isPrint: true,
        }
      });
      window.open(routeData.href, '_blank');


      // let obj = {
      //   viewId: this.view.id,
      //   isPrint: true,
      // }
      // this.printParams = obj;
      // let appId = this.$root.appid;
      // let viewId = this.printParams.viewId;
      // this.$api.getPrintViewTemplate(appId, viewId, this.printParams.isPrint, {
      //   onSucess: response => {
      //     this.viewPrintData = response.data.data;
      //     if(this.viewPrintData) {
      //       setTimeout( ()=> {
      //         let newWindow = window.open('_blank');  
      //         let codestr = document.getElementById('print').innerHTML;  
      //         newWindow.document.write(codestr);  
      //         newWindow.document.close();
      //         setTimeout( ()=> {
      //           newWindow.print();
      //         }, 100);
      //       }, 500);
      //     }
      //     // if(view) {
      //     //   this.$api.getViewData(
      //     //     //普通视图接口
      //     //     this.$root.appid,
      //     //     this.printParams.viewId,
      //     //     {
      //     //       parentId: "",
      //     //       currpage: 1,
      //     //       lines: 10,
      //     //       searchWord:'',
      //     //     },
      //     //     {},
      //     //     {
      //     //       onSucess: response => {
      //     //         debugger
      //     //         this.viewData = response.data.data
      //     //       }
      //     //     }
      //     //   );
      //     // }
      //   }
      // })




      // setTimeout( ()=> {
      //   let newWindow = window.open('_blank');   //  打开新窗口
      //   let codestr = document.getElementById('print').innerHTML;   //  获取需要生成pdf页面的div代码
      //   newWindow.document.write(codestr);   //  向文档写入HTML表达式或者JavaScript代码
      //   newWindow.document.close();     //  关闭document的输出流, 显示选定的数据
      //   // setTimeout( ()=> {
      //   //   newWindow.print();
      //   // }, 100);
      // }, 1000);

    },

    //视图提交流程打开弹窗
    viewColumnSubmission(val, docId){
      this.isSubmissionProcess = val;
      this.viewRowId = docId;
      this.popupVisible = true;
    },

    showLeadDialog(act) {
      this.act = act;
      this.customizeVisible = true;
    },

    onAction(act) {
      //绑定视图的处理事件
      let activityType = act.type;
      switch (act.type) {
        case 1: //载入视图
          this.runBeforeAction(act);
          break;
        case 2: //创建
          this.runBeforeAction(act);
          break;
        case 3: //删除
          this.doRemove(act);
          break;
        case 4: //保存并启动流程
          break;
        case 5: //流程处理
          this.$parent.flowHandle();
          break;
        case 8: //关闭窗口
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 10: //返回
          this.doBack();
          //this.$parent.goBack();
          break;
        case 11: //保存并返回
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 13: //无
          break;
        case 14: //网页打印(表单)
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 15: //网页打印含历史
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 16: //导出excel
          this.runBeforeAction(act);
          break;
        case 19: //保存草稿不校检
          //this.$parent.saveDraft();
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 18: //清空所有数据
          this.clearDataPopup(act)
          //this.runBeforeAction(act);
          break;
        case 20: //批量提交
          this.showSubmitPanel(act);
          break;
        case 21: //保存并复制
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 25: //PDF导出
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 26: //文件下载
          this.runBeforeAction(act);
          //this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 27: //导入excel
          this.showLeadDialog(act);
          break;
        case 28: //电子签章
          break;
        case 29: //批量签章
          break;
        case 33: //流程启动
          break;
        case 34: //保存
          //this.$parent.doSave();
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 36: //网页打印(视图)
          this.runBeforeAction(act);
          break;
        case 37: //邮件短信分享
          break;
        case 42: //保存并新建
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 43: //跳转
          break;
        case 45: //归档
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 46: //签章
          break;
        case 47: //回退流程
          break;
        case 48: //催办流程
          break;
        case 49: //挂起流程
          break;
        case 50: //恢复流程
          break;
        case 51: //回撤流程
          break;
        case 52: //终止流程
          break;
        case 53: //编辑流程审批人
          break;
        case 54: //调整流程
          break;
        case 55: //点评
          break;
        case 56: //补签
          break;
        case 57: //加签主办
          break;
        case 58: //加签协办
        default:
          break;
      }
    },

  },
  
  computed: {
    viewType() {
      //let type = "view_emptyview";
      let type = '';
      if (this.view) {
        switch (this.view.simpleClassName) {
          case "CollapsibleView": //折叠视图
            type = "view_collapsibleview";
            break;
          case "CalendarView": //日历视图
            type = "view_calendarview";
            break;
          case "TreeView": //树形视图
            type = "view_treeview";
            break;
          case "MapView": //树形视图
            type = "view_mapview";
            break;
          case "ListView": //列表视图
            if (this.view.openType == 288) {
              //网格打开
              type = "view_gridview";
            } else {
              //正常打开
              type = "view_listview";
            }
            break;
          default:
        }
      }
      return type;
    },
  }
};
</script>

<style lang="scss">

</style>