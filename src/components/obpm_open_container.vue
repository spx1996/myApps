<template>
  <div class="myapps-iframe" id="myapps-iframe">
    <div class="myapps-iframe-box">
      <component 
        v-bind="$attrs"
        v-on="$listeners"
        :is="contentType()"  
        v-if="hackReset" 
        :openParams="params" 
        @openNewpage = "doAction"
      />
    </div>
    
  </div>
</template>

<script>
import view_delegate from "@/components/view_delegate.vue"
import form_normalform from "@/components/form_normalform.vue"
import profile from "@/components/profile.vue"
import information from "@/components/information.vue"
import main_management from "@/components/main_management.vue"
import main_pending from "@/components/main_pending.vue"
import main_processing from "@/components/main_processing.vue"
import main_read from "@/components/main_read.vue"
import main_unread from "@/components/main_unread.vue"
import authority from "@/components/authority.vue"
import main_launch from "@/components/main_launch.vue"
import main_meter from "@/components/main_meter"
import report from "@/components/report"
import chart from "@/components/chart"
import common_linkcontent from "@/components/common_linkcontent"
//import { constants } from 'crypto';

export default {
  name: "obpm-open-container",
  props: ["openParams"],
  components: {
    view_delegate,
    form_normalform,
    profile,
    information,
    main_management,
    main_pending,
    main_processing,
    main_read,
    main_unread,
    authority,
    main_launch,
    main_meter,
    report,
    chart,
    common_linkcontent
  },

  created() {
    this.doAction(this.openParams);
  },

  data: function() {
    return {
      params: null,
      paramsHistory: [],
      hackReset:true,
    };
  },

  methods: {
    updateData() {
      console.log("更新------------>");
      this.reloading();
    },
    
    //重建时加载
    reloading() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    contentType: function() {
      // this.params = openParams;
      let compName;
      switch (this.params.linkType) {
        case "00":
          //表单
          compName = "form_normalform";
          break;
        case "01":
          //列表视图
          compName = "view_delegate";
          break;
        case "02":
          //图表
          compName = "chart";
          break;
        case "03":
          //信息管理
          compName = "information";
          break;
        case "04":
          //系统设置
          compName = "main_management";
          break;
        case "05":
          //发起新建
          compName = "main_launch";
          break;
        case "06":
          //我的待办
          compName = "main_pending";
          break;
        case "07":
          //经办跟踪
          compName = "main_processing";
          break;
        case "08":
          //仪表分析
          compName = "main_meter";
          break;
        case "09":
          //报表
          compName = "report";
          break;
        case "10":
          //待阅
          compName = "main_unread";
          break;
        case "11":
          //已阅
          compName = "main_read";
          break;
        case "100":
          //权限页面
          compName = "authority";
          break;
        case "102":
          //个人设置
          compName = "profile";
          break;
        case "103":
          debugger
          compName = "common_linkcontent";
          //个人设置
          // compName = "profile";
          break;
        default:
          break;
      }
      return compName;
    },

    doAction: function(params) {
      console.log("obpm_open_container-->",params);
      this.paramsHistory.push(params);
      this.params = params;
    },

    doBack: function() {
      if (this.paramsHistory.length > 0) {
        this.paramsHistory.pop();
      }
      if (this.paramsHistory.length > 0) {
        this.params = this.paramsHistory[this.paramsHistory.length - 1];
      }else {
        this.$parent.onCloseBtnClick(this.params);
      }
    }
  }
};
</script>
