<template>
  <div class="log-box">
    <div class="header">
      <span>历史记录</span>
      <span><i class="el-icon-close" @click="hiddenLogsDialog"></i></span>
    </div>
    <div class="table-list">
      <div class="table-box">
        <el-table
          :data="tableData"
          :header-cell-style="{background:'#F9F9F9',color:'#5A6779'}"
          style="width: 100%">
          <el-table-column
            prop="modifier"
            label="修改人">
          </el-table-column>
          <el-table-column
            prop="time"
            label="修改时间">
          </el-table-column>
          <el-table-column
            prop="fieldValue"
            label="修改值">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'docId',
    'operationData'
  ],
  created() {
    this.getOperationLogs()
  },
  data: function() {
    return {
      showLogsDialog: false,
      tableData:[],
      showLogsIcon:true,
    };
  },
  methods: {
    getOperationLogs() {
      let data = {
        fieldName: this.operationData.fieldName,
        _: new Date().getTime(),
      }
      this.$api.getOperationLogs(
        this.$root.appid,
        this.docId,
        data,
        {
          onSucess: res => {
            this.tableData = res.data.data;
          }
        }
      )
    },
    hiddenLogsDialog() {
      this.$emit("event");
    },
    
  }
}
</script>

<style lang="scss">

</style>