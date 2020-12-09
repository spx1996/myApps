<template>
  <div id="statement">
    <el-scrollbar id="scrollbar">
      <div id="header" v-show="Controlthelayout">
        <label for>布局设置:</label>
        <!--添加勾选图标-->
        <div class="single">
          <span class="single-roll" @click="singlePhotograph('1')">
            1
            <img
              v-bind:class="[currentlayout=='1' ? 'single-active' : '', 'single-roll-photograph']"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
          <span class="singel-roll-item" @click="singlePhotograph('1:1')">
            1:1
            <img
              v-bind:class="[currentlayout=='1:1' ? 'single-active' : '', 'single-roll-format']"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
          <span class="singel-roll-item" @click="singlePhotograph('1:2')">
            1:2
            <img
              v-bind:class="[currentlayout=='1:2' ? 'single-active' : '', 'single-roll-format']"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
          <span class="singel-roll-item" @click="singlePhotograph('2:1')">
            2:1
            <img
              v-bind:class="[currentlayout=='2:1' ? 'single-active' : '', 'single-roll-format']"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
          <span class="singel-roll-list" @click="singlePhotograph('1:1:1')">
            1:1:1
            <img
              v-bind:class="[currentlayout=='1:1:1' ? 'single-active' : '', 'single-roll-image']"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
        </div>
        <br />
        <label for>图标链接设置:</label>
        <div class="single-module">
          <span 
            class="single-module-statement" 
            v-for="(item,index) in appIcon" 
            :key="index" 
            @click="iconLinkSetting(index)"
          >
            {{item.name}}
            <img
              v-show="item.iconShow"
              class="single-module-picture"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
        </div>
        <br />

        <!--增加或移除模块-->
        <label for>模块设置:</label>
        <div class="single-module">
          <span 
            class="single-module-statement" 
            v-for="(item,index) in allWidget"
            :key="index"
            @click="singlePicture(item.id, index, item.isShowIcon,item)" 
          >
            {{item.name}}
            <img
              v-if="item.isShowIcon"
              class="single-module-picture"
              src="/obpm/resource/images/iconfont-zhuangtai.gif"
            />
          </span>
        </div>
        <br />
        <label for></label>
        <div class="single-configuration">
          <el-button @click="configuration">保存配置</el-button>
          <el-button @click="replacement">重置配置</el-button>
          <el-button @click="Cancel">取消配置</el-button>
        </div>
      </div>

      <!--widgets-->
      <el-row id="expand">
        <!--左-->
        <el-col :span="layoutLeft">
          <draggable
            style=""
            v-model="widgetAppL"
            group="people"
            @start="drag = true"
            @end="drag = false"
            :move="keep"
          >
            <div
              class="homepage-container"
              v-for="item in widgetAppL"
              :key="item.id"
            >
              <component
                @event="doAction"
                name="wgt" 
                :is="template(item.id)"
                ref="tirget" 
                v-if="item.isShowIcon">
              </component>
            </div>
          </draggable>
        </el-col>
        
        <!--中-->
        <el-col :span="layoutCenter" v-if="currentlayout != '1'">
          <draggable
            v-model="widgetAppM"
            group="people"
            @start="drag=true"
            @end="drag=false"
            :move="keep"
          >
            <div
              class="homepage-container"
              v-for="item in widgetAppM" 
              :key="item.id"
            >
              <component 
                name="wgt" 
                :is="template(item.id)" 
                ref="tirget" 
                v-if="tirget">
              </component>
            </div>
          </draggable>
        </el-col>

        <!--右-->
        <el-col :span="layoutRight" v-if="currentlayout == '1:1:1'">
          <draggable
            v-model="widgetAppR"
            group="people"
            @start="drag=true"
            @end="drag=false"
            :move="keep"
          >
            <div
              class="homepage-container" 
              v-for="item in widgetAppR" 
              :key="item.id"
            >
              <component 
                name="wgt" 
                :is="template(item.id)" ref="tirget" 
                v-if="tirget">
              </component>
            </div>
          </draggable>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import API from "@/api.js";
import axios from "axios";
import draggable from "vuedraggable";
import view_delegate from "@/components/view_delegate.vue";
import widget_system_workflow from "@/components/widget_system_workflow.vue";
import widget_statement from "@/components/widget_statement.vue";
import widget_chart from "@/components/widget_chart.vue"
import widget_summary from "@/components/widget_summary.vue";
import widget_iscript from "@/components/widget_iscript.vue";
import widget_link from "@/components/widget_link.vue";
import widget_view from "@/components/widget_view.vue";
import widget_carboncopy from "@/components/widget_carboncopy.vue";
export default {
  inject: ["reload"],
  components: { 
    draggable, 
    view_delegate,
    widget_statement,
    widget_chart,
    widget_summary,
    widget_iscript,
    widget_link,
    widget_view,
    widget_carboncopy,
  },
  created() {
    API.getHomePageConfig({
      onSucess: response => {
        let configData = response.data.data;
        // for(let key in configData.widgets) {
        //   configData.widgets[key].isShowIcon = true;
        // }
        let L = configData.setting.appL;
        let M = configData.setting.appM;
        let R = configData.setting.appR;
        for(let key in configData.widgets) {
          for(let i=0; i<L.length; i++) {
            if(L[i] == key) {
              configData.widgets[key].isShowIcon = true;
            }
          }
          for(let i=0; i<M.length; i++) {
            if(M[i] == key) {
              configData.widgets[key].isShowIcon = true;
            }
          }
          for(let i=0; i<R.length; i++) {
            if(R[i] == key) {
              configData.widgets[key].isShowIcon = true;
            }
          }
        }
        this.config = configData;
        this.currentlayout = response.data.data.setting.layoutStyle;
        switch (response.data.data.setting.layoutStyle) {
          case '1:1:1': 
            this.layoutLeft = 8;
            this.layoutCenter = 8;
            this.layoutRight = 8;
            break;
          case '1:1': 
            this.layoutLeft = 12;
            this.layoutCenter = 12;
            break;
          case '1': 
            this.layoutLeft = 24;
            break;
          case '1:2': 
            this.layoutLeft = 8;
            this.layoutCenter = 16;
            break;
          case '2:1': 
            this.layoutLeft = 16;
            this.layoutCenter = 8;
            break;
          default:
            break;
        }

        let iconData = configData.setting.appIcon//response.data.data.setting.appIcon;
        let widget = configData.widgets;//response.data.data.widgets;
        
        for(let key in widget) {
          this.allWidget.push(widget[key]);
        }
        console.log("this.allWidget------->",this.allWidget);


        let arr = [];
        for(let i=0; i<iconData.length; i++) {
          for(let key in widget) {
            if(iconData[i] == key) {
              arr.push(widget[key]);
            }
          }
        }
        this.appIcon = arr;

        let appL = configData.setting.appL,
            appM = configData.setting.appM,
            appR = configData.setting.appR;
        for(let i=0; i<appL.length; i++) {
          for(let key in widget) {
            if(appL[i] == key) {
              this.settingAppL.push(widget[key]);
            }
          }
        }
        this.widgetAppL = JSON.parse(JSON.stringify(this.settingAppL));

        for(let i=0; i<appM.length; i++) {
          for(let key in widget) {
            if(appM[i] == key) {
              this.settingAppM.push(widget[key]);
            }
          }
        }
        this.widgetAppM = JSON.parse(JSON.stringify(this.settingAppM));

        for(let i=0; i<appR.length; i++) {
          for(let key in widget) {
            if(appR[i] == key) {
              this.settingAppR.push(widget[key]);
            }
          }
        }
        this.widgetAppR = this.settingAppR;

      }
    });
  },

  data: function() {
    return {
      allWidget:[],
      layoutLeft:0,
      layoutCenter:0,
      layoutRight: 0,
      currentlayout:'',
      controlOnStart: true,
      appIcon:[],
      moduleSettingData:[],
      settingAppL:[],
      settingAppM:[],
      settingAppR:[],
      widgetAppL: [],
      widgetAppM: [],
      widgetAppR: [],

      config: {
        setting: {
          appIcon: [],
          appL: [],
          appM: [],
          layoutStyle: "",
          appR: []
        }
      },
      Controlthelayout: false, //控制header的显示或隐藏
      report: true, //控制子组件的隐藏和显示
      tirget: true, //控制流程处理显示和隐藏
      currentUrl: '',
      pagePath:'',
    };
  },

  methods: {
    doAction(type, item, val) {
      if(type == 'system_workflow') {
        if(val) {
          this.$emit('add-tab',{id:'06',name:'我的待办',linkType:'06'});
        }else {
          let params = {
            appId: this.$root.appid,
            linkType:'00',
            actionContent:item.formId,
            docId:item.docId,
            _select: item.docId,
            name: '待办'
          };
          this.$emit("add-tab", params);
        }
      }else if(type == 'view') {
        this.$emit('add-tab',item);
      }else if (type == 'carboncopy') {
        if(val) {
          this.$emit('add-tab',{id:'06',name:'待阅',linkType:'06'});
        }else {
          let params = {
            appId: this.$root.appid,
            linkType:'00',
            actionContent:item.formId,
            docId:item.docId,
            name: '待阅'
          };
          this.$emit("add-tab", params);
        }
      }
    },
    //点击右侧图标来控制header的隐藏和显示
    Settherollinginstall() {
      console.log("------------->")
      this.Controlthelayout = !this.Controlthelayout;
    },
    //拖拽触发header
    keep(event, index) {
      if (index.clientX >= 840) {
        this.Controlthelayout = true;
      }
      console.log(event);
    },

    //动态的显示两个组件
    template(wgtId) {
      let wgt = this.config.widgets[wgtId];
      let that = this;
      if (wgt) {
        if (wgt.type == "customizeReport") { //报表
          this.$api.getCustomreports(wgt.actionContent,
            {
              onSucess: response => {
                let urls = response.data;
                if(urls.split("=")[2]) {
                  let arr = urls.split("=")[2];
                  if(arr.split(";")[0]) {
                    let arr2 = arr.split(";")[0];
                    if(arr2.split("'")[1]) {
                      this.currentUrl = arr2.split("'")[1];
                    }
                  }
                }
              }
            }
          );
          return {
            components: { widget_statement },
            methods: {
              getParams() {
                return {
                  id: wgtId,
                  reportData: wgt,
                  path: that.currentUrl, //"http://" + window.location.host + that.currentUrl,
                };
              }
            },
            template: "<div><widget_statement :report='getParams()'/></div>"
          };
        } else if(wgt.type ==  "carboncopy") {
          return {
            methods: {
              doAction(type, item, val) {
                that.doAction(type, item, val);
              },
              getParams() {
                return {
                  id: wgtId,
                  systemData: wgt,
                };
              }
            },
            components: { widget_carboncopy },
            template: "<div><widget_carboncopy :systemData='getParams()' @event='doAction'/></div>"
          };
        }else if (wgt.type == "system_workflow") {
          return {
            methods: {
              doAction(type, item, val) {
                that.doAction(type, item, val);
              },
              getParams() {
                return {
                  id: wgtId,
                  systemData: wgt,
                };
              }
            },
            components: { widget_system_workflow },
            template: "<div><widget_system_workflow :systemData='getParams()' @event='doAction'/></div>"
          };
        }else if (wgt.type == 'chart') {
          return {
            components: { widget_chart },
            methods: {
              getParams() {
                return {
                  id: wgtId,
                  wgtData: wgt,
                };
              }
            },
            template: "<div><widget_chart :chart='getParams()'/></div>"
          };
        }else if(wgt.type == "view") { //视图
          return {
            components: { widget_view },
            methods: {
              doAction(type, item, val) {
                that.doAction(type, item, val);
              },
              getParams() {
                return {
                  id: wgtId,
                  viewData: wgt,
                };
              }
            },
            template: "<div><widget_view @event='doAction' :view='getParams()'/></div>"
          };
        }else if (wgt.type == 'summary') {//摘要
          return {
            components: { widget_summary },
            methods: {
              getParams() {
                return {
                  id: wgtId,
                  wgtData: wgt,
                };
              }
            },
            template: "<div><widget_summary :iscript='getParams()'/></div>"
          };
        }else if (wgt.type == 'page') {
          this.$api.getWidgetsIscript(wgt.id,
            {
              onSucess: response => {
                that.pagePath = response.data.data;
              }
            }
          );
          return {
            components: { widget_link },
            methods: {
              getParams() {
                return {
                  id: wgtId,
                  wgtData: wgt,
                  path: that.pagePath,
                };
              }
            },
            template: "<div><widget_link :link='getParams()'/></div>"
          };
        }else if (wgt.type == 'iscript') {
          wgt.actionContent = wgt.actionContent.replace(/^\"|\"$/g,'');
          return {
            components: { widget_iscript },
            methods: {
              getParams() {
                return {
                  id: wgtId,
                  wgtData: wgt,
                };
              }
            },
            template: "<div><widget_iscript :iscript='getParams()'/></div>"
          };
        }
      }
    },
    //取消用户首页配置
    Cancel() {
      this.reload();
    },
    //重置用户首页设置
    replacement() {
      this.reload();
    },
    //保存用户首页设置
    configuration() {
      
      let currentAppIcon = [];
      let currentAppL = [],
          currentAppM = [],
          currentAppR = [];
      this.appIcon.forEach(item => {
        if(item.iconShow) {
          currentAppIcon.push(item.id);
        }
      });
      this.widgetAppL.forEach(item => {
        currentAppL.push(item.id);
      });
      this.widgetAppM.forEach(item => {
        currentAppM.push(item.id);
      });
      this.widgetAppR.forEach(item => {
        currentAppR.push(item.id);
      });

      let data = {
          appIcon: currentAppIcon,
          appL: currentAppL,
          appM: currentAppM,
          appR: currentAppR,
          layoutStyle: this.currentlayout,
        }
        console.log("data---->",data)
      this.$api.setHomePageConfig(
        data,
        {
          onSucess: res => {
            if(res.data.errcode == 0) {
              this.$emit("event");
            }
          }
        }
      )
    },

    singlePicture(id, index, isShowIcon, item) {
      this.allWidget[index].isShowIcon = !this.allWidget[index].isShowIcon;
      this.$forceUpdate();
      if(isShowIcon) {
        for(let i=0; i<this.widgetAppL.length; i++) {
          if(id == this.widgetAppL[i].id) {
            this.widgetAppL.splice(i, 1);
            i--;
          }
        }
        for(let i=0; i<this.widgetAppM.length; i++) {
          if(id == this.widgetAppM[i].id) {
            this.widgetAppM.splice(i, 1);
            i--;
          }
        }
        for(let i=0; i<this.widgetAppR.length; i++) {
          if(id == this.widgetAppR[i].id) {
            this.widgetAppR.splice(i, 1);
            i--;
          }
        }
      }else {
        this.widgetAppL.push(this.allWidget[index]);
      }
      this.$forceUpdate();
    },

    //图标链接设置
    iconLinkSetting(index) {
      this.appIcon[index].iconShow = !this.appIcon[index].iconShow;
    },
    
    singlePhotograph(val) {
      this.currentlayout = val;
      switch (val) {
        case '1:1:1': 
          this.layoutLeft = 8;
          this.layoutCenter = 8;
          this.layoutRight = 8;
          break;
        case '1:1': 
          this.layoutLeft = 12;
          this.layoutCenter = 12;
          break;
        case '1': 
          this.layoutLeft = 24;
          break;
        case '1:2': 
          this.layoutLeft = 8;
          this.layoutCenter = 16;
          break;
        case '2:1': 
          this.layoutLeft = 16;
          this.layoutCenter = 8;
          break;
        default:
          break;
      }
    },
  }
};
</script>

<style lang="scss" scope>

</style>
