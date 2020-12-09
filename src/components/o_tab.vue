<template>
  <div style="width:100%;">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <el-tabs 
        ref="tabs"
        v-model="field.activeName" 
        type="card" 
        @tab-click="handleClick" 
        v-if="field.showMode=='0'"
      >
        <el-tab-pane
          v-for="(tab,index) in field.tabs"
          :key="tab.id"
          :label="tab.name"
          :name="tab.id"
        >
          <!-- v-if="tab.displayType != Constant.PermissionType_HIDDEN" -->
          <div style="width:100%; display:-webkit-flex; display:flex; align-items:flex-end;">
            <div style="margin:0 auto; width:100%;">
              <component 
                name="formTemplate" 
                :is="template(index)"> 
              </component>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      

      <div v-else-if="field.showMode == '1'">
        <el-collapse 
          v-model="collapseNames" 
          @change="handleChange" 
        >
          <el-collapse-item 
            v-for="(item, index) in field.tabs" 
            :name="index" 
            :key="item.id" 
            :title="item.name"
          >
            <div style="width:100%; display:-webkit-flex; display:flex; align-items:flex-end;">
              <div style="margin:0 auto;">
                <component 
                  name="formTemplate" 
                  :is="template(index)">
                </component>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">

    </template>  

  </div>
</template>

<script>
import Constant from "@/Constant.js";
import view_delegate from "@/components/view_delegate.vue"
export default {
  name: "o-tab",
  props: ["id"],
  components: { view_delegate },
  computed: {
    field: function() {
      // if(this.isOpenAll){
      //   this.allCollapseShow();
      // }
      return this.setField(this.$parent.findField(this.id));
      //return this.$parent.findField(this.id);
    },
  },
  mounted() {
    // this.$nextTick(function() {
    //   this.$forceUpdate();
    // });
  },
  data: function() {
    return { 
      Constant, 
      activeName: 0,
      collapseNames: [],
      isOpenAll:true,
    };
  },

  methods: {
    toTab(params) {
      //this.$parent.setCallback(params);  //form_normalform组件的方法
      this.$parent.addTabs(params);
    },
    hideTabs() {
      //this.$refs.tabs.$children[0].$el.style.display = 'none';
      this.$refs.tabs.$children[0].$refs.tabs[2].style.display = 'none';
    },
    setField(data) {
      let formData = data
      if (formData.tabs &&  formData.tabs.length > 0) {
        let active = '';
        let activeName = '';
        for (let i = 0; i < formData.tabs.length; i++) {
          if(formData.tabs[i].selected) {
            active = i;
            formData.activeName = formData.tabs[i].id;
          }else {
            if(active) {
              formData.activeName = formData.tabs[active].id;
            }else {
              if(formData.tabs[i].displayType == 3) {
                activeName = formData.tabs[i+1].id;
                formData.activeName = formData.tabs[i+1].id;
                this.$refs.tabs.$children[0].$refs.tabs[i].style.display = 'none';
              }else {
                if(this.$refs.tabs) {
                  this.$refs.tabs.$children[0].$refs.tabs[i].style.display = 'inline-block';
                }
                formData.activeName = formData.tabs[0].id;
              }
              
            }
          }
          // if(formData.tabs[i].displayType == 3) {
          //   formData.activeName = "QUmCaaTmJ68rJ1aQooc";
          //   //this.$refs.tabs.$children[0].$refs.tabs[i].style.display = 'none';
          // }
        }
        if(activeName) {
          formData.activeName = activeName;
        }
        console.log("formData.activeName---------------->",formData.activeName);
      }
      return formData;
    },
    
    allCollapseShow() {
      let openAll = this.$parent.findField(this.id).openAll;
      //打开所有折叠
      if(openAll == "true" && this.isOpenAll) {
        this.isOpenAll = false;
        let arr = [];
        let tabsData = this.$parent.findField(this.id).tabs;
        for(let i=0; i<tabsData.length; i++) {
          arr.push(i);
        }
        this.collapseNames = arr;
      }
    },
    handleChange(val) {
      console.log(val);
    },
    handleClick(tab, event) {
      console.log("当前标签");
      console.log("tab--->",tab);
      console.log("event-->",event);
    },
    template(index) {
      let data = this.field.tabs[index];
      if (data && data.fields) {
        return {
          methods: {
            findField(id) {
              for (let i = 0; i < data.fields.length; i++) {
                let fld = data.fields[i];
                if (id == fld.id) return fld;
              }
              return null;
            }
          },
          template: "<div>" + data.template + "</div>"
        };
      } else if (data.type == "view") {
        let viewId = data.id;
        let showtype = "tab";
        let parentId = data.docId;
        let isRelate = data.relate;
        let formId = this.field.formId;
        return {
          components: { view_delegate },
          methods: {
            getParams() {
              return {
                appId: this.$root.appid,
                actionContent: viewId,
                showtype: showtype,
                parentId:parentId,
                isRelate:isRelate,
                formId:formId,
                showtype:'tab',
              }
            },
            toTab: this.toTab,
          },
          template: "<div><view_delegate :toTab='toTab' :showtype='getParams().showtype' :openParams='getParams()' /></div>"
        };
      }else {
        return {
          template: "<div>empty</div>"
        };
      }
    }
  }
};
</script>

<style>
</style>
