<template>
  <div class="view-print">
    <div class="print-wrap">
      <form_normalform
        :openParams="$route.query"
      />
      <!-- <view_delegate :openParams="{appId:$route.query.appId, actionContent: $route.query.actionContent}" :showtype="$route.query.opentarget"/> -->
      <!-- {{$route.query}} -->
    </div>
  </div>
</template>

<script>
import API from "@/api.js";
import form_normalform from "@/components/form_normalform.vue";


export default {
  props: [
  ],
  components: {
    form_normalform,  
  },
  data: function() {
    return {
      view:'',
    };
  },
  created() {
    //this.getviewData();
  },
  mounted(){
    
  },
  computed: {
  
  },
  methods: {
    getviewData() {
      let appId = this.$root.appid;
      let obj = {
            appId,
            viewId: this.$route.query.actionContent,
            test: this.$route.query.paramValue,
            containTitle: this.$route.query.name,
          };
      if(this.$route.query.paramKey) {
        obj[this.$route.query.paramKey] = this.$route.query.paramValue;
      }
    },
  }
}
</script>

<style lang="scss">
  .view-print {
    background: #ffffff;
  }
</style>
