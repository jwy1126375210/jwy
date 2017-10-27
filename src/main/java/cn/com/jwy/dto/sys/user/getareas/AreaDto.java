package cn.com.jwy.dto.sys.user.getareas;

import java.io.Serializable;
import java.util.List;

public class AreaDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String id;// id
	private String name;// 区域名称（非空） 
	private Integer type;// 级别（非空） 
	private String pId;// 父级编码（非空） 
	
	private List<AreaDto> childrens;// 下级区域
	private boolean checked;// 是否已选中
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
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
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	public List<AreaDto> getChildrens() {
		return childrens;
	}
	public void setChildrens(List<AreaDto> childrens) {
		this.childrens = childrens;
	}
	public boolean isChecked() {
		return checked;
	}
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	
}
