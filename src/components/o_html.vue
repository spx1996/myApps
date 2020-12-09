<template>
  <span :id="id" :name="field.name+'_show'" class="component-input-span">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <textarea 
        class="displayn"  
        v-model="field.value">
      </textarea>
      <span>{{field.hiddenValue}}</span>
    </template>
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <vue-html5-editor 
        :content="field.value" 
        :name="field.name"
        @blur.native.capture="onChange" 
        @change="updateData">
      </vue-html5-editor>
    </template>
    <template v-else>
      <!-- 只读（文本模式） -->
        <div :id="field.name+'_show'" class="displayi-b" v-html="field.value"></div>
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
//import { constants } from 'crypto';

export default {
  name: "o-html",
  props: ["id"],
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    }
  },
  data: function() {
    return { 
      Constant 
    };
  },
  methods: {
    onChange() {
      if (this.field.refreshOnChanged) {//判断是否需要刷新
        this.$parent.refresh(this.id);
      }
    },
    updateData(event){
      //console.log(event);
      this.field.value = event;
      console.log(this.field.name+"-->"+this.field.value);
      console.log(this.$parent.$parent.buildFormData())
    },
  }

};
</script>

<style lang="scss">
  .vue-html5-editor {
    font-size: 14px;
    line-height: 1.5;
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    text-align: left;
    border-radius: 5px;
    overflow: hidden;
}
</style>