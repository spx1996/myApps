<template>
  <span :id="id" :name="field.name+'_show'" class="checkbox-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType.toLowerCase() == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <span
        :id="field.divId"
        :fieldType="field.formField"
        :data-label="field.name"
        :name="'span_'+field.name"
        :discript="field.discript"
        style="display:none"
      >
        <label
          v-for="options in field.options"
          :key="options.value"
          class="checkbox-inline obpm-checkbox"
        >
          <input
            :text="options.option"
            type="checkbox"
            :value="options.value"
            :name="field.name"
            :class="field.cssClass"
            class="checkboxWid"
            :isRefreshOnChanged="field.refreshOnChanged"
            v-model="value"
          >
          <span class="displayi-b">{{options.option}}</span>
        </label>
        <br v-if="field.layout && field.layout.toLowerCase()=='vertical'">
      </span>
      <span>{{field.hiddenValue}}</span>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <!-- 打印 -->
      <span
        class="checkbox-print"
        :id="field.divId"
        :fieldType="field.formField"
        :data-label="field.name"
        :name="'span_'+field.name"
        :discript="field.discript"
      >
        <el-checkbox-group v-model="value">
          <el-checkbox 
            v-for="options in field.options" 
            :key="options.value" 
            :text="options.option"
            :class="field.layout=='horizontal'?'checkbox-inline obpm-checkbox':vertical"
            :isRefreshOnChanged="field.refreshOnChanged" 
            :value="options.value"
            :label="options.value"
            @change="onChange"
            >{{options.option}}</el-checkbox>
        </el-checkbox-group>
        <br v-if="field.layout && field.layout.toLowerCase()=='vertical'">
      </span>



    </template>



    <!--只读-->
    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <span :id="field.name_show">{{field.value}}</span>
        <span
          :id="field.divId"
          :fieldType="field.formField"
          :data-label="field.name"
          :name="'span_'+field.name"
          :discript="field.discript"
          style="display:none"
        >
          <label
            v-for="options in field.options"
            :key="options.value"
            class="checkbox-inline obpm-checkbox"
          >
            <input
              :text="options.option"
              type="checkbox"
              :value="options.value"
              :name="field.name"
              :class="field.cssClass"
              class="checkboxWid"
              :isRefreshOnChanged="field.refreshOnChanged"
              disabled
              v-model="value"
            >
            <span class="displayi-b">{{options.option}}</span>
          </label>
        </span>
      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <span
          :id="field.divId"
          :fieldType="field.formField"
          :data-label="field.name"
          :name="'span_'+field.name"
          :discript="field.discript"
        >
          <!-- <label
            v-for="options in field.options"
            :key="options.value"
            class="checkbox-inline obpm-checkbox"
          >
            <input
              :text="options.option"
              type="checkbox"
              :value="options.value"
              :name="field.name"
              :class="field.cssClass"
              class="checkboxWid"
              :isRefreshOnChanged="field.refreshOnChanged"
              disabled
              v-model="value"
            >
            <span class="displayi-b">{{options.option}}</span>
          </label> -->
           <el-checkbox-group v-model="value">
            <el-checkbox 
              disabled
              v-for="options in field.options" 
              :key="options.value" 
              :text="options.option"
              :class="field.layout=='horizontal'?'checkbox-inline obpm-checkbox':vertical"
              :isRefreshOnChanged="field.refreshOnChanged" 
              :value="options.value"
              :label="options.value"
              >{{options.option}}</el-checkbox>
          </el-checkbox-group>
          <br v-if="field.layout && field.layout.toLowerCase()=='vertical'">
        </span>
      </template>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <span
        :id="field.divId"
        :fieldType="field.formField"
        :data-label="field.name"
        :name="'span_'+field.name"
        :discript="field.discript"
        class="check-input"
        @mouseenter="enter()"
      >
        <el-checkbox-group v-model="value">
          <el-checkbox 
            v-for="options in field.options" 
            :key="options.value" 
            :text="options.option"
            :class="field.layout=='horizontal'?'checkbox-inline obpm-checkbox':vertical"
            :isRefreshOnChanged="field.refreshOnChanged" 
            :value="options.value"
            :label="options.value"
            @change="onChange"
            >{{options.option}}</el-checkbox>
        </el-checkbox-group>
        <br v-if="field.layout && field.layout.toLowerCase()=='vertical'">
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
      </span>
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-checkbox",
  props: ["id"],
  computed: {
    field: function() {
      let allData = this.$parent.findField(this.id);
      if(allData.options && allData.options.length) {
        for(let i=0; i<allData.options.length; i++) {
          if(allData.options[i].def) {
            allData.options[i].def = false;
            allData.value = allData.value +";" + allData.options[i].value;
          }
        }
      }
      return allData;
    },
    value: {
      get: function() {
        return (this.field.value+"").split(";");
      },
      set: function(newValue) {
        let val = newValue.join(";");
        this.field.value = val.replace(/^(\s|;)+|(\s|;)+$/g, '');
        console.log("----------->", this.field.value);
      }
    }
  },
  data: function() {
    return { 
      Constant, 
      selectedOption: {},
      vertical:'input-vertical',
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
    onChange() {
      if (this.field.refreshOnChanged)//判断是否需要刷新
        this.$parent.refresh(this.id);
    },
  },
};
</script>
<style lang="scss" scoped>
  .input-vertical {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    font-weight: normal;
    cursor:pointer;
    margin-left:21px;
  }
</style>