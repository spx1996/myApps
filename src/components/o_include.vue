<template>
  <div>
    <view_delegate 
      :openParams="{appId: field.application, 
        actionContent: field.viewid, 
        parentId:field.docId, 
        isRelate:field.relate, 
        showtype:'include',
        formId:field.formId
      }"
      v-bind="$attrs"
      v-on="$listeners"
      :showtype = "'include'"
      @change="onChange"
    >
    </view_delegate>
   </div>
</template>

<script>
import view_delegate from "@/components/view_delegate.vue";

export default {
  name: "o-include",
  props: ["id"],
  components: {
    view_delegate,
  },
  computed: {
    field: function() {
      //console.log("this.id---------->",this.id);
      return this.$parent.findField(this.id);
    }
  },
    
  methods: {
    onChange() {
      if (this.field.isRefreshOnChanged) {//判断是否需要刷新
        this.$parent.refresh(this.id);
      }
    },
  }
};
</script>

<style>
</style>
