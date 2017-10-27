package cn.com.jwy.service.impl.warn;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.com.jwy.dto.warn.BasicConditionInfo;
import cn.com.jwy.dto.warn.EnterpriseInfo;
import cn.com.jwy.dto.warn.Region;
import cn.com.jwy.mapper.warn.AbnormalInfoMapper;
import cn.com.jwy.mapper.warn.AreaMapper;
import cn.com.jwy.mapper.warn.OfficeMapper;
import cn.com.jwy.model.warn.Area;
import cn.com.jwy.model.warn.Office;
import cn.com.jwy.service.warn.WarnService;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.entity.Example.Criteria;

@Service
public class WarnServiceImpl implements WarnService {
	
	private static Map<String, String> regionMap = new ConcurrentHashMap<String, String>();
	private static Map<String, Object> regionLevelMap = new ConcurrentHashMap<String, Object>();

	@Autowired
	private AreaMapper areaMapper;
	
	@Autowired
	private OfficeMapper officeMapper;
	
	@Autowired
	private AbnormalInfoMapper abnormalInfoMapper;
	
	@PostConstruct
	private void initCacheData() {
		// 加载省市层级到内存
		loadRegionLevel(null, null);
		// 加载所有区域信息到内存
		loadAllArea();
	}
	
	private void loadRegionLevel(String code, String name) {
		regionLevelMap.clear();
		Map<String, Object> result = selectAreaListLevel(code, name);
		regionLevelMap.put("regionLevelJson", result);
	}
	
	private void loadAllArea() {
		regionMap.clear();
		List<Area> areas = areaMapper.selectAll();
		if (areas != null && areas.size() > 0) {
			for (Area area : areas) {
				regionMap.put(area.getId(), area.getName());
			}
		} 
	}

	@Override
	public Map<String, Object> selectAreaListLevel(String code, String name) {
		Map<String, Object> result = new HashMap<String, Object>();
		String province_code = null;
		String city_code = null;
		if (StringUtils.isNotEmpty(code)) {
			String[] array = code.split(",");
			province_code = array[0];
			if (array.length > 1){
				city_code = array[1];
			}
		}
		List<Region> provinceList = new ArrayList<Region>();
		Example example = new Example(Area.class);
		Criteria criteria = example.createCriteria();
		criteria.andEqualTo("pId", "0");
		if (province_code != null) {
			criteria.andEqualTo("id", province_code);
		}
		List<Area> provinces = areaMapper.selectByExample(example);
		if (provinces != null && provinces.size() > 0) {
			for (Area area_province : provinces) {
				Region province = new Region();
				province.setCode(area_province.getId());
				province.setName(area_province.getName());
				List<Region> cityList = new ArrayList<Region>();
				example = new Example(Area.class);
				criteria = example.createCriteria();
				criteria.andEqualTo("pId", area_province.getId());
				if (city_code != null){
					criteria.andEqualTo("id", city_code);
				}
				List<Area> citys = areaMapper.selectByExample(example);
				if (citys != null && citys.size() > 0) {
					for (Area area_city : citys) {
						Region city = new Region();
						city.setCode(area_city.getId());
						city.setName(area_city.getName());
						cityList.add(city);
					}
				}
				province.setCity(cityList);
				provinceList.add(province);
			}
		}
		result.put("region", provinceList);
		if (StringUtils.isNotEmpty(code) && StringUtils.isNotEmpty(name)) {
			result.put("code", code);
			result.put("name", name);
		} else {
			result.put("code", "330000,330100");
			result.put("name", "浙江省 杭州市");
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> initAreaListLevel(String code, String name) {
		if (regionLevelMap.get("regionLevelJson") == null || !((Map<String, Object>)regionLevelMap.get("regionLevelJson")).get("code").equals(code)) {
			loadRegionLevel(code, name);
		}
		return (Map<String, Object>) regionLevelMap.get("regionLevelJson");
	}
	
	@Override
	public List<Region> selectOfficeListByArea(String regionCode) {
		List<Region> regionList = new ArrayList<>();
		String[] codes = regionCode.split(",");
		List<Office> offices = new ArrayList<Office>();
		if (codes.length == 2) {// 市级
			offices = officeMapper.selectOfficeListByCityCode(codes[1]);
		} else {// 省级
			offices = officeMapper.selectOfficeListByProvinceCode(codes[0]);
		}
		if (offices != null && offices.size() > 0) {
			for (Office office : offices) {
				Region region = new Region();
				region.setCode(office.getId());
				region.setName(office.getName());
				regionList.add(region);
			}
		}
		return regionList;
	}

	@Override
	public Map<String, Object> selectWarnArea() {
		Map<String, Object> result = new HashMap<String, Object>();
		List<Region> provinceList = new ArrayList<Region>();
		Example example = new Example(Area.class);
		example.createCriteria().andEqualTo("pId", "0");
		List<Area> provinces = areaMapper.selectByExample(example);
		if (provinces != null && provinces.size() > 0) {
			for (Area area_province : provinces) {
				Region province = new Region();
				province.setCode(area_province.getId());
				province.setName(area_province.getName());
				provinceList.add(province);
			}
		}
		result.put("region", provinceList);
		return result;
	}

	@Override
	public EnterpriseInfo abnormalEnterprises(BasicConditionInfo basicConditionInfo, int currentPage, int numPerPage) {
		int start = (currentPage - 1) * numPerPage;
		int size = numPerPage;
		StringBuffer whereSql = new StringBuffer("");
		if (!"".equals(basicConditionInfo.getTaxStation()) && basicConditionInfo.getTaxStation() != null) {
			whereSql.append(" and abnomal.office_code = '"+basicConditionInfo.getTaxStation()+"' ");
		} else {
			String bltRegion = basicConditionInfo.getBltRegion();
			String[] address = bltRegion.split(",");
			if (address.length == 2) {
				whereSql.append(" and abnomal.region_code = '"+address[1]+"' ");
			} else {
				String provinceCode = address[0].substring(0,2);
				whereSql.append(" and abnomal.region_code like '"+provinceCode+"%' "); 
			}
		}
		if (!"".equals(basicConditionInfo.getFenceState()) && basicConditionInfo.getFenceState() != null) {
			whereSql.append(" and abnomal.f_status = "+basicConditionInfo.getFenceState()+" ");
		}
		if (!"".equals(basicConditionInfo.getWarnAddress()) && basicConditionInfo.getWarnAddress() != null) {
			String warnAddress = basicConditionInfo.getWarnAddress();
			String[] warnAddrs = warnAddress.split(",");
			String warnPrefix = warnAddrs[0].substring(0, 2);
			whereSql.append(" and abnomal.warn_area = '"+warnPrefix+"' ");
		}
		if (basicConditionInfo.getTaxPayer() != null) {
			whereSql.append(" and abnomal.type = "+basicConditionInfo.getTaxPayer()+" ");
		}
		if (!"".equals(basicConditionInfo.getCompanyName()) && basicConditionInfo.getCompanyName() != null) {
			Pattern pattern = Pattern.compile("[0-9]");
			String complanyName = basicConditionInfo.getCompanyName();
			Matcher matcher = pattern.matcher(complanyName.charAt(0)+"");
			if(matcher.find()){
				whereSql.append(" AND  abnomal.tax_num LIKE '"+basicConditionInfo.getCompanyName().trim()+"%' ");
			}else{
				whereSql.append(" and abnomal.company_name = '"+basicConditionInfo.getCompanyName().trim()+"' ");
			}
		}
		if (!"".equals(basicConditionInfo.getMacAddress()) && basicConditionInfo.getMacAddress() != null) {
			whereSql.append(" and abnomal.mac = '"+basicConditionInfo.getMacAddress()+"' ");
		}
		if (!"".equals(basicConditionInfo.getWarnStartTime()) && basicConditionInfo.getWarnStartTime() != null
				&& !"".equals(basicConditionInfo.getWarnEndTime()) && basicConditionInfo.getWarnEndTime() != null) {
			whereSql.append(" and date_format(abnomal.warn_time,'%Y-%m-%d %H:%i') >= '"+basicConditionInfo.getWarnStartTime()+"' and  date_format(abnomal.warn_time,'%Y-%m-%d %H:%i') <= '"+basicConditionInfo.getWarnEndTime()+"' ");
		}
		List<EnterpriseInfo> enterpriseInfoList = abnormalInfoMapper.selectEnterpriseInfoList(whereSql.toString(), start, size);
		// 修改状态为中文
		modifyStatusCh(enterpriseInfoList);
		EnterpriseInfo info = new EnterpriseInfo();
		info.setList(enterpriseInfoList);
		info.setaCount(abnormalInfoMapper.selectEnterpriseInfoCount(whereSql.toString()));
		if (enterpriseInfoList != null && enterpriseInfoList.size() > 0) {
			for (EnterpriseInfo conplanyInfo : enterpriseInfoList) {
				String regionName = getRegionInfo(conplanyInfo.getRegion());
				conplanyInfo.setRegion(regionName);
				String[] allowRegion = conplanyInfo.getAllowRegion().split(",");
				StringBuffer buffer = new StringBuffer();
				if (allowRegion != null && allowRegion.length > 0) {
					for (int i = 0; i < allowRegion.length; i++) {
						String provinceName = getRegionInfoByAreaCode(allowRegion[i]);
						if (i == allowRegion.length - 1) {
							buffer.append(provinceName);
						} else {
							buffer.append(provinceName).append(",");
						}
					}
				}
				conplanyInfo.setAllowRegion(buffer.toString());
				String fenceProvinceName = getRegionInfoByAreaCode(conplanyInfo.getRecRegion());
				conplanyInfo.setRecRegion(fenceProvinceName);
			}
		}
		return info;
	}
	
	private void modifyStatusCh(List<EnterpriseInfo> enterpriseInfoList) {
		if (enterpriseInfoList != null && enterpriseInfoList.size() > 0) {
			for (EnterpriseInfo complanyInfo : enterpriseInfoList) {
				if (complanyInfo.getTaxPayer() == 1) {
					complanyInfo.setTaxPayerStatusCh("一般纳税人");
				} else if(complanyInfo.getTaxPayer() == 0){
					complanyInfo.setTaxPayerStatusCh("小规模纳税人");
				}else{
					complanyInfo.setTaxPayerStatusCh("全部");
				}
				if (complanyInfo.getComState() == 0) {
					complanyInfo.setEnterpriseStatusCh("锁定");
				}
				if (complanyInfo.getFence() == 0) {
					complanyInfo.setFenceStatusCh("异地开票");
				} else {
					complanyInfo.setFenceStatusCh("异地报备");
				}
			}
		}
	}
	
	// 根据企业所属地6位域获取省市区的中文
	private String getRegionInfo(String region) {
		if (null == region || region.length() != 6) {
			return "非法区域码";
		}
		String cityregion = region.substring(0, 4);
		String provinceregion = region.substring(0, 2);
		String provincerRegion = provinceregion + "0000";
		String cityRegion = cityregion + "00";
		StringBuffer buffer = new StringBuffer();
		if (regionMap.get(provincerRegion) != null) {
			buffer.append(regionMap.get(provincerRegion));
		}
		if (regionMap.get(cityRegion) != null) {
			buffer.append(regionMap.get(cityRegion));
		}
		/*if (regionMap.get(countryregion) != null) {
			buffer.append(regionMap.get(countryregion));
		}*/
		return buffer.toString();
	}
	
	// 根据允许开票区域以及预警地址 2位省代码 域获取省的中文
	private  String getRegionInfoByAreaCode(String region) {
		if (null == region || region.length() != 2) {
			return "非法区域码";
		}
		String provinceregion = region + "0000";
		StringBuffer buffer = new StringBuffer();
		if (regionMap.get(provinceregion) != null) {
			buffer.append(regionMap.get(provinceregion));
		}
		return buffer.toString();
	}
	
}
