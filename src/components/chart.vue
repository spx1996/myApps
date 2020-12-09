<template>
  <div class="main-chart">
    <div id="myChart" ref="myChart" style="width:100%; height:650px"></div>
  </div>
  
</template>
<script>

export default {
  name: "chart",
  props: ['openParams'],
  watch: {
    chartData() {
      this.drawLine();
    },
  },
  created() {
    
  },
  mounted() {
    this.getChart();
  },

  data() {
    return{
      chartData:'',
    }
  },
  methods: {
    getChart(){
      this.$api.getChart(
        this.openParams.actionContent,
        {
          onSucess: response => { 
            this.chartData = JSON.parse(response.data.data.result);
          }
        }
      )
    },
    drawLine(){
      let myChart = this.$echarts.init(this.$refs.myChart);
      myChart.setOption(this.chartData);
    },
  }
};
</script>
<style lang="scss" scoped>

</style>


