<template>
  <div id="main_pending" v-loading="loading">
    <div class="main_pending-left">
      <div class="main_pending-left-dyspepsia" @click="primaryNavigationSystem" >
        <span>{{preserveObj.name}}</span>
        <a :class="[!currentSelectFlowId?'headNum':'']">
          <b>{{preserveObj.total}}</b>
        </a>
      </div>
      <ul>
        <li
          class="soft-heading"
          v-for="(item,index) in preserve"
          :key="index"
          @click="omniselector(item.id)"
        >
          <span :class="[currentSelectFlowId==item.id?'headTitle':'']">{{item.name}}</span>
          <a :class="[currentSelectFlowId==item.id?'headNum':'']">
            <b>{{item.num}}</b>
          </a>
        </li>
      </ul>
    </div>

    <!--右边-->
    <div class="main_pending-right">
      <div class="main_pending-right-theme">
        <div class="main_pending-right-right">
          <el-input 
            v-model="backlogRight" 
            placeholder="主题" 
            @input="activate">
          </el-input>
          <el-input
            disabled 
            v-model="backlogProposer" 
            placeholder="申请人">
          </el-input>
          <span class="top-btn">
            <el-button @click="AddPopup">添加</el-button>
          </span>
          <span class="top-btn">
            <el-button @click="eliminating">清除</el-button>
          </span>
          <span class="top-btn">
            <el-button type="primary" @click="flowcenters">
              <span class="el-icon-search">搜索</span>
            </el-button>
          </span>
        </div>
      </div>
      <div class="view-list">
        <el-scrollbar class="scrollbar">
          <el-table 
            class="view-table" 
            :data="Formrendering"
            :row-class-name="tableRowClassName"
            @row-click="onRowClick"
          >
            <el-table-column 
              label="申请人" 
              align="center">
              <template slot-scope="scope">
                <div class="applicant">
                  <div class="avatar-box">
                    <span class="avatar">
                      {{scope.row.initiator.substring(scope.row.initiator.length-2,scope.row.initiator.length)}}
                    </span>
                    <span class="red-dot" v-if="!scope.row.read"></span>
                  </div>
                  <div class="app-right">
                    {{scope.row.initiatorDept}}{{scope.row.initiatorDept&&scope.row.initiator?'  ':''}}{{scope.row.initiator}}
                  </div>
                </div>
                <!--  -->
              </template>

            </el-table-column>
            <el-table-column 
              label="主题" 
              align="center">
              <template slot-scope="scope">
                <span v-html="scope.row.subject?scope.row.subject:''">
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="lastProcessTime" label="最后处理时间" align="center"></el-table-column>
            <el-table-column prop="lastFlowOperation" label="动作" align="center"></el-table-column>
            <el-table-column prop="stateLabel" label="状态" align="center"></el-table-column>
          </el-table>
        </el-scrollbar>
        <div class="page">
          <el-pagination
            background
            small
            layout="prev, pager, next,jumper"
            :page-size="10"
            :current-page="1"
            :total="row_count"
            @current-change="paging($event)"
          ></el-pagination>
        </div>
        
      </div>
      
    </div>
    <!--流程指定审批人弹窗-->
    <div class="comm-dialog">
      <comm-dialog
        title="指定审批人"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
      >
        <form_selectApprover_flowpanel
          slot="body"
          :isUpcoming="isUpcoming"
          @action = "selectApprover"
        />
      </comm-dialog>
    </div>
  </div>
</template>
<script>
import form_selectApprover_flowpanel from "@/components/form_selectApprover_flowpanel.vue";
import axios from "axios";
import dateFormat from '@/assets/js/dateFormat'; 
export default {
  inject: ["reload"],
  components: {
    form_selectApprover_flowpanel,
  },
  data() {
    return {
      loading:true,
      preserve: [],
      preserveObj: {},
      putaside: [],
      Formrendering: [], //表格里面首次渲染的数据
      backlogRight: "", //主题框的v-model
      backlogProposer: "", //申请框的v-model
      ChildList:'',//按部门的穿梭框的v-model
      dialogVisible: false, //弹出框是否弹出
      activeName: "first", //标签页默认选中第一个
      Storage: [], //储存按角色为树形的用户数据
      Shuttle: "", //按角色的穿梭框的v-model
      userSublist: [], //按角色储存子列表的数据
      DepartmentSublist:[],//按部门储存子列表数据
      //按部门选择的节点展示
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      row_count:0,
      isUpcoming:true,
      initiatorId:'',
      currentSelectFlowId:'',
    };
  },
  created() {
    this.navigation();
    this.flowcenters();
    //this.selectbox();
  },
  methods: {
    selectApprover(name, id) {
      this.dialogVisible = false;
      this.backlogProposer = name;
      this.initiatorId = id;
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
    },
    onRowClick(row, column, event ) {
      console.log("row--->",row.index);
      
      let params = {
        appId: this.$root.appid,
        linkType:'00',
        actionContent:row.formId,
        name: row.formName,
        docId:row.docId,
        _select:row.docId,
        refreshId:'11',
      };
      this.$emit("add-tab", params);
      this.Formrendering[row.index].read = true;
      this.$forceUpdate();

    },
    writeCurrentDate(val){
      let now = new Date(val);
      let year=now.getFullYear(); 
      let month=now.getMonth()+1; 
      let date=now.getDate(); 
      let hour=now.getHours(); 
      let minute=now.getMinutes(); 
      let second=now.getSeconds(); 
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    },

    //服务器返回待办导航的结果
    navigation() {
      //applicationId=&isread=true&_=1594186597018
      this.$api.navCarboncopy(
        {
          applicationId: this.$root.appid,
          isread: true,
          _:new Date().getTime(),
        },
        {
          onSucess: res => {
            let newData = res.data.data[0].carboncopyFlowList.map(item => {
              return {
                id: item.id,
                name: item.name,
                num: item.num
              };
            });
            this.preserveObj = {
              name: res.data.data[0].name,
              total: newData[newData.length-1].num,
            }
            this.preserve = newData.slice(0,newData.length-1);
          }
        }
      )
    },
   
    //获取待办事项
    flowcenters() {
      let appId = this.$root.appid;
      let params = {
          title: this.backlogRight,
          linesPerPage: 10,
          pageNo: 1,
          initiatorId: this.initiatorId,
          flowId: this.currentSelectFlowId,
          isRead: true,
          isMyWorkFlow: false,
          appId: this.$root.appid,
          _: new Date().getTime(),
        }
      this.$api.getCarboncopyList(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiator: item.initiator,
                initiatorDept: item.initiatorDept,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//this.writeCurrentDate(item.lastProcessTime), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流转"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                read:item.read,
                formName: item.formName,
              };
            });
            this.Formrendering = newData;
            this.loading = false;
          }
        }
      )
    },
    //清除主题框和申请框里面面对数据
    eliminating() {
      this.backlogProposer = '';
      this.initiatorId = '';
    },
    //分页请求
    paging(num) {
      let appId = this.$root.appid;
      let params = {
          title: this.backlogRight,
          linesPerPage: 10,
          pageNo: num,
          initiatorId: this.initiatorId,
          flowId: this.currentSelectFlowId,
          isRead: true,
          isMyWorkFlow: false,
          appId: this.$root.appid,
          _: new Date().getTime(),
        }
      this.$api.getCarboncopyList(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiator: item.initiator,
                initiatorDept: item.initiatorDept,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//this.writeCurrentDate(item.lastProcessTime), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流转"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                read:item.read,
                formName: item.formName,
              };
            });
            this.Formrendering = newData;
          }
        }
      )
    },
    //主题框的出发事件
    activate() {
      if (this.backlogRight.length === 0) {
        console.log("--->0");
      }
    },
    //点击左侧导航触发待办事项
    omniselector(id) {
      let appId = this.$root.appid;
      this.currentSelectFlowId = id;
      let params = {
          title: this.backlogRight,
          linesPerPage: 10,
          pageNo: 1,
          initiatorId: this.initiatorId,
          flowId: id,
          isRead: true,
          isMyWorkFlow: false,
          appId: this.$root.appid,
          _: new Date().getTime(),
        }
      this.$api.getCarboncopyList(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiator: item.initiator,
                initiatorDept: item.initiatorDept,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//this.writeCurrentDate(item.lastProcessTime), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流转"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                read:item.read,
                formName: item.formName,
              };
            });
            this.Formrendering = newData;
          }
        }
      )
    },
    //点击重新加载表格数据
    primaryNavigationSystem() {
      this.currentSelectFlowId = '';
      let appId = this.$root.appid;
      let params = {
          title: '',
          linesPerPage: 10,
          pageNo: 1,
          initiatorId: '',
          flowId: '',
          isRead: true,
          isMyWorkFlow: false,
          appId: this.$root.appid,
          _: new Date().getTime(),
        }
      this.$api.getCarboncopyList(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiator: item.initiator,
                initiatorDept: item.initiatorDept,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//this.writeCurrentDate(item.lastProcessTime), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流转"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                read:item.read,
                formName: item.formName,
              };
            });
            this.Formrendering = newData;
            this.loading = false;
          }
        }
      )
    },
    //点击添加弹出
    AddPopup() {
      this.dialogVisible = true;
    },
    
  }
};
</script>
<style lang="scss" scoped>

</style>


