<template>
  <span :id="id" :name="field.name+'_show'" class="suggest-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType.toLowerCase() == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <input type="hidden" v-model="field.value" />
      <span>{{field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <template>{{field.value}}</template>
      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <!-- <el-autocomplete readonly class="inline-input" v-model="field.value"></el-autocomplete> -->
        <el-input
          :readonly="true"
          type="text"
          :name="field.name"
          v-model.lazy="field.value"
          :title="field.title"
          style="width: 29%"
        />

      </template>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <div 
        class="suggest-wrap"
        @mouseenter="enter()"
      >
        <el-autocomplete
          class="inline-input"
          v-model="field.value"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect" 
        ></el-autocomplete>
        <i 
          class="fa fa-history icon-log" 
          @click="getOperationLogs" 
          style="color:#46d2db" 
          v-if="showLogsIcon && field.isModified" 
          aria-hidden="true">
        </i>
        <div class="log-box" v-if="showLogsDialog">
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
      </div>
      
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
export default {
  name: "o-suggest",
  props: ["id"],
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    },
  },
  
  data: function() {
    return { 
      Constant, 
      restaurants:[],
      showLogsDialog: false,
      tableData:[],
      showLogsIcon:true,
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
      this.showLogsDialog = true;
      let data = {
        fieldName: this.field.name,
        _: new Date().getTime(),
      }

      this.$api.getOperationLogs(
        this.$root.appid,
        this.field.docId,
        data,
        {
          onSucess: res => {
            this.tableData = res.data.data;
          }
        }
      )
    },
    handleSelect() {
      this.$parent.refresh(this.id);
    },
    querySearch(queryString, cb) {
      if(this.field.dataMode == 'local'){
        let field = this.$parent.findField(this.id);
        let options = field.options;
        console.log(options);
        let results = queryString
          ? options.filter(this.createFilter(queryString))
          : options;
        // 调用 callback 返回建议列表的数据
        cb(results);
        // if (this.field.refreshOnChanged){//判断是否需要刷新
        //   this.onChange();
        // }
        
      }else if(this.field.dataMode == 'remote'){
        let appId = this.$parent.$parent.getAppId();
        let formId = this.$parent.$parent.getformId();
        let docId = this.$parent.$parent.getDocId();
        API.intellectTip(
          appId,
          formId,
          docId,
          {
            formFieldId: this.field.divId,
            keyword: this.field.value,
            parentId: "",
          },
          {
            onSucess: response => {
              let options = response.data.data;
              for(let i=0; i < options.length; i++){
                options[i].value = options[i].name;
              }
              console.log("-->"+options[0].value);
              console.log(options);
              let results = queryString 
                ? options.filter(this.createFilter(queryString)) 
                : options;
              cb(results);
            }
          }
        );
      }
      
    },
    createFilter(queryString) {
      return options => {
        return (
          options.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        );
      };
    },
    onChange() {
      this.$parent.refresh(this.id);
    },
  }
};
</script>