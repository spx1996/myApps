<template>
  <div class="view-gridview">
    <div class="act-btns">
      <activity 
        v-for="activity in view.activities" 
        :key="activity.id" 
        :info="activity" 
        @action="onAction"
      />
    </div>
    <el-divider></el-divider>
    <div class="listview-box">
      <form_searchform
        :appId="openParams.appId"
        :viewId="openParams.actionContent"
        @onSearch="onSearch"
        ref="searchform"
      />
      <el-table 
        v-if="view.columns && view.columns.length>0" 
        :data="tableData" 
        style="width: 100%"
      >
        <el-table-column type="selection" ></el-table-column>
        <template v-for="column in view.columns">
          <el-table-column
            :key="column.id"
            :prop="column.id"
            :label="column.name"
            :width="column.width"
          >
            <template slot-scope="scope">
              <template v-if="status[scope.row.docId]==1">
                <!-- <component 
                  name="rowformTemplate" 
                  :is="rowdatas[scope.row.docId].component"
                >
                </component> -->
                <component 
                  name="rowformTemplate" 
                  :is="scope.row[column.id][1]"
                >
                </component>
                <!-- {{column.control.component}} -->
              </template>
              <template v-else>{{scope.row[column.id][0]}}</template>
            </template>
          </el-table-column>
        </template>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="status[scope.row.docId]!=1"
              @click="doEdit(scope.row, view.columns, scope.$index)"
              type="text"
              size="small"
            >编辑</el-button>
            <el-button
              v-if="status[scope.row.docId]==1"
              @click="doConfirm(scope.row, view.columns)"
              type="text"
              size="small"
            >确认</el-button>
            <el-button
              v-if="status[scope.row.docId]!=1"
              @click="doRemove(scope.row, scope.$index)"
              type="text"
              size="small"
            >删除</el-button>
            <el-button
              v-if="status[scope.row.docId]==1"
              @click="doCancel(scope.row)"
              type="text"
              size="small"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <mdialog ref="dialog" width="90%" />
    </div>
    <div class="page">
      <div class="page-con">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="row_count"
          :page-size="pagesize"
          :current-page.sync="currentPage"
          @current-change="onPageChang($event)"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import form_searchform from "@/components/form_searchform.vue";
import activity from "@/components/activity.vue";
import mdialog from "@/components/dialog.vue";
import API from "@/api.js";
import Constant from "@/Constant.js";
export default {
  name: "view-gridview",
  props: [
    "openParams",
    "view",
    "showtype"
  ],
  components: {
    form_searchform,
    activity,
    mdialog
  },
  data: function() {
    return {
      rowdatas: {},
      status: {}, //存放编辑状态
      currentPage: 1,
      tableData:[],
      row_count:0,
      dataList:[],
      formdata:'',
      newBuild:'',
      currentFormData:[],
    };
  },
  computed: {
    // view() {
    //   return this.$parent.view;
    // },
    // tableData() {
    //   let docs =
    //     this.view.data && this.view.data.data ? this.view.data.data : undefined;
    //   let tds = [];
    //   if (docs)
    //     docs.forEach(doc => {
    //       let rows = {};
    //       rows.formId = doc.formId;
    //       rows.docId = doc.id;
    //       for (var key in doc.items) {
    //         let items = doc.items[key];
    //         rows[key] = items.value;
    //       }
    //       tds.push(rows);
    //     });
    //   return tds;
    // }
    pagesize() {
      return this.view.data ? this.view.data.page_lines : 0;
    }
  },
  mounted() {
    this.getData(); 
  },
  methods: {
    getData(page) {
      this.getViewData(page).then(response => {
        let docs = response.data.data;
        this.dataList = response.data.data;
        this.row_count = response.data.row_count;
        let tds = [];
        if (docs)
          docs.forEach((doc, index) => {
            let rows = {};
            let newBuild = {};
            rows.formId = doc.formId;
            rows.docId = doc.id;
            newBuild.formId = doc.formId;
            newBuild.docId = doc.id;
            for (var key in doc.items) {
              let items = doc.items[key];
              //rows[key] = items.value;
              rows[key] = [];
              rows[key].push(items.value);
              newBuild[key] = [];
              newBuild[key].push("");
            }
            this.newBuild = newBuild;
            tds.push(rows);
          });
          this.tableData = tds;
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

    onPageChang(ev) {
      let page = ev;
      this.getData(page);
      //this.$refs.searchform.onSearchClick();
    },


    onSearch(searchData) {
      this.$parent.initView({
        appId: this.openParams.appId,
        viewId: this.openParams.actionContent,
        data: searchData,
        exparams: {
          currpage: this.currentPage,
          lines: this.pagesize
        }
      });
    },

    callback() {
      console.log("callback------gridview------>",)
    },

    //进入编辑状态
    doEdit(row, column, index) {
      API.getForm(
        this.openParams.appId,
        row.formId,
        row.docId,
        {},
        {
          onSucess: response => {
            // let fields = response.data.data.fields;
            // let formdata = response.data.data;
            // this.formdata = formdata;
            let fields, formdata;
            console.log("row---33------>", row);
            if(row.data) {
              fields = row.data.fields;
              formdata = row.data;
              this.formdata = formdata;
            }else {
              fields = response.data.data.fields;
              formdata = response.data.data;
              this.formdata = formdata;
            }
            let docId = ''
            for(let item in row) {
              for(let i=0; i<column.length; i++) {
                if(item == column[i].id){
                  
                  //this.view.columns[i].control = formdata;
                  let controlName = row.docId + "_" + column[i].fieldName
                  fields.forEach(fld => {
                    let template = "";
                    if (fld.formField == "InputField") {
                      template = "<div><o-input id='" + fld.id + "'></o-input></div>"
                    } else if (fld.formField == "RadioField") {
                      template = "<div><o-radio id='" + fld.id + "'></o-radio></div>";
                    } else if (fld.formField == "SelectField") {
                      template = "<div><o-select id='" + fld.id + "'></o-select></div>";
                    }else if (fld.formField == "IncludeField") {
                      template = "<div><o-include id='" + fld.id + "'></o-include></div>";
                    }else if (fld.formField == "TextareaField") {
                      template = "<div><o-textarea id='" + fld.id + "'></o-textarea></div>";
                    }else if (fld.formField == "DateField") {
                      template = "<div><o-date-picker id='" + fld.id + "'></o-date-picker></div>";
                    }
                    if(fld.formField != "IncludeField") {
                      if(controlName == fld.id ) {
                        let temp = {
                          methods: {
                            findField(controlName) {
                              if (controlName == fld.id) {
                                return fld;
                              }
                              return {
                                id: fld.id,
                                displayType: Constant.PermissionType_HIDDEN,
                                hiddenValue: ""
                              };
                            },
                            callback: this.callback,
                          },
                          template: template
                        };
                        //this.tableData[index][item].push(temp);
                        if(!this.tableData[index][item][1]) {
                          this.tableData[index][item][1] = temp;
                        }
                        
                      }
                    }
                  });
                }
              }
            }
            //this.$set(this.rowdatas, row.docId, formdata);
            // fields.forEach(fld => {
            //   let template = "";
            //   if (fld.formField == "InputField") {
            //     template = "<div><o-input id='" + fld.id + "'></o-input></div>";
            //     // this.rowdatas[row.docId].component = {
            //     //   methods: {
            //     //     findField() {
            //     //       for (let i = 0; i < fields.length; i++) {
            //     //         let fld = fields[i];
            //     //           return fld;
            //     //       }
            //     //       //TODO:临时处理隐藏字段--Jarod
            //     //       return {
            //     //         id: fields[0].id,
            //     //         displayType: Constant.PermissionType_HIDDEN,
            //     //         hiddenValue: ""
            //     //       };
            //     //     }
            //     //   },
            //     //   template: template
            //     // };
            //   } else if (fld.formField == "RadioField") {
            //     template = "<div><o-radio id='" + fld.id + "'></o-radio></div>";
            //   } else if (fld.formField == "SelectField") {
            //     template = "<div><o-select id='" + fld.id + "'></o-select></div>";
            //     // this.rowdatas[row.docId].component = {
            //     //   methods: {
            //     //     findField() {
            //     //       for (let i = 0; i < fields.length; i++) {
            //     //         let fld = fields[1];
            //     //           return fld;
            //     //       }
            //     //       return {
            //     //         id: fields[1].id,
            //     //         displayType: Constant.PermissionType_HIDDEN,
            //     //         hiddenValue: ""
            //     //       };
            //     //     }
            //     //   },
            //     //   template: template
            //     // };
            //   }else if (fld.formField == "IncludeField") {
            //     template = "<div><o-include id='" + fld.id + "'></o-include></div>";
            //   }
            //   if(fld.formField != "IncludeField") {
            //     this.rowdatas[row.docId].component = {
            //       methods: {
            //         findField(id) {
            //           for (let i = 0; i < fields.length; i++) {
            //             let fld = fields[i];
            //             if (id == fld.id) {
            //               return fld;
            //             }
            //           }
            //           return {
            //             id: id,
            //             displayType: Constant.PermissionType_HIDDEN,
            //             hiddenValue: ""
            //           };
            //         }
            //       },
            //       template: template
            //     };
            //   }
            // });

            this.$set(this.status, row.docId, 1);
          }
        }
      );
    },


     //执行脚本前
    runBeforeAction(act){
      let formData = {
        docId: "",
        document: {},
        formId: this.view.relatedForm,
        parentId: "",
        templateForm: this.view.templateForm,
        viewId: this.openParams.actionContent,
        _selects: [],
      }
      let divId = act.id;
      this.$api.runBeforeActionScript(this.$root.appid, divId, formData,act.type, {
        onSucess: response => {
          if(response.data.errcode == 0 && response.data.data) {
            Toast(response.data.data.content);
          }else if(response.data.errcode == 0){
            if(act.type == 2){
              this.doCreate(act);
            }else{
              this.getTemplate(act);
            }
          }
        }
      });
    },

    // doCreate(act) {
    //   console.log("act---->",act);
    // },



    onAction(act) {
      //绑定视图的处理事件
      let activityType = act.type;
      switch (act.type) {
        case 1: //载入视图
          this.runBeforeAction(act);
          break;
        case 2: //创建
          this.runBeforeAction(act);
          break;
        case 3: //删除
          this.doRemove(act);
          break;
        case 4: //保存并启动流程
          break;
        case 5: //流程处理
          this.$parent.flowHandle();
          break;
        case 8: //关闭窗口
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 10: //返回
          this.doBack();
          //this.$parent.goBack();
          break;
        case 11: //保存并返回
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 13: //无
          break;
        case 14: //网页打印(表单)
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 15: //网页打印含历史
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 16: //导出excel
          break;
        case 19: //保存草稿不校检
          //this.$parent.saveDraft();
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 18: //清空所有数据
          break;
        case 20: //批量提交
          this.showSubmitPanel(act);
          break;
        case 21: //保存并复制
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 25: //PDF导出
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 26: //文件下载
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 27: //导入excel
          break;
        case 28: //电子签章
          break;
        case 29: //批量签章
          break;
        case 33: //流程启动
          break;
        case 34: //保存
          //this.$parent.doSave();
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 36: //网页打印(视图)
          break;
        case 37: //邮件短信分享
          break;
        case 42: //保存并新建
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 43: //跳转
          break;
        case 45: //归档
          this.$parent.runBeforeAction(act.id, "", "", activityType);
          break;
        case 46: //签章
          break;
        case 47: //回退流程
          break;
        case 48: //催办流程
          break;
        case 49: //挂起流程
          break;
        case 50: //恢复流程
          break;
        case 51: //回撤流程
          break;
        case 52: //终止流程
          break;
        case 53: //编辑流程审批人
          break;
        case 54: //调整流程
          break;
        case 55: //点评
          break;
        case 56: //补签
          break;
        case 57: //加签主办
          break;
        case 58: //加签协办
        default:
          break;
      }
    },

    checkData(value) {
      if(value) {
        let data = this.buildFormData();
        return data; 
      } 
    },

    buildFormData() {
      let items = {};
      
      for (let i = 0; i < this.formdata.fields.length; i++) {
        let fld = this.formdata.fields[i];
        //items[fld.name] = fld.value;
        if (
          fld.name &&
          fld.value != undefined &&
          fld.formField != "ButtonField" && 
          fld.displayType != undefined
        ) {
          if(fld.textType =="hidden" && fld.value) {
            items[fld.name] = fld.value;
          }else if(fld.textType !="hidden"){
            items[fld.name] = fld.value;
          }
        }
        
      }
      return {
        applicationId: this.openParams.appId,
        formId: this.formdata.fields[0].formId,
        id: this.formdata.fields[0].docId,
        items: items,
        parentId: "",
        sign: "",
        subDocuments: [],
        versions: "0"
      };
    },

    //确定记录
    doConfirm(row, column) {
      if(this.showtype && this.showtype == 'include') {
        let appId = this.$root.appid,
          id = this.openParams.parentId,
          jsonData = this.buildFormData();
        this.$api.setGridView(appId, id, jsonData, {
          onSucess: response => {
            if(response.data.errcode == 0) {
              this.$set(this.status, row.docId, 0);
            }
          }
        })
      }else {
        for(let i=0; i<this.formdata.fields.length; i++) {
          for(let j=0; j<column.length; j++) {
            if(column[j].fieldId == this.formdata.fields[i].divId) {
              row[column[j].id][0] = this.formdata.fields[i].value
              this.$set(this.status, row.docId, 0);
            }
          }
        }

        /*
          下面那些实在没办法，先这样写了。
        */
        row.data = this.formdata;
        console.log("row---------->",row);
        let obj = {
          docId: row.docId,
          data: this.formdata,
        }
        this.currentFormData.push(obj);
        //this.refresh()
        //let fieldId = this.$root.appid;
      }
      
    },

     refresh(fieldId) {
      //刷新方法
      let fd = this.buildFormData();
      let data = {
        document: fd,
        formId: this.view.relatedForm,
        docId: fd.id,
        parentId: "",
        templateForm: "",
        viewId: "",
        applicationId: fd.applicationId,
        id: fd.id
      };
      API.refreshForm(fieldId, data, {
        onSucess: response => {
          let fields = response.data.data;
          let keys = Object.keys(fields);
          keys.forEach(key => {
            let field = fields[key];
            // console.log("field",field);
            this.formdata.fields.forEach((f, i) => {
              if (field.id == f.id) {
                this.formdata.fields[i].value = field.value;//只能更新value，而不能简单做对象替换，field.value绑定在组件v-model上，如果直接替换只是数组内存指针简单变更
                this.formdata.fields[i].options = field.options;
                this.formdata.fields[i].tabs = field.tabs;
                //如果为选择类型field，则options也要在这里替换.....
                this.formdata.fields[i].displayType = field.displayType;
              }
            });
          });
          
        }
      });
      // echo(event, result)
    },





    //取消记录
    doCancel(row) {
      this.$set(this.status, row.docId, 0);
    },
    //新建记录
    doCreate() {
      API.getDocumentEmpty(
        this.openParams.appId,
        this.view.relatedForm,
        {},
        {
          onSucess: response => {
            // this.view.data.data.push({
            //   formId: this.view.relatedForm,
            //   id: response.data.data.id,
            //   items: {}
            // });
            

            let rows = {};
            rows.formId = this.view.relatedForm;
            rows.docId = response.data.data.id;
            
            // for (var key in response.data.data.items) {
            //   let items = response.data.data.items[key];
            //   rows[key] = items.value;
            // }
            // this.tableData.unshift(row);
            let obj = JSON.parse(JSON.stringify(this.newBuild))
            obj.docId = rows.docId;
            //this.tableData.unshift(this.newBuild);
            this.tableData.push(obj);
            let index = this.tableData.length-1;
            this.doEdit(obj, this.view.columns, index);



            // //转变编辑状态
            // this.doEdit({
            //   formId: this.view.relatedForm,
            //   docId: response.data.data.id
            // });
          }
        }
      );
    },
    //删除记录
    doRemove(row, index) {
      // let i = -1;
      // this.view.data.data.forEach((doc, index) => {
      //   if (doc.id == row.docId) i = index;
      // });
      // this.view.data.data.splice(i, 1);
      this.tableData.splice(index,1);
    }
  }
};
</script>