// 引入 axios
import axios from 'axios';
import Constant from "@/Constant.js"
//const contextPath = "obpm";
const contextPath = Constant.contextPath;
// axios.defaults.baseURL = "http://localhost:8080/";
/*
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

*/

export default {
    getMyProfile: function ({ onSucess, onError }) {
        axios.get(contextPath + '/runtime/users/myprofile').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    getProfile: function (id, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/users/profile?id=' + id).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 部门选择
     * http://localhost:8080/obpm/portal/component/user/getDepartmentsByParentId.action?parentId=Z42xU8LmniRouZ93E7s
     */
    // getDepartmentsByParentId: function(parentId,  { onSucess, onError }){
    //     axios.get(contextPath + '/portal/component/user/getDepartmentsByParentId.action?parentId=' + parentId)
    //     .then(function (response) {
    //         if (onSucess) onSucess(response);
    //     }).catch(
    //         function (error) {
    //             if (onError) onError(error);
    //         }
    //     );
    // },
    getDepartmentsByParentId: function(appid,parentId,  { onSucess, onError }){
        axios.get(contextPath + '/runtime/' + appid + '/departments/selectbox/childs?parentId=' + parentId)
        .then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    
    /**
     * 主页锁屏功能
     */
    isLock: function (password, { onSucess, onError }) {
        // axios.put(contextPath + '/runtime/users/unlock?pwd=' + password).then(function (response) {
        //     if (onSucess) onSucess(response);
        // }).catch(
        //     function (error) {
        //         if (onError) onError(error);
        //     }
        // );

        axios({
            url: contextPath + '/runtime/users/unlock',
            method: 'put',
            data: password,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
            


    },
    /**
     * 5.13挂起流程
     * 保存文档并挂起流程。
     * 请求方式：PUT
     * 请求地址：/runtime/{applicationId}/documents/{docId}/workflows/suspend
     */
    suspendWorkflow: function (appId, docId, { onSucess, onError }) {
        axios.put(contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/suspend').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 5.14恢复流程
     * 请求方式：PUT
     * 请求地址：/runtime/{applicationId}/documents/{docId}/workflows/recovery
     */
    recoveryWorkflow: function (appId, docId, { onSucess, onError }) {
        axios.put(contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/recovery').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 5.11撤回流程
     * 请求方式：PUT
     * 请求地址：/runtime/{applicationId}/documents/{docId}/workflows/retracement
     */
    retracementWorkflow: function (appId, docId, { onSucess, onError }) {
        axios.put(contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/retracement').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 5.12终止流程
     * 请求方式：PUT
     * 请求地址：/runtime/{applicationId}/documents/{docId}/workflows/termination
     */
    terminationWorkflow: function (appId, docId, attitude, { onSucess, onError }) {
        axios.put(contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/termination?attitude=' + attitude).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    getApplications: function ({ onSucess, onError }) {
        axios.get(contextPath + '/runtime/applications').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    getMenus: function (appId, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/menus').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    getHomePageConfig: function ({ onSucess, onError }) {
        axios.get(contextPath + '/runtime/homepage/config').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //http://localhost:8081/obpm/runtime/homepage/config
    setHomePageConfig: function (jsonData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/homepage/config',
            method: 'post',
            data:jsonData,
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  

    },

    getHomePageConfigWithPhone: function (appId, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/homepage/phoneConfig').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    getStartMenus: function (appId, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/flowcenters/startmenus').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    
    getMainPendings:  function (appId, data, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + appId + "/flowcenters/pendings",
            method: "get",
            params: data,
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },
    getPendings: function (appId, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/flowcenters/navs/pendings?applicationId=' + (appId ? appId : '')).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    getPendingList: function (appId, params, { onSucess, onError }) {
        var urlParams = '';
        for (var key in params) {
            if (urlParams == '') {
                urlParams += '?';
            } else {
                urlParams += '&';
            }
            urlParams += key + '=' + params[key];
        }
        axios.get(contextPath + '/runtime/' + (appId ? appId : '') + '/flowcenters/pendings' + urlParams).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    getPendingListWithWidget: function (pageNo, linesPerPage, { onSucess, onError }) {
        var _pageNo = pageNo ? pageNo : 1;
        var _linesPerPage = linesPerPage ? linesPerPage : 2147483646;
        axios.get(contextPath + '/runtime/widget/myPending?pageNo=' + _pageNo + '&linesPerPage=' + _linesPerPage).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    getProcesseds: function (appId, id, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + appId + "/flowcenters/processeds",
            method: "get",
            params: {
                flowId: id,
            }
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    getMainProcesseds: function (appId, data, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + appId + "/flowcenters/processeds",
            method: "get",
            params: data,
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    getNavsPeddings: function (appId, { onSucess, onError }) {
        axios({
            url: contextPath +  "/runtime/flowcenters/navs/pendings",
            method: "get",
            params: {
              applicationId: appId,
            }
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    getNavsProcesseds: function (appId, { onSucess, onError }) {
        axios({
            url: contextPath +  "/runtime/flowcenters/navs/processeds",
            method: "get",
            params: {
              applicationId: appId,
            }
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    getProcessedList: function (appId, params, { onSucess, onError }) {
        var urlParams = '';
        for (var key in params) {
            if (urlParams == '') {
                urlParams += '?';
            } else {
                urlParams += '&';
            }
            urlParams += key + '=' + params[key];
        }
        axios.get(contextPath + '/runtime/' + (appId ? appId : '') + '/flowcenters/processeds' + urlParams).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    getProcessedListWithWidget: function (pageNo, linesPerPage, { onSucess, onError }) {
        var _pageNo = pageNo ? pageNo : 1;
        var _linesPerPage = linesPerPage ? linesPerPage : 2147483646;
        axios.get(contextPath + '/runtime/widget/myProcessing?pageNo=' + _pageNo + '&linesPerPage=' + _linesPerPage).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    getViewTemplate: function (appId, viewId, exparams, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/views/' + viewId + '/template').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //获取视图打印模板
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/views/__g4P1Z1Dms6kyAyMccsl/template?appId=sOZu9kthmxyP8qQfq0e&viewId=__g4P1Z1Dms6kyAyMccsl&isPrint=true
    getPrintViewTemplate: function (appId, viewId, isPrint, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/views/' + viewId + '/template?appId=' + appId + "&viewId=" + viewId + "&isPrint=" + isPrint).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/views/n3RPxv8mWq8i8PpPkle/template?appId=sOZu9kthmxyP8qQfq0e&viewId=n3RPxv8mWq8i8PpPkle&test=11111&opentarget=target&containTitle=
    getBlankViewTemplate: function (appId, jsonData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/views/' + jsonData.viewId + '/template',
            method: 'get',
            params: jsonData,
           
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //树形视图
    getViewTemplateP: function (appId, viewId, jsonData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/views/' + viewId + '/template',
            method: 'get',
            params: jsonData,
           
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
        // axios.get(contextPath + '/runtime/' + appId + '/views/' + viewId + '/template?parentId='+parentId).then(function (response) {
        //     if (onSucess) onSucess(response);
        // }).catch(
        //     function (error) {
        //         if (onError) onError(error);
        //     }
        // );
    },

    //折叠视图
    //?appId=sOZu9kthmxyP8qQfq0e&viewId=KEemd2e0Yn9a4qCw3iT&opentarget=detail&containTitle=%E6%8A%98%E5%8F%A0%E8%A7%86%E5%9B%BE
    getCollapsedviewTemplate: function (appId, exparams, { onSucess, onError }) {
        let viewId = exparams.viewId;
        let opentarget = exparams.opentarget;
        let containTitle = exparams.containTitle;
        axios.get(contextPath + '/runtime/' + appId + '/views/' + viewId + '/template?appId=' + appId + "&viewId=" + viewId + "&opentarget=" + opentarget + "&containTitle" + containTitle).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    getSearchFormTemplate: function (appId, viewId, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/views/' + viewId + '/searchformtemplate').then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    

    /**
     * 获取视图数据
     */
    getViewData: function (appId, viewId, params, data, { onSucess, onError }) {
        var urlParams = '';
        var parentId = params.parentId ? params.parentId : '';
        var sortCol = params.sortCol ? params.sortCol : '';
        var sortStatus = params.sortStatus ? params.sortStatus : '';
        var currpage = params.currpage ? params.currpage : '1';
        var lines = params.lines ? params.lines : '';
        var treedocid = params.treedocid ? params.treedocid : '';
        var parentNodeId = params.parentNodeId ? params.parentNodeId : '';
        var docid = params.docid ? params.docid : '';
        var fieldid = params.fieldid ? params.fieldid : '';
        var isRelate = params.isRelate ? params.isRelate : '';
        var startDate = params.startDate ? params.startDate : '';
        var endDate = params.endDate ? params.endDate : '';
        var exparams = params.exparams ? params.exparams : '';
        var parentParam = params.parentParam ? params.parentParam : '';
        urlParams += '?parentId=' + parentId + '&sortCol=' + sortCol +
            '&sortStatus=' + sortStatus + '&_currpage=' + currpage +
            '&lines=' + lines + '&treedocid=' + treedocid +
            '&parentNodeId=' + parentNodeId + '&_docid=' + docid +
            '&_fieldid=' + fieldid + '&isRelate=' + isRelate +
            '&startDate=' + startDate + '&endDate=' + endDate + 
            '&parentParam=' + parentParam;
            
        if (data && exparams) {
            data = Object.assign(data, exparams);
        }

        axios.post(contextPath + '/runtime/' + appId + '/views/' + viewId + '/documents' + urlParams, data ? data : {}).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },


    //http://localhost:8081/obpm
    getTreeViewTemplate: function (appId, viewId, hasListview, { onSucess, onError }) {
        axios.get(contextPath + "/runtime/" + appId + "/views/" + viewId + "/template?appId=" + appId + "&viewId=" + viewId + "&hasListview=" + hasListview).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 获取树形视图数据
     */
    getTreeViewData: function (appId, viewId, params, data, name, { onSucess, onError }) {
        var urlParams = '';
        var currpage = params.currpage ? params.currpage : '1';
        var sortCol = params.sortCol ? params.sortCol : '';
        var sortStatus = params.sortStatus ? params.sortStatus : '';
        var parentId = params.parentId ? params.parentId : '';
        var treedocid = params.parentId ? params.parentId : '';
        var parentNodeId = params.parentId ? params.parentId : '';

        urlParams += '?sortCol=' + sortCol +
            '&sortStatus=' + sortStatus + 
            '&parentId=' + parentId + 
            '&name=' + name + 
            "&treedocid=" + treedocid + 
            "&parentNodeId=" + parentNodeId
            "&currpage=" + currpage;

        axios.post(contextPath + '/runtime/' + appId + '/treeviews/' + viewId + '/documents' + urlParams, data ? data : {}).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 获取表单
     */
    getForm: function (appId, formId, docId, exparams, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/forms/' + formId + '/documents/' + docId, { params: exparams ? exparams : {} }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 获取表单
     */
    getDocument: function (appId, docId, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/documents/' + docId).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 获取空文档
     */
    getDocumentEmpty: function (appId, formId, exparams, { onSucess, onError }) {
        axios.get(contextPath + '/runtime/' + appId + '/forms/' + formId + '/empty', { params: exparams ? exparams : {} }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
        // /runtime/{applicationId} /forms/{formid}/documents/{docid}
        // axios.get(contextPath + '/runtime/' + appId + '/forms/' + formId + '/documents/empty', { params: exparams ? exparams : {} }).then(function (response) {
        //     if (onSucess) onSucess(response);
        // }).catch(
        //     function (error) {
        //         if (onError) onError(error);
        //     }
        // );
    },

    /**
     * 6.4	保存并启动流程 --接口有问题，要改 --TODO:Jarod
     */
    saveDocumentAndStartWorkflow: function (appId, formId, docId, /**flowId,*/ data, { onSucess, onError }) {
        var jsonData = {
            "flowId": "",
            "attitude": "",
            "versions": "",
            "document": {
                "id": docId,
                "formId": formId,
                "applicationid": appId,
                "stateid": "",
                "versions": "",
                "parentid": "",
                "sign": "",
                "items": data ? data : {}
            }
        }

        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/activities/saveStartWorkFlow',
            method: 'post',
            //发送格式为json
            data: JSON.stringify(jsonData),
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 2.6	更新文档（带校验）
     *  请求方式：PUT
     *  请求地址：/runtime/{applicationId}/documents/{id}
     */
    saveDocument: function (appId, formId, docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId,
            method: 'put',
            data: docJson,
            //发送格式为json
            // data: JSON.stringify(docJson),
            //                 headers:
            //                        {
            //                          'Content-Type': 'application/json'
            //                        }
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/documents/__K9sL2EHCL3DcW70DyEb/withoutValid
    saveWithoutValidDocument: function (appId,docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/withoutValid',
            method: 'put',
            //发送格式为json
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 复制文档v
     */
    copeDocument: function (appId, docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/activities/copy',
            method: 'post',
            //发送格式为json
            //data: JSON.stringify(docJson),
            data:docJson,
            //                 headers:
            //                        {
            //                          'Content-Type': 'application/json'
            //                        }
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     *创建文档
     */
    createDocument: function (appId, formId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents',
            method: 'post',
            //发送格式为json
            data: JSON.stringify(docJson),
            //                 headers:
            //                        {
            //                          'Content-Type': 'application/json'
            //                        }
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    createWithoutValidDocument: function (appId, formId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/withoutValid',
            method: 'post',
            //发送格式为json
            data: JSON.stringify(docJson),
            //                 headers:
            //                        {
            //                          'Content-Type': 'application/json'
            //                        }
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },


    /**
     * 2.10	批量删除文档
     * 请求方式：DELETE
     * 请求地址：/runtime/{applicationId}/documents
     */
    batchRemoveDocuments: function (appId, idsArray, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents',
            method: 'delete',
            //发送格式为json
            data: idsArray,
            //                 headers:
            //                        {
            //                          'Content-Type': 'application/json'
            //                        }
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *树形视图右键删除节点
    **/
    deleteTreeviewNode: function (appId, nodeId, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + nodeId,
            method: 'delete',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *5.4	获取文档的流程提交面板
     *服务器返回当前文档流程面板所需要的全部信息，包含当前节点信息，下一步节点的相信配置信息。
     *请求方式：post
     *请求地址：/runtime/{applicationId}/documents/{docId}/panels/submission
     */
    getFlowPanel: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/panels/submission',
            method: 'post',
            data: flowData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *5.5获取文档的流程回退面板
     *  服务器返回当前文档流程面板所需要的全部信息，包含当前节点信息，下一步节点的相关配置信息。
     *  请求方式：GET
     *  请求地址：/runtime/{applicationId}/document/{docId}/panels/back
     */
    getBackPanel: function (appId, docId, flowData,{ onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/panels/back',
            method: 'POST',
            data: flowData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *5.8	提交流程
     *保存文档并提交流程。
     *请求方式：PUT
     *请求地址：/runtime/{applicationId}/documents/{docId}/workflows/submit
     */
    /**
     *   {
            "flowId":"14e7dwq091134ct9635fG",
            "flowType":"80",
            "currentNodeId":"1470911349635",
            "nextNodeIds":["1470911349645","1470911349644"],---计算得出
            "attitude":"",
            "signature":"",
            "submitTo": "",
            "circulatorInfo":"",
            "subFlowApproverInfo":"",
            "subFlowApproverInfoAll":""
            "document":{
                "id": "value",
                "formId": "value",
                "applicationid": "value",
                "stateid": "value",
                "versions": 0,
                "parentid": "value",
                …//其他系统字段
                "sign": "value",
                "items": [
                    {
                        "name": "demo",
                        "age": 18,
                        "date": "2017-6-23"
                    }
                ]
            }
        }

     *
     */
    submitFlow: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/submit',
            method: 'put',
            data: flowData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 5.10回退流程
     * 保存文档并回退流程。
     * 请求方式：PUT
     * 请求地址：/runtime/{applicationId}/documents/{docId}/workflows/back
     {
        "flowId":"14e7dwq091134ct9635fG",
        "flowType":"81",
        "currentNodeId":"1470911349635",
        "nextNodeIds":["1470911349645"],
        "attitude":"",
        "signature":"",
        "document":{
            "id": "value",
            "formId": "value",
            "applicationid": "value",
            "stateid": "value",
            "versions": 0,
            "parentid": "value",
            …//其他系统字段
            "sign": "value",
            "items": [
                {
                    "name": "demo",
                    "age": 18,
                    "date": "2017-6-23"
                }
            ]
        }
    }
     */
    backFlow: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/back',
            method: 'put',
            data: flowData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 5.9催办流程
     保存文档并流程催办。
     请求方式：PUT
     请求地址：/runtime/{applicationId}/documents/{docId}/workflows/remind

     {
        "reminderContent":"zz",
        "nodertIds":["1470911349645","1470911349644"]
        }
     */
    remindFlow: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/remind',
            method: 'put',
            data: flowData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *  自由流程-提交
     请求方式：PUT
     请求地址：/runtime/{applicationId}/documents/{docId}/freeflows/submit

     {
            "flowType":"80",
            "nextUserId":"sf34sdsfKJg342",
            "attitude":"",
            "document":{
                "id": "value",
                "formId": "value",
                "applicationid": "value",
                "stateid": "value",
                "versions": 0,
                "parentid": "value",
                …//其他系统字段
                "sign": "value",
                "items": [
                    {
                        "name": "demo",
                        "age": 18,
                        "date": "2017-6-23"
                    }
                ]
            }
        }
     */
    submitFreeFlow: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/freeflows/submit',
            method: 'put',
            data: flowData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *  自由流程-回退
     请求方式：PUT
     请求地址：/runtime/{applicationId}/documents/{docId}/freeflows/back

     {
            "flowType":"80",
            "nextUserId":"sf34sdsfKJg342",
            "attitude":"",
            "document":{
                "id": "value",
                "formId": "value",
                "applicationid": "value",
                "stateid": "value",
                "versions": 0,
                "parentid": "value",
                …//其他系统字段
                "sign": "value",
                "items": [
                    {
                        "name": "demo",
                        "age": 18,
                        "date": "2017-6-23"
                    }
                ]
            }
        }
     */
    backFreeFlow: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/freeflows/back',
            method: 'put',
            data: JSON.stringify(flowData),
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *  自由流程-结束
     请求方式：PUT
     请求地址：/runtime/{applicationId}/documents/{docId}/freeflows/complete

     {
            "flowType":"7",
            "nextUserId":"sf34sdsfKJg342",
            "attitude":"",
            "document":{
                "id": "value",
                "formId": "value",
                "applicationid": "value",
                "stateid": "value",
                "versions": 0,
                "parentid": "value",
                …//其他系统字段
                "sign": "value",
                "items": [
                    {
                        "name": "demo",
                        "age": 18,
                        "date": "2017-6-23"
                    }
                ]
            }
        }
     */
    completeFreeFlow: function (appId, docId, flowData, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/freeflows/complete',
            method: 'put',
            data: JSON.stringify(flowData),
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },


    /**
     * 3.7刷新表单
     *   表单某控件触发全局刷新表单的动作，服务器根据最新的文档状态重新运算开启重计算功能的全部控件的值脚本，返回状态发生变更的控件内容。
     *   请求方式：POST
     *   请求地址：/runtime/{applicationId}/forms/{formId}/documents/{docId}/refresh
     */
    refreshForm: function (actField, docJson, { onSucess, onError }) {
        var appId = docJson.applicationId;
        var formId = docJson.formId;
        var docId = docJson.id;
        var refreshData = {
            actField: actField,
            tabId: '',
            document: docJson.document
        };

        axios({
            url: contextPath + '/runtime/' + appId + '/forms/' + formId + '/documents/' + docId + '/refresh',
            method: 'post',
            // data: JSON.stringify(refreshData),
            data: refreshData,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 获取文档的流程历史
     */
    getFlowHistorys: function (appId, docId, content,{ onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/flowhistorys?content=' + content,
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 获取文档的催办记录
     */
    getRemindHistorys: function (appId, docId, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/remind-historys',
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 消息相关接口，从旧皮肤中迁移过来，需要再修改  TODO：Jarod
     */
    /**
     * 获取登陆后消息
     */
    getMessageLogin: function ( { onSucess, onError }) {
        axios({
            url: contextPath + "/message/notification/sendMessageNotificationWhenLogin.action",
            method: 'post',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 获取登陆后用户消息
     */
    getMessageLogin2User: function ( { onSucess, onError }) {
        axios({
            url: contextPath + "/message/notification/sendMessageNotification2User.action",
            method: 'post',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 移除登陆后消息
     */
    removeMessageLogin: function ( { onSucess, onError }) {
        axios({
            url: contextPath + "/message/notification/clearNotification.action",
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 设置消息已读
     */
    setMessageRead: function (params, { onSucess, onError }) {
        axios({
            url: contextPath + "/message/notice/set2Read.action",
            method: 'post',
            data: params
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 运算自定义动作脚本
     */
    executeCustom: function (applicationId, id, data, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/activities/" + id + "/execute?docid=" + data.docid + "&viewid=" + data.viewid + "&formId=" + data.formId + "&_templateForm=" + data.templateForm + "&parentid=" + data.parentid,
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 获取文档的流程发起面板
     */
    getPanelsInitiate: function (applicationId, docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/documents/" + docId + "/panels/initiate",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 发起流程
     */
    InitiateWorkFlow: function (applicationId, docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/documents/" + docId + "/workflows/initiate",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 保存并启动流程
     */
    saveStartWorkFlow: function (applicationId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/documents/activities/saveStartWorkFlow",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 签章
     */
    saveSign: function (applicationId, docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/documents/" + docId + "/activities/sign",
            method: 'post',
            data: JSON.stringify(docJson),
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 邮件和手机分享
     */
    toShare: function (applicationId, docId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/documents/" + docId + "/activities/share",
            method: 'post',
            data: JSON.stringify(docJson),
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 归档
     */
    Archive: function (applicationId, docId, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/documents/" + docId + "/activities/archive",
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 获取打印表单数据
     */
    getPrintForm: function (applicationId, formId, docId, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + applicationId + '/forms/' + formId + '/documents/' + docId + '/activities/print',
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 清除所有数据
     */
    deleteAllData: function (applicationId, formId, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/forms/" + formId + "/activities/clear",
            method: 'delete',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * Excel导入
     */
    importExcel: function (applicationId, viewId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/views/" + viewId + "/activities/importExcel",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 批量审批
     */
    batchApprove: function (applicationId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/forms/activities/batchApprove",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 获取km,pm,qm菜单数据
     */
    projectMenu: function ({ onSucess, onError }) {
        axios({
            url: contextPath + "/portal/good/js/json/project.json",
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 判断km团队和知识专题是否显示
     */
    kmMenuShow: function ( { onSucess, onError }) {
        axios({
            url: contextPath + '/kms/realmAndTeam',
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 视图列的提交按钮
     */
    operateSubmit: function (applicationId, viewId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/views/" + viewId + "/column/submit",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     * 流程协办（点评）
     */
    review: function (appId, instanceId, comments, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/workflows/' + instanceId + '/assist?attitude=' + comments,
            method: 'put',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 添加/补签意见
     */
    supplement: function (appId, instanceId, comments, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/workflows/' + instanceId + '/supplement?comments=' + comments,
            method: 'put',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 加签（主办）
     */
    processHosting: function (appId, docId, data, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/approver/addition',
            method: 'put',
            data: data,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 加签（协办）
     */
    processCoHosting: function (appId, docId, data, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/assist/addition',
            method: 'put',
            data: data,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 企业域信息
     *  */
    getEnterpriseinfo: function (domainId, { onSucess, onError }) {
        axios({
            url: contextPath + '/portal/domain/' + domainId,
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     *  视图选择框确认执行脚本
     */
    runViewDialogCallbackScript: function (docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/views/selectbox/runViewDialogCallbackScript",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 获取是否配置文件预览环境的信息
     */
    getenvironment: function ({ onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/files/preview/environment',
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     * 通过文件路径和名称判断是否存在对应的PDF文件
     */
    getHasPdfFile: function (filePath, fileRealName, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/files/hasPdf?path=' + filePath + '&fileRealName=' + fileRealName,
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     *  视图框选择后回显
     *  /runtime/{applicationId}/forms/{formId}/documents/{docId}/validateFieldValue
     */
    formValueEcho: function (appId, docId, formId, data, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/forms/' + formId + '/documents/' + docId + '/validateFieldValue',
            method: 'post',
            data: JSON.stringify(data),
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /**
     *  是否有打开表单的权限
     *  /runtime/{applicationId}/forms/{formId}/documents/{docId}/openable
     */
    hasPermissionToForm(appId, formId, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/forms/' + formId + '/openable',
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    /**
     *  是否有打开视图的权限
     *  
     */
    hasPermissionToView(appId, viewId, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/views/' + viewId + '/openable',
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    runScript: function (appId, actId, docId, fieldName, _, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/activities/' + actId + '/runScript?docId=' + docId + '&fieldName=' + fieldName + "&_" + _,
            method: 'get',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    deleteUpload: function (appId, formId, docId, path, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/files/delete?applicationId=' + appId + '&formId=' + formId + '&docId=' + docId + '&path=' + path,
            method: 'delete',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    // 更新流程节点审批人
    approversWorkflow: function (appId, docId, data, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/' + docId + '/workflows/approvers',
            method: 'put',
            data: data,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    //智能提示搜索框
    intellectTip: function (applicationId, formId, docId, data, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/" + applicationId + "/forms/" + formId + "/documents/" + docId + "/querySuggest",
            method: 'post',
            data: data,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    //角色
    getAllRoles: function(application, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+application+"/users/selectbox/role",
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )
    },
    //获取部门树
    getDepartments: function(parentId, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/selectbox/dept-tree?parentId=" + parentId,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )
    },
    //在线用户
    //runtime/users/selectbox/onlines?pageNum={pageNum}&pageSize={pageSize}
    getOnlines: function(pageNum, pageSize, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/selectbox/onlines?pageNum=" + pageNum+"&pageSize="+pageSize,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )
    },
    //通讯录用户
    getContact: function(contactsId,{ onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/users/selectbox/contacts?contactsId=" + contactsId,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },

     //http://localhost:8081/obpm/runtime/users/selectbox/contacts?contactsId=&userName=1&pageSize=10&pageNum=1&_=1591596427610
    getSearchContact: function(jsonData,{ onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/users/selectbox//contacts",
            method: 'get',
            params: jsonData,
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
   
    //查询
    getSearch: function(keyWord, pageNum, pageSize,{ onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/users/selectbox/search?keyWord="+ keyWord +"&pageNum="+ pageNum +"&pageSize=" + pageSize,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
    //部门用户**/runtime/{applicationId}/users/selectbox/department?deptId={deptId}
    getDeptUser: function(application,deptId,{ onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/"+application+"/users/selectbox/department?deptId=" + deptId,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
    //角色
    getRoles: function(application, roleId, pageSize, pageNum, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/"+application+"/users/selectbox/role?roleId=" + roleId + "&pageSize=" + pageSize + "&pageNum=" + pageNum,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },

    getAddressBook: function(jsonData, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/users/selectbox/contacts",
            method: 'get',
            params: jsonData,
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },

    //通讯录联系人分页
    //http://localhost:8080/obpm/runtime/users/selectbox/contacts?pageNum=2&pageSize=10
    ContactPage: function(pageNum, pageSize, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/users/selectbox/contacts?pageNum=" + pageNum +"&pageSize=" + pageSize,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
    //部门树分页
    ///runtime/HdPeBqYwJyFyjHkhZu3/users/selectbox/department?deptId=Z42xU8LmniRouZ93E7s&pageNum=3&pageSize=10
    departmentPage: function(application, deptId,pageNum, pageSize, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/"+application+"/users/selectbox/department?deptId="+deptId +"&pageNum="+ pageNum +"&pageSize=" + pageSize,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
    //查询分页
    //http://localhost:8080/obpm/runtime/users/selectbox/search?keyWord=&pageNum=2&pageSize=10
    searchPage: function(keyWord, pageNum, pageSize, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/users/selectbox/search?keyWord="+ keyWord +"&pageNum="+ pageNum +"&pageSize=" + pageSize,
            method: 'get',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
    //上传图片
    ///runtime/upload?applicationId={applicationId}&allowedTypes={allowedTypes}&fieldId={fieldId}&fileSaveMode={fileSaveMode}&path={path}&actionType={actionType}
    uploadFile: function(applicationId, allowedTypes, fieldId, fileSaveMode, path, actionType,{ onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/upload?applicationId="+ applicationId +"&allowedTypes="+ allowedTypes+"&fieldId=" + fieldId +"&fileSaveMode=" + fileSaveMode + "&path=" + path + "&actionType=" +actionType,
            method: 'post',
        }).then(function (response) {
            if(onSucess) onSucess(response);
        }).catch(
            function (error) {
                if(onError) onError(error);
            }
        )  
    },
    /**
     *  视图选择框确认执行脚本
     */
    runViewDialogConfirmScript: function (docJson, { onSucess, onError }) {
        axios({
            url: contextPath + "/runtime/views/selectbox/runViewDialogConfirmScript",
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },
    /*
        获取个人设置页面的软件列表
    */ 
   GetsoFtwareList:function({onSucess,onError}){
        axios({
            url:contextPath + "/runtime/applications",
            method:'get'
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error){
            if(onError) onError(error);
        })
   },

   /**
    * 个人信息设置
    * 请求地址/runtime/usersetups/detail
    */
   PersonalInformationSettings:function(data, {onSucess, onError}) {
    
       axios({
           url:contextPath + '/runtime/usersetups/detail',
           method:'post',
           data:data
       }).then(function(response){
            if(onSucess) onSucess(response);
       }).catch(function(error){
            if(onError) onError(error);
       })
   },

   /**
    * 皮肤设置
    * 请求地址:/runtime/users/skin
    */
   SkinSetting:function(data, {onSucess, onError}) {
       axios({
           url:contextPath + '/runtime/users/skin',
           method:'post',
           data
       }).then(function(response){
            if(onSucess) onSucess(response);
       }).catch(function(error){
            if(onError) onError(error);
       })
   },

   /**
    * 退出系统
    * 请求地址：/logout
    */
    LogOut:function({onSucess, onError}){
        axios({
            url:contextPath + '/runtime/logout?rdm=' + Math.random(),
            method:'post'
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error){
            if(onError) onError(error);
        })
     },
     LogOutAction:function({onSucess, onError}){
        axios({
            url:contextPath + "/logout.action?rdm="+ Math.random(),
            method:"get"
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error){
            if(onError) onError(error);
        })
     },
     
     //执行前脚本
    runBeforeActionScript: function(applicationId, id, data, actType,{onSucess, onError}) {
        let docId = data.docId?data.docId:'';
        let viewId = data.viewId?data.viewId:'';
        let formId = data.formId?data.formId:'';
        let templateForm = data.templateForm?data.templateForm:'';
        let parentId = data.parentId?data.parentId:'';
        let isRelate = data.isRelate?data.isRelate:'';
        let acttype = actType?actType:'';
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/activities/"+ id +"/runbeforeactionscript?docId=" + docId + "&viewId=" + viewId + "&formId=" + formId + "&_templateForm=" + templateForm + "&parentId=" + parentId + "&isRelate=" + isRelate + '&actType=' + acttype,
            method: 'post',
            data,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //执行后脚本
    ///runtime/HdPeBqYwJyFyjHkhZu3/activities/zLjmORGWoZmG7wXf8LF/runafteractionscript?docId=jPF4VGFTnIrk4wMwonl&viewId=&formId=IfoHRC8Rs6njW75HqiE&_templateForm=&parentId=&_=1566437405210
    runAfterActionScript: function(applicationId, id, docId, viewId, formId, _templateForm, parentId, _, data, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/activities/"+ id +"/runafteractionscript?docId=" +docId +"&viewId="+ viewId + "&formId=" + formId + "&_templateForm=" + _templateForm + "&parentId=" + parentId + "&_=" + _ ,
            method: 'post',
            data,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //文件下载
    ///runtime/{applicationId}/documents/{docId}/activities/download?actId={actId}
    documentDownload: function(applicationId, docId, actId, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/documents/"+ docId +"/activities/download?actId=" + actId ,
            method: 'post',
            responseType: 'blob',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //http://localhost:8081/obpm/runtime/file/download?filename=&filepath=/uploads/exceltemplate/%E6%93%8D%E4%BD%9C%E6%8C%89%E9%92%AE%E8%A1%A8%E5%8D%95.xls/
    templateDownload: function(fileName, filepath, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/file/download?filename=" + fileName + "&filepath=" + filepath,
            method: 'post',
            responseType: 'blob',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },


    //PDF导出
    ///runtime/{applicationId}/forms/{formId}/documents/{docId}/activities/exportPdf
    PDFExport: function(applicationId, formId, docId, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/forms/"+ formId +"/documents/"+docId+"/activities/exportPdf",
            method: 'post',
            responseType: 'blob',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //Excel
    //sOZu9kthmxyP8qQfq0e/views/zIDoeHr26TZtP1kZMdr/activities/exportExcel?actId=&filename=&isExpSub=false&parentId=&isRelate=undefined
    exportExcel: function(applicationId, viewId, actId, filename, isExpSub, parentId, isRelate, params,{onSucess, onError}) {
        let data = '';
        if(params) {
            for(let key in params) {
                data += "&" + encodeURIComponent(key) + "=" + params[key]
            }
        }
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/views/"+ viewId +"/activities/exportExcel?actId=" + actId + "&filename=" + filename + "&isExpSub=" + isExpSub + "&parentId=" + parentId + "&isRelate=" + isRelate + data,
            method: 'post',
            responseType: 'blob',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //上传Excel文件
    //http://localhost:8081/obpm/portal/FrontFileAndImageUploadServlet?data=nullpath:IMPORTEXCEL_PATH,fileSaveMode:undefined,fieldid:null,allowedTypes:xls;xlsx,applicationid:sOZu9kthmxyP8qQfq0e
    uploadExcel: function(jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/portal/FrontFileAndImageUploadServlet",
            method: 'post',
            data:jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },



    //流程图接口（h5的接口）
    //http://localhost:8081/obpm/portal/dynaform/document/viewFlow.action?_docid=Bb8UEPb583uwa3tJ38Z&_instanceId=NRo4wpRuOejquOQGZxz&dateTime=1567495362264
    getViewFlow: function(docId, instanceId, dateTime, {onSucess, onError}) {
        axios({
            url: contextPath + "/portal/dynaform/document/viewFlow.action?_docid="+ docId +"&_instanceId="+ instanceId + "&dateTime=" + dateTime,
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    
    //获取常用意见
    ///runtime/users/{userId}/commonOpinions
    getMostUseSuggestion: function(userId, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/" + userId + "/commonOpinions",
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    //添加常用意见
    ///runtime/users/{userId}/commonOpinions?opinion={opinion}
    AddMostUseSuggestion: function(userId, opinion, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/" + userId + "/commonOpinions?opinion="+opinion,
            method: 'post',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
     
    //删除常用意见
    ///runtime/users/{userId}/commonOpinions/{opId}
    deleteMostUseSuggestion: function(userId, opId, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/" + userId + "/commonOpinions/" + opId,
            method: 'DELETE',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //修改意见
    ///runtime/users/{userId}/commonOpinions/{opId}?opinion={opinion}
    editMostUseSuggestion: function(userId, opId, opinion, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/" + userId + "/commonOpinions/" + opId + "?opinion=" + opinion,
            method: 'put',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //流程处理中获取头像
    //http://localhost:8081/obpm/contacts/contacts/getAvatar.action?id=GShxHeYbLQQ3d4Vy58b
    getAvatar: function(id, {onSucess, onError}) { //H5的接口
        axios({
            url: contextPath + "/contacts/contacts/getAvatar.action?id=" + id,
            method: 'put',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    //获取流程图
    getFlowchart: function(appid, docId, stateId, randomNumber,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+appid+"/documents/" + docId + "/workflows/" + stateId+ "/flowchart?_=" + randomNumber,
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

     //更新缓存中子表数据(子表为网格视图时使用)
    ///runtime/{applicationId}/documents/{id}/childs
    setGridView: function(appid, primaryId, jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appid + "/documents/"  + primaryId + "/childs",
            method: 'post',
            data:jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    getbillflow: function (data, { onSucess, onError }) {
        axios({
            headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
            url: contextPath + data,
            responseType: 'blob',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //http://localhost:8081/obpm/portal/good/html/viewer.html?path=/uploads/doc/202003/9cf15bb6-4aa4-4df5-9709-719fc25fad50.doc&fileName=9cf15bb6-4aa4-4df5-9709-719fc25fad50.doc&name=9cf15bb6-4aa4-4df5-9709-719fc25fad50.doc&openWaterMark=false&waterMark=undefined&t=1564481981092
    getWordEditor: function(path, fileName, name, openWaterMark, waterMark, t,{onSucess, onError}) {
        axios({
            url: contextPath + "/portal/good/html/viewer.html?path=" + path + "&fileName=" + fileName + "&name=" + name + "&openWaterMark=" + openWaterMark + "&waterMark=" + waterMark + "&t=" + t,
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    //表单控件校验
    ///runtime/{applicationId}/documents/validate
    formValidation: function (appId, docJson, { onSucess, onError }) {
        axios({
            url: contextPath + '/runtime/' + appId + '/documents/validate',
            method: 'post',
            data: docJson,
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

     
    //获取常用意见
    ///runtime/users/{userId}/commonOpinions
    getCommonOpinions: function(userId, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/" + userId + "/commonOpinions",
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //提交面板的执行前
    submitRunBeforeActionScript: function(applicationId, id, data, docId, viewId, formId, _templateForm, parentId, isRelate, _flowType,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/activities/"+ id +"/runbeforeactionscript?docId=" + docId + "&viewId=" + viewId + "&formId=" + formId + "&_templateForm=" + _templateForm + "&parentId=" + parentId + "&isRelate=" + isRelate + "&_flowType=" + _flowType,
            method: 'post',
            data,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //提交面板的执行后
    submitRrunAfterActionScript: function(applicationId, id, data, docId, viewId, formId, _templateForm, parentId, isRelate, _flowType,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ applicationId +"/activities/"+ id +"/runafteractionscript?docId=" + docId + "&viewId=" + viewId + "&formId=" + formId + "&_templateForm=" + _templateForm + "&parentId=" + parentId + "&isRelate=" + isRelate + "&_flowType=" + _flowType,
            method: 'post',
            data,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/Consuming
    //仪表分析
    //提交面板的执行后
    getConsuming: function(appId, jsonData,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ appId + "/Consuming",
            method: 'post',
            data:jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //代理设置接口
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/usersetups/proxys?flowName=&pageNo=1&linesPerPage=10&_=1587881794427
    getproxys: function(appId, jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId + "/usersetups/proxys",
            method: 'get',
            params: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //添加代理保存
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/usersetups/proxys/save?id=
    saveProxys: function(appId, jsonData, id, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/"+ appId + "/usersetups/proxys/save?id=" + id,
            method: 'post',
            data:jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //获取代理流程
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/usersetups/proxys/flows?_=1587889209026
    getProxysFlow: function(appId,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId + "/usersetups/proxys/flows",
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //编辑代理流程
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/usersetups/proxys/o5g2bRmv0c0B1oVuCpM?_=1587953401510
    editProxysFlow: function(appId, id,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId + "/usersetups/proxys/" + id,
            method: 'get',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    // //删除代理流程
    // http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/usersetups/proxys
    deleteProxysFlow: function(appId, arrIds,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId + "/usersetups/proxys",
            method: 'delete',
            data:arrIds,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //获取首页个人设置通讯录分组
    getContactGroup: function({onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/selectbox/contacts/group",
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //保存首页通讯录新建的分组
    //http://localhost:8081/obpm/runtime/users/contacts/groups?name=%E9%A1%B6%E9%A1%B6%E9%A1%B6%E9%A1%B6
    saveContactGroup: function(name, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/contacts/groups?name=" + name,
            method: 'post',
            data:name,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //编辑首页通讯录新建的分组
    //http://localhost:8081/obpm/runtime/users/contacts/groups/__0nwxZFYKqQormss1ZBI?name=%E5%8F%91%E5%B9%BF%E5%91%8A
    editContactGroup: function(id, name, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/contacts/groups/" + id + "?name=" + name,
            method: 'post',
            data:name,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //删除首页通讯录新建的分组
    //http://localhost:8081/obpm/runtime/users/contacts/groups/__0nwxZFYKqQormss1ZBI
    deleteGroup: function(id, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/contacts/groups/" + id,
            method: 'delete',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //添加新的数据到首页通讯录分组
    //http://localhost:8081/obpm
    addDataToGroup: function(id, jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/contacts/groups/" + id + "/users",
            method: 'post',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //首页通讯录删除分组里的用户数据
    //http://localhost:8081/obpm
    deleteGroupUserList: function(id, jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/users/contacts/groups/"+ id + "/users",
            method: 'delete',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //全部部门的列表
    // http://localhost:8081/obpm
    getAllDeptList: function({onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/department/list",
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //获得公告
    //http://localhost:8081/obpm/message/messages/announcement?_=1588829750160
    getAnnouncement: function({onSucess, onError}) {
        axios({
            url: contextPath + "/message/messages/announcement",
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //发公告
    //http://localhost:8081/obpm/message/messages/announcement
    makeAnnouncement: function(jsonData, {onSucess, onError}) {
        axios({
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: contextPath + "/message/messages/announcement",
            method: 'post',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //发布公告
    //http://localhost:8081/obpm/message/messages
    annouce: function(jsonData, {onSucess, onError}) {
        axios({
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: contextPath + "/message/messages",
            method: 'post',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //信息管理-企业动态公告列表
    //http://localhost:8081/obpm/message/messages/list?_=1588230210399
    getMessagesList: function({onSucess, onError}) {
        axios({
            url: contextPath + "/message/messages/list",
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    
    //获取评论回复
    //http://localhost:8081/obpm/message/comment?messageId=__hgqhG93gkiBTIaqcNND&_=1588234679724
    getMessagesReplay: function(id, {onSucess, onError}) {
        axios({
            url: contextPath + "/message/comment?messageId=" + id,
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //评论回复
    doComment: function(jsonData, {onSucess, onError}) {
        axios({
            headers: {
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: contextPath + "/message/comment",
            method: 'post',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //消息管理-工作事项-流程
    //http://localhost:8081/obpm/message/notice?readStatus=&type=0&_=1588744575393
    getNotice: function(data,{onSucess, onError}) {
        axios({
            url: contextPath + "/message/notice",
            method: "get",
            params: data,
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //删除工作事项
    //http://localhost:8081/obpm/message/notice?noticeId=__yP7DDIDfmi097yyUGKc
    deleteNotice: function(noticeId, {onSucess, onError}) {
        axios({
            url: contextPath + "/message/notice?noticeId=" + noticeId,
            method: "delete"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //获取我回复的
    //http://localhost:8081/obpm/message/comment/my/reply?_currpage=1&_rowcount=30&_=1588819405740
    getMyreply: function(_currpage, _rowcount, {onSucess, onError}) {
        axios({
            url: contextPath + "/message/comment/my/reply?_currpage=" + _currpage + "&_rowcount=" + _rowcount,
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    //获取回复我的
    //http://localhost:8081/obpm/message/comment/my/receive?_currpage=1&_rowcount=30&_=1588819405742
    getReceive: function(_currpage, _rowcount, {onSucess, onError}) {
        axios({
            url: contextPath + "/message/comment/my/receive?_currpage=" + _currpage + "&_rowcount=" + _rowcount,
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //全部标记已读
    //http://localhost:8081/obpm/message/notice/allRead
    setAllRead: function({onSucess, onError}) {
        axios({
            url: contextPath + "/message/notice/allRead",
            method: "put"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    // http://localhost:8081/obpm/message/notice/read?noticeId=__rGJrdh5McwSl0y7ovLw
    noticeRead:  function(noticeId,{onSucess, onError}) {
        axios({
            url: contextPath + "/message/notice/read?noticeId=" + noticeId,
            method: "put"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //http://localhost:8081/obpm/message/comment?commentId=__8X34cOJ3BAu5DcufrbZ&messageId=__pXF1751980bwn9b9nbn
    deleteReply: function (commentId, messageId, { onSucess, onError }) {
        axios({
            url: contextPath + "/message/comment?commentId=" + commentId + "&messageId=" + messageId,
            method: 'delete',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //http://localhost:8081/obpm/message/messages?messageId=__MMHdmCOJtczmHsaEHmg
    deleteMessage:  function (messageId, { onSucess, onError }) {
        axios({
            url: contextPath + "/message/messages?messageId=" + messageId,
            method: 'delete',
        }).then(function (response) {
            if (onSucess) onSucess(response);
        }).catch(
            function (error) {
                if (onError) onError(error);
            }
        );
    },

    //修改自己的登录密码
    //http://localhost:8081/obpm/runtime/usersetups/password
    updatePassword: function(jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/usersetups/password",
            method: 'post',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //http://localhost:8081/obpm/message/notification?_=1588921548331
    getNotification: function({onSucess, onError}) {
        axios({
            url: contextPath + "/message/notification",
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //http://localhost:8081/obpm/message/notification/login?_=1594020502704
    getNotificationNum: function({onSucess, onError}) {
        axios({
            url: contextPath + "/message/notification/login",
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    // http://localhost:8081/obpm/message/notification/count?_=1591251768378
    getMessage: function(radomNum,{onSucess, onError}) {
        axios({
            url: contextPath + "/message/notification/count?_=" + radomNum,
            method: "get"
        })
        .then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    getChart: function(id, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/chart/"+id,
            method: 'post',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    getWidgetsIscript: function(id, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/widgets/"+id,
            method: 'GET',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },
    getCustomreports: function(id, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/report/showjrxml/"+id,
            method: 'POST',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //导出报表
    //http://localhost:8081/obpm/runtime/report/exportexcel/__9M30I7ZscGZKSI1qIR2?
    exportReportExcel: function(id, {onSucess, onError}) {
        axios({
            headers : {
                'Content-Type' : 'application/json',
            },
            url: contextPath + "/runtime/report/exportexcel/" + id + "?",
            method: 'POST',
            responseType: 'blob',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })

    },

    //http://localhost:8081/obpm/runtime/report/exportpdf/__mXw1keqArTCt2UrAoie?docid=undefined
    exportReportPdf: function(id, {onSucess, onError}) {
        axios({
            headers : {
                'Content-Type' : 'application/json',
            },
            url: contextPath + "/runtime/report/exportpdf/" + id + "?",
            method: 'POST',
            responseType: 'blob',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })

    },

    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/views/__jNTf9yWQNpnWT2CLOj6/columns/__lBZrqQoxAY6lwK2gTCX/runActionScript
    runActionScript: function(appId, parentView, id, jsonData, {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId + "/views/" + parentView + "/columns/" + id + "/runActionScript",
            method: 'POST',
            data: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },

    //移除在线用户
    removeOnlineUser: ({onSucess, onError}) => {
        axios({
            url: contextPath + "/runtime/removeOnlineUser",
            method: 'delete',
        }).then(response => {
            if(onSucess) onSucess(response);
        }).catch((error)=>{
            if(onError) onError(error);
        })
    },

    //流程提交时获取显示的用户
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/documents/__xKeJfciUqTLp7o96vVY/workflows/fW1801qkQ6PsAcfxuI2/selectApprovers?nodeId=1566350840526&type=2&selectId=fBUXdkAlWTdGXqOq4cI
    getSelectApprovers: function(appId, docId, flowId, nodeId, type, selectId, pageNum, pageSize,  {onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId +"/documents/" + docId + "/workflows/" + flowId + "/selectApprovers?nodeId=" + nodeId + "&type=" + type + "&selectId=" + selectId + "&pageNum=" + pageNum + "&pageSize=" + pageSize,
            method: 'GET',
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        })
    },
    //http://localhost:8081/obpm/runtime/flowcenters/navs/carboncopy?applicationId=&isread=true&_=1594186597018
    navCarboncopy: function(jsonData,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/flowcenters/navs/carboncopy",
            method: 'get',
            params: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/flowcenters/carboncopy?title=&flowId=&initiatorId=&isRead=true&isMyWorkFlow=false&appId=sOZu9kthmxyP8qQfq0e&_=1594187825052
    getCarboncopyList: function(appId, jsonData,{onSucess, onError}) {
        axios({
            url: contextPath + "/runtime/" + appId + "/flowcenters/carboncopy",
            method: 'get',
            params: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },

    //http://localhost:8081/kms/kms/files/data?fileName=&orderByfield=CREATE_DATE&orderMode=desc&pageNo=1&linesPerPage=10&_=1594349604925
    getKmsFiles: function(jsonData,{onSucess, onError}) {
        axios({
            url: "kms/kms/files/data",
            method: 'get',
            params: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    //http://localhost:8081/obpm/runtime/sOZu9kthmxyP8qQfq0e/documents/__KAgeEc3BJ3Bsje9ow4n/formhelper/inputlog?fieldName=%E6%96%87%E6%9C%AC%E6%A1%86&_=1594884665008
    getOperationLogs: function(appId, docId, jsonData,{onSucess, onError}) {
        axios({
            url:  contextPath + "/runtime/" + appId + "/documents/" + docId + "/formhelper/inputlog",
            method: 'get',
            params: jsonData,
        }).then(function(response){
            if(onSucess) onSucess(response);
        }).catch(function(error) {
            if(onError) onError(error);
        }) 
    },
    
};

