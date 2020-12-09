<template>
  <div class="information" id="information">
    <div style="width:100%;height:100%">
      <iframe src="../../obpm/message/message.html" frameborder="0" width="100%" height="98%">

      </iframe>
    </div>

    <!--以下注释的都是vue写的信息管理，不要删除-->
    <!-- <el-tabs v-model="currentActiveName" :tab-position="tabPosition" @tab-click="handleClick" class="tab-wraper"> -->
      <!--企业动态-->
      <!-- <el-tab-pane label="企业动态" name="first">
        <div class="info-wrap">
          <el-scrollbar class="scrollbar">
            <div class="enterprise">
              <div class="enterprise-header">
                <div class="pull-left">
                  <span>
                    <img src="../assets/images/msg_write_text.png" />
                  </span>
                </div>
                <div class="pull-right num">
                  还可以输入
                  <span>{{remnant}}</span>
                  字
                </div>
              </div>
              <el-input
                class="textarea"
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="information"
                @input="descInput"
                maxlength="140"
              ></el-input>
              <div class="information-content">
                <div class="msg-setting">
                  <div class="msg-wrap">
                    <div class="pull-left">
                      <div>
                        <el-upload
                          class="upload-demo"
                          multiple
                          action=""
                          name="files"
                          :http-request='uploadFile'
                          :file-list="fileList">
                          <span>
                            <i class="fa fa-plus-square-o func-attachement-icon add-icon"></i>
                            上传附件
                          </span>
                        </el-upload>
                      </div>
                      <div class="msg-func-item">
                        <span calss="icon-p" @click.stop="showEmotionDialog('')">
                          <i class="fa fa-smile-o func-attachement-icon"></i>
                          表情
                          <div class="face-box" v-show="showEmotion">
                            <div class="facelist-close">
                              <i class="fa fa-times facelist-ficon_close" aria-hidden="true" @click.stop="showEmotionDialog('false')"></i>
                            </div>
                            <ul class="face-list">
                              <li v-for="(item,index) in emotionList" :key="index">
                                <img :src="item.url" @click.stop.prevent="getEmoticons(item)"/>
                              </li>
                            </ul>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div class="pull-right">
                      <div class="msg-right">
                        <el-button @click="centerDialogVisible = true">
                          发公告
                          <i class="fa fa-volume-up"></i>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="msg-submit clearfix">
                  <div class="pull-left">
                    <label for>发送范围:</label>
                    <el-input v-model="sendRangeName" ref="scope" readonly></el-input>
                    <el-button class="el-icon-plus" @click="PlusSign(true)"></el-button>
                    <el-button class="el-icon-close" @click="minus"></el-button>
                  </div>
                  <div class="pull-right">
                    <div class="msg-right">
                      <el-button size="medium" type="success" @click="adhibition">发布</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tabpanel">
              <el-tabs v-model="activeName" @tab-click="announcementClick">
                <el-tab-pane label="全部" name="first">
                  <div class="tabpanel-box" v-for="(item, index) in messagesList" :key="index">
                
                    <ul class="tabpanel-item" v-if="item.type == 0">
                      <li>
                        <div class="tabpanel-list">
                          <span>
                            <i>da</i>
                          </span>
                          <b class="tabpanel-b">
                            {{item.sender}}
                            <br />{{item.createTime}}
                          </b>
                          <b class="tabpanel-close" @click="deleteMessage(item, '1')">
                            <i class="fa fa-remove icon-color"></i>
                          </b>
                         
                          <p v-html="item.content"></p>
                        
                        </div>
                        <div class="msg-handle" @click="showComments(index, item.id)">
                          <i class="fa fa-comment">&nbsp;&nbsp;评论{{item.commentCount}}</i>
                        </div>
                        <div class="reply-box" v-if="currentArray.indexOf(index) > -1">
                          <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="tabpanelComment"
                            @input="tabpanelInput"
                            maxlength="140"
                          ></el-input>
                          <div class="msg-enter">
                            <span>还可以输入<span class="special">{{Howmanywords}}</span>字</span>
                            <span class="publish">
                              <el-button size="small"  id="publish" @click="doComment(item.sender, item.senderId, item.id, item.content, index)">评论</el-button>
                            </span>
                          </div>
                          <div class="comments">
                            <div class="comm-list" v-for="(el, i) in item.replayData" :key="i">
                              <div class="list-left">
                                <span class="left-one">{{el.sender.substring(el.sender.length-2,el.sender.length)}}</span>
                                <span class="left-two">{{el.sender}}：</span>
                                <span class="left-three">
                                  <span>{{el.content}}</span>
                                  <span class="time">( {{el.createTime}} )</span>
                                </span>
                              </div>
                              <div class="list-right">
                                <span class="del" @click="replyToComment(el.toUser, el.toUserId, el.messageId, el.id, el.content, index)">
                                  回复
                                </span>
                                <span class="reply" @click.stop="deleteReplyMessage(el, i, index)">
                                  删除
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="placard-box" v-if="item.type == 1">
                      <div class="p-header">
                        <div>
                          <i class="fa fa-star icon-color"></i>
                          <span class="title">{{item.title}}</span>
                        </div>
                        <div @click="deleteMessage(item, '1')">
                          <i class="fa fa-remove icon-color"></i>
                        </div>
                      </div>
                      <div class="p-wrap">
                        <span v-html="item.content"></span>
                      </div>
                      <div class="p-footer">
                        <span class="self">
                          {{item.sender}}
                        </span>
                        <span class="release-time">
                          发布于{{item.createTime}}
                        </span>
                      </div>
                    </div>
                  </div>

                </el-tab-pane>
                <el-tab-pane label="公告" name="second">
                  <div class="announcement-box" v-for="(item, index) in announcementList" :key="index">
                    <div class="placard-box" >
                      <div class="p-header">
                        <div>
                          <i class="fa fa-star icon-color"></i>
                          <span class="title">{{item.title}}</span>
                        </div>
                        <div @click="deleteMessage(item, '2')">
                          <i class="fa fa-remove icon-color"></i>
                        </div>
                      </div>
                      <div class="p-wrap">
                        <span v-html="item.content"></span>
                      </div>
                      <div class="p-footer">
                        <span class="self">
                          {{item.sender}}
                        </span>
                        <span class="release-time">
                          发布于{{item.createTime}}
                        </span>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-scrollbar>
        </div>
        
      </el-tab-pane> -->

      <!--工作事项-->
      <!-- <el-tab-pane label="工作事项" name="second">
        <div class="wordmatters">
          <div class="workImage">
            <span class="el-icon-bell"></span>
            <span class="workRemind">提醒</span>
          </div>
          <div class="elTabs">
            <div class="tab-box">
              <div class="select-tab">
                <span 
                  :class="[labelSwitchVal=='first' ? 'tabActive' : '']" 
                  @click="labelSwitch('first')">
                  未读
                </span>
                <span 
                  :class="[labelSwitchVal=='second' ? 'tabActive' : '']" 
                  @click="labelSwitch('second')">
                  全部
                </span>
              </div>
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{currentFlowType?currentFlowType:'类型'}}
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="workHandleClick(0, '全部')">全部</el-dropdown-item>
                  <el-dropdown-item @click.native="workHandleClick(3, '代办')">代办</el-dropdown-item>
                  <el-dropdown-item @click.native="workHandleClick(6, '抄送')">抄送</el-dropdown-item>
                  <el-dropdown-item @click.native="workHandleClick(4, '催办')">催办</el-dropdown-item>
                  <el-dropdown-item @click.native="workHandleClick(2, '回退')">回退</el-dropdown-item>
                  <el-dropdown-item @click.native="workHandleClick(5, '超时')">超时</el-dropdown-item>
                  <el-dropdown-item @click.native="workHandleClick(1, '已送出')">已送出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="btn-red">
              <el-button type="primary" size="midium" class="btn" @click="setAllRead">全部标记已读</el-button>
            </div>
          </div>
        </div>
        <div v-if="labelSwitchVal == 'first'" class="work-box">
          <div class="emptyPage" v-if="isEmptyPage">
            <div class="placeholder-content"></div>
          </div>
          <div class="work-list" v-if="!isEmptyPage">
            <el-scrollbar class="scrollbar">
              <div class="one-list" v-for="(item, index) in unreadWorkItems" :key="index">
                <div class="list-content" @click.stop.prevent="doJump(item, index)">
                  <div>
                    <span :class="[!item.read?'is-read':'','img']">
                      <img v-if="item.subjectType == 1" src="../assets/images/icon_main_msg_01.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 2" src="../assets/images/icon_main_msg_02.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 3" src="../assets/images/icon_main_msg_03.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 4" src="../assets/images/icon_main_msg_04.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 5" src="../assets/images/icon_main_msg_05.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 6" src="../assets/images/icon_main_msg_06.png" class="icon_main_msg">
                      <span ></span>
                    </span>
                    <span>
                      <span v-html="item.summary"></span>
                    </span>
                  </div>
                  <div>
                    <span class="del" @click.stop="deleteWorkItem(item.id, index, 'isUnread')">
                      <i class="el-icon-delete"></i>
                      删除
                    </span>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="page"  v-if="!isEmptyPage">
            <el-pagination
              background
              small
              layout="prev, pager, next,jumper"
              :page-size="30"
              :current-page="1"
              :total="unreadWorkNum"
              @current-change="paging"
            ></el-pagination>
          </div>
        </div>
        <div v-if="labelSwitchVal == 'second'" class="work-box">
          <div class="emptyPage" v-if="allIsEmptyPage">
            <div class="placeholder-content"></div>
          </div>
          <div class="work-list" v-if="!allIsEmptyPage">
            <el-scrollbar class="scrollbar">
              <div class="one-list" v-for="(item, index) in allNotice" :key="index">
                <div class="list-content" @click.stop.prevent="doJump(item)">
                  <div>
                    <span :class="[!item.read?'is-read':'','img']">
                      <img v-if="item.subjectType == 1" src="../assets/images/icon_main_msg_01.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 2" src="../assets/images/icon_main_msg_02.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 3" src="../assets/images/icon_main_msg_03.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 4" src="../assets/images/icon_main_msg_04.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 5" src="../assets/images/icon_main_msg_05.png" class="icon_main_msg">
                      <img v-else-if="item.subjectType == 6" src="../assets/images/icon_main_msg_06.png" class="icon_main_msg">
                    </span>
                    <span>
                      <span v-html="item.summary"></span>
                    </span>
                  </div>
                  <div>
                    <span class="del" @click.stop="deleteWorkItem(item.id, index,'isHaveRead')">
                      <i class="el-icon-delete"></i>
                      删除
                    </span>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="page" v-if="!allIsEmptyPage">
            <el-pagination
              background
              small
              layout="prev, pager, next,jumper"
              :page-size="30"
              :current-page="1"
              :total="allNoticeNum"
              @current-change="paging"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane> -->
      
      <!--我回复的-->
      <!-- <el-tab-pane label="我回复的" name="third" class="my-replay-box">
        <el-tabs v-model="activekeep" @tab-click="replyClick">
          <el-tab-pane label="我回复的" name="first">
            <div v-if="noReply" class="no-reply">
              <div class="placeholder-content"></div>
            </div>
            <div class="my-reply" v-if="!noReply">
              <el-scrollbar class="scrollbar">
                <div class="reply-list" v-for="(item, index) in myReplyData" :key="index">
                  <div class="img">
                    <span>
                      理员
                    </span>
                  </div>
                  <div class="right-box">
                    <div class="top">
                      <span>{{item.sender}}</span>
                      <span class="top-close" @click="deleteReply(item,index, '1')">
                        <i class="fa fa-remove icon-color"></i>
                      </span>
                    </div>
                    <div class="reply-content">
                      {{item.content}}
                    </div>
                    <div class="comment">
                      回复{{item.toUser}}的评论：{{item.toContent}}
                    </div>
                    <div class="date">
                      {{item.createTime}}
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <div class="page" v-if="!noReply">
              <el-pagination
                background
                small
                layout="prev, pager, next,jumper"
                :page-size="30"
                :current-page="1"
                :total="myReplyNum"
                @current-change="paging"
              ></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="回复我的" name="second">
            <div v-if="noReplyMy" class="no-reply">
              <div class="placeholder-content"></div>
            </div>
            <div class="my-reply" v-if="!noReplyMy">
              <el-scrollbar class="scrollbar">
                <div class="reply-list" v-for="(item, index) in receiveData" :key="index">
                  <div class="img">
                    <span>
                      理员
                    </span>
                  </div>
                  <div class="right-box">
                    <div class="top">
                      <span>{{item.sender}}</span>
                      <span class="top-close" @click="deleteReply(item,index, '2')">
                        <i class="fa fa-remove icon-color"></i>
                      </span>
                    </div>
                    <div class="reply-content">
                      {{item.content}}
                    </div>
                    <div class="comment">
                      回复{{item.toUser}}的评论：{{item.toContent}}
                    </div>
                    <div class="date">
                      {{item.createTime}}
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <div class="page" v-if="!noReplyMy">
              <el-pagination
                background
                small
                layout="prev, pager, next,jumper"
                :page-size="30"
                :current-page="1"
                :total="receiveNum"
                @current-change="paging"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane> -->
    <!-- </el-tabs> -->

    <!--发公告弹窗-->
    <!-- <el-dialog class="bulletin-dialog" title="发公告" :visible.sync="centerDialogVisible" width="55%" center>
      <div class="dialog-box">
        <el-scrollbar class="scrollbar">
          <el-form :label-position="labelPosition" label-width="80px">
            <el-form-item label="标题:">
              <el-input v-model="headline"></el-input>
            </el-form-item>
            <el-form-item label="接收人:">
              <el-input v-model="recipient" class="recipientVisible" readonly ref="recipient"></el-input>
              <el-button icon="el-icon-plus" @click="PlusSign(false)"></el-button>
              <el-button icon="el-icon-close" class="minus-msg" @click="eduiminus"></el-button>
            </el-form-item>
            <el-form-item label="公告内容:" class="edit-html">
              <div class="html-box">
                <div>
                  <vue-html5-editor
                    @change="updateData" 
                    :content="textarea">
                  </vue-html5-editor>
                </div>
                <div class="text-num">
                  当前已输入{{currentWordCount}}个字符, 您还可以输入{{wordsRemaining}}个字符。
                </div>
              </div>
            </el-form-item>
            <el-form-item label="其他设置:">
              <el-checkbox v-model="otherSettings">置顶</el-checkbox>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="hiddenBulletinDialog()">取 消</el-button>
        <el-button size="medium" type="primary" @click="eduirelease">发布</el-button>
      </span>
    </el-dialog> -->

    <!--部门树弹窗-->

    <el-dialog 
      title="选择部门" 
      class="dept-dialog" 
      v-if="Receivedby"
      :visible.sync="Receivedby" 
      width="40%">
      <div class="msg-pull-box">
        <el-scrollbar class="scrollbar">
          <el-tree 
            empty-text="加载中..."
            :props="propsPull" 
            :load="loadNodeDept" 
            node-key="id" 
            ref="deptTree" 
            lazy 
            show-checkbox
            :check-strictly="true"
            @check-change="Receivethetitle($event)">
          </el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="Receivedby = false">取消</el-button>
        <el-button size="medium" type="primary" @click="getDeptData">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import API from "@/api.js";
export default {
  props: ["openParams"],
  data() {
    return {
      showEmotion:false,
      imag:'<img src="/obpm/message/img/face/qlx_thumb.gif" />gddd',
      emotionList:[
        {
          type:'[去旅行]',
          path:'<img src="/obpm/message/img/face/qlx_thumb.gif" />',
          url:'/obpm/message/img/face/qlx_thumb.gif'
        },
        {
          type:'[广告]',
          path:'<img src="/obpm/message/img/face/ad_new0902_thumb.gif" />',
          url:'/obpm/message/img/face/ad_new0902_thumb.gif'
        },
        {
          type:'[doge]',
          path:'<img src="/obpm/message/img/face/doge_thumb.gif" />',
          url:'/obpm/message/img/face/doge_thumb.gif'
        },
        {
          type:'[喵喵]',
          path:'<img src="/obpm/message/img/face/mm_thumb.gif" />',
          url:'/obpm/message/img/face/mm_thumb.gif'
        },
        {
          type:'[二哈]',
          path:'<img src="/obpm/message/img/face/moren_hashiqi_thumb.png" />',
          url:'/obpm/message/img/face/moren_hashiqi_thumb.png'
        },
        {
          type:'[哆啦A梦吃惊]',
          path:'<img src="/obpm/message/img/face/dorachijing_thumb.gif" />',
          url:'/obpm/message/img/face/dorachijing_thumb.gif'
        },
        {
          type:'[哆啦A梦花心]',
          path:'<img src="/obpm/message/img/face/dorahaose_thumb.gif" />',
          url:'/obpm/message/img/face/dorachijing_thumb.gif'
        },
        {
          type:'[哆啦A梦微笑]',
          path:'<img src="/obpm/message/img/face/jqmweixiao_thumb.gif" />',
          url:'/obpm/message/img/face/jqmweixiao_thumb.gif'
        },
        {
          type:'[笑cry]',
          path:'<img src="/obpm/message/img/face/xiaoku_thumb.gif" />',
          url:'/obpm/message/img/face/xiaoku_thumb.gif'
        },
        {
          type:'[摊手]',
          path:'<img src="/obpm/message/img/face/pcmoren_tanshou_thumb.png" />',
          url:'/obpm/message/img/face/pcmoren_tanshou_thumb.png'
        },
        {
          type:'[抱手]',
          path:'<img src="/obpm/message/img/face/pcmoren_baobao_thumb.png" />',
          url:'/obpm/message/img/face/pcmoren_baobao_thumb.png'
        },
        {
          type:'[群体围观]',
          path:'<img src="/obpm/message/img/face/lxhweiguan_thumb.gif" />',
          url:'/obpm/message/img/face/lxhweiguan_thumb.gif'
        },

        //12
        {
          type:'[坏笑]',
          path:'<img src="/obpm/message/img/face/pcmoren_huaixiao_thumb.png" />',
          url:'/obpm/message/img/face/pcmoren_huaixiao_thumb.png'
        },
        {
          type:'[舔屏]',
          path:'<img src="/obpm/message/img/face/pcmoren_tian_thumb.png" />',
          url:'/obpm/message/img/face/pcmoren_tian_thumb.png'
        },
        {
          type:'[污]',
          path:'<img src="/obpm/message/img/face/pcmoren_wu_thumb.png" />',
          url:'/obpm/message/img/face/pcmoren_wu_thumb.png'
        },
        {
          type:'[微笑]',
          path:'<img src="/obpm/message/img/face/huanglianwx_thumb.gif" />',
          url:'/obpm/message/img/face/huanglianwx_thumb.gif'
        },
        {
          type:'[嘻嘻]',
          path:'<img src="/obpm/message/img/face/tootha_thumb.gif" />',
          url:'/obpm/message/img/face/tootha_thumb.gif'
        },
        {
          type:'[哈哈]',
          path:'<img src="/obpm/message/img/face/laugh.gif" />',
          url:'/obpm/message/img/face/laugh.gif'
        },
        {
          type:'[挖鼻]',
          path:'<img src="/obpm/message/img/face/wabi_thumb.gif" />',
          url:'/obpm/message/img/face/wabi_thumb.gif'
        },
        {
          type:'[可爱]',
          path:'<img src="/obpm/message/img/face/tza_thumb.gif" />',
          url:'/obpm/message/img/face/tza_thumb.gif'
        },
        {
          type:'[可怜]',
          path:'<img src="/obpm/message/img/face/kl_thumb.gif" />',
          url:'/obpm/message/img/face/kl_thumb.gif'
        },
        {
          type:'[吃惊]',
          path:'<img src="/obpm/message/img/face/cj_thumb.gif" />',
          url:'/obpm/message/img/face/cj_thumb.gif'
        },
        {
          type:'[害羞]',
          path:'<img src="/obpm/message/img/face/shamea_thumb.gif" />',
          url:'/obpm/message/img/face/shamea_thumb.gif'
        },
        {
          type:'[挤眼]',
          path:'<img src="/obpm/message/img/face/zy_thumb.gif" />',
          url:'/obpm/message/img/face/zy_thumb.gif'
        },
        //24
        {
          type:'[闭嘴]',
          path:'<img src="/obpm/message/img/face/bz_thumb.gif" />',
          url:'/obpm/message/img/face/bz_thumb.gif'
        },
        {
          type:'[鄙视]',
          path:'<img src="/obpm/message/img/face/bs2_thumb.gif" />',
          url:'/obpm/message/img/face/bs2_thumb.gif'
        },
        {
          type:'[爱你]',
          path:'<img src="/obpm/message/img/face/lovea_thumb.gif" />',
          url:'/obpm/message/img/face/lovea_thumb.gif'
        },
        {
          type:'[泪]',
          path:'<img src="/obpm/message/img/face/sada_thumb.gif" />',
          url:'/obpm/message/img/face/sada_thumb.gif'
        },
        {
          type:'[偷笑]',
          path:'<img src="/obpm/message/img/face/heia_thumb.gif" />',
          url:'/obpm/message/img/face/heia_thumb.gif'
        },
        {
          type:'[亲亲]',
          path:'<img src="/obpm/message/img/face/qq_thumb.gif" />',
          url:'/obpm/message/img/face/qq_thumb.gif'
        },
        {
          type:'[生病]',
          path:'<img src="/obpm/message/img/face/sb_thumb.gif" />',
          url:'/obpm/message/img/face/sb_thumb.gif'
        },
        {
          type:'[太开心]',
          path:'<img src="/obpm/message/img/face/mb_thumb.gif" />',
          url:'/obpm/message/img/face/mb_thumb.gif'
        },
        {
          type:'[白眼]',
          path:'<img src="/obpm/message/img/face/landeln_thumb.gif" />',
          url:'/obpm/message/img/face/landeln_thumb.gif'
        },
        {
          type:'[右哼哼]',
          path:'<img src="/obpm/message/img/face/yhh_thumb.gif" />',
          url:'/obpm/message/img/face/yhh_thumb.gif'
        },
        {
          type:'[左哼哼]',
          path:'<img src="/obpm/message/img/face/zhh_thumb.gif" />',
          url:'/obpm/message/img/face/zhh_thumb.gif'
        },
        {
          type:'[嘘]',
          path:'<img src="/obpm/message/img/face/x_thumb.gif" />',
          url:'/obpm/message/img/face/x_thumb.gif'
        },
        //36
        {
          type:'[哀]',
          path:'<img src="/obpm/message/img/face/cry.gif" />',
          url:'/obpm/message/img/face/cry.gif'
        },
        {
          type:'[委屈]',
          path:'<img src="/obpm/message/img/face/wq_thumb.gif" />',
          url:'/obpm/message/img/face/wq_thumb.gif'
        },

        {
          type:'[吐]',
          path:'<img src="/obpm/message/img/face/t_thumb.gif" />',
          url:'/obpm/message/img/face/t_thumb.gif'
        },
        {
          type:'[哈欠]',
          path:'<img src="/obpm/message/img/face/haqianv2_thumb.gif" />',
          url:'/obpm/message/img/face/haqianv2_thumb.gif'
        },
        {
          type:'[抱抱_旧]',
          path:'<img src="/obpm/message/img/face/bba_thumb.gif" />',
          url:'/obpm/message/img/face/bba_thumb.gif'
        },
        {
          type:'[怒]',
          path:'<img src="/obpm/message/img/face/angrya_thumb.gif" />',
          url:'/obpm/message/img/face/angrya_thumb.gif'
        },
        {
          type:'[疑问]',
          path:'<img src="/obpm/message/img/face/yw_thumb.gif" />',
          url:'/obpm/message/img/face/yw_thumb.gif'
        },
        {
          type:'[馋嘴]',
          path:'<img src="/obpm/message/img/face/cza_thumb.gif" />',
          url:'/obpm/message/img/face/cza_thumb.gif'
        },
        {
          type:'[拜拜]',
          path:'<img src="/obpm/message/img/face/88_thumb.gif" />',
          url:'/obpm/message/img/face/88_thumb.gif'
        },
        {
          type:'[思考]',
          path:'<img src="/obpm/message/img/face/sk_thumb.gif" />',
          url:'/obpm/message/img/face/sk_thumb.gif'
        },
        {
          type:'[汗]',
          path:'<img src="/obpm/message/img/face/sweata_thumb.gif" />',
          url:'/obpm/message/img/face/sweata_thumb.gif'
        },
        {
          type:'[困]',
          path:'<img src="/obpm/message/img/face/kunv2_thumb.gif" />',
          url:'/obpm/message/img/face/kunv2_thumb.gif'
        },
        //48
        {
          type:'[睡]',
          path:'<img src="/obpm/message/img/face/huangliansj_thumb.gif" />',
          url:'/obpm/message/img/face/huangliansj_thumb.gif'
        },
        {
          type:'[钱]',
          path:'<img src="/obpm/message/img/face/money_thumb.gif" />',
          url:'/obpm/message/img/face/money_thumb.gif'
        },
        {
          type:'[失望]',
          path:'<img src="/obpm/message/img/face/sw_thumb.gif" />',
          url:'/obpm/message/img/face/sw_thumb.gif'
        },
        {
          type:'[酷]',
          path:'<img src="/obpm/message/img/face/cool_thumb.gif" />',
          url:'/obpm/message/img/face/cool_thumb.gif'
        },
        {
          type:'[色]',
          path:'<img src="/obpm/message/img/face/huanglianse_thumb.gif" />',
          url:'/obpm/message/img/face/huanglianse_thumb.gif'
        },
        {
          type:'[哼]',
          path:'<img src="/obpm/message/img/face/hatea_thumb.gif" />',
          url:'/obpm/message/img/face/hatea_thumb.gif'
        },
        {
          type:'[鼓掌]',
          path:'<img src="/obpm/message/img/face/gza_thumb.gif" />',
          url:'/obpm/message/img/face/gza_thumb.gif'
        },
        {
          type:'[晕]',
          path:'<img src="/obpm/message/img/face/dizzya_thumb.gif" />',
          url:'/obpm/message/img/face/dizzya_thumb.gif'
        },
        {
          type:'[悲伤]',
          path:'<img src="/obpm/message/img/face/bs_thumb.gif" />',
          url:'/obpm/message/img/face/bs_thumb.gif'
        },
        {
          type:'[抓狂]',
          path:'<img src="/obpm/message/img/face/crazya_thumb.gif" />',
          url:'/obpm/message/img/face/crazya_thumb.gif'
        },
        {
          type:'[黑线]',
          path:'<img src="/obpm/message/img/face/h_thumb.gif" />',
          url:'/obpm/message/img/face/h_thumb.gif'
        },
        {
          type:'[阴险]',
          path:'<img src="/obpm/message/img/face/yx_thumb.gif" />',
          url:'/obpm/message/img/face/yx_thumb.gif'
        },
        //60
        {
          type:'[怒骂]',
          path:'<img src="/obpm/message/img/face/numav2_thumb.gif" />',
          url:'/obpm/message/img/face/numav2_thumb.gif'
        },
        {
          type:'[互粉]',
          path:'<img src="/obpm/message/img/face/hufen_thumb.gif" />',
          url:'/obpm/message/img/face/hufen_thumb.gif'
        },
        {
          type:'[心]',
          path:'<img src="/obpm/message/img/face/hearta_thumb.gif" />',
          url:'/obpm/message/img/face/hearta_thumb.gif'
        },
        {
          type:'[伤心]',
          path:'<img src="/obpm/message/img/face/unheart.gif" />',
          url:'/obpm/message/img/face/unheart.gif'
        },
        {
          type:'[猪头]',
          path:'<img src="/obpm/message/img/face/pig.gif" />',
          url:'/obpm/message/img/face/pig.gif'
        },
        {
          type:'[熊猫]',
          path:'<img src="/obpm/message/img/face/panda_thumb.gif" />',
          url:'/obpm/message/img/face/panda_thumb.gif'
        },
        {
          type:'[兔子]',
          path:'<img src="/obpm/message/img/face/rabbit_thumb.gif" />',
          url:'/obpm/message/img/face/rabbit_thumb.gif'
        },
        {
          type:'[ok]',
          path:'<img src="/obpm/message/img/face/ok_thumb.gif" />',
          url:'/obpm/message/img/face/ok_thumb.gif'
        },
        {
          type:'[耶]',
          path:'<img src="/obpm/message/img/face/ye_thumb.gif" />',
          url:'/obpm/message/img/face/ye_thumb.gif'
        },
        {
          type:'[good]',
          path:'<img src="/obpm/message/img/face/good_thumb.gif" />',
          url:'/obpm/message/img/face/good_thumb.gif'
        },
        {
          type:'[NO]',
          path:'<img src="/obpm/message/img/face/buyao_org.gif" />',
          url:'/obpm/message/img/face/buyao_org.gif'
        },
        {
          type:'[赞]',
          path:'<img src="/obpm/message/img/face/z2_thumb.gif" />',
          url:'/obpm/message/img/face/z2_thumb.gif'
        },
        //72
        {
          type:'[来]',
          path:'<img src="/obpm/message/img/face/come_thumb.gif" />',
          url:'/obpm/message/img/face/come_thumb.gif'
        },
        {
          type:'[弱]',
          path:'<img src="/obpm/message/img/face/sad_thumb.gif" />',
          url:'/obpm/message/img/face/sad_thumb.gif'
        },
        {
          type:'[草泥马]',
          path:'<img src="/obpm/message/img/face/shenshou_thumb.gif" />',
          url:'/obpm/message/img/face/shenshou_thumb.gif'
        },
        {
          type:'[神马]',
          path:'<img src="/obpm/message/img/face/horse2_thumb.gif" />',
          url:'/obpm/message/img/face/horse2_thumb.gif'
        },
        {
          type:'[囧]',
          path:'<img src="/obpm/message/img/face/j_thumb.gif" />',
          url:'/obpm/message/img/face/j_thumb.gif'
        },
        {
          type:'[浮云]',
          path:'<img src="/obpm/message/img/face/fuyun_thumb.gif" />',
          url:'/obpm/message/img/face/fuyun_thumb.gif'
        },
        {
          type:'[给力]',
          path:'<img src="/obpm/message/img/face/geiliv2_thumb.gif" />',
          url:'/obpm/message/img/face/geiliv2_thumb.gif'
        },
        {
          type:'[围观]',
          path:'<img src="/obpm/message/img/face/wg_thumb.gif" />',
          url:'/obpm/message/img/face/wg_thumb.gif'
        },
        {
          type:'[威武]',
          path:'<img src="/obpm/message/img/face/vw_thumb.gif" />',
          url:'/obpm/message/img/face/vw_thumb.gif'
        },
        {
          type:'[话筒]',
          path:'<img src="/obpm/message/img/face/huatongv2_thumb.gif" />',
          url:'/obpm/message/img/face/huatongv2_thumb.gif'
        },
        {
          type:'[蜡烛]',
          path:'<img src="/obpm/message/img/face/lazhuv2_thumb.gif" />',
          url:'/obpm/message/img/face/lazhuv2_thumb.gif'
        },
        {
          type:'[蛋糕]',
          path:'<img src="/obpm/message/img/face/cakev2_thumb.gif" />',
          url:'/obpm/message/img/face/cakev2_thumb.gif'
        },

      ],
      readStatus:'',
      currentActiveName:'first',
      currentWordCount:0,
      wordsRemaining:10000,
      isEmptyPage: false,
      noReply:false,
      noReplyMy:false,
      allIsEmptyPage: false,
      messagesListNum:'', //企业动态信息列表数量
      messagesList: [],//企业动态信息列表
      currentArray:[],
      currentIndex:'', //点击回复时的index值
      isSendRange:'',
      sendRangeList:[], //发送范围部门列表
      sendRangeName:'', //发送范围部门名字
      deptList:[],
      otherSettings:false,
      labelPosition: 'right',
      fileList: [],
      tabPosition: "left",
      information: "",
      msgsubmit: "",
      headline: "",
      recipient: "",
      selectDeptList: "", //发公告窗口选择的部门数据
      Howmanywords: 140,
      tabpanelComment: "",
      textarea: "",
      workslide: "first",
      activekeep: "first",
      activeName: "first",
      dialogVisible: false,
      Receivedby: false, //发公告里面的加号弹框
      centerDialogVisible: false,
      remnant: 140,
      eduiPlus: 0,
      eduisubtract: 10000,
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      propsPull: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },

      //评论回复接口所需的参数缓存
      replyToUser: '',
      replyToUserId: '',
      replyMessageId: '',
      replyCommentId: '',
      replyTocontent: '',

      labelSwitchVal:'first',
      unreadWorkItems: [], //未读工作事项
      unreadWorkNum:0,
      allNotice:[], //全部工作事项
      allNoticeNum:0,
      myReplyData: [],
      myReplyNum: 0,
      receiveNum: 0, 
      receiveData: [],
      announcementList:[],
      currentFlowType:'',
      currentFlowTypeNum:'',
      flowType:'first',

    };
  },
  created() {
    //this.notices();
    this.getMessagesList();
    console.log("this.openParams----->",this.openParams);
    if(this.openParams.isWorkMatters) {
      this.currentActiveName = 'second';
      let readStatus = 0;
      let type=0;
      let data = {
        readStatus: 0,
        type: 0,
      }
      this.$api.getNotice(
        data,
        {
          onSucess: res => {
            if(res.data.data.datas.length == 0) {
              this.isEmptyPage = true;
            }else {
              this.unreadWorkNum = res.data.data.rowCount;
              this.unreadWorkItems = res.data.data.datas;
            }
          }
        }
      )
    }
  },
  methods: {
    showEmotionDialog(val) {
      if(val) {
        this.showEmotion = false;
      }else {
        this.showEmotion = !this.showEmotion;
      }
      
    },
    getEmoticons(item) {
      console.log("item--->",item);
      this.information += item.type;
    },
    deleteReplyMessage(el, index, parentIndex) {
      let commentId = el.id, 
          messageId = el.messageId;
      this.$confirm('删除后无法恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteReply(
          commentId, 
          messageId,
          {
            onSucess: res => {
              if(res.data.status == 1) {
                this.$notify({
                  title: '删除成功!',
                  message: '',
                  type: 'sucess'
                })
                this.messagesList[parentIndex].replayData.splice(index,1);
                this.$forceUpdate();
              }
            }
          }
        )
      }).catch(() => {
                 
      });
    },
    hiddenBulletinDialog() {
      this.headline = "";
      this.recipient = "";
      this.textarea = "";
      this.centerDialogVisible = false;
    },
    deleteMessage(item, type) {
      let messageId = item.id;
      this.$confirm('删除后无法恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteMessage(
          messageId,
          {
            onSucess: response => {
              if(response.data.status == 1) {
                if(type == '1') {
                  this.$api.getMessagesList(
                    {
                      onSucess: res => {
                        this.messagesListNum = res.data.data.rowCount
                        this.messagesList = res.data.data.datas;
                      }
                    }
                  )
                }else if(type == '2') {
                  this.$api.getAnnouncement(
                    {
                      onSucess: res => {
                        this.announcementList = res.data.data.datas;
                      }
                    }
                  )
                }
              }
            }
          }
        )
      }).catch(() => {
                 
      });

    },
    //我回复的（删除）
    deleteReply(item, index, num) {
      let commentId = item.id, 
          messageId = item.messageId;
      this.$confirm('删除后无法恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteReply(
          commentId, 
          messageId,
          {
            onSucess: res => {
              if(res.data.status == 1) {
                this.$notify({
                  title: '删除成功!',
                  message: '',
                  type: 'sucess'
                })
                if(num == '1') {
                  this.myReplyData.splice(index,1);
                }else if(num == '2') {
                  this.receiveData.splice(index, 1);
                }
                this.$forceUpdate();
              }
            }
          }
        )
      }).catch(() => {
                 
      });
    },

    doJump(item, index) {
      let obj = JSON.parse(item.linkParams);
      let params = {
        appId: this.$root.appid,
        linkType:'00',
        actionContent: obj._formid,
        name: '流程',
        docId: obj._docid,
        _select: obj._docid,
      };
      this.$emit("add-tab", params);
      if(index >= 0) {
        this.$api.noticeRead(
          item.id,
          {
            onSucess: () => {

            }
          }
        )
        this.unreadWorkItems.splice(index,1);
        if(this.unreadWorkItems.length == 0) {
          this.isEmptyPage = true;
        }
      }
    },
    announcementClick(tab) {
      if(tab.index == 1) {
        this.$api.getAnnouncement(
          {
            onSucess: res => {
              this.announcementList = res.data.data.datas;
            }
          }
        )
      }
    },
    paging() {

    },
    workHandleClick(val, currentType) {
      console.log("----------->menu", val)
      this.currentFlowType = currentType;
      this.currentFlowTypeNum = val;
      let readStatus = '';
      let type = val;
      let data;
      if(this.flowType == 'first') {
        data = {
          readStatus: 0,
          type: val,
        };
        this.$api.getNotice(
          data,
          {
            onSucess: res => {
              if(res.data.data.datas.length == 0) {
                this.isEmptyPage = true;
              }else {
                this.isEmptyPage = false;
                this.unreadWorkNum = res.data.data.rowCount;
                this.unreadWorkItems = res.data.data.datas;
              }
            }
          }
        )
      }else if(this.flowType == 'second') {
        data = {
          readStatus: '',
          type: val,
        };
        this.$api.getNotice(
          data,
          {
            onSucess: res => {
              this.allNoticeNum = res.data.data.rowCount;
              this.allNotice = res.data.data.datas;
              if(res.data.data.datas.length <= 0) {
                this.allIsEmptyPage = true;
              }
            }
          }
        )
      }
        
      
    },

    replyClick(tab) {
      if(tab.index == 1) {
        let currpage = 1;
        let _rowcount = 30
        this.$api.getReceive(
          currpage,
          _rowcount,
          {
            onSucess: res => {
              if(res.data.data.rowCount <=0 ) {
                this.noReplyMy = true;
              }
              this.receiveNum = res.data.data.rowCount;
              this.receiveData = res.data.data.datas;
            }
          }
        )
      }
    },

    handleClick(tab) {
      if(tab.index == 1) {
        let readStatus = 0;
        let type=0;
        let data = {
          readStatus: 0,
          type: 0,
        }
        this.$api.getNotice(
          data,
          {
            onSucess: res => {
              if(res.data.data.datas.length == 0) {
                this.isEmptyPage = true;
              }else {
                this.unreadWorkNum = res.data.data.rowCount;
                this.unreadWorkItems = res.data.data.datas;
              }
            }
          }
        )
      }else if(tab.index == 2) {
        let currpage = 1;
        let _rowcount = 30
        this.$api.getMyreply(
          currpage,
          _rowcount,
          {
            onSucess: res => {
              if(res.data.data.rowCount <=0 ) {
                this.noReply = true;
              }
              this.myReplyNum = res.data.data.rowCount;
              this.myReplyData = res.data.data.datas;
            }
          }
        )
      }
    },

    //全部标记已读
    setAllRead() {
      this.$api.setAllRead(
        {
          onSucess: res => {
            console.log("res-->",res);
            if(res.data.status) {
              this.readStatus = 0;
              let type=0;
              let data = {
                readStatus: 0,
                type: this.currentFlowTypeNum?this.currentFlowTypeNum:0,
              }
              this.$api.getNotice(
                data,
                {
                  onSucess: res => {
                    if(res.data.data.datas.length == 0) {
                      this.isEmptyPage = true;
                    }else {
                      this.unreadWorkNum = res.data.data.rowCount;
                      this.unreadWorkItems = res.data.data.datas;
                    }
                  }
                }
              )
            }
            
          }
        }
      )
    },

    //删除工作事项
    deleteWorkItem(id, index, val) {
      this.$confirm('删除后无法恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteNotice (
          id,
          {
            onSucess: res => {
              if(res.data.status == 1) {
                this.$notify({
                  title: '删除成功!',
                  message: '',
                  type: 'sucess'
                })
                if(val == 'isUnread') {
                  this.$api.getNotice(
                    {
                      readStatus: 0,
                      type: 0,
                    },
                    {
                      onSucess: res => {
                        if(res.data.data.datas.length == 0) {
                          this.isEmptyPage = true;
                        }else {
                          this.unreadWorkNum = res.data.data.rowCount;
                          this.unreadWorkItems = res.data.data.datas;
                        }
                      }
                    }
                  )
                }else if(val == 'isHaveRead') {
                  this.allNotice.splice(index, 1);
                  if(this.allNotice.length <= 0) {
                    this.allIsEmptyPage = true;
                  }
                }
              }
            }
          }
        )
      }).catch(() => {
                 
      });
    },

    //工作事项
    labelSwitch(val) {
      this.labelSwitchVal = val;
      //this.currentFlowType = '';
      if(val == 'first') {
        this.flowType = 'first';
        this.readStatus = 0;
        let type=0;
        let data = {
          readStatus: 0,
          type: this.currentFlowTypeNum?this.currentFlowTypeNum:0,
        }
        this.$api.getNotice(
          data,
          {
            onSucess: res => {
              if(res.data.data.datas.length == 0) {
                this.isEmptyPage = true;
              }else {
                this.unreadWorkNum = res.data.data.rowCount;
                this.unreadWorkItems = res.data.data.datas;
              }
            }
          }
        )
      }else if(val == 'second') {
        this.flowType = 'second';
        let readStatus = '';
        let type=0;
        let data = {
          readStatus: '',
          type: this.currentFlowTypeNum?this.currentFlowTypeNum:0,
        }

        this.$api.getNotice(
          data,
          {
            onSucess: res => {
              this.allNoticeNum = res.data.data.rowCount;
              this.allNotice = res.data.data.datas;
              if(res.data.data.datas.length <=0) {
                this.allIsEmptyPage = true
              }
            }
          }
        )
      }
    },
    //回复
    doComment(toUser, toUserId, messageId, toContent, index) {
      let newData = 
          encodeURIComponent("content.toUser") + '=' + encodeURIComponent(this.replyToUser?this.replyToUser:toUser) + '&' + 
          encodeURIComponent("content.toUserId") + '=' + encodeURIComponent(this.replyToUserId?this.replyToUserId:toUserId) + '&' +
          encodeURIComponent("content.messageId") + '=' + encodeURIComponent(this.replyMessageId?this.replyMessageId:messageId) + '&' +
          encodeURIComponent("content.commentId") + '=' + encodeURIComponent(this.replyCommentId) + '&' +
          encodeURIComponent("toContent") + '=' + encodeURIComponent(this.replyTocontent?this.replyTocontent:toContent) + '&' +
          encodeURIComponent("content.content") + '=' + encodeURIComponent(this.tabpanelComment) + '&' +
          encodeURIComponent("content.attachment") + '=' + encodeURIComponent('');
      this.$api.doComment(
        newData,
        {
          onSucess: res => {
            if(res.data.status == 1) {
              this.messagesList[this.currentIndex?this.currentIndex:index].replayData.unshift(res.data.data);
              this.$forceUpdate()
              this.replyToUser = '';
              this.replyToUserId = '';
              this.replyMessageId = '';
              this.replyCommentId = '';
              this.replyTocontent = '';
              this.tabpanelComment = '';
            }
          }
        }
      )
    },
    //评论回复
    replyToComment(toUser, toUserId, messageId, id, content, index){
      this.tabpanelComment = "回复 @" + toUser + " ";
      this.replyToUser = toUser;
      this.replyToUserId = toUserId;
      this.replyMessageId = messageId;
      this.replyCommentId = id;
      this.replyTocontent = content;
      this.currentIndex = index;
    },

    //展示评论区
    showComments(index, id) {
      if(this.currentArray.indexOf(index) > -1) {
        for(let i=0; i<this.currentArray.length; i++) {
          if(index == this.currentArray[i]) {
            this.currentArray.splice(i, 1);
            return
          }
        }
      }else {
        this.currentArray.push(index);
        this.$api.getMessagesReplay(
          id,
          {
            onSucess: res => {
              debugger
              this.messagesList[index].replayData = res.data.data.datas;
              this.$forceUpdate();
            }
          }
        )
      }
    },
    //上传文件
    uploadFile(e) {
      let fileArray = e.file;
			let file = fileArray;
			let that = this;
      let form = new FormData();
      let id = 'WU_FILE_0',
          name = e.file.name,
          type = e.file.type,
          lastModifiedDate = e.file.lastModifiedDate,
          size = e.file.size;
      form.append("id", id);
      form.append("name", name);
      form.append("type", type);
      form.append("lastModifiedDate", lastModifiedDate);
      form.append("size", size);
      form.append("file", file);
      console.log("form---->",form);
			axios({
				headers: {
					"content-type": "multipart/form-data;boundary=" + Math.random()
				},
				data: form,
        url:"/obpm/message/servlet/upload",
				method: "post"
			})
			.then(function(res) {
        let obj = {
					name: res.data.name,
					path: res.data.url,
					url: "http://" + window.location.host + "/obpm/" + res.data.url,
				};
				that.fileList.push(obj);
			})
			.catch(function(error) {
				console.log(error);
			});


    },
    
    getDeptData() {
      let nodes = this.$refs.deptTree.getCheckedNodes();
      let dept = [];
      let name = [];
      if(nodes && nodes.length>0) {
        for(let i=0; i<nodes.length; i++) {
          let obj = {};
          obj.deptId = nodes[i].id;
          obj.deptName = nodes[i].name;
          name += nodes[i].name + ';'; 
          dept.push(obj);
        }
        if(this.isSendRange) {
          this.sendRangeName = name;
          this.sendRangeList = dept
        }else {
          this.recipient = name;
          this.selectDeptList = dept;
        }
        
      }
      
      this.Receivedby = false;

    },

    loadNodeDept(node, resolve) {
      let appid = this.$root.appid;
      if (node.level === 0) {
        API.getDepartmentsByParentId(appid, "", {
          onSucess: function(response) {
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
    //获取发送范围的数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        axios({
          url:
            "obpm" + "/portal/component/user/getDepartmentsByParentId.action",
          method: "get",
          params: {
            parentId: ""
          }
        })
          .then(res => {
            resolve(res.data.data);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios({
          url:
            "obpm" + "/portal/component/user/getDepartmentsByParentId.action",
          method: "get",
          params: {
            parentId: node.key
          }
        })
          .then(res => {
            resolve(res.data.data);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //获取接收人的数据
    loadNodePull(node, resolve) {
      if (node.level === 0) {
        axios({
          url:
            "obpm" + "/portal/component/user/getDepartmentsByParentId.action",
          method: "get",
          params: {
            parentId: ""
          }
        })
          .then(res => {
            resolve(res.data.data);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios({
          url:
            "obpm" + "/portal/component/user/getDepartmentsByParentId.action",
          method: "get",
          params: {
            parentId: node.key
          }
        })
          .then(res => {
            resolve(res.data.data);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //发送公告里面的加号弹框
    PlusSign(val) {
      if(val) {
        this.isSendRange = true;
      }else {
        this.isSendRange = ''
      }
      this.$api.getAllDeptList(
        {
          onSucess: res => {
            this.deptList = res.data.data;
          }
        }
      )
      this.Receivedby = true;
    },
    //把获取到的数据放到接受人里面去
    Receivethetitle(event) {
      this.recipient = event.name;
    },
    Sendthescope(event) {
      this.msgsubmit = event.name;
    },
    
    updateData(event){
      
      this.textarea = event
      console.log("event--->",event);
      this.currentWordCount = event.length;
      this.wordsRemaining = 10000 - event.length;
    },

    eduirelease() {
      let that = this;
      if (this.headline.length == 0) {
        this.$message({
          message:"标题不能为空!",
          type:'warning'
        })
      } else if (this.recipient.length == 0) {
        this.$message({
          message:"接收人不能为空!",
          type:'warning'
        })
      } else if (this.textarea.length == 0) {
        this.$message({
          message:"内容不能为空!",
          type:'warning'
        })
      } else {
        let userData = {
          user: [],
          dept: this.selectDeptList,
        }
        let newData = encodeURIComponent("content.title") + '=' + encodeURIComponent(this.headline) + '&' + 
            encodeURIComponent("content.content") + '=' + encodeURIComponent( this.textarea) + '&' +
            encodeURIComponent("content.attachment") + '=' + encodeURIComponent('') + '&' +
            encodeURIComponent("content.scope") + '=' + encodeURIComponent(2) + '&' +
            encodeURIComponent("receiverInfo") + '=' + encodeURIComponent(JSON.stringify(userData)) + '&' +
            encodeURIComponent("content.type") + '=' + encodeURIComponent(1) + '&' +
            encodeURIComponent("content.sticky") + '=' + encodeURIComponent(this.otherSettings);
        this.$api.makeAnnouncement(
          newData,
          {
            onSucess: res => {
              if(res.data.status == 1) {
                this.otherSettings = false;
                that.getMessagesList();
                that.centerDialogVisible = false;
                that.$notify({
                  title: res.data.message,
                  message: '',
                  type: 'success'
                });
                this.$api.getAnnouncement(
                  {
                    onSucess: res => {
                      this.announcementList = res.data.data.datas;
                    }
                  }
                )
              }else {
                that.centerDialogVisible = false;
                that.$notify({
                  title: '发布失败',
                  message: '',
                  type: 'error'
                });
              }
            }
          }
        )
        this.headline = "";
        this.recipient = "";
        this.textarea = "";
      }
    },
    tabpanelInput() {
      let txtVal = this.tabpanelComment.length;
      this.Howmanywords = 140 - txtVal;
    },
    eduiInput() {
      let txtVal = this.textarea.length;
      this.eduisubtract = 10000 - txtVal;
      this.eduiPlus = 0 + txtVal;
    },
    descInput() {
      let txtVal = this.information.length;
      this.remnant = 140 - txtVal;
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //重置发送范围的输入框
    minus() {
      this.sendRangeName = "";
    },
    eduiminus() {
      console.log("this.recipient-->",this.recipient);
      console.log("this.selectDeptList-->",this.selectDeptList);
      this.recipient = "";
      this.selectDeptList = "";
    },
    adhibition() {
      let that = this;
      if (!this.information) {
        this.$message({
          message:"内容不能为空!",
          type:'warning'
        })
      } else if (!this.sendRangeName) {
        this.$message({
          message:"发送范围不能为空!",
          type:'warning'
        })
      } else {
        let userData = {
          user: [],
          dept: this.sendRangeList,
        }
        let newData = 
            encodeURIComponent("content.content") + '=' + encodeURIComponent(this.information) + '&' +
            encodeURIComponent("content.attachment") + '=' + encodeURIComponent([]) + '&' +
            encodeURIComponent("content.scope") + '=' + encodeURIComponent(2) + '&' +
            encodeURIComponent("receiverInfo") + '=' + encodeURIComponent(JSON.stringify(userData)) + '&' +
            encodeURIComponent("content.type") + '=' + encodeURIComponent(0);
        this.$api.annouce(
          newData,
          {
            onSucess: res => {
              if(res.data.status == 1) {
                this.information = '';
                this.sendRangeName = '';
                this.sendRangeList = [];
                this.getMessagesList();
                that.$notify({
                  title: res.data.message,
                  message: '',
                  type: 'success'
                });
              }
            }
          }
        )
      }
    },
    //获取企业动态公告和评论
    getMessagesList() {
      this.$api.getMessagesList(
        {
          onSucess: res => {
            this.messagesListNum = res.data.data.rowCount
            //this.messagesList = res.data.data.datas;
            let newData = res.data.data.datas.map(item => {
              return {
                attachment: item.attachment,
                comment: item.comment,
                commentCount: item.commentCount,
                content: this.getEmot(item.content),
                createTime: item.createTime,
                id: item.id,
                module: item.module,
                receiverDeptId: item.receiverDeptId,
                receiverId: item.receiverId,
                receiverInfo: item.receiverInfo,
                scope: item.scope,
                sender: item.sender,
                senderDept: item.senderDept,
                senderDeptId:item.senderDeptId,
                senderId: item.senderId,
                sticky: item.sticky,
                title: item.title,
                type: item.type,
              }
            })
            this.messagesList = newData;
          }
        }
      )
    },
    getEmot(val) {
    //   eplaceFace : function(str){
    //     if(str && str != undefined){
    //       var re = /\[.[^[]*\]/g; 
    //       var faceArr = str.match(re);
    //       if(faceArr != null && faceArr.length > 0){
    //         for(var i = 0; i < faceArr.length; i++){
    //           var fileName = Message.Util.cache.mapping["face_"+faceArr[i]];
    //           str = str.replace(faceArr[i],'<img src="img/face/'+fileName+'" border="0" />');
    //         }
    //       }
    //       return str;
    //     }
    //   },
      let value = val;
      let emo = '';
      for(let i=0; i<this.emotionList.length; i++) {
        //value = value.replace(this.emotionList[i].type,'<img src="obpm/message/img/face/ad_new0902_thumb.gif" />');
        
        value = value.replace(this.emotionList[i].type,this.emotionList[i].path);
        console.log("value.--->",value)
      }
      return value;
    },
  }
};
</script>

