<template>
  <div class="dept-tree-wraper">
    <!--视图选择框-->
    <div class="is-view" v-if="isView">
      <div class="view-tree">
        <el-tree 
          :empty-text="loading"
          :load="loadNode" 
          node-key="key" 
          ref="viewTree" 
          lazy 
          :show-checkbox="mutil || selectOne"
          :expand-on-click-node="false"
          :check-strictly="true"
          @node-click="getTemplete"
          @check-change="checkedNodes"
        >
        </el-tree>
      </div>
      <div class="multiple" v-if="mutil || selectOne">
        <div class="header">
          <span class="text">
            <span>已选</span>
            <span>{{tags.length}}</span>
          </span>
          <span>重置</span>
        </div>
        <div class="content" >
          <el-tag
            class="tag"
            v-for="tag in tags"
            :key="tag.name"
            closable
          >
            {{tag.name}}
          </el-tag>
        </div>
      </div>
    </div>

    <!--非视图选择框-->
    <div class="no-view" v-else>
      <div class="treepanel" >
        <div class="btns">
          <span class="btn-icon" v-for="(item, index) in view.activities" :key="index">
            <i class="el-icon-plus" v-if="item.type == 2" @click="handleBtn(item.type, item)"></i>
            <i class="el-icon-delete" v-else-if="item.type == 3" @click="handleBtn(item.type, item)"></i>
          </span>
        </div>
        <div class="tree">
          <el-tree 
            :empty-text="loading"
            :load="loadNode" 
            node-key="key" 
            ref="deptTree" 
            lazy 
            show-checkbox
            :expand-on-click-node="false"
            :check-strictly="true"
            @node-click="getTemplete"
            @node-contextmenu="rightClick"
          >
          </el-tree>
          <div 
            id="perTreeMenu" 
            v-if="menuVisible" 
            class="tree_menu" 
            :style="{...rightMenu}"
          >
            <ul>
              <li v-for="(item, index) in view.activities" :key="index">
                <i class="el-icon-tickets" v-if="item.type == 2"></i>
                <span v-if="item.type == 2" @click.stop="handleBtn(item.type, item)"> 创建</span>
                <i class="el-icon-delete" v-if="item.type == 3"></i>
                <span v-if="item.type == 3" @click.stop="deleteTreeNode()"> 删除</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="view-form">
        <div v-if="treeview" class="view-box">
          <div class="box-container" v-if="view.innerType == 'LINK' || view.innerType == 'VIEW'" >
            <view_listview
              :openParams="openParams" 
              :view="treeview"
              :parentId="parentId"
              v-if="isRouterAlive"
              @getDocIds="setDocIds"
              ref="treeView"
            />
          </div>
          <div class="box-container" v-if="view.innerType == 'FORM'">
            <form_normalform
              :openParams="treeview"
              v-if="isFormRouter"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import view_listview from "@/components/view_listview.vue";
import form_normalform from "@/components/form_normalform.vue";
export default {
  name: "view_treeview",
  props: [
    "view",
    "isView",
    "mutil",
    "selectOne"
    ],
  components: {
    view_listview,
    form_normalform,
  },
  data: function() {
    return {
      arrNodes:[],
      treeViewData:[],
      isDisplay: false,
      treeview:'',
      openParams:'',
      parentId:'',
      isRouterAlive: true,
      isFormRouter:true,
      tags: [],
      loading:'加载中...',
      currentDocIds:[],
      hasChildren:'',
      menuVisible:false,
      currentRightNodeId:'', //当前右键选择中的节点
    };
  },
  computed: {
    
    
  },
  watch:{
    
  },
  created() {
    //this.getTreeView();
  },
  mounted() {
    if(!this.isView) {
      this.getTemplete()
    }
    
  },
  methods: {

    //右键删除树形节点
    deleteTreeNode(){
      this.$api.deleteTreeviewNode(
        this.$root.appid,
        this.currentRightNodeId, 
        {
          onSucess: res => {
            if(res.data.errcode == 0) {
              this.$notify({
                title: '成功',
                message: '',
                type: 'success'
              });
              this.$emit("updateView");
            }
          }
        }
      )
    },
    rightClick(e,data,node,comp){
      if(this.view.activities[0].contextMenu || this.view.activities[1].contextMenu) {
        this.currentRightNodeId = data.key;
        this.rightMenu = {top:e.pageY + 8 +'px',left:e.pageX+'px'};
        this.menuVisible = true;
        const self = this;
        document.onclick=function(ev){
          if(ev.target!==document.getElementById('perTreeMenu')){
            self.menuVisible = false;
          }
        }
      }
    },
    setDocIds(val,hasChildren) {
      this.currentDocIds = val;
      this.hasChildren = hasChildren;
    },
    checkedNodes(node) {
      let res = this.$refs.viewTree.getCheckedNodes();
      let arr = [];
      if(res && res.length>0) {
        this.tags = [];
        let select='';
        for(let i=0; i<res.length; i++) {
          let obj = {};
          obj.name = res[i].label;
          obj.docId = res[i].key;
          this.tags.push(obj);
          select += res[i].rows.docId + ";";
          arr.push(res[i].rows);
        }
        let params = {
          linkType: "00",
          appId: this.$root.appid,
          actionContent: node.formId,
          _select:select,
          viewId: this.view.id,
        }
        this.$emit("updateViewData", params, arr);
      }else {
        let params = {
          linkType: "00",
          appId: this.$root.appid,
          actionContent: node.formId,
          _select:'',
          viewId: this.view.id,
        }
        this.$emit("updateViewData", params, arr);
      }
    },
    handleBtn(type, item) {
      if(type == 2) {
        let params = {
          linkType: "00",
          appId: this.$root.appid,
          active: true,
          name:'树形视图',
          actionContent: item.onActionForm,
        };
        this.$emit("add-tab", params)
      }else if (type == 3) {
        if(this.hasChildren) {
          this.$message({
            message: '该父节点下存在子节点，请删除子节点元素',
            type: 'warning'
          });
        }else {
          let res = this.$refs.deptTree.getCheckedNodes();
          let arr = [];
          for(let i=0; i < res.length; i++) {
            arr.push(res[i].key);
          }
          arr = arr.concat(this.currentDocIds);
          this.$emit("deleted", item, arr);
        }
        
      }
    },

    getTemplete(node, resolve){
      if(!this.isView) {
        if(this.view.innerType && this.view.innerType == 'VIEW') {
          let params = {
            linkType: "01",
            appId: this.$root.appid,
            actionContent: this.view.id,
            parentId: node?node.key:'',
            viewId: ""
          };
          this.openParams = params;
          let appId = this.$root.appid;
          let linkViewId = this.view.id;
          let  hasListview = true;
          if(!node) {
            this.$api.getTreeViewTemplate(
              appId, 
              linkViewId, 
              hasListview,
              {
                onSucess: response => {
                  this.treeview = response.data.data;
                }
              }
            )
          }else {
            this.parentId = node.key;
            let params = {
              appId: this.$root.appid,
              viewId: this.view.id,
              hasListview: true,
              hasTreeview: true,
              parentId: node.key,
              isTreeView: true,
              opentarget: "detail",
              treedocid: node.key,
            };
            this.$api.getViewTemplateP(appId, this.view.id, params, {
              onSucess: response => {
                if (response.data.data) {
                  //this.parentId = node.key;
                  this.treeview = response.data.data;
                  this.$refs.treeView.setTreeViewData(node.key);
                  //this.reload();
                }
              }
            });
          }
        }else if (this.view.innerType && this.view.innerType == 'FORM') {
          if(!node) {
            let params = {
              linkType: "00",
              appId: this.$root.appid,
              actionContent: this.view.relatedForm,
              _select: "",
              viewId: ""
            };
            this.treeview = params;
          }else {
            let params = {
              linkType: "00",
              appId: this.$root.appid,
              actionContent: this.view.relatedForm,
              _select: node.key,
              viewId: ""
            };
            this.treeview = params;
            let value = "FORM"
            this.reload(value)
          }
        }else if (this.view.innerType && this.view.innerType == 'LINK') {
          let params = {
            linkType: "01",
            appId: this.$root.appid,
            actionContent: this.view.linkViewId,
            parentId: node?node.key:'',
            viewId: ""
          };
          this.openParams = params;
          let appId = this.$root.appid;
          let linkViewId = this.view.linkViewId;
          let  hasListview = true;
          if(!node) {
            this.$api.getTreeViewTemplate(
              appId, 
              linkViewId, 
              hasListview,
              {
                onSucess: response => {
                  this.treeview = response.data.data;
                }
              }
            )
          }else {
            this.$api.getViewTemplateP(appId, this.view.id, node.key, {
              onSucess: response => {
                if (response.data.data) {
                  this.treeview = response.data.data;
                  this.parentId = node.key;
                  this.reload();
                }
              }
            });
          }
          
        }
      }else {
        debugger
        let arr = [];
        arr.push(node.rows);
        let isRadio = true
        let params = {
          linkType: "00",
          appId: this.$root.appid,
          actionContent: node.formId,
          _select:node.key,
          viewId: this.view.id,
        }
        this.$emit("updateViewData", params, arr, isRadio);
      }
    },
    
    reload (value) {
      if(value == "FORM") {
        this.isFormRouter = false
        this.$nextTick(() => (this.isFormRouter = true));
      }else {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true));
      }
      
    }, 

    loadNode(node, resolve) {
      let appid = this.$root.appid;
      if (node.level === 0) {
        this.$api.getTreeViewData(
          this.$root.appid,
          this.view.id,
          {
            parentId: ""
          },
          {},
          "",
          {
            onSucess: response => {
              let viewData = response.data;
              this.treeViewData = response.data.data.data;
              // if(!this.isView) {

              // }
              // this.getTemplete();
              if (viewData.data.data && viewData.data.data.length > 0) {
                let nodes = [];
                this.view.columns.forEach(clm => {
                  if (clm.mappingField == "name_Node") {
                    viewData.data.data.forEach(doc => {
                      let rows = {};
                      rows.formId = doc.formId;
                      rows.docId = doc.id;
                      for (var key in doc.items) {
                        let items = doc.items[key];
                        rows[key] = items.value;
                      }

                      let label = doc.items[clm.id].value;
                      nodes.push(
                        { 
                          key: doc.id, 
                          level: 0, 
                          label: label, 
                          children: doc.children, 
                          formId: doc.formId, 
                          row_count: doc.row_count,
                          rows,
                        });
                    });
                  }
                });
                this.arrNodes = nodes
                resolve(this.arrNodes);
              }else if(viewData.data.data.length == 0){
                this.loading = " "
                this.isDisplay = true;
              }
            }
          }
        );

      } else {
        this.$api.getTreeViewData(
          this.$root.appid,
          this.view.id,
          {
            parentId: node.key
          },
          {},
          "",
          {
            onSucess: response => {
              let viewData = response.data;
              this.treeViewData = response.data.data.data;
              if (viewData.data.data && viewData.data.data.length > 0) {
                let nodes = [];
                this.view.columns.forEach(clm => {
                  if (clm.mappingField == "name_Node") {
                    viewData.data.data.forEach(doc => {
                      let rows = {};
                      rows.formId = doc.formId;
                      rows.docId = doc.id;
                      for (var key in doc.items) {
                        let items = doc.items[key];
                        rows[key] = items.value;
                      }

                      let label = doc.items[clm.id].value;
                      nodes.push(
                        { 
                          key: doc.id, 
                          level: 0, 
                          label: label, 
                          children: doc.children, 
                          formId: doc.formId, 
                          row_count: doc.row_count,
                          rows,
                        });
                    });
                  }
                });
                //this.arrNodes = nodes
                resolve(nodes);
              }else if(viewData.data.data.length == 0){
                let nodes = [];
                resolve(nodes);
                this.isDisplay = true;
              }
            }
          }
        );
      }
    },


    getTreeView() {
      console.log("view---->",this.view)
      this.$api.getTreeViewData(
        this.$root.appid,
        this.view.id,
        {
          parentId: ""
        },
        {},
        "",
        {
          onSucess: response => {
            let viewData = response.data;
            this.treeViewData = response.data.data.data;
            if (viewData.data.data && viewData.data.data.length > 0) {
              let nodes = [];
              this.view.columns.forEach(clm => {
                if (clm.mappingField == "current_Node") {
                  viewData.data.data.forEach(doc => {
                    let label = doc.items[clm.id].value;
                    nodes.push({ key: doc.id, level: 0, label: label, children: doc.children, formId: doc.formId});
                  });
                }
              });
              this.arrNodes = nodes
              console.log("this.treeViewData--->",this.treeViewData)
              console.log("arrNodes--->",this.arrNodes);
            }else if(viewData.data.data.length == 0){
              this.isDisplay = true;
            }
          }
        }
      );
    },
  }
};
</script>

<style lang="scss">

</style>