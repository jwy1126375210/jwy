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
})(this, document, jQuery);