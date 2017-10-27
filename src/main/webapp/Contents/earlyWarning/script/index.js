/**
 * @filename index.js
 * @author Wang Chijun[2017-05-23]
 * @update
 * @version v1.0
 * @description  earlyWarning.js
 */

/**
 * 参数说明
 * keyWord--搜索关键词
 * bltRegion--所属地址
 * taxStation--税务机关
 * fenceState--围栏状态
 * taxPayer--纳税人标识
 * companyState--企业状态
 * warnAddress--预警地址
 * warnStartTime--预警开始时间
 * warnEndTime--预警结束时间
 * macNum--mac相同企业数量
 * macAddress--mac地址
 **/

var keyWord = '',		//搜索关键词
    bltRegion = '',		//所属地址
    taxStation = '',	//税务机关
    fenceState = '0',	//围栏状态
    taxPayer = '', 	//纳税人标识
    companyState = '',    //企业状态
    warnAddress = '',  //预警地址
    warnStartTime = $.calendar.date(-7, 'yyyy-MM-dd hh:mm'),	//预警开始时间
    warnEndTime = $.calendar.date(0, 'yyyy-MM-dd hh:mm'), //预警结束时间
    //macNum = '0',	//mac相同企业数量
    macAddress = '';	//mac地址

// 点击的选择框类型
var global_type = 0;// 1-企业属地 2-税务机关 3-围栏状态 4-纳税人标识 5-企业状态 6-预警地址 7-预警开始日期 8-预警结束日期

//初始化下拉框
$('select').imitSelect();
$('select[name="companyState"]').imitSelect({disabled: true});
$('select[name="fenceState"]').imitSelect({disabled: true});

//隐藏域初始参数
$('.isChange').attr({
    'data-warnStartTime': warnStartTime,
    'data-warnEndTime': warnEndTime,
});

//搜索框输入
$("#search_companyname").suggest({
	url: 'http://code.jss.com.cn:8080/dataAnalysis-web/company/prefix',
    param:"text",
    limit:5,
    cache:false,
    returnData: function (item) {
	    console.log(item.name);
        return '<li title="'+ item.name +'">' + item.name + '</li>';
    }
});

// 高级筛选显示隐藏
$('.sch_senior').on('click', function () {
    $('.m-filter').toggleClass('show');
    if($(this).find('i.iconfont').hasClass('icon-zhankai')){
        $(this).find('i.iconfont').removeClass('icon-zhankai').addClass('icon-shouqi');
    }else{
        $(this).find('i.iconfont').removeClass('icon-shouqi').addClass('icon-zhankai');
    }
})

//企业属地
$.ajax({
	url: my.common.global.contextPath + '/warn/init',
    type: 'post',
    dataType: 'json',
    /*data: {
    	code : "450000",
    	name : "广西壮族自治区"
    },*/
    success: function (data) {
    	if (data.code == 1) {
    		data = data.result;
    		//var def = data.defaultR;
            var slcName = '';
            data.code ? (bltRegion = data.code, slcName = data.name) : (bltRegion = '', slcName = '请选择地区');
            spaging(keyWord, bltRegion, taxStation, fenceState, taxPayer, companyState, warnAddress, warnStartTime, warnEndTime, macAddress);
            $('.region a').attr("data-value", bltRegion).html(slcName + '<i class="iconfont">&#xe759;</i>');
            $('.isChange').attr('data-bltRegion',bltRegion);
            $('.regionList').html($(template('tpl-bltRegion', data)));
            $('select[name="taxStation"]').imitSelect({isInit: false, isNull: true, isTitle: true, count: 10});
            $(document).click(function () {
                //判断是否隐藏了区域列表
                if ($('.regionList').hasClass('show')) {
                    $('.regionList').removeClass('show');
                    /*var code = $('.region a').attr('data-value').split(',');
                    if (code.length == 1 && code != '') {	//直辖市或市选择的为全部
                        $('.regionList .provList li.prov[data-value="' + code[0] + '"]').addClass('hover').siblings('li').removeClass('hover');
                        var city = $('.regionList .provList li.hover').children('ul.cityChild').html();
                        if (city === undefined) {
                            $('.regionList .cityList').html('');
                            $('.regionList .cityScroll').hide();
                        } else {
                            $('.regionList .cityList').html(city);
                            $('.regionList .cityList li[data-value="' + code[0] + '"]').addClass('s-crt').siblings('li').removeClass('s-crt');
                        }
                    } else if (code.length == 2) {	//市选择全部
                        $('.regionList .provList li.prov[data-value="' + code[0] + '"]').addClass('hover').siblings('li').removeClass('hover');
                        var city = $('.regionList .provList li.hover').children('ul.cityChild').html();
                        $('.regionList .cityList').html(city);
                        $('.regionList .cityList li[data-value="' + code[1] + '"]').addClass('s-crt').siblings('li').removeClass('s-crt');
                    }*/
                    var cityName = $('.regionList .cityList li.s-crt').attr("data-name"),
                    provName = $('.regionList .provList li.hover').attr("data-name"),
                    cityCode = $('.regionList .cityList li.s-crt').attr("data-value"),
                    provCode = $('.regionList .provList li.hover').attr("data-value"),
                    showRegion = '';
        		    if (provName != undefined && cityName == undefined) {	
        		        showRegion = provName;
        		        bltRegion = provCode;
        		        $('.region a').attr('data-value', bltRegion).html(showRegion + '<i class="iconfont">&#xe759;</i>');
        		        $('select[name="taxStation"]').imitSelect({isInit: false, isNull: true, isTitle: true, count: 10});
        		    }
                }
            });

            $(".region a").on('click', function (e) {
            	global_type = 1;
            	deal();
                e.stopPropagation();
                $('.regionList').toggleClass('show');
                var length1 = $('.regionList .provList li.prov').length;
                if (length1 > 10) {
                    $('.regionList .provScroll').height(360);
                } else {
                    $('.regionList .provScroll').height(36 * length1);
                }
                $('.regionList .provScroll').panel({iWheelStep: 32});
                $('.zUIpanelScrollBar, .zUIpanelScrollBox').on('click draggable mousedown', function (e) {
                    e.stopPropagation();
                });
                //判断是否有市级内容
                var city = $('.regionList .cityScroll').find('.cityList').html();
                if (city === '') {
                    $('.regionList .cityScroll').hide();
                }
            });
            //点击省市列表
            $('.regionList .provList, .regionList .cityList').on('click draggable mousedown mouseup', function (e) {
                e.stopPropagation();
            });
            $('.regionList .provList').on('click', 'li', function (e) {	//选择省
                e.stopPropagation();
                $('.regionList .cityList').html('');
                $(this).addClass('hover').siblings('li').removeClass('hover');
                //判断是否是直辖市
                if ($(this).children('ul').length == 0) {	//是直辖市
                    $('.regionList .cityScroll').hide();
                    var provName = $(this).attr('data-name'),
                        provCode = $(this).attr('data-value'),
                        showRegion = '';
                    showRegion = provName;
                    slcRegion = provCode;
                    $(this).addClass('s-crt').siblings('li').removeClass('hover s-crt');
                    $('.region a').attr('data-value', slcRegion).html(showRegion + '<i class="iconfont">&#xe759;</i>');
                    $('.regionList').removeClass('show');
                    $('select[name="taxStation"]').imitSelect({isInit: false, isNull: true, isTitle: true, count: 10});
                } else {
                    $('.regionList .cityScroll').show();
                    $(this).addClass('hover').siblings('li').removeClass('hover s-crt');
                    var city = $(this).children('ul.cityChild').html();
                    $('.regionList .cityList').html(city);
                    var length = $('.regionList .cityList li.city').length;
                    if (length > 10) {
                        $('.regionList .cityScroll').height(360);
                    } else {
                        $('.regionList .cityScroll').height(36 * length);
                    }
                    $('.regionList .cityScroll').panel({iWheelStep: 32});
                }
                $('.zUIpanelScrollBar, .zUIpanelScrollBox').on('click draggable mousedown', function (e) {
                    e.stopPropagation();
                });
            });
            $('.regionList .cityList').on('click', 'li', function (e) {	//选择市
                e.stopPropagation();
                var cityName = $(this).attr('data-name'),
                    provName = $('.regionList .provList li.hover').attr("data-name"),
                    cityCode = $(this).attr('data-value'),
                    provCode = $('.regionList .provList li.hover').attr("data-value"),
                    showRegion = '';
                if (cityName === '全部') {	//选择省下面所有的市
                    showRegion = provName;
                    bltRegion = provCode;
                    $(this).addClass('s-crt').siblings('li').removeClass('hover s-crt');
                    $('.regionList').removeClass('show');
                    $('.region a').attr('data-value', bltRegion).html(showRegion + '<i class="iconfont">&#xe759;</i>');
                } else {
                    showRegion = provName + ' ' + cityName;
                    bltRegion = provCode + ',' + cityCode;
                    $(this).addClass('s-crt').siblings('li').removeClass('hover s-crt');
                    $('.region a').attr('data-value', bltRegion).html(showRegion + '<i class="iconfont">&#xe759;</i>');
                    $('.regionList').removeClass('show');
                }
                $('select[name="taxStation"]').imitSelect({isInit: false, isNull: true, isTitle: true, count: 10});
            });
        }
	}
});

//根据企业属地返回税务机关列表
function getTaxStation(value) {
    var option = '<option value="">全部</option>';
    bltRegion = $('.region a').attr('data-value');
    if (bltRegion !== undefined) {
        $.ajax({
            url: my.common.global.contextPath + '/warn/taxOffices',
            type: 'get',
            dataType: 'json',
            data: {
                bltRegion: bltRegion
            },
            async: false,
            success: function (data) {
            	if (data.code == 1) {
            		data = data.result;
            		$.each(data, function (k, v) {
                        option += '<option value="' + v.code + '">' + v.name + '</option>';
                    });
            	}
            }
        });
    }
    return option;
}

//预警地址
$.ajax({
    url: my.common.global.contextPath + '/warn/warnArea',
    type: 'post',
    dataType: 'json',
    success: function (data) {
    	if (data.code == 1) {
    		data = data.result;
    		$('.addressList').html($(template('tpl-warnRegion', data)));
            $(document).click(function () {
                //判断是否隐藏了区域列表
                if ($('.addressList').hasClass('show')) {
                    $('.addressList').removeClass('show');
                    /*var code = $('.warnAddress a').attr('data-value').split(',');
                    if (code.length == 1 && code != '') {	//直辖市或市选择的为全部
                        $('.regionList .provList li.prov[data-value="' + code[0] + '"]').addClass('hover').siblings('li').removeClass('hover');
                        var city = $('.addressList .provList li.hover').children('ul.cityChild').html();
                        if (city === undefined) {
                            $('.addressList .cityList').html('');
                            $('.addressList .cityScroll').hide();
                        } else {
                            $('.addressList .cityList').html(city);
                            $('.addressList .cityList li[data-value="' + code[0] + '"]').addClass('s-crt').siblings('li').removeClass('s-crt');
                        }
                    } else if (code.length == 2) {	//市选择全部
                        $('.addressList .provList li.prov[data-value="' + code[0] + '"]').addClass('hover').siblings('li').removeClass('hover');
                        var city = $('.addressList .provList li.hover').children('ul.cityChild').html();
                        $('.addressList .cityList').html(city);
                        $('.addressList .cityList li[data-value="' + code[1] + '"]').addClass('s-crt').siblings('li').removeClass('s-crt');
                    }*/
                    var cityName = $('.addressList .cityList li.s-crt').attr("data-name"),
    	                provName = $('.addressList .provList li.hover').attr("data-name"),
    	                cityCode = $('.addressList .cityList li.s-crt').attr("data-value"),
    	                provCode = $('.addressList .provList li.hover').attr("data-value"),
    	                showRegion = '';
    	            if (provName != undefined && cityName == undefined) {	
    	                showRegion = provName;
    	                warnAddress = provCode;
    	                $('.warnAddress a').attr('data-value', warnAddress).html(showRegion + '<i class="iconfont">&#xe759;</i>');
    	            }
                }
            });

            $(".warnAddress a").on('click', function (e) {
            	global_type = 6;
            	deal();
                e.stopPropagation();
                $('.addressList').toggleClass('show');
                var length1 = $('.addressList .provList li.prov').length;
                if (length1 > 10) {
                    $('.addressList .provScroll').height(360);
                } else {
                    $('.addressList .provScroll').height(36 * length1);
                }
                $('.addressList .provScroll').panel({iWheelStep: 32});
                $('.zUIpanelScrollBar, .zUIpanelScrollBox').on('click draggable mousedown', function (e) {
                    e.stopPropagation();
                });
                //判断是否有市级内容
                var city = $('.addressList .cityScroll').find('.cityList').html();
                if (city === '') {
                    $('.addressList .cityScroll').hide();
                }
            });
            //点击省市列表
            $('.addressList .provList, .cityList').on('click draggable mousedown mouseup', function (e) {
                e.stopPropagation();
            });
            $('.addressList .provList').on('click', 'li', function (e) {	//选择省
                e.stopPropagation();
                $('.addressList .cityList').html('');
                $(this).addClass('hover').siblings('li').removeClass('hover');
                //判断是否是直辖市
                if ($(this).children('ul').length == 0) {	//是直辖市
                    $('.addressList .cityScroll').hide();
                    var provName = $(this).attr('data-name'),
                        provCode = $(this).attr('data-value'),
                        showRegion = '';
                    showRegion = provName;
                    slcRegion = provCode;
                    $(this).addClass('s-crt').siblings('li').removeClass('hover s-crt');
                    $('.warnAddress a').attr('data-value', slcRegion).html(showRegion + '<i class="iconfont">&#xe759;</i>');
                    $('.addressList').removeClass('show');
                } else {
                    $('.addressList .cityScroll').show();
                    $(this).addClass('hover').siblings('li').removeClass('hover s-crt');
                    var city = $(this).children('ul.cityChild').html();
                    $('.addressList .cityList').html(city);
                    var length = $('.cityList li.city').length;
                    if (length > 10) {
                        $('.addressList .cityScroll').height(360);
                    } else {
                        $('.addressList .cityScroll').height(36 * length);
                    }
                    $('.addressList .cityScroll').panel({iWheelStep: 32});
                }
                $('.zUIpanelScrollBar, .zUIpanelScrollBox').on('click draggable mousedown', function (e) {
                    e.stopPropagation();
                });
            });
            $('.addressList .cityList').on('click', 'li', function (e) {	//选择市
                e.stopPropagation();
                var cityName = $(this).attr('data-name'),
                    provName = $('.addressList .provList li.hover').attr("data-name"),
                    cityCode = $(this).attr('data-value'),
                    provCode = $('.addressList .provList li.hover').attr("data-value"),
                    showRegion = '';
                if (cityName === '全部') {	//选择省下面所有的市
                    showRegion = provName;
                    warnAddress = provCode;
                    $(this).addClass('s-crt').siblings('li').removeClass('hover s-crt');
                    $('.addressList').removeClass('show');
                    $('.warnAddress a').attr('data-value', warnAddress).html(showRegion + '<i class="iconfont">&#xe759;</i>');
                } else {
                    showRegion = provName + ' ' + cityName;
                    warnAddress = provCode + ',' + cityCode;
                    $(this).addClass('s-crt').siblings('li').removeClass('hover s-crt');
                    $('.warnAddress a').attr('data-value', warnAddress).html(showRegion + '<i class="iconfont">&#xe759;</i>');
                    $('.addressList').removeClass('show');
                }
            });
    	}
    }
});

//初始化预警开始时间、结束时间
$('.startTime').attr('value', $.calendar.date(-7, 'yyyy-MM-dd hh:mm'));
$('.endTime').attr('value', $.calendar.date(0, 'yyyy-MM-dd hh:mm'));
//选择预警时间区间
var startDate = $.calendar({
    target: '.startTime',
    format: 'yyyy-MM-dd hh:mm',
    startime: $.calendar.date(-7),
    initime: $.calendar.date(-7),
    max: $.calendar.date(0, 'yyyy-MM-dd hh:mm'),
    isclose: false,
    istime: true,
    isprev: false,
    isnext: false,
    button: [{
        name: 'confirm',
        text: '确定'
    }],
    onchoose: function (dates) {
        console.log(dates);
        endDate.set({
            'min': dates[0]
        })
    }
});
var endDate = $.calendar({
    target: '.endTime',
    format: 'yyyy-MM-dd hh:mm',
    initime: $.calendar.date(0),
    max: $.calendar.date(0, 'yyyy-MM-dd hh:mm'),
    isclose: false,
    istime: true,
    isprev: false,
    isnext: false,
    button: [{
        name: 'confirm',
        text: '确定'
    }],
    onchoose: function (dates) {
        //console.log(dates);
        startDate.set({
            'max': dates[0]
        })
    }
});

function spaging(keyWord, bltRegion, taxStation, fenceState, taxPayer, companyState, warnAddress, warnStartTime, warnEndTime, macAddress) {
    $.paging('tableList', {
        url: my.common.global.contextPath + '/warn/abnormalEnterprises',
        ajax:{
          type: 'post'
        },
        pCount: 20,
        loading: {
            wrap: $('.m-listData tbody'),
            show: function () {
                $('.m-listData tbody').html('');
                $(".allData, #paging1").hide();
                var that = this;
                that.hide();
                var wrap = that.wrap;
                wrap.append('<div class="ui-loading" style="text-align:center;margin-top:10%;"><img src="../static/images/loading.gif" /></div>');
            },
            hide: function () {
                $('.ui-loading').remove();
                $(".allData, #paging1").show();
            }
        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        button: {
            prev: '<',
            next: '>'
        },
        wrap: $('#paging1'),
        condition: {
            bltRegion: bltRegion,
            companyName: keyWord,
            taxStation: taxStation,
            fenceState: fenceState,
            taxPayer: taxPayer,
            companyState: companyState,
            warnAddress: warnAddress,
            warnStartTime: warnStartTime,
            warnEndTime: warnEndTime,
            macAddress: macAddress
        },
        echoData: function (data) {
            if (data.list == '' || data.list == '0') {
                $('.m-listData tbody').html('');
                $(".allData, .m-paging").hide();
                $(".noData").show();
            } else {
                var aCount = data.aCount;
                var page = parseInt(this.current || 1);
                var crt = (page - 1) * this.pCount;
                $(".allData, .m-paging").show();
                $(".allData").html("共有" + aCount + "条数据");
                $(".noData").hide();
                var list = data.list;
                var ssd = '';
                $.each(list, function (k, v) {
                    ssd += '<tr data-id="' + v.id + '">\
							<td class="td-region">' + v.region + '</td>\
							<td class="td-taxStation">' + v.taxStation + '</td>\
							<td class="td-companyName" title="' + v.companyName + '" style="width:15%;">' + v.companyName + '</td>\
							<td class="td-taxPayer" style="width:15%;">' + v.taxPayerStatusCh + '</td>\
							<td class="td-taxNum">' + v.taxNum + '</td>\
							<td class="td-extNum">' + v.extNum + '</td>\
							<td class="td-allowRegion">' + v.allowRegion + '</td>\
							<td class="td-recRegion">' + v.recRegion + '</td>\
							<td class="td-fence">' + v.fenceStatusCh + '</td>\
							<td class="td-comState">' + v.enterpriseStatusCh + '</td>\
							</tr>';
                });
                $('.m-listData tbody').html(ssd);
            }
        }
    });
}

//搜索输入框内容
$("#search_companyname").keydown(function (e) {
    var that = $(this);
    if (e.keyCode == 13) {
        if (!that.hasClass("sub_disabled")) {
            keyWord = $("#search_companyname").val();
            tableList.condition.companyName = keyWord;
            tableList.query(true);
            $('.isChange').attr('data-keyWord',keyWord);
        }
        else {
            return false;
        }
    }
});
$(".btn-search").find("button").click(function () {
    var name = $(this).attr("name");
    var that = $(this);
    if (name == "reset") {    //重置按钮
        /*
         $(".search").val("");
         keyWord="";
         //spaging(slcRegion,keyWord,rangeType,rangeMin,rangeMax,service,softVersion,taxVersion,tdType,sortBy);
         tableList.condition.companyName = keyWord;
         tableList.query(true);
         */
    }
    else {
        if (!that.hasClass("sub_disabled")) {
            keyWord = $("#search_companyname").val();
            $("#search_companyname").val(keyWord);
            tableList.condition.companyName = keyWord;
            tableList.query(true);
            $('.isChange').attr('data-keyWord',keyWord);
        }
        else {
            return false;
        }
    }
});

//mac地址输入时过滤非数字、字母、中划线
$('input[name="mac"]').on('input propertychange', function(){
    var reg = /[^a-z0-9-]/i,
        mac = $(this).val();
    if(reg.exec(mac) !== null){
        mac = mac.replace(reg,'');
        $(this).val(mac);
    }
});

//筛选
$('.filterCheck').on('click', function () {
    keyWord = $("#search_companyname").val();
    bltRegion = $('.item-option.region').find('a').attr('data-value');
    taxStation = $('.item-option.taxStation').find('.ui-animate li.s-crt').attr('data-value');
    fenceState = $('.item-option.fenceState').find('.ui-animate li.s-crt').attr('data-value');
    taxPayer = $('.item-option.taxPayer').find('.ui-animate li.s-crt').attr('data-value');
    warnAddress = $('.item-option.warnAddress').find('a').attr('data-value');
    warnStartTime = $('.item-option.warnDate').find('.startTime').attr('value');
    warnEndTime = $('.item-option.warnDate').find('.endTime').attr('value');
    macAddress = $('.item-option.macAddress').find('input[name="mac"]').attr('value');
    tableList.condition.companyName = keyWord;
    tableList.condition.bltRegion = bltRegion;
    tableList.condition.taxStation = taxStation;
    tableList.condition.fenceState = fenceState;
    tableList.condition.taxPayer = taxPayer;
    tableList.condition.warnAddress = warnAddress;
    tableList.condition.warnStartTime = warnStartTime;
    tableList.condition.warnEndTime = warnEndTime;
    tableList.condition.macAddress = macAddress;
    tableList.query(true);
    $('.isChange').attr({
        'data-keyWord': keyWord,
        'data-bltRegion': bltRegion,
        'data-taxStation': taxStation,
        'data-fenceState': fenceState,
        'data-taxPayer': taxPayer,
        'data-warnAddress': warnAddress,
        'data-warnStartTime': warnStartTime,
        'data-warnEndTime': warnEndTime,
        'data-macAddress' : macAddress
    });
});

//数据导出
$('.export').on('click', function () {
    var keyWord = $('.isChange').attr('data-keyWord'),
        bltRegion = $('.isChange').attr('data-bltRegion'),
        taxStation = $('.isChange').attr('data-taxStation'),
        fenceState = $('.isChange').attr('data-fenceState'),
        taxPayer = $('.isChange').attr('data-taxPayer'),
        companyState = '0',
        warnAddress = $('.isChange').attr('data-warnAddress'),
        warnStartTime = $('.isChange').attr('data-warnStartTime'),
        warnEndTime = $(".isChange").attr('data-warnEndTime'),
        macAddress = $('.isChange').attr('data-macAddress');
    window.open(my.common.global.contextPath + '/warn/exportAbnormalEnterprises?keyWord=' + keyWord + '&bltRegion=' + bltRegion + '&taxStation=' + taxStation + '&fenceState=' + fenceState + '&taxPayer=' + taxPayer + '&companyState=' + companyState + '&warnAddress=' + warnAddress + '&warnStartTime=' + warnStartTime + '&warnEndTime=' + warnEndTime + '&macAddress=' + macAddress);
});


// 纳税人标识点击事件
$(".taxPayer .ui-imitselect").on("click", function(){
	global_type = 4;
	deal();
});

// 统一处理点击事件
function deal(){
	var cityName = $('.regionList .cityList li.s-crt').attr("data-name"),
    provName = $('.regionList .provList li.hover').attr("data-name"),
    cityCode = $('.regionList .cityList li.s-crt').attr("data-value"),
    provCode = $('.regionList .provList li.hover').attr("data-value"),
    showRegion = '';
	if (provName != undefined && cityName == undefined && $('.regionList').hasClass('show')) {	
        showRegion = provName;
        bltRegion = provCode;
        $('.region a').attr('data-value', bltRegion).html(showRegion + '<i class="iconfont">&#xe759;</i>');
    	$('select[name="taxStation"]').imitSelect({isInit: false, isNull: true, isTitle: true, count: 10});
    	if(global_type == 2){
    		$(".taxStation .ui-imitselect").addClass("s-show");
    	}
    }
	cityName = $('.addressList .cityList li.s-crt').attr("data-name"),
	provName = $('.addressList .provList li.hover').attr("data-name"),
	cityCode = $('.addressList .cityList li.s-crt').attr("data-value"),
	provCode = $('.addressList .provList li.hover').attr("data-value"),
	showRegion = '';
	if (provName != undefined && cityName == undefined) {	
	    showRegion = provName;
	    warnAddress = provCode;
	    $('.warnAddress a').attr('data-value', warnAddress).html(showRegion + '<i class="iconfont">&#xe759;</i>');
	}
	if(global_type != 1){
		$('.regionList').removeClass('show');
	}
	if(global_type != 2){
		$(".taxStation .ui-imitselect").removeClass("s-show");
	}
	if(global_type != 3){
		
	}
	if(global_type != 4){
		$(".taxPayer .ui-imitselect").removeClass("s-show");
	}
	if(global_type != 5){
	
	}
	if(global_type != 6){
		$('.addressList').removeClass('show');
	}
	if(global_type != 7){
		$(".ui-calendar").hide();
	}
	if(global_type != 8){
		$(".ui-calendar").hide();
	}
}
