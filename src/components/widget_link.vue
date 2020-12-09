<template>
  <!--首页的报表组件-->
  <div class="link-box" ref="report">
    <div 
      :style="{background:link.wgtData.titleBarColor}"
      class="clearfix" 
      @mouseenter="CardShow"
      @mouseleave="CardNone"
    >
      <div class="flow-title">
        <span class="img" v-if="link.wgtData.icon && link.wgtData.icon.icontype == 'img'">
          <img :src="Constant.contextPath +'/'+link.wgtData.icon.icon" alt="">
        </span>
        <i v-if="link.wgtData.icon && link.wgtData.icon.icontype == 'font'" :class="link.wgtData.icon.icon" :style="{color:link.wgtData.icon.iconFontColor}"></i>
        <span :style="{color:link.wgtData.titleColor,background:link.wgtData.titleBColor}">链接</span>
      </div>
      <div class="btn">
        <div class="btn-icon">
          <i class="el-icon-refresh" v-show="conceal" @click="Partialrefresh"></i>
          <i class="el-icon-d-caret" v-show="conceal"></i>
          <i class="el-icon-close" v-show="conceal"></i>
        </div>
      </div>
    </div>
    <div class="link-content">
      <el-scrollbar class="scrollbar" v-if="link.path">
        <iframe
          ref="mainFrame"
          style="border:none"
          width="100%"
          height="300"
          scrolling="no"
          frameborder="0"
          allowtransparency="true" 
          noresize="noresize"
          :src="link.path"
        ></iframe>
      </el-scrollbar>
      <!-- <el-scrollbar class="scrollbar"> -->
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>
<script>

export default {
  inject: ["reload"],
  props: ["link"],
  data() {
    return{
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


