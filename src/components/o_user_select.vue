<template>
  <span :id="id" class="user-select">
    <template
      v-if="field.displayType == Constant.PermissionType_HIDDEN || (field.textType && field.textType.toLowerCase() == 'hidden')"
    >
      <!-- 隐藏 TODO:注意，隐藏时不应该有hidden的field存在，有安全问题，以后要改过来：Jarod -->
      <el-input 
        type="hidden" 
        autosize 
        v-model="field.value">
      </el-input>
      <span>{{field.hiddenValue}}</span>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_PRINT">
      <div>
        {{field.userName}}
      </div>
    </template>

    <!--只读-->
    <template v-else-if="field.textType.toLowerCase() == 'readonly' || field.displayType == Constant.PermissionType_READONLY || field.displayType == Constant.PermissionType_DISABLED">
      <template v-if="field.readOnlyShowValOnly">
        <!-- 只读（文本模式） -->
        <el-input 
          type="hidden" 
          autosize 
          v-model="field.value">
        </el-input>
        <template>{{field.userName}}</template>
      </template>
      <template v-else>
        <!-- 只读（控件模式） -->
        <!-- <el-input type="textarea" :readonly="true" autosize v-model="field.userName"></el-input> -->
        <el-tag
          v-for="user in field.data"
          :key="user.id"
          closable
          type="info"
          @close="onTabClose"
        >{{user.name}}</el-tag> 
        <el-button 
          icon="el-icon-user" 
          size="small" 
          @click="dialogVisible = false" 
        />
        <el-dialog 
          title="用户" 
          :visible.sync="dialogVisible" 
          width="30%" 
          :before-close="handleClose"
        >
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </template>
    </template>

    <template v-else-if="field.displayType == Constant.PermissionType_MODIFY">
      <!-- 可编辑 -->
      <!-- <el-input 
        type="textarea" 
        autosize 
        placeholder="请输入内容" 
        v-model="field.userName"
        @change="onChange"
        :disabled="true"
        >
      </el-input> -->
      <el-tag
        v-for="user in field.data"
        :key="user.id"
        closable
        type="info"
        @close="onTabClose(user,field.data)"
      >
        {{user.name}}
      </el-tag>
      <el-button 
        icon="el-icon-user" 
        size="small"
        @click="eject(field.selectMode)" />
      <el-dialog 
        title="用户" 
        style="padding:0;" 
        :visible.sync="dialogVisible" 
        :before-close="handleClose">
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
                    <div class="add-all-data">
                      <el-button plain size="small">添加本页所有</el-button>
                    </div>
                    <div class="current-role">
                      角色：管理员
                    </div>
                    <div class="list-box">
                      <el-checkbox-group v-model="selectedUsers">
                        <el-checkbox 
                          style="display:block"
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
                <div class="selected-role">
                  <div class="add-all-data">
                    <div>
                      已选择用户：
                    </div>
                    <div>
                      <el-button type="danger" size="small">移除所有</el-button>
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

            <!--按角色-->
            <el-tab-pane label="按角色" name="second">
              <div class="role user-common">
                <span class="role-left">
                  <el-scrollbar class="scrollbar">
                    <span class="top-title">角色列表:</span>
                    <ul>
                      <li 
                        v-for="item in allRoles" 
                        :key="item.id" 
                        @click="rolesList(item.id)">
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
                    <div class="add-all-data">
                      <el-button plain size="small">添加本页所有</el-button>
                    </div>
                    <div class="current-role">
                      角色：管理员
                    </div>
                    <div class="list-box">
                      <el-checkbox-group v-model="selectedUsers">
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
                <div class="selected-role">
                  <div class="add-all-data">
                    <div>
                      已选择用户：
                    </div>
                    <div>
                      <el-button type="danger" size="small">移除所有</el-button>
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

            <!--按通讯录-->
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
                    <div class="add-all-data">
                      <el-button plain size="small">添加本页所有</el-button>
                    </div>
                    <div class="current-role">
                      角色：联系人
                    </div>
                    <div class="list-box">
                      <el-checkbox-group v-model="selectedUsers">
                        <el-checkbox 
                          style="display:block"
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
                    <!-- <el-button 
                        size="small"
                        :loading="loadingIcon" 
                        v-if="contactPageCount >= contactPage"  
                        @click="contactLoadingMore"
                      >
                        加载更多
                      </el-button> -->
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
                <div class="selected-role">
                  <div class="add-all-data">
                    <div>
                      已选择用户：
                    </div>
                    <div>
                      <el-button type="danger" size="small">移除所有</el-button>
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

            <!--按查询条件-->
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
                    <el-checkbox-group v-model="selectedUsers">
                      <el-checkbox 
                        style="display:block"
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
                      :total="row_count"
                      @current-change="searchLoadingMore($event)"
                    >
                    </el-pagination>
                  </div>
                </div>
                <div class="selected-role">
                  <div class="add-all-data">
                    <div>
                      已选择用户：
                    </div>
                    <div>
                      <el-button type="danger" size="small">移除所有</el-button>
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
              
            </el-tab-pane> -->
          </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onOk">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </span>
</template>

<script>
import axios from 'axios';
import API from "@/api.js";
import Constant from "@/Constant.js";
export default {
  name: "o-user-select",
  props: ["id"],
  computed: {
    field: function() {
      let formData = this.$parent.findField(this.id);
      if(formData.value) {
        let arr = formData.value.split(";");
        let name = "";
        for(let j=0; j<arr.length; j++) {
          for(let i=0; i<formData.data.length; i++) {
            if(arr[j] == formData.data[i].id) {
              name += formData.data[i].name + ";";
            }
          }
        }
        formData.userName = name.replace(/^(\s|;)+|(\s|;)+$/g, '');
      }else {
        formData.userName = "";
      }
      return formData;
    }
  },
  data: function() {
    return { 
      currentPage:1,
      row_count:0,

      begin:true,
      Constant, 
      dialogVisible: false,
      roleCurrentId:'',
      allRoles:'',//所有角色
      selectedUsers:[],//选中的角色id
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

      singleOrDouble:'',//单选或者复选
      searchValue:'',
      defaultExpandedKeys: [],

    };
  },
  methods: {
    closableTag(id, num) {
      this.selectedUsersList.splice(num,1)
      let list = this.selectedUsers;
      for(let i=0; i<list.length; i++) {
        if(id == list[i]) {
          list.splice(i, 1);
        }
      }
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
              this.row_count = response.data.data.rowCount;
            }
          })
        }
    },
    //判断是单选还是多选
    handleChange(value, direction, movedKeys) {
      if(this.singleOrDouble == "selectOne" && value.length >= 2){
        this.selectedUsers = [];
        alert("只能选中一个");
      }
    },
    //加载更多查询数据
    searchLoadingMore(){
      let that = this;
      this.loadingIcon = true;
      let keyWord = "";
      let pageSize = 10;
      API.searchPage(
        keyWord,
        this.currentPage,
        pageSize,
        {
          onSucess: response => {
            // this.searchData = this.searchData.concat(response.data.data.datas);
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            this.searchData = list;
            this.loadingIcon = false;
          }        
        }
      )
    },
    //加载更多联系人
    contactLoadingMore(num){
      let that = this;
      this.loadingIcon = true;
      let pageSize = 10;
      API.ContactPage(
        num,
        pageSize,
        {
          onSucess: response => {
            // this.linkman = this.linkman.concat(response.data.data.datas);
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            this.linkman = list;
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
    deptLoadingMore(num){
      let that = this;
      this.loadingIcon = true;
      let appId = this.$root.appid;
      let pageSize = 10;
      let departId = this.departId;
      API.departmentPage(
        appId,
        departId,
        num,
        pageSize,
        {
          onSucess: response => {
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            this.deptUser = list;
            //this.deptUser = this.deptUser.concat(response.data.data.datas);
            this.loadingIcon = false;
          }
        }
      );
    },
    //加载更多角色
    rolesLoadingMore(num){
      let that = this;
      this.loadingIcon = true;
      let appId = this.$parent.$parent.getAppId();
      let roles = this.roleId;
      let pageSize = 10;
      API.getRoles(
        appId,
        roles,
        pageSize,
        num,
        {
          onSucess: response => {
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            that.rolesData = list;
            //this.rolesData = this.rolesData.concat(response.data.data.datas);
            this.loadingIcon = false;
          }
        }
      );
    },

    //点击部门树节点触发
    handleNodeClick(e){
      this.searchData = [];
      let that = this;
      this.departId = e.id;
      let deptId = e.id;
      let appId = this.$parent.$parent.getAppId();
      API.getDeptUser(
        appId, 
        deptId,
        {
          onSucess: response => {
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            this.row_count = response.data.data.rowCount;
            this.deptUser = list;
            this.title = e.name;
            this.deptCount = response.data.data.rowCount;
          }
        }
      );
    },
    //部门树
    loadNode(node, resolve) {
      let that = this;
      let appid = this.$root.appid;
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
      //let parentId = "";
      let that = this;
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
              let list = response.data.data.datas;
              if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
                for(let i=0; i<that.selectedUsers.length; i++) {
                  for(let j=0; j<list.length; j++) {
                    if(that.selectedUsers[i] == list[j].id) {
                      list.splice(j,1);
                      j--;
                    }
                  }
                }
              }
              this.row_count = response.data.data.rowCount;
              this.searchData = list;
              this.searchCount = response.data.data.rowCount;
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
      this.searchData = [];
      let that = this;
      let contactsId = "all";
      API.getContact(
        contactsId,
        {
          onSucess: response => {
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            this.row_count = response.data.data.rowCount;
            this.linkman = list;
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
    //选中的角色显示在文本框中
    onOk(){
      if(this.selectedUsers.length && this.selectedUsers.length > 0) {
        let list = this.selectedUsersList;
        let val = "";
        let id = "";
        for(let i=0; i<list.length; i++) {
          id += list[i].id + ";";
          val += list[i].name + ";"; 
        }
        this.field.data = JSON.parse(JSON.stringify(list));
        this.field.value = id;
        this.field.userName = val;
        this.dialogVisible = false;
        if (this.field.refreshOnChanged){//判断是否需要刷新
          this.onChange();
        }
      }else {
        this.field.data = [];
        this.field.value = '';
        this.dialogVisible = false;
      }


      // let value = "";
      // let selectData = "";
      // selectData = this.rolesData
      // if(value.length >= 0) {
      //   let currentData = [];
      //   if(this.field.data && this.field.data.length >0) {
      //     currentData = JSON.parse(JSON.stringify(this.field.data))
      //   }else {
      //     currentData = [];
      //   }
        
      //   for(let i = 0; i < value.length; i++) {
      //     for(let j = 0; j < selectData.length; j++) {
      //       if(value[i] == selectData[j].id){
      //         currentData.push({id:selectData[j].id, name:selectData[j].name});
      //       }
      //     }
      //   }
      //   let uniques = this.removeDuplicateData(currentData);
      //   let val = "";
      //   let id = "";
      //   for(let i=0; i<uniques.length; i++) {
      //     id += uniques[i].id + ";";
      //     val += uniques[i].name + ";"; 
      //   }
      //   this.field.data = JSON.parse(JSON.stringify(uniques));
      //   this.field.value = id;
      //   this.field.userName = val;
      //   this.dialogVisible = false;
      //   if (this.field.refreshOnChanged){//判断是否需要刷新
      //     this.onChange();
      //   }
      // }
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
    rolesList(id) {
      this.searchData = [];
      this.roleCurrentId = id; 
      this.roleId = id;
      let that = this;
      let appId = this.$root.appid; //this.$parent.$parent.getAppId();
      this.$api.getRoles(
        appId, 
        id, 
        10, 
        1,
        {
          onSucess: response => {
            let list = response.data.data.datas;
            if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
              for(let i=0; i<that.selectedUsers.length; i++) {
                for(let j=0; j<list.length; j++) {
                  if(that.selectedUsers[i] == list[j].id) {
                    list.splice(j,1);
                    j--;
                  }
                }
              }
            }
            that.row_count = response.data.data.rowCount;
            that.rolesData = list;
            that.rowCount = response.data.data.rowCount;  
          }
        }
      )



      // axios({
      //     url: "obpm" + "/runtime/"+appId+"/users/selectbox/role?roleId="+id,
      //     method: 'get', 
      // }).then(function (response) {
      //     let list = response.data.data.datas;
      //     if(that.selectedUsers && that.selectedUsers.length>0 && list && list.length>0) {
      //       for(let i=0; i<that.selectedUsers.length; i++) {
      //         for(let j=0; j<list.length; j++) {
      //           if(that.selectedUsers[i] == list[j].id) {
      //             list.splice(j,1);
      //             j--;
      //           }
      //         }
      //       }
      //     }
      //     that.row_count = response.data.data.rowCount;
      //     that.rolesData = list;
      //     that.rowCount = response.data.data.rowCount;  
      // }).catch(
      //     function (error) {
      //       //if(onError) onError(error);
      //       console.log(error);
      //     }
      // )
    },
    //弹窗并显示角色列表
    eject(both){
      if(this.field.data && this.field.data.length>0) {
        this.selectedUsersList = [];
        this.selectedUsers = [];
        for(let i=0; i<this.field.data.length; i++) {
          this.selectedUsersList.push(this.field.data[i]);
          this.selectedUsers.push(this.field.data[i].id);
        }
      }
      this.singleOrDouble = both;
      let that = this;
      let appId = this.$root.appid;// this.$parent.$parent.getAppId();
      //角色的接口
      this.$api.getAllRoles(
        appId,
        {
          onSucess: res => {
            that.allRoles = res.data.data.datas;
            that.dialogVisible = true;
          }
        }
      )
    },
    handleClose(done) {
      // this.$confirm("确认关闭？")
      //   .then(() => {
      //     done();
      //   })
      //   .catch(() => {});
      done();
    },
    //判断是否要刷新
    onChange() {
      this.$parent.refresh(this.id);
    },
  }
};
</script>

<style lang="scss" scoped>
  .el-textarea {
    width: 240px;
  }
  
  .el-pagination {
    padding: 2px 5px;
    color: #303133;
    font-weight: 700;
    display: flex;
    flex-flow: row wrap;
  }
  .onlines {
    width:100%;
    min-height:320px;
    display: -webkit-flex;
    display: flex;
  }
  .search {
    width:100%;
    height:310px;
    display: -webkit-flex;
    display: flex;
  }
  .search-page {
    width:210px;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  // .contact {
  //   width:100%;
  //   min-height:320px;
  //   display: -webkit-flex;
  //   display: flex;
  //   flex-direction: row;
  //   .left {
  //     width:30%;
  //     margin-right:15px;
  //     display: -webkit-flex;
  //     display: flex;
  //     flex-direction: column;
  //     border: 1px solid #ccc;
  //     span:first-child{
  //       height:40px;
  //       line-height: 40px;
  //       padding-left:10px;
  //       background: #f5faf7;
  //       border-bottom: 1px solid #d2d2d2;
  //     }
  //     span:nth-child(2){
  //       height:40px;
  //       line-height: 40px;
  //       padding-left:10px;
  //       border-bottom: 1px solid #d2d2d2;
  //       cursor:pointer;
  //     }
  //     .dept-tree {
  //       padding-top:10px;
  //       height:100%;
  //       padding-left:20px;
  //     }
  //   }
  // }
</style>
