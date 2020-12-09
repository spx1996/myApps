<template>
  <div class="view-print">
    <div class="print-wrap">
      <!-- <view_listview :openParams="{appId:$route.query.appId, viewId: $route.query.tactionContent,}" :view="view" /> -->
      <view_delegate :openParams="{appId:$route.query.appId, actionContent: $route.query.actionContent}" :showtype="$route.query.opentarget"/>
      <!-- {{$route.query}} -->
    </div>
  </div>
</template>

<script>
import API from "@/api.js";
import view_listview from "@/components/view_listview.vue";
import view_delegate from "@/components/view_delegate.vue";


export default {
  props: [
  ],
  components: {
    view_listview,
    view_delegate,  
  },
  data: function() {
    return {
      view:'',
    };
  },
  created() {
    //this.getviewData();
  },
  mounted(){
    
  },
  computed: {
  
  },
  methods: {
    getviewData() {
      let appId = this.$root.appid;
      let obj = {
            appId,
            viewId: this.$route.query.actionContent,
            test: this.$route.query.paramValue,
            containTitle: this.$route.query.name,
          };
      if(this.$route.query.paramKey) {
        obj[this.$route.query.paramKey] = this.$route.query.paramValue;
      }

      //delegate带参数的
      this.$api.getBlankViewTemplate(appId, obj, {
        onSucess: response => {
          this.view = response.data.data;
        }
      })
    },
  }
}
</script>

<style lang="scss">
  .view-print {
    width: 100%;
    height: 100%;
    background: #ffffff;
    padding:10px 20px;
    box-sizing: border-box;
    .print-wrap {
      width:100%;
      height: 100%;
      .delegate {
        position: relative;
        width:100%;
        height:100%;
        .view-listview {
          width: 100%;
          height: calc(100% - 57px);
          .listview-container {
            //padding-top: 20px;
            padding:18px 18px 0 18px;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            overflow: hidden;
            .el-table th {
              padding: 8px 0;
              min-width: 0;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              text-overflow: ellipsis;
              vertical-align: middle;
              position: relative;
              text-align: center;
            }
            .el-table td, .el-table th {
              padding: 8px 0;
              min-width: 0;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              text-overflow: ellipsis;
              vertical-align: middle;
              position: relative;
              text-align: left;
            }
          }
          .listview-box {
            width:100%;
            height: calc(100% - 40px);
            overflow: hidden;
            .scrollbar {
              width: 100%;
              height: 100%;
              overflow-x: hidden;
            }
            
            .el-scrollbar__wrap {
              overflow-x: hidden;
            }
          }
          .page {
            width:100%;
            height: 40px;
            .page-con {
              width: 100%;
              height:100%;
              display: -webkit-flex;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
      
        }
      }
    }
  }
</style>
