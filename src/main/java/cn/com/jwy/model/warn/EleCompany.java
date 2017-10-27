/*
 * 文件名称：EleCompany.java
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
@Table(name="tb_ele_company")
public class EleCompany extends BaseStringEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public EleCompany() {}
	public EleCompany(String id,String taxNum,String extNum,String companyName,String companyAddr,String officeCode,String officeName,Integer type,Integer source,String grantRegion,Date createTime,Date modifyTime) {
		this.id=id;
		this.taxNum=taxNum;
		this.extNum=extNum;
		this.companyName=companyName;
		this.companyAddr=companyAddr;
		this.officeCode=officeCode;
		this.officeName=officeName;
		this.type=type;
		this.source=source;
		this.grantRegion=grantRegion;
		this.createTime=createTime;
		this.modifyTime=modifyTime;
	}
	public EleCompany setNotNull(String id,String taxNum,String extNum,String companyName,String officeCode,Integer type,Integer source,Date createTime,Date modifyTime) {
		this.id=id;
		this.taxNum=taxNum;
		this.extNum=extNum;
		this.companyName=companyName;
		this.officeCode=officeCode;
		this.type=type;
		this.source=source;
		this.createTime=createTime;
		this.modifyTime=modifyTime;
		return this;
	}
	/**属性**/
	@Column(name = "tax_num")
	private String taxNum;// 税号（非空） 
	@Column(name = "ext_num")
	private String extNum;// 分机号（非空） 
	@Column(name = "company_name")
	private String companyName;// 企业名称（非空） 
	@Column(name = "company_addr")
	private String companyAddr;// 企业地址
	@Column(name = "office_code")
	private String officeCode;// 税务机关代码（非空） 
	@Column(name = "office_name")
	private String officeName;// 税务机关名称
	@Column(name = "type")
	private Integer type;// 纳税人标识（非空） 
	@Column(name = "source")
	private Integer source;// （非空） 
	@Column(name = "grant_region")
	private String grantRegion;// 授权开票区域
	@Column(name = "create_time")
	private Date createTime;// 创建时间（非空） 
	@Column(name = "modify_time")
	private Date modifyTime;// 修改时间（非空） 

	/**属性Get、Set函数**/
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
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getCompanyAddr() {
		return companyAddr;
	}
	public void setCompanyAddr(String companyAddr) {
		this.companyAddr = companyAddr;
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
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getSource() {
		return source;
	}
	public void setSource(Integer source) {
		this.source = source;
	}
	public String getGrantRegion() {
		return grantRegion;
	}
	public void setGrantRegion(String grantRegion) {
		this.grantRegion = grantRegion;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

}