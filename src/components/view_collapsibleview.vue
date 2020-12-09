<template>
  <div>
    <el-table
      style="width: 100%"
      ref="multipleTable"
      v-if="view.columns && view.columns.length>0"
      :data="tableData"
      row-key="docId"
      :load="load"
      lazy
      @row-click="onRowClick"
      @selection-change="handleSelectionChange"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column 
        type="selection" 
        v-model="checkedAll" 
        width="55"
      >
      </el-table-column>
      <template v-for="(column, index) in view.columns">
        <el-table-column
          :key="index"
          :prop="column.id"
          :label="column.name"
          :width="column.width"
        >
          <template slot-scope="scope">
            {{scope.row[column.id]}}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "view-collapsibleview",
  props: [
    "view",
    "openParams",
    "showtype",
  ],
  watch: {
    
  },
  computed: {
    
  },

  mounted() {
    this.getData();
  },

  data: function() {
    return {
      checkedAll:[],
      currentPage: 1,
      tableData:[],
      row_count:0,
    };
  },

  methods: {
    load(tree, treeNode, resolve) {
      let that = this;
      let appId = this.$root.appid;
      let params = {
          viewId: this.openParams.actionContent,
          opentarget: 'detail',
          containTitle: this.view.name,
        }
      this.$api.getCollapsedviewTemplate(
        appId,
        params,
        {
          onSucess: res => {
            if(res.data.data) {
              that.$api.getViewData(
                //普通视图接口
                that.$root.appid,
                that.openParams.actionContent,
                {
                  currpage: that.currentPage,
                  lines: 10,
                  parentParam: encodeURIComponent(tree.parentName + '\\'),
                },
                {},
                {
                  onSucess: response => {
                    let docs = response.data.data.data;
                    let tds = [];
                    if (docs) {
                      docs.forEach(doc => {
                        let rows = {};
                        rows.formId = doc.formId;
                        rows.docId = doc.id;
                        for (let key in doc.items) {
                          let items = doc.items[key];
                          rows[key] = items.value;
                        }
                        if(doc.hasChild) {
                          rows.hasChildren = true;
                        }
                        if(doc.parentName) {
                          rows.parentName = doc.parentName;
                        }
                        tds.push(rows);
                      });
                      console.log("tds--->",tds);
                      resolve(tds);
                    }   
                  }
                }
              );
            }
          }
        }
      )
      // setTimeout(() => {
      //   resolve([
      //     {
      //       id: 31,
      //       date: '2016-05-01',
      //       name: '王小虎',
      //       address: '上海市普陀区金沙江路 1519 弄'
      //     }, {
      //       id: 32,
      //       date: '2016-05-01',
      //       name: '王小虎',
      //       address: '上海市普陀区金沙江路 1519 弄'
      //     }
      //   ])
      // }, 1000)
    },



    onRowClick(row) {
      let params = {
        linkType: "00",
        name: this.view.name,
        appId: this.openParams.appId,
        actionContent: row.formId,
        _select:row.docId,
        viewId: this.view.id,
        parentId:this.openParams.parentId?this.openParams.parentId:'',  //包含元素时判断是否有parentId
        isRelate:this.openParams.isRelate?this.openParams.isRelate:'',  //包含元素时判断isRelate是否为true
        templateForm:this.view.templateForm?this.view.templateForm:'',
      };
      //this.$emit("openNewpage",params); //打开新页面
      this.$emit("add-tab", params)
    },
    handleSelectionChange(val) {
      let docIds = [];
      if(val.length>0) {
        for(let i=0; i<val.length; i++) {
          docIds.push(val[i].docId);
        }
      }else {
        docIds = [];
      }
      this.$emit("getDocIds",docIds);
    },
    getData(page) {
      this.getViewData(page).then(response => {
        let docs = response.data.data;
        this.dataList = response.data.data;
        this.row_count = response.data.row_count;
        let tds = [];
        if (docs) {
          docs.forEach(doc => {
            let rows = {};
            rows.formId = doc.formId;
            rows.docId = doc.id;
            for (var key in doc.items) {
              let items = doc.items[key];
              rows[key] = items.value;
            }
            if(doc.hasChild) {
              rows.hasChildren = true;
            }
            if(doc.parentName) {
              rows.parentName = doc.parentName;
            }
            tds.push(rows);
          });
          this.tableData = tds;
          console.log("this.tableData---->",this.tableData);
        }   
      });
    },
    //模拟数据请求
    getViewData(page) {
      let treeData = "";
      let treeName = "";
      if (this.parentId) {
        //树形视图
        return new Promise(resolve => {
          this.$api.getTreeViewData(
            //树形视接口
            this.$root.appid,
            this.openParams.actionContent,
            {
              parentId: this.parentId ? this.parentId : ""
            },
            treeData,
            treeName,
            {
              onSucess: response => {
                let treeViewData = response.data;
                resolve(treeViewData);
              }
            }
          );
        });
      } else if (this.openParams && this.openParams.parentId) {
        //包含元素时
        return new Promise(resolve => {
          this.$api.getViewData(
            //普通视图接口
            this.$root.appid,
            this.view.id,
            {
              parentId: this.openParams.parentId,
              isRelate: this.openParams.isRelate,
              currpage: page?page:this.currentPage,
              lines: this.view.data ? this.view.data.page_lines : 10,
              searchWord: ''
            },
            {

            },
            {
              onSucess: response => {
                let viewData = response.data;
                resolve(viewData);
              }
            }
          );
        });
      } else {
        return new Promise(resolve => {
          this.$api.getViewData(
            //普通视图接口
            this.$root.appid,
            this.view.id,
            {
              parentId: this.parentId ? this.parentId : "",
              currpage: page?page:this.currentPage,
              lines: this.view.data ? this.view.data.page_lines : 10,
              searchWord:'',
            },
            {},
            {
              onSucess: response => {
                let viewData = response.data;
                resolve(viewData);
              }
            }
          );
        });
      }
    },


  },
};
</script>