<template>
  <span :id="id">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input
        :readonly="true"
        type="hidden"
        :style="field.style"
        :name="field.name"
        v-model.lazy="field.value"
        :title="field.title"
      />
      <span>{{field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <el-upload
				multiple
				action=""
				:limit="parseInt(field.limitNumber)"
				class="upload-demo"
				name="files"
				:http-request='uploadImg'
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:before-remove="beforeRemove"
				:before-upload="beforeUpload"
				:on-exceed="handleExceed"
				:file-list="field.value?field.value:[]">
				<el-button size="small" type="primary">点击上传</el-button>
			</el-upload>
    </template>

		<template v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <el-upload
					disabled
					action=""
					:limit="parseInt(field.limitNumber)"
					class="upload-demo"
					name="files"
					:http-request='uploadImg'
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:before-remove="beforeRemove"
					:before-upload="beforeUpload"
					:on-exceed="handleExceed"
					:file-list="field.value?field.value:[]">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
      </template>
			<template v-else>
				<el-upload
					disabled
					action=""
					:limit="parseInt(field.limitNumber)"
					class="upload-demo"
					name="files"
					:http-request='uploadImg'
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:before-remove="beforeRemove"
					:before-upload="beforeUpload"
					:on-exceed="handleExceed"
					:file-list="field.value?field.value:[]">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</template>
    </template>
  </span>
</template>

<script>
import axios from 'axios';
import Constant from "@/Constant.js";
import API from "@/api.js";
export default {	
	name: 'o-file-upload',
	props: ["id"],
	computed: {
		field: function() {
			let formData = this.$parent.findField(this.id);
			if(formData.value && typeof formData.value == 'string') {
        formData.value = JSON.parse(formData.value);
      }if(formData.value && formData.value instanceof Array) {
        if(formData.value.length == 0) {
          formData.value = "";
        }else {
          formData.value = formData.value;
        }
        formData.value = formData.value;
      }else {
        formData.value = '';
      }
      formData.picUrl = "http://" + window.location.host + "/obpm/"
			return this.$parent.findField(this.id);
		}
	},
	data: function() {
		return {
			Constant,
			fileList: [],
			fileType:'',
		};
	},
	methods: {
		// uploadImg(){
			// 	let actionType = this.fileType;
			// 	let appId = this.$parent.$parent.getAppId();
			// 	let allowedTypes = this.field.fileType;
			// 	let fieldId = this.id;
			// 	let fileSaveMode = this.field.fileSaveMode;
			// 	let path = this.field.path;
			// 	let config = {
			// 		headers: {
			// 			'Content-Type': 'multipart/form-data'
			// 		},
			// 		transformRequest: [function (data) {
			// 			return data
			// 		}]
			// 	}
			//   axios({
			// 		config,
			// 		url: "/obpm/runtime/upload?applicationId=" + appId + "&allowedTypes=" + allowedTypes + "&fieldId=" + fieldId +"&fileSaveMode=" + fileSaveMode + "&path=" + path + "&actionType=" + actionType,
			// 		method: 'post', 
			//   }).then(function (response) {
						
			//       console.log(response);
						
			//   }).catch(
			//       function (error) {
			//         if(onError) onError(error);
			//       }
			//   )
		// },
		UploadFile() {
			let actionType = this.fileType;
			let appId = this.$parent.$parent.getAppId();
			let allowedTypes = this.field.fileType;
			let fieldId = this.id;
			let fileSaveMode = this.field.fileSaveMode;
			let path = this.field.path;
			return "/obpm/runtime/upload?applicationId=" + appId + "&allowedTypes=" + allowedTypes + "&fieldId=" + fieldId +"&fileSaveMode=" + fileSaveMode + "&path=" + path + "&actionType=" + actionType;
		},
		uploadImg(e){
			let fileArray = e.file;
			let file = fileArray;
			let that = this;
			let form = new FormData();
			form.append("files", file);
			//form.append("***");//根据上传入参添加参数
			//let result = await this.post("/file/upload-file", form);
			let files = form;
			let actionType = this.fileType;
			let appId = this.$root.appid;
			let allowedTypes = this.field.fileType;
			let fieldId = this.id;
			let fileSaveMode = this.field.fileSaveMode;
			let path = this.field.path;
			axios({
				headers: {
					"content-type": "multipart/form-data;boundary=" + Math.random()
				},
				data: files,
				url:
					"/obpm/runtime/upload?applicationId=" +
					appId +
					"&allowedTypes=" +
					allowedTypes +
					"&fieldId=" +
					fieldId +
					"&fileSaveMode=" +
					fileSaveMode +
					"&path=" +
					path +
					"&actionType=" +
					actionType,
				method: "post"
			})
			.then(function(response) {
				that.picUrl = "http://" + window.location.host + "/obpm/";
				let obj = {
					name: response.data.data[0].fileName,
					path: response.data.data[0].filePath,
					url: "http://" + window.location.host + "/obpm/" + response.data.data[0].filePath,
				};
				that.fileArray.push(obj);
				that.field.value = that.fileArray;
				console.log("that.filed.value---->",that.field.value);
				if (that.field.refreshOnChanged){
					that.$parent.refresh(that.id);
				}

			})
			.catch(function(error) {
				console.log(error);
			});
		},


		handlePreview(file) {
			//下载
			let url = URL.createObjectURL(file.raw);
			let link = document.createElement('a')
			link.style.display = 'none'
			link.href = url
			link.setAttribute('download', file.name);
			document.body.appendChild(link);
			link.click();
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeUpload(file) {
			if(this.field.customizeType == "xmind") {
				let testmsg = file.name.substring(file.name.lastIndexOf('.')+1);
				this.fileType = file.type;
				const extension = testmsg === 'xmind'
				if(!extension) {
					this.$message({
						message: '上传文件只能是 xmind格式!',
						type: 'error'
					});
					this.fileList = [];
				}
				return extension;
			}else {
				this.fileType = file.type;
				console.log("类型正确");
			}
		},
		beforeRemove(file) {
			// if(this.field.customizeType != "xmind") {
			// 	return this.$confirm(`确定移除 ${ file.name }？`).then(() => {});
			// }
			if(file && file.status=="success") {
				return this.$confirm(`确定移除 ${ file.name }？`).then(() => {});
			}	
		},
		handleRemove(file) {
			console.log("确定删除");
			if(file && file.status=="success") {
				let appId = this.$parent.$parent.getAppId();
				let formId = this.$parent.$parent.getformId();
				let docId = this.$parent.$parent.getDocId();
				let path = file.response.data[0].filePath;
				API.deleteUpload(
					appId,
					formId,
					docId,
					path,
					{
						onSucess: response => {
							console.log("删除了");
							console.log(response);
						}
					}
				)
			}	
		},
	}
}
</script>

<style>

</style>
