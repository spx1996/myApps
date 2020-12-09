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
          <img :src="Constant.contextPath +'/' + systemData.systemData.icon.icon" alt="">
        </span>
        <i v-if="systemData.systemData.icon && systemData.systemData.icon.icontype == 'font'" :class="systemData.systemData.icon.icon" :style="{color:systemData.systemData.icon.iconFontColor}"></i>
        <span :style="{color:systemData.systemData.titleColor,background:systemData.systemData.titleBColor}">{{systemData.systemData.name}}</span>
      </div>
      <div class="btn">
        <div @click.stop.prevent="switchProcess('1')" :class="[currentFlow=='1'?'pro-and-pe':'','pedding']">
          <span>
            待阅
          </span>
          <span class="pedding-num">
            <span>
              {{row_count}}
            </span> 
          </span>
        </div>
        <div @click.stop.prevent="switchProcess('2')" :class="[currentFlow=='2'?'pro-and-pe':'','processing']">
          <span>
            已阅
          </span>
        </div>
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
          <div class="detail">
            <div class="img">
              <img src="../assets/images/face.jpg" />
            </div>
            <div class="detail-row">
              <span class="row-one">
                {{item.module}}
              </span>
              <span>
                {{item.createTime | formatDate}}
                <!-- <span v-html="item.summary"></span> -->
              </span>
            </div>
          </div>
          <!-- <div class="approve">
            
          </div> -->
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
                {{item.module}}
                &nbsp;&nbsp;
                <span v-html="item.summary"></span>
              </span>
              <span>
                {{item.createTime | formatDate}}
              </span>
            </div>
          </div>
          <!-- <div class="approve">
            11111
          </div> -->
        </div>
      </div>
    </div>

   
    <div class="more">
      <span class="btn-more" @click="getMore">
        查看更多
      </span>
    </div>
  </div>
  
</template>

<script>
import API from "@/api.js";
import axios from "axios";
import Constant from "@/Constant.js";
import dateFormat from '@/assets/js/dateFormat'; 
export default {
  inject: ["reload"],
  props: ['systemData'],
  created() {
    let data = {
      readStatus: 0,
      type: 6, 
      linesPerPage: 5,
      pageNo: 1,
    }

    this.$api.getNotice(
      data,
      {
        onSucess: res => {
          this.row_count = res.data.data.rowCount;
          this.pendingList = res.data.data.datas;
        }
      }
    )

    this.finished();
  },
  data: function() {
    return {
      row_count:0,
      Constant,
      pendingList: [],
      processedList: [],
      conceal: false,
      dispose: true, //控制流程处理隐藏或这显示
      GonnaSelect:'pending',
      currentFlow:'1', //1为待阅，2为已阅
    };
  },
  methods: {
    switchProcess(val) {
      this.currentFlow = val;
    },
    getMore() {
      let val = true;
      this.$emit("event", 'carboncopy', '', val);
    },
    jumpToForm(item) {
      this.$emit("event",'carboncopy',item);
    },
    
    finished() {
      let data = {
        readStatus: 1,
        type: 6, //6
        linesPerPage: 5,
        pageNo: 1,
      }

      this.$api.getNotice(
        data,
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
        if (value == null) {
            return '';
        } else {
            let ymd = value.split(" ")[0];
            return ymd;
        }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
