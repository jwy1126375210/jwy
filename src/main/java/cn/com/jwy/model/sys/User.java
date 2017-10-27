/*
 * 文件名称：User.java
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
@Table(name="sys_user")
public class User extends BaseIntegerEntity {
	private static final long serialVersionUID = 1L;
	
	/**构造函数**/
	public User() {}
	public User(Integer id,Integer idNo,String username,String password,Short userType,String realName,String phone,String email,String remark,Short isValid,Integer addUser,Date addTime,Integer editUser,Date editTime,Short del) {
		this.id=id;
		this.idNo=idNo;
		this.username=username;
		this.password=password;
		this.userType=userType;
		this.realName=realName;
		this.phone=phone;
		this.email=email;
		this.remark=remark;
		this.isValid=isValid;
		this.addUser=addUser;
		this.addTime=addTime;
		this.editUser=editUser;
		this.editTime=editTime;
		this.del=del;
	}
	public User setNotNull(Integer id,Integer idNo,String username,String password,Short userType,String phone,Short isValid,Short del) {
		this.id=id;
		this.idNo=idNo;
		this.username=username;
		this.password=password;
		this.userType=userType;
		this.phone=phone;
		this.isValid=isValid;
		this.del=del;
		return this;
	}
	/**属性**/
	@Column(name = "id_no")
	private Integer idNo;// 用户ID（非空） 
	@Column(name = "username")
	private String username;// 用户名（非空） 
	@Column(name = "password")
	private String password;// 密码（非空） 
	@Column(name = "user_type")
	private Short userType;// 用户类型(1-系统管理员,2-用户管理员,3-普通用户)（非空） 
	@Column(name = "real_name")
	private String realName;// 真实姓名
	@Column(name = "phone")
	private String phone;// 手机号（非空） 
	@Column(name = "email")
	private String email;// 电子邮箱
	@Column(name = "remark")
	private String remark;// 备注
	@Column(name = "is_valid")
	private Short isValid;// 是否有效(1-启用,0-禁用)（非空） 
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

}