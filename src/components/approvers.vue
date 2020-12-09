<template>
  <span>
    <span class="flow-his">
      <span @click="handleDialog" v-if="!finished"> 
        <!-- v-if="approversData[0].nodes[0].auditors.length>0" -->
        <span class="formFlowstateicon obpm-glyphicon" style="color:#4ead49;"></span>
        流程状态
      </span>
      <span @click="openDialog">
        <img src="../assets/images/icon_workflow_history.png">
        流程历史
      </span>
    </span>

    <!-- 流程状态 -->
    <div class="approvers" v-if="isHandleDialog">
      <div class="a-wrap">
        <div class="tit">
          <span>处理人</span>
          <span>流程节点</span>
        </div>
        <div v-if="approversNum<5">
          <div class="first-con-le">
            <div v-for="(el, i) in currentApproversList.nodes" :key="i">
              <div class="a-list" v-for="(item, index) in el.auditors" :key="index">
                <span>
                  <!-- 有头像时显示头像，否则显示名字后两位 -->
                  <span v-show="!item.photo" class="s1">{{item.name.substring(item.name.length-2,item.name.length)}}</span>
                  <span class="s2">
                    <img :src="item.photo" />
                  </span>
                </span>
                <span>
                  {{item.name}}
                </span>
                <span>
                  {{currentApproversList.nodes[i].stateLabel}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="first-con" v-if="showAllHandler">
            <div class="a-list" v-for="(item, index) in currentApproversList.nodes[0].auditors" :key="index">
              <span v-if="index<3">
                <!-- 有头像时显示头像，否则显示名字后两位 -->
                <span v-show="!item.photo" class="s1">{{item.name.substring(item.name.length-2,item.name.length)}}</span>
                <span class="s2">
                  <img :src="item.photo" />
                </span>
              </span>
              <span v-if="index<3">
                {{item.name}}
              </span>
              <span v-if="index<3">
                {{currentApproversList.nodes[0].stateLabel}}
              </span>
            </div>
            <div class="a-list split-line" @click="AllHandlerData">
              <i class="left"></i>
              <i class="flowstateicon"></i>
              <i class="right"></i>
            </div>
          </div>
          <div class="second-con" v-if="!showAllHandler">
            <div class="divider"  @click="AllHandlerData">
              <i class="left"></i>
              <i class="flowstateicon"></i>
              <i class="right"></i>
            </div>
            <div class="a-list" v-for="(item, index) in allNodes" :key="index">
              <div class="list-wrap" >
                <span>
                  <span v-show="!item.photo" class="s1">{{item.name.substring(item.name.length-2,item.name.length)}}</span>
                  <span class="s2">
                    <img :src="item.photo">
                  </span>
                </span>
                <span>
                  {{item.name}}
                </span>
                <span>
                  {{item.stateLabel}}
                </span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- 流程历史 -->
    <el-dialog 
      title="流程历史" 
      :visible.sync="dialogVisible" 
      top="20px" 
      class="abow" 
      :lock-scroll="true" 
      width="62%" 
      :before-close="handleClose">
      <div class="dia-con">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane name="first">
            <span slot="label">
              <i class="el-icon-date"></i> 
              流程历史
            </span>
            <div class="card-btn">
              <div class="btn-list">
                <span @click="cutPage(true)" :class="[isActive == true ? activeClass : '']">时间轴</span>
                <span @click="cutPage(false)" :class="[isActive == false? activeClass : '']">列表</span>
              </div>
              <div>
                <el-input
                  placeholder="输入查询条件"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="handleIconSearch(searchValue)"
                  v-model="searchValue">
                </el-input>
              </div>
             
            </div>
            <div class="list-con" :class="[isActive == true ? isOrHidden : currentCard]">
              <div class="step">
                <div class="p-location">
                  <span class="location" v-for="(item, index) in reverseTableData" :key="index">
                    <div class="status" v-show="isShowStatus">
                      <span>
                        {{item.startNodeName}}
                        <i class="fa fa-hand-o-right"></i>
                      </span>
                      <!-- <span>流转</span> -->
                      <span v-if="item.flowOperation == '81'">回退</span>
                      <span v-else-if="item.flowOperation == '85'">回撤</span>
                      <span v-else-if="item.flowOperation == '88'">挂起</span>
                      <span v-else-if="item.flowOperation == '89'">恢复</span>
                      <span v-else-if="item.flowOperation == '91'">会签</span>
                      <span v-else>流转</span>
                      <span>{{item.targetNodeName}}</span>
                    </div>
                    <span class="local-left">{{item.processtime}}</span>
                    <span class="local-cen">
                      <div class="cen-pic">
                        <!-- 有头像时显示头像，否则显示名字后两位 -->
                        <span>{{item.auditorName.substring(item.auditorName.length-2,item.auditorName.length)}}</span>
                        <!-- <span >
                          <img src="../assets/images/face.jpg" />
                        </span> -->
                      </div>
                      <div class="cen-name">
                        <span>{{item.auditorName}}</span>
                        <span v-if="index+1 != stepLength"></span>
                      </div>
                    </span>
                    <span class="local-right">
                      <div class="info">
                        <div class="info-top">
                          <div @mouseover="mover('YES')" @mouseout="mover('NO')">
                            <span>{{item.startNodeName}}</span>
                            <span><img src="../assets/images/ok.png"></span>
                            <div class="iconfont-h5 iconfont-e065 icon-ffc107"></div>
                            
                          </div>
                          <div>
                            {{item.duration}}
                          </div>
                        </div>
                        <div class="photo" >
                          <div>
                            {{item.attitude}}
                          </div>
                          <div>
                            <img :src="item.signatureImageDate" height="32px" @click="bigPhoto(item.signatureImageDate)">
                          </div>
                        </div>
                      </div>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div class="list-con" :class="[isActive == false ? isOrHidden : currentCard]">
               <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="startNodeName"
                  label="审批节点"
                  width="180"
                  align="center"
                  >
                </el-table-column>
                <el-table-column
                  prop="auditorName"
                  label="办理人"
                  align="center"
                  >
                </el-table-column>
                <el-table-column
                  prop=""
                  label="签核动作"
                  align="center"
                  >
                  <template slot-scope="scope">
                    <span v-if="scope.row.flowOperation == '81'">回退</span>
                    <span v-else-if="scope.row.flowOperation == '85'">回撤</span>
                    <span v-else-if="scope.row.flowOperation == '88'">挂起</span>
                    <span v-else-if="scope.row.flowOperation == '89'">恢复</span>
                    <span v-else-if="scope.row.flowOperation == '91'">会签</span>
                    <span v-else>流转</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="签核意见"
                  align="center"
                  >
                  <!-- 图片的显示 -->
                  <template   slot-scope="scope"> 
                    {{scope.row.attitude}}           
                    <img :src="scope.row.signatureImageDate" style="height:32px;">
                  </template>        
                </el-table-column>
                <el-table-column
                  prop=""
                  label="接收人"
                  align="center"
                  >
                  <!-- 图片的显示 -->
                  <template slot-scope="scope">
                    {{scope.row.receiverInfo | setReceiver}}
                    <!-- {{scope.row.receiverInfo?JSON.parse(scope.row.receiverInfo).users[0].username:''}} -->
                  </template>       
                </el-table-column>
                
                <el-table-column
                  prop="processtime"
                  label="办理时间"
                  align="center"
                  width="200"
                  >
                </el-table-column>
              </el-table>

            </div>
          </el-tab-pane>
           <el-tab-pane name="second">
            <span slot="label"><i class="el-icon-date"></i>流程图</span>
            <div class="flow-chart" style="font-size:11px; font-weight:bold;">
              <div class="free-flow" v-if="approversData && approversData[0].flowName == '自由流程'">
                <i class="fa fa-file-image-o fa-5x" aria-hidden="true"></i>
                <div>自由流程无流程图</div>
              </div>
              <div v-else>
                <div>
                  说明文字：	
                  1、<span style="color:red;">红线</span>节点为流程当前节点；2、<span style="color:green;">绿线</span>已处理的流程路线；3、<span style="color:black;">黑线 </span>待处理的流程路线；<br />
                  &emsp;&emsp;&emsp;&emsp;&emsp;&ensp;4、<span style="background:yellow;color:black;">黄色背景</span>代表流程已终止。
                </div>
                <div class="flow-pic">
                  <img :src="`${flowChart+'?'+now}`"/>
                </div>
              </div>
            </div>
            <!-- src="../../uploads/billflow/NRo4wpRuOejquOQGZxz.jpg?tempid=0.6988591636254727 "/> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <div class="big-pic" v-show="show" @click.prevent.stop="hiddenBigPhoto">
      <div class="pic-container" title="点击关闭" @click.prevent.stop="hiddenBigPhoto">
        <img :src="bigPhotoSrc">
      </div>
    </div>
  </span>
</template>
<script>
import API from "@/api.js";
import { constants } from 'crypto';
import { connect } from 'tls';
export default {
  props: ["flowinfo","approversData", "stateId"],
  computed:{
    now(){
        return Date.now();
    }
  },
  data: function() {
    return {
      searchValue:'',
      dialogVisible:false,
      isHandleDialog:false,
      activeName: 'first',
      isActive: true,
      activeClass: 'active',
      tableData:[],
      isOrHidden:"hidden-card",
      currentCard:"no-hidden",
      stepLength:'',
      show:false,
      bigPhotoSrc:'',
      flowChart:'',
      flowPhoto:'',
      showAllHandler:true,
      reverseTableData:[],
      isShowStatus:false,
      currentApproversList:'',
      finished:'',
      approversNum:'',
      allNodes: [],
      
    };
  },
  mounted:function(){
    //this.getAvatar()
    this.setCurrentApprovers();
  },

  methods: {
    handleIconSearch() {
      this.openDialog();
    },
    mover(val) {
      if(val == 'YES') {
        this.isShowStatus = true;
      }else if(val == 'NO') {
        this.isShowStatus = false;
      }
    },
    setCurrentApprovers(){
      
      if(this.flowinfo.approvers) {
        if(!this.flowinfo.approvers[0].nodes[0].nodeId) {
          this.finished = true;
        }
        for(let i=0; i<this.flowinfo.approvers.length; i++) {
          if(this.flowinfo.stateId == this.flowinfo.approvers[i].instanceId) {
            this.currentApproversList = this.flowinfo.approvers[i];
            let arr = this.flowinfo.approvers[i];
            let approversNum = 0 
            for(let i=0; i<arr.nodes.length; i++) {
              approversNum += arr.nodes[i].auditors.length;
              let nodes = arr.nodes[i];
              if(nodes.auditors.length > 0) {
                for(let j=0; j<nodes.auditors.length; j++) {
                  nodes.auditors[j].stateLabel = nodes.stateLabel;
                }
                this.allNodes = this.allNodes.concat(nodes.auditors);
              }
              
              
            }
            this.approversNum = approversNum;
          }
        }
      }
    },
    // getAvatar(){
    //   if(this.approversData && this.approversData[0].nodes[0]) {
    //     let allAvatar = this.approversData[0].nodes[0].auditors;
    //     for(let i=0; i<allAvatar.length; i++) {
    //       API.getAvatar(
    //         allAvatar[i].id,
    //         {
    //           onSucess: response => {
    //             this.approversData[0].nodes[0].auditors[i].photo = response.data.data
    //           }
    //         }
    //       )
    //     }
    //   }
    // },

    AllHandlerData(){
      this.showAllHandler = !this.showAllHandler;
    },
    hiddenBigPhoto(){
      this.show = false;
    },
    bigPhoto(picSrc) {
      this.bigPhotoSrc = picSrc;
      this.show = true;
    },
    openDialog() {
      this.dialogVisible = true;
      let appId = this.$parent.getAppId(),
          docId = this.$parent.getDocId();
      let content = ''
      if(this.searchValue) {
        content = this.searchValue;
      }
      API.getFlowHistorys(
        appId,
        docId,
        content,
        {
          onSucess: response => {
            let allData = response.data.data;
            // for(let j=0; j<allData.length; j++) {
            //   if(j>0) {
            //     let mss = Date.parse(allData[j].processtime) - Date.parse(allData[j-1].processtime);
            //     var days = parseInt(mss / (1000 * 60 * 60 * 24));
            //     var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            //     var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            //     var seconds = (mss % (1000 * 60)) / 1000;
            //     if (days > 0) {
            //       let useTime =  "耗时" + days + "天" + hours + "小时" + minutes + "分钟";
            //       allData[j].duration = useTime;
            //     }else {
            //       let useTime =  "耗时" + hours + "小时" + minutes + "分钟"+ seconds + "秒";
            //       allData[j].duration = useTime;
            //     }
            //   }
            // }

            // allData.forEach(item => {
            //   let ymd = item.processtime;
            //   let showTime = this.calculateTime(ymd);
            //   item.processtime = showTime;
            // });
            this.tableData = response.data.data;
            this.reverseTableData = response.data.data;//.reverse();
            this.stepLength = this.tableData.length;
          }
        }
      );

      
      let instanceId = this.stateId;
      let dateTime =  (new Date()).getTime();
      this.flowPhoto = this.stateId;
      API.getFlowchart(
        this.$root.appid,
        docId,
        instanceId,
        dateTime,
        {
          onSucess: response => {
            let path = window.location.host;
            //this.flowChart = "http://" + path + "/obpm/" + response.data.data.currentFlowChart;
            this.flowChart = "/obpm/" + response.data.data.currentFlowChart
          }
        }
      );
    },

    /**
     * 计算日期差
     * @param date,date2
     */
    numOfDayCalc: function (date, date2) {
        let startDateArr = date.split(/[- :]/);
        let startDate = new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2]);
        let years,
            month,
            nowDate;
        if (!date2 || date2 == "") {
            years = new Date().getFullYear();
            month = new Date().getMonth();
            let date = new Date().getDate();
            nowDate = new Date(years, month, date);
        } else {
            nowDate = new Date(date2);
        }
        let msDate = nowDate.getTime() - startDate.getTime();
        //计算出相差天数
        let numOfDay = Math.floor(msDate / (24 * 3600 * 1000));

        return numOfDay;
    },

    calculateTime(_time) {
      let _timeAgo;
      let flowTime = new Date(_time);
      let timeFixArr = _time.split(/[- :]/);
      let timeFixDate = new Date(timeFixArr[0], timeFixArr[1] - 1, timeFixArr[2], timeFixArr[3], timeFixArr[4]);
      let Month = timeFixDate.getMonth() + 1;
      let Day = timeFixDate.getDate();
      let Hour = timeFixDate.getHours();
      let Minute = timeFixDate.getMinutes();
      let _date = _time.substr(0, _time.indexOf(" "));
      if (this.numOfDayCalc(_date) > 2) {
        if (Month >= 10) {
          _timeAgo = Month + "-";
        } else {
          _timeAgo = "0" + Month + "-";
        }
        if (Day >= 10) {
          _timeAgo += Day + " ";
        } else {
          _timeAgo += "0" + Day;
        }
      } else if (this.numOfDayCalc(_date) == 2) {
        _timeAgo = "前天 ";
        if (Hour >= 10) {
          _timeAgo += Hour + ":";
        } else {
          _timeAgo += "0" + Hour + ":";
        }
        if (Minute >= 10) {
          _timeAgo += Minute;
        } else {
          _timeAgo += "0" + Minute;
        }
      } else if (this.numOfDayCalc(_date) == 1) {
        _timeAgo = "昨天 ";
        if (Hour >= 10) {
          _timeAgo += Hour + ":";
        } else {
          _timeAgo += "0" + Hour + ":";
        }
        if (Minute >= 10) {
          _timeAgo += Minute;
        } else {
          _timeAgo += "0" + Minute;
        }
      } else if (this.numOfDayCalc(_date) == 0 && this.daysCalc(_time).hours > 0) {
        _timeAgo = this.daysCalc(_time).hours + " 小时前 ";
      } else if (this.numOfDayCalc(_date) == 0 && this.daysCalc(_time).hours <= 0 && this.daysCalc(_time).minutes > 5) {
        _timeAgo = this.daysCalc(_time).minutes + " 分钟前 ";
      } else {
        _timeAgo = "刚刚";
      }
      return _timeAgo;
    },

      /**
     * 计算时间差
     * @param date,date2
     */
    daysCalc: function (date, date2) {
        let startDateArr = date.split(/[- :]/);
        let startDate = new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2], startDateArr[3], startDateArr[4], (startDateArr[5] != undefined && startDateArr[5] != "" ? startDateArr[5] : 0));
        let nowDate;
        if (!date2 || date2 == "") {
          nowDate = new Date();
        } else {
          nowDate = new Date(date2);
        }
        let msDate = nowDate.getTime() - startDate.getTime();
        //计算出相差天数
        let days = Math.floor(msDate / (24 * 3600 * 1000));
        //计算出小时数
        let leave1 = msDate % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);
        //alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");
        let timeCalc = {
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
        return timeCalc;
    },

    handleClose() {
      this.dialogVisible = false;
    },
    handleDialog() {
      this.isHandleDialog = !this.isHandleDialog;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    cutPage(val){
      console.log(val);
      this.isActive = val;
    }
  },
  filters: {
    setReceiver: function(value) {
      if(value) {
        let arr = JSON.parse(value).users;
        let name = '';
        if(arr && arr.length > 0) {
          for(let i=0; i<arr.length; i++) {
            name += arr[i].username + ';';
          }
        }
        name = name.replace(/^(\s|;)+|(\s|;)+$/g, '');
        return name;
      }
      
      
    }
  }
};
</script>

<style lang="scss">
  //流程历史按钮
.flow-his {
  float:right;
  margin-right: 30px;
  height:60px;
  line-height:60px;
  &>span {
    width:90px;
    font-size: 14px;
    margin-left: 20px;
    color: #333333;
    cursor: pointer;
  }
}
.approvers {
  position:relative;
  .a-wrap {
    background: white;
    position:absolute;
    right:110px;
    top:50px;
    width:228px;
    min-height:88px;
    border:1px solid #cccccc;
    z-index: 10;
    .tit {
      display:-webkit-flex;
      display: flex;
      justify-content: space-between;
      height:40px;
      line-height:40px;
      padding:0 13px 0 13px;
      font-size:14px;
      border-bottom: 1px solid #cccccc;
    }
    .first-con {
      height:176px;
      overflow: hidden;
    }
    .first-con-le {
      min-height:40px;
      overflow: hidden;
    }
    .second-con {
      overflow-y:scroll;
      height:360px;
      .a-list {
        height:48px;
        width:100%;
        .list-wrap {
          position: relative;
          width:100%;
          line-height:48px;
          font-size: 14px;
          display:-webkit-flex;
          display: flex;
          justify-content: space-between;
          align-items: center;
            &>span:first-child {
            display: inline-block;
            width:32px;
            height:30px;
            line-height: 30px;
            text-align: center;
            color:white;
            font-size: 12px;
            border-radius: 3px;
            overflow: hidden;
            .s1 {
              display: inline-block;
              width:100%;
              height:100%;
              background: #428bcb;
              // display: none;
            }
            img {
              width:100%;
            }
          }
          &>span:nth-child(2) {
            max-width: 110px;
            height:30px;
            line-height: 30px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            
          }
        }
       
      }
      .a-list:nth-child(4){
        margin-bottom: 30px;
      }
      // .divider {
      //   width:0;
      //   cursor: pointer;
       
      // }
      .divider {
        cursor: pointer;
        position: relative;
        text-align: center;
        left:0px;
        top:160px;
        height:1px;
        line-height: 1px;
        .left:before{
          content: "";  
          position: absolute;  
          top:-3px;
          left:10px;
          width: 86px;
          height: 10px;
          border-bottom:1px dotted black;
        }
        .right:before {
          content: "";  
          position: absolute;  
          top:-3px;
          right:10px;
          width: 89px;
          height: 10px;
          border-bottom:1px dotted black;
        }
      }
    }
    .a-list {
      height:48px;
      line-height:48px;
      font-size: 14px;
      padding: 0 13px 0 13px;
      display:-webkit-flex;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &>span:first-child {
        display: inline-block;
        width:32px;
        height:30px;
        line-height: 30px;
        text-align: center;
        color:white;
        font-size: 12px;
        border-radius: 3px;
        overflow: hidden;
        .s1 {
          display: inline-block;
          width:100%;
          height:100%;
          background: #428bcb;
          // display: none;
        }
        img {
          width:100%;
        }
      }
      &>span:nth-child(2) {
        max-width: 110px;
        height:30px;
        line-height: 30px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        
      }
    }
    .a-list:nth-child(4){
      margin-bottom: 30px;
    }
    .split-line {
      cursor: pointer;
      position: absolute;
      left:97px;
      top:185px;
      height:30px;
      line-height: 30px;
      .left:before{
        content: "";  
        position: absolute;  
        top:14px;
        left:30px;
        width: 88px;
        height: 1px;
        border-bottom:1px dotted black;
      }
      .right:before {
        content: "";  
        position: absolute;  
        top:14px;
        right:30px;
        width: 88px;
        height: 1px;
        border-bottom:1px dotted black;
      }
    }
  }
}

//标签页样式
.dia-con {
  width:100%;
  height:100%;
  .el-tabs__nav-scroll {
    width:100%;
    height:100%;
    .el-tabs__nav {
      height:100%;
      width:100%;
      .el-tabs__item{
        padding: 0 20px;
        height: 40px;
        width:50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        line-height: 40px;
        display: inline-block;
        list-style: none;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        position: relative;
        text-align: center;
      }
    }
  }
  .el-tabs--border-card {
    background: #FFF;
    border: 1px solid white;
    -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0);
    box-shadow: 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0);
  }
}
.flow-chart {
  width:100%;
  height:400px;
  .flow-pic {
    width:100%;
    height:360px;
    margin-top:5px;
    //border:1px solid #ccc;
    img {
      width:100%;
      height:100%;
      
    }
  }
  .free-flow {
    width: 100%;
    height:360px;
    text-align: center;
    color: #e6e6e6;
    padding-top: 100px;
    box-sizing: border-box;
    .fa-5x {
      font-size: 5rem;
    }
    div {
      margin-top: 10px;
    }
  }
}

.card-btn {
  width:100%;
  height:36px;
  line-height:36px;
  display: -webkit-flex;
  display: flex;
  // justify-content: flex-end;
  justify-content: space-between;
  color:#92a1ab;
  .btn-list {
    display: -webkit-flex;
    display: flex;
    &>span {
      display: inline-block;
      height:36px;
      line-height:36px;
      padding:0 10px 0 10px;
      border:1px solid #cccccc;
      cursor: pointer;
    }
    &>span:first-child{
      border-right:0;
      border-radius:4px 0 0 4px;
    }
    &>span:nth-child(2){
      border-radius:0 4px 4px 0;
    }
  }
  
}
.list-con {
  margin-top:10px;
  width:100%;
  height:380px;
  overflow: auto;
  .step {
    position:relative;
    width:100%;
   .p-location {
      .location {
        position: relative;
        display: inline-block;
        width:93%;
        height:130px;
        display: -webkit-flex;
        display:flex;
        flex-direction: row;
        margin-bottom: 10px;
        .status {
          position: absolute;
          top: 35px;
          left: 0;
          z-index: 10;
        }
        .local-left {
          display: inline-block;
          width:80px;
          height:100%;
          text-align:center;
          padding-top:5px;
          margin-right:10px;
        }
        .local-cen {
          display:inline-block;
          width:80px;
          height:100%;
          text-align:center;
          margin-right: 10px;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          align-items: center;
          .cen-pic {
            width:100%;
            &>span:first-child{
              display: inline-block;
              width:40px;
              height:40px;
              line-height: 40px;
              text-align: center;
              background: #428bcb;
              color: white;
              border-radius: 3px;
              //display: none;
            }
            &>span:nth-child(2) {
              display: inline-block;
              border-radius: 3px;
              width:40px;
              height:40px;
              overflow: hidden;
              img {
                width:100%;
                height:100%;
              }
            }
          }
          .cen-name>span:nth-child(2) {
            display:block;
            width:1px;
            height:50px;
            position: relative;
            left:-8px;
          }
        }
        .local-right {
          display:inline-block;
          width:600px;
          height:100%;
          padding: 10px 10px 0 10px;
          display:-webkit-flex;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          background: #f7f7f7;
          border-radius: 5px;
          .info {
            .info-top {
              cursor: pointer;
              display: -webkit-flex;
              display: flex;
              justify-content: space-between;
              &>div:first-child>span {
                margin-right: 5px;
              }
            }
          }
          .info>div:first-child {
            margin-bottom: 5px;
          }
          .photo {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.big-pic {
  position: absolute;
  left:0;
  top:0;
  width:100%; 
  height:100%;
  background: rgba(000,000,000,0);
  z-index: 9000;
  .pic-container {
    position: absolute;
    left:230px;
    top:90px;
    width:410px;
    height:410px;
    background: white;
    border-radius: 5px;
    -webkit-box-shadow: 0 2px 6px #ccc;
    box-shadow: 0 2px 6px #ccc;
    display:-webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width:300px;
    }
  }
}
.hidden-card {
  display: block;
}
.no-hidden {
  display: none;
}
.active {
  background:#449d44;
  color:white;
}
.active:hover {
  background:#449d44;
  color:white;
}
//弹出窗大小
.abow {
  display: -webkit-box;
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 80%;
    overflow: hidden;
    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
    }
    .el-dialog__footer {
      position: absolute;
      right:0;
      bottom:0;
      width:100%;
      height:60px;
      z-index: 2;
      background: white;
      .dialog-footer {
        position: absolute;
        right:25px;
        bottom:15px;
        
      }
    }
  }
}

.el-tabs__content {
  height:100%;
}
</style>

