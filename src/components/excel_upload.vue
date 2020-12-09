<template>
  <div class="custom-dialog">
    <div class="body-cen">
      <div class="tmpl">
        附件：<span @click="downloadFile">点击下载模板</span>
      </div>
      <div class="upload">
        <el-input class="input" v-model="excelPath"></el-input> 
        <!-- <span class="select">选择文件</span> -->
        <!-- <excelUpload 
          @getExcelPath="setExcelPath" 
          :viewId="view.id"
          :actId="actId"
        /> -->
        <div>
          <el-upload
            multiple
            action=""
            name="files"
            :show-file-list='false'
            :http-request='uploadImg'
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
          >
            <span class="select">选择文件</span>
          </el-upload>
        </div>
      </div>
      <div class="import">
        <span class="excel-btn" @click="importExcel">
          <i class="importSurfaceicon" />
          导入Excel表
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
export default {
  props: ["viewId", "act"],
  data: function() {
    return {
      excelPath:'',
    };
  },

  methods: {
    downloadFile() {
      let path = this.act.excelTemplate
      let name = path.split("/")[path.split("/").length-1];
      this.$api.templateDownload(
        name,
        path,
        {
          onSucess: response => {
            let fileName = "";
            let type = response.headers['content-type'];
            if(response.headers['content-disposition']) {
              //fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
              fileName = name;
            }else {
              fileName="下载";
            }
            this.download(response, type, fileName)
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


    importExcel() {
      if(!this.excelPath) {
        this.$message.error('请先选择要导入的Excel表');
      }else {
        let data = { 
          impmappingconfigid: this.act.impmappingconfigid,
          path: this.excelPath,
          actId: this.act.id,
          parentId: "",
          isRelate: undefined,
        };
        this.$api.importExcel(
          this.$root.appid, 
          this.viewId, 
          data,
          {
            onSucess: response => {
              if(response.data.errcode==0) {
                //this.$emit("update:visible", false);
                this.$emit("event");
                this.$notify({
                  title: '成功',
                  message: response.data.data,
                  type: 'success'
                });
              }else {
                if(response.data.errmsg) {
                  this.$message.error(response.data.errmsg);
                }else {
                  this.$message.error('错误');
                }
                
              }
            }
          }
        );
      }
    },

    uploadImg(e){
			let fileArray = e.file;
			let file = fileArray;
			let that = this;
      let form = new FormData();
      let id = 'WU_FILE_0',
          name = e.file.name,
          type = e.file.type,
          lastModifiedDate = e.file.lastModifiedDate,
          size = e.file.size;
      form.append("id", id);
      form.append("name", name);
      form.append("type", type);
      form.append("lastModifiedDate", lastModifiedDate);
      form.append("size", size);
      form.append("file", file);
      let allowedTypes = "xls;xlsx",
          fieldid = null,
          fileSaveMode = undefined,
          nullpath = "IMPORTEXCEL_PATH";
			axios({
				headers: {
					"content-type": "multipart/form-data;boundary=" + Math.random()
				},
				data: form,
        url:"/obpm/portal/FrontFileAndImageUploadServlet?data=" + 
            "nullpath:" + nullpath + 
            ",fileSaveMode:" + fileSaveMode + 
            ",fieldid:" + fieldid + 
            ",allowedTypes:" + allowedTypes + 
            ",applicationid:" + this.$root.appid,
				method: "post"
			})
			.then(function(res) {
        if(res.data){
          let path = res.data.split(",")[1];
          //that.$emit("getExcelPath", path); 
          that.excelPath = path;
        }
			})
			.catch(function(error) {
				console.log(error);
			});
		},


		handlePreview(file) {
      
		},
		handleExceed(files, fileList) {
			
		},
		beforeUpload(file) {
			
		},
		beforeRemove(file) {
			
		},
		handleRemove(file) {
			
		},



  }
};
</script>>
