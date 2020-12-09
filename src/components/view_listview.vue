<template>
  <div class="view-listview" ref="viewListview">
    <div v-if="showtype=='home'">
      <div class="widget-view-list">
        <el-table
          border
          :header-cell-style="{background:'#F9F9F9',color:'#5A6779'}"
          min-height="270"
          ref="multipleTable"
          v-if="view.columns && view.columns.length>0"
          :data="tableData"
          style="width: 100%"
          @row-click="onWidgetRowClick"
          @selection-change="handleSelectionChange"
          :span-method="arraySpanMethod"
          :cell-class-name="checkbox"
        >
          <template v-for="(column, index) in view.columns">
            <el-table-column
              :show-overflow-tooltip="true"
              :key="index"
              :prop="column.id"
              :label="column.name"
              :width="column.width"
              :sortable="column.isOrderByField=='true'?true:false"
              v-if="!column.hiddenColumn"
            >
              <template slot-scope="scope">
                <!--普通视图-->
                <div v-if="!scope.row.isInclude" :style="{background:column.groundColor, color:column.color}">
                  <!-- 1 -->
                  <span v-if="column.formatType=='number'">
                    <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                      <span v-if="column.displayType == '00' && scope.row[column.id]">
                        {{toFixed(scope.row[column.id],column.decimalsNum)}}
                      </span>
                      <span v-else-if="column.displayType == '01' && scope.row[column.id]">
                        {{toFixed(scope.row[column.id],column.decimalsNum).substr(0,column.displayLength)}}
                      </span>
                    </span>
                    <span 
                      v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" 
                      v-html="toFixed(scope.row[column.id],column.decimalsNum)">
                    </span>
                  </span>

                  <!-- 2 -->
                  <span v-else-if="column.formatType=='currency'">
                    <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                      <span v-if="column.displayType == '00' && scope.row[column.id]">
                        <!--小计或总计-->
                        {{scope.row.isSum?scope.row[column.id]:currencyChange(scope.row[column.id], column.decimalsCurr,column.currType)}}
                      </span>
                      <span v-else-if="column.displayType == '01' && scope.row[column.id]">
                        {{currencyChange(scope.row[column.id], column.decimalsCurr,column.currType).substr(0,column.displayLength)}}
                      </span>
                    </span>
                    <span 
                      v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" 
                      v-html="currencyChange(scope.row[column.id], column.decimalsCurr,column.currType)">
                    </span>
                  </span>

                  <!-- 3 -->
                  <span v-else-if="column.formatType=='simple'" >
                    <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                      <span v-if="column.displayType == '00' && scope.row[column.id]">
                        <!--判断是否显示图标-->
                        <span v-if="column.showIcon">
                          <span v-if="column.iconMapping && JSON.parse(column.iconMapping)[0].key == scope.row[column.id]">
                            <img width="32" height="32" src="/obpm/uploads/lib/icon/p02_setup.png">
                          </span>
                          <span v-else>
                            {{scope.row[column.id]}}
                          </span>
                          <!-- {{column.iconMapping?JSON.parse(column.iconMapping)[0].key:''}} -->
                          <!-- {{scope.row[column.id]}}--{{column.showIcon}} -->
                        </span>
                        <span v-else >
                          <!--视图-流程回退标识-->
                          <span v-if="column.flowReturnCss">
                            <img src="../assets/images/backstatelabel01.gif" />
                          </span>
                          {{scope.row[column.id]}}
                        </span>
                      </span>
                      <span style="cursor:pointer" :title="scope.row[column.showTitle?column.id:'']" v-else-if="column.displayType == '01' && scope.row[column.id]">
                        {{scope.row[column.id].substr(0,column.displayLength)}}
                        {{scope.row[column.id].length>column.displayLength?'...':''}}
                      </span>
                    </span>
                    <span v-else-if="column.type=='COLUMN_TYPE_OPERATE'">
                      <button @click.stop.prevent>
                        {{column.buttonName}}
                      </button>
                    </span>
                    <span v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" v-html="scope.row[column.id]"></span>
                    
                  </span>

                  <!-- 4 -->
                  <span v-else>
                    <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                      <span style="cursor:pointer" :title="scope.row[column.showTitle?column.id:'']" v-if="column.displayType == '00' && scope.row[column.id]">
                        {{scope.row[column.id]}}
                      </span>
                      <span style="cursor:pointer" :title="scope.row[column.showTitle?column.id:'']" v-else-if="column.displayType == '01' && scope.row[column.id]">
                        <!-- {{scope.row[column.id].substr(0,column.displayLength)}} -->
                        {{scope.row[column.id].substr(0,column.displayLength)}}
                        {{scope.row[column.id].length>column.displayLength?'...':''}}
                      </span>
                    </span>
                    <span v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" v-html="scope.row[column.id]"></span>
                  </span>
                </div>

                <!--当是包含元素时-->
                <div v-if="scope.row.isInclude">
                  <div style="width:100%;min-height:100px;max-height:400px;overflow:auto"> 
                    <form_normalform
                      :openParams="newIncludeO"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>

          <!--当是包含元素且是当前页打开-->
          <el-table-column type="expand" v-if="showtype=='include' && view.openType == 1">
            <template>
              <form_normalform
                v-bind="$attrs"
                v-on="$listeners"
                :openParams="currentPageParams"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="allowOpenDoc"
            label="查看"
          >
            <template slot-scope="scope">
              <div @click.stop.prevent="openDocument(scope.row)">
                查看
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="listview-container" v-else>
      <div class="listview-box">
        <el-scrollbar class="scrollbar">
          <form_searchform
            :appId="openParams.appId"
            :viewId="openParams.actionContent"
            @onSearch="onSearch"
            ref="searchform"
          />
          <el-table
            border
            :header-cell-style="{background:'#F9F9F9',color:'#5A6779',textAlign:'center'}"
            :cell-style="{textAlign:'center'}"
            min-height="270"
            ref="multipleTable"
            v-if="view.columns && view.columns.length>0"
            :data="tableData"
            style="width: 100%"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
            :span-method="arraySpanMethod"
            :cell-class-name="checkbox"
          >
            <el-table-column
              style="view-checkedAll"
              v-if="mutil || selectOne || (!isView && !view.readonly)" 
              type="selection" 
              v-model="checkedAll" 
              width="55"
              :selectable="selectInit">
            </el-table-column>
            <el-table-column 
              width="55"
              v-if="!isView && view.readonly">
              <template slot="header" >
                <span class="checked-all">
                  <el-checkbox v-model="checkedAll" disabled></el-checkbox>
                </span>
              </template>
              <template>
                <span class="checked-all">
                  <el-checkbox v-model="checkedAll" disabled></el-checkbox>
                </span>
              </template>
            </el-table-column>
            
            <template v-for="(column, index) in view.columns">
              <el-table-column
                :show-overflow-tooltip="true"
                :key="index"
                :prop="column.id"
                :label="column.name"
                :width="getWidth(column.width)"
                :sortable="column.isOrderByField=='true'?true:false"
                v-if="!column.hiddenColumn"
              >
                <template slot-scope="scope">
                  <!--普通视图-->
                  <div v-if="!scope.row.isInclude" :style="{background:column.groundColor, color:column.color}">
                    <!-- 1 -->
                    <span v-if="column.formatType=='number'">
                      <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                        <span v-if="column.displayType == '00' && scope.row[column.id]">
                          {{toFixed(scope.row[column.id],column.decimalsNum)}}
                        </span>
                        <span v-else-if="column.displayType == '01' && scope.row[column.id]">
                          {{toFixed(scope.row[column.id],column.decimalsNum).substr(0,column.displayLength)}}
                        </span>
                      </span>
                      <span 
                        v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" 
                        v-html="toFixed(scope.row[column.id],column.decimalsNum)">
                      </span>
                    </span>

                    <!-- 2 -->
                    <span v-else-if="column.formatType=='currency'">
                      <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                        <span v-if="column.displayType == '00' && scope.row[column.id]">
                          <!--小计或总计-->
                          {{scope.row.isSum?scope.row[column.id]:currencyChange(scope.row[column.id], column.decimalsCurr,column.currType)}}
                        </span>
                        <span v-else-if="column.displayType == '01' && scope.row[column.id]">
                          {{currencyChange(scope.row[column.id], column.decimalsCurr,column.currType).substr(0,column.displayLength)}}
                        </span>
                      </span>
                      <span 
                        v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" 
                        v-html="currencyChange(scope.row[column.id], column.decimalsCurr,column.currType)">
                      </span>
                    </span>

                    <!-- 3 -->
                    <span v-else-if="column.formatType=='simple'" >
                      <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                        <span v-if="column.displayType == '00' && scope.row[column.id]">
                          <!--判断是否显示图标-->
                          <span v-if="column.showIcon">
                            <span v-if="column.iconMapping && column.iconMapping[0].key == scope.row[column.id]">
                              <img width="32" height="32" src="/obpm/uploads/lib/icon/p02_setup.png">
                            </span>
                            <span v-else>
                              {{scope.row[column.id]}}
                            </span>
                            {{column.iconMapping[0].key}}
                          </span>
                          <span v-else>
                            <!--视图-流程回退标识-->
                            <span v-if="column.flowReturnCss">
                              <img src="../assets/images/backstatelabel01.gif" />
                            </span>
                            <!-- {{scope.row[column.id] | viewFieldPath(column.columnField,scope.row[column.id])}} -->
                            <span>
                              <span v-if="column.columnField == 'ImageUploadField'">
                                <!-- {{viewFieldPath(scope.row[column.id],column.columnField)}} -->
                                <span v-if="scope.row[column.id]">
                                  <span v-for="(el, i) in JSON.parse(scope.row[column.id])" :key="i">
                                    <img width="30px" :src="'obpm/'+viewFieldPath(el,column.columnField)" />
                                  </span>
                                </span>
                              </span>
                              <span v-else-if="column.columnField == 'AttachmentUploadField'">
                                {{viewFieldPath(scope.row[column.id],column.columnField)}}
                              </span>  
                              <span v-else>
                                {{scope.row[column.id]}}
                              </span>
                            </span>
                          </span>
                        </span>
                        <span style="cursor:pointer" :title="scope.row[column.showTitle?column.id:'']" v-else-if="column.displayType == '01' && scope.row[column.id]">
                          {{simple[column.id].substr(0,column.displayLength)}}
                          {{scope.row[column.id].length>column.displayLength?'...':''}}
                        </span>
                      </span>
                      <span v-else-if="column.type=='COLUMN_TYPE_LOGO'">
                        <span v-if="column.iconMapping">
                          <img v-for="(item,index) in column.iconMapping" :key="index" width="32" height="32" :src="'/obpm/uploads/lib/icon' + item.value">
                        </span>
                        <span v-else-if="column.icon">
                          <img width="32" height="32" :src="'/obpm/uploads/lib/icon/'+column.icon">

                        </span>
                      </span>
                      <span v-else-if="column.type=='COLUMN_TYPE_OPERATE'">
                        <button @click.stop.prevent ="buttonClick(column.id, column.parentView, column.buttonType, column.name, scope.row.docId, column.actionScript,column.mappingform)">
                          {{column.buttonName}}
                        </button>
                      </span>
                      <span v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" v-html="scope.row[column.id]"></span>
                    </span>

                    <!-- 4 -->
                    <span v-else>
                      <span v-if="column.type=='COLUMN_TYPE_FIELD'">
                        <span style="cursor:pointer" :title="scope.row[column.showTitle?column.id:'']" v-if="column.displayType == '00' && scope.row[column.id]">
                          <!-- {{scope.row[column.id]}} -->
                          <span>
                            <span v-if="column.columnField == 'ImageUploadField'">
                              <span v-if="scope.row[column.id]">
                                <span v-for="(el, i) in JSON.parse(scope.row[column.id])" :key="i">
                                  <img width="30px" :src="'obpm/'+viewFieldPath(el,column.columnField)" />
                                </span>
                              </span>
                            </span>
                            <span v-else-if="column.columnField == 'AttachmentUploadField'">
                              {{viewFieldPath(scope.row[column.id],column.columnField)}}
                            </span>  
                            <span v-else>
                              {{scope.row[column.id]}}
                            </span>
                          </span>
                        </span>
                        <span style="cursor:pointer" :title="scope.row[column.showTitle?column.id:'']" v-else-if="column.displayType == '01' && scope.row[column.id]">
                          <!-- {{scope.row[column.id].substr(0,column.displayLength)}} -->
                          {{scope.row[column.id].substr(0,column.displayLength)}}
                          {{scope.row[column.id].length>column.displayLength?'...':''}}
                        </span>
                      </span>
                      <span v-else-if="column.type=='COLUMN_TYPE_SCRIPT'" v-html="scope.row[column.id]"></span>
                    </span>
                  </div>

                  <!--当是包含元素时-->
                  <div v-if="scope.row.isInclude">
                    <div style="width:100%;min-height:100px;max-height:400px;overflow:auto"> 
                      <form_normalform
                        :openParams="newIncludeO"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
            </template>

            <!--当是包含元素且是当前页打开-->
            <el-table-column type="expand" v-if="showtype=='include' && view.openType == 1">
              <template>
                <form_normalform
                  v-bind="$attrs"
                  v-on="$listeners"
                  :openParams="currentPageParams"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="allowOpenDoc"
              label="查看"
            >
              <template slot-scope="scope">
                <div @click.stop.prevent="openDocument(scope.row)">
                  查看
                </div>
              </template>
            </el-table-column>
          </el-table>
          <mdialog ref="dialog" width="90%"/>
        </el-scrollbar>
      </div>
      <div class="page" v-if="showtype != 'include' && this.view.pagination">
        <div class="page-con">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="row_count"
            :page-size="pagesize"
            :page-sizes="[5, 10, 15, 20, 30, 40, 50, 100]"
            :current-page.sync="currentPage"
            @current-change="onPageChang($event)"
            @size-change="handleSizeChange($event)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import form_searchform from "@/components/form_searchform.vue";
import mdialog from "@/components/dialog.vue";
import form_normalform from "@/components/form_normalform.vue";
export default {
  name: "view-listview",
  props: [
    "view",
    "openParams",
    "clearCheckboxVal",
    "mutil",  //视图选择框多选
    "selectOne", //视图选择框多选
    "isView", //判断是否是视图选择框
    "allowOpenDoc",
    "showtype",
    "selectedRows",
    'callback',
    'delegateWidth'
  ],
  components: {
    form_searchform,
    form_normalform,
    mdialog,
  },
  watch: {
    clearCheckboxVal() {
      if(this.clearCheckboxVal){
        this.toggleSelection();
      }
    },
  },
  computed: {
  },

  mounted() {
    this.getData(); 
  },

  data: function() {
    return {
      currentPage: 1,
      checkedAll:[],
      tableData:[],
      row_count:0,
      currentPageParams:{},
      currentPageSize:'',
      documents:'',
      searchExcelData:'',
      pagesize:0,
      // view: { columns: [] }
    };
  },

  methods: {

    //获取屏幕宽度，设置列宽
    getWidth(val) {
      if(val) {
        if(val.indexOf('%')>-1) {
          let num = val.split("%")[0];
          let w = this.delegateWidth * parseInt(num) / 100;
          return w;
        }else {
          return val;
        }
      }else {
        return '';
      }
     
    },

    //视图列按钮操作
    buttonClick(id, parentView, type, name, docId ,actionScript, mappingform) {
      let params = '';
      switch(type) {
        case '00':
          this.$confirm(`确定要删除您选择的记录吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let arr = [];
            arr.push(docId);
            this.$api.batchRemoveDocuments(
              this.$root.appid,
              arr,
              {
                onSucess: res => {
                  this.getData();
                }
              }
            )
          }).catch(() => {
                    
          });

          break;
        case '01':
          let isSubmissionProcess = true;
          this.$parent.viewColumnSubmission(isSubmissionProcess,docId);
          break;
        case '02':
          break;
        case '03':
          params = {
            linkType: "00",
            appId: this.$root.appid,
            actionContent: mappingform,
            _select:docId,
            name,
            refreshId:this.openParams.id,
          };
          this.$emit("add-tab", params);
          break;
        case '04':
          let data = {
            actionScript,
            columnName: name,
            docId,
          }
          this.$api.runActionScript(
            this.$root.appid,
            parentView,
            id,
            data,
            {
              onSucess: res => {
                if(res.data.errcode == 0) {
                  this.$emit("updateView");
                  this.$message({
                    showClose: true,
                    message: `${actionScript}`,
                    type: 'success'
                  });
                }
              }
            }
          )
          break;
        case '05':
          params = {
            linkType: "00",
            appId: this.$root.appid,
            active: true,
            actionContent: mappingform,
            name: this.view.name,
            refreshId:this.openParams.id,
            type: 277,
          };
          this.$parent.openForm(params);
          break;
      }
    },

    getExcelParams() {
      if(this.searchExcelData) {
        return this.searchExcelData;
      }else {
        return '';
      }
    },

    checkbox(row){
      if(row.row.isSum) {
        return "mycell";
      }
    },

    selectInit(row, index) {
      if(row.isSum) {
        return false;
      }else {
        return true;
       
      }
    },

    //视图选择框允许打开文本
    openDocument(row) {
      let params = {
        linkType: "00",
        appId: this.openParams.appId,
        actionContent: row.formId,
        _select:row.docId,
        viewId: this.view.id,
        parentId:this.openParams.parentId?this.openParams.parentId:'',  //包含元素时判断是否有parentId
        isRelate:this.openParams.isRelate?this.openParams.isRelate:'',  //包含元素时判断isRelate是否为true
        searchData:this.searchData,
        showtype:this.showtype,
        templateForm:this.view.templateForm?this.view.templateForm:'',
      };
      if(this.isView) {
        let arr = [];
        arr.push(row);
        let isRadio = true
        this.$emit("openDoc", params);
      }
    },

    handleSizeChange(ev) {
      this.currentPageSize = ev
      let page = 1;
      this.getData(page, this.currentPageSize);
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if(row && row.isInclude && columnIndex == 1) {
        let len =  this.view.columns.length;  
        return [1,len];
      }
    },

    addRow(params) {
      this.newIncludeO = params;
      this.tableData.unshift({isInclude:true});
    },

    getData(page, size, searchData) {
      this.getViewData(page, size,searchData).then(response => {
        let docs = response.data.data;
        this.documents = response.data.data;
        this.pagesize = size?size:this.view.pageLines?parseInt(this.view.pageLines):10;
        this.row_count = response.data.row_count;
        let tds = [];
        if (docs)
          docs.forEach(doc => {
            let rows = {};
            rows.formId = doc.formId;
            rows.docId = doc.id;
            rows.children = doc.children;
            for (var key in doc.items) {
              let items = doc.items[key];
              rows[key] = items.value;
            }
            if(doc.isSum) {
              rows.isSum = doc.isSum;
            }
            tds.push(rows);
          });
          this.tableData = tds;
          if(this.selectedRows && this.selectedRows.length > 0 ){
            this.$nextTick(function() {
              for(let i=0; i<this.tableData.length; i++) {
                for(let j=0; j<this.selectedRows.length; j++) {
                  if(this.tableData[i].docId == this.selectedRows[j].docId) {
                    this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true);
                  }
                }
              }
              //
            });
          }
        //return tds;
      });
    },

    //模拟数据请求
    getViewData(page, size, searchData) {
      
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
              lines: size ? size : parseInt(this.view.pageLines),
              searchWord: ''
            },
            searchData?searchData:{},
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
              lines: size ? size : parseInt(this.view.pageLines),
              searchWord:'',
            },
            searchData?searchData:{},
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
    
    //获取树形视图节点的数据
    setTreeViewData(nodeKey) {
      let treeData = "";
      let treeName = "";
      this.$api.getTreeViewData(
        //树形视接口
        this.$root.appid,
        this.openParams.actionContent,
        {
          parentId: nodeKey,
          treedocid: nodeKey,
          parentNodeId: nodeKey,
        },
        treeData,
        treeName,
        {
          onSucess: response => {
           
            let docs = response.data.data.data;
            this.documents = response.data.data.data;
            //this.pagesize = size?size:this.view.pageLines?parseInt(this.view.pageLines):10;
            this.row_count = response.data.data.row_count;
            let tds = [];
            if (docs && docs.length > 0){
              docs.forEach(doc => {
                let rows = {};
                rows.formId = doc.formId;
                rows.docId = doc.id;
                rows.children = doc.children;
                for (var key in doc.items) {
                  let items = doc.items[key];
                  rows[key] = items.value;
                }
                if(doc.isSum) {
                  rows.isSum = doc.isSum;
                }
                tds.push(rows);
              });
              this.tableData = tds;
              console.log("this.tableData--->",this.tableData);
            }else {
              this.tableData = []
            }
          }
        }
      );
    },

    //清空选择
    toggleSelection(){
      this.$refs.multipleTable.clearSelection();
    },

    handleSelectionChange(val) {
      if(this.isView) { //视图选择框
        if(val.length>0 && val[0]!=undefined) {
          let select='';
          for(let i=0; i<val.length; i++) {
            select += val[i].docId + ";";
          }
          let params = {
            linkType: "00",
            appId: this.$root.appid,
            actionContent: val[0].formId,
            _select:select,
            viewId: this.view.id,
          }
          this.$emit("updateViewData", params, val);
        }
      }else {
        let docIds = [];
        let hasChildren = ''
        if(val.length>0) {
          for(let i=0; i<val.length; i++) {
            docIds.push(val[i].docId);
            if(val[i].children) {
              hasChildren = true;
            }
          }
        }else {
          docIds = [];
        }
        this.$emit("getDocIds",docIds,hasChildren);
      }
      
      
    },

    onSearch(searchData, data) {
      let page = 1;
      let size = '';
      this.searchExcelData = data;
      this.getData(page, size, searchData)
      // this.$parent.initView({
      //   appId: this.openParams.appId,
      //   viewId: this.openParams.actionContent,
      //   data: searchData,
      //   exparams: {
      //     currpage: this.currentPage,
      //     lines: this.pagesize
      //   }
      // });
    },

    onPageChang(ev) {
      let page = ev;
      this.getData(page, this.currentPageSize);
      //this.$refs.searchform.onSearchClick();
    },

    onWidgetRowClick(row) {
      if(!this.view.readonly) {
        let params = {
          linkType: "00",
          appId: this.openParams.appId,
          actionContent: row.formId,
          _select:row.docId,
          viewId: this.view.id,
          parentId:this.openParams.parentId?this.openParams.parentId:'',  //包含元素时判断是否有parentId
          isRelate:this.openParams.isRelate?this.openParams.isRelate:'',  //包含元素时判断isRelate是否为true
          searchData:this.searchData,
          showtype:this.showtype,
          templateForm:this.view.templateForm?this.view.templateForm:'',
        };
        params.name = this.view.name,
        this.$emit("event",'view',params);
      }
      
    
    },
    onRowClick(row) {
      console.log("this.view--->",this.view)
      if(!this.view.readonly) {
        let params = {
          linkType: "00",
          appId: this.openParams.appId,
          actionContent: row.formId,
          _select:row.docId,
          viewId: this.view.id,
          parentId:this.openParams.parentId?this.openParams.parentId:'',  //包含元素时判断是否有parentId
          isRelate:this.openParams.isRelate?this.openParams.isRelate:'',  //包含元素时判断isRelate是否为true
          searchData:this.searchData,
          showtype:this.showtype,
          templateForm:this.view.templateForm?this.view.templateForm:'',
        };
        if(this.isView) {
          let arr = [];
          arr.push(row);
          let isRadio = true
          this.$emit("updateViewData", params, arr, isRadio);
        }else if (this.view.openType == 1 && !this.isView) {
          if(this.showtype=='include') {
            this.currentPageParams = params;
            this.$refs.multipleTable.toggleRowExpansion(row);
          }else if(this.showtype == "target"){
            debugger
            let routeData = this.$router.resolve({
              name: "form_blank",
                query: params
              });
            window.open(routeData.href, '_blank');
          }
          else {
            //this.$emit("openNewpage",params); //打开新页面页签
            params.name = this.view.name,
            this.$emit("add-tab", params); //打开普通视图
          }
        } else if (this.view.openType == 277 && !this.isView) {
          if(this.showtype == "include") {
            this.$parent.openForm(params);
          }else {
            params.type = 277;
            this.$parent.openForm(params);
          }
        }else if (this.view.openType == 288 && !this.isView) {
          this.$refs.dialog.show(params);
        }
      }
      
    },


    viewFieldPath(value, field) {
      if(value && field == 'ImageUploadField') {
        // let arr = JSON.parse(value);
        let name = value.path;
        // if(arr && arr.length > 0) {
        //   for(let i=0; i<arr.length; i++) {
        //     name += arr[i].path + ';';
        //   }
        // }
        name = name.replace(/^(\s|;)+|(\s|;)+$/g, '');
        return name;
      }else if(value && field == 'AttachmentUploadField') {
        let arr = JSON.parse(value);
        let name = '';
        if(arr && arr.length > 0) {
          for(let i=0; i<arr.length; i++) {
            name += arr[i].name + ';';
          }
        }
        name = name.replace(/^(\s|;)+|(\s|;)+$/g, '');
        return name;
      }
    
        
      
    },
    /*number  需要保留小数的数
      fractionDigits 保留小数位数
    */
    toFixed(number, fractionDigits) {
      let times = Math.pow(10, fractionDigits);
      let roundNum = Math.round(number * times) / times;
      let currentVal = roundNum.toFixed(fractionDigits)
      if(fractionDigits == "5") {
        let num = (roundNum || 0).toString();
        let result = '';
        while(num.length > 3) {
          result = "," + num.slice(-3) + result;
          num = num.slice(0, num.length - 3);
        }
        if(result) {
          result = num + result + '.' + currentVal.split('.')[1];
          return result;
        }else {
          return currentVal;
        }
      }else {
        return currentVal;
      }
      
      
    },
    /* number：要格式化的数字
    * decimals：保留几位小数 默认0位
    * currency：货币类型
    * decPoint：小数点符号 默认.
    * thousandsSep：千分位符号 默认为,
    */
    currencyChange(number, decimals,currency,decPoint = '.',thousandsSep = ',') {
      number = (number + "").replace(/[^0-9+-Ee.]/g, "");
      let n = !isFinite(+number) ? 0 : +number;
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      let sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
      let dec = typeof decPoint === "undefined" ? "." : decPoint;
      let s = "";
      let symbol;
      if(currency =="zh_CN"){
        symbol = "￥"
      }else if(currency =="en_US"){
        symbol = "$"
      }else if(currency =="en_GB"){
        symbol = "£"
      }else if(currency =="ja_JP"){
        symbol = "￥"
      }else{
        symbol = ""
      }
      let toFixedFix = function(n, prec) {
        let k = Math.pow(10, prec);
        return "" + Math.ceil(n * k) / k;
      };
      s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
      let re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }
      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      return symbol+s.join(dec);
    }


  },
  filters: {
    viewFieldPath: function(value, field) {
      debugger
      if(value) {
        let arr = JSON.parse(value);
        let name = '';
        if(arr && arr.length > 0) {
          for(let i=0; i<arr.length; i++) {
            name += arr[i].path + ';';
          }
        }
        name = name.replace(/^(\s|;)+|(\s|;)+$/g, '');
        return name;
      }
    }
  }
};
</script>
<style lang="scss">

/* 根据条件隐藏多选框 */
.mycell.el-checkbox__input {
  display: none;
}
.el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #edf2fc;
    border-color: #DCDFE6;
    cursor: not-allowed;
    display: none;
}
.checked-all {
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #edf2fc;
    border-color: #DCDFE6;
    cursor: not-allowed;
    display: inline-block;
  }
}
   
</style>