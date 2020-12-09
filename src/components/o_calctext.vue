<template>
  <div>
    
    <div class="content" v-if="isJump">
      <component :is="template(field.value)"></component>
    </div>
    <div class="content" v-else>
      <span 
        :id="id" 
        :name="field.name+'_show'" 
        class="component-input-span" 
        v-html="field.value" 
      />
    </div>
  </div>
  
</template>

<script>
export default {
  name: "o-calctext",
  props: ["id"],
  computed: {
    field: function() {
      let data = this.$parent.findField(this.id);
      this.jumpToNewpage(data);
      return this.$parent.findField(this.id);
    }
  },
  data: function() {
    return {
      isJump:false,
    };
  },

  methods: {
    getdocid() {
      return this.field.docId;
    },
    template(val) {
      return {
        template: "<div>"+val+"</div>"
      }
    },

    jumpToNewpage(data) {
      if(data.value) {
        if(data.value.search("o-action") != -1) {
          this.isJump = true;
        }else {
          this.isJump = false;
        }
      } 
    }
  }
};
</script>