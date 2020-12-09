<template>
  <span :id="id" :name="field.name+'_show'" class="radio-control">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType.toLowerCase() == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <input type="hidden" v-model="field.value" />
      <span>{{field.hiddenValue}}</span>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <!-- 打印 -->
      <span 
        :fieldType="field.formField" :data-label="field.name"
        :name="'span_'+field.name" 
        :discript="field.discript" 
        class="local-print">
        <el-radio-group 
          v-for="options in field.options" 
          :key="options.value" 
          v-model="field.value" 
          :class="field.layout=='horizontal'?'radio-inline obpm-radio':vertical">
            <el-radio
              :text="options.option" 
              :value="options.value" 
              :name="field.name" 
              :isRefreshOnChanged="field.refreshOnChanged" 
              :label="options.value"
              @change="onChange">{{options.option}}</el-radio>
            <span class="displayi-b">{{options.option}}</span>
        </el-radio-group>
        <br v-if="field.layout && field.layout.toLowerCase()=='vertical'"/>
      </span>
    </template>



    <!--只读-->
    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <input type="hidden" v-model="field.value" />
        <span :id="field.name_show">{{field.value}}</span>

      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <span
          class="local-print" 
          :id="field.divId" 
          :fieldType="field.formField" 
          :data-label="field.name"
          :name="'span_'+field.name" 
          :discript="field.discript">
          <el-radio-group 
            v-for="options in field.options" 
            :key="options.value"
            v-model="field.value" 
            :class="field.layout=='horizontal'?'radio-inline obpm-radio':vertical">
            <el-radio
              disabled 
              :text="options.option" 
              :value="options.value" 
              :name="field.name" 
              :isRefreshOnChanged="field.refreshOnChanged" 
              :label="options.value">{{options.option}}</el-radio>
            <span class="displayi-b">{{options.option}}</span>
          </el-radio-group>
          <br v-if="field.layout && field.layout.toLowerCase()=='vertical'"/>
        </span>
      </template>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <span 
        :fieldType="field.formField" :data-label="field.name"
        :name="'span_'+field.name" 
        :discript="field.discript" 
        class="local"
        @mouseenter="enter()"
      >
        <el-radio-group 
          v-for="options in field.options" 
          :key="options.value" 
          v-model="field.value" 
          :class="field.layout=='horizontal'?'radio-inline obpm-radio':vertical">
            <el-radio
              :text="options.option" 
              :value="options.value" 
              :name="field.name" 
              :isRefreshOnChanged="field.refreshOnChanged" 
              :label="options.value"
              @change="onChange">{{options.option}}</el-radio>
            <span class="displayi-b">{{options.option}}</span>
        </el-radio-group>
        <br v-if="field.layout && field.layout.toLowerCase()=='vertical'"/>
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
  name: "o-radio",
  props: ["id"],
  computed: {
    field: function() {
      let allData = this.$parent.findField(this.id);
      if(allData.options && allData.options.length > 0) {
        for(let i=0; i<allData.options.length; i++) {
          if(allData.options[i].def) {
            allData.value = allData.options[i].value;
          }
        }
      }
      return this.$parent.findField(this.id);
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