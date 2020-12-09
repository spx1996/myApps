<template>
  <!--首页流程处理的组件-->
  <div class="widget-iscript">
      <div 
        :style="{background:iscript.wgtData.titleBarColor}"
        class="clearfix" 
        @mouseenter="CardShow"
        @mouseleave="CardNone"
      >
        <div class="flow-title">
          <span class="img" v-if="iscript.wgtData.icon && iscript.wgtData.icon.icontype == 'img'">
            <img :src="Constant.contextPath +'/'+iscript.wgtData.icon.icon" alt="">
          </span>
          <i v-if="iscript.wgtData.icon && iscript.wgtData.icon.icontype == 'font'" :class="iscript.wgtData.icon.icon" :style="{color:iscript.wgtData.icon.iconFontColor}"></i>
          <span :style="{color:iscript.wgtData.titleColor,background:iscript.wgtData.titleBColor}">{{iscript.wgtData.name}}</span>
        </div>
        <div class="btn">
          <div>
            <i class="el-icon-refresh" v-show="conceal" @click="Partialrefresh"></i>
            <i class="el-icon-d-caret" v-show="conceal"></i>
            <i class="el-icon-close" v-show="conceal"></i>
          </div>
        </div>
      </div>
      <div class="iscript-content">
        <div class="iscript-list">
          <span v-html="iscript.wgtData.actionContent"></span>
        </div>
      </div>
  </div>
</template>

<script>
import Constant from "@/Constant.js";
//import API from "@/api.js";
export default {
  name: "widget-iscript",
  props: ["iscript"],
  created() {
    // this.$api.getWidgetsIscript(this.iscript.id,
    //   {
    //     onSucess: response => {
    //       this.htmlA = response.data.data.data;//[0].summary;
    //     }
    //   }
    // );
  },
  data: function() {
    return {
      Constant,
      htmlA:'',
      conceal: false,
    };
  },
  methods: {
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
      formHtml: function (value) {
        let val = value.replace(/^\"|\"$/g,'');
        return val;
      }
    }
  
};
</script>
