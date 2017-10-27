package cn.com.jwy.dto.sys.user.adduser;

import java.io.Serializable;

public class OfficeDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String officeId;// 税务机关id
	private String officeName;// 税务机关名称
	
	public String getOfficeId() {
		return officeId;
	}
	public void setOfficeId(String officeId) {
		this.officeId = officeId;
	}
	public String getOfficeName() {
		return officeName;
	}
	public void setOfficeName(String officeName) {
		this.officeName = officeName;
	}
	
}
