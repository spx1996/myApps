<template>
  <div> 
    <!--加签主办（协办）-->
    <div v-if="act.type==57 || act.type==58" class="process-host">
      <!--加签主办与协办-->
      <form_processHosting_flowpanel
        :act="act"
        :openParams = "openParams"
        :buildFormData="buildFormData"
        :approvers = "approvers"
        :newHostOrCohostList = "newHostOrCohostList"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>

    <!--其他流程-->
    <div class="flow-wrap" v-else>
      <!--补签-->
      <div class="refer" v-if="act.type == 56">
        <div class="t-box">
          <div class="sug-left">意见:</div>
          <div class="idea-textbox">
            <el-input
              class="idea-box"
              type="textarea"
              :rows="7"
              placeholder="请输入审批意见..."
              maxlength="300"
              v-model="attitude">
            </el-input>
          </div>
        </div>
      </div>

      <!--点评-->
      <div class="refer" v-else-if="act.type == 55">
        <div class="t-box">
          <div class="sug-left">意见:</div>
          <div class="idea-textbox">
            <el-input
              class="idea-box"
              type="textarea"
              :rows="7"
              placeholder="请输入审批意见..."
              maxlength="300"
              v-model="attitude">
            </el-input>
          </div>
        </div>
      </div>

      <!--流程提交-->
      <div class="refer" v-else>
        <div class="refer-left">
          <span v-if="act && act.type == 47">
            回退至:
          </span>
          <span v-if="act && act.type == 48">
            催办:
          </span>
          <span v-else>
            提交至:
          </span>
        </div>
        
        <!--流程提交-->
        <div class="refer-right" v-if="act.type!=47 && act.type!=48 && act.type!=33">
          <!--自由流程-->
          <div class="free-flow" v-if="act.workFlowType==1">
            <div class="list-right" >
              <div class="add" v-if="!approverName" @click="select()">
                +
              </div>
              <div v-else>
                <el-tag
                  :key="approverName"
                  closable
                  :id="nextUserId"
                  @close="onTabClose(nextUserId)"
                  >
                  {{approverName}}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 单选时 -->
          <div class="refer-radio" v-if="!isSplit">
            <el-radio-group v-model="nextNodeIds">
              <el-radio 
                v-for="(item, index) in selectData" 
                :key="index" 
                :label="item.id"
              >
                {{item.name}}
                
                <!--指定审批人或者子流程-->
                <span v-if="item.isToPerson">
                  <span class="check-input">
                    <el-input 
                      :disabled="true"
                      v-model="approverName" 
                      placeholder="请选择指定审批人"></el-input>
                  </span>
                  <span
                    @click="selectApprovers(item.isToPerson, item.id, item.submitTo, item.approverNumType, '', item.groupNum)"
                  >
                    <i style="color: #56d2da;" class="fa fa-users"></i>
                    <i style="color: red">*</i>
                  </span>
                </span>

                <!--流程抄送-->
                <span v-if="isAppentCirculator">
                  <span class="check-input">
                    <span style="color:#000;">抄送&nbsp;&nbsp;</span>
                    <el-input 
                      :disabled="true"
                      v-model="isAppentData.approverName" 
                      placeholder="请选择"></el-input>
                  </span>
                  <span
                    @click="selectApprovers('', '', isAppentData.submitTo, '',isAppentCirculator)"
                  >
                    <i style="color: #56d2da;" class="fa fa-users"></i>
                  </span>
                </span>
              </el-radio>
            </el-radio-group>
          </div>

          <!-- 复选时 -->
          <div class="refer-check" v-if="isSplit">
            <el-checkbox-group 
              @change="handleCheckedCitiesChange"
              v-model="nextNodeIds"
            >
              <el-checkbox 
                style="display:block;"
                v-for="(item, index) in selectData" 
                :label="item.id" 
                :key="index">
                  {{item.name}}
                  <span v-if="item.isToPerson">
                    <span class="check-input">
                      <el-input 
                        :disabled="true"
                        v-model="item.approverName" 
                        placeholder="选择指定审批人"></el-input>
                    </span>
                    <span
                      @click.stop.prevent="selectApprovers(item.isToPerson, 
                      item.id, 
                      item.submitTo, 
                      item.approverNumType)"
                    >
                      <i style="color: #56d2da;" class="fa fa-users"></i>
                      <i style="color: red">*</i>
                    </span>
                  </span>
                </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <!--流程启动-->
        <div class="refer-right" v-if="act.type==33">
          <el-select 
            v-if="processNodes"
            v-model="selectProcessNode" 
          >
            <el-option
              v-for="(item,index) in processNodes"
              :key="index"
              :label="item.subject"
              :value="item.id"
              >
            </el-option>
          </el-select>
          <div v-if="processNodeList.length > 0">
            <el-checkbox-group v-model="selectProcessNodeUser" >
              <el-checkbox 
                v-for="(item,index) in processNodeList" 
                :label="item.id" 
                :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
         
        </div>

        <!--流程回退-->
        <div class="refer-right" v-if="act.type==47">
          <el-select 
            v-if="backNodes"
            v-model="selectBackNodes" 
          >
            <el-option
              v-for="(item,index) in backNodes"
              :key="index"
              :label="item.name"
              :value="item.id"
              >
            </el-option>
          </el-select>
        </div>

        <div class="refer-right" v-if="act.type==48">
          <div class="refer-check">
            <el-checkbox-group 
              v-model="selectNodesId"
              v-if="nodesList && nodesList.length>0"
            >
              <el-checkbox 
                style="display:block;"
                v-for="(item, index) in nodesList" 
                :label="item.nodeId" 
                :key="index">
                  {{item.nodeName}}
                </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <transition v-if="act.type != 56 && act.type != 55 && act.type != 33" :duration="1000" name="face">
        <div v-bind:class="[currentAct ? 'idea' : 'bigIdea' , 'common-idea']">
          <div class="idea-left">
            意见:
          </div>
          <div class="idea-right">
            <div class="idea-use" >
              <span class="use-tip" @click="hiddenSuggest()">
                常见意见&nbsp;
                <i class="fa fa-caret-down common-opinion-icon"></i>
              </span>
              <div class="use-suggest" v-if="isOrSuggest">
                <div class="sug-data" v-if="allSuggests">
                  <span class="data-row" v-for="(item, index) in allSuggests" :key="index" @click="putData(item.content)">
                    <span>{{item.content}}</span>
                    <span class="icon" v-if="showDelAndEdit">
                      <i class="fa fa-trash-o" @click="deleteSuggestion(item.id)"></i>
                      <i class="fa fa-pencil-square-o" @click.stop.prevent="editSuggestion(item.id, item.content)"></i>
                    </span> 
                  </span>
                </div>
                <div class="sug-btn"  v-if="!showInput">
                  <div class="btns">
                    <span @click="showInputBox">添加常用意见</span>
                    <span @click="editSuggest">编辑意见</span>
                  </div>
                </div>
                <div class="sug-new" v-if="showEditFirst">
                  <div class="new-input">
                    <input type="text" v-model="input" />
                  </div>
                  <div class="keep-cancel">
                    <span @click="cancelAddSuggest(1)">取消</span>
                    <span @click="addSuggestion">保存</span>
                  </div>
                </div>
                <div class="sug-new" v-if="showEditSecond">
                  <div class="new-input">
                    <input type="text" v-model="inputSecond" />
                  </div>
                  <div class="keep-cancel">
                    <span @click="cancelAddSuggest(2)">取消</span>
                    <span @click="updateSuggestion">保存2</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 文本框 -->
            <div class="idea-textbox">
              <el-input
                class="idea-box"
                type="textarea"
                :rows="3"
                placeholder="提交备注..."
                maxlength="300"
                show-word-limit
                v-model="attitude">
              </el-input>
            </div>
            
            <!--底部-->
            <div class="idea-opinion">
              <span>
              </span>
              <span @click="changeDiv">
                <img src="../assets/images/qianzi.png" />
                手签意见
              </span>
            </div>

            <!--手签意见-->
            <div class="idea-canvas" v-show="!currentAct">
              <canvas
                class="canvas"
                id="canvas"
                width="510"
                height="125"
                @mousedown="canvasDown($event)"
                @mousemove="canvasMove($event)"
                @mouseup="canvasUp($event)"
                @mouseleave="canvasLeave($event)"
                ref="canvas"
              >抱歉，您的浏览器不支持canvas元素</canvas>
            </div>
            <div class="idea-clear" v-if="!currentAct">
              <el-button 
                class="btn"
                size="mini" 
                @click="clear">
                重写
              </el-button>
            </div>
          </div>
        </div>
      </transition>
      <div class="idea common-idea" v-if="act.type == 33">
        <div class="idea-left">
          &nbsp;
        </div>
        <div class="idea-right-submission-process">
          说明文字:此功能供用户给当前表单开启不同的流程！
        </div>
      </div>
    </div>
    <div class="footer-btn" v-if="act.type!=57 && act.type!=58">
      <div>
        <!-- <el-button size="medium" type="success" @click="getPhoto">提交</el-button> -->
        <el-button 
          size="medium" 
          type="success" 
          @click="startProcess()"
          v-if="act && act.type == 33"
        >
          确认
        </el-button>
        <el-button 
          size="medium" 
          type="success" 
          @click="rollBack(firstSubmission)"
          v-else-if="act && act.type == 47"
        >
          回退
        </el-button>

         <el-button 
          size="medium" 
          type="success" 
          v-else-if="act && act.type == 48"
          @click="remind"
        >
          催办
        </el-button>

        <el-button 
          size="medium" 
          type="success" 
          v-else-if="act && (act.type == 56 || act.type == 55)"
          @click="endorsement(act.type)"
        >
          确定
        </el-button>

        <el-button 
          v-else
          size="medium" 
          type="success" 
          @click="onSubmit(firstSubmission)"
        >
          提交
        </el-button>

        <span class="pack-up" @click.stop="stowPopup">收起</span>
      </div>
    </div>
  </div>
</template>

<script>

import form_processHosting_flowpanel from "@/components/form_processHosting_flowpanel.vue";
import API from "@/api.js";
export default {
  props: [
    "stateId", 
    "act", 
    "openParams",
    "buildFormData",
    "approverName",
    "submitTo",
    "nextUserId",
    "approvers",
    "subFlowApproverData",
    "subFlowGroup",
    "newHostOrCohostList",
    "cCname",
    "subFlowGroupNum"
  ],
  components: {
    form_processHosting_flowpanel,
  },

  watch: {
    submitTo() {
      this.newSelectData();
    },
    subFlowApproverData() {
      this.setSubflowselectData();
    },
    selectProcessNode() {
      //我也不知道启动流程是不是有多个下拉框的，先当他是一个吧
      for(let i = 0; i<this.processNodes.length; i++) {
        if(this.selectProcessNode == this.processNodes[i].id) {
          this.processNodeList = this.processNodes[i].firstNodeList;
        }
      }
    }
  },

  data: function() {
    return {
      radio: 3,
      input:'',
      nextNodeIds: undefined,
      radio: '',
      selectData:[],
      isSplit:true,
      currentAct:true,
      isOrSuggest:false,
      attitude: '',
      input: '', //单选框数据
      showInput:false, //是否展示添加常见意见框
      showEditFirst:false, //展示编辑意见框
      showDelAndEdit:false,
      allSuggests:[],
      showEditSecond:false,
      inputSecond:'',
      opinionId:'', //更新意见信息的ID

      /*
        手签
      */
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      isDown: false,

      flowId:"", //当前流程ID
      isAppentCirculator: "", //是否抄送
      isAppentData:{},
      currentNodeId: "",
      isToPerson: "",
      firstSubmission: true, //第一次点击提交禁止按钮再次点击
      existCanvas: false, //是否存在手写签名

      backNodes:'', //流程回退节点
      selectBackNodes:'',
      nodesList: [], //催办节点数据
      selectNodesId: [],
      processNodes: [], //流程启动按钮的节点
      selectProcessNode: '', //流程启动按钮下拉框选择的值
      processNodeList:[],
      selectProcessNodeUser:[],

    };
  },
  mounted(){
    if(this.act.type == 48 || this.act.type == 33) {
      this.setNodes(this.act.type)
    }else {
      this.getSubmission();
    }
    this.getSuggest();
    this.show();
  },
  methods: {
    setSubflowselectData() {
      for (let i = 0; i < this.selectData.length; i++) {
        if (this.selectData[i].id == this.subFlowApproverData.nodeid) {
          this.selectData[i].approverName = this.approverName;
          this.selectData[i].subFlowApproverData = this.subFlowApproverData;
        }
      }
      this.$forceUpdate() //重新渲染数据
    },

    //流程启动
    startProcess() {
      if(!this.selectProcessNode) {
        this.$message({
          message: '未选择数据',
          type: 'warning'
        });
      }else {
        let nextId = '';
        if(this.selectProcessNodeUser.length > 0) {
          for(let i=0; i < this.selectProcessNodeUser.length; i++) {
            nextId += this.selectProcessNodeUser[i] + ';';
          }
        }
        let formData = this.buildFormData;
        formData.stateId = this.stateId;
        let docId = formData.id,
            id = formData.id;
        let formId = formData.formId;
        let document = {
          applicationId: this.$root.appid,
          actId: this.act.id,
          docId: docId,
          document: formData,
          flowId: this.selectProcessNode,
          formId: formId,
          id: id,
          nextId,
          parentId: "",
          templateForm: "",
          viewId: ""
        };
        console.log("-3---->",document)
        this.$api.InitiateWorkFlow(
          this.$root.appid,
          docId,
          document,
          {
            onSucess: response => {
              let status;
              if(response.data.errcode == 0) {
                status = 'SUCCESS';
                this.$emit("closePopup",status);
                this.$notify({
                  title: response.data.data,
                  message: '',
                  type: 'success'
                });
              }else if(response.data.errcode==4001){
                status = 'ERROR';
                this.$emit("closePopup",status)
                this.$notify({
                  title: response.data.errmsg,
                  message: '',
                  type: 'error'
                });
              }
            }
          }
        )
      }
    },

    //催办提交
    remind() {
      let pJson = this.getSignImageData()
      let formData = this.buildFormData;
      formData.stateId = this.stateId;
      let docId = formData.id,
          id = formData.id;
      let formId = formData.formId;
      let document = {
        applicationId: this.$root.appid,
        currentNodeId: this.currentNodeId,
        docId: docId,
        document: formData,
        formId: formId,
        id: id,
        nodertIds:this.selectNodesId,
        parentId: "",
        templateForm: "",
        viewId: ""
      };
      if (pJson) {
        //手写签名
        document.signatureJson = JSON.stringify(pJson);
      }
      document.attitude = this.attitude;
      this.$api.remindFlow(this.$root.appid, docId, document,{
        onSucess: response => {
          let status;
          if(response.data.errcode == 0) {
            status = 'SUCCESS';
            this.$emit("closePopup",status);
            this.$notify({
              title: response.data.data,
              message: '',
              type: 'success'
            });
          }else if(response.data.errcode==4001){
            status = 'ERROR';
            this.$emit("closePopup",status)
            this.$notify({
              title: response.data.errmsg,
              message: '',
              type: 'error'
            });
          }
        }
      });
    },
    //催办数据
    setNodes(type) {
      if(type == 48) {
        let obj =  JSON.parse(this.act.reminderNodesData);
        this.nodesList = obj.data;
      }else if(type == 33){
        let formData = this.buildFormData;
        formData.stateId = this.stateId;
        let docId = formData.id,
            id = formData.id;
        let formId = formData.formId;
        let document = {
          applicationId: this.$root.appid,
          docId: docId,
          document: formData,
          formId: formId,
          id: id,
          parentId: "",
          templateForm: "",
          viewId: ""
        };
        this.$api.getPanelsInitiate(
          this.$root.appid,
          docId,
          document,
          {
            onSucess: res => {
              this.processNodes = res.data.data
            }
          }
          

        )
      }
      
    },
    //补签提交
    endorsement(val) {
      if(val == 56) {
        let appId = this.$root.appid;
        let instanceId = this.approvers[0].instanceId;
        let attitude = this.attitude;
        this.$api.supplement(appId, instanceId, attitude, {
          onSucess: response => {
            let act = response.data.data;
            let status = "SUCCESS";
            if(response.data.errcode == 0) {
              this.$notify({
                title: response.data.data,
                message: '',
                type: 'success'
              });
              this.$emit("closePopup", status);
            }else if (response.data.errcode == 4001) {
              status = "ERROR";
              //this.$emit("closePopup", status);
              let prompt = response.data.errors[0].errmsg
                ? response.data.errors[0].errmsg
                : response.data.errmsg;
              this.$notify.error({
                title: response.data.errmsg,
                message: response.data.errmsg
              });
              
            }
            //this.$emit("action", act);
          }
        });
      }else if(val = 55) {
        let attitude = this.attitude;
        let appId = this.$root.appid;
        let instanceId = this.approvers[0].instanceId;
        this.$api.review(appId, instanceId, attitude, {
           onSucess: response => {
            let act = response.data.data;
            let status = "SUCCESS";
            if(response.data.errcode == 0) {
              this.$notify({
                title: response.data.data,
                message: '',
                type: 'success'
              });
              this.$emit("closePopup", status);
            }else if (response.data.errcode == 4001) {
              status = "ERROR";
              //this.$emit("closePopup", status);
              let prompt = response.data.errors[0].errmsg
                ? response.data.errors[0].errmsg
                : response.data.errmsg;
              this.$notify.error({
                title: response.data.errmsg,
                message: response.data.errmsg
              });
              
            }
            //this.$emit("action", act);
          }
        });
      }
      
    },
    newSelectData() {
      for (let i = 0; i < this.selectData.length; i++) {
        if (this.selectData[i].id == this.submitTo.nodeid) {
          if(!this.submitTo.isAppentCirculator) {
            this.selectData[i].approverName = this.approverName;
            this.selectData[i].submitTo = this.submitTo;
          }
          
        }
      }
      if(this.submitTo.isAppentCirculator) {
        this.isAppentData.approverName = this.cCname;//this.approverName;
        this.isAppentData.circulatorInfo = this.submitTo.userids;
        this.isAppentData.submitTo = this.submitTo;
      }

      this.$forceUpdate() //重新渲染数据
    },


    stowPopup() {
      this.$emit("closePopup");
    },
    //指定审批人
    selectApprovers(isToPerson, nodeid, submitTo , approverNumType, isAppentCirculator,groupNum) {
      if((groupNum && groupNum>1) || groupNum <= -1) {  //子流程分组
        let approversObj = {
          isToPerson: isToPerson,
          nodeid:nodeid,
          groupNum:groupNum,
        }
        if(isAppentCirculator) {
          approversObj.isAppentCirculator = isAppentCirculator;
        }
        let saveApprover = submitTo;
        let subFlowGroup = [];
        if(this.subFlowGroup && this.subFlowGroup.length > 0) {
          subFlowGroup = [...this.subFlowGroup];
        }
        let isSubFlow = true;
        this.$emit("showSubFlow",approversObj, this.flowId, "", saveApprover, approverNumType, isAppentCirculator, groupNum, subFlowGroup, isSubFlow);
      }else {
        let approversObj = {
          isToPerson: isToPerson,
          nodeid:nodeid,
        }
        if(isAppentCirculator) {
          approversObj.isAppentCirculator = isAppentCirculator;
        }
        let saveApprover = submitTo;
        // console.log("approversObj---->",approversObj)
        // console.log("this.flowId---->",this.flowId)
        // console.log("saveApprover---->",saveApprover)
        // console.log("approverNumType---->",approverNumType)
        // console.log("isAppentCirculator---->",isAppentCirculator)
        // console.log("approversObj---->",approversObj)
        // console.log("approversObj---->",approversObj)
        this.$emit("action",approversObj, this.flowId, "", saveApprover, approverNumType, isAppentCirculator); //调用父组件designatedApprover()方法
      }
    },

    //流程回退执行前
    rollBack() {
      if(this.act.workFlowType == 1) { //自由流程
          let formData = this.buildFormData;
          formData.stateId = this.stateId;
          let docId = formData.id,
              id = formData.id;
          let formId = formData.formId;
          let document = {
            applicationId: this.$root.appid,
            docId: docId,
            document: formData,
            formId: formId,
            id: id,
            nextUserId:this.selectedPerson.id,
            parentId: "",
            templateForm: "",
            viewId: ""
          };
          document.attitude = this.attitude;
          this.$api.backFreeFlow(this.$root.appid, docId, document,{
            onSucess: response => {
              let status;
              if(response.data.errcode==0) {
                status = 'SUCCESS';
                this.$emit("closePopup",status)
                Toast({
                    message: response.data.data,
                    iconClass: 'fa fa-check fa-2x'
                  });
              }else if(response.data.errcode==4001){
                status = 'ERROR';
                this.$emit("closePopup",status)
                Toast({
                  message: response.data.errmsg,
                  iconClass: 'fa fa-close fa-2x'
                });
              }
            }
          });
      }else {
        if(this.selectBackNodes) {
          let pJson = this.getSignImageData()
          let formData = this.buildFormData;
          formData.stateId = this.stateId;
          let docId = formData.id,
              id = formData.id;
          let formId = formData.formId;
          let document = {
            applicationId: this.$root.appid,
            currentNodeId: this.currentNodeId,
            docId: docId,
            document: formData,
            flowId: this.flowId,
            formId: formId,
            id: id,
            parentId: "",
            templateForm: "",
            viewId: ""
          };
          this.$api.runBeforeActionScript(this.$root.appid, this.act.id, document, this.act.type, {
            onSucess: response => {
              if (response.data.errcode == 0) {
                this.flowRollBack(document, pJson);
              }
            }
          });
        }else {
          let status = 'ERROR';
          //this.$emit("closePopup",status)
          this.$message({
            message: "未选择指定人",
            type: 'warning'
          });
        }
      }
    },

    //流程回退
    flowRollBack(allData, pJson) {
      let formData = this.buildFormData;
      let appId = this.$root.appid;
      let docId = formData.id;
      let document = allData;
      console.log("document-1-->",document);
      if (pJson) {
        //手写签名
        document.signatureJson = JSON.stringify(pJson);
      }
      if (this.nextNodeIds instanceof Array) {
        //多选
        document.nextNodeIds = this.nextNodeIds;
      } else {
        // 单选
        document.nextNodeIds = [];
        document.nextNodeIds.push(this.selectBackNodes);
      }
      console.log("document--->",document);
      console.log("attitude--->",this.attitude);
      document.attitude = this.attitude;
      document.subFlowApprover = []; //多种流程处理方式，此数据为完善未完善
      document.submitTo = []; //多种流程处理方式，此数据为完善未完善
      API.backFlow(appId, docId, document, {
        onSucess: response => {
          let status;
          if(response.data.errcode==0) {
            status = 'SUCCESS';
            this.$emit("closePopup",status);
            this.$notify({
              title: '成功',
              message: response.data.data,
              type: 'success'
            });
          }else if(response.data.errcode==4001){
            status = 'ERROR';
            this.$emit("closePopup",status)
            debugger
          }
        }
      });
    },

    //取消自由流程选中的用户
    onTabClose(id) {
      this.approverName = '';
      this.nextUserId = '';
    },

    //自由流程选择用户
    select() {
      let isFreeFlow = true;
      this.$emit("action", "", "", isFreeFlow); //调用父组件designatedApprover()方法
    },

    handleCheckedCitiesChange(value) {
      console.log("------------->",value);
    },
    //保存重新编辑的意见
    updateSuggestion() {
      console.log("更新编辑的数据-->");
      console.log(this.inputSecond);
      let userId = this.$store.state.userId, 
          opId = this.opinionId, 
          opinion = this.inputSecond;
      API.editMostUseSuggestion(
        userId,
        opId,
        opinion,
        {
          onSucess: response => {
            if(response.data.data) {
              let id = response.data.data.id;
              let content = response.data.data.content;
              for(let i=0; i<this.allSuggests.length; i++) {
                if(this.allSuggests[i].id == id) {
                 
                  this.allSuggests[i].content = content;
                  this.inputSecond = '';
                }
              }
            }
            
          }
        }
      )
    },
    //重新编辑意见
    editSuggestion(id, content) {
      this.inputSecond = content;
      this.opinionId = id;
    },
    //删除意见
    deleteSuggestion(id) {
      let userId = this.$store.state.userId;
      let opId = id;
      API.deleteMostUseSuggestion(
        userId,
        opId,
        {
          onSucess: response => {
            console.log(response.data.data);
            //后台返回500，未执行以下步骤
            if(response.data.data) {
              let delId = response.data.data.id;
              let allSug = this.allSuggests;
              for (let i = 0; i < allSug.length; i++) {
                if (allSug[i].id == delId) {
                  allSug.splice(i, 1); 
                  i--; 
                }
              }
              this.allSuggest = allSug;
            }
            
          }
        }
      )
    },

    //添加意见
    addSuggestion() {
      console.log(this.input);
      let userId = this.$store.state.userId;
      let opinion = this.input;
      API.AddMostUseSuggestion(
        userId,
        opinion,
        {
          onSucess: response => {
            console.log(response.data.data);
            let newSuggest = response.data.data;
            this.allSuggests.push(newSuggest);
            this.input="";
          }
        }
      )
    },

    // 选中的数据放进文本框中
    putData(content){
      if(this.showDelAndEdit == false) {
        if(!this.textarea) {
          this.textarea = content;
        }else if(this.textarea){
          this.textarea = this.textarea + "," + content;
        }

      }
      
    },
    editSuggest(){
      this.showInput = true;
      this.showEditFirst = false;
      this.showEditSecond = true;
      this.showDelAndEdit = true;
    },
    cancelAddSuggest(num){
      if(num == 1) {
        this.showInput = false;
        this.showDelAndEdit = false;
        this.showEditFirst = false;
      }else if(num == 2) {
        this.showInput = false;
        this.showDelAndEdit = false;
        this.showEditSecond = false;
      }
      
    },
    showInputBox() {
      this.showInput = true;
      this.showEditFirst = true;
    },
    showEditBox(){

    },

    //清除画布数据
    clear(){
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.existCanvas = false;
    },
    show(){
      this.canvas = this.$refs.canvas;//指定canvas
      this.canvasTxt = this.canvas.getContext("2d");//设置2D渲染区域
      this.canvasTxt.fillStyle = "#fff";
      this.canvasTxt.fillRect(0,0,500,125);
    },
    canvasDown(ev) {
      ev = ev || event
      ev.preventDefault()
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.isDown = true
      }
      
    },
    canvasMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    canvasUp(ev) {
      ev = ev || event
      ev.preventDefault()
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.points.push({x: -1, y: -1})
        this.isDown = false
      }

    },
    canvasLeave(e) {
      console.log(e);
      this.existCanvas = true;
      this.canvasMoveUse = false; 
    },

    getSignImageData() {
      if (this.existCanvas) {
        //判断是否存在手写签名
        let pJson;
        let canvas = document.getElementById("canvas");
        let signature = canvas.toDataURL("image/png");
        let str = signature.replace("data:image/png;base64,", "");
        pJson = {
          type: "image/png;base64",
          data: str
        };
        return pJson;
      } else {
        return false;
      }
    },

     //提交
    onSubmit() {
      if(this.selectData.length > 0 || this.act.workFlowType == 1) {
        if (this.firstSubmission) { //当提交时，确定按钮禁止再次点击提交
          this.firstSubmission = false;
          let status = "";
          if (this.isToPerson) { //当要选择指定审批人时
            if (this.isSplit) {
              //多选
              if (this.nextNodeIds.length > 0) {
                for (let i = 0; i < this.nextNodeIds.length; i++) {
                  for (let j = 0; j < this.selectData.length; j++) {
                    if (this.nextNodeIds[i] == this.selectData[j].id) {
                      if (this.selectData[j].type != "CompleteNode") {
                        if (!this.selectData[j].submitTo) {
                          if(this.selectData[j].isToPerson) {
                            this.$emit("closePopup", status);
                            return;
                          }
                        }
                      }
                    }
                  }
                }
              } else if (this.nextNodeIds.length == 0) {
                this.$message.error("请选择审批人!");
                this.firstSubmission = true;
                //this.$emit("closePopup", status);
                return;
              }
            } else {
              //单选
              if (this.nextNodeIds) {
                for (let y = 0; y < this.selectData.length; y++) {
                  if (this.nextNodeIds == this.selectData[y].id) {
                    if (this.selectData[y].type != "CompleteNode") {
                      if (!this.selectData[y].submitTo && !this.selectData[y].subFlowApproverData) {
                        if(this.selectData[y].isToPerson) {
                          debugger
                          this.$emit("closePopup", status);
                          return;
                        }
                      }
                    }
                  }
                }
              } else {
                debugger
                this.$emit("closePopup", status);
                return;
              }
            }
          }

          if (this.nextNodeIds instanceof Array) {  //多选但没有指定审批人没有选择审批人时
            if(this.nextNodeIds.length < 1) {
              debugger
              return;
            }
          }

          if (this.act.workFlowType == 1) {
            if (!this.nextUserId) {
              debugger
              status = "ERROR";
              this.$emit("closePopup", status);
              return;
            }
          }

          let pJson = this.getSignImageData();
          //let formData = this.$parent.$parent.$parent.$parent.$parent.buildFormData();
          let formData = this.buildFormData;
          formData.stateId = this.stateId;
          let docId = formData.id,
            id = formData.id;
          let formId = formData.formId;
          let document = {
            applicationId: this.$root.appid,
            currentNodeId: this.currentNodeId,
            docId: docId,
            document: formData,
            flowId: this.flowId,
            formId: formId,
            id: id,
            parentId: "",
            templateForm: "",
            viewId: ""
          };

          if(this.isAppentCirculator) { //判断是否抄送
            if(this.isAppentData.circulatorInfo) {
              document.circulatorInfo = this.isAppentData.circulatorInfo;
            }
          }

          this.documentData = document; //保存值放到执行后脚本

          let isRelate = '';
          let _flowType = this.act.flowType; //提交为80
          this.$api.submitRunBeforeActionScript(
            this.$root.appid,
            this.act.id,
            document,
            docId,
            document.viewId,
            formId,
            document.templateForm,
            document.parentId,
            isRelate,
            _flowType,
            {
              onSucess: response => {
                if (response.data.errcode == 0) {
                  if(response.data.data) {
                    debugger
                  }else {
                    this.submitFlowData(document, pJson);
                  }
                
                }
              }
            }
          );
        }
      }
    },
    submitFlowData(allData, pJson) {
      //let formData = this.$parent.$parent.$parent.$parent.$parent.buildFormData();
      let formData = this.buildFormData;
      let appId = this.$root.appid;
      let docId = formData.id;
      let document = allData;
      if (pJson) {
        //手写签名
        document.signatureJson = JSON.stringify(pJson);
      }
      document.attitude = this.attitude;
      if (this.act.workFlowType == 1) {
        //自由流程
        document.nextUserId = this.nextUserId;
        delete document.currentNodeId;
        delete document.flowId;
        API.submitFreeFlow(appId, docId, document, {
          onSucess: response => {
            this.firstSubmission = true;
            let status;
            let prompt;
            if (response.data.errcode == 0) {
              status = "SUCCESS";
              prompt = response.data.data;
              this.runAfterAction(status, prompt);
            } else if (response.data.errcode == 4001) {
              status = "ERROR";
              this.$emit("closePopup", status);
              if (response.data.errors && response.data.errors.length > 0) {
                Toast({
                  message: response.data.errors[0].errmsg,
                  iconClass: "fa fa-close fa-2x"
                });
              }
            }
          }
        });
      } else {
        //非自由流程
        document.subFlowApprover = []; //多种流程处理方式，此数据为完善未完善
        document.submitTo = [];
        //流程单选或多选
        if (this.nextNodeIds instanceof Array) {
          //多选
          let checkArr = [];
          document.nextNodeIds = this.nextNodeIds;
          for (let j = 0; j < this.nextNodeIds.length; j++) {
            for (let y = 0; y < this.selectData.length; y++) {
              if (
                this.nextNodeIds[j] == this.selectData[y].id &&
                this.selectData[y].submitTo
              ) {
                delete this.selectData[y].submitTo.row;
                document.submitTo.push(this.selectData[y].submitTo);
                if (this.selectData[y].type == "SubFlow") {
                  //主子流程
                  let checkObj = Object.assign({}, this.selectData[y].submitTo);
                  delete checkObj.isToPerson;
                  checkArr.push(checkObj);
                }
              }
            }
          }
          document.subFlowApprover = checkArr;
        } else {
          // 单选
          document.nextNodeIds = [];
          document.nextNodeIds.push(this.nextNodeIds);
          //let arr = [];
          let subArr = [];
          for (let i = 0; i < this.selectData.length; i++) {
            if (
              this.selectData[i].submitTo &&
              this.selectData[i].submitTo.nodeid == this.nextNodeIds
            ) {
              delete this.selectData[i].submitTo.row;
              subArr.push(this.selectData[i].submitTo);
              if (this.selectData[i].type == "SubFlow") {
                debugger
                //主子流程
                let obj = Object.assign({}, this.selectData[i].submitTo);
                delete obj.isToPerson;
                obj.userids = obj.userids.replace(/^(\s|;)+|(\s|;)+$/g, '');
                let useridData = obj.userids.split(";"); 
                let approverObj = {
                  position:1,
                  userids: useridData,
                }
                let approverArr = [];
                approverArr.push(approverObj);
                //arr.push(obj);
                let subFlowObj = {
                  approver: approverArr,
                  nodeid:obj.nodeid,
                }
                document.subFlowApprover.push(subFlowObj);
              }else {
                document.submitTo = subArr
              }
            }else if (  //当是子流程时
              this.selectData[i].subFlowApproverData &&
              this.selectData[i].subFlowApproverData.nodeid == this.nextNodeIds
            ) {
              let subflowData
              if(this.subFlowGroupNum && this.subFlowGroupNum == -2) {
                subflowData = Object.assign({}, this.selectData[i].subFlowApproverData);
                let arr = subflowData.approver[0]? subflowData.approver[0].userids:[];
                if(arr && arr.length > 0) {
                  let approvers = [];
                  for(let k=0; k<arr.length; k++) {
                    let obj = {};
                    obj.position = k+1;
                    let id = [];
                    id.push(arr[k]);
                    obj.userids = id;
                    approvers.push(obj);
                  }
                  let subFlow = {};
                  subFlow.approver = approvers;
                  subFlow.nodeid = subflowData.nodeid;
                  document.subFlowApprover.push(subFlow);
                  console.log("subflowData--->",subflowData);
                   console.log("document--->",document);
                  
                }
              }else {
                subflowData = Object.assign({}, this.selectData[i].subFlowApproverData);
                for(let j=0; j<subflowData.approver.length; j++) {
                  delete subflowData.approver[j].rows
                }
                document.subFlowApprover.push(subflowData);
              }
              
            }
          }
        }
        API.submitFlow(appId, docId, document, {
          onSucess: response => {
            this.firstSubmission = true;
            let status;
            let prompt;
            if (response.data.errcode == 0) {
              status = "SUCCESS";
              prompt = response.data.data;
              this.runAfterAction(status, prompt);
              
            } else if (response.data.errcode == 4001) {
              status = "ERROR";
              //this.$emit("closePopup", status);
              let prompt = response.data.errors[0].errmsg
                ? response.data.errors[0].errmsg
                : response.data.errmsg;
              this.$notify.error({
                title: response.data.errmsg,
                message: prompt
              });
              
            }
          }
        });
      }
    },

     //执行脚本后
    runAfterAction(status, prompt) {
      let document = this.documentData;
      let isRelate = '';
      let _flowType = this.act.flowType; //提交为80
      this.$api.submitRrunAfterActionScript( 
        this.$root.appid,
        this.act.id,
        document,
        document.docId,
        document.viewId,
        document.formId,
        document.templateForm,
        document.parentId,
        isRelate,
        _flowType,
        {
          onSucess: response => {
            if (response.data.errcode == 0 && !response.data.data) {
              this.$notify({
                title: '成功',
                message: prompt,
                type: 'success'
              });
              this.$emit("closePopup", status);
            }else if(response.data.errcode == 0 && response.data.data) {
              let sta = "ERROR";
              let isClose = true;
              this.$emit("closePopup", sta, isClose);
              debugger
            }
          }
        }
      );
    },

    //隐藏小意见框
    hiddenSuggest() {
      console.log("隐藏小意见框");
      this.isOrSuggest = !this.isOrSuggest;
    },
    changeDiv(){
      this.currentAct = !this.currentAct;
    },
    
    //获取返回的数据
    getSuggest(){
      let userId = this.$store.state.userId;
      this.$api.getCommonOpinions(this.$root.user.id, {
        onSucess: response => {
          this.allSuggests = response.data.data;
        }
      });
    },

    //节点数据
    getSubmission(){
      if(this.act && this.act.type == 47) { //流程回退
        if(this.act.workFlowType == 1) { //自由流程
          let instanceId;
          for(let i=0; i<this.approvers.length; i++) {
            instanceId = this.approvers[i].instanceId
          }
          this.$api.getHisActorsFreeFlow(this.$root.appid, instanceId, {
            onSucess: response => {
              this.backNodes = response.data.data
            }
          })
        }else if(this.act.workFlowType == 0) {
          let formData = this.buildFormData;
          formData.stateId = this.stateId;
          let docId = formData.id,
              id = formData.id;
          let formId = formData.formId;
          let document = {
            applicationId: this.$root.appid,
            docId: docId,
            document: formData,
            formId: formId,
            id: id,
            parentId: "",
            templateForm: "",
            viewId: ""
          };
          this.$api.getBackPanel(this.$root.appid, docId, document,{
            onSucess: response => {
              this.backNodes = response.data.data.backNodes;
              this.selectBackNodes = this.backNodes[0].id
              this.currentNodeId = response.data.data.currentNodeId; //当前节点ID
              this.flowId = response.data.data.flowId;
            }
          });
        }
      }else {
        let formData = this.buildFormData;
        formData.stateId = this.stateId;
        let appId = this.$root.appid;
        let docId = formData.id,
          id = formData.id;
        let formId = formData.formId;
        let document = {
          applicationId: appId,
          docId: docId,
          document: formData,
          formId: formId,
          id: id,
          parentId: "",
          templateForm: "",
          viewId: ""
        };
        API.getFlowPanel(appId, docId, document, {
          onSucess: response => {
            let nodesArr = response.data.data.nextNodes;
            let min;
            for (let i = 0; i < nodesArr.length; i++) {
              for (let j = i; j < nodesArr.length; j++) {
                if (nodesArr[j].orderNum > -1) {
                  if (nodesArr[i].orderNum > nodesArr[j].orderNum) {
                    min = nodesArr[j];
                    nodesArr[j] = nodesArr[i];
                    nodesArr[i] = min;
                  }
                }
              }
            }
            this.selectData = nodesArr;
            this.selectData.forEach(item => {
              if (item.isToPerson) {
                this.isToPerson = item.isToPerson;
              }
            });
            this.isSplit = response.data.data.isSplit;
            this.currentNodeId = response.data.data.currentNodeId; //当前节点ID
            this.isAppentCirculator = response.data.data.isAppentCirculator; //是否抄送;
            this.flowId = response.data.data.flowId;
            if (this.isSplit) {
              //复选
              this.nextNodeIds = [];
              this.selectData.forEach(item => {
                if (item.checked == true) {
                  this.nextNodeIds.push(item.id);
                }
              });
            } else {
              //单选
              this.selectData.every(item => {
                if (item.checked == true) {
                  this.nextNodeIds = item.id;
                }
                return false;
              });
            }
          }
        });
      }
    }
  }
}
</script>

