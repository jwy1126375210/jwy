package cn.com.jwy.dto.warn;

import java.io.Serializable;
import java.util.List;

public class EnterpriseInfo implements Serializable{

	private static final long serialVersionUID = 1L;
	//id
	private String id;
	//企业所属地址
	private String region;
	//所属税务机关
	private String taxStation;
	//企业名称
	private String companyName;
	//纳税人标识
	private int taxPayer;
	//税号
	private String taxNum;
	//分机号
	private String extNum;
	//允许开票区域
	private String allowRegion;
	//预警区域
	private String recRegion;
	//围栏状态
	private int fence;
	//企业状态
	private int comState;
	//纳税人标识中文
	private String taxPayerStatusCh;
	//围栏状态中文
	private String fenceStatusCh;
	//企业状态中文
	private String enterpriseStatusCh;
	//总共的数据
	private int aCount;
	//结果集存放List
	private List<EnterpriseInfo> list;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getRegion() {
		return region;
	}
	public void setRegion(String region) {
		this.region = region;
	}
	public String getTaxStation() {
		return taxStation;
	}
	public void setTaxStation(String taxStation) {
		this.taxStation = taxStation;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public int getTaxPayer() {
		return taxPayer;
	}
	public void setTaxPayer(int taxPayer) {
		this.taxPayer = taxPayer;
	}
	public String getTaxNum() {
		return taxNum;
	}
	public void setTaxNum(String taxNum) {
		this.taxNum = taxNum;
	}
	public String getExtNum() {
		return extNum;
	}
	public void setExtNum(String extNum) {
		this.extNum = extNum;
	}
	public String getAllowRegion() {
		return allowRegion;
	}
	public void setAllowRegion(String allowRegion) {
		this.allowRegion = allowRegion;
	}
	public String getRecRegion() {
		return recRegion;
	}
	public void setRecRegion(String recRegion) {
		this.recRegion = recRegion;
	}
	public int getFence() {
		return fence;
	}
	public void setFence(int fence) {
		this.fence = fence;
	}
	public int getComState() {
		return comState;
	}
	public void setComState(int comState) {
		this.comState = comState;
	}
	public String getTaxPayerStatusCh() {
		return taxPayerStatusCh;
	}
	public void setTaxPayerStatusCh(String taxPayerStatusCh) {
		this.taxPayerStatusCh = taxPayerStatusCh;
	}
	public String getFenceStatusCh() {
		return fenceStatusCh;
	}
	public void setFenceStatusCh(String fenceStatusCh) {
		this.fenceStatusCh = fenceStatusCh;
	}
	public String getEnterpriseStatusCh() {
		return enterpriseStatusCh;
	}
	public void setEnterpriseStatusCh(String enterpriseStatusCh) {
		this.enterpriseStatusCh = enterpriseStatusCh;
	}
	public List<EnterpriseInfo> getList() {
		return list;
	}
	public void setList(List<EnterpriseInfo> list) {
		this.list = list;
	}
	public int getaCount() {
		return aCount;
	}
	public void setaCount(int aCount) {
		this.aCount = aCount;
	}
}
