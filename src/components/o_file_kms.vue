<template>
  <span :id="id" :name="field.name+'_show'" class="kms-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType.toLowerCase() == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input
        type="hidden"
        :title="field.value"
        :style="field.style"
        v-model="field.value"
      ></el-input>
      <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        {{field.printHiddenValue?field.printHiddenValue:field.value}}
      </div>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <div class="file-list" v-show="selectFileData.length > 0">
        <div class="list" v-for="(item, index) in selectFileData" :key="index">
          <div class="list-left">
            <i class="el-icon-tickets"></i>
            {{item.fileName}}
          </div>
          <div class="list-right">
            <span class="icon-down"@click="downloadFile(item)">
              <i class="el-icon-download"></i>
            </span>
            <span class="icon-del" @click="deleteFile(index)">
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="btn btnAdd obpm-upload-btn" @click="openKmDialog">
        {{field.name}}
      </div>
    </template>
    <template v-else-if="field.readOnlyShowValOnly">
      <!-- 只读（文本模式） -->
      
      11
    </template>
    <template v-else>
      <!-- 只读（控件模式） -->
      33
    </template>
    <el-dialog
      :title="field.name"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div class="km-dialog">
        <div class="header">
          <div class="left">
            <el-button v-if="selectData.length" type="success" size="small" @click="onOk">确定</el-button>
          </div>
          <div class="right">
            名称：
            <span class="sear-input">
              <el-input @keyup.enter.native="openKmDialog" v-model="searchValue" ></el-input>
            </span>
            <span class="sear-btn">
              <el-button size="small"  @click="openKmDialog">查询</el-button>
            </span>
          </div>
        </div>
        <div class="table-box">
          <el-scrollbar class="scrollbar">
            <el-table
              :header-cell-style="{background:'#F2F2F2',color:'#5A6779'}"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                v-model="selectData"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="名称">
                <template slot-scope="scope">{{ scope.row.fileName }}</template>
              </el-table-column>
              <el-table-column
                label="创建时间">
                <template slot-scope="scope">{{ scope.row.createDate }}</template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-textarea",
  props: ["id"],
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
      return this.$parent.findField(this.id);
    }
  },
  data: function() {
    return { 
      dialogVisible:false,
      Constant,
      isActive:false,
      errorMessage:'',
      searchValue:'',
      tableData:[],
      selectData:[],
      selectFileData:[],
    };
  },
  methods: {
    downloadFile(item){
      let name = item.fileName;
      let path = '/uploads/kms/' + item.filePath;
      this.$api.templateDownload(
        name,
        path,
        {
          onSucess: response => {
            console.log("res--->",response)
            let fileName = "";
            let type = response.headers['content-type'];
            if(response.headers['content-disposition']) {
              //fileName = decodeURIComponent(response.headers['content-disposition'].split("=")[1]);
              fileName = name;
            }else {
              fileName="下载";
            }
            this.download(response, type, fileName);
          }
        }
      )
    },

    download(res, type, filename){
      const blob = new Blob([res.data], {
        // 如果后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
        type: type
      });
      const a = document.createElement('a');
      const herf = window.URL.createObjectURL(blob);
      // 下载链接
      a.href = herf;
      // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(herf);
    },

    deleteFile(index){
      this.selectFileData.splice(index,1);
    },
    onOk() {
      this.selectFileData = JSON.parse(JSON.stringify(this.selectData));
      this.dialogVisible = false; 
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val){
      this.selectData = val;
    },
    openKmDialog() {
      console.log("------------>",this.selectData)
      this.dialogVisible = true;
      //fileName=&orderByfield=CREATE_DATE&orderMode=desc&pageNo=1&linesPerPage=10&_=1594349604925
      let params = {
            fileName:this.searchValue,
            orderByfield:'CREATE_DATE',
            orderMode:'desc',
            pageNo:1,
            linesPerPage:10,
            _: new Date().getTime(),
          }
      this.$api.getKmsFiles(
        params,
        {
          onSucess: res => {
            let newData = res.data.data.datas.map(item => {
              return {
                fileName: item.name,
                createDate: item.createDate,
                filePath: item.url,
              }
            });
            this.tableData = newData;
          }
        }
      )


    },
    onChange(){
      if (this.field.refreshOnChanged){
        this.$parent.refresh(this.id);
      }
    }
  },
  
};
</script>
