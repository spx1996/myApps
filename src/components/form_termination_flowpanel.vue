<template>
  <!-- 终止流程面板 -->
  <div class="termination">
    <div class="t-box">
      <div class="sug-left">意见:</div>
      <div class="idea-textbox">
        <el-input
          class="idea-box"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见..."
          maxlength="300"
          v-model="attitude">
        </el-input>
      </div>
    </div>
    <div class="foot-btns">
      <el-button size="medium">取消</el-button>
      <el-button 
        size="medium" 
        type="success"
        @click="onSubmit"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script>

import API from "@/api.js";
export default {
  props: [
      "stateId", 
      "act",
      "openParams",
      "buildFormData"
    ],
  data: function() {
    return {
      attitude:'',
    };
  },
  created() {
    
  },

  mounted() {
    
  },
  methods: {
    //提交
    onSubmit() {
      let workFlowType = this.act.workFlowType;
      let appId = this.openParams.appId;
      let docId = this.openParams._select;
      let attitude = this.attitude;
      if(workFlowType == 1) { //自由流程
        let formData = this.buildFormData;
        formData.stateId = this.stateId;
        let docId = formData.id,
            id = formData.id;
        let formId = formData.formId;
        let document = {
          applicationId: appId,
          attitude:attitude,
          docId: docId,
          document: formData,
          formId: formId,
          id: id,
          parentId: "",
          templateForm: "",
          viewId: ""
        };
        this.$api.completeFreeFlow(appId, docId,document, {
          onSucess: response => {
            let act = response.data;
            this.$emit("action", act);
          }
        });
      }else { //非自由流程
        if(!attitude) {
          Toast("意见不能为空")
        }else {
          this.$api.terminationWorkflow(appId, docId, attitude, {
            onSucess: response => {
              let act = response.data;
              this.$emit("action", act);
            }
          });
        }
      }
    },


  }
}
</script>