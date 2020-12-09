<template>
    <span :id="id">
      <template
        v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType == 'hidden')"
      >
        <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
        
        <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
      </template>

      <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
        <!--图片展示-->
        <div class="pic-wrap">
          <div class="ima" v-if="photo"><img :width="field.imgw" :height="field.imgh" :src="photo"></div>
          <div class="ima" v-else>
            <img :width="field.imgw" :height="field.imgh" src="../assets/images/face.jpg">
          </div>
        </div>
      </template>

      <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
        <div>
          <!--开启摄像头-->
          <div class="pic-wrap">
            <div class="ima" v-if="photo"><img :width="field.imgw" :height="field.imgh" :src="photo"></div>
            <div class="ima" v-else>
              <img :width="field.imgw" :height="field.imgh" src="../assets/images/face.jpg">
            </div>
            <input type="button"  @click="showDialog" class="button_searchdel4 obpm-searchdel4">
          </div>
          <el-dialog title="选择部门" :visible.sync="dialogVisible" width="40%" height="200px" :before-close="handleClose">
            <!--图片展示-->
            <div class="shoot-area">
              <div class="left-take">
                <span>视频拍照</span>
                <video ref="video" width="160" height="125" autoplay></video>
                <el-button size="mini" class="btn" @click="photograph">拍照</el-button>
              </div>
              <div class="right-show">
                <span>拍照照片</span>
                <canvas ref="canvas" width="160" height="125"></canvas>
              </div>
            </div>
            <!--canvas截取流-->
            <span slot="footer" class="dialog-footer">
              <el-button @click="callOff()">取 消</el-button>
              <el-button type="primary" @click="onOk">确 定</el-button>
            </span>
          </el-dialog>
          <!-- <el-button size="mini" type="primary" @click="photograph">拍照</el-button>    -->
        </div>
      </template>

      <template v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
        <div class="pic-wrap">
          <div class="ima" v-if="photo"><img :width="field.imgw" :height="field.imgh" :src="photo"></div>
          <div class="ima" v-else><img :width="field.imgw" :height="field.imgh" src="../assets/images/face.jpg"></div>
          <input type="button"  @click="dialogVisible = false" class="button_searchdel4 obpm-searchdel4">
        </div>
      </template>
    </span>
</template>

<script>
//import axios from 'axios';
import Constant from "@/Constant.js";
//import API from "@/api.js";
export default {
	name: 'o-photo',
	props: ["id"],
	computed: {
		field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
			return formData;//this.$parent.findField(this.id);
		}
	},
	data: function() {
		return {
      Constant,
      dialogVisible: false,
      photo:'',
      savePhoto:'',
		}
	},
	methods: {
    // 调用摄像头
    callCamera () {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(success => {
        // 摄像头开启成功
        this.$refs['video'].srcObject = success
        // 实时拍照效果
        this.$refs['video'].play()
      }).catch(error => {
        console.error('摄像头开启失败，请检查摄像头是否可用！');
        console.log(error);
      })
    },
    // 拍照
    photograph () {
      let ctx = this.$refs['canvas'].getContext('2d');
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(this.$refs['video'], 0, 0, 160, 125);
      // 转base64格式、图片格式转换、图片质量压缩
      let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7);
      console.log("拍的图片-->");
      console.log(imgBase64);
      this.savePhoto = imgBase64;
      
    },
    // 关闭摄像头
    closeCamera () {
      if (!this.$refs['video'].srcObject) return
      let stream = this.$refs['video'].srcObject;
      let tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      })
      this.$refs['video'].srcObject = null;
      console.log("关闭了");
    },
    showDialog(){
      var explorer = window.navigator.userAgent;
      if (explorer.indexOf("MSIE") >= 0 || explorer.indexOf("Edge") >=0 ) {
        alert("暂不支持IE浏览器");
      }else {
        this.dialogVisible = true;
        this.callCamera();
      }

    },
    onOk() {
      this.photo = this.savePhoto;
      this.dialogVisible = false;
      this.closeCamera();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.closeCamera();
          done();
        })
        .catch(() => {});
    },
    callOff() {
      this.dialogVisible = false;
      this.closeCamera();
    }
  }
}
</script>

<style lang="scss" scoped>
  .pic-wrap{
    margin:0 auto;
    margin-left:125px;
    display: -webkit-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    // .ima {
    //   width:100px;
    //   height:100px;
    // }
    input {
      margin-left:15px;
    }
  }
  .shoot-area {
    width:100%;
    height:200px;
    display: -webkit-box;
    display: flex;
    flex-direction: row;
    .left-take {
      width:182px;
      height:200px;
      margin-right:70px;
      padding:12px 10px;
      background: #c5dae9;
      box-shadow: 0px 3px 3px 1px rgba(0, 0, 0, 0.4);
      &>span {
        height:18px;
        color:#0b333c;
        font-weight: bold;
      }
      .btn {
        float: right;
      }
    }
    .right-show {
      background: #c5dae9;
      box-shadow: 0px 3px 3px 1px rgba(0, 0, 0, 0.4);
      width:182px;
      height:200px;
      margin-right:70px;
      padding:12px 10px;
      &>span {
        height:18px;
        color:#0b333c;
        font-weight: bold;
      }
    }
    .el-dialog__body {
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
      background: pink;
    }
  }
</style>
