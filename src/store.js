import Vue from 'vue'
import Vuex from 'vuex'
import API from "@/api.js"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apps: [],
    menus: {currentApp: "", appMenus: {}, },
    formdatas: {},
    views: {},
    searchFormTemplate: {},
    domainId:'',
    userId:'',
    myProfile:'',
    softwareName:'',
  },

  getters: {
    currentMenus: state => {
      return state.menus.appMenus[state.menus.currentApp];
    },
  },

  mutations: {
    landingUser(state, data){
      state.domainId = data.doId;
      state.userId = data.userId;
      state.myProfile = data.profile;
    },

    loadApps(state, apps) {
      state.apps = apps;
      state.softwareName = apps[0].name;
    },

    loadMenus(state, { appId, menus }) {
      state.menus.currentApp = appId;
      if (menus) {
        menus.appId = appId; //保存一下appId
        state.menus.appMenus[appId] = menus;
      }
    },

    /**
     * 加载文档
     * @param {} state 
     * @param {*} doc 
     */
    setFormData(state, { uId, doc }) {

      Vue.set(state.formdatas, uId, doc);
      // state.formdatas[uId] = doc;
    },

    /**
     * 
     * @param {*} state 
     * @param {*} param1 
     */
    setSearchFormTemplate(state, { uId, doc }) {
      Vue.set(state.searchFormTemplate, uId, doc);
    },

    // setView(state, { uId, view }) {
    //   Vue.set(state.views, uId, view);
    // },

  },

  actions: {
    //当前登陆的用户
    landingUser(context) {
      API.getMyProfile(
        {
          onSucess: response => {
            let doId = response.data.data.domainId;
            let userId = response.data.data.id;
            let profile = response.data.data;
            context.commit('landingUser', {doId, userId, profile});
          } 
        }
      )
    },


    loadApps(context) {
      console.log("getApplications-->");
      API.getApplications({
        onSucess: response => {
          let apps = response.data.data.applications;
          context.commit('loadApps', apps);

          //如果menus为空，则调用第一个软件的menus
          if (Object.keys(context.state.menus.appMenus).length <= 0) {
            context.dispatch("loadMenus", apps[0].id);
          }
        }
      });
    },

    loadMenus(context, appId) {
      if (!context.state.menus.appMenus[appId]) {
        API.getMenus(appId, {
          onSucess: response => {
            context.commit('loadMenus', { appId: appId, menus: response.data.data })
          }
        });
      }
      else {
        context.commit('loadMenus', { appId: appId })
      }
    },

    getFormData(context, { uId, appId, formId, docId }) {
      API.getForm(appId, formId, docId, {}, {
        onSucess: response => {
          context.commit('setFormData', { uId: uId, doc: response.data.data });
        }
      });
    },

    getDocumentEmpty(context, { uId, appId, formId, exparams }) {
      API.getDocumentEmpty(appId, formId, exparams, {
        onSucess: response => {
          if (response.data.data) {
            context.dispatch("getFormData", { uId: uId, appId: appId, formId: formId, docId: response.data.data.id });
          }
        }
      });
    },

    /**
     * 保存文档
     */
    // saveDocument(context, { uId, appId, formId, docId, data }) {
    //   console.log("uId",uId);
    //   API.saveDocument(appId, formId, docId, data, {
    //   });
    // },

    // initView(context, { uId, appId, viewId, exparams, data }) {
    //   let view = context.state.views[uId];
    //   if (!view) {
    //     API.getViewTemplate(appId, viewId, exparams, {
    //       onSucess: response => {
    //         if (response.data.data) {
    //           view = response.data.data;

    //           API.getViewData(appId, viewId, exparams ? exparams : {}, data, {
    //             onSucess: response => {
    //               let viewData = response.data;
    //               view.data = viewData.data;
    //               context.commit('setView', { uId: uId, view: view });
    //             }
    //           })
    //         }
    //       }
    //     });

    //     API.getSearchFormTemplate(appId, viewId, {
    //       onSucess: response => {
    //         if (response.data.data) {
    //           context.commit('setSearchFormTemplate', { uId: uId, doc: response.data.data });
    //         }
    //       }
    //     });
    //   }
    //   else {
    //     API.getViewData(appId, viewId, exparams ? exparams : {}, data, {
    //       onSucess: response => {
    //         let viewData = response.data;
    //         view.data = viewData.data;
    //         context.commit('setView', { uId: uId, view: view });
    //       }
    //     })
    //   }
    // },
  }
})
