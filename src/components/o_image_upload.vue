<template>
  <span :id="id" class="image-upload">
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
       <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
    </template>

		<template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
				<img class="printImg" v-for="(item, index) in field.value" :key="index" :src="item.url" style="width:100px;height:100px" >
        <!-- <img src="../assets/images/face.jpg" style="width:100px;height:100px" /> -->
      </div>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
			<div class="img-wrap">
				<div class="img-box" v-if="field.value&&field.value.length>0">
					<div class="pic-list"
						:style="{width:field.imgw + 'px', height: field.imgh + 'px'}" 
						@mouseover="changeActive(index)" v-for="(item, index) in field.value" 
						:key="index"
						@mouseout="removeActive"
					>
						<div class="pic">
							<img :src="item.url" />
						</div>
						<transition name="fade">
							<div v-if="isShow && isActive==index" class="mask">
								<span @click="handlePictureCardPreview(item)">
									<i class="el-icon-zoom-in"></i>
								</span>
								<span @click="handleRemove(item,index)">
									<i class="el-icon-delete"></i>
								</span>
							</div>
						</transition>
					</div>
				</div>
				
				<el-upload
					:show-file-list='false'
					multiple
					action=""
          ref="upload"
          name="files"
					:limit="parseInt(field.limitNumber)"
					:http-request='uploadImg'
					list-type="picture-card"
					:file-list="field.value?field.value:[]"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
					:on-exceed="handleExceed"
					:on-success="uploadSuccess"
					:before-upload="beforeAvatarUpload"
					:auto-upload="true"
					accept="image/*"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible" size="tiny">
					<img width="100%" height="100%" :src="dialogImageUrl" alt="">
				</el-dialog>	
			</div>
    </template>

		<template v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <el-upload
					disabled
					class="hide"
					multiple
					action=""
          ref="upload"
          name="files"
					:limit="parseInt(field.limitNumber)"
					:http-request='uploadImg'
					list-type="picture-card"
					:file-list="field.value?field.value:[]"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
					:on-exceed="handleExceed"
					:on-success="uploadSuccess"
					:before-upload="beforeAvatarUpload"
					:auto-upload="true"
					accept="image/*"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible" size="tiny">
					<img width="100%" height="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
      </template>

			<template v-else>
				<el-upload
						disabled
						multiple
						action=""
						ref="upload"
						name="files"
						:limit="parseInt(field.limitNumber)"
						:http-request='uploadImg'
						list-type="picture-card"
						:file-list="field.value?field.value:[]"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:on-exceed="handleExceed"
						:on-success="uploadSuccess"
						:before-upload="beforeAvatarUpload"
						:auto-upload="true"
						accept="image/*"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible" size="tiny">
					<img width="100%" height="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</template>
    </template>
  </span>
</template>

<script>
import axios from 'axios';
import Constant from "@/Constant.js";
import API from "@/api.js";
export default {
	name: 'o-image-upload',
	props: ["id"],
	computed: {
		field: function() {
			let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
      // if(formData.value && formData.value.length>0) {
			// 	formData.value = JSON.parse(formData.value);
			// 	console.log("formData.value--->",	formData.value);
      // }else {
      //   formData.value = [];
			// }
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
      return formData;
		}
	},
	data: function() {
		return {
			Constant,
			dialogImageUrl: '',
			dialogVisible: false,
			imageType:'',
			fileArray:[],
			uploadArray:[],
			isActive:-1,
			isShow: false,
			photoList: [
				{
					path:'../assets/images/face.jpg',
				},
				{
					path:'../assets/images/warning.jpg',
				}
			]
		};
	},
	mounted() {
		this.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕 
			if(this.field.imgh) {
				document.getElementById(this.field.id).getElementsByClassName("el-upload")[0].style.width  = parseInt(this.field.imgw) +"px";
				document.getElementById(this.field.id).getElementsByClassName("el-upload")[0].style.height =  parseInt(this.field.imgh)+"px";
				document.getElementById(this.field.id).getElementsByClassName("el-upload")[0].style.lineHeight = parseInt(this.field.imgh) +"px";
				// document.getElementById(this.field.id).getElementsByClassName("el-upload-list__item")[0].style.width  = parseInt(this.field.imgw) +"px";
				// document.getElementById(this.field.id).getElementsByClassName("el-upload-list__item")[0].style.height  = parseInt(this.field.imgh) +"px";
				
				
			}
			
		});
	},
	methods: {
		changeActive(index) {
			this.isActive = index;
			this.isShow = true;
		},
		removeActive() {
			this.isActive = -1;
		},
		uploadSuccess(response, file, fileList) {
			console.log(file);
			console.log(fileList);
			let obj = {
					name: response.data[0].fileName,
					path: response.data[0].filePath,
					url: "http://" + window.location.host + "/obpm/" + response.data[0].filePath,
				};
			this.field.value.push(obj);
		},
		UploadUrl:function(type){
			let actionType = type;
			let appId = this.$parent.$parent.getAppId();
			let allowedTypes = this.field.fileType;
			let fieldId = this.id;
			let fileSaveMode = this.field.fileSaveMode;
			let path = this.field.path;
			let filePath = "/obpm/runtime/upload?applicationId=" + appId + "&allowedTypes=" + allowedTypes + "&fieldId=" + fieldId +"&fileSaveMode=" + fileSaveMode + "&path=" + path + "&actionType=" + actionType;
			return filePath; 
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
			let actionType = this.imageType;
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
				if (that.field.refreshOnChanged){
					that.$parent.refresh(that.id);
				}

			})
			.catch(function(error) {
				console.log(error);
			});
		},
		handleRemove(file, fileList) {
			console.log("file--->",file);
			console.log(fileList);
			let appId = this.$root.appid;
      let formId = this.field.formId;
      let docId = this.field.docId;
      let path = file.path;
      API.deleteUpload(appId, formId, docId, path, {
        onSucess: (res) => {
					if(res.data.errcode == 0) {
						let arr = this.field.value;
						for(let i=0; i<arr.length; i++) {
							if(file.path == arr[i].path) {
								arr.splice(i, 1);
							}
						}
						console.log("this.field.value--->",this.field.value);
					}
          if (this.field.refreshOnChanged){
            this.$parent.refresh(this.field.id);
          }
        }
      });
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeAvatarUpload(file) {
			this.imageType = file.type;
			const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif' || 'image/jpg' || 'image/JPG'|| 'image/JPEG'|| 'image/GIF'|| 'image/PNG';
			let name = file.name.split(".")[1];
			let arr = ['','jpeg','png','gif','jpg', 'JPG', 'JPEG', 'PNG', 'GIF'];
			let isSuffix = arr.indexOf(name)>0;
			// for(let i=0; i<arr.length; i++) {
			// 	if(name == arr[i]) {
			// 		debugger
			// 		continue;
			// 	}
			// }
			const isLt2M = file.size / 1024 < this.field.maxsize;
			if (!isJPG || !isSuffix) {
				this.$message.error('图片格式不正确!');
			}
			if (!isLt2M) {
				this.$message.error('上传文件大小超出限制!');
			}
			return isJPG && isLt2M && isSuffix;
		},
	},
}
</script>

<style lang="scss" scoped>
	
	
</style>
