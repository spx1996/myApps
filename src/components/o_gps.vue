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
        <img src="../assets/images/gps.png" />
			</template>
  </div>
</template>

<script>
import Constant from "@/Constant.js";
import API from "@/api.js";
export default {
  name:"o-gps",
  props: ["id"],
  computed: {
    field: function() {
      console.log("gps定位-->");
      console.log(this.$parent.$parent.buildFormData());
      return this.$parent.findField(this.id);
    },
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