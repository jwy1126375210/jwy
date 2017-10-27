///<jscompress sourcefile="jquery.calendar.js" />
/**
 * @filename jquery.calendar.js
 * @author Aniu[2016-08-08 20:10]
 * @update Aniu[2016-10-20 17:12]
 * @version v1.4.3
 * @description 日历
 */
 
;!(function(window, document, $, undefined){
    var Calendar = function(options){
        var that = this;
        that.options = $.extend({
            //自定义皮肤
            theme:'',
            //填充目标
            target:'',
            //格式化时间 y年 M月 d日 h小时 m分钟 s秒
            format:'yyyy-MM-dd',
            //连接符号
            joint:' - ',
            //可用日期最小时间
            min:'',
            //可用日期最大时间
            max:'',
            //开始时间
            startime:'',
            //初始化时间
            initime:'',
            //组件显示容器
            container:'body',
            //下拉展示年数量
            yearcount:6,
            //当只显示月时，月份一行显示数量
            monthcount:6,
            //下拉模式显示数量，大于0则开启
            drowdown:0,
            //是否允许跨年或月
            istride:true,
            //是否显示2个日历面板
            istwo:false,
            //只显示月
            ismonth:false,
            //是否显示时分秒
            istime:false,
            //是否可以选择年月
            isdate:true,
            //是否能关闭组件
            ishide:true,
            //是否点击日期关闭组件
            isclose:true,
            //是否可以点击非本月
            isclick:true,
            //是否展示上月
            isprev:true,
            //是否展示下月
            isnext:true,
            //是否开启选择区间，需要按住ctrl键
            iscope:false,
            //异步加载数据
            ajax:null,
            //显示按钮
            button:[{
                name:'clear',
                text:'清除'
            },{
                name:'today',
                text:'今天'
            },{
                name:'confirm',
                text:'确定'
            },{
                name:'close',
                text:'关闭'
            }],
            //配置快速选择区间按钮
            scope:[],
            //选择日期组件关闭时回调函数
            onchoose:$.noop,
            //选择日期时回调函数
            onselect:$.noop,
            //组件显示时回调函数
            onshow:$.noop,
            //组件隐藏时回调函数
            onhide:$.noop,
            //编辑单元格
            editcell:null
        }, options||{});
        //将options备份，重置时将更改的选项还原
        that.optionsCache = $.extend({}, that.options)
        that.index = ++Calendar.id;
        Calendar.box[that.index] = that;
    }, win = $(window), doc = $(document);
    
    doc.click(function(e){
    	//防止多个不同组件同时显示问题
    	if(e.target[Calendar.attr] === undefined && Calendar.current > 0){
    		Calendar.box[Calendar.current].hide();
    	}
    });
    
    win.resize(function(){
        if(Calendar.current >= 0){
            Calendar.box[Calendar.current].resize();
        }
    })
    
    //存储对象实例
    Calendar.box = {};
    
    //给实例绑定唯一id
    Calendar.id = 0;
    
    //target上增加属性存储id
    Calendar.attr = '_calendarid_';
    
    //当前显示的id
    Calendar.current = -1;
    
    Calendar.add = ['prepend', 'append'];
    
    Calendar.week = ['日', '一', '二', '三', '四', '五', '六'];
    
    Calendar.time = {hour:'小时', minute:'分钟', second:'秒数'};
    
    //此事件集合下不会触发组件调用
    Calendar.filterEvent = ['load', 'readystatechange', 'DOMContentLoaded'];
    
    Calendar.getSize = function(selector, dir, attr){
        var size = 0;
        attr = attr || 'border';
        dir = dir || 'tb';
        if(attr === 'all'){
            return Calendar.getSize(selector, dir) + Calendar.getSize(selector, dir, 'padding');
        }
        var arr = [{
            border:{
                lr:['LeftWidth', 'RightWidth'],
                tb:['TopWidth', 'BottomWidth']
            }
        }, {
            padding:{
                lr:['Left', 'Right'],
                tb:['Top', 'Bottom']
            }
        }, {
            margin:{
                lr:['Left', 'Right'],
                tb:['Top', 'Bottom']
            }
        }];
        $.each(arr, function(key, val){
            if(val[attr]){
                $.each(val[attr][dir], function(k, v){
                    var value = parseInt(selector.css(attr+v));
                    size += isNaN(value) ? 0 : value;
                });
            }
        });
        return size;
    }
    
    Calendar.format = function(scope, format, flag){
        var date, timestamp;
        if(typeof scope === 'number'){
            if(format === true){
                flag = true;
                format = '';
            }
            if(flag === true){
                timestamp = scope;
            }
            else{
                timestamp = new Date().getTime() + scope*86400000;
            }
            date = new Date(timestamp);
        }
        else if($.isArray(scope) && scope[0] && scope[1]){
            date = new Date(scope[0], scope[1]-1, Calendar.getDay(scope[0], scope[1]));
        }
        else{
            if(typeof scope === 'string'){
                format = scope;
            }
            date = new Date();
        }
        if(!format){
            format = 'yyyy-MM-dd';
        }
        var map = {
            'y':date.getFullYear().toString(),
            'M':date.getMonth()+1,
            'd':date.getDate(),
            'h':date.getHours(),
            'm':date.getMinutes(),
            's':date.getSeconds()
        }
        format = format.replace(/([yMdhms])+/g, function(all, single){
            var value = map[single];
            if(value !== undefined){
                if(single === 'y'){
                    return value.substr(4-all.length);
                }
                if(all.length > 1){
                   value = '0' + value;
                   value = value.substr(value.length-2);
                } 
                return value;
            }
            return all;
        });
        return format;
    }
    
    //获取所有月的天数
    Calendar.getDay = function(year, month){
        var arr = [31, ((year % 4) == 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if(!month){
            return arr
        }
        return arr[month-1]
    }
    
    Calendar.prototype = {
        constructor:Calendar,
        init:function(init){
            var that = this, opts = that.options;
            
            if(opts.iscope){
                opts.isclose = false;
            }
            
            if(opts.ismonth || opts.drowdown > 0){
                opts.istime = false;
            }
            
            if(opts.target){
                that.target = $(opts.target);
                that.target[0][Calendar.attr] = that.index
            }
            
            if(init !== false){
                that.run();
            }
            else{
                that.initVal();
            }
            
            return ({
                //重设options值
                set:function(key, val){
                    if(key === 'value'){
                        that.setVal(val||'')
                    }
                    else if(key || val){
                        if($.isPlainObject(key)){
                            that.options = $.extend(that.options, key);
                        }
                        else{
                            that.options[key] = val;
                        }
                        that.run(true);
                    }
                    return this
                },
                //获取options值
                get:function(key){
                    if(!key){
                        return that.options
                    }
                    else if(key === 'value'){
                        return that.setVal(false)||''
                    }
                    else{
                        return that.options[key]
                    }
                },
                //显示组件
                show:function(){
                    that.run();
                    return this
                },
                //隐藏组件
                hide:function(flag){
                    that.hide();
                    if(flag === true){
                        that.elem.remove();
                        that.elem = null
                    }
                    return this
                },
                //销毁组件
                destroy:function(){
                    this.hide(true);
                    that.target.off(opts.event||'click', that.eventCallback);
                    delete that.target[0][Calendar.attr];
                    delete Calendar.box[that.index]
                },
                //重置日历为初始状态
                reset:function(){
                    that.options = $.extend(that.options, that.optionsCache);
                    return this
                }
            });
        },
        run:function(setOpts){
            var that = this, opts = that.options;
            if(setOpts === true){
                if((!that.startime && !that.initime) || 
                    (opts.min && that.getTime(that.startime) < that.getTime(that.validDate(opts.min, true))) || 
                    (opts.max && that.getTime(that.initime) > that.getTime(that.validDate(opts.max, true)))){
                    that.setVal('')
                }
                else{
                    return;
                }
            }
            
            if(!that.elem){
                that.createWrap();
            }

            that.initVal();
            that.show();
            if($.isPlainObject(opts.ajax)){
                
                that.createBody(true)
            }
        },
        initVal:function(){
            var that = this, opts = that.options;
            that.max = opts.max ? that.getTime(that.validDate(opts.max, true)) : 0;
            that.min = opts.min ? that.getTime(that.validDate(opts.min, true)) : 0;
            var val = '';
            
            if(that.target){
                var target = that.target[0];
                if(target){
                    if(target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA'){
                        val = that.target.val();
                    }
                    else{
                        val = that.target.text();
                        
                    }
                    val = that.validDate(val);
                }
            }
            
            if(val){
                val = val.split(opts.joint);
                if(val.length === 1){
                    that.initime = that.startime = that.validDate(val[0], true)
                }
                else{
                    that.startime = that.validDate(val[0], true);
                    that.initime = that.validDate(val[1], true)
                }
            }
            else{
                that.initime = opts.initime ? that.validDate(opts.initime, true) :  Calendar.format();
                that.startime = opts.startime ? that.validDate(opts.startime, true) : that.initime;
            }
            
            that.startime = that.getArr(that.getTime(that.startime));
            that.initime = that.getArr(that.getTime(that.initime));
            that.current = [that.startime[0], that.startime[1]];
            if(opts.ismonth){
                var year = that.initime[0];
                that.nextcurrent = [year, that.initime[1]];
            }
        },
        createWrap:function(){
            var that = this, opts = that.options;
            that.container = $(opts.container || 'body');
            that.elem = $('<div class="ui-calendar" style="display:none;"></div>').appendTo(that.container);
            if(opts.drowdown > 0){
                that.elem.addClass('ui-calendar-dropdown')
            }
            else if(opts.ismonth){
                that.elem.addClass('ui-calendar-month')
            }
            if(opts.istwo){
                that.elem.addClass('ui-calendar-multi');
            }
            if(opts.theme){
                that.elem.addClass('t-calendar-'+opts.theme);
            }
            if(that.container.get(0).nodeName === 'BODY'){
                that.elem.css('position', 'absolute');
            }
            else{
                opts.isclose = false;
            }
            that.bindEvent();
        },
        createContent:function(){
            var that = this, opts = that.options, scope = opts.scope.length, button = opts.button.length, tpl = '';
            if(scope){
                var i = 0;
                var startime = Calendar.format(that.getTime(that.startime), opts.format, true);
                var initime = Calendar.format(that.getTime(that.initime), opts.format, true);
                var initdate = Calendar.format(opts.format);
                tpl += '<div class="ui-calendar-head clearfix">';
                for(i; i<scope; i++){
                    var btn = opts.scope[i];
                    var crt = '';
                    var startdate = Calendar.format(parseInt(btn.value), opts.format);
                    if((initime === startdate && startime === initdate) || (initime === initdate && startime === startdate)){
                        crt = 'class="s-crt"';
                    }
                    tpl += '<em scope="'+ btn.value +'" '+ crt +'>'+ btn.text +'</em>';
                }
                tpl += '</div>';
            }
            tpl += '<div class="ui-calendar-body clearfix">'+ that.createBody() +'</div>';
            if(opts.istime || button){
                tpl += '<div class="ui-calendar-foot clearfix">';
                if(opts.istime){
                    tpl += '<p><b>时间</b>';
                    if(opts.format.indexOf('h') !== -1){
                        tpl += '<em type="hour">'+ that.initime[3] +'</em>';
                    }
                    if(opts.format.indexOf('m') !== -1){
                        tpl += '<em type="minute">'+ that.initime[4] +'</em>';
                    }
                    if(opts.format.indexOf('s') !== -1){
                        tpl += '<em type="second">'+ that.initime[5] +'</em>';
                    }
                    tpl += '</p>';
                }
                if(button){
                    tpl += '<span class="calendar-btn">';
                    $.each(opts.button, function(k, btn){
                        tpl += '<em class="'+ btn.name +'">'+ btn.text +'</em>';
                    })
                    tpl += '</span>';
                }
                tpl += '</div>';
            }
            return tpl;
        },
        createWeek:function(){
            var that = this, opts = that.options, tpl = '<tr>', i = 0;
            for(i; i<7; i++){
                var rest = i === 0 || i === 6 ? ' class="rest"' : '';
                var week = Calendar.week[i];
                if(opts.week && opts.week[i]){
                    week = opts.week[i];
                }
                tpl += ('<th'+ rest +'>' + week + '</th>')
            }
            tpl += '</tr>';
            return tpl;
        },
        createMain:function(year, month){
            var that = this, tpl = '';
            if(!that.options.ismonth){
                var prevdate = that.resetDate(year, month, -1);
                var nextdate = that.resetDate(year, month, 1);
                return '<div class="ui-calendar-main">\
                            <div class="ui-calendar-tab">\
                                <span class="tabdir tab-left">\
                                    <em'+ that.setClass('dirbtn prevYear', year-1+month, that.getcb('yyyy-MM')) +'></em>\
                                    <em'+ that.setClass('dirbtn prevMonth', prevdate.year+''+prevdate.month, that.getcb('yyyy-MM')) +'></em>\
                                </span>\
                                <div class="ui-calendar-date">\
                                    <dl class="calendar-year">\
                                        <dt type="year">'+ year +'</dt>\
                                    </dl>\
                                    <b>年</b>\
                                    <dl class="calendar-month">\
                                        <dt type="month">'+ month +'</dt>\
                                    </dl>\
                                    <b>月</b>\
                                </div>\
                                <span class="tabdir tab-right">\
                                    <em'+ that.setClass('dirbtn nextMonth', nextdate.year+''+nextdate.month, that.getcb('yyyy-MM')) +'></em>\
                                    <em'+ that.setClass('dirbtn nextYear', year+1+month, that.getcb('yyyy-MM')) +'></em>\
                                </span>\
                            </div>\
                            <table class="ui-calendar-table">\
                                <thead>'+ that.createWeek() +'</thead>\
                                <tbody>'+ that.createCell(year, month) +'</tbody>\
                            </table>\
                        </div>';
            }
            return '<div class="ui-calendar-main">\
                        <div class="ui-calendar-tab">\
                            <span class="tabdir tab-left">\
                                <em class="dirbtn prevYear"></em>\
                            </span>\
                            <div class="ui-calendar-date">\
                                <dl>\
                                    <dt type="year">'+ year +'</dt>\
                                </dl>\
                                <b>年</b>\
                            </div>\
                            <span class="tabdir tab-right">\
                                <em class="dirbtn nextYear"></em>\
                            </span>\
                        </div>\
                        <table class="ui-calendar-table"><tbody>'+ that.createList(year) +'</tbody></table>\
                    </div>';
        },
        //创建主体
        createBody:function(flag){
            var that = this, opts = that.options, tpl = '';
            if(opts.drowdown > 0){
                var format = opts.format;
                if((/h+/g).test(format)){
                    tpl += that.createTime('hour', that.getTimeArr(23), that.startime[3], true);
                }
                if((/m+/g).test(format)){
                    tpl += that.createTime('minute', that.getTimeArr(59), that.startime[4], true);
                }
                if((/i+/g).test(format)){
                    tpl += that.createTime('second', that.getTimeArr(59), that.startime[5], true);
                }
            }
            else{
                var year = that.current[0];
                var month = that.current[1];
                tpl += that.resetBody(flag, 0, year, month);
                if(opts.istwo){
                    if(opts.ismonth){
                        year = that.nextcurrent[0];
                        month = that.nextcurrent[1];
                    }
                    else{
                        var date = that.resetDate(year, month, 1);
                        year = date.year;
                        month = date.month;
                    }
                    tpl += that.resetBody(flag, 1, year, month);
                }
            }
            return tpl;
        },
        //加载主体部分
        resetBody:function(flag, index, year, month){
            var that = this, opts = that.options, ajax = opts.ajax;
            month = that.mend(month)
            if(flag){
                if($.isPlainObject(ajax)){
                    var success = ajax.success;
                    var error = ajax.error;
                    ajax.loading = $.extend({
                        show:$.noop,
                        hide:$.noop
                    }, ajax.loading||{});
                    var data = ajax.data;
                    if(typeof data === 'function'){
                        data = data(year, month) || {};
                    }
                    ajax.loading.show(that.elem);
                    $.ajax($.extend({
                        dataType:'json',
                        cache:false
                    }, ajax, {
                        data:data,
                        success:function(res){
                            that.response = res;
                            that.body.find('.ui-calendar-main').eq(index).remove();
                            that.body[Calendar.add[index]](that.createMain(year, month));
                            if(typeof success === 'function'){
                                success.call(this, res, that.elem);
                            }
                            ajax.loading.hide(that.elem);
                        },
                        error:function(){
                            if(typeof error === 'function'){
                                error.call(this);
                            }
                            ajax.loading.hide(that.elem);
                        }
                    }))
                }
                else{
                    that.body.find('.ui-calendar-main').eq(index).remove();
                    that.body[Calendar.add[index]](that.createMain(year, month));
                }
            }
            else{
                return that.createMain(year, month);
            }
        },
        //创建单元格
        createCell:function(year, month){
            var that = this, opts = that.options, a = 1, b = 1, c = 1, d = 1, tpl = '';
            var startime = that.getTime(that.startime), initime = that.getTime(that.initime);
            var date = new Date(year, month-1, 1);
            //获取月初是星期几
            var week = date.getDay();
            if(week === 7){
                week = 0;
            }
            var monthArray = Calendar.getDay(year);
            var days = monthArray[month-1];
            for(a; a<43; a++){
                if((a-1)%7 === 0){
                    tpl += '<tr>';
                }
                if(a > week && b <= days){
                    tpl += '<td data-year="'+ year +'" data-month="'+ month +'" data-day="'+ that.mend(b) +'"'+ that.setClass('cell', startime, [year, month, b], initime) +'><span>'+ that.editCell(that.mend(b)) +'</span></td>';
                    b++;
                }
                else if(opts.isprev && a <= week && c <= week){
                    //获取上月末尾时间
                    var lastMonth = month-1;
                    var lastYear = year;
                    if(lastMonth === 0){
                        lastMonth = 12;
                        lastYear--;
                    }
                    var end = monthArray[lastMonth-1];
                    var start = end - week;
                    if(start+c <= end){
                        var lastDay = start+c;
                        tpl += '<td data-year="'+ lastYear +'" data-month="'+ lastMonth +'" data-day="'+ that.mend(lastDay) +'"'+ that.setClass('cell other-cell', startime, [lastYear, lastMonth, lastDay], initime) +'><span>'+ that.editCell(that.mend(lastDay), true) +'</span></td>';
                    }
                    c++;
                }
                else if(opts.isnext && a < 43 && a > days+week){
                    //获取下月月初时间
                    var nextMonth = (month|0)+1;
                    var nextYear = year;
                    if(nextMonth === 13){
                        nextMonth = 1;
                        nextYear++;
                    }
                    tpl += '<td data-year="'+ nextYear +'" data-month="'+ nextMonth +'" data-day="'+ that.mend(d) +'"'+ that.setClass('cell other-cell', startime, [nextYear, nextMonth, d], initime) +'><span>'+ that.editCell(that.mend(d), true) +'</span></td>';
                    d++;
                }
                else{
                    tpl += '<td></td>'
                }
                if(a%7 === 0){
                    tpl += '</tr>';
                }
            }
            if(!opts.isprev){
                tpl = tpl.replace(/^\<tr\>(\<td\>\<\/td\>){7}\<\/tr\>/g, '')
            }
            if(!opts.isnext){
                tpl = tpl.replace(/\<tr\>(\<td\>\<\/td\>){7}\<\/tr\>$/g, '')
            }
            delete that.response;
            return tpl;
        },
        createList:function(year){
            var that = this, opts = that.options, i = 1, tpl = '';
            var startime = that.getTime([that.startime[0], that.startime[1], that.startime[2]]), initime = that.getTime([that.initime[0], that.initime[1], that.initime[2]]);
            var count = opts.monthcount;
            for(i; i<=12; i++){
                var month = that.mend(i);
                if((i-1)%count === 0){
                    tpl += '<tr>';
                }
                tpl += '<td'+ that.setClass('cell', startime, [year, month, '01'], initime) +' data-year="'+ year +'" data-month="'+ month +'" data-day="01"><span>'+ that.editCell(month) +'</span></td>';
                if(i%count === 0){
                    tpl += '</tr>';
                }
            }
            return tpl;
        },
        createDate:function(index, val, month){
            var that = this, opts = that.options, i = 0, cls;
            var tpl = '<dd><i></i><s></s>';
            if(!month){
                tpl += '<span class="upYear"><i></i></span>';
            }
            tpl += '<ul class="clearfix">';
            var crt = that[index === 0 ? 'current':'nextcurrent'][0];
            var cb = that.getcb('yyyy-MM');
            if(month){
                val = crt+val;
                for(i=1; i<=12; i++){
                    var m = that.mend(i);
                    var temp = crt + m;
                    tpl += '<li'+ that.setClass('', temp, val, cb) +'>'+ m +'</li>'; 
                }
            }
            else{
                var crtmonth = that.current[1];
                var count = opts.yearcount/2;
                var len = (val|0)+count-1;
                for(i=val-count; i<=len; i++){
                    tpl += '<li'+ that.setClass('', i+crtmonth, crt+crtmonth, cb) +'>'+ i +'</li>'; 
                }
            }
            tpl += '</ul>';
            if(!month){
                tpl += '<span class="downYear"><i></i></span>';
            }
            tpl += '</dd>';
            return tpl;
        },
        createTime:function(type, arr, crt, hide){
            var that = this, opts = that.options, len = arr.length, i = 0;
            var tpl = '<div class="ui-calendar-time '+ type +'">';
            if(!hide){
                tpl += '<div class="ui-calendar-timehead">'+ Calendar.time[type] +'<i title="关闭">×</i></div>';
            }
            var timebody = '<div class="ui-calendar-timebody clearfix" type="'+ type +'">';
            var format = 'yyyy-MM-dd';
            var initime = that.initime[0] + that.initime[1] + that.initime[2];
            var startime = that.startime[0] + that.startime[1] + that.startime[2];
            if(type == 'hour'){
                format += '-hh';
            }
            else if(type == 'minute'){
                format += '-hh-mm';
                initime = initime + that.initime[3];
                startime = startime + that.startime[3];
            }
            else{
                format += '-hh-mm-ss';
                initime = initime + that.initime[3] + that.initime[4];
                startime = startime + that.startime[3] + that.startime[4];
            }
            var max = that.max ? Calendar.format(that.max, format, true).replace(/-/g, '') : 0;
            var min = that.min ? Calendar.format(that.min, format, true).replace(/-/g, '') : 0;
            var item = '';
            for(i; i<len; i++){
                var cls = arr[i] == crt ? 's-crt' : '';
                var start = startime + arr[i];
                var init = initime + arr[i];
                if((min && start < min) || (max && init > max)){
                    if(cls){
                        cls += ' s-dis';
                    }
                    else{
                        cls = 's-dis';
                    }
                }
                if(cls){
                    cls = ' class="'+ cls +'"';
                }
                timebody += '<span'+ cls +'>'+ arr[i] +'</span>';
            }
            timebody += '</div>';
            if(hide === 0){
                return timebody
            }
            tpl = tpl + timebody + '</div>';
            return tpl;
        },
        setClass:function(name, startime, currentime, initime, cb){
            var that = this, className = '';
            var min = that.min;
            var max = that.max;
            var flag = false;
            if(typeof currentime !== 'function'){
                if(typeof currentime === 'object'){
                    currentime = that.getTime(currentime.concat([that.initime[3], that.initime[4], that.initime[5]]))
                }
                if(typeof initime === 'function'){
                    cb = initime;
                    initime = startime;
                    flag = true;
                }
                if(startime <= currentime && currentime <= initime){
                    if(startime == currentime || currentime == initime){
                        className += 's-crt';
                    }
                    else{
                        className += 's-sel';
                    }
                }
                if(flag){
                    currentime = startime;
                }
            }
            else{
                cb = currentime;
                currentime = startime;
            }
            if(cb){
                var res = cb.call(that);
                min = res.min;
                max = res.max;
            }
            if((min && currentime < min) || (max && currentime > max)){
                className += ((className ? ' ' : '') + 's-dis')
            }
            if(name){
                className = name + (className ? ' '+className : '');
            }
            return className = className ? ' class="'+ className +'"':'';
        },
        editCell:function(day, other){
            var that = this, opts = that.options;
            if(typeof opts.editcell === 'function'){
                return opts.editcell(day, other, that.response) || day;
            }
            return day;
        },
        reverse:function(){
            var that = this;
            var startime = that.getTime(that.startime);
            var initime = that.getTime(that.initime);
            if(startime > initime){
                var tmp = initime;
                initime = startime;
                startime = tmp;
            }
            that.initime = that.getArr(initime);
            that.startime = that.getArr(startime);
        },
        resetDate:function(year, month, count){
            var that = this;
            month = (month|0) + count;
            if(month == 0){
                month = 12;
                year--;
            }
            else if(month == 13){
                month = 1;
                year++;
            }
            return ({
                month:that.mend(month),
                year:year
            })
        },
        getcb:function(format){
            var that = this;
            format = format || 'yyyy-MM-dd';
            var max = that.max ? Calendar.format(that.max, format, true).replace(/-/g, '') : 0;
            var min = that.min ? Calendar.format(that.min, format, true).replace(/-/g, '') : 0;
            return (function(){
                return ({
                    max:max,
                    min:min
                })
            })
        },
        bindEvent:function(){
            var that = this, opts = that.options;
            that.elem.on('click', function(e){
                that.elem.find('.ui-calendar-tab dd').remove();
                if(opts.drowdown<=0){
                    that.elem.find('.ui-calendar-time').remove();
                }
                e.stopPropagation();
            }).on('click', '[scope]', function(e){
                var me = $(this);
                //me.addClass('s-crt').siblings('[scope]').removeClass('s-crt');
                var scope = parseInt(me.attr('scope'));
                var initdate = Calendar.format(opts.format);
                var startdate = Calendar.format(scope, opts.format);
                initime = that.getArr(that.getTime(that.validDate(initdate, true)));
                startime = that.getArr(that.getTime(that.validDate(startdate, true)));
                that.setTime(initime, startime);
                that.reverse();
                that.current[0] = initime[0];
                that.current[1] = initime[1];
                that.show();
                var date = initdate;
                if(initdate != startdate){
                    date = startdate + opts.joint + initdate;
                }
                opts.onselect(date.split(opts.joint), that.elem, that.target);
            }).on('click', '.cell:not(.s-dis)'+ (!opts.isclick ? ':not(.other-cell)' : '') +', .today, .confirm', function(e){
                var me = $(this), initime = that.initime, startime = that.startime;
                if(me.hasClass('today') || me.hasClass('confirm')){
                    if(me.hasClass('today')){
                        initime = startime = that.getArr(that.getTime(false));
                    }
                }
                else{
                    var scope = that.elem.find('.ui-calendar-head em.s-crt');
                    //多选
                    if(opts.iscope && !scope.length){
                        var data = me.data();
                        if(!opts.istride){
                            if((!opts.ismonth && initime[0]+initime[1] != data.year+that.mend(data.month)) || (opts.ismonth && initime[0] != data.year)){
                                startime = data;
                            }
                        }
                        if(!that.equal(initime, startime)){
                            startime = initime = data;
                            me.addClass('s-crt');
                        }
                        else{
                            initime = data;
                            if(me.hasClass('s-crt')){
                                startime = initime;
                            }
                            else{
                                me.addClass('s-crt');
                            }
                        }
                        that.elem.find('[scope]').removeClass('s-crt');
                    }
                    else{
                        var main = me.closest('.ui-calendar-main');
                        if(main.index() === 0){
                            that.body.find('.s-crt, .s-sel').removeClass('s-crt s-sel');
                            initime = startime = me.addClass('s-crt').data();
                        }
                        else{
                            main.find('.s-crt, .s-sel').removeClass('s-crt s-sel');
                            initime = me.addClass('s-crt').data();
                        }
                    }
                }
                that.setTime(initime, startime);
                that.reverse();
                var enddate = Calendar.format(that.getTime(that.initime), opts.format, true);
                var startdate = Calendar.format(that.getTime(that.startime), opts.format, true);
                var date = enddate;
                if(enddate != startdate){
                    date = startdate + opts.joint + enddate;
                }
                if(this.nodeName === 'TD' && !opts.isclose){
                    opts.onselect(date.split(opts.joint), that.elem, that.target);
                    if(opts.iscope){
                        that.show();
                    }
                    return;
                }
                that.setVal(date)
                that.hide();
                opts.onchoose(date.split(opts.joint), that.elem, that.target);
            }).on('click', '.dirbtn', function(e){
                var me = $(this);
                var index = me.closest('.ui-calendar-main').index();
                if(!me.hasClass('s-dis')){
                    if(me.hasClass('prevYear')){
                        if(opts.ismonth && index === 1){
                            --that.nextcurrent[0];
                        }
                        else{
                            --that.current[0];
                        }
                    }
                    else if(me.hasClass('prevMonth')){
                        if(--that.current[1] === 0){
                            that.current[1] = 12;
                            --that.current[0];
                        }
                    }
                    else if(me.hasClass('nextYear')){
                        if(opts.ismonth && index === 1){
                            ++that.nextcurrent[0];
                        }
                        else{
                            ++that.current[0];
                        }
                    }
                    else if(me.hasClass('nextMonth')){
                        if(++that.current[1] === 13){
                            that.current[1] = 1;
                            ++that.current[0];
                        }
                    }
                    that.createBody(true);
                }
            }).on('click', '.clear', function(e){
                that.setVal('');
                opts.onselect([''], that.elem, that.target);
            }).on('click', '.close', function(e){
                that.hide();
            }).on('click', '.ui-calendar-time, .ui-calendar-tab dl, .ui-calendar-foot p em', function(e){
                e.stopPropagation()
            });
            
            if(opts.drowdown > 0){
                that.elem.on('click', '.ui-calendar-timebody span', function(){
                    var me = $(this);
                    if(!me.hasClass('s-dis')){
                        var type = me.parent().attr('type');
                        me.addClass('s-crt').siblings().removeClass('s-crt')
                        if(type == 'hour'){
                            that.initime[3] = that.startime[3] = me.text();
                            var minute = that.elem.find('.ui-calendar-timebody[type="minute"]');
                            if(minute.length){
                                minute.replaceWith(that.createTime('minute', that.getTimeArr(59), that.startime[4], 0))
                            }
                            var second = that.elem.find('.ui-calendar-timebody[type="second"]');
                            if(second.length){
                                second.replaceWith(that.createTime('second', that.getTimeArr(59), that.startime[5], 0))
                            }
                        }
                        else if(type == 'minute'){
                            that.initime[4] = that.startime[4] = me.text();
                            var second = that.elem.find('.ui-calendar-timebody[type="second"]');
                            if(second.length){
                                second.replaceWith(that.createTime('second', that.getTimeArr(59), that.startime[5], 0))
                            }
                        }
                        else{
                            that.initime[5] = that.startime[5] = me.text();
                        }
                    }
                })
                return;
            }
            
            if(opts.istime){
                that.elem.on('click', '.ui-calendar-foot p em', function(e){
                    var me = $(this);
                    var type = me.attr('type');
                    var arr;
                    if(type == 'hour'){
                        arr = that.getTimeArr(23)
                    }
                    else{
                        arr = that.getTimeArr(59)
                    }
                    that.elem.find('.ui-calendar-time').remove();
                    that.elem.find('.ui-calendar-foot').append(that.createTime(type, arr, me.text()));
                }).on('click', '.ui-calendar-timehead i', function(){
                    $(this).closest('.ui-calendar-time').remove();
                }).on('click', '.ui-calendar-timebody span', function(){
                    var me = $(this);
                    if(!me.hasClass('s-dis')){
                        var type = me.parent().attr('type');
                        that.elem.find('.ui-calendar-foot p [type="'+ type +'"]').text(me.text());
                        var time = {
                            hour:'00',
                            minute:'00',
                            second:'00'
                        }
                        that.elem.find('.ui-calendar-foot p em').each(function(){
                            var em = $(this);
                            time[em.attr('type')] = em.text();
                        });
                        that.initime[3] = that.startime[3] = time.hour;
                        that.initime[4] = that.startime[4] = time.minute;
                        that.initime[5] = that.startime[5] = time.second;
                    }
                    me.closest('.ui-calendar-time').remove();
                });
            }
            if(opts.isdate){
                that.elem.on('click', '.ui-calendar-date [type]', function(){
                    var me = $(this), ele = me.parent();
                    var index = 0;
                    ele.parent().find('dd').remove();
                    if(opts.ismonth){
                        index = me.closest('.ui-calendar-main').index();
                    }
                    ele.append(that.createDate(index, me.text(), me.attr('type') === 'month'));
                }).on('click', '.ui-calendar-date li', function(){
                    var me = $(this);
                    var dd = me.closest('dd');
                    if(!me.hasClass('s-dis')){
                        var type = dd.parent().find('dt').attr('type');
                        var mod = 'current';
                        if(opts.ismonth){
                            var index = me.closest('.ui-calendar-main').index();
                            index === 1 && (mod = 'nextcurrent')
                        }
                        that[mod][type === 'year' ? 0 : 1] = me.text();
                        that.createBody(true);
                    }
                    dd.remove();
                }).on('click', '.ui-calendar-date dd span', function(){
                    var me = $(this);
                    var ele = me.closest('dl');
                    var item = me.siblings('ul').children('li');
                    var year;
                    var index = 0;
                    if(opts.ismonth){
                        index = me.closest('.ui-calendar-main').index();
                    }
                    var count = opts.yearcount/2;
                    if(me.hasClass('upYear')){
                        year = item.first().text() - count
                    }
                    else{
                        year = (item.last().text()|0) + count + 1;
                    }
                    ele.find('dd').remove();
                    ele.append(that.createDate(index, year));
                })
            }
        },
        setTime:function(initime, startime, time){
            var that = this;
            if(!startime){
                startime = initime;
            }
            that.initime[0] = initime[0]||initime['year'];
            that.initime[1] = that.mend(initime[1]||initime['month']);
            that.initime[2] = that.mend(initime[2]||initime['day']);
            that.startime[0] = startime[0]||startime['year'];
            that.startime[1] = that.mend(startime[1]||startime['month']);
            that.startime[2] = that.mend(startime[2]||startime['day']);
            if(time){
                that.initime[3] = that.startime[3] = time.hour;
                that.initime[4] = that.startime[4] = time.minute;
                that.initime[5] = that.startime[5] = time.second;
            }
        },
        getArr:function(time){
            var date = Calendar.format(time, this.options.ismonth ? 'yyyy MM 01 00 00 00' : 'yyyy MM dd hh mm ss', true);
            date = date.split(' ');
            return date;
        },
        //获取时间戳
        getTime:function(date){
            if(date){
                if($.isArray(date)){
                    return new Date(date[0], date[1]-1, date[2]||1, date[3]||0, date[4]||0, date[5]||0).getTime();
                }
                else{
                    //IE8-不支持横杠
                    date = date.replace(/[-.]/g, '/');
                    return new Date(date).getTime();
                }
            }
            if(date === false){
                return new Date().getTime();
            }
            return 0;
        },
        getTimeArr:function(num){
            var arr = [];
            for(var i=0; i<=num; i++){
                arr.push(this.mend(i));
            }
            return arr;
        },
        setVal:function(val){
            var that = this, target = that.target;
            if(target){
                var elem = that.target.get(0);
                if(elem.nodeName === 'INPUT' || elem.nodeName === 'TEXTAREA'){
                    if(val === false){
                        return target.val()
                    }
                    target.val(val);
                }
                else if(elem != document){
                    if(val === false){
                        return target.text()
                    }
                    target.text(val);
                }
            }
        },
        //校验日期格式
        validDate:function(date, regex){
            var that = this, opts = that.options;
            if(regex){
                if(/^h/.test(opts.format)){
                    date = Calendar.format() + ' ' + date;
                }
                else if(/M$/.test(opts.format)){
                    date += '/01';
                }
                else if(/h$/.test(opts.format)){
                    date += ':00:00';
                }
            }
            else{
                if(date && (!(/^\d{2,4}\D+\d{1,2}/g).test(date))){
                    that.setVal('');
                    return '';
                }
            }
            return date;
        },
        //判断2个数组是否键值相等
        equal:function(arr1, arr2){
            var flag = true, i = 0, len = arr1.length;
            for(i; i<len; i++){
                if(arr1[i] != arr2[i]){
                    flag = false;
                    break;
                }
            }
            return flag
        },
        //补齐0
        mend:function(day){
            day = day.toString();
            day.length == 1 && (day = '0'+day);
            return day;
        },
        //显示组件
        show:function(){
            var that = this, opts = that.options;
            that.body = that.elem.html(that.createContent()).find('.ui-calendar-body');
            if(opts.ishide){
                $.each(Calendar.box, function(key, val){
                    if(val.index !== that.index && val.options.ishide){
                        val.hide();
                    }
                })
                Calendar.current = that.index;    
            }
            if(opts.drowdown > 0){
                that.resetSize()
            }
            that.resize();
            opts.onshow(that.elem);
            that.elem.show();
        },
        //隐藏组件
        hide:function(){
            var that = this;
            try{
                Calendar.current = -1;
                that.elem.hide();
                that.options.onhide(that.elem);
            }
            catch(e){}
        },
        //定位
        resize:function(){
            var that = this;
            try{
                var offset = that.target.offset();
                var height = that.target.outerHeight() - 1;
                var top = offset.top + height;
                var oheight = that.elem.outerHeight();
                var stop = win.scrollTop();
                if(win.height() + stop - top < oheight && offset.top-stop >= oheight){
                    top = top - height - oheight;
                }
                that.elem.css({
                    top:top,
                    left:offset.left
                });
            }
            catch(e){}
        },
        resetSize:function(){
            var that = this, opts = that.options;
            var width = 0;
            that.elem.find('.ui-calendar-time').each(function(){
                var time = $(this);
                var span = time.find('span');
                var height = span.outerHeight();
                width += time.outerWidth() + Calendar.getSize(time, 'lr', 'margin');
                time.height(height*opts.drowdown);
                var mid = Math.floor(opts.drowdown/2);
                var crt = time.find('span.s-crt').index() - mid;
                setTimeout(function(){
                    time.scrollTop(crt > 0 ? crt*height : 0)
                })
            })
            that.elem.width(width + Calendar.getSize(that.elem.find('.ui-calendar-body'), 'lr', 'all'))
        }
    }
    
    //修复firefox获取不到event对象问题
    if($.browser.mozilla){
        var evt = function(){
            var func = evt.caller; 
            while(func != null){
                var arg0 = func.arguments[0];  
                if(arg0 instanceof Event){
                    return arg0;
                }  
                func = func.caller;  
            } 
            return null;
        }
        window.__defineGetter__('event', evt)
    }
    
    $.extend({
        calendar:function(options){
            options = options || {};
            var event = window.event, target = null;
            if(event != undefined){
                target = event.target || event.srcElement;
                if(target === document || $.inArray(event.type, Calendar.filterEvent) !== -1){
                    target = null
                }
            }
            if(options.target && (event === undefined || target === null)){
                var calendar = Calendar.box[options.target[Calendar.attr]] || new Calendar(options);
                target = $(options.target);
                calendar.eventCallback = function(e){
                    if(!target.hasClass('s-dis') && !target.prop('disabled')){
                        calendar.run();
                    }
                }
                target.on(options.event||'click', calendar.eventCallback);
                return calendar.init(false);
            }
            else{
                //document点击时会判断目标元素如果没有Calendar.attr属性，就会隐藏日历组件，这是为了防止多个不同组件(select、search...)同时显示的问题
                //默认target是不含有该属性的，这就会导致target触发事件时日历组件不显示的问题，因此默认给target添加Calendar.attr属性
                if(target && target[Calendar.attr] === undefined){
                    target[Calendar.attr] = ''
                }
                options.target = $(options.target||target)[0];
                if(options.target){
                    return (Calendar.box[options.target[Calendar.attr]] || new Calendar(options)).init()
                }
                return new Calendar(options).init()
            }
        }
    })
    
    $.calendar.date = Calendar.format;

})(this, document, jQuery);;
///<jscompress sourcefile="jquery.checkradio.js" />
/**
 * @filename jquery.checkradio.js
 * @author Aniu[2016-04-27 14:00]
 * @update Aniu[2016-08-23 22:44]
 * @version v1.4
 * @description 模拟单选复选框
 */

;!(function($, undefined){
    $.fn.checkradio = function(attr, value){
		if(!attr || $.isPlainObject(attr)){
			var o = $.extend({
				/**
				 * @func 配置开关按钮
				 * @type <Object>
				 */
				switches:{
					off:'',
					on:''
				},
				/**
				 * @func 点击元素状态改变前回调，如返回值为false则将阻止状态改变
				 * @type <Function>
				 * @return <undefined, Boolean>
				 */
				beforeCallback:$.noop,
				/**
				 * @func 点击元素状态改变后回调
				 * @type <Function>
				 */
				callback:$.noop
			}, attr||{});
			return this.each(function(){
				var me = $(this);
				var checkradio = me.closest('.ui-checkradio');
				if(!checkradio.length){
					return;
				}
				var checked = me.prop('checked') ? ' s-checked' : '';
				var disabled = me.prop('disabled') ? ' s-dis' : '';
				var name = me.attr('name');
				var switches = $.extend({}, o.switches, me.data()||{});
				var switchElem = checkradio.find('.text');
				var type = 'radio';
				if(me.is(':checkbox')){
					type = 'checkbox';
				}
				if(checkradio.children().attr('checkname')){
					checkradio.children().attr('class', 'ui-'+ type + checked + disabled);
				}
				else{
					if(switches.off && switches.on){
						checkradio.addClass('ui-switches');
						switchElem = $('<s class="text">'+ (me.prop('checked') ? switches.on : switches.off) +'</s>').insertBefore(me);
					}
					me.css({position:'absolute', top:'-999em', left:'-999em', opacity:0}).wrap('<i></i>');
					checkradio.wrapInner('<em class="ui-'+ type + checked + disabled +'" checkname="'+ name +'"></em>')
					.children().click(function(e){
						var ele = $(this);
						if(me.is(':disabled') || o.beforeCallback(me, e) === false){
							return false;
						}
						if(me.is(':checkbox')){
							var checked = me.prop('checked');
							me.prop('checked', !checked);
							ele[(checked ? 'remove' : 'add') + 'Class']('s-checked');
							if(switchElem.length){
								switchElem.text(checked ? switches.off : switches.on);
							}
						}
						else{
							me.prop('checked', true);
							$('.ui-radio[checkname="'+ name +'"]').removeClass('s-checked');
							ele.addClass('s-checked');
						}
						o.callback(me, e)
					});
				}
			});
		}
		else{
			return $(this).prop(attr, value == true).checkradio();
		}
    }
})(jQuery);;
///<jscompress sourcefile="jquery.layer.js" />
/**
 * @filename jquery.layer.js
 * @author Aniu[2014-07-11 14:01]
 * @update Aniu[2016-07-06 13:57]
 * @version v3.3.4
 * @description 弹出层组件
 */

;!(function(window, document, $, undefined){
    var Layer = function(options){
        var that = this;
        that.options = {
            //宽度, 整数
            width:0,
            //高度，整数或者auto
            height:'auto',
            //最大高度，height设置为auto时可以使用
            maxHeight:0,
            //内容，字符串或者jQuery对象
            content:'',
            //1.自定义皮肤主题；2.layer标识，隐藏特定的layer：layerHide(theme);
            theme:'',
            //最大尺寸距离窗口边界边距
            padding:50,
            //弹出层容器，默认为body
            container:'body',
            //定时关闭时间，单位/毫秒
            timer:0,
            //是否淡入方式显示
            isFadein:true,
            //是否开启弹出层动画
            isAnimate:true,
            //是否可以移动
            isMove:true,
            //是否有遮罩层
            isMask:true,
            //点击遮罩层是否关闭弹出层
            isClickMask:false,
            //是否有移动遮罩层
            isMoveMask:false,
            //是否能被laierHide()方法关闭，不传参数
            isClose:true,
            //是否居中
            isCenter:false,
            //是否自适应最大尺寸显示
            isMaxSize:false,
            //是否是ui提示层
            isTips:false,
            //点击layer是否置顶
            isSticky:false,
            //是否固定弹出层
            isFixed:false,
            //标题
            title:{
                enable:true,
                text:''
            },
            //载入浮动框架
            iframe:{
                enable:false,
                cache:false,
                //跨域无法自适应高度
                src:''
            },
            //显示位置
            offset:{
                //是否基于前一个层进行偏移
                isBasedPrev:false,
                top:null,
                left:null
            },
            //小箭头，方向：top right bottom left
            arrow:{
                enable:false,
                dir:'top'
            },
            close:{
                enable:true,
                text:'×',
                /**
                 * @func 弹出层关闭前执行函数，
                 * @param main:$('.ui-layer-main')
                 * @param index:弹出层索引
                 * @param event 事件对象
                 */
                callback:null
            },
            //确认按钮，回调函数return true才会关闭弹层
            confirm:{
                enable:false,
                text:'确定',
                /**
                 * @func 回调函数
                 * @param main:$('.ui-layer-main')
                 * @param index:弹出层索引
                 * @param button:当前触发按钮
                 * @param event:事件对象
                 */
                callback:null
            },
            //取消按钮
            cancel:{
                enable:false,
                text:'取消',
                /**
                 * @func 回调函数
                 * @param main:$('.ui-layer-main')
                 * @param index:弹出层索引
                 * @param event 事件对象
                 */
                callback:null
            },
            //按钮配置，会覆盖confirm和cancel
            button:null,
            /**
             * @func 弹出层显示时执行
             * @param main:$('.ui-layer-main')
             * @param index:弹出层索引
             */
            onShowEvent:null,
            /**
             * @func 弹出层关闭时执行
             * @param main:$('.ui-layer-main')
             * @param index:弹出层索引
             */
            onHideEvent:null,
            /**
             * @func 弹出层大小、位置改变后执行函数
             * @param main:$('.ui-layer-main')
             * @param index:弹出层索引
             */
            onResizeEvent:null,
            /**
             * @func window窗口改变大小时执行函数
             * @param layer:$('.ui-layer')
             * @param width:窗口宽度
             * @param height:窗口高度
             * @param event 事件对象
             */
            onWinRisizeEvent:null,
            /**
             * @func window窗口滚动时执行函数
             * @param layer:$('.ui-layer')
             * @param scrollTop:窗口滚动高度
             * @param event 事件对象
             */
            onWinScrollEvent:null,
            /**
             * @func 遮罩层点击回调函数
             * @param layer:$('.ui-layer')
             * @param mask 遮罩层选择器
             * @param event 事件对象
             */
            onMaskClick:null
        }
        that.options = $.extend(true, that.options, Layer.config, options||{});
        that.size = {
            width:0,
            height:0
        }
        that.index = Layer.index++;
        that.eventArray = [];
        Layer.zIndex++;
        return Layer.listArray[that.index] = that.init();
    }, win = $(window), doc = $(document);
    Layer.index = 0;
    Layer.zIndex = 10000;
    Layer.bsie6 = !!window.ActiveXObject && !window.XMLHttpRequest;
    Layer.listArray = [];
    Layer.mask = null;
    Layer.config = {};
    Layer.getSize = function(selector, dir, attr){
        var size = 0;
        attr = attr || 'border';
        dir = dir || 'tb';
        if(attr === 'all'){
            return Layer.getSize(selector, dir) + Layer.getSize(selector, dir, 'padding');
        }
        var arr = [{
            border:{
                lr:['LeftWidth', 'RightWidth'],
                tb:['TopWidth', 'BottomWidth']
            }
        }, {
            padding:{
                lr:['Left', 'Right'],
                tb:['Top', 'Bottom']
            }
        }];
        $.each(arr, function(key, val){
            if(val[attr]){
                $.each(val[attr][dir], function(k, v){
                    var value = parseInt(selector.css(attr+v));
                    size += isNaN(value) ? 0 : value;
                });
            }
        });
        return size;
    }
    /**
     * @func 弹出层居中、高度改变
     * @param index:弹出层索引或者标识
     * @desc 可在框架内操作父窗口弹出层:
     * @desc top.layerResize(document.layer.index)
     * @desc parent.layerHide(document.layer.index)
     */
    window.layerResize = function(index){
        if(typeof index === 'number'){
            Layer.listArray[index].layerResize();
        }
        else if(typeof index === 'string'){
            $.each(Layer.listArray, function(key, val){
                if(val && val.options.theme == index){
                    val.layerResize();
                }   
            });
        }
        else{
            $.each(Layer.listArray, function(key, val){
                if(val && val.options.isCenter == true){
                    val.layerResize();
                }   
            });
        }
    }
    /**
     * @func 移除弹出层
     * @param index:弹出层索引或者标识(theme)
     */
    window.layerHide = function(index){
        if(typeof index === 'number'){
            Layer.listArray[index] && Layer.listArray[index].hide();
        }
        else if(typeof index === 'string'){
            $.each(Layer.listArray, function(key, val){
                val && (val.options.theme == index && val.hide());    
            });
        }
        else{
            $.each(Layer.listArray, function(key, val){
                val && (val.options.isClose == true && val.hide());   
            });
        }
    }
    /**
     * @func 弹出层全局配置
     * @param options <JSON Object> 配置属性
     */
    window.layerConfig = function(options){
        $.extend(true, Layer.config, $.isPlainObject(options) ? options : {});
    }
    
    Layer.prototype = {
        constructor:Layer,
        version:'3.3.3',
        width:410,
        height:220,
        offset:{
            top:0,
            left:0
        },
        title:'温馨提示',
        init:function(){
            var that = this, options = that.options;
            that.wrap = win;
            if(typeof options.container === 'string'){
                options.container = $(options.container||'body');
            }
            if(options.container.get(0) === undefined){
                options.container = $('body');
            }
            if(options.container.get(0).tagName !== 'BODY'){
                options.isFixed = false;
                that.wrap = options.container.css({position:'relative'});
            }
            that.createHtml().show().bindClick();
            if(options.isMove === true && options.title.enable === true){
                that.bindMove();
            }
            if(typeof options.onWinRisizeEvent === 'function'){
                that.bindEvent(win, 'resize', function(e){
                    options.onWinRisizeEvent(that.layer, that.wrap.width(), that.wrap.height(), e);
                });
            }
            if(typeof options.onWinScrollEvent === 'function'){
                that.bindEvent(win, 'scroll', function(){
                    options.onWinScrollEvent(that.layer, win.scrollTop(), e);
                });
            }
            return that;
        },
        createHtml:function(){
            var that = this, options = that.options,
                width = options.width ? options.width : that.width,
                height = options.height ? options.height : that.height,
                theme = options.theme ? ' t-layer-'+options.theme : '',
                tips = options.isTips === true ? (function(){
                    if(options.arrow.enable === true){
                        options.isMove = options.isMask = options.title.enable = options.isCenter = options.isMaxSize = false;
                    }
                    width = 'auto'; 
                    return ' ui-layer-tips';
                })() : '',
                html = '<div class="ui-layer'+ theme + tips +'" style="z-index:'+ Layer.zIndex +';">',
                title = oHeight = oWidth = '';
                html += '<div class="ui-layer-box">';
            if(options.close.enable === true){
                html += '<span class="ui-layer-button ui-layer-close" btnid="close">'+ options.close.text +'</span>';
            }
            if(options.arrow.enable === true){
                html += '<span class="ui-layer-arrow ui-layer-arrow-'+ options.arrow.dir +'"><b></b><i></i></span>';
            }
            if(options.title.enable === true){
                title = options.title.text ? options.title.text : that.title;
                html += '<div class="ui-layer-title"><span>'+ title +'</span></div>';
            }
            html += '<div class="ui-layer-body"><div class="ui-layer-main">';
            if(options.iframe.enable === true){
                html += that.createIframe();
            }
            else{
                if(typeof options.content === 'string'){
                    html += options.content;
                }
            }
            html += '</div></div>';
            if(!$.isPlainObject(options.button)){
                options.button = {};
            }
            var btns = ['confirm', 'cancel', 'close'];
            $.each(btns, function(key, btnid){
                var optsBtn = options[btnid], btnsBtn = options.button[btnid];
                if(optsBtn.enable === true){
                    if(typeof btnsBtn !== 'undefined'){
                        options.button[btnid] = $.extend(optsBtn, btnsBtn);
                    }
                    else{
                        options.button[btnid] = optsBtn;
                    }
                }
            });
            if(!$.isEmptyObject(options.button)){
            	var foot = '';
                $.each(options.button, function(btnid, opts){
                    if(btnid === 'close'){
                        return true;
                    }
                    if(btnid ==='confirm' || btnid ==='cancel'){
                        opts.text = opts.text || (btnid === 'confirm' ? '确定' : '取消');
                    }
                    else{
                        opts.text = opts.text || btnid;
                    }
                    options.button[btnid].text = opts.text;
                    foot += '<span class="ui-layer-button ui-layer-'+ btnid +'" btnid="'+ btnid +'">'+ opts.text +'</span>';
                });
                if(foot){
                	html += '<div class="ui-layer-foot">' + foot +'</div>';
                }
            }
            html += '</div></div>';
            that.layer = $(html).appendTo(options.container);
            if(typeof options.content === 'object'){
                that.layer.find('.ui-layer-main').html(options.content);
            }
            if(options.iframe.enable === true){
                that.iframe = that.layer.find('iframe[name="layer-iframe-'+ that.index +'"]');
            }
            oHeight = Layer.getSize(that.layer, 'tb', 'all');
            oWidth = Layer.getSize(that.layer, 'lr', 'all');
            if(options.isMaxSize !== true){
                height = height - oHeight;
                width = width - oWidth;
            }
            else{
                options.isCenter = true;
                height = that.wrap.outerHeight() - options.padding - oHeight;
                width = that.wrap.outerWidth() - options.padding - oWidth;
                options.height = 'auto';
            }
            if(options.height === 'auto' && options.maxHeight > 0 && that.layer.outerHeight() > options.maxHeight){
                options.height = options.maxHeight;
                height = options.height - oHeight;
            }
            that.layer.css({width:width, height:height});
            return that;
        },
        createIframe:function(){
            var that = this, options = that.options, src = options.iframe.src;
            if(options.iframe.cache === false){
                var flag = '?_=';
                if(src.indexOf('?') !== -1){
                    flag = '&_=';
                }
                src += flag+new Date().getTime();
            }
            return '<iframe frameborder="0" name="layer-iframe-'+ that.index +'" id="layer-iframe-'+ that.index +'" scroll="hidden" style="width:100%;" src="'+ src +'" onload="layerResize('+ that.index +')"></iframe>';
        },
        createMoveMask:function(){
            var that = this, options = that.options, zIndex = Layer.zIndex + 1, theme = options.theme ? ' t-movemask-'+options.theme : '';
            return $('<div class="ui-layer-movemask'+ theme +'" style="z-index:'+ zIndex +';"></div>').appendTo(options.container);
        },
        bindMove:function(){
            var that = this, options = that.options, layer = that.layer, title = that.layer.find('.ui-layer-title'), isMove = false, x, y, mx, my;
            that.bindEvent(title, 'mousedown', function(e){
                isMove = true;
                that.setzIndex();
                if(options.isMoveMask === true){
                    layer = that.moveMask = that.createMoveMask();
                    if(options.isFixed === true && !Layer.bsie6){
                        layer.css('position', 'fixed');
                    }
                    layer.css({
                        width:that.size.width - Layer.getSize(layer, 'lr'),
                        height:that.size.height - Layer.getSize(layer),
                        top:that.offset.top,
                        left:that.offset.left
                    });
                }
                $(this).css({cursor:'move'});
                x = e.pageX - that.offset.left;
                y = e.pageY - that.offset.top;
                return false;
            });
            that.bindEvent(doc, 'mousemove', function(e){
                var width = $(this).width(), height = $(this).height();
                if(isMove){
                    mx = e.pageX - x;
                    my = e.pageY - y;
                    mx < 0 && (mx = 0);
                    my < 0 && (my = 0);
                    mx + that.size.width > width && (mx = width - that.size.width);
                    my + that.size.height > height && (my = height - that.size.height);
                    that.offset.top = my;
                    that.offset.left = mx;
                    layer.css({top:my, left:mx});
                    return !isMove;
                }
            });
            that.bindEvent(doc, 'mouseup', function(){
                if(isMove){
                    isMove = false;
                    title.css({cursor:'default'});
                    mx = mx || that.offset.left;
                    my = my || that.offset.top;
                    if(options.isMoveMask === true){
                        !that.layer.is(':animated') && that.layer.animate({top:my, left:mx}, options.isAnimate === true ? 450 : 0);  
                        layer.remove();
                    }
                    if(Layer.bsie6 && options.isFixed === true){
                        that.offset.winTop = my - win.scrollTop();
                        that.offset.winLeft = my - win.scrollLeft();
                    }
                }
            });
        },
        bindBtnClick:function(){
            var that = this, layer = that.layer, 
                options = that.options,
                main = layer.find('.ui-layer-main'),
                button = layer.find('.ui-layer-button');
            layer.on('click', function(){
               options.isSticky === true && that.setzIndex();
            });
            button.on('click', function(e){
                var me = $(this), btnid = me.attr('btnid'), callback = options.button[btnid].callback;
                if(btnid === 'confirm'){
                    if(typeof callback === 'function' && callback(main, that.index, me, e) === true){
                        that.hide();
                    }
                }
                else{
                    if(typeof callback !== 'function' || (typeof callback === 'function' && callback(main, that.index, me, e) !== false)){
                        that.hide();
                    }
                }
                return false;
            });
        },
        bindClick:function(){
            var that = this;
            $.each(Layer.listArray, function(key, val){
                if(val && val !== that){
                    val.isClick = true;
                }
            });
        },
        bindEvent:function(target, eventType, callback, EventInit){
            var that = this;
            target.bind(eventType, callback);
            EventInit === true && target[eventType]();
            that.eventArray.push({
                target:target,
                eventType:eventType,
                callback:callback
            });
        },
        unbindEvent:function(){
            var that = this;
            $.each(that.eventArray, function(key, val){
                val && val.target.unbind(val.eventType, val.callback);  
            });
            that.eventArray = null;
        },
        setzIndex:function(){
            var that = this, layer = that.layer, i;
            if(that.isClick){
                that.isClick = false;
                layer.css({zIndex:++Layer.zIndex});
                that.bindClick();
            }
        },
        layerResize:function(){
            var that = this, options = that.options, layer = that.layer, bodyHeight, contentHeight, height, box = layer.children('.ui-layer-box'), 
                head = box.children('.ui-layer-title'), body = box.children('.ui-layer-body'), main = body.children('.ui-layer-main'), 
                winStop = that.wrap.scrollTop(), winSleft = that.wrap.scrollLeft(), foot = box.children('.ui-layer-foot'), headHeight = head.outerHeight(), 
                footHeight = foot.outerHeight(), ptb = Layer.getSize(layer, 'tb', 'padding'), bbd = Layer.getSize(body), bl = Layer.getSize(layer), 
                bb = Layer.getSize(box), blt = Layer.getSize(layer, 'lr'), extd = {}, speed = 400, wheight = that.wrap.outerHeight() - options.padding, 
                wwidth = that.wrap.outerWidth() - options.padding, isiframe = typeof that.iframe === 'object', outerHeight = headHeight + footHeight + ptb + bbd + bl + bb;

            if(isiframe){
                var iframeDoc = that.iframe.contents(), 
                    iframeHtml = iframeDoc.find('html').css({overflow:'auto'});
                iframeDoc[0].layer = {index:that.index, target:that.layer}; //iframe没有加载完获取不到
                contentHeight = iframeHtml.children('body').outerHeight();
            }
            else{
                contentHeight = main.outerHeight();
            }
            
            if(options.height === 'auto' && options.maxHeight > 0 && that.maxBodyHeight !== undefined && contentHeight > that.maxBodyHeight){
                that.size.height = options.height = options.maxHeight;
                body.height(that.maxBodyHeight);
            }
            
            if(isiframe){
                if(options.height === 'auto'){
                    contentHeight += outerHeight;
                    if(contentHeight > wheight){
                        that.size.height = wheight;
                    }
                    else{
                        that.size.height = contentHeight;
                    }
                }
            }
            else{
                if(options.height === 'auto'){
                    contentHeight += outerHeight;
                    if(contentHeight > wheight){
                        that.size.height = wheight;
                        body.css({'overflow-y':'auto', 'overflow-x':'auto'});
                    }
                    else{
                        that.size.height = contentHeight;
                        body.css({'overflow':'visible'});
                    }
                }
                else{
                    if(contentHeight > body.height()){
                        body.css({'overflow-y':'auto', 'overflow-x':'auto'});
                    }
                    else{
                        body.css({'overflow':'visible'});
                    }
                }
            }
            
            if(options.isMaxSize === true){
                that.size.width = wwidth - blt;
                that.size.height = wheight;
                extd.width = that.size.width - Layer.getSize(layer, 'lr', 'padding');
                speed = 0;
            }
            
            if(options.isFixed === true && !Layer.bsie6){
                winStop = 0;
            }
            
            that.offset.top = (that.wrap.outerHeight() - that.size.height) / 2 + winStop;
            if(options.isCenter === true){
                that.offset.left = (that.wrap.outerWidth() - that.size.width) / 2 + winSleft;
            }
            height = that.size.height - ptb - bl;
            bodyHeight = height - bb - headHeight - footHeight - bbd;
            body.stop(true, false).animate({height:bodyHeight}, options.isAnimate === true ? speed : 0);
            isiframe && that.iframe.stop(true, false).animate({height:bodyHeight}, options.isAnimate === true ? speed : 0);
            layer.stop(true, false).animate($.extend({top:that.offset.top, left:that.offset.left, height:height}, extd), options.isAnimate === true ? speed : 0, function(){
                if(Layer.bsie6 && options.isFixed === true){
                    that.offset.winTop = that.offset.top - winStop;
                    that.offset.winLeft = that.offset.left - winSleft;
                }
                typeof options.onResizeEvent === 'function' && options.onResizeEvent(main, that.index);
            });
        },
        show:function(){
            var that = this, options = that.options, layer = that.layer, bodyHeight, winStop = that.wrap.scrollTop(), winSleft = that.wrap.scrollLeft(),
                theme = options.theme ? ' t-mask-'+options.theme : '', showType = options.isFadein === true ? 'fadeIn' : 'show',
                box = layer.children('.ui-layer-box'), head = box.children('.ui-layer-title'), body = box.children('.ui-layer-body'),
                main = body.children('.ui-layer-main'), foot = box.children('.ui-layer-foot');
            if(options.isFixed === true && !Layer.bsie6){
                winStop = 0;
                winSleft = 0;
                layer.css('position', 'fixed');
            }
            that.size.width = layer.outerWidth();
            that.size.height = layer.outerHeight();
            if(layer.outerHeight() > that.wrap.outerHeight() - options.padding){
                that.size.height = layer.height(that.wrap.outerHeight() - options.padding - Layer.getSize(layer, 'tb', 'all')).outerHeight();
                body.css({'overflow-y':'auto', 'overflow-x':'auto'});
            }
            else{
                body.css({'overflow':'visible'});
            }
            that.offset.top = parseInt(options.offset.top);
            that.offset.left = parseInt(options.offset.left);
            that.offset.top = (isNaN(that.offset.top) ? ((that.wrap.outerHeight() - that.size.height) / 2) : that.offset.top) + winStop;
            that.offset.left = (isNaN(that.offset.left) ? ((that.wrap.outerWidth() - that.size.width) / 2) : that.offset.left) + winSleft;
            if(!!that.index && options.offset.isBasedPrev === true){
                var index = that.index - 1, prevLayer = Layer.listArray[index];
                that.offset.top = prevLayer.offset.top + 10;
                that.offset.left = prevLayer.offset.left + 10;
            }
            if(options.isMask === true){
                if(!Layer.mask || (that.wrap !== win && !that.mask)){
                    if(that.wrap !== win){
                        that.mask = $('<div class="ui-layer-mask'+ theme +'"><div></div></div>').appendTo(options.container);
                        that.mask.css({position:'absolute'});
                    }
                    else{
                        Layer.mask = $('<div class="ui-layer-mask'+ theme +'"><div></div></div>').appendTo(options.container);
                    }
                    that.bindEvent(that.mask||Layer.mask, 'click', function(e){
                        typeof options.onMaskClick === 'function' && options.onMaskClick(layer, $(this), e);
                        options.isClickMask === true && that.hide();
                    });
                    if(Layer.bsie6){
                        that.bindEvent(win, 'resize', function(){
                            (that.mask||Layer.mask).css({position:'absolute', width:that.wrap.outerWidth(), height:that.wrap === win ? doc.height() : that.wrap.outerHeight()});
                        }, true);
                    }
                    (that.mask||Layer.mask)[showType]();
                }
            }
            if(Layer.bsie6 && options.isFixed === true){
                that.offset.winTop = that.offset.top - winStop;
                that.offset.winLeft = that.offset.left - winSleft;
                that.bindEvent(win, 'scroll', function(){
                    var css = {
                        top:that.offset.winTop + win.scrollTop(),
                        left:that.offset.winLeft + win.scrollLeft()
                    }
                    that.offset.top = css.top;
                    that.offset.left = css.left;
                    that.moveMask && that.moveMask.css(css);
                    that.layer.css(css);
                });
            }
            
            layer.css({margin:0, top:that.offset.top, left:that.offset.left})[showType]();
            var innerHeight = Layer.getSize(box, 'tb', 'all') +
                              head.outerHeight() + foot.outerHeight() + 
                              Layer.getSize(body, 'tb', 'all');
            bodyHeight = layer.height() - innerHeight;
            if(options.maxHeight > 0 && options.maxHeight < that.wrap.outerHeight() - options.padding){
                that.maxBodyHeight = options.maxHeight - Layer.getSize(layer, 'tb', 'all') - innerHeight;
            }
            body.css({height:bodyHeight});
            if(options.height > 0 && main.outerHeight() > body.height()){
                body.css({'overflow-y':'auto', 'overflow-x':'auto'});
            }
            if(options.iframe.enable === true){
                body.css({overflow:'hidden'});
            }
            layer.css({overflow:'visible'});
            that.bindBtnClick();
            if(options.isCenter === true){
                that.bindEvent(win, 'resize', function(){
                    that.layerResize();
                });
                if(Layer.bsie6){
                    that.layerResize();
                }
            }
            if(typeof options.onShowEvent === 'function'){
                options.onShowEvent(main, that.index);
            }
            if(options.timer > 0){
                that.timer = setTimeout(function(){
                    that.hide();
                }, options.timer);
            }
            return that;
        },
        hide:function(){
            var that = this, options = that.options, layer = that.layer, main = layer.find('.ui-layer-main'), xMask = true;
            layer.remove();
            that.unbindEvent();
            delete Layer.listArray[that.index];
            Layer.index--;
            Layer.zIndex--;
            $.each(Layer.listArray, function(key, val){
                if(val && val.options.isMask == true && val.wrap === win){
                    return (xMask = false);
                }   
            });
            if(xMask && Layer.mask){
                Layer.mask.remove();
                Layer.mask = null;
            }
            if(that.mask){
                that.mask.remove();
            }
            if(options.timer > 0){
                clearTimeout(that.timer);
            }
            if(typeof options.onHideEvent === 'function'){
                options.onHideEvent(main, that.index);
                main.remove();
            }
        }
    }
    
    $.extend({
        layer:function(options){
            return new Layer(options);
        }
    });
    $.layer.alert = function(message, title, width, height){
        return new Layer({
            content:message,
            title:{
                text:title
            },
            width:width,
            height:isNaN(height) ? 'auto' : height,
            cancel:{
                enable:true,
                text:'确定'
            }
        });
    }
    $.layer.confirm = function(message, callback, title, width, height){
        return new Layer({
            content:message,
            title:{
                text:title
            },
            width:width,
            height:isNaN(height) ? 'auto' : height,
            confirm:{
                enable:true,
                callback:callback
            },
            cancel:{
                enable:true
            }
        });
    }
    $.layer.iframe = function(src, title, width, height){
        return new Layer({
            width:width,
            height:isNaN(height) ? 'auto' : height,
            isFadein:false,
            iframe:{
                enable:true, 
                src:src
            },
            title:{
                text:title
            }
        });
    }
    $.layer.tips = function(message, dir, offset, callback){
        return new Layer({
            content:message,
            isTips:true,
            close:{
                enable:false
            },
            arrow:{
                enable:true,
                dir:dir ? dir : 'top'
            },
            offset:{
                top:offset && offset.top ? offset.top : 0,
                left:offset && offset.left ? offset.left : 0
            },
            onShowEvent:callback
        });
    }
    $.layer.showmsg = function(msg, target, dir, ofs){
        var offset = target.offset();
        clearTimeout($.layer.showmsg.timer);
        ofs = $.extend({
            top:-3,
            left:10
        }, ofs||{});
        if(dir == 'left'){
            offset.left = offset.left + target.width() + ofs.left
        }
        else{
            offset.top = offset.top + target.height() + ofs.top;
            offset.left += ofs.left;
        }
        offset.top -= $(window).scrollTop();
        layerHide('showmsg');
        $.layer({
            content:'<p style="padding:6px;">'+ msg +'</p>',
            isTips:true,
            isClose:false,
            theme:'showmsg',
            close:{
                enable:false
            },
            arrow:{
                enable:true,
                dir:dir ? dir : 'top'
            },
            offset:{
                top:offset.top,
                left:offset.left
            },
            onShowEvent:function(main, index){
                var layer = main.parents('.ui-layer'), speed = 150;
                layer.queue('queue', [
                    function(){
                        layer.animate({left:'-=20px'}, speed).dequeue('queue');
                    },
                    function(){
                        layer.animate({left:'+=30px'}, speed).dequeue('queue');
                    },
                    function(){
                        layer.animate({left:'-=20px'}, speed).dequeue('queue');
                    },
                    function(){
                        layer.animate({left:'+=10px'}, speed, function(){
                            $.layer.showmsg.timer = setTimeout(function(){
                                layerHide('showmsg');
                            }, 1500);
                        }).dequeue('queue');
                    }
                ]).dequeue('queue');
            }
        });
    }
    $.layer.showmsg.timer = null;
    
    $.layer.loading = function(message, showCallback, width, height){
        var msg = '';
        if(message !== null){
            if(typeof message === 'function'){
                showCallback = message;
                message = '';
            }
            msg = '<b>'+ (message||'正在加载数据..') +'</b>';
        }
        return new Layer({
            content:'<p><i></i>'+ msg+'</p>',
            theme:'loading',
            width:width||'auto',
            height:height||'auto',
            isTips:true,
            isSticky:true,
            close:{
                enable:false
            },
            title:{
                enable:false
            },
            onShowEvent:function(main, index){
                if(typeof showCallback === 'function'){
                    showCallback.call(this, main, index);
                }
            }
        });
    }
})(this, document, jQuery);;
///<jscompress sourcefile="jquery.paging.js" />
/**
 * @filename jquery.paging.js
 * @author Aniu[2014-03-29 10:07]
 * @update Aniu[2016-12-06 11:23]
 * @version v2.9.1
 * @description 分页组件
 */

;!(function(window, document, $, undefined){

    function Paging(options){
        var that = this;
        that.load = false;
        //获取实例对象的名称
        that.instance = function(){
            for(var attr in window){
                if(window[attr] == that){
                    return attr.toString();
                }
            }
        }
        $.extend(that, $.extend(true, {
            /**
             * @function ajax请求url
             * @type <String>
             */
            url:'',
            /**
             * @function 页码容器
             * @type <Object>
             */
            wrap:null,
            /**
             * @function 传递参数值
             * @type <String>
             * @desc 将传递参数封装为json字符串，后台接收该参数来获取该json
             */
            paramJSON:'',
            /**
             * @function 当页显示数量
             * @type <Number>
             */
            pCount:10,
            /**
             * @function 当前页码
             * @type <Number>
             */
            current:1,
            /**
             * @function 列表数据总数
             * @type <Number>
             */
            aCount:0,
            /**
             * @function 是否初始化展示最后一页
             * @type <Boolean>
             */
            last:false,
            /**
             * @function 是否读取全部数据
             * @type <Boolean>
             * @desc 该参数启用后，接口将无法接收到pCount和current参数，前后端约定好，若没接收到这2个参数，将返回全部数据
             */
            allData:false,
            /**
             * @function 是否完整形式展示分页
             * @type <Boolean>
             */
            isFull:true,
			/**
             * @function 滚动分页配置
             * @type <Obejct>
             */
            container:window,
			scroll:{
				enable:false
			},
            /**
             * @function ajax配置信息
             * @type <JSON Obejct, Function>
             */
            ajax:{},
            /**
             * @function 接口接收参数
             * @type <JSON Obejct>
             */
            condition:{},
            /**
             * @function loading加载效果
             * @type <JSON Obejct>
             */
            loading:{
                //loading容器
                wrap:null,
                //显示loading
                show:function(){
                    var that = this;
                    that.hide();
                    var wrap = that.wrap;
                    wrap && wrap.append('<i class="ui-loading" style="position:absolute;">正在加载数据...</i>').css({position:'relative'});
                },
                //隐藏loading
                hide:function(){
                    $('.ui-loading').remove();
                }
            },
            /**
             * @function 上一页下一页按钮文字
             * @type <JSON Obejct>
             */
            button:{
                prev:'«',
                next:'»',
                first:'',
                last:''
            },
            /**
             * @function 拓展分页部分
             * @type <JSON Obejct>
             */
            extPage:{
                wrap:null,
                desc:'',
                prev:'上一页',
                next:'下一页'
            },
            /**
             * @function 传统页面刷新方式
             * @type <Null, Function>
             * @param current <Number> 目标页码
             * @desc 值为函数将启用
             */
            refreshCallback:null,
            /**
             * @function ajax响应数据并且分页创建完毕后回调函数
             * @type <Function>
             * @param data <JSON Object> 响应数据
             */
            endCallback:$.noop,
            /**
             * @function 点击分页按钮回调函数
             * @type <Function>
             * @param current <Number> 目标页码
             */
            jumpCallback:$.noop,
            /**
             * @function 分页数据处理
             * @type <Function>
             * @param data <JSON Object> 响应数据
             */
            echoData:$.noop
        }, Paging.options, options||{}));
        that.container = $(that.container||window);
		if(that.scroll.enable === true){
			that.wrap = null;
			that.children = that.container[0] === window ? $(document.body) : that.container.children();
			that.container.scroll(function(){
				that.resize();
			}).resize(function(){
				that.resize();
			});
		}
    }
    
    Paging.options = {};
    Paging.config = function(options){
    	$.extend(true, Paging.options, options||{})
    }

    Paging.prototype = {
        constructor:Paging,
        //页面跳转
        jump:function(page){
            var that = this, count = Math.ceil(that.aCount/that.pCount), current;
            that.showload = true;
            if(that.aCount > 0){
                if(typeof(page) === 'object'){
                    var val = $(page).prevAll('input').val();
                    if(val <= count && val != that.current){
                        current = parseInt(val);
                    }
                    else{
                        current = that.current;
                    }
                }
                else if(page > 0 && page <= count){
                    current = page;
                }
                else if(page < 0){
                    current = count + page + 1;
                }
                else{
                    current = count;
                }
            }
            else{
                current = page;
            }
            that.current = that.condition.current = current;
            that.jumpCallback(current);
            if(typeof that.refreshCallback === 'function'){
                that.refreshCallback(current);
                that.create();
                return;
            }
            that.getData('jump');
        },
        query:function(type){
            var that = this;
            that.showload = true;
            if(typeof that.refreshCallback !== 'function' || type !== 'refresh'){
                if(type){
                    if(type === 'noloading'){
                        that.showload = false;
                    }
                    else if(type !== 'reload'){
                        that.current = 1;
                    }
                    that.filter();
                    that.condition.current = that.current;
                }
                else{
                    that.condition = {current:that.current = 1};
                }
                that.getData(type||'');
            }
            else{
                that.create();
            }
            
        },
        filter:function(){
            var that = this;
            for(var i in that.condition){
                if(!that.condition[i]){
                    delete that.condition[i];
                }
            }
        },
        //ajax请求数据
        getData:function(type){
            var that = this;
            that.showload && that.loading.show(type);
            that.condition.pCount = that.pCount;
            if(that.allData === true){
                delete that.condition.pCount;
                delete that.condition.current;
            }
            var param = that.condition;
            if(that.paramJSON){
                param = [];
                $.each(that.condition, function(key, val){
                    param.push(key+':'+val);
                });
                var temp = param.length ? '{'+param.join(',')+'}' : '';
                param = {};
                param[that.paramJSON] = temp;
            }
            
            var ajax = typeof that.ajax === 'function' ? that.ajax() : that.ajax;
            delete ajax.success;

            if(!that.load){
            	that.load = true;
            	$.ajax($.extend({}, true, {
                    url:that.url,
                    cache:false,
                    dataType:'json',
                    data:param,
                    success:function(data){
                        that.showload && that.loading.hide();
                        try{
                            data.current = that.current;
                        }
                        catch(e){}
                        if(that.container[0] !== window && (type !== 'reload' || type === 'jump' && !that.scroll.enable)){
                        	that.container.scrollTop(0)
                        	that.container.scrollLeft(0)
                        }
                        that.echoData(data, type);
                        that.aCount = data.aCount;
                        that.load = false;
						if(that.scroll.enable === true){
							that.resize();
						}
                        if(that.last === true){
                            that.last = false;
                            that.jump(-1);
                            return;
                        }
                        that.create();
                        that.endCallback(data);
                    },
                    error:function(){
                        that.showload && that.loading.hide();
                        that.load = false;
                    }
                }, ajax||{}));
            }
        },
        //过滤分页中input值
        trim:function(o){
            var val = Math.abs(parseInt($(o).val()));
            !val && (val = 1);
            $(o).val(val);
        },
        echoList:function(html, i, instance){
            var that = this;
            if(that.current == i){
                html = '<li><span class="s-crt">'+ i +'</span></li>';
            }
            else{
                html = '<li><a href="javascript:'+ instance +'.jump('+ i +');" target="_self">'+ i +'</a></li>';
            }
            return html;
        },
		resize:function(){
			var that = this;
			try{
				var stop = that.container.scrollTop();
				var height = that.container.height();
				var cheight = that.children.outerHeight();
				if(!that.load && Math.ceil(that.aCount/that.pCount) > that.current && ((stop === 0 && cheight <= height) || (height + stop >= cheight))){
					that.jump(++that.current);
				}
			}
			catch(e){
				
			}
		},
        //创建分页骨架
        create:function(){
            var that = this, button = that.button,
                count = Math.ceil(that.aCount/that.pCount), current = that.current,
                html = '', next = count == current ? 1 : current+1,
                instance = that.instance(), extPage = that.extPage;

            if(extPage.wrap){
                var page = '<div>';
                page += current == count || count == 0 ?
                     '<span>'+ extPage.next +'</span>' : '<a href="javascript:'+ instance +'.jump('+ (current+1) +');" target="_self">'+ extPage.next +'</a>';
                page += current == 1 ?
                     '<span>'+ extPage.prev +'</span>' : '<a href="javascript:'+ instance +'.jump('+ (current-1) +');" target="_self">'+ extPage.prev +'</a>';
                page += '</div><em>'+ (count !== 0 ? current : 0) +'/'+ count +'</em><strong>共'+ that.aCount + extPage.desc +'</strong>';
                extPage.wrap.html(page);
            }
            
            if(!that.wrap){
                return;
            }
            
            if(!count){
                that.wrap.empty();
                return;
            }

            html += (function(){
                var tpl = '';
                if(current == 1){
                    if(button.first){
                        tpl += '<li><span>'+ button.first +'</span></li>';
                    }
                    tpl += '<li><span>'+ button.prev +'</span></li>';
                }
                else{
                    if(that.button.first){
                        tpl += '<li><a href="javascript:'+ instance +'.jump(1);" target="_self">'+ button.first +'</a></li>';
                    }
                    tpl += '<li><a href="javascript:'+ instance +'.jump('+ (current-1) +');" target="_self">'+ button.prev +'</a></li>';
                }
                return tpl;
            })();
            if(count <= 7){
                for(var i = 1; i <= count; i++){
                    html += that.echoList(html, i, instance);
                }
            }
            else{
                if(current-3 > 1 && current+3 < count){
                    html += '<li><a href="javascript:'+ instance +'.jump(1);" target="_self">1</a></li>';
                    html += '<li><em>...</em></li>';
                    for(var i = current-2; i <= current+2; i++){
                        html += that.echoList(html, i, instance);
                    }
                    html += '<li><em>...</em></li>';
                    html += '<li><a href="javascript:'+ instance +'.jump('+ count +');" target="_self">'+ count +'</a></li>';
                }
                else if(current-3 <= 1 && current+3 < count){
                    for(var i = 1; i <= 5; i++){
                        html += that.echoList(html, i, instance);
                    }
                    html += '<li><em>...</em></li>';
                    html += '<li><a href="javascript:'+ instance +'.jump('+ count +');" target="_self">'+ count +'</a></li>';
                }
                else if(current-3 > 1 && current+3 >= count){
                    html += '<li><a href="javascript:'+ instance +'.jump(1);" target="_self">1</a></li>';
                    html += '<li><em>...</em></li>';
                    for(var i = count-5; i <= count; i++){
                        html += that.echoList(html, i, instance);
                    }
                }
            }
            html += (function(){
                var tpl = '';
                if(current == count){
                    tpl += '<li><span>'+ button.next +'</span></li>';
                    if(button.last){
                        tpl += '<li><span>'+ button.last +'</span></li>';
                    }
                }
                else{
                    tpl += '<li><a href="javascript:'+ instance +'.jump('+ (current+1) +');" target="_self">'+ button.next +'</a></li>';
                    if(button.last){
                        tpl += '<li><a href="javascript:'+ instance +'.jump('+ count +');" target="_self">'+ button.last +'</a></li>';
                    }
                }
                return tpl;
            })();
            if(that.isFull){
                html += '<li><em>跳转到第</em><input type="text" onblur="'+ instance +'.trim(this);" value="'+ next +'" /><em>页</em><button type="button" onclick="'+ instance +'.jump(this);">确定</button></li>';
            }
            html = '<ul class="ui-paging">' + html + '</ul>';
            that.wrap.html(html);
        }
    }
    
    $.extend({
        paging:function(name, options){
            if(options === undefined){
                options = name;
                name = 'paging';
            }
            var page = window[name] = new Paging(options);
            if(typeof window[name].refreshCallback !== 'function'){
                page.query(true);
                return page;
            }
            page.query('refresh');
            return page
        }
    });
    
    window.Paging = Paging;
    
})(this, document, jQuery);;
///<jscompress sourcefile="jquery.select.js" />
/**
 * @filename jquery.select.js
 * @author Aniu[2014-03-24 20:13]
 * @update Aniu[2016-03-18 13:22]
 * @version v2.7
 * @description 下拉框组件
 */
 
;!(function(window, document, $, undefined){
    $.fn.imitSelect = function(o){
        o = $.extend(true, {
            /**
             * @func 下拉显示个数
             * @type <Number>
             */
            count:8,
            /**
             * @func 添加css3动画类
             * @type <String>
             */
            animate:'',
            /**
             * @func 添加自定义结构
             * @type <String>
             */
            selext:'',
            /**
             * @func 设置下拉框默认值
             * @type <String, Number>
             */
            value:null,
            /**
             * @func 是否禁用下拉框
             * @type <Boolean>
             */
            disabled:null,
            /**
             * @func 是否初始化默认值，配合value属性使用
             * @type <Boolean>
             */
            isInit:true,
            /**
             * @func 将value值清空
             * @type <Boolean>
             */
            isNull:false,
            /**
             * @func 下拉框是否可编辑
             * @type <Boolean>
             */
            isEdit:false,
            /**
             * @func 是否隐藏下拉框
             * @type <Boolean>
             */
            hide:false,
            /**
             * @func 下拉框列表是否有title提示
             * @type <Boolean>
             */
            isTitle:false,
            /**
             * @func 下拉框搜索
             * @type <Object>
             */
            search:{
                /**
                 * @func 是否开启
                 * @type <Boolean>
                 */
                enable:false,
                /**
                 * @func 搜索默认占位符文本，配合jqyery.placeholder组件使用
                 * @type <String>
                 */
                tips:'',
                /**
                 * @func 未搜索到结果提示文本
                 * @type <String>
                 */
                text:''
            },
            /**
             * @func 上下点击选择按钮
             * @type <Object>
             */
            button:{
                /**
                 * @func 是否开启
                 * @type <Boolean>
                 */
                enable:false,
                prev:'',
                next:''
            },
            /**
             * @func 点击列表回调函数，初始化时会调用一次
             * @type <Function>
             * @param target <jQuery Obeject> 调用组件的select JQ对象
             */
            callback:null,
            /**
             * @func 过滤文本函数
             * @type <Function>
             * @param text <String> 下拉框选中文本
             */
            filter:null
        }, o||{});
        
        return this.each(function(){
            var _this = this, that = $(this);
            o.disabled !== null && that.prop('disabled', o.disabled);
            o.value !== null && that.data('value', o.value);
            if(o.isNull === true){
                that.data('value', '').val('');
            }
            var value = that.data('value'), 
                func = that.data('func'),
                init = that.data('init'),
                disabled = that.prop('disabled');
            that.prev('.ui-imitselect').remove();
            if(o.hide === true){
                return;
            }
            if(!!func && !disabled && !init){
                eval('var option = '+func+'()');
                if(option === false){
                    return;
                }
                that.html(option);
                option = null;
                value !== undefined && that.next('select').prop('disabled', false);
            }
            if(typeof o.callback == 'function'){
                o.callback(that);
            }
            if(value !== undefined && o.isInit === true){
                var selIndex = that.children('option[value="'+ value +'"]').index();
                that[0].selectedIndex = selIndex;
            }
            var index = that[0].selectedIndex,
                size = that.children('option').size(),
                list = html = height = select = '',
                text = '请选择',
                css = 'width:'+(that.outerWidth()+20)+'px; ' + (that.data('css') ? that.data('css') : ''),
                style = 'style="'+ css +'; position:relative;"';
            var button = '';
            if(o.button.enable === true){
                button = '<div class="ui-imitselect-btn"><em class="prev">'+ o.button.prev +'</em><em class="next">'+ o.button.next +'</em></div>';
            }
            if(size > 0 && !that.data('init')){
                that.children('option').each(function(){
                    var me = $(this), crt = '', dis = '';
                    if(me.index() === index){
                        crt = ' class="s-crt';
                        text = me.text();
                    }
                    if(me.prop('disabled')){
                        dis = 'disabled="disabled"';
                        if(crt){
                            crt += ' s-dis'
                        }
                        else{
                            crt = ' class="s-dis';
                        }
                    }
                    crt && (crt += '"');
                    if(!!me.text()){
                        list  = list + '<li'+ crt + ' data-value="'+ me.attr('value') +'" title="'+ (o.isTitle ? me.text() : '') +'">'+ me.text() +'</li>';
                    }
                });
                if(typeof o.filter == 'function'){
                    text = o.filter(text);
                }
                html += '<dl class="ui-imitselect'+ (disabled ? ' s-dis' : '') +'" '+ style +'>';
                html += '<dt><span><strong>'+ text +'</strong></span><b><i></i></b>'+ button + o.selext +'</dt>';
                html += '<dd class="ui-animate">'+ (o.search.enable ? '<div class="ui-imitselect-search"><input type="text" placeholder="'+ o.search.tips +'" /></div>' : '') +'<ul>'+ list +'</ul></dd></dl>';
            }
            else{
                html += '<dl class="ui-imitselect'+ (disabled ? ' s-dis' : '') +'" '+ style +'>';
                html += '<dt><span><strong>'+ text +'</strong></span><b><i></i></b>'+ button + o.selext +'</dt><dd class="ui-animate"><ul></ul></dd></dl>';
            }
            
            if(o.isEdit === true){
                html = html.replace(/<strong>([\s\S]*)<\/strong>/g, '<strong><input type="text" '+ (disabled ? 'disabled' : '') +' name="'+ that.attr('name') +'" id="'+ that.attr('id') +'" value="$1" autocomplete="off" /></strong>');
                that.removeAttr('name').removeAttr('id');
            }
            var select = $(html).insertBefore(that), selectbox = select.find('ul'), itemHeight = selectbox.children('li').outerHeight(), imitselectAll = $('.ui-imitselect'), total = imitselectAll.size();
            size > o.count && selectbox.css({height:itemHeight*o.count, overflowY:'scroll'});
            if(o.search.enable && o.search.tips){
                select.find('.ui-imitselect-search input').placeholder({isVal:false}).parent().css({width:'100%'});
            }
            imitselectAll.each(function(index, item){
                $(this).css('z-index', total - index);
            });
            var imitselect = that.prev('.ui-imitselect:not(.s-dis)');
            imitselect.on('click', function(){
                var select = $(this);
                if(that.data('init')){
                    eval('var option = '+init+'()');
                    that.html(option);
                    option = '';
                    that.data('init', '').children('option').each(function(){
                        var me = $(this), crt = '';
                        if(me.index() === index){
                            crt = ' class="s-crt"';
                            text = me.text();
                        }
                        option += '<li'+ crt + ' data-value='+ me.attr('value') +'>'+ me.text() +'</li>';
                    });
                    var item = selectbox.html(option).children('li'), size = item.size();
                    itemHeight = item.outerHeight();
                    value !== undefined && that.next('select').prop('disabled', false);
                    size > o.count && selectbox.css({height:itemHeight*o.count, overflowY:'scroll'});
                }
                $(this).addClass('s-show').children('dd').removeClass(o.animate).addClass(o.animate);
                if(imitselect.parent().hasClass("taxStation")){// 是税务机关
            		if(global_type != undefined){
            			global_type = 2;
            		}
            		if(typeof deal == 'function'){
            			deal();
            		}
            	}
                return false;
            }).on('click', '.ui-imitselect-btn', function(){
                return false;
            }).on('click', '.ui-imitselect-btn em', function(){
                var index = _this.selectedIndex;
                if($(this).hasClass('prev')){
                    if(index > 0){
                        index--;
                    }
                }
                else{
                    if(index < size-1){
                        index++;
                    }
                }
                
                var target = selectbox.children('li').eq(index);
                if(!target.hasClass('s-nodata')){
                    target.addClass('s-crt');
                    _this.selectedIndex = index;
                    var txt = target.text();
                    if(typeof o.filter == 'function'){
                        txt = o.filter(txt);
                    }
                    if(o.isEdit !== true){
                        select.find('dt strong').text(txt);
                    }
                    else{
                        select.find('dt input').val(txt);
                    }
                    target.siblings().removeClass('s-crt');
                    if(typeof o.callback == 'function'){
                        o.callback(that, target);
                    }
                }
                
                return false;
            }).on('mouseleave', function(){
                $(this).find('dd li[data-value="'+ $(this).next('select').val() +'"]').addClass('s-crt').siblings().removeClass('s-crt');
            }).find('dt input').on('click', function(){
                return false;
            }).end().find('ul').on('click', 'li:not(.s-nodata)', function(){
                var me = $(this);
                if(me.hasClass('s-dis')){
                    if(typeof o.callback == 'function'){
                        o.callback(that, me);
                    }
                    return false;
                }
                var txt = me.text();
                if(typeof o.filter == 'function'){
                    txt = o.filter(txt);
                }
                var parent = me.closest('.ui-imitselect'), select = parent.next('select'), 
                    target = (o.isEdit !== true ? parent.find('dt strong').text(txt) : parent.find('dt input').val(txt)).end();
                select.data('value', select.val(me.data('value')).val());
                target.removeClass('s-show');
                if(func){
                    window[func].ele = parent;
                    eval(func+'("'+ me.data('value') +'")');
                }
                else if(init){
                    window[init].ele = parent;
                    eval(init+'("'+ me.data('value') +'")');
                }
                if(typeof o.callback == 'function'){
                    o.callback(that, me);
                }
                return false;
            }).on('mouseenter', 'li:not(.s-nodata)', function(){
                $(this).addClass('s-crt').siblings().removeClass('s-crt');
            }).end().find('.ui-imitselect-search input').on('keyup', function(){
                var val = $.trim($(this).val()), 
                    cache = $(list), 
                    count = cache.size(),
                    styleTemp = {height:'auto', overflowY:'visible'};
                if(val){
                    var temp = [];
                    cache.each(function(){
                        var me = $(this), value = me.data('value').toString(), text = $.trim(me.text());
                        if(value.indexOf(val) !== -1 || text.indexOf(val) !== -1){
                            temp.push(me[0]);
                        }
                    });
                    if(temp.length){
                        cache = $(temp);
                    }
                    else{
                        cache = $('<li class="s-nodata">'+ o.search.text +'</li>');
                    }
                    count = cache.size();
                }
                if(count > o.count){
                    styleTemp = {height:itemHeight*o.count, overflowY:'scroll'};
                }
                selectbox.html(cache).css(styleTemp);
            });
            
            $(document).on('click', function(){
                imitselect.removeClass('s-show');
            });
            
        });
    }
})(this, document, jQuery);;
///<jscompress sourcefile="jquery.template.js" />
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();;
///<jscompress sourcefile="jquery.suggest.js" />
/**
 * @filename jquery.suggest.js
 * @author Aniu[2014-04-07 09:15]
 * @update Aniu[2016-01-19 18:27]
 * @version v1.7
 * @description 搜索提示
 */

;!(function(window, document, $, undefined){
    
    var Suggest = function(target, setting){
        var that = this;
        that.target = target;
        that.eventArray = [];
        that.setting = $.extend(true, {
            /**
             * @func ajax请求url
             * @type <String>
             */
            url:'',
            zindex:0,
            container:'body',
            scrollElem:null,
            /**
             * @func 远程接口接收参数
             * @type <String>
             */
            param:'keywords',
            /**
             * @func 自定义组件主题
             * @type <String>
             */
            theme:'',
            /**
             * @func 指定下拉列表文本
             * @type <String>
             * @desc 将列表指定元素内容赋值到输入框中
             */
            getDom:'',
            /**
             * @func 下拉数据展示数量，多出则滚动显示
             * @type <Number>
             */
            limit:10,
            /**
             * @func 是否默认选中第一行列表
             * @type <Boolean>
             */
            select:false,
            /**
             * @func 是否开启缓存
             * @type <Boolean>
             * @desc 将对应关键词查询到的数据保存到js中，下次再搜索该词将不调用接口
             */
            cache:true,
            /**
             * @func 非ajax加载数据
             * @type <Function>
             * @return <Obejct, Array> 列表数据
             * @param keywords <String> 关键字
             * @param target <Object> 目标输入框jQuery对象
             * @desc 若没有设置url参数，将启用该方法
             */
            getData:null,
            /**
             * @func 下拉框定位偏移
             * @type <Object, Function>
             * @return <Object>
             */
            offset:{
                top:0,
                left:0,
                width:0
            },
            /**
             * @func 处理列表数据
             * @type <Function>
             * @return <String> 处理后的列表li元素
             * @param item <String, Object, Array> 单行源数据
             */
            returnData:$.noop,
            /**
             * @func 选择列表行触发函数
             * @type <Function>
             * @param item <Object> 触发事件行jQuery对象
             * @param target <Object> 目标输入框jQuery对象
             * @param keyevent <Boolean> 是否上下键盘时间选择下拉
             */
            eventEnd:$.noop,
            /**
             * @func 初始化组件完成回调函数
             * @type <Function>
             * @param target <Object> 目标输入框jQuery对象
             * @param suggestlist <Object> 下拉框jQuery对象
             */
            callback:$.noop,
            showCallback:$.noop,
            /**
             * @func 隐藏下拉框回调函数
             * @type <Function>
             * @param target <Object> 目标输入框jQuery对象
             * @param items <Object> 下拉框列表jQuery对象
             */
            hideEvent:$.noop,
            /**
             * @func 自定义下拉框显示内容
             * @type <Function>
             */
            diyCallback:$.noop
        }, setting||{});
    }, doc = $(document);
    
    Suggest.prototype = {
        constructor:Suggest,
        liSize:0,
        cache:{},
        isbind:true,
        init:function(keywords){
            var that = this, sets = that.setting;
            that.ishide = false;
            that.keywords = keywords;
            that.suggest = $('.ui-suggest');
            if(!that.suggest.size()){
                var diy = sets.diyCallback()||'';
                that.suggest = $('<div class="ui-suggest"><ul class="ui-suggest-list"></ul>'+ diy +'</div>').appendTo(sets.container).addClass(sets.theme);
                sets.showCallback && sets.showCallback.call(this, that.target, that.suggest);
            }
            that.suggestlist = that.suggest.children('.ui-suggest-list');
            if(sets.zindex > 0){
            	that.suggest.css('z-index', sets.zindex);
            }
            that.request && that.request.abort();
            that.show();
            if(sets.select !== true){
                that.suggestlist.scrollTop(0);
            }
            sets.callback && sets.callback.call(this, that.target, that.suggestlist);
        },
        show:function(){
            var that = this, sets = that.setting;
            if(sets.cache === true){
                var cache = that.cache[that.keywords];
                if(cache){
                    that.filterData(cache);
                    return;
                }
            }
            if(sets.url){
                var param = {};
                param[sets.param] = that.keywords;
                that.request = $.ajax($.extend({
                    url:sets.url,
                    dataType:'json',
                    cache:false,
                    data:param,
                    success:function(res){
                        that.filterData(res);
                    }
                }, sets.ajaxOptions||{}));
            }
            else if(typeof sets.getData === 'function'){
                that.filterData(sets.getData(that.keywords, that.target)||null);
            }
        },
        hide:function(){
            var that = this, sets = that.setting;
            that.isbind = true;
            that.unbindEvent();
            sets.hideEvent.call(that, that.target, that.suggestlist.children('li'));
            that.suggest.remove();
        },
        filterData:function(res){
            var that = this, sets = that.setting, target = that.target, style;
            if(res && res[0] !== undefined && !that.ishide){
                if(sets.cache === true){
                    that.cache[that.keywords] = res;
                }
                that.liSize = 0;
                var arr = [];
                $.each(res, function(index, item){
                	arr.push(sets.returnData.call(this, item, index));
                    that.liSize++;
                });
                that.suggestlist.html(arr.join(''));
                var offset = typeof sets.offse === 'function' ? sets.offset() : sets.offset;
                var style = {
                    top:(sets.container == 'body' ? target.offset().top : 0)+target.outerHeight() - 1 + offset.top,
                    left:(sets.container == 'body' ? target.offset().left : 0) + offset.left,
                    width:target.innerWidth()+offset.width
                }
                that.suggest.css(style).show();
                that.itemHeight = that.suggestlist.children('li').outerHeight()||0;
                var _style = that.liSize > sets.limit ? {overflowY:'scroll', height:that.itemHeight*sets.limit} : {overflowY:'visible', height:'auto'};
                that.suggestlist.css(_style);
                if(sets.select === true){
                    var val = $.trim(target.val());
                    var i = 0;
                    that.suggestlist.children('li').each(function(index, item){
                        var me = $(this);
                        var text = $.trim(me.text());
                        if(val == text){
                            i = index;
                            return false;
                        }
                    });
                    that.suggestlist.children('li').eq(i).addClass('s-crt');
                    that.suggestlist.scrollTop(that.itemHeight*i);
                }
                var height = that.suggest.height();
                if(typeof sets.scrollCallback !== 'undefined'){
                	sets.scrollCallback(target, that.suggest, style);
                }
                else{
                	if($(window).height() - style.top < height){
                        that.suggest.css({top:style.top - height - target.outerHeight() + 1 - offset.top});
                    }
                }
                
                if(that.isbind){
                    that.bindMouse();
                    that.bindKeyboard();
                    that.isbind = false;
                }
            }
            else{
                that.hide();
            }
        },
        bindMouse:function(){
            var that = this, sets = that.setting;
            that.bindEvent(doc, 'click', function(e){
                that.ishide = true;
                that.hide();
            });
            that.suggest.on('mouseover', function(){
                that.suggest.addClass('s-evt');
            }).on('mouseout', function(){
                that.suggest.removeClass('s-evt');
            });
            that.suggestlist.on('click', 'li', function(){
                var me = $(this);
                sets.getDom ? that.target.val(me.find(sets.getDom).text()) : that.target.val(me.text());
                sets.eventEnd.call(this, me, that.target);
                that.hide();
                return false;
            }).on('mouseover', 'li', function(){
                $(this).addClass('s-crt').siblings().removeClass('s-crt');
            }).on('mouseout', 'li', function(){
                $(this).removeClass('s-crt');
            });
        },
        bindKeyboard:function(){
            var that = this, sets = that.setting, index = -1, current = null;
            that.bindEvent(doc, 'keydown' , function(e){
                if(e.keyCode == 38 || e.keyCode == 40){
                    if(e.keyCode == 38){
                        if(index > 0){
                            index-=1;
                            if((index+1) % sets.limit === 0){
                                that.suggestlist.animate({scrollTop:(index-sets.limit)*that.itemHeight});
                            }
                        }
                        else{
                            index=that.liSize-1;
                            that.suggestlist.animate({scrollTop:that.itemHeight*index});
                        }
                    }
                    else{
                        if(index >= that.liSize-1){
                            index=0;
                            that.suggestlist.animate({scrollTop:0});
                        }
                        else{
                            index+=1;
                            if(index % sets.limit === 0){
                                that.suggestlist.animate({scrollTop:that.itemHeight*index});
                            }
                        }
                    }
                    current = that.suggestlist.children('li:eq('+ index +')');
                    current.addClass('s-crt').siblings().removeClass('s-crt');
                    sets.eventEnd.call(this, current, that.target, true);
                    sets.getDom ? that.target.val(current.find(sets.getDom).text()) : that.target.val(current.text());
                }
                else if(e.keyCode == 13){
                    if(sets.select === true){
                        if($.trim(that.target.val())){
                            that.suggestlist.children('li.s-crt').click();
                            that.hide();
                        }
                    }
                    else{
                        that.hide();
                    }
                }
            });
        },
        bindEvent:function(target, eventType, callback, EventInit){
            var that = this;
            target.bind(eventType, callback);
            EventInit === true && target[eventType]();
            that.eventArray.push({
                target:target,
                eventType:eventType,
                callback:callback
            });
        },
        unbindEvent:function(){
            var that = this, eArr = that.eventArray, i, temp;
            for(i in eArr){
                temp = eArr[i];
                temp.target && temp.target.unbind(temp.eventType, temp.callback);
            }
            that.eventArray.length = 0;
        }
    }
    
    $.fn.suggest = function(setting){
        return this.each(function(){
            var target = $(this).attr('autocomplete', 'off');
            var sug = target.get(0).sug = new Suggest(target, setting);
            target.on('keyup', function(e){
                switch(e.keyCode){
                    case 38:
                    case 40:
                    case 13:
                        return false;
                        break;
                }
                if(e.ctrlKey && e.keyCode === 83){
                    return false;
                }
                var keywords = $.trim($(this).val());
                if(keywords){
                    sug.init(keywords);
                }
                else{
                    if(setting.keywords !== undefined){
                        sug.init(setting.keywords);
                    }
                    else{
                        if(sug.suggest && sug.suggest.size()){
                            sug.hide();
                        }
                    }
                }   
            });
        });
    }
})(this, document, jQuery);
;
///<jscompress sourcefile="jquery.validate.js" />
/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[0], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[0] );
		$.data( this[0], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $(event.target).hasClass("cancel") ) {
					validator.cancelSubmit = true;
				}

				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $(event.target).attr("formnovalidate") !== undefined ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val( $(validator.submitButton).val() ).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
		if ( $(this[0]).is("form")) {
			return this.validate().form();
		} else {
			var valid = true;
			var validator = $(this[0].form).validate();
			this.each(function() {
				valid = valid && validator.element(this);
			});
			return valid;
		}
	},
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function( index, value ) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function( command, argument ) {
		var element = this[0];

		if ( command ) {
			var settings = $.data(element.form, "validator").settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				// remove messages from rules, but allow them to be set separetely
				delete existingRules.messages;
				staticRules[element.name] = existingRules;
				if ( argument.messages ) {
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function( index, method ) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.dataRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if ( data.required ) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function( a ) { return !$.trim("" + $(a).val()); },
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function( a ) { return !!$.trim("" + $(a).val()); },
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function( a ) { return !$(a).prop("checked"); }
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each(params, function( i, n ) {
		source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
			return n;
		});
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
        focusoutInvalid:false,
		errorContainer: $([]),
		errorLabelContainer: $([]),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element, event ) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function( element, event ) {
			if ( !this.checkable(element)) {
                if(!this.settings.focusoutInvalid && ((element.name in this.submitted) || !this.optional(element))){
                    this.element(element);
                }
                else{
                    this.element(element);
                    this.check(element);
                }
			}
		},
		onkeyup: function( element, event ) {
			if ( event.which === 9 && this.elementValue(element) === "" ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function( element, event ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element(element);
			}
			// or option elements, check parent select in that case
			else if ( element.parentNode.name in this.submitted ) {
				this.element(element.parentNode);
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split(/\s/);
				}
				$.each(value, function( index, name ) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function( key, value ) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				if ( validator.settings[eventType] ) {
					validator.settings[eventType].call(validator, this[0], event);
				}
			}
			$(this.currentForm)
				.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'] ",
					"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if ( !this.valid() ) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element ) !== false;
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !(element.name in errors);
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$(this.currentForm).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this);
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
					return false;
				}

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $(selector)[0];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.replace(" ", ".");
			return $(this.settings.errorElement + "." + errorClass, this.errorContext);
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		elementValue: function( element ) {
			var type = $(element).attr("type"),
				val = $(element).val();

			if ( type === "radio" || type === "checkbox" ) {
				return $("input[name='" + $(element).attr("name") + "']:checked").val();
			}

			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "");
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			var val = this.elementValue(element);
			var result;

			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {

					result = $.validator.methods[method].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength(rules) ) {
				this.successList.push(element);
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		customDataMessage: function( element, method ) {
			return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor === String ? m : m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if ( arguments[i] !== undefined ) {
					return arguments[i];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements;
			for ( i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + ">")
					.attr("for", this.idOrName(element))
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ) {
					if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement(label, $(element) );
					} else {
						label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				if ( typeof this.settings.success === "string" ) {
					label.addClass( this.settings.success );
				} else {
					this.settings.success( label, element );
				}
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function( element ) {
			var name = this.idOrName(element);
			return this.errors().filter(function() {
				return $(this).attr("for") === name;
			});
		},

		idOrName: function( element ) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function( element ) {
			// if radio/checkbox, validate first element in group instead
			if ( this.checkable(element) ) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return (/radio|checkbox/i).test(element.type);
		},

		findByName: function( name ) {
			return $(this.currentForm).find("[name='" + name + "']");
		},

		getLength: function( value, element ) {
			switch( element.nodeName.toLowerCase() ) {
			case "select":
				return $("option:selected", element).length;
			case "input":
				if ( this.checkable( element) ) {
					return this.findByName(element.name).filter(":checked").length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
		},

		dependTypes: {
			"boolean": function( param, element ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$(param, element.form).length;
			},
			"function": function( param, element ) {
				return param(element);
			}
		},

		optional: function( element ) {
			var val = this.elementValue(element);
			return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[element.name] ) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[element.name];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[className] = rules;
		} else {
			$.extend(this.classRuleSettings, className);
		}
	},

	classRules: function( element ) {
		var rules = {};
		var classes = $(element).attr("class");
		if ( classes ) {
			$.each(classes.split(" "), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {};
		var $element = $(element);
		var type = $element[0].getAttribute("type");

		for (var method in $.validator.methods) {
			var value;

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = $element.get(0).getAttribute(method);
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr(method);
			}

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number(value);
			}

			if ( value ) {
				rules[method] = value;
			} else if ( type === method && type !== 'range' ) {
				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $(element);
		for (method in $.validator.methods) {
			value = $element.data("rule-" + method.toLowerCase());
			if ( value !== undefined ) {
				rules[method] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {};
		var validator = $.data(element.form, "validator");
		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each(rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[prop];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch (typeof val.depends) {
				case "string":
					keepRule = !!$(val.depends, element.form).length;
					break;
				case "function":
					keepRule = val.depends.call(element, element);
					break;
				}
				if ( keepRule ) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function( rule, parameter ) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength'], function() {
			if ( rules[this] ) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			var parts;
			if ( rules[this] ) {
				if ( $.isArray(rules[this]) ) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				} else if ( typeof rules[this] === "string" ) {
					parts = rules[this].split(/[\s,]+/);
					rules[this] = [Number(parts[0]), Number(parts[1])];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min && rules.max ) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength && rules.maxlength ) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function( name, method, message ) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
		if ( method.length < 3 ) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend(param, element) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			}
			if ( this.checkable(element) ) {
				return this.getLength(value, element) > 0;
			}
			return $.trim(value).length > 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function( value, element ) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function( value, element ) {
			return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function( value, element ) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function( value, element ) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function( value, element ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test(value) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if ( bEven ) {
					if ( (nDigit *= 2) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param);
			if ( this.settings.onfocusout ) {
				target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
					$(element).valid();
				});
			}
			return value === target.val();
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function( value, element, param ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] ) {
				this.settings.messages[element.name] = {};
			}
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;
			param = typeof param === "string" && {url:param} || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			var tempData = {};
			if(typeof param.url === 'function'){
				tempData.url = param.url();
			}
			if(typeof param.data === 'function'){
				tempData.data = param.data();
			}
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				filter:null,
				success: function( response ) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					if(typeof this.filter === 'function'){
						response = this.filter(response);
					}
					var valid = response === true || response === "true";
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						delete validator.invalid[element.name];
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.invalid[element.name] = true;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param, tempData));
			return "pending";
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function( settings, _, xhr ) {
			var port = settings.port;
			if ( settings.mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function( settings ) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if ( mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = ajax.apply(this, arguments);
				return pendingRequests[port];
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	$.extend($.fn, {
		validateDelegate: function( delegate, type, handler ) {
			return this.bind(type, function( event ) {
				var target = $(event.target);
				if ( target.is(delegate) ) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));
;
///<jscompress sourcefile="jquery.tools.js" />
/**
 * @filename jquery.tools.js
 * @author Aniu[2016-03-29 09:53]
 * @update Aniu[2016-03-29 09:53]
 * @version v1.1
 * @description 工具类
 */

var tools = {
    /**
     * @func 获取url参数值
     * @return <String, Object>
     * @param name <String, Undefined> 参数名，不传则以对象形式返回全部参数
     * @param urls <String, Undefined> url地址，默认为当前访问地址
     */
    getParam:function(name, urls){
        var url = decodeURI(urls||location.href), value = {};
        startIndex = url.indexOf('?');
        if(startIndex++ > 0){
            var param = url.substr(startIndex).split('&'), temp;
            $.each(param, function(key, val){
                temp = val.split('=');
                value[temp[0]] = temp[1];
            });
        }
        if(typeof name === 'string' && name){
            value = (temp = value[name]) !== undefined ? temp : '';
        }
        return value;
    },
    /**
     * @func 设置url参数值
     * @return <String> 设置后的url
     * @param name <String, Object> 参数名或者{key:value, ...}参数集合
     * @param value <String> 参数值或者url
     * @param urls <String, Undefined> url，没有则获取浏览器url
     */
    setParam:function(name, value, urls){
        var url;
        if($.isPlainObject(name)){
            url = value||location.href;
            $.each(name, function(key, val){
                if(val !== ''){
                	if($.isPlainObject(val)){
                		val = tools.getJSON(val);
                	}
                    url = tools.setParam(key, val, url);
                }
            });
        }
        else{
            url = urls||location.href;
            if(url.indexOf('?') === -1){
                url += '?';
            }
            if($.isPlainObject(value)){
            	value = tools.getJSON(value);
        	}
            if(url.indexOf(name+'=') !== -1){
                var reg = new RegExp('('+name+'=)[^&]*');
                url = url.replace(reg, '$1'+value);
            }
            else{
                var and = '';
                if(url.indexOf('=') !== -1){
                    and = '&';
                }
                url += and+name+'='+value;
            }
        }
        return url;
    },
    /**
     * @func 检测浏览器是否支持CSS3属性
     * @return <Boolean>
     * @param style <String> 样式属性
     */
    supportCss3:function(style){
        var prefix = ['webkit', 'Moz', 'ms', 'o'], 
            i, humpString = [], 
            htmlStyle = document.documentElement.style, 
            _toHumb = function (string) { 
                return string.replace(/-(\w)/g, function ($0, $1) { 
                    return $1.toUpperCase(); 
                }); 
            }; 
        for (i in prefix) 
            humpString.push(_toHumb(prefix[i] + '-' + style)); 
        humpString.push(_toHumb(style)); 
        for (i in humpString) 
            if (humpString[i] in htmlStyle) return true; 
        return false; 
    },
    /**
     * @func 模拟location.href跳转，前者IE下有问题
     * @return <Undefined>
     * @param url <String> 跳转的url
     * @param target <String> 跳转类型，默认为_self
     */
    jumpUrl:function(url, target){
        if(url){
            $('<a href="'+ url +'"'+ (target ? 'target="'+ (target||'_self') +'"' : '' ) +'><span></span></a>')
                .appendTo('body').children().click().end().remove();
        }
    },
    /**
     * @func 格式化日期
     * @return <String>
     * @param timestamp <String, Number> 时间戳，为空返回横杠“-”
     * @param format <String, Undefined> 输出格式，为空则返回时间戳
     */
    formatDate:function(timestamp, format){
        if(timestamp = parseInt(timestamp)){
            if(!format){
                return timestamp;
            }
            var date = new Date(timestamp);
            var map = {
                'M':date.getMonth()+1,
                'd':date.getDate(),
                'h':date.getHours(),
                'm':date.getMinutes(),
                's':date.getSeconds()
            }
            format = format.replace(/([yMdhms])+/g, function(all, single){
                var value = map[single];
                if(value !== undefined){
                    if(all.length > 1){
                       value = '0' + value;
                       value = value.substr(value.length-2);
                   } 
                   return value;
                }
                else if(single === 'y'){
                    return (date.getFullYear() + '').substr(4-all.length);
                }
                return all;
            });
            return format;
        }
        return '-';
    },
    /**
     * @func 格式化json
     * @return <JSON String>
     * @param data <Array, Object> 数组或者对象
     */
    getJSON:function(data){
        if(typeof JSON !== 'undefined'){
            return JSON.stringify(data);
        }
        else{
            if($.isArray(data)){
                var arr = [];
                $.each(data, function(key, val){
                    arr.push(tools.getJSON(val));
                });
                return '[' + arr.join(',') + ']';
            }
            else if($.isPlainObject(data)){
                var temp = [];
                $.each(data, function(key, val){
                    temp.push('"'+ key +'":'+ tools.getJSON(val));
                });
                return '{' + temp.join(',') + '}';
            }
            else{
                return '"'+data+'"';
            }
        }
    },
    /**
     * @func 正则表达式
     */
    regex:{
    	//手机
    	mobile:/^1(3|4|5|7|8)[0-9]{9}$/,
    	//电话
    	tel:/^[0-9-()（）]{7,18}$/,
    	//邮箱
    	email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    	//身份证
    	idcard:/^[1-9]\d{5}((\d{2}[01]\d[0-3]\d{4})|([1-9]\d{3}[01]\d[0-3]\d{4}(\d|X)))$/,
    	//中文
    	cn:/^[\u4e00-\u9fa5]+$/,
    	//税号
    	taxnum:/^[a-zA-Z0-9]{15,20}$/,
    	//银行卡号
    	banknum:/^[0-9]*$/
    },
    /**
     * @func 判断是否安装pdf
     */
    isPDFInstalled:function(){
    	var i, len;
        var flag = false;
        if($.browser.webkit){
            flag = true;
        }
        if(navigator.plugins && (len = navigator.plugins.length)){
            for(i = 0; i < len; i++){
                if(/Adobe Reader|Adobe PDF|Acrobat|Chrome PDF Viewer/.test(navigator.plugins[i].name)){
                    flag = true;
                    break;
                }
            }
        }
        try{
            if(window.ActiveXObject || window.ActiveXObject.prototype){
                for(i = 1; i < 10; i++){
                    try{
                        if(eval("new ActiveXObject('PDF.PdfCtrl." + i + "');")){
                            flag = true;
                            break;
                        }
                    } 
                    catch(e){
                        flag = false;
                    }
                }
                
                var arr = ['PDF.PdfCtrl', 'AcroPDF.PDF.1', 'FoxitReader.Document', 'Adobe Acrobat', 'Adobe PDF Plug-in'];
                len = arr.length;
                for(i = 0; i < len; i++){
                    try{
                        if(new ActiveXObject(arr[i])){
                            flag = true;
                            break;
                        }
                            
                    } 
                    catch(e){
                        flag = false;
                    }
                }
            }
        }
        catch(e){
            
        }
        return flag;
    },
    /**
     * @func 设置上传图片本地路径
     * @param file <jQuery Object> file上传按钮jq对象
     * @param target <jQuery Object> 图片jq对象
     */
    setPath:function(file, target){
        if(typeof document.selection !== 'undefined'){
            file.select();
            file.blur();
            target.removeAttr('src');
            target[0].style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+ document.selection.createRange().text +'", sizingMethod = scale)';
        }
        else{
            file = file.files[0];
            var reader = new FileReader();
            reader.onload = function(event){ 
                var txt = event.target.result;
                target.attr('src', txt);
            }
            reader.readAsDataURL(file);
        }
    },
    /**
     * @func 切换验证码
     * @param ele <DOM Object> 图片元素
     */
    getCode:function(ele){
        ele.src = this.setParam('_', new Date().getTime(), ele.src);
    }
};;
///<jscompress sourcefile="jquery.placeholder.js" />
/**
 * @filename jquery.placeholder.js
 * @author Aniu[2014-3-16 19:40]
 * @update Aniu[2016-04-13 10:10]
 * @version v1.4
 * @description 模拟html5的placeholder效果
 */

;!(function(window, document, $, undefined){
    $.fn.placeholder = function(o){
        o = $.extend({
            /**
             * @func 是否启用动画显示展示
             * @type <Boolean>
             */
            animate:true,
            /**
             * @func 是否使用原生placeholder
             * @type <Boolean>
             */
            proto:true,
            /**
             * @func 输入框值是否可以和占位符相同
             * @type <Boolean>
             */
            equal:false,
            /**
             * @func 占位符文本颜色
             * @type <String>
             */
            color:'#ccc',
            /**
             * @func 类选择器值，可对占位符设置样式
             * @type <String>
             */
            theme:''
        }, o||{});
        return this.each(function(){
            var that = $(this), ph = $.trim(that.attr('placeholder'));
            if(!!ph){
                if(!o.animate && o.proto === true && (supportPlaceholder('input') || supportPlaceholder('textarea'))){
                    return;
                }
                that.removeAttr('placeholder');
                
                if(!$.trim(that.val())){
                    that.val('');
                }
                
                var data = {
                    pleft:parseInt(that.css('paddingLeft')),
                    ptop:parseInt(that.css('paddingTop')),
                    height:that.outerHeight()
                };
                
                var txt = $('<b>'+ ph +'</b>').appendTo(that.wrap('<strong />').parent().css({
                    position:'relative',
                    display:'inline-block',
                    width:that.outerWidth(),
                    overflow:'hidden',
                    cursor:'text'
                }).addClass(o.theme)).css($.extend({
                    position:'absolute',
                    left:data.pleft+1,
                    top:data.ptop,
                    height:data.height,
                    lineHeight:data.height+'px',
                    color:o.color
                }, that.is('textarea') ? {lineHeight:'normal', height:'auto'} : {})).on('click', function(){
                    that.focus();
                });
                
                that.on('focus', function(){
                    o.animate === true && txt.stop(false, true).animate({left:data.pleft+10, opacity:'0.5'});
                }).on('blur change', function(){
                    var val = $.trim(that.val());
                    if((o.equal === false && val == ph) || !val){
                        that.val('');
                        txt.show();
                        o.animate === true && txt.animate({left:data.pleft+1, opacity:'1'});
                    }
                    else{
                        txt.hide();
                    }
                }).on('keyup keydown', function(){
                    $.trim(that.val()) ? txt.hide() : txt.show();
                }).blur();
            }
        });
    }
    
    function supportPlaceholder(element){
        return 'placeholder' in document.createElement(element);  
    }
    
})(this, document, jQuery);;
///<jscompress sourcefile="jquery.numeral.js" />
/**
 * @filename jquery.numeral.js
 * @author Aniu[2016-07-01 16:31]
 * @update Aniu[2016-07-27 17:46]
 * @version v1.2
 * @description 限制输入框输入数字
 */

;!(function(window, document, $, undefined){
    
    $.fn.numeral = function(opts){
        opts = $.extend(true, {
            /**
             * @func 整数长度
             * @type <Number>
             */
            integer:4,
            /**
             * @func 小数长度，0则不启用小数
             * @type <Number>
             */
            decimal:2,
            /**
             * @func 是否可以输入负数
             * @type <Boolean>
             */
            minus:false,
            /**
             * @func 是否启用正负切换
             * @type <Boolean>
             * @desc 值为负数，输入“ - + ”转换为正数
             */
            convert:false,
            /**
             * @func 键盘抬起时的回调
             * @type <Null, Function>
             * @param elem <jQuery Object> 调用组件的jq对象
             * @param value <String> 输入框的值
             */
            callback:null
        }, opts||{});
        
        return this.each(function(){
            
            var elem = this;
            var me = $(elem);
            var o = $.extend({}, opts, me.data()||{});

            //允许输入的keycode
            var kcode = [8, 9, 13, 37, 39];
            var keyCode = [];
            
            //大键盘数字
            for(var i=48; i<=57; i++){
                keyCode.push(i);
            }
            //小键盘数字
            for(var i=96; i<=105; i++){
                keyCode.push(i);
            }
            
            //不能输入负数则无法启用正负抵消
            if(o.minus !== true){
                o.convert = false;
            }
            
            //若整数位数不大于0则用户可以任意输入
            if(o.integer <= 0){
                return;
            }
            
            //小数位数存在则可以输入小数点
            if(o.decimal > 0){
                keyCode.push(110);
                keyCode.push(190);
            }
            
            //禁用输入法 仅ie兼容
            elem.style.imeMode = 'disabled';
            
            me.on('keydown', function(e){
                var kc = e.keyCode;
                if($.inArray(kc, kcode) !== -1 || e.shiftKey || e.ctrlKey){
                    return true;
                }
                var val = $.trim(me.val());
                var index = getFocusIndex(elem, val);
                var arr = val.split('.');
                var integer = arr[0].replace(/-/g, '').length;
                var decimal;
                //存在小数点则获取小数位数
                if(arr[1] !== undefined){
                    decimal = arr[1].length;
                }
                
                //判断输入框中是否有选中的值
                if(isSelect()){
                    return true;
                }
                
                if($.inArray(kc, keyCode) === -1){
                    return false;
                }

                //只能输入一个小数点
                if(o.decimal > 0 && (kc === 110 || kc === 190)){
                    return decimal === undefined;
                }
                
                if(decimal !== undefined){
                    //在整数位置输入如果位数不够，则可以继续输入
                    if(index <= val.indexOf('.')){
                        if(integer < o.integer){
                            return true;
                        }
                    }
                    //在小数位置输入如果位数不够，则可以继续输入
                    else{
                        if(decimal < o.decimal){
                            return true;
                        }
                    }
                    
                    //如果小数位置超出则禁止输入
                    if(decimal >= o.decimal){
                        return false;
                    }
                }

                //如果整数位置超出则禁止输入
                if(integer >= o.integer){
                    return false;
                }
                
            }).on('keyup', function(e){
                var kc = e.keyCode;
                //阻止键盘ctrl+v
                if(kc == 86 || kc == 17){
                    return false;
                }
                if(kc !== 8 && $.inArray(kc, kcode) !== -1){
                    return true;
                }
                var val = $.trim(me.val());
                var index = getFocusIndex(elem, val);
                var minusIndex = val.indexOf('-');
                //过滤半角字符
                val = filterHalfAngle(val, o.integer);

                //开启负数
                if(o.minus === true){
                    if(o.convert === true){
                        //文本存在减号，按加号则移除减号
                        if(kc === 107 && minusIndex !== -1){
                            val = val.replace(/-/g, '');
                            index--;
                        }
                        //文本存在减号，按减号则移除减号，否则添加减号
                        else if(kc === 109 || kc === 189){
                            if(minusIndex !== -1){
                                val = val.replace(/-/g, '');
                                index--;
                            }
                            else{
                                val = '-' + val;
                                index++;
                            }
                        }
                    }
                    else{
                        //添加减号
                        if((kc === 109 || kc === 189) && minusIndex === -1){
                            val = '-' + val;
                            index++;
                        }
                    }
                    //文本中存在多个减号则只保留最前面的一个
                    if(val.match(/-/g)){
                        val = '-' + val.replace(/-/g, '');
                    }
                }
                //用户未启用负数则过滤文本中所有减号
                else{
                    val = val.replace(/-/g, '');
                }
                
                var dotIndex = val.indexOf('.');
                //用户启用了小数点，如果存在多个点号，则只保留最前面的
                if(o.decimal > 0){
                    if((kc === 110 || kc === 190) && dotIndex !== -1){
                        var start = val.substr(0, dotIndex+1);
                        var end = val.substr(dotIndex+1).replace(/\./, '');
                        val = start + end;
                    }
                }
                //未开启小数点则过滤文本中的小数点
                else if(dotIndex !== -1){
                    val = val.replace(/\./g, '');
                    index--;
                }
                
                //过滤文本中的除“减号、点号、数字”以外的字符
                val = val.replace(/[^-.0-9]/g, '');
                
                var temp = val.replace(/-/, '');
                var decimal = '';
                //截取小数，保留设置的位数，移除尾部多余部分
                if(o.decimal > 0 && temp.indexOf('.') !== -1){
                    decimal = temp.substr(temp.indexOf('.'), o.decimal+1);
                }
                
                //截取整数，保留设置的位数，移除尾部多余的部分，拼接上过滤的小数部分
                val = (val.indexOf('-') !== -1 ? '-' : '') + temp.replace(/\.\d*/g, '').substr(0, o.integer) + decimal;
                	
                me.val(val);
                var len = val.length;
                //重新给输入框填充过滤后的值后，焦点会在最后，因此要重新将焦点移到操作部位
                setTimeout(function(){
                    if(elem.setSelectionRange){
                        elem.setSelectionRange(index, index);   
                    } 
                    //ie
                    else{
                        var range = elem.createTextRange();
                        range.moveStart('character', -len);
                        range.moveEnd('character', -len);
                        range.moveStart('character', index);
                        range.moveEnd('character', 0);
                        range.select();
                    }
                });

                typeof o.callback === 'function' && o.callback(me, val);
            }).on('paste cut', function(e){
                var me = $(this);
                setTimeout(function(){
                    me.keyup();
                }, 10);
            }).on('blur', function(){
                var me = this;
                var val = $.trim(me.value);
                if(val){
                    me.value = parseFloat(val).toFixed(o.decimal);
                }
            });
        });
    }
    
    //获取输入框内光标位置
    function getFocusIndex(elem, val){
        var index = val.length;
        if(elem.setSelectionRange){
            index = elem.selectionStart;
        }
        else{
            //ie
            var temp = document.selection.createRange();
            var textRange = elem.createTextRange();
            textRange.setEndPoint('endtoend', temp);
            index = textRange.text.length;
        }
        return index;
    }
    
    //判断输入框文本是否被选择
    function isSelect(){
        var text = '';
        //ie10以及以下浏览器
        if(document.selection){
            text =  document.selection.createRange().text;
        }
        //火狐和ie11浏览器getSelection无法获取表单元素选中文本
        else if(navigator.userAgent.toLowerCase().indexOf('gecko') !== -1){
            var textArea = document.activeElement;
            text = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        }
        //chrome safari opera
        else if(window.getSelection){
            text = window.getSelection().toString();
        }
        //低版本chrome
        else if(document.getSelection){
            text = document.getSelection().toString();
        }
        return !!text;
    }
    
    //过滤半角输入法数字
    function filterHalfAngle(val, len){
        var map1 = {
            '０':'0',
            '１':'1',
            '２':'2',
            '３':'3',
            '４':'4',
            '５':'5',
            '６':'6',
            '７':'7',
            '８':'8',
            '９':'9'
        }
        var map2 = {
            '－':'-',
            '．':'.',
            '。':'.'
        }
        val = val.replace(/([０１２３４５６７８９－．。])+/g, function(all, single){
            var value1, value2;
            if((value1 = map1[single]) !== undefined){
                var i = 1, length = all.length, temp = '';
                if(length > len){
                    length = len;
                }
                while(i <= length){
                    temp += value1;
                    i++;
                }
                return temp;
            }
            else if((value2 = map2[single]) !== undefined){
                return value2;
            }
            return all;
        });
        return val;
    }
    
})(this, document, jQuery);;
///<jscompress sourcefile="init.js" />
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
});;
