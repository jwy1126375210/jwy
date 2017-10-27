package cn.com.jwy.dto.sys.user.adduser;

import java.io.Serializable;

public class MenuDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private Integer menuId;// 功能权限id
	private String menuName;// 功能权限名称
	
	public Integer getMenuId() {
		return menuId;
	}
	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	
}
