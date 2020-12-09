import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import API from "@/api.js";

Vue.config.productionTip = false

import './assets/style/vue.scss';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Toastr from 'vue-toastr';
// import 'vue-toastr/dist/vue-toastr.css';
import Print from 'vue-print-nb';

import BaiduMap from 'vue-baidu-map'
//import QRCode from 'qrcodejs2'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

Vue.prototype.$api= API;

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '35f23767ebad2b65905c0352b331762d'
})

Vue.use(Print); 
Vue.use(Toastr);
Vue.use(ElementUI);
//Vue.use(QRCode);


// import Vue from "vue";
import o_input from "@/components/o_input.vue"
import o_select from "@/components/o_select.vue"
import o_textarea from "@/components/o_textarea.vue"
import o_radio from "@/components/o_radio.vue"
import o_checkbox from "@/components/o_checkbox.vue"
import o_date_picker from "@/components/o_date_picker.vue"
import o_department from "@/components/o_department.vue"
import o_calctext from "@/components/o_calctext.vue"
import o_button from "@/components/o_button.vue"
import o_select_about from "@/components/o_select_about.vue"
import o_suggest from "@/components/o_suggest.vue"
import o_user_select from "@/components/o_user_select.vue"
import o_dept_tree_select from "@/components/o_dept_tree_select.vue"
import o_include from "@/components/o_include.vue"
import o_dept_select from "@/components/o_dept_select.vue"
import o_tab from "@/components/o_tab.vue"
import o_photo from "@/components/o_photo.vue"
import o_file_upload from "@/components/o_file_upload.vue"
import o_image_upload from "@/components/o_image_upload.vue"
import o_view_dialog from "@/components/o_view_dialog.vue"
import o_survey from "@/components/o_survey.vue"
import o_qrcode from "@/components/o_qrcode.vue"
import o_map from "@/components/o_map.vue"
import o_flow_history from "@/components/o_flow_history.vue"
import o_gps from "@/components/o_gps.vue"
import o_record from "@/components/o_record.vue"
import o_word from "@/components/o_word.vue"
import o_reminder_history from "@/components/o_reminder_history.vue"
import o_action from "@/components/o_action.vue"
import o_file_kms from "@/components/o_file_kms.vue"

// import Vue from 'vue'
import VueHtml5Editor from "vue-html5-editor";

(function() {
  let opt = {
    // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
    name: "vue-html5-editor",
    // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
    showModuleName: true,
    // 自定义各个图标的class，默认使用的是font-awesome提供的图标
    icons: {
      text: "fa fa-pencil",
      color: "fa fa-paint-brush",
      font: "fa fa-font",
      align: "fa fa-align-justify",
      list: "fa fa-list",
      link: "fa fa-chain",
      unlink: "fa fa-chain-broken",
      tabulation: "fa fa-table",
      image: "fa fa-file-image-o",
      hr: "fa fa-minus",
      eraser: "fa fa-eraser",
      undo: "fa-undo fa",
      "full-screen": "fa fa-arrows-alt",
      info: "fa fa-info"
    },
    // 配置图片模块
    image: {
      // 文件最大体积，单位字节
      sizeLimit: 512 * 1024 * 10,
      // 上传参数,默认把图片转为base64而不上传
      // upload config,default null and convert image to base64
      upload: {
        url: null,
        headers: {},
        params: {},
        fieldName: {}
      },
      // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
      // width和height是文件的最大宽高
      compress: {
        width: 600,
        height: 600,
        quality: 80
      },
      // 响应数据处理,最终返回图片链接
      uploadHandler(responseText) {
        //      default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
        var json = JSON.parse(responseText);
        if (json.status == 200) {
          return json.data;
        } else {
          alert(json.error);
        }
      }
    },
    // 语言，内建的有英文（en-us）和中文（zh-cn）
    language: "zh-cn",
    // 自定义语言
    i18n: {
      "zh-cn": {
        align: "对齐方式",
        image: "图片",
        list: "列表",
        link: "链接",
        unlink: "去除链接",
        table: "表格",
        font: "文字",
        "full screen": "全屏",
        text: "排版",
        eraser: "格式清除",
        info: "关于",
        color: "颜色",
        "please enter a url": "请输入地址",
        "create link": "创建链接",
        bold: "加粗",
        italic: "倾斜",
        underline: "下划线",
        "strike through": "删除线",
        subscript: "上标",
        superscript: "下标",
        heading: "标题",
        "font name": "字体",
        "font size": "文字大小",
        "left justify": "左对齐",
        "center justify": "居中",
        "right justify": "右对齐",
        "ordered list": "有序列表",
        "unordered list": "无序列表",
        "fore color": "前景色",
        "background color": "背景色",
        "row count": "行数",
        "column count": "列数",
        save: "确定",
        upload: "上传",
        progress: "进度",
        unknown: "未知",
        "please wait": "请稍等",
        error: "错误",
        abort: "中断",
        reset: "重置"
      }
    },
    // 隐藏不想要显示出来的模块
    hiddenModules: [],
    // 自定义要显示的模块，并控制顺序
    visibleModules: [
      "text",
      "color",
      "font",
      "align",
      "list",
      "link",
      "unlink",
      "tabulation",
      "image",
      "hr",
      "eraser",
      "undo",
      "full-screen",
      "info",
    ],
    // 扩展模块，具体可以参考examples或查看源码
    // extended modules
    modules: {
      //omit,reference to source code of build-in modules
    }
  };
  Vue.use(VueHtml5Editor, opt);
})();

import o_html from "@/components/o_html.vue";
import comm_dialog from "@/components/dialog.vue";
Vue.component("comm-dialog", comm_dialog);

Vue.component("o-reminder-history", o_reminder_history);
Vue.component("o-input", o_input);
Vue.component("o-select", o_select);
Vue.component("o-textarea", o_textarea);
Vue.component("o-radio", o_radio);
Vue.component("o-checkbox", o_checkbox);
Vue.component("o-date-picker", o_date_picker);
Vue.component("o-department", o_department);
Vue.component("o-html", o_html);
Vue.component("o-calctext", o_calctext);
Vue.component("o-button", o_button);
Vue.component("o-select-about", o_select_about);
Vue.component("o-suggest", o_suggest);
Vue.component("o-user-select", o_user_select);
Vue.component("o-dept-tree-select", o_dept_tree_select);
Vue.component("o-include", o_include);
Vue.component("o-dept-select", o_dept_select);
Vue.component("o-tab", o_tab);
Vue.component("o-photo", o_photo);
Vue.component("o-file-upload", o_file_upload);
Vue.component("o-image-upload", o_image_upload);
Vue.component("o-view-dialog", o_view_dialog);
Vue.component("o-survey",o_survey);
Vue.component("o-qrcode",o_qrcode);
Vue.component("o-map",o_map);
Vue.component("o-flow-history",o_flow_history);
Vue.component("o-gps", o_gps);
Vue.component("o-record",o_record);
Vue.component("o-word",o_word);
Vue.component("o-action",o_action);
Vue.component("o-file-kms",o_file_kms);


//获取并设置appid到根组件
let p1 = new Promise(
  resolve => {
    API.getApplications({
      onSucess: response => {
        if (response.data && response.data.errmsg == "ok") {
          response.data.data.applications.forEach(app => {
            if (app.id != "km" && app.id != "pm" && app.id != "qm") {
              resolve(app.id);
            }
          });
        }
      }
    });
    
  }
);

let p2 =  new Promise(resolve => {
  API.getMyProfile(
    {
      onSucess: resp => {
        resolve(resp.data.data);
      } 
    }
  )
});

Promise.all([p1, p2]).then(function (result) {
  new Vue({
    data: { appid: result[0], user: result[1] },
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});
// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
