<template>
  <div class="formwrapper" id="formwrapper" v-loading="loading">
    <div class="formcontent" v-if="formdata.formTemplate && formdata.formTemplate.template != false">
      <div class="act-btns">
        <activity
          v-for="(activity,index) in formdata.activities" 
          :key="index" 
          :info="activity" 
          @action="onAction" 
        />
      </div>
      <div class="approvers">
        <approvers 
          v-if="formdata.stateId && isRouterAlive" 
          :approversData="formdata.approvers" 
          :stateId = "formdata.stateId"
          :flowinfo="{
            docid: this.formdata.docId, 
            approvers:formdata.approvers, 
            stateId:formdata.stateId
          }"
        />
      </div>
      
    </div>
    
    <div class="formTable" :id="'formTemplate_' + formTemplateDocid">
      <component 
        name="formTemplate" 
        :is="template" 
        ref="inputChild">
      </component>
      <el-dialog 
        title="打印" 
        v-if="showDialog == 1" 
        :visible.sync="dialogVisible" 
        top="10px" 
        :lock-scroll="true"
        width="67%" 
        :before-close="handleClose"
      >
        <div class="print-content">
          <div class="content-wrap" ref="print">
            <!--startprint-->
            <div id="print">
              <form_print 
                :printParams = "printParams"
                :printData = "printData"
              />
            </div>
            <!--endprint-->
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button 
            type="primary" 
            @click="printPage"
          >
            打印
          </el-button>
        </span>
      </el-dialog>
      
      <!--流程提交面板-->
      <!-- <el-dialog 
        title="流程" 
        v-if="showDialog == 2" 
        :visible.sync="dialogVisible" 
        top="10px" 
        :lock-scroll="true" 
        width="50%" 
        class="abow_dialog" 
        :before-close="handleClose"
      >
        <flow 
          :stateId="formdata.stateId" 
          :approversData="formdata.approvers" 
          :divId="divId"/>
      </el-dialog> -->

      <!--新版流程提交面板-->
      <flowDialog
        v-if="flowDialogVisible" 
        :visible.sync="flowDialogVisible"
        :type="flowProcessAct?flowProcessAct.type:''"
      >
        <form_flowpanel
          @click.stop.prevent
          slot="body"
          :stateId="formdata.stateId" 
          :act="flowProcessAct"
          :openParams = "openParams"
          :buildFormData="buildFormData()"
          :approverName = "approverName"
          :submitTo = "submitTo"
          :nextUserId = "nextUserId"
          :approvers = "formdata.approvers?formdata.approvers:''" 
          :subFlowApproverData = "subFlowApproverData"
          :subFlowGroup = "subFlowGroup"
          :newHostOrCohostList = "newHostOrCohostList"
          :cCname = "cCname"
          :subFlowGroupNum = "subFlowGroupNum"
          v-if="flowProcessAct.type == 5 || 
            flowProcessAct.type == 33 ||
            flowProcessAct.type == 47 ||
            flowProcessAct.type == 55 ||
            flowProcessAct.type == 56 ||
            flowProcessAct.type == 57 ||
            flowProcessAct.type == 58 ||
            flowProcessAct.type == 48"
          @action="designatedApprover"
          @closePopup="closeThePopup"
          @showSubFlow="showSubFlowDialog"
        />
      </flowDialog>

      <!--流程指定审批人弹窗-->
      <comm-dialog
        title="指定审批人"
        v-show="approverVisible"
        :visible.sync="approverVisible"
      >
        <form_selectApprover_flowpanel
          slot="body"
          :act="flowProcessAct"
          :openParams = "openParams"
          :buildFormData="buildFormData()"
          :approversObj = "approversObj"
          :submitTo = "submitTo"
          :flowId = "flowId"
          :isFreeFlow = "isFreeFlow"
          :saveApproverStatus="saveApproverStatus"
          :approverNumType="approverNumType"
          :isAppentCirculator="isAppentCirculator"
          :subFlowToApprover="subFlowToApprover"
          :groupNum="groupNum"
          :isSubFlow="isSubFlow"
          :allowEditApprover="allowEditApprover"
          :approvers = "formdata.approvers?formdata.approvers:''" 
          v-if = "approverVisible"
          @action = "selectApprover"
          @closeApproverDialog = "closeApproverDialog"
          @event = "subflowDataTopanel"
          @selectHostOrCohost = "selectHostOrCohost"
        />
      </comm-dialog>

      <!--终止流程-->
      <comm-dialog
        title="终止流程"
        v-show="terminationVisible"
        :visible.sync="terminationVisible"
      >
        <!--终止流程-->
        <form_termination_flowpanel
          slot="body"
          :stateId = "formdata.stateId" 
          :act="flowProcessAct"
          :openParams = "openParams"
          :buildFormData = "buildFormData()"
          v-if="flowProcessAct.type == 52"
          @action="terminationWorkflow"
        />
      </comm-dialog>
    </div>
  </div>
</template>
<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
import activity from "@/components/activity.vue";
import approvers from "@/components/approvers.vue";
import form_flowpanel from "@/components/form_flowpanel.vue";
import form_print from "@/components/form_print";
import flowDialog from "@/components/flow_dialog.vue";
import { Loading } from 'element-ui';
import form_selectApprover_flowpanel from "@/components/form_selectApprover_flowpanel.vue";
import form_termination_flowpanel from "@/components/form_termination_flowpanel.vue";
import Watermark from '@/assets/js/watermark';  //路径不要写错

//import { constants } from 'crypto';
import authority from "@/components/authority.vue"
export default {
  //inject: ["reload"],
  name: "form-normalform",
  props: [
    "openParams",
    "callback"
  ],

  components: {
    activity,
    approvers,
    form_flowpanel,
    form_print,
    flowDialog,
    form_selectApprover_flowpanel,
    form_termination_flowpanel,
    authority,
    flowId:'',
  },
  // created
  created: function() {
    this.initForm({
      appId: this.openParams.appId,
      formId: this.openParams.actionContent,
      //docId: this.openParams.docId  (9/03改)
      docId: this.openParams._select,
    });
  },

  data: function() {
    return {
      formdata: {},
      printData:'',
      isActive:false,
      hidden:true,
      inputId:'', 
      inputVal:'',
      inputCurrentInfo:'',
      inputCurrentVal:'',
      copyFormData:"",
      dialogVisible:false,
      isRouterAlive:true,
      showDialog:'',
      divId:'',
      loading:true,
      parameterObj:{}, //加签主办或者协办新添加的数据，由子组件form_selectHostOrCohost得到
      printParams:{},
      flowDialogVisible: false,

      flowProcessAct: {}, //流程处理按钮
      approverVisible: false,
      approverName: '',
      isFreeFlow:'', //判断是否是自由流程
      nextUserId:'', //自由流程的下一节点人
      submitTo: {}, 
      isAppentCirculator:'',
      approversObj: {}, //指定审批人参数
      saveApproverStatus:'',
      approverNumType:'', //判断指定审批人的用户选择框是单选还是多选。
      terminationVisible: false, //终止流程弹出
      groupNum:'',
      subFlowToApprover:[], //提交面板的子流程-并行流程数据保存到form_selectApprover_flowpanel
      isSubFlow:'',
      subFlowApproverData: '', //子流程选择的数据提交到流程面板
      subFlowGroup:'',  //子流程-并行流程数据保存到流程面板
      subFlowGroupNum:'',
      newHostOrCohostList:[], //加签主办或者协办新添加的数据，由子组件form_selectHostOrCohost得到
      formTemplateDocid:'',
      cCname:'', //抄送人姓名
      allowEditApprover: false,
    };
  },

  computed: {
    template() {
      let data = this.formdata;
      console.log("data11---->",data)
      if (data && data.fields) {
        if(!data.formTemplate.template) {
          return {
            components: { authority },
            template: "<div><authority /></div>"
          };
        }else {
          
          return {
            methods: {
              findField: this.findField,
              refresh: this.refresh,
              checkData: this.checkData,
              getAllFields: this.getAllFields,
              addTabs: this.addTabs,
            },
            template: "<div>" + data.formTemplate.template + "</div>"
          };
        }
        
      } else
        return {
          template: "<div></div>"
        };
    }
  },

  methods: {
    addTabs(params) {
      this.$emit("add-tab", params); 
    },
    getDocId(){return this.formdata.docId;},
    getformId(){return this.formdata.formId;},
    getAppId(){return this.openParams.appId;},
    getAllFields(){return this.formdata.fields;},

    onAction(act) {
      let divId = act.id;
      let activityType = act.type;
      switch (act.type) {
        case 1: //载入视图
          console.log("载入视图-->")
          console.log("this.buildFormData-->",this.buildFormData());
          break;
        case 4: //保存并启动流程
          this.runBeforeAction(divId, "", "", activityType);
          break;
        case 5: //流程处理
          this.flowHandle(act);
          break;
        case 10: //
          this.goBack(act);
          break;
        case 13: //自定义按钮
          this.runBeforeAction(divId, "", "", activityType);
          break;
        case 33: //流程启动
          this.flowHandle(act); //不支持流程启动功能
          break;
        case 43: //跳转
          this.runBeforeAction(divId, "", "", activityType, act);
          break;
        case 47: //回退流程
          this.flowHandle(act);
          break;
        case 48: //流程催办
          console.log("流程催办-->");
          this.flowHandle(act);
          break;
        case 49: //流程挂起
          this.suspendWorkflow(act);
          break;
        case 50: //流程恢复
          this.recoveryWorkflow();
          break;
        case 51: //回撤流程
          this.retracementWorkflow(act);
          break;
        case 52: //终止流程
          this.flowHandle(act);
          break;
        case 53: //编辑流程审批人
          this.flowHandle(act);
          break;
        case 55: //点评
          this.flowHandle(act);
          break;
        case 56: //补签
          this.flowHandle(act);
          break;
        case 57: //加签主办
          this.flowHandle(act);
          break;
        case 58: //加签协办
          this.flowHandle(act);
          break;
        default:
          break;
      }
    },

    findField(id) {
      let data = this.formdata;
      for (let i = 0; i < data.fields.length; i++) {
        let fld = data.fields[i];
        if (id == fld.id) return fld;
      }
      //TODO:临时处理隐藏字段--Jarod
      return {
        id: id,
        displayType: Constant.PermissionType_HIDDEN,
        hiddenValue: ""
      };
    },

    initForm({ appId, formId, docId }) {
      if (docId && docId != "") {
        API.getForm(
          appId,
          formId,
          docId,
          {},
          {
            onSucess: response => {
              this.formTemplateDocid = docId.replace(/_/g, "");
              this.loading = false;
              this.formdata = response.data.data;
              this.formdata.formId = formId;
              this.formdata.docId = docId;
              if(response.data.data.waterMarkText) {
                this.$nextTick(()=>{
                  let str = docId.replace(/_/g, "");
                  let id = 'formTemplate_' + str;
                  Watermark.set(response.data.data.waterMarkText, id);
                })
              }
            }
          }
        );
      } else {
        API.getDocumentEmpty(
          appId,
          formId,
          {},
          {
            onSucess: response => {
              if (response.data.data) {
                this.loading = false;
                let docId = response.data.data.id;
                //this.openParams.id = docId;
                this.formTemplateDocid = response.data.data.id.replace(/_/g, "");
                API.getForm(
                  appId,
                  formId,
                  docId,
                  {},
                  {
                    onSucess: response => {
                      this.formdata = response.data.data;
                      this.formdata.formId = formId;
                      this.formdata.docId = docId;

                      if(response.data.data.waterMarkText) {
                        let str = docId.replace(/_/g, "");
                        let id = 'formTemplate_' + str;
                        Watermark.set(response.data.data.waterMarkText, id);
                      }
                      
                    }
                  }
                );
              }else {
                this.loading = false;
              }
            }
          }
        );
      }
    },

    refresh(fieldId) {
      //刷新方法
      let fd = this.buildFormData();
      let data = {
        document: fd,
        formId: this.openParams.actionContent,
        docId: fd.id,
        parentId: "",
        templateForm: "",
        viewId: "",
        applicationId: fd.applicationId,
        id: fd.id
      };
      console.log("刷新数据为");
      console.log(data);
      API.refreshForm(fieldId, data, {
        onSucess: response => {
          let fields = response.data.data;
          let keys = Object.keys(fields);
          keys.forEach(key => {
            let field = fields[key];
            // console.log("field",field);
            this.formdata.fields.forEach((f, i) => {
              if (field.id == f.id) {
                this.formdata.fields[i].value = field.value;//只能更新value，而不能简单做对象替换，field.value绑定在组件v-model上，如果直接替换只是数组内存指针简单变更
                this.formdata.fields[i].options = field.options;
                this.formdata.fields[i].tabs = field.tabs;
                //如果为选择类型field，则options也要在这里替换.....
                this.formdata.fields[i].displayType = field.displayType;
              }
            });
          });
          
        }
      });
      // echo(event, result)
    },
    handleClose(done) {
      done();
    },

    checkData(value) {
      if(value) {
        let data = this.buildFormData();
        return data; 
      } 
    },
    
    //按钮事件执行前
    runBeforeAction(divId, isOrRefresh, id, activityType){
      let appId = this.openParams.appId;
      let formData = "";
      if(this.copyFormData) { //复制文档时存在
        formData = this.buildFormData();//当复制时数据不变，只改变id值
        formData.docId = this.copyFormData.id;
        formData.id = this.copyFormData.id;
      }else {
        formData = this.buildFormData();
        formData.docId = this.buildFormData().id;
      }
      let document = {
        applicationId:this.openParams.appId,
        formId:formData.formId,
        items:formData.items,
        parentId: formData.parentId,
        sign: formData.sign,
        subDocuments: formData.subDocuments,
        versions: formData.versions,
      };
      delete formData.items;
      formData.document = document;
      formData.viewId = "";
      formData.templateForm = "";
      this.parameterObj = formData;
      API.runBeforeActionScript(
        appId, 
        divId,
        formData,
        activityType,
        {
        onSucess: response => {
          if(response.data.data){ //如果有数据返回，结束下一步
            console.log(response);
            let errcode = response.data.errcode;
            let errmsg = response.data.data.content;
            this.$notify.error({
              title: errmsg,
              message: ''
            });
          }else {
            switch (activityType) {
              case 4: //保存并启动流程
                this.saveStartWorkFlow(activityType, divId);
                break;
              case 34: //保存（校验）数据
                this.doSave(activityType, divId);
                break;
              case 14: //网页打印
                this.printForm();
                break;
              case 11: //保存并返回
                this.doSave(activityType, divId);
                break;
              case 42: //保存并新建
                this.doSave(activityType, divId);
                break;
              case 19: //保存草稿
                this.saveDraft(activityType, divId);
                break;
              case 21: //保存并复制
                this.doSave(activityType, divId);
                break;
              case 10: //返回
                console.log("返回");
                this.goBack();
                break;
              case 8: //关闭窗口
                this.goBack();
                break;
              case 13:
                this.execute(appId, divId, formData);
                break;
              case 15: //网页打印_包含流程打印
                this.printForm(activityType);
                break;
              case 30: //自定义打印
                break;
              case 45: //归档
                this.placeOnFile();
                break;
              case 25: //PDF导出
                this.leadingOut();
                break;
              case 26: //文件下载
                this.fileDownload(divId);
                break;
              case 43: //跳转
                this.pageSkip(divId);
                break;
              case 46: //签章
                break;
              default:
                break;
            }
            if(isOrRefresh) {
              this.refresh(id);
            }
          }
        },
      })
    },

    //执行脚本后
    runAfterAction(divId, num) {
      let that = this;
      let appId = this.openParams.appId;
      let formData = this.parameterObj;
      let docId = "";
      if(this.copyFormData) { //复制时存在
        console.log("执行后复制时");
        docId = this.copyFormData.id;
      }else {
        console.log("执行后非复制时");
        docId = this.buildFormData().id;
      }
      let formId =  this.buildFormData().formId;
      let viewId = "";
      let _templateForm = "";
      let _ = new Date().getTime();
      let parentId = this.buildFormData().parentId;
      API.runAfterActionScript(
        appId,
        divId,
        docId, 
        viewId, 
        formId, 
        _templateForm, 
        parentId, 
        _,
        formData,
        {
          onSucess: response => {
            console.log("response-->"+response);
            if(response.data.errcode == 0) {
              if(response.data.data.content) {
                let errmsg = response.data.data.content.content;
                debugger
                
                this.$notify({
                  title: errmsg,
                  message: '',
                  type: 'warning'
                });
              }else {
                if(num == 11) { //关闭当前页
                  setTimeout(function () {
                    that.goBack();
                  }, 2000);
                }else if(num == 42) { //保存并重建
                  setTimeout(function () {
                    that.$parent.reloading();
                  }, 1500);
                }else if(num == 21) { //保存并复制
                  console.log("保存并复制");
                  this.copyDoc();
                }else if(num == 34) {
                  if(this.openParams.isIncludeCreate && this.openParams.isIncludeCreate == 'include') {
                    debugger
                    this.$emit("action"); 
                  }
                }
              }
            }
          }
        }
      );
    },

     //保存（校验）数据
    doSave(num, divId) {
      let that = this;
      let transferrData = "";
      let id = "";
      if(this.copyFormData) { //复制时存在
        console.log("复制时");
        transferrData = this.copyFormData;
        id = this.copyFormData.id;
      }else {
        console.log("非复制时");
        transferrData = this.buildFormData();
        id = this.buildFormData().id;
      }
      if (this.openParams.parentId) {
        transferrData.parentId = this.openParams.parentId;
      }else {
        transferrData.parentId = '';
      }
      if(this.openParams.isRelate) {
        transferrData.isRelate = "true";
      }else {
        transferrData.isRelate = '';
      }


      API.saveDocument(
        this.openParams.appId,
        this.formdata.formId,
        id,
        transferrData,
        {
          onSucess: response => {
            let errcode = response.data.errcode;
            let errmsg = response.data.errmsg
            if(errcode == 4001) {
              this.promptBox(errcode, errmsg, response.data.errors[0].errmsg);
            }else if(errcode == 0){             
              //if(num == 34) { //保存(校验)数据
              this.promptBox(errcode, errmsg).then((data) => {
                console.log(data);
                that.runAfterAction(divId, num);
              });
            }
          },
        }
      );
    },

    //复制文档
    copyDoc() {
      let appId = this.openParams.appId;
      let docId = "";
      let doc = {};
      let formData ="";
      if(this.copyFormData) { //复制时存在
        formData = this.buildFormData();
        formData.id = this.copyFormData.id;
        docId = this.copyFormData.id;
        doc.document = formData;
      }else {
        formData = this.buildFormData();
        docId = this.buildFormData().id;
        doc.document = formData;
      }
      delete doc.document.items.button_act;
      delete doc.document.items.null;
      delete doc.document.items.undefined;
      API.copeDocument(
        appId,
        docId,
        doc,
        {
          onSucess: response => {
            console.log("复制文档-->");
            console.log(this.copyFormData.id);
            this.copyFormData = this.buildFormData();
            this.copyFormData.id = response.data.data.id;
          }
        }
      )
    },

    //保存草稿(19)
    saveDraft(num, divId){
      debugger
      let that = this;
      let formData = "";
      if(this.copyFormData) { //复制时存在
        formData = this.buildFormData();
        formData.id = this.copyFormData.id;
      }else {
        formData = this.buildFormData();
      }
      delete formData.items.button_act;
      delete formData.items.null;
      delete formData.items.undefined;
      API.saveWithoutValidDocument(
        this.openParams.appId,
        formData.id,
        formData,
        {
          onSucess: response => {
            if(response.data.errcode == 0) {
              let errcode = response.data.errcode;
              let errmsg = response.data.errmsg
              debugger
              this.promptBox(errcode, errmsg).then((data) => {
                that.runAfterAction(divId, num);
              });
            }
          },
        }
      );
    },

    //返回
    goBack(){
      if(
        (this.openParams.isIncludeCreate && this.openParams.isIncludeCreate == 'include') ||
        (this.openParams.type && this.openParams.type == 277)
      ) {
        console.log("bud------------>",this.buildFormData());
        //this.$parent.handleClose(); //包含元素为弹窗时，关闭弹窗
       this.$emit("action"); 
      }else {
        let tab = this.openParams;
        this.$parent.$parent.onCloseBtnClick(tab);
      }
      
    },

    printPage() {
      let newWindow = window.open('_blank');   //  打开新窗口
      let codestr = document.getElementById('print').innerHTML;   //  获取需要生成pdf页面的div代码
      newWindow.document.write(codestr);   //  向文档写入HTML表达式或者JavaScript代码
      newWindow.document.close();     //  关闭document的输出流, 显示选定的数据
      setTimeout( ()=> {
        newWindow.print();
      }, 100);
    },

    //打印数据
    printForm(num){
      console.log("打印数据--->")
      this.printParams.formId = this.formdata.formId;
      this.printParams.docId = this.formdata.docId;
      this.$api.getPrintForm(
        this.openParams.appId,
        this.formdata.formId,
        this.formdata.docId,
        {
          onSucess: response => {
            this.printData=response.data.data;
            this.dialogVisible = true;
            this.showDialog = 1;
          }
        }
      );
      
      // if(num == 15) {
      //   let appId = this.openParams.appId;
      //   let docId = this.buildFormData().id;
      //   API.getFlowHistorys(
      //     appId,
      //     docId,  
      //     {
      //       onSucess: response => {
      //         console.log("打印流程历史");
      //         console.log(response);
      //       }
      //     }
      //   )
      // }
    },

    //归档
    placeOnFile(){
      let appId = this.openParams.appId;
      let docId = this.buildFormData().id;
      API.Archive(
        appId,
        docId,
        {
          onSucess: response => {
            console.log("归档");
            console.log(response);
          }
        }
      )
    },

    //文件下载
    fileDownload(divId){
      let appId = this.openParams.appId;
      let docId = this.buildFormData().id;
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

    //PDF导出
    leadingOut(){
      let appId = this.openParams.appId;
      let docId = this.buildFormData().id;
      let formId =  this.buildFormData().formId;
      API.PDFExport(
        appId,
        formId,
        docId,
        {
          onSucess: response => {
            console.log(response);
            // 获取在response headers中返回的下载文件类型
            let type = response.headers['content-type'];
            /*获取在response headers中返回的下载文件名
              因为返回文件名是通过encodeURIComponent()函数进行了编码，因此需要通过decodeURIComponent()函数解码
            */
            let fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
            console.log("fileName-->"+fileName);
            // 调用封装好的下载函数
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

    //跳转
    pageSkip(actId){
      let appId = this.openParams.appId,
          docId = this.buildFormData().id,
          fieldName = "dispatcherUrl",
          _ = new Date().getTime();
      API.runScript(
        appId,
        actId,
        docId,
        fieldName,
        _,
        {
          onSucess: response => {
            console.log(response);
          }
        }
      );
    },

    //执行前脚本返回成功后，执行
    execute(appId, divId, formData) {
      API.executeCustom(
        appId, 
        divId, 
        formData,
        {
          onSucess: response => {
            let errcode = response.data.errcode;
            if(errcode == 0) {
              let errmsg = "成功！";
              this.promptBox(errcode, errmsg);
            }else {
              let errmsg = response.data.errmsg
              this.promptBox(errcode, errmsg);
            }
            //let errmsg = response.data.errmsg
            
          }
        }
      )
    },

    //返回成功或失败时的提示框
    promptBox(errcode, errmsg, title){
      let that = this;
      var p = new Promise(function(resolve){
        if(errcode == 4001) {
          that.$toastr.e({
            closeButton: true,
            title: errmsg,
            msg: title,
            clickClose: true, //Disable click to close 
            timeout: 3000, // 3 sec
            type: 'error', //error, warning, success, info
            preventDuplicates: true, 
          });
        }else if(errcode == 0) {
          that.$toastr.s({
            closeButton:true,
            msg: errmsg,
            clickClose: true, 
            timeout: 2000, 
            type: 'success',
            preventDuplicates: true,   
          });
          resolve("成功");
        } 
      });
      return p; 
    },

    buildFormData() {
      let items = {};
      for (let i = 0; i < this.formdata.fields.length; i++) {
        let fld = this.formdata.fields[i];
        //items[fld.name] = fld.value;
        if (
          fld.name &&
          fld.value != undefined &&
          fld.formField != "ButtonField" && 
          fld.displayType != undefined
        ) {
          if(fld.textType =="hidden" && fld.value) {
            items[fld.name] = fld.value;
          }else if(fld.textType !="hidden"){
            items[fld.name] = fld.value;
          }
        }
        if(fld.tabs && fld.tabs.length>0) {
          for(let j=0; j<fld.tabs.length; j++) {
            if(fld.tabs[j].fields && fld.tabs[j].fields.length >0 ){
              for(let y=0; y<fld.tabs[j].fields.length; y++) {
                let tabVal = fld.tabs[j].fields[y];
                if(
                  tabVal.name &&
                  tabVal.value != undefined &&
                  tabVal.formField != "ButtonField" && 
                  tabVal.displayType != undefined
                ) {
                  if(tabVal.textType =="hidden" && tabVal.value) {
                    items[tabVal.name] = tabVal.value;
                  }else if(tabVal.textType !="hidden"){
                    items[tabVal.name] = tabVal.value;
                  }
                  //items[tabVal.name] = tabVal.value;
                }
              }
            }
          }
        }
      }
      return {
        applicationId: this.openParams.appId,
        formId: this.formdata.formId,
        id: this.formdata.docId,
        items: items,
        parentId: "",
        sign: "",
        subDocuments: [],
        versions: "0"
      };
    },

    flowHandle(act) {
      //this.divId = divId;
      if(act.type == 5) {
        this.flowProcessAct = act;
        this.flowDialogVisible = true;
      }else if(
        act.type == 47 || //回退流程
        act.type == 33 || //流程启动
        act.type == 48 || //流程催办
        act.type == 55 || //点评
        act.type == 56 || //终止流程
        act.type == 57 || //加签主办
        act.type == 58    //加签主办
        ) { 
        if(act) {
          this.flowProcessAct = act;
        }
        this.flowDialogVisible = true;
      }else if (act.type == 52 ) {//终止流程
        if(act) {
          this.flowProcessAct = act;
        }
        this.terminationVisible = true;
      }else if( act.type == 53 ) {//编辑流程审批人
        if(act) {
          this.flowProcessAct = act;
        }
        this.allowEditApprover = true;
        this.approverVisible = true;
      }



    },

    //提交成功或者失败后关闭流程提交面板或者流程退回面板
    closeThePopup(status, isClose) {
      if(isClose) {
        this.flowDialogVisible = false; //流程提交面板
        this.goBack();
      }else if(status == "SUCCESS" && !isClose) {
        this.flowDialogVisible = false; //流程提交面板
        this.goBack();
      }else if(status == "ERROR" && !isClose) {
        this.flowDialogVisible = false;
      }else {
        this.flowDialogVisible = false; //流程提交面板
      }
    },

    //指定审批人时显示用户显示用户选择框
    designatedApprover(approversObj, flowId, isFreeFlow, saveApprover, approverNumType, isAppentCirculator) { 
      this.isAppentCirculator = isAppentCirculator; //是否知道流程抄送人
      this.approversObj = approversObj;
      this.flowId = flowId;
      this.isFreeFlow = isFreeFlow;  //判断是否是自由流程
      this.saveApproverStatus = saveApprover;
      this.approverNumType = approverNumType;
      this.approverVisible = true;
    },

    //指定审批人后显示在流程处理面板上
    selectApprover(approverName, submitTo, nextUserId, isAppentCirculator) {
      if(!isAppentCirculator) {
        this.approverName = approverName;
      }else {
        this.cCname = approverName;
      }
      
      this.nextUserId = nextUserId;
      this.submitTo = submitTo;
      this.approverVisible = false;
    },
    closeApproverDialog(isRefresh) {
      if(isRefresh) {
        // debugger
        // this.isRouterAlive= false;
        // this.$nextTick(() => (this.isRouterAlive= true));
        this.$parent.updateData();
      }
      this.approverVisible = false;
    },

    //回撤流程
    retracementWorkflow() {
      let appId = this.openParams.appId;
      let docId = this.openParams._select;
      this.$api.retracementWorkflow(appId, docId, {
        onSucess: response => {
          let errcode = '';
          let errmsg = '';
          if(response.data.data) {
            errcode = response.data.errcode;
            errmsg = response.data.data;
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            });
            // this.promptBox(errcode, errmsg);
            this.goBack();
          }else {
            errcode = response.data.errcode;
            errmsg = response.data.errors[0].errmsg;
            if (errcode == 4001) {
              this.$notify({
                title: '失败',
                message: errmsg,
                position: 'top-left'
              });
              // this.promptBox(errcode, errmsg, response.data.errors[0].errmsg);
            } else if (errcode == 0) {
              // this.promptBox(errcode, errmsg);
              this.$notify({
                title: '成功',
                message: errmsg,
                type: 'success'
              });
              this.goBack();
            }
          }
        }
      })
    },

    //终止流程
    terminationWorkflow(act) {
      let errcode = '';
      let errmsg = '';
      if(act.data) {
        errcode = act.errcode;
        errmsg = act.data;
        this.promptBox(errcode, errmsg);
        this.goBack();
      }else {
        errcode = act.errcode;
        errmsg = act.errors[0].errmsg;
        if (errcode == 4001) {
          // this.promptBox(errcode, errmsg, act.errors[0].errmsg);
          this.$notify({
            title: '失败',
            message: errmsg,
            position: 'top-left'
          });
        } else if (errcode == 0) {
          // this.promptBox(errcode, errmsg);
          this.$notify({
            title: '成功',
            message: errmsg,
            type: 'success'
          });
          this.goBack();
        }
      }
    },

     //流程挂起
    suspendWorkflow(){
      let appId = this.openParams.appId;
      let docId = this.openParams._select;
      this.$api.suspendWorkflow(appId, docId, {
        onSucess: response => {
          let errcode = '';
          let errmsg = '';
          if(response.data.data) {
            errcode = response.data.errcode;
            errmsg = response.data.data;
            //this.promptBox(errcode, errmsg);
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            });
            this.goBack();
          }else {
            errcode = response.data.errcode;
            errmsg = response.data.errors[0].errmsg;
            if (errcode == 4001) {
              //this.promptBox(errcode, errmsg, response.data.errors[0].errmsg);
              this.$notify({
                title: '失败',
                message: errmsg,
                position: 'top-left'
              });
            } else if (errcode == 0) {
              //this.promptBox(errcode, errmsg);
              this.$notify({
                title: '成功',
                message: errmsg,
                type: 'success'
              });
              this.goBack();
            }
          }
        }
      })
    },

    //子流程-并行流程(用户选择框的弹窗)
    showSubFlowDialog(approversObj, flowId, isFreeFlow, saveApprover, approverNumType, isAppentCirculator, groupNum, subFlowGroup, isSubFlow) {
      this.approversObj = approversObj;
      this.flowId = flowId;
      this.isFreeFlow = isFreeFlow;  //判断是否是自由流程
      this.saveApproverStatus = saveApprover;
      this.approverNumType = approverNumType
      this.groupNum = groupNum; //子流程小组数量
      this.subFlowToApprover = subFlowGroup;
      this.isSubFlow = isSubFlow;
      this.approverVisible = true;
    },

    //子流程-并行流程(用户选择框的弹窗)组件选择的用户提交到流程面板
    subflowDataTopanel(name, subObj, currentGroup, groupNum) {
      this.approverName = name;
      this.subFlowApproverData = subObj;
      this.subFlowGroup = currentGroup;  //数据保存在流程面板中
      this.subFlowGroupNum = groupNum;
      this.approverVisible = false;
    },

    //流程恢复
    recoveryWorkflow() {
      let appId = this.openParams.appId;
      let docId = this.openParams._select;
      this.$api.recoveryWorkflow(appId, docId, {
        onSucess: response => {
          let errcode = '';
          let errmsg = '';
          if(response.data.data) {
            errcode = response.data.errcode;
            errmsg = response.data.data;
            this.$notify({
              title: errmsg,
              message: '',
              type: 'success'
            });
            this.goBack();
          }else {
            errcode = response.data.errcode;
            errmsg = response.data.errors[0].errmsg;
            if (errcode == 4001) {
              this.$notify({
                title: errmsg,
                message: '',
                position: 'top-left'
              });
            } else if (errcode == 0) {
              this.$notify({
                title: errmsg,
                message: '',
                type: 'success'
              });
              this.goBack();
            }
          }
        }
      })
    },

    //加签添加角色确定后(子组件调用)
    selectHostOrCohost(data, obj) {
      this.newHostOrCohostList = data;
      this.saveApproverStatus = obj;
      this.approverVisible = false;
    },

    //保存并启动流程
    saveStartWorkFlow(num, divId) {
      debugger
      let appId = this.$root.appid;
      let formData = {};
      formData.document = this.buildFormData()
      if(this.openParams.parentId) {
        formData.document.parentId = this.openParams.parentId;
      }
      this.$api.saveStartWorkFlow(appId, formData, {
        onSucess: response => {
          let errcode = '';
          let errmsg = '';
          if(response.data.data) {
            errcode = response.data.errcode;
            errmsg = response.data.data;
            this.$notify({
              title: '成功',
              message: '',
              type: 'success'
            });
          }else {
            errcode = response.data.errcode;
            errmsg = response.data.errors[0].errmsg;  
            if (errcode == 4001) {
              this.$notify({
                title: errmsg,
                message: '',
                position: 'top-left'
              });
            } else if (errcode == 0) {
              this.$notify({
                title: errmsg,
                message: '',
                type: 'success'
              });
            }
          }
        }
      });
    },

  }
};
</script>
<style lang="scss">
.myapps-iframe {
  overflow: auto;
}
.active{
  display: none;
}

table {
  width:100%;
}


</style>
