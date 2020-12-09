<template>
  <span :id="id" :name="field.name+'_show'" class="component-input-span">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || field.textType.toLowerCase() == 'hidden'"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input
        :readonly="true"
        type="hidden"
        :style="field.style"
        :name="field.name"
        v-model.lazy="field.value"
        :title="field.title"
      />
       <span>{{field.printHiddenValue?field.printHiddenValue:field.hiddenValue}}</span>
    </template>

    <!--打印-->
    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        {{field.printHiddenValue?field.printHiddenValue:field.value}}
      </div>
    </template>

    <!--只读-->
    <template
      v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED"
    >
      <template v-if="field.readOnlyShowValOnly">
        <template>{{field.value}}</template>
      </template>
      <template v-else>
        <template v-if="field.dateFormat=='yyyy-MM-dd HH:mm:ss'">
          <el-date-picker
            :placeholder="field.placeholder"
            type="datetime"
            :readonly="true"
            :style="field.style"
            :name="field.name"
            v-model="field.value"
            :title="field.title"
          />
        </template>
        <template v-else-if="field.dateFormat=='yyyy-MM-dd'">
          <el-date-picker
            :placeholder="field.placeholder"
            type="date"
            :readonly="true"
            :style="field.style"
            :name="field.name"
            v-model="field.value"
            :title="field.title"
          />
        </template>
        <template v-else-if="field.dateFormat=='yyyy-MM'">
          <el-date-picker
            :placeholder="field.placeholder"
            type="month"
            :readonly="true"
            :style="field.style"
            v-model="field.value"
          />
        </template>
        <template v-else-if="field.dateFormat=='yyyy'">
          <el-date-picker
            :placeholder="field.placeholder"
            type="year"
            :readonly="true"
            :style="field.style"
            v-model="field.value"
        />
        </template>
        <template v-else-if="field.dateFormat=='yyyy-MM-dd HH:mm'">
          <el-date-picker
            :placeholder="field.placeholder"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :readonly="true"
            :style="field.style"
            v-model="field.value"
          />
        </template>
      </template>
    </template>

    <!--编辑-->
    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <template v-if="field.dateFormat=='yyyy-MM-dd HH:mm:ss'">
        <el-date-picker
          :placeholder="field.placeholder"
          type="datetime"
          :style="field.style"
          v-model="field.value"
          @change="onChange"
          :picker-options="pickerOptions"
        />
      </template>
      <template v-else-if="field.dateFormat=='yyyy-MM-dd'">
        <el-date-picker
          :placeholder="field.placeholder"
          type="date"
          :style="field.style"
          v-model="field.value"
          @change="onChange"
          :picker-options="pickerOptions"
        />
      </template>
      <template v-else-if="field.dateFormat=='yyyy-MM'">
        <el-date-picker
          :placeholder="field.placeholder"
          type="month"
          :style="field.style"
          v-model="field.value"
          @change="onChange"
        />
      </template>
      <template v-else-if="field.dateFormat=='yyyy'">
        <el-date-picker
          :placeholder="field.placeholder"
          type="year"
          :style="field.style"
          v-model="field.value"
          @change="onChange"
        />
      </template>
      <template v-else-if="field.dateFormat=='yyyy-MM-dd HH:mm'">
        <el-date-picker
          :placeholder="field.placeholder"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :style="field.style"
          v-model="field.value"
          @change="onChange"
          :picker-options="pickerOptions"
        />
      </template>
      <template v-else-if="field.dateFormat=='HH:mm:ss'">
        <el-date-picker
          :placeholder="field.placeholder"
          type="datetime"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          :style="field.style"
          v-model="field.value"
          @change="onChange"
        />
      </template>
    </template>
  </span>
</template>

<script>
import Constant from "@/Constant.js";
export default {
  name: "o-date-picker",
  props: ["id"],
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.displayType == 5 || formData.displayType == 3) {
        formData.printHiddenValue = formData.printHiddenValue?formData.printHiddenValue.replace(/&nbsp;/g,""):'';
        console.log("formData.printHiddenValue--->",formData.printHiddenValue)
      }
      return formData;//this.$parent.findField(this.id);
    }
  },
  methods: {
    onChange() {
      if (this.field.refreshOnChanged) {
        this.$parent.refresh(this.id);
      }
    },
    findStartField() {}
  },
  data: function() {
    return {
      Constant,
      pickerOptions: {
        disabledDate: time => {
          if(this.field.prev_Name) {
            let startField;
            let startFieldName = this.field.prev_Name;
            let fields = this.$parent.getAllFields();
            if (fields)
              for (let i = 0; i < fields.length; i++) {
                if (startFieldName == fields[i].name) {
                  startField = fields[i];
                  break;
                }
              }
            if (startField) {
              return  new Date(startField.value).getTime() > time.getTime();
            }
            return false;
          }else {
            let endField;
            let fields = this.$parent.getAllFields();
            if (fields)
              for (let i = 0; i < fields.length; i++) {
                if (fields[i].prev_Name == this.field.name){
                  endField = fields[i];
                  break;
                }
              }
            if (endField) {
              console.log("new Date(endField.value).getTime()--->",new Date(endField.value).getTime())
              return  new Date(endField.value).getTime() < time.getTime();
              
            }

          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          let endField;
          let fields = this.$parent.getAllFields();
          if (fields)
            for (let i = 0; i < fields.length; i++) {
              if (fields[i].prev_Name == this.field.name){
                endField = fields[i];
                break;
              }
            }
          if (endField) {
            return  new Date(endField.value).getTime() < time.getTime();
          }
          return false;
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          //当为结束日期时，结束日期不能小于起始日期
          //拿回起始日期
          let startField;
          let startFieldName = this.field.prev_Name;
          let fields = this.$parent.getAllFields();
          if (fields)
            for (let i = 0; i < fields.length; i++) {
              if (startFieldName == fields[i].name) {
                startField = fields[i];
                break;
              }
            }
          if (startField) {
            return  new Date(startField.value).getTime() > time.getTime();
          }
          return false;
        }
      }
    };
  }
};
</script>