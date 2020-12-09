<template>
  <!--首页流程处理的组件-->
  <div class="widget-box">
    <div
      :style="{background:systemData.systemData.titleBarColor}" 
      class="clearfix" 
      @mouseenter="CardShow"
      @mouseleave="CardNone"
    >
      <div class="flow-title">
        <span class="img" v-if="systemData.systemData.icon && systemData.systemData.icon.icontype == 'img'">
          <img :src="Constant.contextPath +'/'+systemData.systemData.icon.icon" alt="">
        </span>
    
        <i v-if="systemData.systemData.icon && systemData.systemData.icon.icontype == 'font'" :class="systemData.systemData.icon.icon" :style="{color:systemData.systemData.icon.iconFontColor}"></i>
        <span :style="{color:systemData.systemData.titleColor,background:systemData.systemData.titleBColor}">流程处理</span>
      </div>
      <div class="btn">
        <div @click.stop.prevent="switchProcess('1')" :class="[currentFlow=='1'?'pro-and-pe':'','pedding']">
          <span>
            待办
          </span>
          <span class="pedding-num">
            <span>
              {{row_count}}
            </span> 
          </span>
        </div>
        <div @click.stop.prevent="switchProcess('2')" :class="[currentFlow=='2'?'pro-and-pe':'','processing']">
          <span>
            经办
          </span>
        </div>
        <!-- <div>
          <i class="el-icon-refresh" v-show="conceal" @click="Partialrefresh"></i>
          <i class="el-icon-d-caret" v-show="conceal"></i>
          <i class="el-icon-close" v-show="conceal"></i>
        </div> -->
      </div>
    </div>
    <div class="system-workflow" v-if="currentFlow=='1'">
      <div class="pedding">
        <div 
          class="pedding-list" 
          v-for="(item,index) in pendingList" 
          :key="index"
          @click="jumpToForm(item)"
        >
          <!-- <div>[{{item.flowName}}]</div>
          <div class="detail">
            <span>{{item.initiatorDept}}{{item.initiator}}&nbsp;{{item.lastProcessTime | formatDate}}</span>
            <span class="approve">
              {{item.stateLabel}}
            </span>
          </div> -->
          <div class="detail">
            <div class="img">
              <img src="../assets/images/face.jpg" />
            </div>
            <div class="detail-row">
              <span class="row-one">
                {{item.flowName}}
              </span>
              <span>
                {{item.initiatorDept}}{{item.initiator}}&nbsp;{{item.lastProcessTime | formatDate}}
              </span>
            </div>
          </div>
          <div class="approve">
            {{item.stateLabel}}
          </div>
        </div>
      </div>
    </div>
    <div class="system-workflow" v-else-if="currentFlow=='2'">
      <div class="pedding">
        <div 
          class="pedding-list" 
          v-for="(item,index) in processedList" 
          :key="index"
          @click="jumpToForm(item)"
        >
          <div class="detail">
            <div class="img">
              <img src="../assets/images/face.jpg" />
            </div>
            <div class="detail-row">
              <span class="row-one">
                {{item.flowName}}
                &nbsp;&nbsp;
                <span v-html="item.subject"></span>
              </span>
              <span>
                {{item.initiatorDept}}{{item.initiator}}&nbsp;{{item.lastProcessTime | formatDate}}
              </span>
            </div>
          </div>
          <div class="approve">
            {{item.stateLabel}}
          </div>
        </div>
      </div>
    </div>
    <!-- <el-card class="box-card">
      <el-tabs v-model="GonnaSelect" type="card">
        <el-tab-pane label="待办" name="pending">
          <div class="pedding">
            <div 
              class="pedding-list" 
              v-for="(item,index) in pendingList" 
              :key="index"
              @click="jumpToForm(item)"
            >
              <div>[{{item.flowName}}]</div>
              <div class="detail">
                <span>{{item.initiatorDept}}{{item.initiator}}&nbsp;{{item.lastProcessTime | formatDate}}</span>
                <span class="approve">
                  {{item.stateLabel}}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="经办" name="processed">
          <div class="pedding">
            <div 
              class="pedding-list" 
              v-for="(item,index) in processedList" 
              :key="index"
              @click="jumpToForm(item)"
              >
              <div>[{{item.flowName}}]&nbsp;&nbsp;
                <span v-html="item.subject"></span>
              </div>
              <div class="detail">
                <span>{{item.initiatorDept}}{{item.initiator}}&nbsp;{{item.lastProcessTime | formatDate}}</span>
                <span class="approve">
                  {{item.stateLabel}}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card> -->
    <div class="more">
      <!-- <el-button size="small" @click="getMore">查看更多</el-button> -->
      <!-- <i class="el-icon-d-arrow-right"></i> -->
      <span class="btn-more" @click="getMore">
        查看更多
      </span>
    </div>
  </div>
  
</template>

<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
import axios from "axios";
import dateFormat from '@/assets/js/dateFormat'; 
export default {
  inject: ["reload"],
  props: ['systemData'],
  created() {
    API.getPendingListWithWidget(1, 5, {
      onSucess: res => {
        this.row_count = res.data.data.rowCount;
        this.pendingList = res.data.data.datas;
      }
    });
    this.finished();
  },
  data: function() {
    return {
      Constant,
      pendingList: [],
      processedList: [],
      conceal: false,
      dispose: true, //控制流程处理隐藏或这显示
      GonnaSelect:'pending',
      row_count:0,
      currentFlow:'1', //1为待办，2为经办
    };
  },
  methods: {
    switchProcess(val) {
      this.currentFlow = val;
    },
    getMore() {
      let val = true;
      this.$emit("event", 'system_workflow', '', val);
    },
    jumpToForm(item) {
      this.$emit("event",'system_workflow',item);
    },
    
    finished() {
      let pageNo = 1, 
          linesPerPage = 5;
      this.$api.getProcessedListWithWidget(
        pageNo,
        linesPerPage,
        {
          onSucess: res => {
            this.processedList = res.data.data.datas;
            
          }
        }
      )

    },
    CardShow() {
      this.conceal = true;
    },
    CardNone() {
      this.conceal = false;
    },

    //流程处理的局部刷新
    Partialrefresh() {
      this.reload();
    },
  },
  filters: {
      formatDate: function (value) {// 时间戳转换日期格式方法
          // if (value == null) {
          //     return '';
          // } else {
          //     let ymd = value.split(" ")[0];
          //     return ymd;
          // }
          // debugger
          //let _time = new Date(value).getTime();
          console.log("_time--->",_time);
          let _time = dateFormat.calculateTime(value);
          return _time;
      }
    }
};
</script>

<style lang="scss" scoped>

</style>
