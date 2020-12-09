<template>
  <div class="form-print">
    <div class="print-wrap">
      <component name="printform" :is="template"></component>
    </div>
  </div>
</template>

<script>
import API from "@/api.js";
export default {
  props: [
    "printParams",
    "printData"
  ],
  data: function() {
    return {
      formdata: undefined,
    };
  },
  created: function() {
    // this.initFormData({
    //   formId: this.printParams.formId,
    //   docId: this.printParams.docId,
    // });
  },
  mounted(){
    //this.getFormData();
  },
  computed: {
    template() {
      let data = this.printData;
      if (data && data.fields) {
        return {
          methods: {
            findField: this.findField,
          },
          template: "<div>" + data.formTemplate.template + "</div>"
        };
      } else
        return {
          template: "<div></div>"
        };
    }
  },
  methods: {
    findField(id) {
      let data = this.printData;;
      for (let i = 0; i < data.fields.length; i++) {
        let fld = data.fields[i];
        fld.docId =  this.printParams.docId;
        if (id == fld.id) return fld;
      }
      //TODO:临时处理隐藏字段--Jarod
      return {
        id: id,
        displayType: Constant.PermissionType_HIDDEN,
        hiddenValue: ""
      };
    },

    // initFormData({formId, docId}){
    //   this.$api.getPrintForm(
    //     this.$root.appid,
    //     formId,
    //     docId,
    //     {
    //       onSucess: response => {
    //         if (response.data.data) {
    //           this.formdata = response.data.data;
    //           console.log("this.formdata------->",this.formdata)
    //         }
    //       }
    //     }
    //   );
    // },

    // getFormData() {
    //   console.log("printParams---->",this.printParams)
    //   this.$api.getPrintForm(
    //     this.$root.appid,
    //     this.printParams.formId,
    //     this.printParams.docId,
    //     {
    //       onSucess: response => {
    //         console.log("------->",response.data.data)
    //       }
    //     }
    //   );
    // }
  }
}
</script>

<style lang="scss">

</style>