<template>
  <ul class="software-navul">
    <li class="software-navli flowCenter">
      <a href="javascript:;" data-appid="flowcenterapp" data-url="html/flowcenter.html">
        <i class="fa fa-th-large"></i>
        <cite>流程中心</cite>
      </a>
      
      <ul id="tabs_flowcenter" class="tabs_menu sidebar-menu d-inline-block">
        <li tabid="launch" menu="open">
          <a @click="$emit('add-tab',{id:'05',name:'发起新建',linkType:'05'})">
            <cite class="main-menu_title">发起新建</cite>
          </a>
        </li>
        <li tabid="pending" menu="open">
          <a @click="$emit('add-tab',{id:'06',name:'我的待办',linkType:'06'})">
            <cite class="main-menu_title">我的待办</cite>
          </a>
        </li>
        <li tabid="processed" menu="open">
          <a @click="$emit('add-tab',{id:'07',name:'经办跟踪',linkType:'07'})">
            <cite class="main-menu_title">经办跟踪</cite>
          </a>
        </li>
        <li tabid="pending" menu="open">
          <a @click="$emit('add-tab',{id:'10',name:'我的待阅',linkType:'10'})">
            <cite class="main-menu_title">我的待阅</cite>
          </a>
        </li>
        <li tabid="pending" menu="open">
          <a @click="$emit('add-tab',{id:'11',name:'我的已阅',linkType:'11'})">
            <cite class="main-menu_title">我的已阅</cite>
          </a>
        </li>
        <li tabid="dashboard" menu="open">
          <a @click="$emit('add-tab',{id:'08',name:'仪表分析',linkType:'08'})">
            <cite class="main-menu_title">仪表分析</cite>
          </a>
        </li>
      </ul>
    </li>
    <template v-for="(app,i) in data">
      <li :key="app.id" v-if="i<2" class="software-navli layui-nav-item">
        <a href="javascript:;" :ref="'ref'+i" v-on:click="loadAppMenu(app.id)">
          <cite>{{app.name}}</cite>
        </a>
      </li>
    </template>

    <li class="software-navli layui-nav-item other-software">
      <a href="javascript:;">
        <!-- <i class="fa fa-ellipsis-v"></i> -->
        <i class="el-icon-more"></i>
      </a>
      <div class="softwarelist">
        <span class="triangle"></span>
        <ul class="other-software-ul">
          <template v-for="(app,i) in data">
            <li :key="app.id" v-if="i>=2" class="other-software-li">
              <a :title="app.name" href="javascript:;" :data-appid="app.id">
                <cite>{{app.name}}</cite>
              </a>
            </li>
          </template>
        </ul>
      </div>
    </li>

    <li class="software-navli regular-use-li">
      <a href="#">
        <el-popover
          ref="popover"
          placement="top-start"
          width="200"
          trigger="hover"
          v-if="config.length"
        >
          <div class="popover">
            <div class="list" 
              v-for="(item, index) in config" 
              :key="index"
              @click="onCommonlyUsedClick(item)"
            >
              {{item.name}}
            </div>
          </div>
        </el-popover>
        <span v-popover:popover class="commonly-used">
          常用
        </span>
        <!-- <button class="btn offer-use" v-popover:popover>常用</button> -->
        <!-- <el-button v-popover:popover1>hover 激活</el-button> -->
      </a>
      <div class="regular-use"></div>
    </li>
  </ul>
</template>

<script>
import API from "@/api.js";
export default {
  name: "obpm-main-appbar",
  data() {
    return {
      tabs: [],
      appid: "km1",
      config: [],
    };
  },

  created() {
    API.getHomePageConfig({
      onSucess: response => {
        let setting = response.data.data.setting.appIcon;
        let widgets = response.data.data.widgets;
        if(setting && setting.length>0) {
          let arr = [];
          setting.forEach(item => {
            for(let key in widgets) {
              if(item == key) {
                arr.push(widgets[key])
              }
            }
          })
          this.config = arr;
        }
        //this.config = response.data.data;
      }
    });
  },

  computed: {
    data: function() {
      return this.$store.state.apps;
    }
  },
  methods: {
    onCommonlyUsedClick(menu) {
      debugger
      if(menu.type == 'view') {
        this.$emit("add-tab", {
          id: menu.id,
          name: menu.name,
          appId: this.data.appId,
          linkType: '01',
          actionContent: menu.actionContent,//存放FORMID或VIEWID
        });
      }else if (menu.type == 'chart') {
        this.$emit("add-tab", {
          id: menu.id,
          name: menu.name,
          appId: this.data.appId,
          linkType: '02',
          actionContent: menu.actionContent,//存放FORMID或VIEWID
        });
      }else if (menu.type == 'customizeReport') {
        this.$emit("add-tab", {
          id: menu.id,
          name: menu.name,
          appId: this.data.appId,
          linkType: '09',
          actionContent: menu.actionContent,//存放FORMID或VIEWID
        });
      }else if (menu.type == 'page') {
        this.$emit("add-tab", {
          id: menu.id,
          name: menu.name,
          appId: this.data.appId,
          linkType: '103',
          actionContent: menu.actionContent,//存放FORMID或VIEWID
        });
      }
    },
    loadAppMenu: function(appId) {
      this.$store.dispatch("loadMenus", appId);
    },

    activeHome: function() {
      this.tabs.forEach(function(value) {
        value.active = false;
      });
    },
    closeTab: function(tab) {
      let i = -1;
      this.tabs.forEach(function(value, index) {
        if (value.id == tab.id) {
          i = index;
        }
      });

      this.tabs.splice(i, 1);
      let act = this.tabs[i];
      if (act) {
        this.activeTab({ id: act.id });
      }
    },
    activeTab: function(tab) {
      this.tabs.forEach(function(value) {
        if (value.id == tab.id) {
          value.active = true;
        } else {
          value.active = false;
        }
      });
    }
  },
  beforeCreate: function() {
    this.$store.dispatch("landingUser");
    this.$store.dispatch("loadApps"); //异步执行
  }
};
</script>

<style lang="scss" scoped>
.popover {
  width: 100%;
  .list {
    width: 100%;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .list:hover {
    background-color: #f4f6f6;
  }
}
</style>