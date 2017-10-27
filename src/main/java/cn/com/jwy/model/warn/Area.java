/*
 * 文件名称：Area.java
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
@Table(name="tb_area")
public class Area extends BaseStringEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public Area() {}
	public Area(String id,String name,Integer type,String pId) {
		this.id=id;
		this.name=name;
		this.type=type;
		this.pId=pId;
	}
	public Area setNotNull(String id,String name,Integer type,String pId) {
		this.id=id;
		this.name=name;
		this.type=type;
		this.pId=pId;
		return this;
	}
	/**属性**/
	@Column(name = "name")
	private String name;// 区域名称（非空） 
	@Column(name = "type")
	private Integer type;// 级别（非空） 
	@Column(name = "p_id")
	private String pId;// 父级编码（非空） 

	/**属性Get、Set函数**/
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getPId() {
		return pId;
	}
	public void setPId(String pId) {
		this.pId = pId;
	}

}