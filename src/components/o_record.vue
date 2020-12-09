<template>
  <div :id="id">
     <template v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType == 'hidden'">
				<!--隐藏-->
				{{field.hiddenValue}}
			</template>

			<template v-else-if="field.textType == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
				<template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
				</template>

				<template v-else>
					
				</template>
			</template>

			<template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
				<!--可编辑-->
        <audio controls v-if="field.value"> 
          <source src="" type="audio/ogg"> 
          <source src="" type="audio/mpeg"> 
          <source src="" type="audio/wav">
          您的浏览器不支持 audio 元素。 
        </audio>
			</template>
  </div>
</template>

<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
export default {
  name: "o-record",
  props: ["id"],
  computed: {
    field: function() {
      return this.$parent.findField(this.id);
    }
  },

  data: function() {
    return {
      Constant,
    }
  },

  methods: {

  }
}
</script>

<style scoped>

</style>