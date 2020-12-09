<template>
  <div class="main-report">
    <div class="nav-btn">
      <div>
        <span @click="exportExcel">
          <i class="exportToExcelBtnicon"></i>
          导出Excel
        </span>
        <span @click="exportPdf">
          <i class="exportToExcelBtnicon"></i>
          导出Pdf
        </span>
        <span @click="print">
          <i class="htmlPrintBtnicon"></i>
          打印
        </span>
        <span class="btn-last">
          签章
        </span>
      </div>
      <div></div>
    </div> 
    <div class="report-content" v-if="currentUrl">     
      <iframe
          ref="mainFrame"
          style="border:none"
          width="100%"
          height="700"
          scrolling="no"
          frameborder="0"
          allowtransparency="true" 
          noresize="noresize"
          :src="currentUrl"
      ></iframe>
    </div>

    <el-dialog 
      title="打印" 
      v-if="dialogVisible" 
      :visible.sync="dialogVisible" 
      top="10px" 
      :lock-scroll="true"
      width="67%" 
      :before-close="handleClose"
    >
      <div class="print-content" style="height:450px;overflow:auto;">
        <div class="content-wrap" ref="print">
          <div id="print">
            <iframe
              ref="mainFrame"
              style="border:none"
              width="100%"
              height="700"
              scrolling="no"
              frameborder="0"
              allowtransparency="true" 
              noresize="noresize"
              :src="currentUrl"
            ></iframe>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button 
          type="primary" 
          v-print="'#print'"
        >
          打印
        </el-button>
      </span>
    </el-dialog>
  </div>
  
</template>
<script>

export default {
  props: ['openParams'],
  watch: {
    
    
  },
  created() {
    this.getReport();
  },
  mounted() {
    
  },

  data() {
    return{
      htmlA:'',
      currentUrl:'',
      dialogVisible:false,
    }
  },
  methods: {
    printPage() {
      let newWindow = window.open('_blank');   //  打开新窗口
      let codestr = document.getElementById('print').innerHTML;   //  获取需要生成pdf页面的div代码
      newWindow.document.write(codestr);   //  向文档写入HTML表达式或者JavaScript代码
      newWindow.document.close();     //  关闭document的输出流, 显示选定的数据
      setTimeout( ()=> {
        newWindow.print();
      }, 1000);
    },
    print() {
      this.dialogVisible = true;
    },
    exportPdf() {
      this.$api.exportReportPdf(
        this.openParams.actionContent,
        {
          onSucess: response => {
            let fileName = "";
            let type = response.headers['content-type'];
            if(response.headers['content-disposition']) {
              // fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
              let suffix = fileName.split(".")[1]
              // fileName = name + "." + suffix;
              fileName = this.openParams.name + decodeURIComponent(".pdf");
            }else {
              fileName="下载";
            }
            this.download(response, type, fileName);
          }
        }
      )

    },
    exportExcel() {
      this.$api.exportReportExcel(
        this.openParams.actionContent,
        {
          onSucess: response => {
            let fileName = "";
            let type = response.headers['content-type'];
            if(response.headers['content-disposition']) {
              debugger
              // fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
              let suffix = fileName.split(".")[1]
              // fileName = name + "." + suffix;
              fileName = "数据源下载" + ".xls";
            }else {
              fileName="下载";
            }
            this.download(response, type, fileName);
          }
        }
      )

    },

    download(res, type, filename){
      const blob = new Blob([res.data], {
        // 如果后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
        type: type
      });
      const a = document.createElement('a');
      const herf = window.URL.createObjectURL(blob);
      // 下载链接
      a.href = herf;
      // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(herf);
    },

    getReport(){
      let id = this.openParams.actionContent;
      this.$api.getCustomreports(id,
        {
          onSucess: response => {
            this.htmlA = response.data;
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
    },
  }
};
</script>
<style lang="scss" scoped>

</style>


