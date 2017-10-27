/*
 * 文件名称：Office.java
 */
package cn.com.jwy.model.warn;

import javax.persistence.Table;

import cn.com.jwy.common.mybatis.bean.BaseStringEntity;

import javax.persistence.Column;


/**
 * 名称：
 * 模块描述：数据库表对应实体类
 * 作者：系统自动生成
 */
@Table(name="tb_office")
public class Office extends BaseStringEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public Office() {}
	public Office(String id,String name,String shortName,String pId,String areaId) {
		this.id=id;
		this.name=name;
		this.shortName=shortName;
		this.pId=pId;
		this.areaId=areaId;
	}
	public Office setNotNull(String id,String name,String pId,String areaId) {
		this.id=id;
		this.name=name;
		this.pId=pId;
		this.areaId=areaId;
		return this;
	}
	/**属性**/
	@Column(name = "name")
	private String name;// 税务机关名称（非空） 
	@Column(name = "short_name")
	private String shortName;// 税务机关名称简写
	@Column(name = "p_id")
	private String pId;// 父级编码（非空） 
	@Column(name = "area_id")
	private String areaId;// 所属区域（非空） 

	/**属性Get、Set函数**/
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	public String getPId() {
		return pId;
	}
	public void setPId(String pId) {
		this.pId = pId;
	}
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

}