package cn.com.jwy.dto.sys.user.getoffices;

import java.io.Serializable;

public class OfficeDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String id;// id
	private String name;// 税务机关名称
	private String shortName;// 税务机关名称简写
	private String pId;// 父级编码
	private String areaId;// 所属区域
	
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

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getpId() {
		return pId;
	}

	public void setpId(String pId) {
		this.pId = pId;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	
}
