/*
 * 文件名称：UserOffice.java
 */
package cn.com.jwy.model.sys;

import javax.persistence.Table;

import java.io.Serializable;

import javax.persistence.Column;

/**
 * 名称：
 * 模块描述：数据库表对应实体类
 * 作者：系统自动生成
 */
@Table(name="sys_user_office")
public class UserOffice implements Serializable {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public UserOffice() {}
	public UserOffice(Integer userId,String areaId,String areaName,String officeId,String officeName) {
		this.userId=userId;
		this.areaId=areaId;
		this.areaName=areaName;
		this.officeId=officeId;
		this.officeName=officeName;
	}
	public UserOffice setNotNull(Integer userId,String officeId) {
		this.userId=userId;
		this.officeId=officeId;
		return this;
	}
	/**属性**/
	@Column(name = "user_id")
	private Integer userId;// 用户id（非空） 
	@Column(name = "area_id")
	private String areaId;// 区域id(冗余)
	@Column(name = "area_name")
	private String areaName;// 区域名称(冗余)
	@Column(name = "office_id")
	private String officeId;// 税局id（非空） 
	@Column(name = "office_name")
	private String officeName;// 税局名称(冗余)

	/**属性Get、Set函数**/
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
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