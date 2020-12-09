<template>
    <div :id="id" class="survey-control">
			<template v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType == 'hidden'">
				<!--隐藏-->
				<input type="hidden" v-model="field.value" />
				<!-- <span>{{field.hiddenValue}}</span> -->
				<span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
			</template>

			
			<template v-else-if="field.displayType == Constant.PermissionType_PRINT">
				<div v-for="(items,index) in field.questions" :key="index">
					<span class="s-title">
						{{items.topic}}
					</span>
					<div v-if="field.questions.optionType == 'checkbox'" class="checkbox-wrap">
						<el-checkbox-group 
							v-model="value" @change="changeVal">
							<el-checkbox 
								v-for="item in items.options" 
								:key="item.value" 
								:text="item.text"
								:class="vertical"
								:value="item.value"
								:label="item.value"
								>{{item.value}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<div v-else-if="field.questions.optionType == 'radio'">
          	<el-radio-group 
							v-for="item  in items.options" 
							:key="item.value"
							v-model="field.value" 
							:class="field.layout=='horizontal'?'radio-inline obpm-radio':vertical">
							<el-radio
								:text="item .option" 
								:value="item.value" 
								:name="field.name" 
								:isRefreshOnChanged="field.refreshOnChanged" 
								:label="item.value">{{item.text}}</el-radio>
							<span class="displayi-b">{{item.text}}</span>
						</el-radio-group>
					</div>
				</div>
			</template>



			<template v-else-if="field.textType == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
				<template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
				<input type="hidden" v-model="field.value" />
				<span>{{field.value}}</span>
				</template>

				<template v-else>
					<div v-for="(items,index) in field.questions" :key="index">
						<span class="s-title">
							{{items.topic}}
						</span>
						<div>
							<el-checkbox-group 
								v-model="value">
								<el-checkbox 
									disabled
									v-for="item in items.options" 
									:key="item.value" 
									:text="item.text"
									:class="vertical"
									:value="item.value"
									:label="item.text"
									@change="changeVal"
									>{{item.value}}</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
				</template>
			</template>

			<template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
				<!--可编辑-->
				<div v-for="(items,index) in field.questions" :key="index">
					<span class="s-title">
						{{items.topic}}
					</span>
					<div v-if="field.questions.optionType == 'checkbox'" class="checkbox-wrap">
						<el-checkbox-group 
							v-model="value" @change="changeVal">
							<el-checkbox 
								v-for="item in items.options" 
								:key="item.value" 
								:text="item.text"
								:class="vertical"
								:value="item.value"
								:label="item.value"
								>{{item.value}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<div v-else-if="field.questions.optionType == 'radio'">
          	<el-radio-group 
							v-for="item  in items.options" 
							:key="item.value"
							v-model="field.value" 
							:class="field.layout=='horizontal'?'radio-inline obpm-radio':vertical">
							<el-radio
								:text="item .option" 
								:value="item.value" 
								:name="field.name" 
								:isRefreshOnChanged="field.refreshOnChanged" 
								:label="item.value">{{item.text}}</el-radio>
							<span class="displayi-b">{{item.text}}</span>
						</el-radio-group>
					</div>
				</div>
			</template>
		</div>
</template>

<script>
import Constant from "@/Constant.js";
export default {
	name: "o-survey",
	props: ["id"],
  computed: {
    field: function() {
			console.log("调查问卷");
			//console.log(this.$parent.findField(this.id));
			let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
      }
			let transformChar = this.$parent.findField(this.id).questions;
			if(transformChar) {
				for(let i=0; i<transformChar.length; i++) {
					if(transformChar[i].options) {
						transformChar[i].options.forEach(item => {
							if(item.type == "radio") {
								transformChar.optionType = "radio";
							}else if(item.type == "checkbox") {
								transformChar.optionType = "checkbox";
							}
						});
					}
					transformChar[i].topic = transformChar[i].topic.replace(/&ldquo;/g, '"').replace(/&rdquo;/g,'"')
				}
			}
      return this.$parent.findField(this.id);
		},
		value: {
      get: function() {
        return this.field.value.split(";");
      },
      set: function(newValue) {
        this.field.value = newValue.join(";");
      }
    }
	},
	methods: {
		changeVal(event){
			console.log(event);
		},
	},
	data: function() {
		return {
			Constant,
			vertical:'input-vertical',
		}
	},
}
</script>

<style lang="scss" scoped>
	
</style>
