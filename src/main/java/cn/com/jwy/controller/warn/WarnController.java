package cn.com.jwy.controller.warn;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.jwy.common.model.AjaxResult;
import cn.com.jwy.common.model.ErrorInfo;
import cn.com.jwy.common.utils.ExportExcelUtil;
import cn.com.jwy.dto.warn.BasicConditionInfo;
import cn.com.jwy.dto.warn.EnterpriseInfo;
import cn.com.jwy.dto.warn.Region;
import cn.com.jwy.service.warn.WarnService;

/**
 * 实时预警
 * @author jiangwenyu
 *
 */

@Controller
@RequestMapping("/warn")
public class WarnController {
	
	@Autowired
	private WarnService warnService;
	
	/**
	 * 获取企业属地信息
	 * @param request
	 * @param code
	 * @param name
	 * @return
	 */
	@RequestMapping("/init")
	@ResponseBody
	public AjaxResult init(HttpServletRequest request,
			@RequestParam(value="code",required=false) String code,
			@RequestParam(value="name",required=false) String name) {
		AjaxResult ajax = new AjaxResult();
		try {
			Map<String, Object> result = warnService.initAreaListLevel(code, name);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(result);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 根据企业属地查询税务机关列表
	 * @param request
	 * @param bltRegion
	 * @return
	 */
	@RequestMapping("/taxOffices")
	@ResponseBody
	public AjaxResult taxOffices(HttpServletRequest request,
			@RequestParam("bltRegion") String bltRegion) {
		AjaxResult ajax = new AjaxResult();
		try {
			List<Region> regions = warnService.selectOfficeListByArea(bltRegion);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(regions);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 查询预警地址
	 * @param request
	 * @return
	 */
	@RequestMapping("/warnArea")
	@ResponseBody
	public AjaxResult warnArea(HttpServletRequest request) {
		AjaxResult ajax = new AjaxResult();
		try {
			Map<String, Object> result = warnService.selectWarnArea();
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(result);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 查询预警企业列表
	 * @param request
	 * @param basicConditionInfo
	 * @param current
	 * @param pCount
	 * @return
	 */
	@RequestMapping("/abnormalEnterprises")
	@ResponseBody
	public EnterpriseInfo abnormalEnterprises(HttpServletRequest request,
			BasicConditionInfo basicConditionInfo,
			@RequestParam("current") int current,
			@RequestParam("pCount") int pCount) {
		EnterpriseInfo info = warnService.abnormalEnterprises(basicConditionInfo, current, pCount);
		return info;
	}
	
	/**
	 * 导出企业异常信息
	 * @param request
	 * @param response
	 * @param keyWord
	 * @param taxStation
	 * @param fenceState
	 * @param bltRegion
	 * @param companyState
	 * @param warnAddress
	 * @param taxPayer
	 * @param warnStartTime
	 * @param warnEndTime
	 * @param macAddress
	 * @throws IOException 
	 */
	@RequestMapping(value = "/exportAbnormalEnterprises")
	public void exportAbnormalEnterprises(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("keyWord") String keyWord, 
			@RequestParam("taxStation") String taxStation,
			@RequestParam("fenceState") String fenceState, 
			@RequestParam("bltRegion") String bltRegion, 
			@RequestParam("companyState") String companyState,
			@RequestParam("warnAddress") String warnAddress, 
			@RequestParam("taxPayer") String taxPayer, 
			@RequestParam("warnStartTime") String warnStartTime,
			@RequestParam("warnEndTime") String warnEndTime, 
			@RequestParam("macAddress") String macAddress) throws IOException {
		BasicConditionInfo basicConditionInfo = new BasicConditionInfo();
		basicConditionInfo.setCompanyName(keyWord);// 企业名称
		basicConditionInfo.setFenceState(Integer.parseInt(fenceState));// 围栏状态
		basicConditionInfo.setTaxStation(taxStation);// 税务机关
		basicConditionInfo.setCompanyState(Integer.parseInt(companyState));// 企业状态
		if (!"".equals(taxPayer)) {
			basicConditionInfo.setTaxPayer(Integer.parseInt(taxPayer));// 纳税人标识
		}else{
			basicConditionInfo.setTaxPayer(null);// 纳税人标识
		}
		basicConditionInfo.setBltRegion(bltRegion);// 开票地址
		basicConditionInfo.setWarnAddress(warnAddress);
		basicConditionInfo.setWarnStartTime(warnStartTime);// 预警开始时间
		basicConditionInfo.setWarnEndTime(warnEndTime);// 预警结束时间
		basicConditionInfo.setMacAddress(macAddress);// mac地址
		EnterpriseInfo info = warnService.abnormalEnterprises(basicConditionInfo, 1, 100000000);
		ExportExcelUtil.exportWarnList("企业异常信息", info.getList(), response);
	}

}
