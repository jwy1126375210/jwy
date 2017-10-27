package cn.com.jwy.dto.warn;

import java.io.Serializable;

public class BasicConditionInfo implements Serializable{

	private static final long serialVersionUID = 2581848927239752734L;
	
	//企业所属地
	private String bltRegion;
	//搜索关键词
	private String companyName;
	//税务机关
	private String taxStation;
	//围栏状态
	private Integer fenceState;
	//纳税人标识
	private Integer taxPayer;
	//企业状态
	private Integer companyState;
	//预警地址
	private String warnAddress;
	//预警开始时间
	private String warnStartTime;
	//预警结束时间
	private String warnEndTime;
	//MAC机器号
	private String macNum;
	//MAC地址
	private String macAddress;
	
	public String getBltRegion() {
		return bltRegion;
	}
	public void setBltRegion(String bltRegion) {
		this.bltRegion = bltRegion;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getTaxStation() {
		return taxStation;
	}
	public void setTaxStation(String taxStation) {
		this.taxStation = taxStation;
	}
	public Integer getFenceState() {
		return fenceState;
	}
	public void setFenceState(Integer fenceState) {
		this.fenceState = fenceState;
	}
	public Integer getTaxPayer() {
		return taxPayer;
	}
	public void setTaxPayer(Integer taxPayer) {
		this.taxPayer = taxPayer;
	}
	public Integer getCompanyState() {
		return companyState;
	}
	public void setCompanyState(Integer companyState) {
		this.companyState = companyState;
	}
	public String getWarnAddress() {
		return warnAddress;
	}
	public void setWarnAddress(String warnAddress) {
		this.warnAddress = warnAddress;
	}
	public String getWarnStartTime() {
		return warnStartTime;
	}
	public void setWarnStartTime(String warnStartTime) {
		this.warnStartTime = warnStartTime;
	}
	public String getWarnEndTime() {
		return warnEndTime;
	}
	public void setWarnEndTime(String warnEndTime) {
		this.warnEndTime = warnEndTime;
	}
	public String getMacNum() {
		return macNum;
	}
	public void setMacNum(String macNum) {
		this.macNum = macNum;
	}
	public String getMacAddress() {
		return macAddress;
	}
	public void setMacAddress(String macAddress) {
		this.macAddress = macAddress;
	}
	
	
	
}
