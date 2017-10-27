$(function(){
    //拓展表单验证
	$.each(tools.regex, function(key, val){
	    $.validator.addMethod(key, function(value, element) {       
	        var regex = val;
	        value = $.trim(value);
	        if(value && !regex.test(value)){
	            return false;
	        }
	        return true;    
	    });
	});
    
    $.validator.addMethod('request', function(value, element) {  
	    if($(element).attr('error')){
	        $(element).removeAttr('error');
	        return false; 
	    }   
	    return true;
	});
    
    $('[placeholder]').placeholder({animate:false, color:'#C0C0C0'});
    
    $.layer.message = function(msg, cb){
        if(!$.layer.message.flag){
            $.layer.message.flag = true;
            $.layer({
                content:'<span><i class="iconfont">&#xe60d;</i>'+ msg +'</span>',
                theme:'message',
                isClose:false,
                isTips:true,
                timer:2000,
                isMask:false,
                close:{
                    enable:false
                },
                title:{
                    enable:false
                },
                onHideEvent:function(){
                    if(typeof cb === 'function'){
                        cb();
                    }
                    $.layer.message.flag = false;
                }
            });
        }
    }
    $.layer.message.flag = false;
});