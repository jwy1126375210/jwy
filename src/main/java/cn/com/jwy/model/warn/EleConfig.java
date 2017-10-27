/*
 * 文件名称：EleConfig.java
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
@Table(name="tb_ele_config")
public class EleConfig extends BaseStringEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public EleConfig() {}
	public EleConfig(String regionCode,String regionName,Date createTime) {
		this.regionCode=regionCode;
		this.regionName=regionName;
		this.createTime=createTime;
	}
	public EleConfig setNotNull(String regionCode,Date createTime) {
		this.regionCode=regionCode;
		this.createTime=createTime;
		return this;
	}
	/**属性**/
	@Column(name = "region_code")
	private String regionCode;// 开通区域,主键（非空） 
	@Column(name = "region_name")
	private String regionName;// 区域名称
	@Column(name = "create_time")
	private Date createTime;// 创建时间（非空） 

	/**属性Get、Set函数**/
	public String getRegionCode() {
		return regionCode;
	}
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	public String getRegionName() {
		return regionName;
	}
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}