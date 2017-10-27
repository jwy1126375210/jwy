/*
 * 文件名称：UserMenu.java
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
@Table(name="sys_user_menu")
public class UserMenu implements Serializable {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public UserMenu() {}
	public UserMenu(Integer userId,Integer menuId) {
		this.userId=userId;
		this.menuId=menuId;
	}
	public UserMenu setNotNull(Integer userId,Integer menuId) {
		this.userId=userId;
		this.menuId=menuId;
		return this;
	}
	/**属性**/
	@Column(name = "user_id")
	private Integer userId;// 用户id（非空） 
	@Column(name = "menu_id")
	private Integer menuId;// 权限id（非空） 

	/**属性Get、Set函数**/
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Integer getMenuId() {
		return menuId;
	}
	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

}