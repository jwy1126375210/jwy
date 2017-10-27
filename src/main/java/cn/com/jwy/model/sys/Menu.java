/*
 * 文件名称：Menu.java
 */
package cn.com.jwy.model.sys;

import javax.persistence.Table;

import cn.com.jwy.common.mybatis.bean.BaseIntegerEntity;

import javax.persistence.Column;

import java.util.Date;

/**
 * 名称：
 * 模块描述：数据库表对应实体类
 * 作者：系统自动生成
 */
@Table(name="sys_menu")
public class Menu extends BaseIntegerEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public Menu() {}
	public Menu(Integer id,String menuName,Short menuType,String url,String authority,Integer pid,Integer sort,String remark,Short adminType,Integer addUser,Date addTime,Integer editUser,Date editTime,Short del) {
		this.id=id;
		this.menuName=menuName;
		this.menuType=menuType;
		this.url=url;
		this.authority=authority;
		this.pid=pid;
		this.sort=sort;
		this.remark=remark;
		this.adminType=adminType;
		this.addUser=addUser;
		this.addTime=addTime;
		this.editUser=editUser;
		this.editTime=editTime;
		this.del=del;
	}
	public Menu setNotNull(Integer id,String menuName,Short menuType,Short adminType,Short del) {
		this.id=id;
		this.menuName=menuName;
		this.menuType=menuType;
		this.adminType=adminType;
		this.del=del;
		return this;
	}
	/**属性**/
	@Column(name = "menu_name")
	private String menuName;// 菜单名称（非空） 
	@Column(name = "menu_type")
	private Short menuType;// 权限类型(1-菜单,2-功能)（非空） 
	@Column(name = "url")
	private String url;// 菜单路径
	@Column(name = "authority")
	private String authority;// 菜单权限
	@Column(name = "pid")
	private Integer pid;// 父级菜单id
	@Column(name = "sort")
	private Integer sort;// 排序
	@Column(name = "remark")
	private String remark;// 备注
	@Column(name = "admin_type")
	private Short adminType;// 用户管理员默认拥有的权限(1-是,0-否)（非空） 
	@Column(name = "add_user")
	private Integer addUser;// 创建人
	@Column(name = "add_time")
	private Date addTime;// 创建时间
	@Column(name = "edit_user")
	private Integer editUser;// 修改人
	@Column(name = "edit_time")
	private Date editTime;// 修改时间
	@Column(name = "del")
	private Short del;// 是否删除(1-是,0-否)（非空） 

	/**属性Get、Set函数**/
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public Short getMenuType() {
		return menuType;
	}
	public void setMenuType(Short menuType) {
		this.menuType = menuType;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getAuthority() {
		return authority;
	}
	public void setAuthority(String authority) {
		this.authority = authority;
	}
	public Integer getPid() {
		return pid;
	}
	public void setPid(Integer pid) {
		this.pid = pid;
	}
	public Integer getSort() {
		return sort;
	}
	public void setSort(Integer sort) {
		this.sort = sort;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Short getAdminType() {
		return adminType;
	}
	public void setAdminType(Short adminType) {
		this.adminType = adminType;
	}
	public Integer getAddUser() {
		return addUser;
	}
	public void setAddUser(Integer addUser) {
		this.addUser = addUser;
	}
	public Date getAddTime() {
		return addTime;
	}
	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
	public Integer getEditUser() {
		return editUser;
	}
	public void setEditUser(Integer editUser) {
		this.editUser = editUser;
	}
	public Date getEditTime() {
		return editTime;
	}
	public void setEditTime(Date editTime) {
		this.editTime = editTime;
	}
	public Short getDel() {
		return del;
	}
	public void setDel(Short del) {
		this.del = del;
	}

}