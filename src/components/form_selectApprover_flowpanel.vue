<template>
  <div class="userwrap">
    <div>
      <div class="search-input">
        <div class="input">
          <el-input 
            v-model="searchValue" 
            placeholder="用户名或账号"
            class="myClass"
            @keyup.enter.native="handleIconSearch(searchValue)"
          >
            <i
              class="el-icon-zoom-in el-input__icon"
              slot="suffix"
              @click="handleIconSearch(searchValue)">
            </i>  
          </el-input>
        </div>
      </div>
      <el-tabs 
        type="border-card" 
        v-model="activeName" 
        @tab-click="handleClick">
        
        <!--按部门-->
        <el-tab-pane label="按部门" name="first">
          <div class="contact user-common">
            <div class="left">
              <span class="top-title">部门列表：</span>
              <div class="dept-tree">
                <el-tree 
                  :props="props" 
                  :load="loadNode"
                  node-key="id" 
                  ref="deptTree" 
                  lazy 
                  :expand-on-click-node="false"
                  :check-strictly="true"
                  :default-expanded-keys="defaultExpandedKeys"
                  @node-click="handleNodeClick($event)"
                  >
                </el-tree>
              </div>
            </div>
            <div class="role-page">
              <div class="user-list"> 
                <div class="add-all-data" v-if="!isUpcoming">
                  <el-button plain size="small" @click="addAllPage('DEPT')">添加本页所有</el-button>
                </div>
                <div class="current-role" v-if="currentDeptName">
                  部门：{{currentDeptName}}
                </div>
                <div class="list-box">
                  <!--单选-->
                  <el-radio-group v-model="selectedUserFree" v-if="isFreeFlow || isUpcoming || approverNumType == 1">
                    <el-radio 
                      style="display:block;"
                      v-for="user in (searchData && searchData.length>0?searchData:deptUser)" 
                      :label="user.id" 
                      :key="user.id"
                      @change="handleRadioChange($event, user, user.id)"
                    >
                      {{user.name}}
                    </el-radio>
                  </el-radio-group>
                  <!--复选-->
                  <el-checkbox-group v-model="selectedUsers" v-else>
                    <el-checkbox 
                      style="display:block;"
                      v-for="user in (searchData && searchData.length>0?searchData:deptUser)" 
                      :label="user.id" 
                      :key="user.id"
                      @change="handleSelectChange($event, user, user.id)"
                    >
                      {{user.name}}
                    </el-checkbox>    
                  </el-checkbox-group>
                </div>
              </div>
              <div class="btn">
                <el-pagination
                  small
                  :pager-count="5"
                  :current-page.sync="currentPage"
                  :page-size="10"
                  layout="prev, pager, next"
                  :total="row_count"
                  @current-change="deptLoadingMore($event)"
                >
                </el-pagination>
              </div>
            </div>
            <!--主子流程，子流程并行流程-->
            <div class="selected-role" v-if="isSubFlow">
              <div class="add-all-data">
                <div>
                  已选择:
                </div>
                <div>
                  <el-button v-if="groupNum > 0" type="primary" size="small" @click="addSubflow">+并行流程</el-button>
                  <el-button v-else type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <!-- {{currentGroup}} -->
                <div class="list-wrap" id="parent">
                  <div 
                    class="list" 
                    v-for="(items,index) in currentGroup" 
                    :key="index"
                  >
                    <div 
                      class="flow" 
                      @click="setCurrentGroupIndex(index)" 
                      :class="{active:currentGroupIndex==index?true:''}"
                    >
                      <div class="name">第&nbsp;{{index+1}}&nbsp;分组</div>
                      <div class="flow-right">
                        <div class="add-icon" @click.stop.prevent="deleteSubflow(index)">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </div>
                    <div 
                      class="users" 
                      v-for="(item, i) in items.row" 
                      :key="i"
                    >
                      <div class="user-left">
                        <div class="user-name">
                          {{item.name}}
                        </div>
                      </div>
                      <div class="del-icon" @click="deleteUser(item.id, items, index)">
                        <i class="fa fa-times-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="group-num" v-if="groupNum == -2">
                <span style="color: red;">#</span>
                每个用户单独启用一条子流程
                <span style="color: red;">#</span>
              </div>
            </div>
            
            <!--寻常流程-->
            <div class="selected-role" v-else>
              <div class="add-all-data">
                <div>
                  已选择用户：
                </div>
                <div>
                  <el-button type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <el-tag
                  class="tag"
                  v-for="(user,i) in selectedUsersList"
                  :key="user.name"
                  @close="closableTag(user.id,i)"
                  closable>
                  {{user.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="按角色" name="second">
          <div class="role user-common">
            <span class="role-left">
              <el-scrollbar class="scrollbar">
                <span class="top-title">角色列表:</span>
                <ul>
                  <li 
                    v-for="item in allRoles" 
                    :key="item.id" 
                    @click="rolesList(item.id, item.name)">
                    <img 
                      src="../assets/images/right_2.gif" 
                      class="icon-img"
                      v-if="item.id == roleCurrentId" 
                    />
                      {{item.name}}
                  </li>
                </ul>
              </el-scrollbar>
             
            </span>
            <div class="role-page">
              <div class="user-list"> 
                <div class="add-all-data" v-if="!isUpcoming && approverNumType != 1">
                  <el-button plain size="small" @click="addAllPage('ROLE')">添加本页所有</el-button>
                </div>
                <div class="current-role" v-if="currentRoleName">
                  角色：{{currentRoleName}}
                </div>
                <!--单选-->
                <div class="list-box">
                  <el-radio-group v-model="selectedUserFree" v-if="isFreeFlow || isUpcoming || approverNumType == 1">
                    <el-radio 
                      style="display:block;"
                      v-for="user in (searchData && searchData.length>0?searchData:rolesData)" 
                      :label="user.id" 
                      :key="user.id"
                      @change="handleRadioChange($event, user, user.id)"
                    >
                      {{user.name}}
                    </el-radio>
                  </el-radio-group>
                  <!--复选-->
                  <el-checkbox-group v-model="selectedUsers" v-else>
                    <el-checkbox 
                      style="display:block;"
                      v-for="user in (searchData && searchData.length>0?searchData:rolesData)" 
                      :label="user.id" 
                      :key="user.id"
                      @change="handleSelectChange($event, user, user.id)"
                    >
                      {{user.name}}
                    </el-checkbox>    
                  </el-checkbox-group>
                </div>
                
              </div>
              <div class="btn">
                <el-pagination
                  small
                  :pager-count="5"
                  :current-page.sync="currentPage"
                  :page-size="10"
                  layout="prev, pager, next"
                  :total="row_count"
                  @current-change="rolesLoadingMore($event)"
                >
                </el-pagination>
              </div>
            </div>

            <!--主子流程，子流程并行流程-->
            <div class="selected-role" v-if="isSubFlow">
              <div class="add-all-data">
                <div>
                  已选择:
                </div>
                <div>
                  <el-button v-if="groupNum>0" type="primary" size="small" @click="addSubflow">+并行流程</el-button>
                  <el-button v-else type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <div class="list-wrap" id="parent">
                  <div 
                    class="list" 
                    v-for="(items,index) in currentGroup" 
                    :key="index"
                  >
                    <div 
                      class="flow" 
                      @click="setCurrentGroupIndex(index)" 
                      :class="{active:currentGroupIndex==index?true:''}"
                    >
                      <div class="name">第&nbsp;{{index+1}}&nbsp;分组</div>
                      <div class="flow-right">
                        <div class="add-icon" @click.stop.prevent="deleteSubflow(index)">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </div>
                    <div 
                      class="users" 
                      v-for="(item, i) in items.row" 
                      :key="i"
                    >
                      <div class="user-left">
                        <div class="user-name">
                          {{item.name}}
                        </div>
                      </div>
                      <div class="del-icon" @click="deleteUser(item.id, items, index)">
                        <i class="fa fa-times-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--寻常流程-->
            <div class="selected-role" v-else>
              <div class="add-all-data">
                <div>
                  已选择用户：
                </div>
                <div>
                  <el-button type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <el-tag
                  class="tag"
                  v-for="(user,i) in selectedUsersList"
                  :key="i"
                  @close="closableTag(user.id,i)"
                  closable>
                  {{user.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <!--通讯录-->
        <el-tab-pane label="通讯录" name="fourth">
          <div class="contact user-common">
            <div class="left">
              <span class="top-title">通讯录：</span>
              <span @click="contact" class="all-contact">
                <img 
                  src="../assets/images/right_2.gif" 
                  class="icon-img"
                />
                全部联系人
              </span>
            </div>
            <div class="role-page">
              <div class="user-list"> 
                <div class="add-all-data" v-if="!isUpcoming">
                  <el-button plain size="small">添加本页所有</el-button>
                </div>
                <div class="current-role">
                  角色：联系人
                </div>
                
                <div class="list-box">
                  <!--单选-->
                  <el-radio-group v-model="selectedUserFree" v-if="isFreeFlow || isUpcoming || approverNumType == 1">
                    <el-radio 
                      style="display:block;"
                      v-for="user in linkman" 
                      :label="user.id" 
                      :key="user.id"
                      @change="handleRadioChange($event, user, user.id)"
                    >
                      {{user.name}}
                    </el-radio>
                  </el-radio-group>
                  <!--复选-->
                  <el-checkbox-group v-model="selectedUsers" v-else>
                    <el-checkbox 
                      style="display:block;"
                      v-for="user in linkman" 
                      :label="user.id" 
                      :key="user.id"
                      @change="handleSelectChange($event, user, user.id)"
                    >
                      {{user.name}}
                    </el-checkbox>    
                  </el-checkbox-group>
                </div>
              </div>
              <div class="btn">
                  <el-pagination
                    small
                    :pager-count="5"
                    :current-page.sync="currentPage"
                    :page-size="10"
                    layout="prev, pager, next"
                    :total="row_count"
                    @current-change="contactLoadingMore($event)"
                  >
                  </el-pagination>
              </div>
            </div>
             <!--主子流程，子流程并行流程-->
            <div class="selected-role" v-if="isSubFlow">
              <div class="add-all-data">
                <div>
                  已选择:
                </div>
                <div>
                  <el-button v-if="groupNum>0" type="primary" size="small" @click="addSubflow">+并行流程</el-button>
                  <el-button v-else type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <div class="list-wrap" id="parent">
                  <div 
                    class="list" 
                    v-for="(items,index) in currentGroup" 
                    :key="index"
                  >
                    <div 
                      class="flow" 
                      @click="setCurrentGroupIndex(index)" 
                      :class="{active:currentGroupIndex==index?true:''}"
                    >
                      <div class="name">第&nbsp;{{index+1}}&nbsp;分组</div>
                      <div class="flow-right">
                        <div class="add-icon" @click.stop.prevent="deleteSubflow(index)">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </div>
                    <div 
                      class="users" 
                      v-for="(item, i) in items.row" 
                      :key="i"
                    >
                      <div class="user-left">
                        <div class="user-name">
                          {{item.name}}
                        </div>
                      </div>
                      <div class="del-icon" @click="deleteUser(item.id, items, index)">
                        <i class="fa fa-times-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="selected-role" v-else>
              <div class="add-all-data">
                <div>
                  已选择用户：
                </div>
                <div>
                  <el-button type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <el-tag
                  class="tag"
                  v-for="user in selectedUsersList"
                  :key="user.name"
                  @close="closableTag(user.id,i)"
                  closable>
                  {{user.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!--查询-->
        <!-- <el-tab-pane label="查询" name="fifth">
          <div class="search">
            <div class="left">
              <span class="top-title">
                <div>按用户名称或者账号查询：</div>
                <div>
                  <el-input 
                    v-model="searchValue" 
                    placeholder="用户名或账号"
                    class="myClass"
                    @keyup.enter.native="handleIconSearch(searchValue)"
                  >
                    <i
                      class="el-icon-zoom-in el-input__icon"
                      slot="suffix"
                      @click="handleIconSearch(searchValue)">
                    </i>  
                  </el-input>
                </div>
              </span>
              <div class="user-list"> 
                <el-radio-group v-model="selectedUserFree" v-if="isFreeFlow || isUpcoming || approverNumType == 1">
                  <el-radio 
                    style="display:block;"
                    v-for="user in searchData" 
                    :label="user.id" 
                    :key="user.id"
                    @change="handleRadioChange($event, user, user.id)"
                  >
                    {{user.name}}
                  </el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="selectedUsers" v-else>
                  <el-checkbox 
                    style="display:block;"
                    v-for="user in searchData" 
                    :label="user.id" 
                    :key="user.id"
                    @change="handleSelectChange($event, user, user.id)"
                  >
                    {{user.name}}
                  </el-checkbox>    
                </el-checkbox-group>
              </div>
              <div class="btn">
                <el-pagination
                  small
                  :pager-count="5"
                  :current-page.sync="currentPage"
                  :page-size="10"
                  layout="prev, pager, next"
                  :total="searchCount"
                  @current-change="searchLoadingMore($event)"
                >
                </el-pagination>
                
              </div>
            </div>
            <div class="selected-role" v-if="isSubFlow">
              <div class="add-all-data">
                <div>
                  已选择:
                </div>
                <div>
                  <el-button type="primary" size="small" @click="addSubflow">+并行流程</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <div class="list-wrap" id="parent">
                  <div 
                    class="list" 
                    v-for="(items,index) in currentGroup" 
                    :key="index"
                  >
                    <div 
                      class="flow" 
                      @click="setCurrentGroupIndex(index)" 
                      :class="{active:currentGroupIndex==index?true:''}"
                    >
                      <div class="name">第&nbsp;{{index+1}}&nbsp;分组</div>
                      <div class="flow-right">
                        <div class="add-icon" @click.stop.prevent="deleteSubflow(index)">
                          <i class="el-icon-close"></i>
                        </div>
                      </div>
                    </div>
                    <div 
                      class="users" 
                      v-for="(item, i) in items.row" 
                      :key="i"
                    >
                      <div class="user-left">
                        <div class="user-name">
                          {{item.name}}
                        </div>
                      </div>
                      <div class="del-icon" @click="deleteUser(item.id, items, index)">
                        <i class="fa fa-times-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="selected-role" v-else>
              <div class="add-all-data">
                <div>
                  已选择用户：
                </div>
                <div>
                  <el-button type="danger" size="small" @click="closeAll">移除所有</el-button>
                </div>
              </div>
              <div class="tag-lists">
                <el-tag
                  class="tag"
                  v-for="(user,i) in selectedUsersList"
                  :key="user.name"
                  @close="closableTag(user.id,i)"
                  closable>
                  {{user.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="btn-box">
      <el-button 
        type="success" 
        size="medium"
        @click="onOk"
      >
        确认
      </el-button>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import API from "@/api.js";
export default {
  props: [
    "act",
    "openParams", 
    "buildFormData", 
    "approversObj", 
    "flowId", 
    "isFreeFlow",
    "saveApproverStatus",
    "submitTo",
    "approverNumType",
    "isAppentCirculator",
    "subflowData",
    "subFlowToApprover",
    "groupNum",
    "isSubFlow",
    "isUpcoming", //首页我的待办
    "isProxys", //判断是否是首页个人设置代理设置
    "allowEditApprover",
    "approvers"
  ],
  data: function() {
    return {
      currentPage:1,
      row_count:0,


      begin:true,
      roleCurrentId:'',
      allRoles:'',//所有角色
      selectedUsers:[],//选中的角色id(复选)
      selectedUserFree: '', //选中的角色id(单选自由流程)
      selectedUsersList:[], //选中的角色数据列表
      rolesData:[],//角色数据

      activeName:'first',//tab的当前页

      linkman:[],//通讯录联系人

      searchData:[],//搜索返回的数据
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },

      deptUser:[],//部门员工列表

      title:" ",
      tabName:'first',

      rowCount:0,
      roleId:'',
      contactCount:0,
      deptCount:0,
      departId:'',
      searchCount:0,
      onlinesUserCount:0,
      loadingIcon:false,

      onlinesPage:2,
      onlinesPageCount:'',

      contactPage:2,
      contactPageCount:'',

      searchPage:2,
      searchPageCount:'',

      searchValue:'',

      currentGroup:[], //子流程分组
      groupNumber:'', //子流程分组数量
      currentGroupIndex:-1,
      currentRoleName:'',
      currentDeptName:'',
      defaultExpandedKeys: [],
    }
  },
  mounted() {
    this.getData();
    if(this.isSubFlow) {
      this.listView();
    }
  },
  methods: {
    closeAll() {
      this.selectedUsers = [];
      this.selectedUsersList = [];
      this.selectedUserFree = '';
      if(this.currentGroup) {
        this.currentGroup[0].row = [];
      }
      

    },
    closableTag(id, index){
      this.selectedUsersList.splice(index, 1);
      for(let i = 0; i<this.selectedUsers.length; i++) {
        if(this.selectedUsers[i] == id) {
          this.selectedUsers.splice(i, 1);
          break;
        }
      }
    },
    addAllPage(val) {
      if(val == 'ROLE') {
        let arr = JSON.parse(JSON.stringify(this.selectedUsers));
        if(this.selectedUsers && this.selectedUsers.length>0) {
          this.rolesData.forEach(item => {
            if(arr.indexOf(item.id) < 0) {
              this.selectedUsersList.push(item);
              this.selectedUsers.push(item.id);
            }
          });
        }else {
          this.rolesData.forEach(item => {
            this.selectedUsersList.push(item);
            this.selectedUsers.push(item.id);
          });
        }
      }else if (val == 'DEPT') {
        let arr = JSON.parse(JSON.stringify(this.selectedUsers));
        if(this.selectedUsers && this.selectedUsers.length>0) {
          this.deptUser.forEach(item => {
            if(arr.indexOf(item.id) < 0) {
              this.selectedUsersList.push(item);
              this.selectedUsers.push(item.id);
            }
          });
        }else {
          this.deptUser.forEach(item => {
            this.selectedUsersList.push(item);
            this.selectedUsers.push(item.id);
          });
        }
      }
      console.log("this.selectedUsers--->",this.selectedUsers)
      console.log("this.selectedUsersList--->",this.selectedUsersList);
    },
    handleRadioChange(ev, value, id) {
      let arr = [];
      arr.push(value);
      this.selectedUsersList = arr;
    },
    handleSelectChange(ev, value, id) {
      if(ev) {
        this.selectedUsersList.push(value);
      }else {
        if(this.selectedUsersList && this.selectedUsersList.length > 0) {
          let list = this.selectedUsersList;
          for(let i=0; i<list.length; i++) {
            if(id == list[i].id) {
              list.splice(i, 1)
            }
          }
        }
      }
      if(this.isSubFlow) { //如果有子流程
        if(this.currentGroup && this.currentGroup.length>0) {
          for(let i=0; i<this.currentGroup.length; i++) {
            if(i == this.currentGroupIndex) {
              this.currentGroup[i].row = JSON.parse(JSON.stringify(this.selectedUsersList));
            }
          }
        }
      }
    },
   
    //查询用户
    handleIconSearch(value){
      this.selectData = [];
      this.$forceUpdate();
      let pageNum = 1, 
        pageSize = 10;
        if(value) {
          this.$api.getSearch(value, pageNum, pageSize, {
            onSucess: response => {
              this.searchData = response.data.data.datas;
              this.searchCount =  response.data.data.rowCount
              this.row_count = response.data.data.rowCount;
            }
          })
        }
    },

    //加载更多查询数据
    searchLoadingMore(num){
      this.loadingIcon = true;
      let keyWord = this.searchValue?this.searchValue:"";
      let pageSize = 10;
      API.searchPage(
        keyWord,
        num,
        pageSize,
        {
          onSucess: response => {
            this.searchData = response.data.data.datas;
            this.loadingIcon = false;
          }        
        }
      )
    },
    //加载更多联系人
    contactLoadingMore(num){
      this.loadingIcon = true;
      let pageSize = 10;
      API.ContactPage(
        num,
        pageSize,
        {
          onSucess: response => {
            this.linkman = response.data.data.datas;
            this.loadingIcon = false;
          }
        }
      );
    },
    //加载更多在线用户
    onlinesLoadingMore(){
      console.log(111);
      this.loadingIcon = true;
      let pageSize = 10;
      API.getOnlines(
        this.onlinesPage++, 
        pageSize,
        {
          onSucess: response => {
            this.onlinesUser = this.onlinesUser.concat(response.data.data.datas);
            this.loadingIcon = false;
          }
        }
      );
    },
    //加载更多部门
    deptLoadingMore(ev){
      
      let appId = this.$root.appid;
      let pageSize = 10;
      let departId = this.departId;
      if(this.approversObj && this.approversObj.nodeid) {
        let docId = this.buildFormData.id, 
          flowId = this.flowId, 
          nodeId = this.approversObj.nodeid, 
          type = 1, 
          selectId = e.id, 
          pageNum = ev, 
          pageSize = 10;
        this.$api.getSelectApprovers(
          appId, 
          docId, 
          flowId, 
          nodeId, 
          type, 
          selectId, 
          pageNum, 
          pageSize,
          {
            onSucess: res => {
              this.deptUser = res.data.data.datas;
              this.row_count = res.data.data.rowCount
            }
          }
        )
      }else {
        this.$api.departmentPage(
          appId,
          departId,
          ev,
          pageSize,
          {
            onSucess: response => {
              this.deptUser = response.data.data.datas;
              this.row_count = response.data.data.rowCount;
            }
          }
        );
      } 

    },

    //点击部门树节点触发
    handleNodeClick(e){
      this.departId = e.id;
      let deptId = e.id;
      this.currentDeptName = e.name;
      let appId = this.$root.appid;
      if(this.approversObj && this.approversObj.nodeid) {
        let docId = this.buildFormData.id, 
          flowId = this.flowId, 
          nodeId = this.approversObj.nodeid, 
          type = 1, 
          selectId = e.id, 
          pageNum = 1, 
          pageSize = 10;
        this.$api.getSelectApprovers(
          appId, 
          docId, 
          flowId, 
          nodeId, 
          type, 
          selectId, 
          pageNum, 
          pageSize,
          {
            onSucess: res => {
              this.row_count = res.data.data.rowCount;
              this.deptUser = res.data.data.datas;
              this.title = e.name;
              this.deptCount = res.data.data.rowCount;
            }
          }
        )
      }else {
        this.$api.getDeptUser(
          appId, 
          deptId,
          {
            onSucess: response => {
              this.row_count = response.data.data.rowCount;
              this.deptUser = response.data.data.datas;
              this.title = e.name;
              this.deptCount = response.data.data.rowCount;
            }
          }
        );
      } 

    },
    //部门树
    loadNode(node, resolve) {
      let appid = this.$root.appid;
      let that = this;
      if (node.level === 0) {
        API.getDepartmentsByParentId(appid, "", {
          onSucess: function(response) {
            that.defaultExpandedKeys.push(response.data.data[0].id);
            resolve(response.data.data);
          }
        });
      } else {
        API.getDepartmentsByParentId(appid, node.key, {
          onSucess: function(response) {
            resolve(response.data.data);
          }
        });
      }
    },
    //标签页分类
    handleClick(tab){
      this.currentPage = 1;
      this.row_count = 0;
      if(tab.name == "second") {
        this.tabName = "second";
        this.searchData = [];
        //按部门
      }else if(tab.name == "third") {
        this.searchData = [];
        this.onlinesPage = 2;
        this.tabName = "third";
        let pageNum = 1;
        let pageSize = 10;
        //在线用户
        API.getOnlines(
          pageNum, 
          pageSize,
          {
            onSucess: response => {
              this.onlinesUser = response.data.data.datas
              this.onlinesUserCount = response.data.data.rowCount;
              this.onlinesPageCount = response.data.data.pageCount;
            }
          }
        );
      }else if(tab.name == "fourth") {
        //通讯录
        this.searchData = [];
        this.tabName = "fourth";
      }else if(tab.name == "fifth"){
        this.searchData = [];
        this.searchPage = 2,
        this.tabName = "fifth";
        let keyWord = "";
        //查询
        let pageNum = 1, 
        pageSize = 10;
        API.getSearch(
          keyWord,
          pageNum,
          pageSize,
          {
            onSucess: response => {
              this.searchData = response.data.data.datas
              this.searchCount = response.data.data.rowCount;
              this.searchPageCount = response.data.data.pageCount;
            }
          }
        );
      }else {
        this.searchData = [];
        this.tabName = "first";
      }
    },
    //通讯录联系人
    contact() {
      this.contactPage = 2;
      let contactsId = "all";
      API.getContact(
        contactsId,
        {
          onSucess: response => {
            this.row_count = response.data.data.rowCount;
            this.linkman = response.data.data.datas
            this.contactCount = response.data.data.rowCount;
            
          }
        }
      );
    },
    //删除选中的角色
    onTabClose(dept) {
      if(this.field.data.length == 1){
        this.field.value = "";
        this.field.data = [];
        this.begin = false;
        if(this.field.refreshOnChanged) {
          this.onChange();
        }
      }else {
        let deptData = this.field.data;
        for(let i=0; i<deptData.length; i++) {
          if(dept.id == deptData[i].id) {
            deptData.splice(i, 1);
            i--;
          }
        }
        this.begin = false;
        if(this.field.refreshOnChanged) {
          this.onChange();
        }
      }
      
    },

    onOk(){
      //JSON.parse(JSON.stringify(list));
      let approverId = "";
      let approverName = "";
      if(this.isProxys) { //首页个人设置代理设置
        this.selectedUsers.forEach(item => {
          approverId += item + ";";
          for(let i=0; i<this.selectedUsersList.length; i++) {
            if(item == this.selectedUsersList[i].id){
              approverName += this.selectedUsersList[i].name + ";"; 
            }
          }
        });
        this.$emit("action",approverName, approverId, this.selectedUsersList);
      }else if (this.isUpcoming) {
        approverName = this.selectedUsersList[0].name;
        let nextUserId = this.selectedUserFree;
        this.$emit("action",approverName, nextUserId);
      }else if (this.allowEditApprover) {
        let obj = {};
        obj.auditorList = this.selectedUsers;
        this.$api.approversWorkflow(
          this.$root.appid,
          this.buildFormData.id,
          obj,
          {
            onSucess: res => {
              if(res.data.errcode == 0) {
                let isRefresh = true;
                this.$emit("closeApproverDialog",isRefresh)
                this.$notify({
                  title: res.data.data,
                  message: '',
                  type: 'success'
                });
              }
            }
          }
        )
      }
      else {
        if(this.act.type == 57 || this.act.type == 58) { //加签主办或协办
          let hostOrCohostList = [];
          let selectedUserObj = {};
          this.selectedUsersList.forEach(items => {
            let obj = {};
            for (let key in items) {
              if(key == "id" || key == "name") {
                obj[key] = items[key];
              }
            }
            approverId += items.id + ";";
            selectedUserObj.userids = approverId;
            hostOrCohostList.push(obj);
          });
          selectedUserObj.row = this.selectedUsersList;
          console.log("hostOrCohostList--->",hostOrCohostList);
          this.$emit("selectHostOrCohost",hostOrCohostList, selectedUserObj); //调用父组件selectHostOrCohost()方法
        }else if (this.isFreeFlow) {  //自由流程
          approverName = this.selectedUsersList[0].name;
          let nextUserId = this.selectedUserFree;
          this.$emit("action",approverName, "", nextUserId)
        }else if (this.isSubFlow) { //子流程
          let groupLength = Object.assign({}, this.approversObj);
          if(this.currentGroup.length < groupLength.groupNum) {
            this.$message({
              message: `分组不等于${groupLength.groupNum},请重新增删分组!`,
              type: 'warning'
            });
          }else {
            let userid = [];
            let approverName = '';
            for(let i = 0; i < this.currentGroup.length; i++) {
              //this.currentGroup.position = i+1;
              let obj = {};
              obj.position = i+1;
              let arrId = [];
              let row = [];
              if(this.currentGroup[i].row && this.currentGroup[i].row.length >0 ) {
                let params = this.currentGroup[i].row;
                for(let j=0; j<params.length; j++) {
                  arrId.push(params[j].id)
                  approverName += params[j].name + ";";
                  row.push(params[j]);
                }
                obj.userids = arrId;
                obj.rows = row;
                userid.push(obj);
              }else {
                this.$message({
                  message: `第${i+1}组用户不能为空`,
                  type: 'warning'
                });
                return false;
              }
            }
            let subObj = {
              approver:userid,
              nodeid:this.approversObj.nodeid,
            }
            let currentGroup = [...this.currentGroup];
            this.$emit("event", approverName, subObj, currentGroup, this.groupNum);
          }
        }else {  //非自由流程
          let arr = [];
          if (this.approverNumType== 1) {  //单选
            console.log("------->",this.selectedUsersList);
            if(this.selectedUsersList.length > 0 ) {
              approverName = this.selectedUsersList[0].name;
              this.approversObj.userids = this.selectedUsersList[0].id;
              this.approversObj.row = this.selectedUsersList;
            }
          } else {
            if(this.selectedUsers.length>0) {   //多选
              this.selectedUsers.forEach(item => {
                approverId += item + ";";
                for(let i=0; i<this.selectedUsersList.length; i++) {
                  if(item == this.selectedUsersList[i].id){
                    approverName += this.selectedUsersList[i].name + ";"; 
                    arr.push(this.selectedUsersList[i]);
                  }
                }
              });
              this.selectedUsersList = arr;
            }
            // approverName = approverName.replace(/^(\s|;)+|(\s|;)+$/g, '');
            // approverId = approverId.replace(/^(\s|;)+|(\s|;)+$/g, '');
            this.approversObj.userids = approverId;
            this.approversObj.row = this.selectedUsersList;
          }
          let isAppentCirculator = this.isAppentCirculator;
          this.$emit("action",approverName,this.approversObj,'', isAppentCirculator); // 调用父组件selectApprover()方法
        }
      }
     
    },

    //去除重复数据
    removeDuplicateData(currentData) {
      let uniques = [];
      let stringify = {};
      for (let i = 0; i < currentData.length; i++) {
          let keys = Object.keys(currentData[i]);
          keys.sort(function(a, b) {
              return (Number(a) - Number(b));
          });
          let str = '';
          for (let j = 0; j < keys.length; j++) {
              str += JSON.stringify(keys[j]);
              str += JSON.stringify(currentData[i][keys[j]]);
          }
          if (!stringify.hasOwnProperty(str)) {
              uniques.push(currentData[i]);
              stringify[str] = true;
          }
      }
      uniques = uniques;
      return uniques;
    },

    //角色分类加载
    rolesList(id, name) {
      this.currentRoleName = name;
      let that = this;
      this.roleCurrentId = id; 
      this.roleId = id;
      let appId = this.$root.appid;
      if(this.approversObj && this.approversObj.nodeid) {
        let docId = this.buildFormData.id, 
          flowId = this.flowId, 
          nodeId = this.approversObj.nodeid, 
          type = 2, 
          selectId = id, 
          pageNum = 1, 
          pageSize = 10;
        this.$api.getSelectApprovers(
          appId, 
          docId, 
          flowId, 
          nodeId, 
          type, 
          selectId, 
          pageNum, 
          pageSize,
          {
            onSucess: res => {
              that.rolesData = res.data.data.datas;
              that.row_count = res.data.data.rowCount;
            }
          }
        )
      }else {
        this.$api.getRoles(
          appId, 
          id, 
          10, 
          1,
          {
            onSucess: res => {
              that.rolesData = res.data.data.datas;
              that.row_count = res.data.data.rowCount;
            }
          }
        )
      } 
    },

    //加载更多角色
    rolesLoadingMore(ev){
      let appId = this.$root.appid;
      let roles = this.roleId;
      let pageSize = 10;
      if(this.approversObj && this.approversObj.nodeid) {
        let docId = this.buildFormData.id, 
          flowId = this.flowId, 
          nodeId = this.approversObj.nodeid, 
          type = 2, 
          selectId = id, 
          pageNum = ev, 
          pageSize = 10;
        this.$api.getSelectApprovers(
          appId, 
          docId, 
          flowId, 
          nodeId, 
          type, 
          selectId, 
          pageNum, 
          pageSize,
          {
            onSucess: res => {
              that.rolesData = res.data.data.datas;
              that.row_count = res.data.data.rowCount;
            }
          }
        )
      }else {
        this.$api.getRoles(
          appId,
          roles,
          pageSize,
          ev,
          {
            onSucess: response => {
              this.rolesData = response.data.data.datas;
              that.row_count = res.data.data.rowCount;
            }
          }
        );
      } 
     
    },

    getData() {
      let that = this;
      let appId = this.$root.appid;
      //角色的接口
      this.$api.getAllRoles(
        appId,
        {
          onSucess: res => {
            that.allRoles = res.data.data.datas;
          }
        }
      )
      if(this.saveApproverStatus && this.saveApproverStatus.row && this.saveApproverStatus.row.length) {
        for(let i=0; i<this.saveApproverStatus.row.length; i++) {
          this.selectedUsers.push(this.saveApproverStatus.row[i].id);
        }
        this.selectedUsersList = this.saveApproverStatus.row;
      }

      if(this.allowEditApprover) {
        //this.selectedUsersList = JSON.parse(JSON.stringify(this.approvers[0].nodes[0].auditors));
        if(this.approvers[0]) {
          if(this.approvers[0].nodes[0]) {
            this.selectedUsersList = JSON.parse(JSON.stringify(this.approvers[0].nodes[0].auditors));
            if(this.approvers[0].nodes[0].auditors && this.approvers[0].nodes[0].auditors.length > 0) {
              let auditors =  JSON.parse(JSON.stringify(this.approvers[0].nodes[0].auditors));
              for(let i=0; i<auditors.length; i++) {
                this.selectedUsers.push(auditors[i].id)
              }
            }
          }
        }
      }

      
    },

    //子流程分组
    listView(){
      if(this.subFlowToApprover && this.subFlowToApprover.length>0) {
        this.currentGroup = JSON.parse(JSON.stringify(this.subFlowToApprover));
        this.groupNumber = this.currentGroup.length;
      }else {
        let parent = document.getElementById('parent');
        if(parent.children.length ==0){
          // this.groupNumber = parent.children.length;
          let obj = Object.assign({}, this.approversObj);
          obj.type = "subflow";
          obj.row = [];
          this.currentGroup.push(obj);
          this.groupNumber = 1;
          this.currentGroupIndex = 0;
        }
      }
    },

    //添加子流程
    addSubflow() {
      let obj = Object.assign({}, this.approversObj);
      if(obj.groupNum == -1) {
        obj.type = "subflow";
        this.currentGroup.push(obj);
        this.groupNumber++;
      }else {
        if(this.currentGroup.length < obj.groupNum) {
          obj.type = "subflow";
          obj.row = [];
          this.currentGroup.push(obj);
          this.groupNumber++;
        }else {
          this.$message({
            message: `分组不能大于${obj.groupNum}`,
            type: 'warning'
          });
        }
      }
    },

    //删除字流程
    deleteSubflow(index) {
      if(this.currentGroup.length < 2) {
        this.$message({
          message: '至少要有一个分组',
          type: 'warning'
        });
      }else {
        this.currentGroup.splice(index, 1);
        this.$forceUpdate();
      }
    },

     //删除子字流程某个选中用户
    deleteUser(id, items, index) {
      items.row.forEach((item,index) => {
        if(id == item.id) {
          items.row.splice(index, 1);
        }
      });
      debugger
      this.currentGroup[index].row = items.row;
      this.selectedUsersList = JSON.parse(JSON.stringify(this.currentGroup[index].row));
      for(let i=0; i<this.selectedUsers.length; i++) {
        if(id == this.selectedUsers[i]) {
          this.selectedUsers.splice(i, 1);
          i--;
        }
      }
      console.log("this.selectedUsersList--->",this.selectedUsersList)
      console.log("this.selectedUsers--->",this.selectedUsers)
      
      this.$forceUpdate() //重新渲染数据
    },

    //设置子流程分组当前index
    setCurrentGroupIndex(index) {
      this.currentGroupIndex = index;
      this.selectedUsersList = [];
      this.selectedUsers = [];
    }
  }
}
</script>