// 申明用于命名空间注册
my = {};
my.register = function (fname) {
    var nArray = fname.split('.'); //分置方法
    var tfn = '';
    var feval = '';
    for (var i = 0; i < nArray.length; i++) {
        if (i != 0) {
            tfn += '.';
        }
        tfn += nArray[i];
        feval += "if (typeof(" + tfn + ") == 'undefined'){" + tfn + "={};}";
    }
    if (feval != '') {
        eval(feval);
    }
};
my.register('my.common');
my.common = {
    // 全局变量
    global: {
        contextPath: '/efence',
    },
    ajaxInit : function () {
    	jQuery.ajaxSetup({  
            //设置ajax请求结束后的执行动作  
            complete : function(XMLHttpRequest, textStatus) { 
                // 通过XMLHttpRequest取得响应头，sessionstatus  
                var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");  
                if (sessionstatus == "timeout_user") {
                	window.location = my.common.global.contextPath + "/login";
                } else if (sessionstatus == "noauth_user") {
                	alert("您没有访问权限，请联系管理员！");
                	return;
                }
            }
        }); 
    }
}
my.common.ajaxInit();