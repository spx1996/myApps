<template>
  <ul>
    <li>
      <span class="nav-title">{{$store.state.softwareName}}</span>
    </li>
    <li v-for="(_topMenuList, index) in data" :key="index">
      <a
        :title="_topMenuList.name"
        :data-opentarget="_topMenuList.opentarget"
        :data-linkType="_topMenuList.linkType"
        :data-appid="_topMenuList.appId"
        :data-actioncontent="_topMenuList.actionContent"
        :data-url="_topMenuList.url"
        :data-allowOpenForm="_topMenuList.allowOpenFrom ? 'true' : 'false'"
        :data-allowOpenView="_topMenuList.allowOpenView ? 'true' : 'false'"
        :class="[currentMenuId==_topMenuList.id?'currentFocus':'']"
        @click="onMenuClick(_topMenuList)"
      >
        <img 
          width="16px" 
          height="16px" 
          v-if="_topMenuList.ico && JSON.parse(_topMenuList.ico).icontype == 'img'"  
          :src="Constant.contextPath + JSON.parse(_topMenuList.ico).icon" />
        <span
          class="current-icon"
          v-if="_topMenuList.ico && JSON.parse(_topMenuList.ico).icontype == 'font'" 
          :class="JSON.parse(_topMenuList.ico).icon" 
          :style="{color:_topMenuList.ico && JSON.parse(_topMenuList.ico).iconFontColor?JSON.parse(_topMenuList.ico).iconFontColor:''}">
        </span>
        <cite>{{_topMenuList.name}} </cite>
        <span class="icom-img" v-if="_topMenuList.children">
          <!-- <img v-if="activatedMenus.indexOf(_topMenuList)>=0" src="../assets/images/Tloa_home_drop-down@2x.png" alt="">
          <img v-else src="../assets/images/Tloa_home_drop-left.png" alt=""> -->
          
          <i class="fa fa-angle-down" v-if="activatedMenus.indexOf(_topMenuList)>=0"></i>
          <i class="fa fa-angle-left" v-else></i>
          
          <!-- <img src="../assets/images/Tloa_home_drop-left.png" alt=""> -->
        </span>
        <!-- <i v-if="_topMenuList.children" class="glyphicon" :class="activatedMenus.indexOf(_topMenuList)>=0 ? 'glyphicon-menu-down':'glyphicon-menu-left'"></i> -->
      </a>
      <dl
        v-if="_topMenuList.children"
        :style="{ display: activatedMenus.indexOf(_topMenuList)>=0 ? 'block':'none'}"
      >
        <dd v-for="(_secondMenuList, index) in _topMenuList.children" :key="index">
          <a
            :title="_secondMenuList.name"
            :data-opentarget="_secondMenuList.opentarget"
            :data-linkType="_secondMenuList.linkType"
            :data-appid="_secondMenuList.appId"
            :data-actioncontent="_secondMenuList.actionContent"
            :data-url="_secondMenuList.url"
            :data-allowOpenForm="_secondMenuList.allowOpenFrom ? 'true' : 'false'"
            :data-allowOpenView="_secondMenuList.allowOpenView ? 'true' : 'false'"
            @click="onMenuClick(_secondMenuList)"
            :class="[currentMenuId==_secondMenuList.id?'currentFocus':'']"
          >
            <cite>{{_secondMenuList.name}}</cite>
            <!-- <i v-if="_secondMenuList.children" class="glyphicon" :class="activatedMenus.indexOf(_secondMenuList)>=0 ? 'glyphicon-menu-down':'glyphicon-menu-left'"></i> -->
            <span class="icom-img" v-if="_secondMenuList.children">
              <!-- <img v-if="activatedMenus.indexOf(_secondMenuList)>=0" src="../assets/images/Tloa_home_drop-down@2x.png" alt="">
              <img v-else src="../assets/images/Tloa_home_drop-left.png" alt=""> -->
              <i class="fa fa-angle-down" v-if="activatedMenus.indexOf(_secondMenuList)>=0"></i>
              <i class="fa fa-angle-left" v-else></i>
            </span>
          </a>
          <ol
            v-if="_secondMenuList.children"
            class="layui-nav-child"
            :style="{ display: activatedMenus.indexOf(_secondMenuList)>=0 ? 'block':'none'}"
          >
            <li v-for="(_thirdMenuList, index) in _secondMenuList.children" :key="index">
              <a
                :title="_thirdMenuList.name"
                href="javascript:;"
                :data-opentarget="_thirdMenuList.opentarget"
                :data-linkType="_thirdMenuList.linkType"
                :data-appid="_thirdMenuList.appId"
                :data-actioncontent="_thirdMenuList.actionContent"
                :data-url="_thirdMenuList.url"
                :data-allowOpenForm="_thirdMenuList.allowOpenFrom ? 'true' : 'false'"
                :data-allowOpenView="_thirdMenuList.allowOpenView ? 'true' : 'false'"
                @click="onMenuClick(_thirdMenuList)"
                :class="[currentMenuId==_thirdMenuList.id?'currentFocus':'']"
              >
                <span class="dot-active"></span>
                <cite v-if="_thirdMenuList.name">
                  {{_thirdMenuList.name}}
                </cite>
                <totalrow class="total pull-right" v-if="_thirdMenuList.totalRow">{{_thirdMenuList.totalRow}}</totalrow>
              </a>
            </li>
          </ol>
        </dd>
      </dl>
    </li>
  </ul>

</template>
<script>
import Constant from "@/Constant.js";
export default {
  name: "obpm-main-navbar",

  computed: {
    data() {
      return this.$store.getters.currentMenus;
    }
  },

  data: function() {
    return {
      Constant,
      activatedMenus: [], //减少操作store数据，不要将所有状态都存储在store中，只有本组件用到的用local存储
      currentMenuId:'',
    };
  },

  methods: {
    onMenuClick: function(menu) {
      this.currentMenuId = menu.id;
      console.log("menu----->",menu);
      if(menu.opentarget == "target") {
        let paramKey = '';
        let paramValue = '';
        if(menu.queryString && menu.queryString.length) {
          let queryStr = JSON.parse(menu.queryString);
          if(queryStr.length>0) {
            debugger
            paramKey = queryStr[0].paramKey;
            paramValue = queryStr[0].paramValue;
          }
          
        }
        let routeData = this.$router.resolve({
              name: "view_blank",
              query: {
                id: menu.id,
                name: menu.name,
                appId: this.data.appId,
                linkType: menu.linkType,
                actionContent: menu.actionContent,
                paramKey,
                paramValue,
                opentarget: menu.opentarget,
              }
            });
        window.open(routeData.href, '_blank');
      }else {
        let p = this.activatedMenus.indexOf(menu);
        if (p < 0) {
          this.activatedMenus.push(menu);
        } else {
          this.activatedMenus.splice(p, 1);
        }

        if (menu.linkType && menu.linkType != "") {
          switch (menu.linkType) {
            case "00": 
              this.$api.hasPermissionToForm(this.$root.appid, menu.actionContent, {
                onSucess: response => {
                  if(response.data.data) {
                    this.$emit("add-tab", {
                      id: menu.id,
                      name: menu.name,
                      appId: this.data.appId,
                      linkType: menu.linkType,
                      actionContent: menu.actionContent,//存放FORMID或VIEWID
                    });
                  }else {
                    this.$emit("add-tab", {
                      linkType: '100',
                      name: menu.name,
                      actionContent: menu.actionContent,//存放FORMID或VIEWID
                    });
                  }
                }
              })
              break;
            case "01": 
              this.$api.hasPermissionToView(this.$root.appid, menu.actionContent, {
                onSucess: response => {
                  if(response.data.data) {
                    this.$emit("add-tab", {
                      id: menu.id,
                      name: menu.name,
                      appId: this.data.appId,
                      linkType: menu.linkType,
                      actionContent: menu.actionContent,//存放FORMID或VIEWID
                    });
                  }else {
                    this.$emit("add-tab", {
                      linkType: '100',
                      name: menu.name,
                      actionContent: menu.actionContent,//存放FORMID或VIEWID
                    });
                  }
                }
              });
              break;
            case "02": 
              this.$emit("add-tab", {
                id: menu.id,
                name: menu.name,
                appId: this.data.appId,
                linkType: menu.linkType,
                actionContent: menu.actionContent,//存放FORMID或VIEWID
              });
              break;
            case "09": 
              this.$emit("add-tab", {
                id: menu.id,
                name: menu.name,
                appId: this.data.appId,
                linkType: menu.linkType,
                actionContent: menu.actionContent,//存放FORMID或VIEWID
              });
              break;
            default:
              break;
          }
          
          // this.$emit("add-tab", {
          //   id: menu.id,
          //   name: menu.name,
          //   appId: this.data.appId,
          //   linkType: menu.linkType,
          //   actionContent: menu.actionContent,//存放FORMID或VIEWID
          // });
        }
      }
      
     
    }
  }
};
</script>