<template>
  <div :id="id">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <div>
        {{field.hiddenValue}}
      </div>
    </template>
    
     <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="startNodeName"
            label="审批节点"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="targetNodeName"
            label="目标审批节点"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="auditorName"
            label="办理人"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop=""
            label="签核动作"
            align="center"
            >
            流转
          </el-table-column>
          <el-table-column
            prop=""
            label="签核意见"
            align="center"
            >
            <!-- 图片的显示 -->
            <template   slot-scope="scope">   
              {{scope.row.attitude}}         
              <img :src="scope.row.signatureImageDate" style="height:32px;">
            </template>        
          </el-table-column>
          <el-table-column
            prop="processtime"
            label="办理时间"
            align="center"
            >
          </el-table-column>
        </el-table>
      </div>
    </template>

    <!--只读-->
    <template v-else-if="field.textType == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="startNodeName"
            label="审批节点"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="targetNodeName"
            label="目标审批节点"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="auditorName"
            label="办理人"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop=""
            label="签核动作"
            align="center"
            >
            流转
          </el-table-column>
          <el-table-column
            prop=""
            label="签核意见"
            align="center"
            >
            <!-- 图片的显示 -->
            <template   slot-scope="scope">   
              {{scope.row.attitude}}         
              <img :src="scope.row.signatureImageDate" style="height:32px;">
            </template>        
          </el-table-column>
          <el-table-column
            prop="processtime"
            label="办理时间"
            align="center"
            >
          </el-table-column>
        </el-table>
        
      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="nodeName"
            label="节点名称"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="催单人"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="auditorName"
            label="催单时间"
            align="center"
            >
            <template slot-scope="scope">
              {{scope.row.processTime | writeCurrentDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            align="center"
            >
          </el-table-column>
        </el-table>
      </template>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <div>
        <img :src="flowPhoto" v-if="field.showMode =='textAndDiagram'">
      </div>
      <!-- 可编辑 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="startNodeName"
          label="审批节点"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="targetNodeName"
          label="目标审批节点"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="auditorName"
          label="办理人"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop=""
          label="签核动作"
          align="center"
          >
          流转
        </el-table-column>
        <el-table-column
          prop=""
          label="签核意见"
          align="center"
          >
          <!-- 图片的显示 -->
          <template   slot-scope="scope">   
            {{scope.row.attitude}}         
            <img :src="scope.row.signatureImageDate" style="height:32px;">
          </template>        
        </el-table-column>
        <el-table-column
          prop="processtime"
          label="办理时间"
          align="center"
          >
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>

import Constant from "@/Constant.js"
import API from "@/api.js";
export default {
  name: "o-reminder-history",
  props: ["id"],
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    },
  },
  data: function() {
    return {
      Constant,
      tableData:[],
      flowPhoto:'',
    };
  },
  mounted(){
    this.getFlowHistory();
  },
  methods: {
    getFlowHistory(){
      console.log("this.fleld---->",this.field);
      let appId = this.$root.appid
      let docId = this.field.docId;
      this.$api.getRemindHistorys(
        appId,
        docId,
        {
          onSucess: response => {
            this.tableData = response.data.data;
            this.$forceUpdate();
          }
        }
      );

      // this.$api.getbillflow(
      //   this.field.flowDiagram,
      //   {
      //     onSucess: res => {
      //       debugger
      //       //this.flowPhoto = 'data:image/png;base64,' + response.data
      //       let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
      //       let url = window.URL.createObjectURL(blob);
      //       this.flowPhoto = url;
      //       console.log("url---->",url)
      //       //window.location.href = url;

      //     }
      //   }
      
      // )

    }
  },
  
  filters: {
    writeCurrentDate(val){
      let now = new Date(val);
      let year=now.getFullYear(); 
      let month=now.getMonth()+1; 
      let date=now.getDate(); 
      let hour=now.getHours(); 
      let minute=now.getMinutes(); 
      let second=now.getSeconds(); 
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    }
  }
}
</script>

<style>

</style>