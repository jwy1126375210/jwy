<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="renderer" content="webkit" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<title>登录-电子围栏</title>
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/Contents/static/style/base.css" />
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/Contents/static/style/login.css" />
</head>

<body class="g-body">
	<!-- header -->
	<input id="basePath" type="hidden" value="<%=basePath%>"/>
	<div class="g-header">
        <div class="g-wrap f-clearfix">
            <div class="f-fl m-logo e-ml15">
                <!-- <i class="iconfont f-fl">&#xe602;</i> -->
                <h1 class="f-fl">电子围栏</h1>
            </div>
        </div>
    </div>
	<!-- /header -->

	<!-- content -->
	<div class="g-content g-wrap">
        <div class="m-content">
            <form method="post" class="m-form" >
                <legend>会员登录</legend>
                <fieldset class="e-pt15">
                    <div class="item">
                        <input type="text" name="username" id="username" class="ui-input username" maxlength="35" placeholder="请输入用户名" autocomplete="off" />
                        <p class="err"></p>
                    </div>
                    <div class="item">
                        <input type="password" name="password" id="password" class="ui-input password" maxlength="35" placeholder="请输入密码" autocomplete="off" />
                        <p class="err"></p>
                    </div>
                   <div class="item">
                        <input type="text" name="validator" id="validator" class="ui-input ui-input-short" data-integer="4" maxlength="4" placeholder="请输入右边数字" autocomplete="off" />
                        <img src="<%=basePath %>/validateCode" onclick="tools.getCode(this)" class="ui-btn ui-btn-code f-fl" />
                        <p class="err"></p>
                    </div>  
                    <div class="item e-mt5">
                        <button type="submit" class="ui-btn ui-btn-submit">登 录</button>
                    </div>
                    <div class="item f-tac e-mt15">
                        <a href="https://www.jss.com.cn/Contents/global/findpwd/findpwd.ftl" target="_blank">忘记密码？</a>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
	<!-- /content -->
	<div class="g-footer">
		<p class="copyright">Copyright(C)2013-2017  〖浙江爱信诺航天信息有限公司〗版权所有</p>
	</div>
    
	<script type="text/javascript" src="<%=basePath %>/Contents/common/jQuery/jquery.min.js"></script>
	<script type="text/javascript" src="<%=basePath %>/Contents/common/jQuery/jquery.axnui.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>/Contents/static/script/base64.js"></script>
    <script type="text/javascript" src="<%=basePath %>/Contents/login/script/login.js"></script>
</body>
</html>