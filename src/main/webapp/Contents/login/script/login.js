/**
 * @filename login.js
 * @author jiangwenyu[2017-09-19]
 * @update jiangwenyu[2017-09-19]
 * @version v1.1
 * @description none
 */

var basePath = $("#basePath").val();

$(function(){
    $('.m-form').validate({ 
        errorClass:'s-err',
        onkeyup:false,
        focusInvalid:false,
        focusCleanup:true,
        rules:{
            'username':{
                required:true,
                request:true,
            },
            'password':{
                required:true,
            },
            'validator':{
                required:true,
                rangelength:[4,4],
                request:true
            }
        },
        messages:{
            'username':{
                required:'请输入用户名',
                request:'用户不存在或者密码错误',
            },
            'password':{
                required:'请输入密码'
            },
            'validator':{
                required:'请输入验证码',
                rangelength:'验证码输入有误',
                request:'验证码输入有误'
            }
        },
        success:function(error){
            error.remove();
        },
        errorPlacement:function(error, element){
            element.closest('.item').find('.err').html(error);
        },
        submitHandler:function(form){
            var param = {};
            var serialize = $(form).serializeArray();
            $.each(serialize, function(key, val){
                param[val.name] = $.trim(val.value);
            });
            var b = new Base64();
            param['password'] = b.encode(param['password']);
            param['username'] = b.encode(param['username']);
            $.post(basePath+'/login', param, function(res){
                if(res.code == 1){
                    location.replace(basePath+"/index.jsp");
                } else {
                    if (res.message.indexOf('验证码') != -1) {
                        $('#validator').attr('error', 1).blur();
                    } else if (res.message.indexOf('用户不存在或者密码错误') != -1) {
                        $('#username').attr('error', 1).blur();
                        $('.ui-btn-code').click();
                    } else if (res.message.indexOf('您的账号被禁用，请联系管理员') != -1) {
                        $('#username').attr('error', 1).blur();
                        $('.ui-btn-code').click();
                        $('#username').next("p").find(".s-err").text(res.message);
                    } 
                }
            }, 'json').fail(function(){
                
            })
        }
    });
    
    var height = $(window).height();
	if(height > 576){
		$(".g-footer").css("height",height-536+"px");
	}else{
		$(".g-footer").css("height","40px");
	}
});

