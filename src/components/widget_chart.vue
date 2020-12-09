<template>
  <div class="home-chart" >
    <div 
      :style="{background:chart.wgtData.titleBarColor}"
      class="clearfix" 
      @mouseenter="CardShow"
      @mouseleave="CardNone"
    >
      <div class="flow-title" >
        <span class="img" v-if="chart.wgtData.icon && chart.wgtData.icon.icontype == 'img'">
          <img :src="Constant.contextPath +'/'+chart.wgtData.icon.icon" alt="">
        </span>
        <i v-if="chart.wgtData.icon && chart.wgtData.icon.icontype == 'font'" :class="chart.wgtData.icon.icon" :style="{color:chart.wgtData.icon.iconFontColor}"></i>
        <span :style="{color:chart.wgtData.titleColor, background:chart.wgtData.titleBColor}">{{chart.wgtData.name}}</span>
      </div>
      <div class="btn">
        <div class="btn-icon">
          <i class="el-icon-refresh" v-show="conceal" @click="Partialrefresh"></i>
          <i class="el-icon-d-caret" v-show="conceal"></i>
          <i class="el-icon-close" v-show="conceal"></i>
        </div>
      </div>
    </div>
    <div id="myChart" ref="myChart"></div>
  </div>
</template>
<script>
import axios from "axios";
import API from "@/api.js";
import Constant from "@/Constant.js";
// //引入基本模板
// let echarts = require('echarts/lib/echarts')
// // 引入柱状图组件
// require('echarts/lib/chart/bar')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
export default {
  inject: ["reload"],
  props: ["chart"],
  mounted() {
    this.getChart();
  },
  watch: {
    chartData() {
      this.drawLine();
    },
  },
  data() {
    return{
      Constant,
      chartData:'',
      conceal: false,
    }
  },
  methods: {
    //流程处理的局部刷新
    Partialrefresh() {
      this.reload();
    },
    CardShow() {
      this.conceal = true;
    },
    CardNone() {
      this.conceal = false;
    },
    getChart() {
      this.$api.getChart(this.chart.wgtData.actionContent, {
        onSucess: response => { 
          this.chartData = JSON.parse(response.data.data.result);
        }
      })
    },
    drawLine(){
      let myChart = this.$echarts.init(this.$refs.myChart);
      myChart.setOption(this.chartData);
    }
  }
};
</script>
<style lang="scss">

</style>


