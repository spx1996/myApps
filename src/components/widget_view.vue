<template>
  <!--首页的报表组件-->
  <div class="widget-view-box" ref="report">
    <div
      :style="{background:view.viewData.titleBarColor}" 
      class="clearfix" 
      @mouseenter="CardShow"
      @mouseleave="CardNone"
    >
      <div class="flow-title">
        <span class="img" v-if="view.viewData.icon && view.viewData.icon.icontype == 'img'">
          <img :src="Constant.contextPath +'/'+view.viewData.icon.icon" alt="">
        </span>
     
        <i v-if="view.viewData.icon && view.viewData.icon.icontype == 'font'" :class="view.viewData.icon.icon" :style="{color:view.viewData.icon.iconFontColor}"></i>
        <span :style="{color:view.viewData.titleColor,background:view.viewData.titleBColor}">{{view.viewData.name}}</span>
      </div>
      <div class="btn">
        <div class="btn-icon">
          <i class="el-icon-refresh" v-show="conceal" @click="Partialrefresh"></i>
          <i class="el-icon-d-caret" v-show="conceal"></i>
          <i class="el-icon-close" v-show="conceal"></i>
        </div>
      </div>
    </div>
    <div class="widget-view-content">
      <el-scrollbar class="view-scrollbar">
        <view_delegate
          :openParams="{
            appId: view.viewData.applicationId, 
            actionContent: view.viewData.actionContent, 
          }"
          v-bind="$attrs"
          v-on="$listeners"
          :showtype = "'home'"
        >
        </view_delegate>
      </el-scrollbar>
    </div>
    <div class="view-btn">
      <span class="btn-more">
        查看更多
      </span>
    </div>
  </div>
</template>
<script>
import view_delegate from "@/components/view_delegate.vue";
import Constant from "@/Constant.js";
export default {
  inject: ["reload"],
  name: "widget-view",
  props: ["view"],
  components: {
    view_delegate,
  },
  data() {
    return{
      Constant,
      conceal: false,
    }
  },
  created() {
    this.getTemplate();
  },
  methods: {
    nav_click() {

      this.$router.push({  
        name:'open',
        query:{linkType:'01',actionContent:this.view.viewData.actionContent}
      })
            
    },
    getTemplate() {
      let appId = this.$root.appid;
      let viewId = this.view.viewData.actionContent;
      let exparams = "";
      this.$api.getViewTemplate(appId, viewId, exparams, {
        onSucess: response => {
          this.viewList = response.data.data;
        }
      })
    },

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



