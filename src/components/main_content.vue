<template>
  <transition :duration="1000" name="face">
    <!-- class="main-content" -->
    <div v-bind:class="[currentAct ? 'main-content-first' : 'main-content-second' , 'main-content']">
      <div class="main-body">
        <div class="main-nav clearfix">
          <div class="homepageN fl" @click="onHomeTabClick">
            <!-- <a href="#" class="a-link">
              <i class="glyphicon glyphicon-home"></i>
              <img src="../assets/images/Tloa_home_returnhome@2x.png">
              <cite>首页</cite>
            </a> -->
            <div class="a-link">
              <img src="../assets/images/Tloa_home_returnhome@2x.png">
              首页
            </div>
          </div>
          <div class="close-all-tab fr" >
            <span @click="closeAllTab">关闭全部</span>
            <!-- <span style="margin-left: 10px;margin-right:10px;" @click="setWidget">
              <i class="el-icon-setting" style="color:#999; font-size:15px;"></i>
            </span> -->
            <span  @click="setWidget" class="img">
              <img src="../assets/images/Tloa_home_set@2x.png" alt="">
            </span>
          </div>
          <div class="main-tab-con clearfix">
            <div class="img fl" @click="toLeft">
              <img class="fl" src="../assets/images/Tloa_home_nextreturn@2x.png">
            </div>
            <div class="img fr" @click="toRight">
              <img class="fr" src="../assets/images/Tloa_home_nextstep@2x.png">
            </div>          
            <!-- <i class="glyphicon glyphicon-menu-left arrow-upicon fl"></i> -->
            <!-- <i class="glyphicon glyphicon-menu-right arrow-downicon fr"></i> -->
            <div class="main-tab-carousel" ref="box">
              <ul class="main-tab" ref="ulBox">
                <li v-for="(tab,index) in tabs" :key="tab.id" :ref="'li'+index">
                  <div
                    class="main-sortable"
                    :class="{ 'sortable-active': tab.active }"
                    @click="onTabClick(tab,index)"
                  >
                    <cite>{{tab.name}}</cite>
                    <!-- <i class="glyphicon glyphicon-remove" @click.stop="onCloseBtnClick(tab)"></i> -->
                    <i class="el-icon-close" @click.stop="onCloseBtnClick(tab,index)"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="main-tab-content">
          <div class="myapps-component" :style="{display: isHomeActive()?'block':'none'}">
            <main_homepage 
              ref="mainHomepage"
              v-bind="$attrs"
              v-on="$listeners" 
              v-if="isRouterHomepage"
              @event="refreshPage"
            />
          </div>
          <div
            class="myapps-component"
            v-for="(tab, i) in tabs"
            :key="tab.id"
            :style="{ 'display': tab.active ? 'block':'none' }"
          >
            <obpm_open_container
              :ref="`container${i}`"
              v-if="isRouterAlive" 
              v-bind="$attrs"
              v-on="$listeners"
              :openParams="tab">
            </obpm_open_container>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import obpm_open_container from "@/components/obpm_open_container.vue"
import main_homepage from "@/components/main_homepage.vue"
import { constants } from 'crypto';
// import main_pending from "@/components/main_pending.vue"
// import main_processing  from "@/components/main_processing.vue"
// import instrument from "@/components/instrument.vue"


export default {
  name: "obpm-main-content",
  props: ["tabs"],
  components: {
    obpm_open_container,
    main_homepage
    // main_pending,
    // main_processing,
    // instrument
  },
  watch: {
    tabs:{
      immediate:true,
      handler(val){
        // if(val && val.length == 7) {
        //   debugger
        //   console.log("-----1>",this.$refs[`box`].scrollLeft);
          
        //   this.$nextTick(() => {
        //     this.$refs[`box`].scrollLeft = this.$refs[`box`].scrollLeft + 31;
        //     console.log("-----2>",this.$refs[`box`].scrollLeft);
        //   })
        // }
        if(val && val.length > 0) {
          for(let i=0; i<val.length; i++) {
            if(val[i].active && i == 6) {
              this.$nextTick(() => {
                this.$refs[`box`].scrollLeft = this.$refs[`box`].scrollLeft + 31;
              })
            }else if(val[i].active && i > 6) {
              this.$nextTick(() => {
                this.$refs[`box`].scrollLeft = this.$refs[`box`].scrollLeft + 135;
              })
            }else if(val[i].active && i <= 6) {
              this.$nextTick(() => {
                this.$refs[`box`].scrollLeft = 0;
              })
            }
          }
        }
        

      },
      deep: true,
    },
  },
  data: function() {
    return {
      // tabs: []
      isRouterAlive: true,
      isRouterHomepage: true,
      currentAct:true,
    };
    // return API.getMenus(this.$props.appid);
  },
  methods: {
    setMaincontent() {
      this.currentAct = !this.currentAct;
    },
    toLeft() {
      if(0 < this.$refs[`box`].scrollLeft < 809) {
        this.$refs[`box`].scrollLeft = 0
      }else if(this.$refs[`box`].scrollLeft >=  809) {
        this.$refs[`box`].scrollLeft = this.$refs[`box`].scrollLeft - 809;
      }
    },
    toRight() {
      this.$refs[`box`].scrollLeft = this.$refs[`box`].scrollLeft+809;
    },
    refreshPage() {
      this.isRouterHomepage = false;
      this.$nextTick( () => {
        this.isRouterHomepage = true;
      })
    },
    closeAllTab() {
      this.$emit("close-all");
    },
    setWidget() {
      this.$refs.mainHomepage.Settherollinginstall();
    },
    parentHandleclick(e) {
      if(this.tabs && this.tabs.length>0) {
        for(let i=0; i<this.tabs.length; i++) {
          if(this.tabs[i].id == e.refreshId) {
            this.$refs[`container${i}`][0].updateData();
          }
        }
      }
      
      // this.isRouterAlive = false
      // this.$nextTick(function () {
      //   this.isRouterAlive = true
      // })
    },

    isHomeActive: function() {
      var flag = false;
      this.tabs.forEach(element => {
        flag = element.active || flag;
      });
      return !flag;
    },

    onCloseBtnClick: function(tab,index) {
      console.log("返回了main_content------------>",tab);
      console.log("tabs--------->",this.tabs);
      if(this.tabs && this.tabs.length>0) {
        for(let i=0; i<this.tabs.length; i++) {
          if(this.tabs[i].id == tab.refreshId) {
            this.$refs[`container${i}`][0].updateData();
          }
        }
      }
      //this.parentHandleclick(tab);
      this.$emit("close-tab", tab,index);
    },

    onTabClick: function(tab,index) {
      this.$emit("active-tab", tab,index);
    },

    onHomeTabClick: function() {
      this.$emit("active-home");
    }
  }
};
</script>
<style lang="scss" scoped>
    .myapps-component{
      // background:white;
      background:rgba(243,247,250,1);
    }
</style>
