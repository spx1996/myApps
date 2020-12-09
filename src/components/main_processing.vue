<template>
  <div id="main_processing" v-loading="loading">
    <div class="main_processing-left">
      <div
        class="main_processing-left-header"
        v-for="item in Navigationlists"
        :key="item.id"
        @click="flowcenters"
      >
        <span>{{item.name}}</span>
        <a :class="[!currentSelectFlowId?'headNum':'']">
          <b>{{total}}</b>
        </a>
      </div>
      <el-scrollbar class="scrollbar">
        <ul>
          <li 
            v-for="item in omniselector" 
            :key="item.id" 
            @click="MediaWikiSidebar(item.id)"
          >
            <span :class="[currentSelectFlowId==item.id?'headTitle':'']">{{item.name}}</span>
            <a :class="[currentSelectFlowId==item.id?'headNum':'']">
              <b>{{item.num}}</b>
            </a>
          </li>
        </ul>
      </el-scrollbar>
    </div>

    <!--右边-->
    <div class="main_processing-right">
      <div class="main_pending-right-theme">
        <div class="main_pending-right-left">
          <div class="main_processing-right-queer">
            <span>我发起的</span>
            <el-switch
              v-model="isMyWorkFlow"
              inactive-color
              active-color="#13ce66"
              @change="reluctance"
            ></el-switch>
          </div>
        </div>

        <div class="main_pending-right-right">
          <div class="right-header">
            <el-select 
              v-model="status" 
              clearable
              @change="isComplete"
            >
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-input 
              v-model="motif" 
              placeholder="主题" 
              @input="ToRefresh">
            </el-input>
            <el-input
              disabled 
              v-model="backlogProposer" 
              placeholder="申请人">
            </el-input>
            <span class="right-btn">
              <el-button @click="AddPopup">添加</el-button>
            </span>
            <span class="right-btn">
              <el-button @click="eliminate">清除</el-button>
            </span>
            <span class="right-btn">
              <el-button type="primary" @click="isComplete">
                <span class="el-icon-search">搜索</span>
              </el-button>
            </span>
          </div>
        </div>
      </div>
      <div class="view-list">
        <el-scrollbar class="scrollbar">
          <el-table 
            class="view-table" 
            :data="preservation" 
            @row-click="onRowClick"
          >
            <el-table-column 
              label="申请人" 
              align="center">
              <template slot-scope="scope">
                <!-- {{scope.row.initiatorDept}}{{scope.row.initiatorDept&&scope.row.initiator?'  ':''}}{{scope.row.initiator}} -->
                <div class="applicant">
                  <div class="avatar-box">
                    <span class="avatar">
                      {{scope.row.initiator.substring(scope.row.initiator.length-2,scope.row.initiator.length)}}
                    </span>
                  </div>
                  <div class="app-right">
                    {{scope.row.initiatorDept}}{{scope.row.initiatorDept&&scope.row.initiator?'  ':''}}{{scope.row.initiator}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="主题" align="center">
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
            @current-change="algorithm"
            :total="row_count"
          ></el-pagination>
          <!-- <el-pagination
            background
            small
            layout="prev, pager, next,jumper"
            :page-size="10"
            :current-page="1"
            :total="row_count"
            @current-change="paging"
          ></el-pagination> -->
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
      Navigationlists: [],
      omniselector: [],
      motif: "", //主题框的v-model
      chkReadOnly: false, //复选框的v-model
      preservation: [], //保存获取的经办事项
      backlogProposer:'',
      options: [{
        value: 'all',
        label: '所有'
      }, {
        value: 'completed',
        label: '已完成'
      }, {
        value: 'pending',
        label: '未完成'
      }],
      status: 'all',
      row_count:0,
      total:0,
      dialogVisible: false,
      initiatorId:'',
      isUpcoming:true,
      currentSelectFlowId:'',
      isMyWorkFlow: false,
    };
  },
  created() {
    this.navigation();
    this.avigraph();
    this.flowcenters();
  },
  methods: {
    selectApprover(name, id) {
      this.dialogVisible = false;
      this.backlogProposer = name;
      this.initiatorId = id;
    },
    isComplete() {
      console.log("isComplete---->",this.status);
      let appId = this.$root.appid;
      let params = {
          applicationId: this.$root.appid,
          status: this.status,
          isMyWorkFlow: false,
          title: this.motif,
          initiatorId: '',
          flowId: this.currentSelectFlowId?this.currentSelectFlowId:'',
          domainId: '',
          initiatorId: this.initiatorId,
          linesPerPage: 10,
          pageNo: 1
        }
      this.$api.getMainProcesseds(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiatorDept: item.initiatorDept,
                initiator: item.initiator,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流程"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                formName: item.formName,
              };
            });
            this.preservation = newData;
          }
        }
      )
    },
    //点击添加弹出
    AddPopup() {
      this.dialogVisible = true;
    },
    onRowClick(row) {
      let params = {
        appId: this.$root.appid,
        linkType:'00',
        actionContent:row.formId,
        name: row.formName,
        docId:row.docId,
        _select:row.docId,
        refreshId:'07',
      };
      this.$emit("add-tab", params);
      //this.$emit("openNewpage", params);
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
    navigation() {
      let appId = this.$root.appid;
      this.$api.getNavsProcesseds(
        appId,
        {
          onSucess: res => {
            let newData = res.data.data.map(item => {
              return {
                id: item.id,
                name: item.name
              };
            });
            this.Navigationlists = newData;
          }
        }
      )
    },
    //获取经办导航
    avigraph() {
      this.$api.getNavsProcesseds(
        this.$root.appid,
        {
          onSucess: res => {
            let newData = res.data.data[0].processedFlowList.map(item => {
              return {
                id: item.id,
                name: item.name,
                num: item.num
              };
            });
            this.omniselector = newData.slice(0,newData.length-1);
          }
        }
      )
    },

    //获取经办事项
    flowcenters() {
      this.currentSelectFlowId = '';
      let appId = this.$root.appid;
      let params = {
            title: this.motif,
            linesPerPage: 10,
            pageNo: 1,
          }
      this.$api.getMainProcesseds(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            this.total = this.total?this.total:res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiatorDept: item.initiatorDept,
                initiator: item.initiator,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流程"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                formName: item.formName,
              };
            });
            this.preservation = newData;
            this.loading = false;
          }
        }
      )
    },
    //数据分页
    algorithm(value) {
      let appId = this.$root.appid;
      let params = {
            applicationId: this.$root.appid,
            status: this.status,
            isMyWorkFlow: this.isMyWorkFlow,
            title: this.motif,
            flowId: '',
            domainId: '',
            initiatorId: this.initiatorId,
            linesPerPage: 10,
            pageNo: value,
          };
      this.$api.getMainProcesseds(
        appId,
        params,
        {
          onSucess: res => {
            let newData = res.data.data.datas.map(item => {
              return {
                docId: item.docId,
                initiatorDept: item.initiatorDept,
                initiator: item.initiator,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//item.lastProcessTime.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流程"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                formName: item.formName,
              };
            });
            this.preservation = newData;
          }
        }
      )

    },
    //清除主题框里面的数据
    eliminate() {
      this.backlogProposer = '';
      this.initiatorId = ''; 
    },
    //当主题框的内容长度为null时重新刷新
    ToRefresh() {
      if (this.motif.length === 0) {
        //this.reload();
      }
    },
    //触发复选框时刷新数据
    UpdatedValue() {
      let appId = this.$root.appid;
      axios({
        url: "obpm" + "/runtime/" + appId + "/flowcenters/processeds",
        method: "get",
        params: {
          isMyWorkFlow: this.chkReadOnly
        }
      })
        .then(res => {
          let newData = res.data.data.datas.map(item => {
            return {
              docId: item.docId,
              initiatorDept: item.initiatorDept,
              initiator: item.initiator,
              lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//item.lastProcessTime.substring(5, 10),
              lastFlowOperation: (item.lastFlowOperation = "流程"),
              stateLabel: item.stateLabel,
              subject: item.subject,
              formName: item.formName,
            };
          });
          this.preservation = newData;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //左侧导航重新加载数据
    MediaWikiSidebar(id) {
      let appId = this.$root.appid;
      this.currentSelectFlowId = id;
      // this.$api.getProcesseds(
      //   appId,
      //   id,
      //   {
      //     onSucess: res => {
      //       let newData = res.data.data.datas.map(item => {
      //         return {
      //           docId: item.docId,
      //           initiator: item.initiator,
      //           initiatorDept: item.initiatorDept,
      //           lastFlowOperation: (item.lastFlowOperation = "流程"),
      //           lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)),//item.lastProcessTime.substring(5, 10),
      //           stateLabel: item.stateLabel,
      //           subject: item.subject,
      //           formName: item.formName,
      //         };
      //       });
      //       this.preservation = newData;
      //     }
      //   }
      // )
      let params = {
          applicationId: this.$root.appid,
          status: this.status,
          isMyWorkFlow: this.isMyWorkFlow,
          title: this.motif,
          flowId: id,
          domainId: '',
          initiatorId: this.initiatorId,
          linesPerPage: 10,
          pageNo: 1
        }
      this.$api.getMainProcesseds(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiatorDept: item.initiatorDept,
                initiator: item.initiator,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流程"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                formName: item.formName,
              };
            });
            this.preservation = newData;
          }
        }
      )



    },
    //点击滑块触发回调刷新数据
    reluctance() {
      let appId = this.$root.appid;
      let params = {
          applicationId: this.$root.appid,
          status: this.status,
          isMyWorkFlow: this.isMyWorkFlow,
          title: this.motif,
          flowId: this.currentSelectFlowId?this.currentSelectFlowId:'',
          domainId: '',
          initiatorId: this.initiatorId,
          linesPerPage: 10,
          pageNo: 1
        }
      this.$api.getMainProcesseds(
        appId,
        params,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                formId: item.formId,
                docId: item.docId,
                initiatorDept: item.initiatorDept,
                initiator: item.initiator,
                lastProcessTime: dateFormat.calculateTime(this.writeCurrentDate(item.lastProcessTime)), //.substring(5, 10),
                lastFlowOperation: (item.lastFlowOperation = "流程"),
                stateLabel: item.stateLabel,
                subject: item.subject,
                formName: item.formName,
              };
            });
            this.preservation = newData;
          }
        }
      )


    }
  }
};
</script>


