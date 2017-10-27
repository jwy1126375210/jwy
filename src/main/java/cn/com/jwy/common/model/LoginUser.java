package cn.com.jwy.common.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import cn.com.jwy.model.sys.Menu;

public class LoginUser implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private Integer id;// id
	private Integer idNo;// 用户ID（非空） 
	private String username;// 用户名（非空） 
	private String password;// 密码（非空） 
	private Short userType;// 用户类型(1-系统管理员,2-用户管理员,3-普通用户)（非空） 
	private String realName;// 真实姓名
	private String phone;// 手机号（非空） 
	private String email;// 电子邮箱
	private String remark;// 备注
	private Short isValid;// 是否有效(1-启用,0-禁用)（非空） 
	private Integer addUser;// 创建人
	private Date addTime;// 创建时间
	private Integer editUser;// 修改人
	private Date editTime;// 修改时间
	private Short del;// 是否删除(1-是,0-否)（非空） 
	
	private List<Menu> menus;// 用户拥有的功能权限
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getIdNo() {
		return idNo;
	}
	public void setIdNo(Integer idNo) {
		this.idNo = idNo;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Short getUserType() {
		return userType;
	}
	public void setUserType(Short userType) {
		this.userType = userType;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Short getIsValid() {
		return isValid;
	}
	public void setIsValid(Short isValid) {
		this.isValid = isValid;
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
	public List<Menu> getMenus() {
		return menus;
	}
	public void setMenus(List<Menu> menus) {
		this.menus = menus;
	}
	
}
