<template>
  <div class="print-view">
    <div>
      <view_listview 
        v-if="viewPrintData"
        :openParams="openParams"  
        :view="viewPrintData" 
      />
    </div>
    <div class="page">
      <div class="page-con" >
        <el-button
          class="btn" 
          @click="printView" 
          size="medium"
          type="primary"
          >打印</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import view_listview from "@/components/view_listview.vue";
export default {
  name:"",
  props: [""],
  components: {
    view_listview,
  },
  computed: {
  },

  mounted() {
    this.getViewData();
  },

  data: function() {
    return {
      viewPrintData:'',
      openParams:'',
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]


    }
  },

  methods: {
    printView() {
      window.print();
    },
    getViewData(){
      console.log("this.$route.query----->",this.$route.query);
      let appId = this.$root.appid;
      let viewId = this.$route.query.viewId;
      let isPrint = this.$route.query.isPrint;
      this.$api.getPrintViewTemplate(appId, viewId, isPrint, {
        onSucess: response => {
          this.viewPrintData = response.data.data;
          // if(this.viewPrintData) {
          //   setTimeout( ()=> {
          //     let newWindow = window.open('_blank');  
          //     let codestr = document.getElementById('print').innerHTML;  
          //     newWindow.document.write(codestr);  
          //     newWindow.document.close();
          //     setTimeout( ()=> {
          //       newWindow.print();
          //     }, 100);
          //   }, 500);
          // }
          // if(view) {
          //   this.$api.getViewData(
          //     //普通视图接口
          //     this.$root.appid,
          //     this.printParams.viewId,
          //     {
          //       parentId: "",
          //       currpage: 1,
          //       lines: 10,
          //       searchWord:'',
          //     },
          //     {},
          //     {
          //       onSucess: response => {
          //         debugger
          //         this.viewData = response.data.data
          //       }
          //     }
          //   );
          // }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .print-view {
    width:100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background: white;
    position: relative;
    .page {
      width:calc(100% - 20px);
      height: 50px;
      position: absolute;
      bottom: 10px;
      .page-con {
        width: 100%;
        height: 50px;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 10px;
        .btn {
          margin-right: 10px;
        }
      }
      
    }
  }
</style>