let pateName = window.document.location.pathname;
let contextPath = pateName.substring(1,pateName.substr(1).indexOf('/')+1)
console.log("contextPath------>",contextPath);
if(contextPath == "/"){
    contextPath = "obpm";
}else{
    //contextPath = "obpm";
    contextPath = "../..";  //4.1and4.3stable 
    //contextPath = "..";         //trunk and 4.4stable
}
export default {
    PermissionType_READONLY: 1,
    PermissionType_MODIFY: 2,
    PermissionType_HIDDEN: 3,
    PermissionType_DISABLED: 4,
    PermissionType_PRINT: 5,
    contextPath: contextPath,
}