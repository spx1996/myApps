<template>
  <span :id="id" class="dept-tree-select">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType.toLowerCase() == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input 
        type="hidden" 
        autosize 
        v-model="field.value">
      </el-input>
      <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        {{field.printHiddenValue?field.printHiddenValue:field.value}}
      </div>
    </template>

    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <el-input 
          type="hidden" 
          autosize
          v-model="field.val">
        </el-input>
        <template>{{field.value}}</template>
      </template>
      <template v-else>
         <!-- 只读（控件模式） -->
        <!-- <el-input type="textarea" :readonly="true" autosize v-model="field.val"></el-input> -->
        <el-tag
          v-for="dept in field.data"
          :key="dept.id"
          closable
          type="info"
          @close="onTabClose"
        >
          {{dept.name}}
        </el-tag>
        <el-button 
          icon="el-icon-s-operation" 
          size="small" 
          @click="dialogVisible = false" 
        />
        <el-dialog 
          title="选择部门" 
          :visible.sync="dialogVisible" 
          width="30%" 
          :before-close="handleClose"
        >
          <el-tree 
            empty-text="加载中..."
            :props="props" 
            :load="loadNode" 
            node-key="id" 
            ref="deptTree" 
            lazy 
            show-checkbox>
          </el-tree>
          <span 
            slot="footer" 
            class="dialog-footer"
          >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onOk">确 定</el-button>
          </span>
        </el-dialog>
      </template>
    </template>
    
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <!-- <el-input
        type="textarea"
        autosize placeholder="请输入内容" 
        v-model="field.val"
        :disabled="true"
      ></el-input> -->
      <div 
        class="dept-tree-wrap"
        @mouseenter="enter()"
      >
        <el-tag
          v-for="dept in field.data"
          :key="dept.id"
          closable
          type="info"
          @close="onTabClose(dept,field.data)"
        >
          {{dept.name}}
        </el-tag>
        <el-button 
          icon="el-icon-s-operation" 
          size="small" 
          @click="showDialg" 
        />
        <i 
          class="fa fa-history icon-log" 
          @click="getOperationLogs" 
          style="color:#46d2db" 
          v-if="showLogsIcon && field.isModified" 
          aria-hidden="true">
        </i>
        <!-- <div class="log-box" v-if="showLogsDialog">
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
        </div> -->
        <form_operation 
          v-if="showLogsDialog"
          :docId="field.docId"
          :operationData="operationData"
          @event="hiddenLogsDialog"
          />
      </div>
      <el-dialog
        title="选择部门"
        :visible.sync="dialogVisible"
        width="45%"
        :before-close="handleClose"
        class="dept-tree-dialog-new"
        >
        <div class="tree-box">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织结构" name="first">
              <div class="tree-content">
                <div class="tree-list">
                  <el-scrollbar class="scrollbar">
                    <el-tree 
                      empty-text="加载中..."
                      :props="props" 
                      :load="loadNode" 
                      node-key="id" 
                      ref="deptTree" 
                      lazy 
                      show-checkbox
                      :check-strictly="true"
                      :default-checked-keys="defaultCheckedKeys"
                      @check-change="handleCheckChange">
                    </el-tree>
                  </el-scrollbar>
                </div>
                <div class="tree-select">
                  <div class="top">
                    <span 
                      class="to-right" 
                      @click="selectType('TORIGHT')" 
                      :style="{background: selectTreeDept.length>selectTreeDeptRight.length?'#2db7f5':'#ccc'}"
                    >
                      <i class="el-icon-arrow-right"></i>
                    </span>
                    <span 
                      class="to-left"
                      @click="selectType('TOLEFT')" 
                      :style="{background: activeRightDept.length>0?'#2db7f5':'#ccc'}"
                    >
                      <i class="el-icon-arrow-left"></i>
                    </span>
                  </div>
                  <div class="bottom">
                    <span 
                      class="to-right" 
                      @click="selectType('ALLTOLEFT')"
                      :style="{background: allDeptTree.length>selectTreeDeptRight.length?'#2db7f5':'#ccc'}"
                    >
                      <i class="el-icon-d-arrow-right"></i>
                    </span>
                    <span 
                      class="to-left"
                      @click="selectType('ALLTORIGHT')"
                      :style="{background: allDeptTree.length<=selectTreeDeptRight.length?'#2db7f5':'#ccc'}"
                    >
                      <i class="el-icon-d-arrow-left"></i>
                    </span>
                  </div>
                </div>
                <div class="selected">
                  <div class="search-input">
                    <el-input 
                      v-model="searchValue" 
                      placeholder="请输入关键字"
                      class="myClass"
                      @keyup.enter.native="handleIconSearch(searchValue)"
                    >
                      <i
                        class="el-icon-zoom-in el-input__icon"
                        slot="suffix"
                        @click="handleIconSearch(searchValue)">
                      </i>  
                    </el-input>
                  </div>
                  <div class="selected-dept">
                    <el-scrollbar class="scrollbar">
                      <span 
                        class="one-dept" 
                        v-for="(item, index) in selectTreeDeptRight" 
                        :key="index"
                        :style="{ background: activeRightDept.indexOf(item.id)>=0 ? '#eaf8fe':''}"
                        @click="handleSelectDeptClick(item.id)"
                      >
                        {{item.name}}
                      </span>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
              
            </el-tab-pane>
            <!-- <el-tab-pane label="按列表" name="second">按列表</el-tab-pane> -->
          </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onOk">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </span>
</template>
<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
import form_operation from "@/components/form_operation_log";
export default {
  name: "o-dept-tree-select",
  props: ["id"],
  components: {
    form_operation,
  },
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
      if (formData.value) {
        let arr = formData.value.split(";");
        let val = "";
        for (let j = 0; j < arr.length; j++) {
          for (let i = 0; i < formData.data.length; i++) {
            if (arr[j] == formData.data[i].id) {
              val += formData.data[i].name + ";";
            }
          }
        }
        formData.val = val.replace(/^(\s|;)+|(\s|;)+$/g, '');
      } else {
        formData.val = "";
      }
      return this.$parent.findField(this.id);
    }
  },
  data: function() {
    return {
      activeName:'first',
      Constant,
      dialogVisible: false,
      defaultCheckedKeys:[],
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      selectedNumber:'',
      dialog: false,
      selectTreeDept:[],
      selectTreeDeptRight:[],
      activeRightDept:[],
      allDeptTree:[],
      searchValue:'',
      showLogsDialog: false,
      tableData:[],
      showLogsIcon:true,
      operationData:'',
    };
  },
  methods: {
    hiddenLogsDialog() {
      this.showLogsIcon = false;
      this.showLogsDialog = false;
    },
    enter(){
      if(this.field.isModified) {
        this.showLogsIcon = true;
      }
    },
    getOperationLogs() {
      this.operationData = {
        fieldName: this.field.name,
      }
      this.showLogsDialog = true;
      // let data = {
      //   fieldName: this.field.name,
      //   _: new Date().getTime(),
      // }

      // this.$api.getOperationLogs(
      //   this.$root.appid,
      //   this.field.docId,
      //   data,
      //   {
      //     onSucess: res => {
      //       this.tableData = res.data.data;
      //     }
      //   }
      // )
    },
    handleIconSearch() {

    },
    handleSelectDeptClick(id) {
      if(this.activeRightDept.indexOf(id) > -1){
        for(let i=0; i<this.activeRightDept.length; i++) {
          if(this.activeRightDept[i] == id) {
            this.activeRightDept.splice(i, 1);
            break;
          }
        }
      }else {
        this.activeRightDept.push(id);
      }
      console.log("------------->",this.activeRightDept);
    },
    selectType(val){
      if(val == 'TORIGHT') {
        this.selectTreeDeptRight = this.selectTreeDept;
      }else if (val == 'TOLEFT') {
        let deptTree = this.$refs.deptTree.getCheckedNodes(); 
        let rightList = this.activeRightDept;
        for(let i=0; i<rightList.length; i++) {
          for(let j=0; j<deptTree.length; j++) {
            if(rightList[i] == deptTree[j].id) {
              deptTree.splice(j, 1);
              j--;
            }
          }
        }

        for(let i=0; i<rightList.length; i++) {
          for(let j=0; j<deptTree.length; j++) {
            if(rightList[i] == deptTree[j].id) {
              deptTree.splice(j, 1);
              j--;
            }
          }
        }
        let arr = [];
        deptTree.forEach(item => {
          arr.push(item.id);
        })
        this.$refs.deptTree.setCheckedKeys(arr);
        this.selectTreeDeptRight = this.$refs.deptTree.getCheckedNodes();
        this.activeRightDept = [];
        this.$forceUpdate();
      }else if (val == "ALLTOLEFT") {
        this.selectTreeDeptRight = this.allDeptTree;
        let arr = [];
        this.selectTreeDeptRight.forEach(item => {
          arr.push(item.id);
        })
        this.$refs.deptTree.setCheckedKeys(arr);
      } else if (val == "ALLTORIGHT") {
        this.selectTreeDeptRight = [];
        this.$refs.deptTree.setCheckedKeys([]);
        this.activeRightDept = [];
      }
    },
    handleClick() {

    },
    showDialg() {
      this.selectedNumber = this.field.data.length;
      this.dialogVisible = true;
    },
    
    handleCheckChange() {
      let res = this.$refs.deptTree.getCheckedNodes(); 
      this.selectTreeDept = this.$refs.deptTree.getCheckedNodes();
      this.selectedNumber = res.length;
    },
    onTabClose(dept) {
      let allValue = this.field.value.split(';');
      for(let i=0; i<this.field.data.length; i++){
        if(this.field.data[i].id == dept.id){
          allValue.splice(allValue.indexOf(dept.id),1);
        }
      }
      this.field.value = allValue.join(";");
      
      this.field.data.splice(this.field.data.indexOf(dept), 1);
      if(this.field.data && this.field.data.length > 0 ) {
        let arr = [];
        let deptName = '';
        for(let i=0; i<this.field.data.length; i++) {
          deptName += this.field.data[i].name + ';';
          arr.push(this.field.data[i].id);
        }
        this.field.val = deptName;
        this.defaultCheckedKeys = arr;
        this.selectTreeDeptRight = this.field.data;
        this.$refs.deptTree.setCheckedKeys(arr);
      }else {
        this.defaultCheckedKeys = [];
      }
      if(this.field.refreshOnChanged) {
        this.onChange();
      }
    },
    onOk() {
      let nodes = this.selectTreeDeptRight;//this.$refs.deptTree.getCheckedNodes();
      //this.selectedNumber = nodes.length;
      if (nodes && nodes.length <= this.field.limit) {
        let value = "";
        let id = "";
        this.field.data = [];
        let selectKeys = [];
        nodes.forEach(node => {
          selectKeys.push(node.id);
          this.field.data.push({id:node.id, name:node.name});
          value += node.name + ";";
          id += node.id+ ";";
        });
        this.field.value = id.replace(/^(\s|;)+|(\s|;)+$/g, '');
        this.field.val = value;
        this.defaultCheckedKeys = selectKeys;
        this.selectedNumber = this.field.data.length + nodes.length;
      }else {
        alert("不能超出"+this.field.limit);
      }
      this.dialogVisible = false;
      if (this.field.refreshOnChanged){//判断是否需要刷新
        this.onChange();
      }
    },
    handleClose(done) {
      this.selectedNumber = this.field.data.length;
      done();
    },

    loadNode(node, resolve) {
      let that = this;
      let appid = this.$root.appid;
      if (node.level === 0) {
        API.getDepartmentsByParentId(appid, "", {
          onSucess: function(response) {
            if(response.data.data) {
              that.allDeptTree = that.allDeptTree.concat(response.data.data);
            }
            resolve(response.data.data);
          }
        });
      } else {
        API.getDepartmentsByParentId(appid, node.key, {
          onSucess: function(response) {
            if(response.data.data) {
              that.allDeptTree = that.allDeptTree.concat(response.data.data);
            }
            resolve(response.data.data);
          }
        });
      }
    },

    onChange() {
      this.$parent.refresh(this.id);
    },
  }
};
</script>
<style lang="scss" scoped>
  .el-textarea {
    width: 240px;
  }
</style>