<template>
  <div :id="id" ref="qrcode" v-if="field.displayType == Constant.PermissionType_MODIFY">
    
  </div>
  <div  :id="id" ref="qrcode" v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
    
  </div>
  <div :id="id" v-else>
    {{field.hiddenValue}}
  </div>
</template>

<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
import QRCode from 'qrcodejs2'
export default {
  name: "o-qrcode",
  props: ["id"],
  mounted () {
    this.qrcode();
  },
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    },
  },

  data: function() {
    return {
      Constant,
    };
  },

  methods: {
    qrcode() {
      let text = '';
      let host = window.location.protocol + "//" + window.location.host;
      let domainId = this.$store.state.domainId;
      let uuid = "";
      let len = 16;
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = chars.length;
      for (let i = 0; i < len; i++) {
        uuid += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      let randomCode = uuid;
      switch (this.field.handleType) {
        case "text": {//显示值
          text = this.field.value;
          break;
        }
        case "link"://打开链接
        case "callback_event": {//执行扫码事件回调脚本
          let formId = this.field.formId,
              docId = this.field.docId,
              fieldId = this.field.divId,
              applicationId = this.$root.appid;
          text = host + "/obpm/portal/document/qrcodefield/ready?domainId=" + domainId + 
            "&formId=" + formId + 
            "&docId=" + docId + 
            "&fieldId=" + fieldId + 
            "&applicationId=" + applicationId + 
            "&_randomCode=" + randomCode;
          break;
        }
        default:
          break;
      } 
      let width ,
        height;
      if(this.field.displayType == 3){
        width = 0;
        height = 0;
      }else {
        width = this.field.size,
        height = this.field.size;
      }
      let qrcode = new QRCode(this.id, {
        width: width,  
        height: height,
        correctLevel: 3,
        text: text, // 二维码地址
      })
    },
  }
}
</script>

<style scoped>

</style>
