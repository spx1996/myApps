<template>
  <div class="box">
    <component :is="template">
    <el-tabs :tab-position="tabPosition" style="height: 500px;">

      <!--个人设置-->
      <el-tab-pane label="个人设置">
        <fieldset style="border:1px dashed #d8d8d8;margin: 10px 5px 10px 5px;">
          <legend style="color:#828282;border:0px;background-color:white;">基本信息</legend>
          <label>用户名称:</label>
          <el-input v-model="input"></el-input>
          <label for>账号:</label>
          <el-input v-model="number"></el-input>
          <br />
          <label for>电子邮箱:</label>
          <el-input v-model="e_mail"></el-input>
          <label for>手机:</label>
          <el-input v-model="cellphone"></el-input>
        </fieldset>
        <fieldset style="border:1px dashed #d8d8d8;margin: 10px 5px 10px 5px;">
          <legend style="color:#828282;border:0px;background-color:white;">修改密码</legend>
          <label for>原密码:</label>
          <el-input v-model="password" type="password"></el-input>
          <br />
          <label for>新密码:</label>
          <el-input v-model="newpassword" type="password"></el-input>
          <br />
          <label for>确认密码:</label>
          <el-input v-model="affirm" type="password"></el-input>
        </fieldset>
        <div class="saveChange">
          <div class="exitbtn">
            <el-button type="success" @click="UserSetups">应用</el-button>
          </div>
        </div>
        <el-dialog title="成功" :visible.sync="Successfulpopup" width="30%">
          <span>基本信息保存成功</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="Successfulpopup = false">取 消</el-button>
            <el-button type="primary" @click="Successfulpopup = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="失败" :visible.sync="failurepopup" width="30%">
          <span>基本信息保存失败</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="failurepopup = false">取 消</el-button>
            <el-button type="primary" @click="failurepopup = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>

      <!--皮肤样式-->
      <el-tab-pane label="皮肤样式">
        <div>
          <table class="table_noborder" width="100%" style="margin-top: 15px;">
            <tbody>
              <tr class="selectSkin">
                <td align="center">
                  <div class="personSetSkin" style="float:left">
                    <div @click="addSkin">
                      <img src="/preview-good.gif" alt class="addImg" />
                      <div class="focusImg" style="display: block;">
                        <img src="/obpm/resource/images/iconfont-zhuangtai.gif" v-show=" showAttr" />
                      </div>
                    </div>
                    <span class="skinLabel">
                      <input
                        type="radio"
                        name="content.userSkin"
                        value="good"
                        style="display:none;"
                        checked="checked"
                      />
                      <span>good</span>
                    </span>
                  </div>

                  <div class="personSetSkin" style="float:left">
                    <div @click="addModality">
                      <img src="/preview-H5.gif" alt class="addImg" />
                      <div class="focusImg">
                        <img src="/obpm/resource/images/iconfont-zhuangtai.gif" v-show="showReveal" />
                      </div>
                    </div>
                    <span class="skinLabel">
                      <input type="radio" name="content.userSkin" value="H5" style="display:none;" />
                      <span>默认</span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="skinkung">
            <div class="skinright">
              <el-button type="success" @click="Userskin">应用</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!--代理设置-->
      <el-tab-pane label="代理设置">
        <div class="agency-container">
          <div class="agency-header">
            <span>流程代理:</span>
            <b class="agency-b">软件:</b>
            <el-radio v-model="radio" label="1">2.0功能实例</el-radio>
          </div>
          <div class="agency-middle">
            <div class="agency-left">
              <el-button type="primary" @click="construction">新建</el-button>
              <el-dialog title="新建流程代理信息" :visible.sync="centerDialogVisible" width="40%" center>
                <el-dialog width="30%" title="代理设置已保存" :visible.sync="innerVisible" append-to-body>
                  <el-button @click="innerVisible = false">取 消</el-button>
                  <el-button @click="innerAgencyVisible">确定</el-button>
                </el-dialog>
                <div class="agency-dialog-content">
                  <label for>代理模式:</label>
                  <el-radio-group v-model="radio2" @change="change">
                    <el-radio :label="1">代理软件下单一流程</el-radio>
                    <el-radio :label="2">代理软件下所有流程</el-radio>
                    <br />
                    <el-select v-model="value" placeholder="请选择" v-if="radio2!==2">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-radio-group>
                  <br />
                  <label for>授权:</label>
                  <el-input v-model="dialogInput"></el-input>
                  <el-button>选择</el-button>
                  <br />
                  <label for>代理开始日期:</label>
                  <el-date-picker v-model="picker1" type="date" placeholder="选择日期"></el-date-picker>
                  <br />
                  <label for>代理结束日期:</label>
                  <el-date-picker v-model="picker2" type="date" placeholder="选择日期"></el-date-picker>
                  <br />
                  <label for>状态:</label>
                  <el-radio v-model="radioDialog" label="1">激活</el-radio>
                  <el-radio v-model="radioDialog" label="2">禁用</el-radio>
                  <br />
                  <label for class="Dialog-label">描述:</label>
                  <el-input
                    class="Dialog-textarea"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="textarea"
                  ></el-input>
                </div>
                <!-- <el-button type="primary" class="agency-dialog-button" @click="centerDialog">保存</el-button> -->
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="centerDialog">确 定</el-button>
                </span>
              </el-dialog>
              <el-button type="danger" @click="DELETEusersetups">删除</el-button>
            </div>
            <div class="agency-right">
              <label for>流程名称:</label>
              <el-input v-model="agency" ref="empty"></el-input>
              <el-button>查询</el-button>
              <el-button @click="replacement">重置</el-button>
            </div>
          </div>
        </div>
        <el-table
          ref="Current"
          :data="process"
          tooltip-effect="dark"
          style="width: 100%"
          height="300px"
          @selection-change="handleCurrentChange"
        >
          <el-table-column prop="id" type="selection" width="55"></el-table-column>
          <el-table-column prop="flowName" label="流程名称">
            <!-- <template slot-scope="scope">{{scope.row.flowName}}</template> -->
          </el-table-column>
          <el-table-column prop="proxyMode" label="代理方式"></el-table-column>
          <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="agentsName" label="授权"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="1000"
        ></el-pagination>
        <div class="workHome">
          <div class="workHomeContent">
            <el-button type="success" @click="setCurrent()">应用</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!--通讯录-->
      <el-tab-pane label="通讯录">
        <div class="dendrogram">
          <div
            style="height:30px;line-height:30px;color:#7b8d9d;padding-left: 5px;font-size: 14px;font-weight: 700;border-bottom:1px solid #f0f0f0;"
          >
            <a href="javascript:doviewByGroup('all')" style="color:black;">全部联系人</a>
          </div>
          <el-table :data="linkman" style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column label="删除">
              <template slot-scope="scope">
                <el-button icon="el-icon-delete" @click="removeAction(scope.$index,scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="提示" :visible.sync="RemoveVisibel" width="30%">
            <span>你确定要删除该联系人吗?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="RemoveVisibel = false">取 消</el-button>
              <el-button type="primary" @click="RemoveVisibel = false">确 定</el-button>
            </span>
          </el-dialog>
          <div class="doNewGroup">
            <a href="###" onclick="doNewGroup();">
              <span style="font-size:14px;color:#7a8d9d;" @click="dialogVisible = true">+</span>新建分组
            </a>
          </div>
          <el-dialog
            title="输入分组名称"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
          >
            <span>
              <el-input v-model="contentDialogVisible" placeholder="请输入..." ref="keep"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogensure">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div class="content">
          <div class="content-width">
            <div class="nowrap">
              <el-button type="primary" @click="contentNowrap">添加至分组</el-button>
              <el-dialog title="添加至分组" :visible.sync="AgencyDialogVisible" width="30%" center>
                <span>添加至分组：</span>
                <el-select v-model="valueAgency" placeholder="请选择"></el-select>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="AgencyDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="AgencyDialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>
            </div>
            <div class="nohark">
              <span>用户名称:</span>
              <el-input v-model="nohark" ref="in"></el-input>
              <el-button>查询</el-button>
              <el-button class="nohark_button" @click="reset">重置</el-button>
            </div>
          </div>
          <div class="content-keep">
            <div class="content-box">
              <el-table
                :data="tableData"
                ref="multipleTable"
                tooltip-effect="dark"
                style="width: 100%"
                height="240px"
                row-key="1"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="dept" label="用户名称">
                  <template slot-scope="scope">{{ scope.row.dept }}</template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机"></el-table-column>
                <el-table-column prop="email" label="电子邮箱"></el-table-column>
              </el-table>
            </div>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100"
              :page-size="pageSize"
              :pageNom="pageNom"
            ></el-pagination>
            <div class="saveChange">
              <div class="exitbtn">
                <el-button type="success" @click="toggleSelection()">应用</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    </component>
  </div>
</template>
<script>
import axios from "axios";
import { URLSearchParams } from "url";

export default {
  name: "personal",
  data() {
    return {
      tabPosition: "left",
      input: "",
      number: "",
      e_mail: "",
      cellphone: "",
      password: "",
      newpassword: "",
      nohark: "",
      contentDialogVisible: "",
      agency: "",
      dialogInput: "",
      textarea: "",
      valueAgency: "",
      radio2: "1",
      radioDialog: "1",
      pageSize: 10,
      pageNom: 1,
      Successfulpopup: false,
      failurepopup: false,
      showAttr: false,
      showReveal: false,
      showCreateGroupDiv: false,
      dialogVisible: false,
      centerDialogVisible: false,
      Agencydialog: false,
      innerVisible: false,
      AgencyDialogVisible: false,
      RemoveVisibel: false,
      value: "",
      picker1: "",
      picker2: "",
      inputNull: [],
      tableData: [],
      multipleSelection: [],
      process: [],
      currentRow: [],
      selectedIDs: [],
      options: [
        {
          value: "选项1",
          label: "并行聚合自动节点"
        },
        {
          value: "选项2",
          label: "并行非聚合自动节点"
        },
        {
          value: "选项3",
          label: "主流程"
        },
        {
          value: "选项4",
          label: "允许前台手动修改流程"
        },
        {
          value: "选项5",
          label: "到达时触发通知"
        },
        {
          value: "选项6",
          label: "加签主办人"
        },
        {
          value: "选项7",
          label: "加签协办人"
        },
        {
          value: "选项8",
          label: "发文_并行不选中"
        },
        {
          value: "选项9",
          label: "发文_并行选中"
        },
        {
          value: "选项10",
          label: "发文_并行选中锁定"
        },
        {
          value: "选项11",
          label: "发文流程_聚合"
        },
        {
          value: "选项12",
          label: "发文流程_非聚合"
        },
        {
          value: "选项13",
          label: "发起人上级部门"
        },
        {
          value: "选项14",
          label: "子流程"
        }
      ],
      linkman: [
        {
          name: "王小虎"
        },
        {
          name: "马小龙"
        },
        {
          name: "张小狼"
        }
      ]
    };
  },
  created() {
    this.Userskin();
    this.UserSetups();
    this.ContentBox();
    this.centerDialog();
    this.dialogensure();
    this.proxys();
    this.DELETEusersetups();
    this.contacts();
  },
  methods: {
    //伪删除
    removeAction(index) {
      this.RemoveVisibel = true;
      this.linkman.splice(index, 1);
    },
    construction() {
      this.centerDialogVisible = true;
      this.innerVisible = false;
    },
    setCurrent(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.Current.toggleRowSelection(row);
        });
      } else {
        this.$refs.Current.clearSelection();
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      let ids = [];
      this.currentRow.map(item => {
        ids.push(item.id);
      });
      this.selectedIDs = ids;
      console.log("多选", this.selectedIDs);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    innerAgencyVisible() {
      this.innerVisible = false;
      this.centerDialogVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    contentNowrap() {
      if (this.multipleSelection.length == 0) {
        alert("请至少选择一个用户！");
      } else {
        this.AgencyDialogVisible = !this.AgencyDialogVisible;
      }
    },
    replacement() {
      this.agency = "";
    },
    reset() {
      this.$refs.in.value = "";
    },
    dialogVisible() {
      let Data = this.contentDialogVisible;
      this.inputNull = Data;
    },
    addSkin() {
      if (this.showAttr == true) {
        this.showAttr = false;
      } else {
        this.showAttr = true;
        this.showReveal = false;
      }
    },
    addModality() {
      if (this.showReveal == true) {
        this.sshowReveal = false;
      } else {
        this.showReveal = true;
        this.showAttr = false;
      }
    },
    // 通讯录新建分组新增数据
    dialogensure() {
      // axios({
      //   url: "obpm" + "/portal/workflow/runtime/proxy/save.action",
      //   method: "post",
      //   data: {
      //     id: "qcNaUonpwa7e2EXWeqx",
      //     domain: "3CffNlgt9B9StIjIUPB",
      //     name: this.contentDialogVisible
      //   }
      // })
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
      this.dialogVisible = false;
    },
    // 获取通讯录分组
    contacts() {
      // axios({
      //   url: "obpm" + "/runtime/users/selectbox/contacts/group",
      //   method: "get"
      // })
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
    // 删除代理
    DELETEusersetups() {
      axios({
        url: "obpm" + "/runtime/HdPeBqYwJyFyjHkhZu3/usersetups/proxys",
        method: "delete",
        data: this.selectedIDs
      })
        .then(res => {
          if (res.status == 200) {
            this.proxys();
          }
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 保存代理信息
    centerDialog() {
      axios({
        url: "obpm" + "/runtime/HdPeBqYwJyFyjHkhZu3/usersetups/proxys/save",
        method: "post",
        data: {
          proxyMode: this.radio2,
          flowName: this.value,
          agentsName: this.dialogInput,
          startProxyTime: this.picker1,
          endProxyTime: this.picker2,
          state: this.radioDialog,
          description: this.textarea
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.proxys();
          }
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
      this.innerVisible = !this.innerVisible;
      this.value = "";
      this.dialogInput = "";
      this.picker1 = "";
      this.picker2 = "";
      this.textarea = "";
    },
    // 获取代理列表
    proxys() {
      axios({
        url: "obpm" + "/runtime/HdPeBqYwJyFyjHkhZu3/usersetups/proxys",
        method: "get"
      })
        .then(res => {
          let newData = res.data.data.datas.map(item => {
            return {
              id: item.id,
              flowName: item.flowName,
              proxyMode: item.proxyMode,
              description: item.description,
              agentsName: item.agentsName,
              state: item.state
            };
          });
          this.process = newData;
          console.log(newData);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 请求通讯录里面要渲染的数据
    ContentBox() {
      axios({
        url: "obpm" + "/runtime/users/selectbox/contacts",
        method: "get",
        params: {
          contactsId: "",
          pageSize: this.pageSize,
          pageNom: this.pageNom
        }
      })
        .then(res => {
          let newData = res.data.data.datas.map(item => {
            return {
              dept: item.dept,
              mobile: item.mobile,
              email: item.email
            };
          });
          this.tableData = newData;
          // console.log(newData);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 这是皮肤样式的请求
    Userskin() {
      axios({
        url: "obpm" + "/runtime/users/skin",
        method: "post",
        data: {
          skin: "H5"
        }
      })
        .then(res => {
          if (res.status == 200) {
            alert("H5样式皮肤设置成功!");
            window.location = "http://localhost:8080/obpm/portal/H5/main.jsp";
          }
          console.log(res.status);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 这是个人基本信息的请求
    UserSetups() {
      axios({
        url: "obpm" + "/runtime/usersetups/detail",
        method: "post",
        data: {
          name: this.input,
          email: this.e_mail,
          telephone: this.cellphone
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.Successfulpopup = !this.Successfulpopup;
          } else {
            this.failurepopup = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss"  scoped>
legend {
  display: block;
  font-size: 12px;
}
label {
  font-family: Arial, Vendera, Tahoma;
  color: #999999;
  width: 100px;
  text-align: right;
}
.el-input {
  width: 200px;
  height: 40px;
  margin-left: 10px;
  margin-bottom: 20px;
  border: 0;
}
.saveChange {
  width: 100%;
}
.exitbtn {
  float: right;
}
.personSetSkin {
  position: relative;
}
.focusImg img {
  position: absolute;
  right: 0;
  top: 0;
}
.addImg {
  margin-left: 50px;
  border: 1px solid #cccccc;
  padding: 5px;
}
.skinLabel span {
  display: block;
  text-align: center;
  margin-left: 50px;
  margin-top: 5px;
}
.skinkung {
  width: 100%;
}
.skinright {
  float: right;
  margin-top: 200px;
}
.dendrogram {
  float: left;
  width: 200px;
  height: 500px;
}
.createGroupDiv {
  width: 100%;
  height: 30px;
  overflow: hidden;
}
.createGroupDiv a {
  float: left;
  width: 150px;
  height: 100%;
  overflow: hidden;
}
.more_btn {
  float: right;
  width: 50px;
  height: 100%;
}
.more_rename {
  float: left;
  width: 25px;
  height: 100%;
}
.more_delete {
  float: left;
  width: 25px;
  height: 100%;
}
.content {
  float: right;
  width: 750px;
  min-height: 400px;
  overflow: hidden;
}
.content-width {
  width: 100%;
  height: 40px;
}
.nowrap {
  float: left;
  width: 300px;
  height: 40px;
}
.nohark {
  float: right;
  width: 450px;
  height: 40px;
}
.nohark .el-button {
  background: #cccccc;
  margin-left: 5px;
}
.nohark .nohark_button {
  background: white;
}
.content-keep {
  width: 100%;
  height: 500px;
}
.content-box {
  width: 100%;
  /* height: 380px; */
}
.content-keep .el-table {
  margin-top: 20px;
}
.saveChange {
  width: 100%;
  overflow: hidden;
}
.exitbtn {
  float: right;
  /* margin-top: 150px; */
}
.agency-container {
  width: 100%;
  height: 100%;
  background: white;
}
.agency-header {
  width: 100%;
  height: 30px;
}
.agency-header span {
  display: inline-block;
  font-weight: bold;
  font-size: 14px;
  color: black;
}
.agency-header .agency-b {
  display: inline-block;
  margin-left: 10px;
  font-weight: 100;
  font-size: 10px;
  color: black;
}
.agency-header .el-radio {
  line-height: 30px;
  margin-left: 10px;
}
.agency-middle {
  width: 100%;
  height: 50px;
  overflow: hidden;
  .agency-left {
    float: left;
    width: 335px;
    height: 100%;
  }
  .agency-right {
    float: right;
    width: 630px;
    height: 100%;
    .el-button {
      background: whitesmoke;
      margin-left: 5px;
    }
  }
}
.workHome {
  width: 100%;
}
.workHomeContent {
  float: right;
}
.agency-dialog-content {
  min-width: 500px;
  min-height: 300px;
  label {
    width: 100px;
    text-align: right;
  }
  .el-select {
    margin-left: 20px;
  }
  .el-radio {
    margin-left: 20px;
  }
  .el-input {
    margin-left: 20px;
  }
  .el-date-picker {
    margin-left: 20px;
  }
  .Dialog-textarea {
    width: 40%;
    margin-left: 20px;
  }
  .agency-dialog-button {
    margin-left: 300px;
  }
}
</style>


