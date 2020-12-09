<template>
  <span>
    <div @click="jumpTo">
      <slot></slot>
    </div>
    
    <el-dialog title="提示" v-if="dialogVisible" :visible.sync="dialogVisible" :before-close="handleClose">
      <form_normalform
        :openParams="params" 
      />
    </el-dialog>

  </span>
</template>

<script>
import form_normalform from "@/components/form_normalform.vue";
export default {
  name: "o-action",
  components: {
    form_normalform,
  },
  props: [
    "action-type", 
    "formid",
    "viewId",
    "appId",
    "open-type",
    "data-val",
    "docId"
  ],
  computed: {
    
  },
  
  methods: {
    handleClose(done) {
      done();
    },
    jumpTo() {
      switch (this.actionType) {
          case "opendocument":
            //  open_present 当前页打开  open_eject 弹出层打开      open_tab 标签页打开      open_blank 新窗口打开
            if (this.openType == "open-eject" || this.openType == "dialog") {
              let docId = this.$parent.$parent.getdocid(); //使用$emit不行，将就用
              let params = {
                linkType: "00",
                appId: this.$root.appid,
                actionContent: this.formid,
                _select: docId,
              };
              this.params = params;
              this.dialogVisible = true;
            }else if (this.openType == "open-present") {
              
            }else if (this.openType == "open-blank"){
              
            }else {//默认用tab方式打开
              
            }
            // if(this.formid) {
            //   this.$router.push({  
            //     name:'open',
            //     query:{linkType:'00',actionContent:this.formid}
            //   })
            // }
            break;
          case "viewselect":
              
            break;
          case "openview":
            if(this.viewId) {
              this.$router.push({  
                name:'open',
                query:{linkType:'01',actionContent:this.viewId}
              })
            }
            //  open_present 当前页打开  open_eject 弹出层打开      open_tab 标签页打开      open_blank 新窗口打开
            // if (this.openType == "open-eject" || this.openType == "dialog") {
                
            // }
            // else if (this.openType == "open-present") {
              
            // }
            // else if (this.openType == "open-blank"){
              
            // }
            // else {//默认用tab方式打开

            // }
            break;
          case "jumpto": //跳转
            break;
      }
    }
  },
  data: function() {
    return { 
      dialogVisible:false,
      params:'',
    };
  }
};
</script>
