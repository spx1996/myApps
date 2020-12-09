<template>
  <div class="profile-box">
    <el-tabs :tab-position="tabPosition" class="tab-wraper">
      <!--个人设置-->
      <el-tab-pane label="基本信息">
        <!-- {{information}} -->
        <div class="fieldset-box">
          <fieldset class="basic-info" >
            <legend class="legend">基本信息</legend>
            <label>用户名称:</label>
            <el-input v-model="information.name"></el-input>
            <label for>账号:</label>
            <el-input :disabled="true" v-model="information.loginNo"></el-input>
            <br />
            <label for>电子邮箱:</label>
            <el-input v-model="information.email"></el-input>
            <label for>手机:</label>
            <el-input v-model="information.mobile"></el-input>
          </fieldset>

          <fieldset class="password">
            <legend class="legend">修改密码</legend>
            <label for>原密码:</label>
            <el-input v-model="oldPassword" type="password"></el-input>
            <br />
            <label for>新密码:</label>
            <el-input v-model="newPassword" type="password"></el-input>
            <br />
            <label for>确认密码:</label>
            <el-input v-model="affirmPassword" type="password"></el-input>
          </fieldset>
          <div class="saveChange">
            <div class="exitbtn">
              <el-button type="success" @click="UserSetups">保存</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!--皮肤样式-->
      <!-- <el-tab-pane label="皮肤样式">
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
      </el-tab-pane> -->
      <!--代理设置-->
      <el-tab-pane label="代理设置">
        <div class="agency-container">
          <div class="agency-header">
            <span>流程代理:</span>
            <b class="agency-b">软件:</b>
            <el-radio-group v-model="selectSoftwareId">
              <el-radio v-for="(item,index) in allSoftware" :key="index" :label="item.id">{{item.name}}</el-radio>
            </el-radio-group>
          </div>
          <div class="agency-middle">
            <div class="agency-left">
              <el-button 
                size="medium" 
                type="primary" 
                @click="construction" 
              >
                新建
              </el-button>
              <el-button 
                size="medium" 
                type="danger" 
                @click="DELETEusersetups"
              >
                删除
              </el-button>
            </div>
            <div class="agency-right">
              <label for>流程名称:</label>
              <div class="flow-name">
                <el-input 
                  v-model="agency" 
                  ref="empty"
                ></el-input>
              </div>
              <el-button 
                size="medium" 
                type="primary"
                @click="searchFlow"
              >
                查询
              </el-button>
              <el-button 
                size="medium" 
                type="danger"
                @click="replacement"
              >
                重置
              </el-button>
            </div>
          </div>
          <div class="agency-box">
            <el-scrollbar class="scrollbar">
              <el-table
                ref="Current"
                :data="process"
                tooltip-effect="dark"
                @selection-change="handleCurrentChange"
              >
                <el-table-column prop="id" type="selection" width="55"></el-table-column>
                <el-table-column prop="flowName" label="流程名称"></el-table-column>
                <el-table-column label="代理方式">
                  <template slot-scope="scope">
                    <span v-if="scope.row.proxyMode == 0">指定流程代理</span>
                    <span v-if="scope.row.proxyMode == 1">全部流程代理</span>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="agentsName" label="授权"></el-table-column>
                <el-table-column prop="state" label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.state == '0'">失效</span>
                    <span v-if="scope.row.state == '1'">激活</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <i class="el-icon-edit edit" @click="fountain(scope.row, scope.$index)"></i>
                    <i class="el-icon-delete" @click="deleteFlow(scope.row, scope.$index)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
            <div class="page"> 
              <el-pagination
                background
                layout="total, prev, pager, next,jumper"
                :total="row_count"
                :page-size="10"
                :current-page.sync="currentPage"
                @current-change="handlAgentpaging($event)"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>


      <!--通讯录-->
      <el-tab-pane label="通讯录">
        <div class="address-book">
          <div class="dendrogram">
            <div class="left">
              <a href="###" @click="ContentBox">全部联系人</a>
            </div>
            <div class="doNewGroup">
              <a href="###" @click="setNewGroup()">
                <span class="el-icon-plus"></span>
                新建分组
              </a>
            </div>
            <div class="group-list" v-for="(item, index) in groupList" :key="index">
              <span class="group-left" @click="toPacketData(item)">{{item.name}}</span>
              <span class="group-right">
                <i class="el-icon-edit" @click="setNewGroup(item)"></i>
                <i class="el-icon-delete" @click="deleteGroup(item, index)"></i>
              </span>
            </div>
          </div>
          <div class="content">
            <div class="content-width">
              <div class="agency-left">
                <el-button 
                  size="medium"
                  type="primary"
                  @click="contentNowrap"
                >
                  添加至分组
                </el-button>
                <el-button 
                  v-if="isOneGroup"
                  size="medium"
                  type="danger"
                  @click="moveOutOfGroup"
                >
                  移出分组
                </el-button>
              </div>
              <div class="agency-right">
                <label for>用户名称:</label>
                <div class="flow-name">
                  <el-input 
                    v-model="nohark" 
                    ref="empty"
                  ></el-input>
                </div>
                <el-button 
                  size="medium" 
                  type="primary"
                  @click="inquire"
                >
                  查询
                </el-button>
                <el-button 
                  size="medium" 
                  type="danger"
                  @click="reset"
                >
                  重置
                </el-button>
              </div>
            </div>
            <div class="content-keep">
              <el-scrollbar class="scrollbar">
                <!--通讯录的table表格-->
                <el-table
                  :data="tableData"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  row-key="1"
                  @selection-change="handleGrounpChange"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="name" label="用户名称">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column prop="mobile" label="手机"></el-table-column>
                  <el-table-column prop="email" label="电子邮箱"></el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
            <!--分页器-->
            <div class="page">
              <el-pagination
                background
                layout="total,prev, pager, next,jumper"
                :total="tableDataNum"
                :page-size="pageSize"
                :current-page.sync="pageNum"
                @current-change="Addressbookpaging($event)"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>


    <!--添加代理窗口-->
    <el-dialog 
      title="添加代理" 
      :visible.sync="centerDialogVisible" 
      width="40%" 
      class="new-flow-dialog"
    >
      <div class="dialog-box">
        <el-form :label-position="labelPosition" label-width="145px">
          <el-form-item label="代理模式:">
            <!-- <el-radio v-model="proxyMode" label="0">代理软件下部分流程</el-radio>
            <el-radio v-model="proxyMode" label="1">代理软件下所有流程</el-radio> -->
            <el-radio-group v-model="proxyMode" @change="changeHandler">
              <el-radio label="0">代理软件下部分流程</el-radio>
              <el-radio label="1">代理软件下所有流程</el-radio>
            </el-radio-group>

          </el-form-item>
          <el-form-item label="流程名称:" v-if="proxyMode == '0'">
            <div class="comm">
              <el-input :disabled="true" v-model="flowName"></el-input>
              <el-button class="btn" size="small" @click="showInnerDialog" plain>选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="授权:">
            <div class="comm">
              <el-input :disabled="true" v-model="authorizedUser"></el-input>
              <el-button class="btn" size="small" @click="showUserDialg" plain>选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="代理开始日期:">
            <div class="comm">
              <el-date-picker
                v-model="startDay"
                type="datetime"
                placeholder="">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="代码结束日期:">
            <div class="comm">
              <el-date-picker
                v-model="endDay"
                type="datetime"
                placeholder="">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="状态:">
            <el-radio v-model="state" label="1">激活</el-radio>
            <el-radio v-model="state" label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="描述:">
            <div class="comm">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="description">
              </el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="centerDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!--流程列表-->
    <el-dialog 
      v-if="innerVisible"
      title="选择流程" 
      :visible.sync="innerVisible" 
      width="40%" 
      class="new-flow-dialog"
    >
      <div class="dialog-box">
        <div class="flow-list">
          <el-scrollbar class="scrollbar">
            <el-table
              :data="flowData"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                v-model="checkedFlowId"
                type="selection" 
                width="55">
              </el-table-column>
              <el-table-column 
                prop="name" 
                label="流程名称">
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button 
          size="medium" 
          plain="" 
          @click="innerVisible=false"
        >取消</el-button>
        <el-button 
          size="medium" 
          type="primary" 
          @click="getFlowName"
        >确定</el-button>
      </span>
    </el-dialog>

    <!--用户选择框-->
    <div class="comm-dialog">
      <comm-dialog
        title="选择用户"
        v-if="userVisible"
        :visible.sync="userVisible"
      >
        <form_selectApprover_flowpanel
          slot="body"
          :isProxys="isProxys"
          :saveApproverStatus="saveApproverStatus"
          @action = "selectApprover"
        />
      </comm-dialog>
    </div>

    <!--通讯录新建分组弹窗-->
    <div class="address-book-dialog">
      <comm-dialog
        width="28%"
        :title="currentGroupName"
        v-if="addressBookVisible"
        :visible.sync="addressBookVisible"
      >
        <div slot="body" class="body-box">
          <span>
            分组名称:
          </span>
          <div class="input">
            <el-input v-model="newGroupName" placeholder="请输入..."></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button 
            size="medium" 
            plain="" 
            @click="addressBookVisible=false"
          >取消</el-button>
          <el-button 
            size="medium" 
            type="primary" 
            @click="doNewGroup"
          >确定</el-button>
        </span>
      </comm-dialog>
    </div>

    <!--通讯录添加新的数据到分组-->
    <div class="address-book-dialog">
      <comm-dialog
        width="28%"
        :title="addUserTogroup"
        v-if="AgencyDialogVisible"
        :visible.sync="AgencyDialogVisible"
      >
        <div slot="body" class="body-box">
          <span>
            添加至分组:
          </span>
          <div class="input">
            <el-select v-model="groupValue" placeholder="请选择">
              <el-option
                v-for="(item,index) in groupList"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button 
            size="medium" 
            plain="" 
            @click="AgencyDialogVisible=false"
          >取消</el-button>
          <el-button 
            size="medium" 
            type="primary" 
            @click="addToGroup"
          >确定</el-button>
        </span>
      </comm-dialog>
    </div>

  </div>
</template>
<script>
import form_selectApprover_flowpanel from "@/components/form_selectApprover_flowpanel.vue";
import axios from "axios";
import API from "@/api.js";

export default {
  name: "profile",
  props: ["appid"],
  components: {
    form_selectApprover_flowpanel,
  },
  computed: {
    baseInfoma() {
      return this.$store.state.myProfile;
    }
  },
  data() {
    return {
      currentPage: 1,
      labelPosition:'right',
      startDay: '',
      endDay: '',
      description:'',
      flowName:'',
      selectFlowId:'',
      authorizedUser:'',
      authorizedUserId:'',
      flowData: [],
      checkedFlowId:[],

      information: '',
      tabPosition: "left",
      oldPassword: "",  //
      newPassword: "",
      affirmPassword: "",

      userVisible:false, //用户选择框弹窗
      isProxys:true,
      owner:'',
      proxyMode:'0',
      row_count: 0, //代理设置分页总数

      addressBookVisible:false, //通讯录弹窗
      newGroupName:'',
      groupId:'',
      groupList:[], //通讯录分组列表
      selectGroup:[], //选中的通讯录数据
      groupValue:'',
      nohark: "", //通讯录查询关键字
      isOneGroup:false,
      currentGroupId: '',

      agency: "",
    
      radio: "1",
      pageSize: 10,
      pageNum: 1,
      centerDialogVisible: false,
      innerVisible: false,
      AgencyDialogVisible: false,
      value: "",
      tableData: [],
      tableDataNum: 0,
      multipleSelection: [],
      process: [],
      currentRow: [],
      selectedIDs: [],
      appId: "", //获取到的软件id
      saveApproverStatus:'',
      state:'1',
      currentRowId:'',
      currentGroupName:'',
      addUserTogroup:'',
      allSoftware: [],
      selectSoftwareId:'',
    };
  },
  created() {
    this.baseInfo()
    this.ContentBox();
    this.proxys();
    this.contactsGroup();
    //获取软件列表
    API.GetsoFtwareList({
      onSucess: response => {
        // let newData = response.data.data.applications.map(item => {
        //   if(item.id != 'km' && item.id != 'qm') {
        //     return {
        //       id: item.id
        //     };
        //   }
        // });
        let newData = [];
        response.data.data.applications.forEach(app => {
          if (app.id != "km" && app.id != "pm" && app.id != "qm") {
            newData.push(app);
          }
        });
        this.allSoftware = newData;
        this.selectSoftwareId = this.$root.appid;
      }
    });
  },
  methods: {
    showInnerDialog() {
      let appId = this.$root.appid;
      this.$api.getProxysFlow(
        appId,
        {
          onSucess: res => {
            let flowData = res.data.data;
            let arr = [];
            for(let key in flowData) {
              let obj = {};
              if(key) {
                obj.id = key;
                obj.name = flowData[key];
                arr.push(obj);
              }
            }
            console.log("arr---->",arr);
            this.flowData = arr;
          }
        }
      )
      this.innerVisible = true
    },
    changeHandler() {
      this.state = '1';
    },
    //移出分组
    moveOutOfGroup() {
      if(this.selectGroup.length < 1) {
        this.$message({
          message:'请至少选择一条数据',
          type:'warning'
        })
      }else {
        this.$confirm(`确定要将这${this.selectGroup.length}条数据移出分组？`, '移出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = [];
          for(let i=0; i<this.selectGroup.length; i++) {
            arr.push(this.selectGroup[i].id);
          }
          this.$api.deleteGroupUserList(
            this.currentGroupId,
            arr,
            {
              onSucess: res => {
                if(res.data.errcode == 0) {
                  // this.selectGroup.forEach((item,index) => {

                  //   for(let i=0; i<this.tableData.length; i++) {
                  //     if(item.id == this.tableData[i].id) {
                  //       this.tableData.splice(i, 1);
                  //       i--;
                  //     }
                  //   }
                  // });
                  this.selectGroup = [];
                  this.$api.getAddressBook(
                    {
                      contactsId: this.currentGroupId,
                      userName:this.nohark,
                      pageSize: 10,
                      pageNum: 1,
                    },
                    { 
                      onSucess: response => {
                        this.tableDataNum = response.data.data.rowCount;
                        let newData = response.data.data.datas.map(item => {
                          return {
                            name: item.name,
                            dept: item.dept,
                            mobile: item.mobile,
                            email: item.email,
                            id: item.id,
                            deptId: item.deptId,
                          };
                        });
                        this.tableData = newData;
                      }
                    }
                  )



                  this.$notify({
                    title: '删除成功',
                    message: '',
                    type: 'success'
                  });
                }
              }
            }
          )
        }).catch(() => {

        });
      }

      
    },

    //点击分组展示分组数据
    toPacketData(item) {
      this.selectGroup = [];
      this.isOneGroup = true;
      this.currentGroupId = item.id;
      this.$api.getContact(
        item.id,
        {
          onSucess: res => {
            this.tableData = res.data.data.datas;
            this.tableDataNum = res.data.data.rowCount;
            this.pageNum = 1;
          }
        }
      )
    },
    //通讯录添加新数据到分组
    addToGroup() {
      let arr = [];
      this.selectGroup.forEach(item => {
        arr.push(item.id);
      })
      let id = this.groupValue;
      if(id) {
        this.$api.addDataToGroup(
          id,
          arr,
          {
            onSucess: res => {
              this.AgencyDialogVisible = false;
              this.selectGroup = [];
              this.$refs.multipleTable.clearSelection();
              this.groupValue = '';
              if(res.data.errcode == 0) {
                this.$notify({
                  title: '操作成功',
                  message: '',
                  type: 'success'
                });
              }
            }
          }
        )
      }else {
        this.$message({
          message: "请选择要移到的分组",
          type: 'warning'
        })
      }
      
    },
    //通讯录删除分组
    deleteGroup(item, index) {
      this.$confirm('确定删除该条分组吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = item.id;
        this.$api.deleteGroup(
          id,
          {
            onSucess: res => {
              if(res.data.errcode == 0) {
                this.groupList.splice(index, 1);
                this.$notify({
                  title: '删除成功',
                  message: '',
                  type: 'success'
                });
              }
            }
          }
        )
      }).catch(() => {
                  
      });
    },

    //通讯录新建分组保存
    doNewGroup() {
      if(this.groupId) {
        if(!this.newGroupName) {
          this.$message({
            message: "请输入分组名称",
            type: 'warning'
          });
        }else { 
          this.$api.editContactGroup(
            this.groupId,
            this.newGroupName,
            {
              onSucess: res => {
                let data = res.data.data
                for(let i=0; i<this.groupList.length; i++) {
                  if(this.groupList[i].id == data.id) {
                    this.groupList[i] = data;
                    break;
                  }
                }
                this.addressBookVisible = false;
              }
            }
          )
        }
        
      }else {
        if(!this.newGroupName) {
          this.$message({
            message: "请输入分组名称",
            type: 'warning'
          });
        }else {
          let name = this.newGroupName;
          this.$api.saveContactGroup(
            name,
            {
              onSucess: res => {
                let data = res.data.data;
                this.groupList.push(data);
                this.addressBookVisible = false;
              }
            }
          )
        }
      }
      
    },
    //通讯录新建分组
    setNewGroup(item) {
      if(item) {
        this.currentGroupName = "编辑分组"
        this.newGroupName = item.name
        this.groupId = item.id;
      }else {
        this.currentGroupName = "新建分组"
        this.newGroupName = ''
        this.groupId = '';
      }
      this.addressBookVisible = true;
    },

    //代理设置编辑流程
    fountain(row, index) {
        let id = row.id;
        this.currentRowId = id;
        let appId = this.$root.appid;
        this.$api.editProxysFlow(
          appId,
          id,
          {
            onSucess: res => {
              if(res.data.data) {
                let data = res.data.data;
                this.authorizedUser = data.agentsName;
                this.description = data.description;
                this.startDay = data.startProxyTime;
                this.endDay = data.endProxyTime;
                this.flowName = data.flowName;
                this.owner = data.owner;
                this.state = data.state;
                this.proxyMode = data.proxyMode.toString();
              }
              this.centerDialogVisible = true;
            }
          }
        )
    },

    //代理设置删除流程
    deleteFlow(row, index) {
      this.$confirm('确定删除该条数据吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let appId = this.$root.appid;
        let id = row.id;
        let arrIds = [];
        arrIds.push(id);
        this.$api.deleteProxysFlow(
          appId,
          arrIds,
          {
            onSucess: res => {
              if(res.data.errcode == 0) {
                this.process.splice(index, 1);
                this.$notify({
                  title: '删除成功',
                  message: '',
                  type: 'success'
                });
              }
            }
          }
        )
      }).catch(() => {
                  
      });
    },

    // 删除代理
    DELETEusersetups() {
      if (this.selectedIDs == "") {
        this.$message({
          message: '请至少选择一个!',
          type: 'warning'
        })
      } else {
        this.$confirm(`确定删除这${this.selectedIDs.length}条数据吗?`, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let appId = this.$root.appid;
          let arrIds = this.selectedIDs;
          this.$api.deleteProxysFlow(
            appId,
            arrIds,
            {
              onSucess: res => {
                if(res.data.errcode == 0) {
                  this.$notify({
                    title: '删除成功',
                    message: '',
                    type: 'success'
                  });
                  this.proxys();
                }
              }
            }
          )


        }).catch(() => {
                    
        });



        
      }
    },

    //代理设置查询流程
    searchFlow() {
      let appId = this.$root.appid;
      let jsonData = {
            flowName: this.agency,
            linesPerPage: 10,
            pageNo: 1,
          };
      this.$api.getproxys(
        appId,
        jsonData,
        {
          onSucess: res => {
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
            console.log("this.process--->",this.process);
          }
        }
      )


    },

    //代理设置选择授权用户
    selectApprover(name, id, selectedUsersList) {
      this.userVisible = false;
      this.authorizedUser = name;
      this.authorizedUserId = id;
      let obj = {};
      obj.row = selectedUsersList;
      this.saveApproverStatus = obj;
    },

    //展示用户选择框
    showUserDialg() {
      this.userVisible = true;
    },

    //选择流程弹窗按确定后的数据
    getFlowName() {
      this.flowName = '';
      this.selectFlowId = '';
      if(this.checkedFlowId && this.checkedFlowId.length > 0) {
        this.checkedFlowId.forEach(item => {
          this.flowName += item.name + ';';
          this.selectFlowId += item.id + ';';
        })
        this.innerVisible = false;
      }else {
        this.flowName = '';
        this.selectFlowId = '';
      }
    },
    
    //流程选择中的数据
    handleSelectionChange(val) {
      this.checkedFlowId = val;
    },

    //通讯录选择中的数据
    handleGrounpChange(val) {
      this.selectGroup = val;
    },

    //打开代理弹窗并获取流程数据
    construction() {
      this.proxyMode = '0';
      this.state = '1';
      this.currentRowId = '';
      this.saveApproverStatus = '';
      this.authorizedUser = '';
      this.description = '';
      this.endDay = '';
      this.startDay = '';
      this.selectFlowId = '';
      this.flowName = '';
      this.centerDialogVisible = true;
      this.innerVisible = false;
      let appId = this.$root.appid;
      this.$api.getProxysFlow(
        appId,
        {
          onSucess: res => {
            let flowData = res.data.data;
            let arr = [];
            for(let key in flowData) {
              let obj = {};
              if(key) {
                obj.id = key;
                obj.name = flowData[key];
                arr.push(obj);
              }
            }
            console.log("arr---->",arr);
            this.flowData = arr;
          }
        }
      )
    },


    // 保存代理信息
    centerDialog() {
      if (!this.authorizedUser) {
        this.$message({
          message: "请选择授权人",
          type: 'warning'
        });
      } else if (!this.startDay) {
        this.$message({
          message: "请选择开始日期",
          type: 'warning'
        });
      } else if (!this.endDay) {
        this.$message({
          message: "请选择结束日期",
          type: 'warning'
        });
      } else {
        let startTime = new Date(this.startDay);
        startTime = startTime.getTime();
        let endTime = new Date(this.endDay);
        endTime = endTime.getTime();

        if(startTime > endTime) {
          this.$message({
            message: "代理结束日期必须大于代理开始日期",
            type: 'warning'
          });
        }else {
          let appId = this.$root.appid;
          let id = this.currentRowId?this.currentRowId:'';
          let data = {
            agents: this.authorizedUserId,
            agentsName: this.authorizedUser,
            description: this.description,
            endProxyTime: endTime,
            flowId: this.proxyMode=='0'?this.selectFlowId:'',
            flowName: this.proxyMode=='0'?this.flowName:'所有流程',
            owner: this.$store.state.userId,
            proxyMode: parseInt(this.proxyMode),
            startProxyTime: startTime,
            state: this.state,
          };
          this.$api.saveProxys(
            appId,
            data,
            id,
            {
              onSucess: res => {
                if(res.data.errcode == 40014) {
                  this.centerDialogVisible = false;
                  this.$notify.error({
                    title: '错误',
                    message: res.data.errmsg
                  });
                  
                }else {
                  this.centerDialogVisible = false;
                  this.$notify({
                    title: '保存成功',
                    message: '',
                    type: 'success'
                  });
                  this.proxys();
                }
              }
            }
          )
        }
        
      }
    },


    // 个人基本信息保存的请求
    UserSetups() {
      if(this.oldPassword) {
        if(!this.newPassword) {
          this.$notify({
            title: '新密码不能为空',
            message: '',
            type: 'warning'
          });
        }else {
          if(!this.affirmPassword) {
            this.$notify({
              title: '新密码和确认密码必须一致',
              message: '',
              type: 'warning'
            });
          }else if(this.newPassword !== this.affirmPassword) {
            this.$notify({
              title: '新密码和确认密码必须一致',
              message: '',
              type: 'warning'
            });
          }else if (this.newPassword == this.affirmPassword) {
            let data = {
              confirmPassword: this.affirmPassword,
              newpassword: this.newPassword,
              oldPassword: this.oldPassword,
            }
            this.$api.updatePassword(
              data,
              {
                onSucess: res => {
                  if(res.data.errcode == 0) {
                    this.$notify({
                      title: '修改成功',
                      message: '',
                      type: 'success'
                    });
                  }else {
                    this.$notify({
                      title: res.data.errmsg,
                      message: '',
                      type: 'error'
                    });
                  }
                }
              }
            )
          }
        }
      }else if(!this.oldPassword && this.affirmPassword) {
        this.$notify({
          title: '旧密码不能为空',
          message: '',
          type: 'warning'
        });
      }else if(this.newPassword) {
        if(!this.oldPassword) {
          this.$notify({
            title: '旧密码不能为空',
            message: '',
            type: 'warning'
          });
        }
      }
      this.$api.PersonalInformationSettings(
        {
          name: this.information.name,
          email: this.information.email,
          telephone: this.information.mobile
        },
        {
          onSucess: response => {
            if(!this.oldPassword && !this.newPassword && !this.affirmPassword) {
              if (response.status == 200) {
                this.$notify({
                  title: '保存成功',
                  message: '',
                  type: 'success'
                });
              }
            }
          },
          onError: error => {
            console.log(error);
          }
        }
      );
    },


    baseInfo() {
      this.information = this.$store.state.myProfile;
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
    //新建代理信息的弹框
    innerAgencyVisible() {
      this.innerVisible = false;
      this.centerDialogVisible = false;
    },

    //通讯录添加至分组
    contentNowrap() {
      this.addUserTogroup = '添加用户至分组';
      if (this.selectGroup.length == 0) {
        this.$message({
          message: '请至少选择一个用户！',
          type: 'warning'
        })
      } else {
        this.$api.getContactGroup(
          {
            onSucess: res => {
              this.groupList = res.data.data.datas;
            }
          }
        )
        this.AgencyDialogVisible = true;
      }
    },
    replacement() {
      this.agency = "";
    },
    reset() {
      this.nohark = '';
    },

    // 通讯录查询用户
    inquire() {
      this.pageNum = 1;
      let params = {
        contactsId: this.currentGroupId?this.currentGroupId:'',
        userName:this.nohark,
        pageSize:10,
        pageNum:1,
      };
      this.$api.getSearchContact(
        params,
        {
          onSucess: res => {
            let newData = res.data.data.datas.map(item => {
              return {
                name: item.name,
                dept: item.dept,
                mobile: item.mobile,
                email: item.email,
                id: item.id,
                deptId: item.deptId,
              };
            });
            this.tableData = newData;
            this.tableDataNum = res.data.data.rowCount;
          }
        }

      )
    },
  
    // 获取代理列表
    proxys() {
      let appId = this.$root.appid;
      let jsonData = {
            flowName: '',
            linesPerPage: 10,
            pageNo: 1,
          };
      this.$api.getproxys(
        appId,
        jsonData,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
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
            console.log("this.process--->",this.process);
          }
        }
      )
    },

    // 获取通讯录分组
    contactsGroup() {
      this.$api.getContactGroup(
        {
          onSucess: res => {
            this.groupList = res.data.data.datas;
          }
        }
      )
    },


    //获取代理设置分页数据的请求
    handlAgentpaging(ev) {
      let appId = this.$root.appid;
      let jsonData = {
            flowName: this.agency,
            linesPerPage: 10,
            pageNo: ev,
        }
      this.$api.getproxys(
        appId,
        jsonData,
        {
          onSucess: res => {
            this.row_count = res.data.data.rowCount;
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
            console.log("this.process--->",this.process);
          }
        }
      )
    },
    //通讯录分页请求
    Addressbookpaging(num) {
      if(this.currentGroupId) {
        this.$api.getAddressBook(
          {
            contactsId: this.currentGroupId,
            userName:this.nohark,
            pageSize: 10,
            pageNum: num,
          },
          {
            onSucess: res => {
              this.tableDataNum = res.data.data.rowCount;
              let newData = res.data.data.datas.map(item => {
                return {
                  name: item.name,
                  dept: item.dept,
                  mobile: item.mobile,
                  email: item.email,
                  id: item.id,
                  deptId: item.deptId,
                };
              });
              this.tableData = newData;
            }
          }
        )

      }else {
        this.$api.getAddressBook(
          {
            contactsId: "",
            userName:this.nohark,
            pageSize: 10,
            pageNum: num,
          },
          {
            onSucess: res => {
              this.tableDataNum = res.data.data.rowCount;
              let newData = res.data.data.datas.map(item => {
                return {
                  name: item.name,
                  dept: item.dept,
                  mobile: item.mobile,
                  email: item.email,
                  id: item.id,
                  deptId: item.deptId,
                };
              });
              this.tableData = newData;
            }
          }
        )
      }
    },
    // 请求通讯录里面要渲染的数据
    ContentBox() {
      this.isOneGroup = false;
      this.currentGroupId = '';
      this.nohark = '';
      this.$api.getAddressBook(
        {
          contactsId: "",
          pageSize: 10,
          pageNum: 1,
        },
        {
          onSucess: res => {
            this.tableDataNum = res.data.data.rowCount;
            let newData = res.data.data.datas.map(item => {
              return {
                name: item.name,
                dept: item.dept,
                mobile: item.mobile,
                email: item.email,
                id: item.id,
                deptId: item.deptId,
              };
            });
            this.tableData = newData;
          }
        }
      )
      
    },
    // 这是皮肤样式的请求
    Userskin() {
      API.SkinSetting(
        {
          skin: "H5"
        },
        {
          onSucess: response => {
            if (response.status == 200) {
              alert("H5样式皮肤设置成功!");
              window.location = "http://localhost:8080/obpm/portal/H5/main.jsp";
            }
          },
          onError: error => {
            console.log(error);
          }
        }
      );
    },


   
  }
};
</script>



