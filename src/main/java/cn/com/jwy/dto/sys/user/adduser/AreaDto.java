package cn.com.jwy.dto.sys.user.adduser;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class AreaDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private String areaId;// 区域id
	private String areaName;// 区域名称
	private List<OfficeDto> offices = new ArrayList<OfficeDto>();// 所选税务机关
	
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public List<OfficeDto> getOffices() {
		return offices;
	}
	public void setOffices(List<OfficeDto> offices) {
		this.offices = offices;
	}
	
}
