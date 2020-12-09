<template>
  <div class="main-link-content">
    <iframe
    ref="mainFrame"
    style="border:none"
    width="100%"
    height="100%"
    scrolling="no"
    frameborder="0"
    allowtransparency="true" 
    noresize="noresize"
    :src="openParams.actionContent"
  ></iframe>
  </div>
  
</template>
<script>

export default {
  name: "chart",
  props: ['openParams'],
  watch: {
    
  },
  created() {
    
  },
  mounted() {
    
  },

  data() {
    return{
      
    }
  },
  methods: {
    
  }
};
</script>
<style lang="scss" scoped>

</style>


