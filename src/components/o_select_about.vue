<template>
  <span :id="id" :name="field.name+'_show'" class="component-input-span">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input
        :readonly="true"
        type="hidden"
        :style="field.style"
        :name="field.name"
        v-model="field.value"
        :title="field.title"
      />
      <span>{{field.hiddenValue}}</span>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <el-transfer
        :id="field.divId"
        :data="options"
        target-order="push"
        v-model="selectData"
        @change="onChange(selectData)"
      >
      </el-transfer>
    </template>

    <template v-else-if="field.textType == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <template>{{field.value}}</template>
      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <el-transfer
          :id="field.divId"
          :discript="field.discript"
          :name="field.name"
          :fieldType="field.formField"
          disabled
          :style="field.style"
          :data="options"
        >
        </el-transfer>
      </template>
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-select-about",
  props: ["id"],
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    },
    options: function() {
      let data = [];
      let selectData = [];
      let field = this.$parent.findField(this.id);
      if(field.value) {
        let arr = field.value.split(";");
        if(arr && arr.length>0) {
          for(let i=0; i<arr.length; i++) {
            selectData.push(arr[i]);
          }
        }
      }
      field.options.forEach(option => {
        data.push({
          key: option.option,
          label: option.value,
          disabled: field.displayType == 1?true:false,
        });
      });
      this.selectData = selectData;
      return data;
    }
    
  },
  data: function() {
    return { 
      Constant,
      selectData:[],
    };
  },

  methods: {
    onChange(selectData) {
      let value = '';
      if(selectData && selectData.length>0) {
        for(let i=0; i<selectData.length; i++) {
          value += selectData[i] + ";";
        }
      }else {
        value = ''
      }
      this.field.value = value.replace(/^(\s|;)+|(\s|;)+$/g, '');
      if (this.field.refreshOnChanged) {//判断是否需要刷新
        this.$parent.refresh(this.id);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
  // .component-input-span {
    
  // }
  
</style>