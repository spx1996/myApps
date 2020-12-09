<template>
  <div id="myapp">
    <div id="myapp-header" class="clearfix">
      <div class="nav-left-box fl">
        <a href="#">
          <img src="@/assets/images/good-logo.png" alt class="logo" />
        </a>
        <a href="#" @click="hiddenMenu">
          <i class="fa fa-dedent nav-menu"></i>
        </a>
      </div>
      <div class="app-bar fl">
        <obpm-main-appbar @change-menu="changeMenu" @add-tab="addTab" />
      </div>
      <div class="center-nav fr">
        <ul class="center-navul">
          <li class="center-navli layui-nav-item lockcms" pc>
            <a href="javascript:;" @click="lockScreen">
              <i class="lockScreenicon"></i>
            </a>
          </li>
          <!-- <li class="center-navli">
            <a href="#">
              <i class="fa fa-paint-brush"></i>
            </a>
          </li> -->
          <!-- <li class="center-navli">
            <div class="weather" pc>
              <div id="tp-weather-widget" style="right:0"></div>
            </div>
          </li> -->
          <li class="center-navli">
            <a href="#" @click="addTab({id:'03',name:'信息管理',linkType:'03'})">
              <i class="fa fa-bell-o"></i>
            </a>
          </li>
          <li class="center-navli center-navli-last">
            <div class="mysetup">
              <a href="javascript:;">
                <img src="../assets/images/face.jpg" class="centericon" />
                <span class="personal-name">{{$store.state.myProfile.name}}</span>
                <i class="fa fa-angle-down pull-down"></i>
              </a>
              <div class="personal-settings">
                <span class="triangle"></span>
                <ul>
                  <li>
                    <a @click="addTab({id:'02',name:'个人设置',linkType:'102'})">
                      <i class="fa fa-user-o"></i>
                      <cite>个人设置</cite>
                    </a>
                  </li>
                  <li>
                    <a @click="addTab({id:'03',name:'信息管理',linkType:'03'})">
                      <i class="fa fa-file-text-o"></i>
                      <cite>
                        <span>信息管理</span>
                        <span class="cite-num" v-if="notice>=0">{{notice}}</span>
                      </cite>
                    </a>
                    <!-- <cite class="num-cite">管理</cite> -->
                  </li>

                  <li>
                    <a @click="systemManagement">
                      <i class="systemManagicon" data-icon="icon-shezhi1"></i>
                      <cite>系统管理</cite>
                    </a>
                  </li>

                  <li>
                    <a href="javascript:;">
                      <i class="fa fa-power-off"></i>
                      <cite @click="signOut">退出系统</cite>
                    </a>
                  </li>
                </ul>
              </div>
              
            </div>
          </li>
        </ul>
        <div class="message-popup">
          <div class="message-popup-close">
            <i class="fa fa-times"></i>
          </div>
          <ul>
            <li data-id="0" style="display:none">
              <span class="message-popup-num"></span>
              <span>新消息提醒</span>
              <a class="message-popup-active" data-url="../../message/message.jsp">
                点击查看
                <cite style="display: none">消息</cite>
              </a>
            </li>
            <li data-id="1" style="display:none">
              <span class="message-popup-num"></span>
              <span>新公告提醒</span>
              <a
                class="message-popup-active"
                data-url="../../message/message.jsp?active=announcement"
              >
                点击查看
                <cite style="display: none">公告</cite>
              </a>
            </li>
            <li data-id="2" style="display:none">
              <span class="message-popup-num"></span>
              <span>新回复提醒</span>
              <a class="message-popup-active" data-url="../../message/message.jsp?active=comment">
                点击查看
                <cite style="display: none">回复</cite>
              </a>
            </li>
            <li data-id="3" style="display:none">
              <span class="message-popup-num"></span>
              <span>新事项提醒</span>
              <a class="message-popup-active" data-url="../../message/message.jsp?active=notice">
                点击查看
                <cite style="display: none" >工作事项</cite>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- v-if="notice && showMessagePopup" -->
      <div class="prompt-popup" v-if="(notice && showMessagePopup) || (otherNotice.length > 0 && showMessagePopup)">
        <div class="message">
          <div class="close-icon">
            <div class="message-popup-close" @click.stop="closeMessagePopup">
              <i class="fa fa-times"></i>
            </div>
          </div>
          <div class="tip" v-if="notice">
            <span class="tip-first">{{notice}}&nbsp;&nbsp;</span>
            <span>新事项提醒&nbsp;</span>
            <span class="tip-tree" @click="jumpToInfo({id:'03',name:'信息管理',linkType:'03', isWorkMatters:true})">点击查看</span>
          </div>
          <div class="tip" v-for="(item, index) in otherNotice" :key="index">
            <span class="tip-first">{{item.value}}&nbsp;&nbsp;</span>
            <span v-if="item.type == '0'">新消息提醒&nbsp;</span>
            <span v-if="item.type == '1'">新公告提醒&nbsp;</span>
            <span v-else-if="item.type == '2'">新回复提醒&nbsp;</span>
            <span v-else-if="item.type == '3'">新事项提醒&nbsp;</span>
            <span class="tip-tree" @click="jumpToInfo({id:'03',name:'信息管理',linkType:'03'})">点击查看</span>
          </div>
          
        </div>
      </div>
    </div>
    <div class="myapp-content">
      <transition name="slide-fade">
        <div class="nav-bar" v-if="showMenu">
          <el-scrollbar style="height:100%">
            <main_navbar :appid="appid" :key="appid" @add-tab="addTab" />
          </el-scrollbar>
        </div>
      </transition>
      
      <!-- 内容部分，包括选项卡 -->
      <main_content
        ref="mychild"
        :tabs="tabs"
        @add-tab="addTab"
        @close-tab="closeTab"
        @close-all="closeAllTab"
        @active-tab="activeTab"
        @active-home="activeHome"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
    <div id="lockWraper" v-if="isLock == 'true'">
      <div class="lock-content">
        <div class="img">
          <img src="../assets/images/face.jpg" alt="">
        </div>
        <div class="admin-header-lock-name">
          管理员
        </div>
        <div class="input_btn">
          <span>
            <input
              v-model="password" 
              type="password" 
              class="admin-header-lock-input layui-input" 
              placeholder="请输入密码解锁.." 
              name="lockPwd" 
              id="lockPwd">
          </span>
          <span class="un-lock" @click="unlockScreen">
            解锁
          </span>
        </div>
        <div class="tip">
          请输入登录密码，否则不会解锁成功哦！！！
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import main_appbar from "@/components/main_appbar.vue";
import main_navbar from "@/components/main_navbar.vue";
import main_content from "@/components/main_content.vue";
import API from "@/api.js";

export default {
  name: "mainpage",
  components: {
    "obpm-main-appbar": main_appbar,
    main_navbar,
    main_content
  },
  created() {
    //setTimeout(this.getOnlineNumber, 3000);
    this.getLock()
    window.setInterval(() => {
      setTimeout(this.getOnlineNumber, 0);
    }, 60000)

    let radomNum = new Date().getTime();
    this.$api.getMessage(
      radomNum,
      {
        onSucess: res => {
          this.notice = res.data.data.notice;
        }
      }
    )
    this.$api.getNotificationNum(
      {
        onSucess: res => {
          let otherNotice = res.data.data;
          let arr = [];
          for(let key in otherNotice) {
            let obj = {};
            if(otherNotice[key] > 0 && key !="size") {
              obj.type = key;
              obj.value = otherNotice[key];
              arr.push(obj);
            }
          }
          this.otherNotice = arr;
        }
      }
    )
  },

  data: function() {
    return {
      appid: "km1",
      tabs: [],
      password:'',
      isLock:'false',
      notice:'',
      otherNotice:[],
      showMessagePopup: true,
      showMenu: true,
    };
  },

  methods: {
    hiddenMenu() {
      this.showMenu = !this.showMenu;
      this.$refs.mychild.setMaincontent() // 调用子组件的方法
    },
    jumpToInfo(val){
      this.showMessagePopup = false;
      this.addTab(val);
    },
    closeMessagePopup() {
      this.showMessagePopup = false;
    },
    signOut() {
      this.$api.removeOnlineUser({
        onSucess: res => {
          if(res.status == 200) {
            console.log("res--->",res.status);
          }
        }
      })
      
      this.$api.LogOut({
        onSucess: () => {
          let url = "http://" + window.location.host + "/signon/login.html";
          window.location.href = url;
        }
      });
      // this.$api.LogOutAction({
      //   onSucess: res => {
      //     if(res.state='success'){
      //       //let url = res.data;
      //       let url = "http://" + window.location.host + "/obpm/portal/good/logout.html";
      //       console.log("resLogOutAction--->",url);
      //       window.location.href = url;
      //     }
      //   }
      // })

    },
    getLock() {
      let val = localStorage.getItem('screenLock');
      if(val) {
        this.isLock = val;
      }else {
        this.isLock = 'false';
      }
    },
    getOnlineNumber() {
      this.$api.getNotification(
        {
          onSucess: res => {
            if(res.data.data.data && res.data.data.data.length > 0) {
              let data = res.data.data.data[0];
              this.$notify({
                title: '',
                dangerouslyUseHTMLString: true,
                message: data.summary,
                duration: 5000,
                customClass: 'fontclass'
              });
            }
          }
        }
      )
    },
    systemManagement(){
      let path = window.location.protocol + "//" + window.location.host + "/obpm/";
      let domainid = this.$store.state.domainId;
      let systemUrl = path + "domain/index.html#/domain?domainid=" + domainid;
      window.open(systemUrl);
    },
    //退出系统
    Actionquit() {
      API.LogOut({
        onSucess: response => {
          if (response.status == 200) {
            alert("是否退出当前登陆!");
            window.location = "http://localhost:8080/obpm/";
          }
        },
        onError:error=>{
          console.log(error);
        }
      });
    },

    //解除锁屏
    unlockScreen() {
      this.$api.isLock(
        this.password,
        {
          onSucess: res => {
            if(res.data.data == true) {
              this.isLock = 'false';
              localStorage.setItem('screenLock', 'false');
            }else {
              this.isLock = 'true';
            }
          }
        }
      )
      //let val = localStorage.getItem('screenLock');
    },

    //一键锁频
    lockScreen() {
      this.password = '';
      this.isLock = 'true';
      localStorage.setItem('screenLock', 'true');
    },
    changeMenu: function(appid) {
      this.appid = appid;
    },
    activeHome: function() {
      this.tabs.forEach(function(value) {
        value.active = false;
      });
    },
    addTab: function(param) {
      console.log("添加一个---->",param);
      var flag = false;
      this.tabs.forEach(function(value) {
        if ( value.id && value.id == param.id) {
          value.active = true;
          flag = flag || true;
        }else {
          value.active = false;
        }
      });

      if (flag) return;
      this.tabs.forEach(function(value) {
        value.active = false;
      });
      param.active = true;
      this.tabs.push(param);
    },

    closeAllTab() {
      this.tabs = [];
    },

    closeTab: function(tab,tabindex) {
      if(tabindex >= 0) {
        this.tabs.splice(tabindex, 1);
        if(this.tabs[this.tabs.length-1]) {
          this.tabs[this.tabs.length-1].active = true;
        }
        
      }else {
        let i = -1;
        this.tabs.forEach(function(value, index) {
          if ((value.id && value.id == tab.id) || (value._select && value._select == tab._select)) {
            i = index;
          }
        });

        // if(!tab.id && !tab._select) {
        //   debugger
        //   this.tabs.forEach(function(value, index) {
        //     if ((value.actionContent == tab.actionContent)) {
        //       i = index;
        //     }
        //   });
        //   this.tabs.splice(i, 1);
        //   let act = this.tabs[i];
        //   if (act) {
        //     this.activeTab({ id: act._select?act._select:act.id });
        //   }else if(i>=1){
        //     debugger
        //     let act = this.tabs[i-1];
        //     this.activeTab({ id: act._select?act._select:act.id });
        //   }


        // }else {
          this.tabs.splice(i, 1);
          let act = this.tabs[i];
          if (act) {
            this.activeTab({ id: act._select?act._select:act.id });
          }else if(i>=1){
            let act = this.tabs[i-1];
            this.activeTab({ id: act._select?act._select:act.id });
          }else {
            this.tabs[this.tabs.length-1].active = true;
          }
        //}



      }
    },
    activeTab: function(tab,index) {
      if(index>=0) {
        this.tabs.forEach((value, i) => {
          if (i == index) {
            value.active = true;
          } else {
            value.active = false;
          }
        });
      }else {
        this.tabs.forEach(function(value) {
          if ((value.id && value.id == tab.id) || (value._select && value._select == tab._select) ||  (value._select && value._select == tab.id)) {
            value.active = true;
          } else {
            value.active = false;
          }
        });
      }
      
      
    }
  },
  
};
</script>

<style lang="scss">
#lockWraper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(24, 38, 46, 1);
    z-index: 99999;
    color: red;
    .lock-content {
      width: 460px;
      height: 240px;
      background: white;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -120px;
      margin-left: -230px;
      .img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        left: 50%;
        top: -30px;
        margin-left:-30px;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .admin-header-lock-name {
        margin-top: 43px;
        width: 100%;
        text-align: center;
        color: #333636;
        margin-bottom: 55px;
      }
      .input_btn {
        width: 100%;
        padding-left: 95px;
        padding-right: 95px;
        box-sizing: border-box;
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        align-items: center;
        #lockPwd {
          width: 200px;
          height: 30px;
          border-radius: 3px;
          background: #46D2DB;
          display: inline-block;
          padding-left: 10px;
          font-size: 14px;
          color: #fff;
          border: none;
          vertical-align: middle;
          margin-right: 10px;
          outline: none;
        }
        .un-lock {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          background: #46D2DB;
          color: #fff;
          width: 60px;
          border-radius: 3px;
          text-align: center;
          cursor: pointer;
        }
        ::-webkit-input-placeholder { /* WebKit browsers */ 
          color: #fff; 
        } 
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
          color: #fff; 
        } 
        ::-moz-placeholder { /* Mozilla Firefox 19+ */ 
          color: #fff; 
        } 
        :-ms-input-placeholder { /* Internet Explorer 10+ */ 
          color: #fff; 
        }
      }
      .tip {
        width: 100%;
        padding-left: 95px;
        box-sizing: border-box;
        margin-top: 20px;

      }
      
    }
}
.fontclass {
    .el-notification__content {
      .notice_actor {
        color: #0095FF;
      }
      // .notice_flowType {
      //   color: #0095FF;
      // }
      .notice_summary {
        color: #0095FF;
      }
    }
    
}
</style>
