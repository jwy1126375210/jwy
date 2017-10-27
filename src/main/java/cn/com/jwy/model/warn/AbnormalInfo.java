/*
 * 文件名称：AbnormalInfo.java
 */
package cn.com.jwy.model.warn;

import javax.persistence.Table;

import cn.com.jwy.common.mybatis.bean.BaseStringEntity;

import java.util.Date;

import javax.persistence.Column;


/**
 * 名称：
 * 模块描述：数据库表对应实体类
 * 作者：系统自动生成
 */
@Table(name="tb_abnormal_info")
public class AbnormalInfo extends BaseStringEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public AbnormalInfo() {}
	public AbnormalInfo(String id,String taxNum,String companyName,String regionCode,String extNum,Integer type,String grantRegion,String warnArea,String officeCode,String officeName,Integer status,Integer fStatus,Date warnTime,String mac) {
		this.id=id;
		this.taxNum=taxNum;
		this.companyName=companyName;
		this.regionCode=regionCode;
		this.extNum=extNum;
		this.type=type;
		this.grantRegion=grantRegion;
		this.warnArea=warnArea;
		this.officeCode=officeCode;
		this.officeName=officeName;
		this.status=status;
		this.fStatus=fStatus;
		this.warnTime=warnTime;
		this.mac=mac;
	}
	public AbnormalInfo setNotNull(String id,String taxNum,String companyName,String extNum,Integer type,String warnArea,String officeCode,Integer status,Integer fStatus,Date warnTime) {
		this.id=id;
		this.taxNum=taxNum;
		this.companyName=companyName;
		this.extNum=extNum;
		this.type=type;
		this.warnArea=warnArea;
		this.officeCode=officeCode;
		this.status=status;
		this.fStatus=fStatus;
		this.warnTime=warnTime;
		return this;
	}
	/**属性**/
	@Column(name = "tax_num")
	private String taxNum;// 税号（非空） 
	@Column(name = "company_name")
	private String companyName;// 企业名称（非空） 
	@Column(name = "region_code")
	private String regionCode;// 所属区域码
	@Column(name = "ext_num")
	private String extNum;// 分机号（非空） 
	@Column(name = "type")
	private Integer type;// 纳税人标识（非空） 
	@Column(name = "grant_region")
	private String grantRegion;// 授权开票区域
	@Column(name = "warn_area")
	private String warnArea;// 预警区域（非空） 
	@Column(name = "office_code")
	private String officeCode;// 税务机关代码（非空） 
	@Column(name = "office_name")
	private String officeName;// 税务机关名称
	@Column(name = "status")
	private Integer status;// 企业状态（非空） 
	@Column(name = "f_status")
	private Integer fStatus;// 围栏状态（非空） 
	@Column(name = "warn_time")
	private Date warnTime;// 预警时间（非空） 
	@Column(name = "mac")
	private String mac;// mac地址

	/**属性Get、Set函数**/
	public String getTaxNum() {
		return taxNum;
	}
	public void setTaxNum(String taxNum) {
		this.taxNum = taxNum;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getRegionCode() {
		return regionCode;
	}
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	public String getExtNum() {
		return extNum;
	}
	public void setExtNum(String extNum) {
		this.extNum = extNum;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getGrantRegion() {
		return grantRegion;
	}
	public void setGrantRegion(String grantRegion) {
		this.grantRegion = grantRegion;
	}
	public String getWarnArea() {
		return warnArea;
	}
	public void setWarnArea(String warnArea) {
		this.warnArea = warnArea;
	}
	public String getOfficeCode() {
		return officeCode;
	}
	public void setOfficeCode(String officeCode) {
		this.officeCode = officeCode;
	}
	public String getOfficeName() {
		return officeName;
	}
	public void setOfficeName(String officeName) {
		this.officeName = officeName;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getFStatus() {
		return fStatus;
	}
	public void setFStatus(Integer fStatus) {
		this.fStatus = fStatus;
	}
	public Date getWarnTime() {
		return warnTime;
	}
	public void setWarnTime(Date warnTime) {
		this.warnTime = warnTime;
	}
	public String getMac() {
		return mac;
	}
	public void setMac(String mac) {
		this.mac = mac;
	}

}