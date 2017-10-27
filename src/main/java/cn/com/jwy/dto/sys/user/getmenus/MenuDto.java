package cn.com.jwy.dto.sys.user.getmenus;

import java.io.Serializable;
import java.util.List;

public class MenuDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private Integer id;// id
	private String menuName;// 菜单名称
	private Short menuType;// 权限类型(1-菜单,2-功能)
	private Integer pid;// 父级菜单id
	private Integer sort;// 排序
	private String remark;// 备注
	
	private List<MenuDto> childrens;// 下级菜单
	private boolean alone;// 是否是修改的用户单独拥有的权限
	private boolean checked;// 是否已选中
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
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
	public List<MenuDto> getChildrens() {
		return childrens;
	}
	public void setChildrens(List<MenuDto> childrens) {
		this.childrens = childrens;
	}
	public boolean isAlone() {
		return alone;
	}
	public void setAlone(boolean alone) {
		this.alone = alone;
	}
	public boolean isChecked() {
		return checked;
	}
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	
}
