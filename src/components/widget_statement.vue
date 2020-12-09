<template>
<!--首页的报表组件-->
  <div class="report-box" ref="report">
    <div 
      :style="{background:report.reportData.titleBarColor}"
      class="clearfix" 
      @mouseenter="CardShow"
      @mouseleave="CardNone"
    >
      <div class="flow-title">
        <span class="img" v-if="report.reportData.icon && report.reportData.icon.icontype == 'img'">
          <img :src="Constant.contextPath +'/'+report.reportData.icon.icon" alt="">
        </span>
    
        <i v-if="report.reportData.icon && report.reportData.icon.icontype == 'font'" :class="report.reportData.icon.icon" :style="{color:report.reportData.icon.iconFontColor}"></i>
        <span :style="{color:report.reportData.titleColor,background:report.reportData.titleBColor}">报表</span>
      </div>
      <div class="btn">
        <div class="btn-icon">
          <i class="el-icon-refresh" v-show="conceal" @click="Partialrefresh"></i>
          <i class="el-icon-d-caret" v-show="conceal"></i>
          <i class="el-icon-close" v-show="conceal"></i>
        </div>
      </div>
    </div>
    <div class="report-content">
      <el-scrollbar class="scrollbar" v-if="report.path">
        <iframe
          ref="mainFrame"
          style="border:none"
          width="100%"
          height="479"
          scrolling="no"
          frameborder="0"
          allowtransparency="true" 
          noresize="noresize"
          :src="report.path"
        ></iframe>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>

import Constant from "@/Constant.js";
export default {
  inject: ["reload"],
  props: ["report"],
  data() {
    return{
      Constant,
      conceal: false,
    }
  },
  created() {
   
  },
  methods: {
    Partialrefresh() {

    },
    CardShow() {
      this.conceal = true;
    },
    CardNone() {
      this.conceal = false;
    },
    Report(){
        this.Reporttohide = !this.Reporttohide;
        this.picture = false;
    },
    //刷新功能
    renovation(){
      this.reload();
    },
    toggleShow(){
      this.isShow = !this.isShow
    }
  }
};
</script>
<style lang="scss" scoped>

</style>


