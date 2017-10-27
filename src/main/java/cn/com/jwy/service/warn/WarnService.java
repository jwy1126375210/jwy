package cn.com.jwy.service.warn;

import java.util.List;
import java.util.Map;

import cn.com.jwy.dto.warn.BasicConditionInfo;
import cn.com.jwy.dto.warn.EnterpriseInfo;
import cn.com.jwy.dto.warn.Region;

public interface WarnService {
	
	/**
	 * 查询省、市两级区域列表
	 * @return
	 */
	public Map<String, Object> selectAreaListLevel(String code, String name);
	
	/**
	 * 初始化省、市两级区域列表
	 * @return
	 */
	public Map<String, Object> initAreaListLevel(String code, String name);
	
	/**
	 * 根据省级或市级查询税务机关
	 * @param regionCode
	 * @return
	 */
	public List<Region> selectOfficeListByArea(String regionCode);
	
	/**
	 * 查询预警地址
	 * @return
	 */
	public Map<String, Object> selectWarnArea();
	
	/**
	 * 查询预警企业列表
	 * @param basicConditionInfo
	 * @param currentPage
	 * @param numPerPage
	 * @return
	 */
	public EnterpriseInfo abnormalEnterprises(BasicConditionInfo basicConditionInfo, int currentPage, int numPerPage);

}
