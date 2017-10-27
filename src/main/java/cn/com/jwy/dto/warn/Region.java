package cn.com.jwy.dto.warn;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Region implements Serializable{
	private static final long serialVersionUID = 1L;
	
	//区域编码
	private String code;
	//区域名字
	private String name;
	//城市
	private List<Region> city = new ArrayList<>();
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Region> getCity() {
		return city;
	}
	public void setCity(List<Region> city) {
		this.city = city;
	}
	@Override
	public String toString() {
		return "Region [code=" + code + ", name=" + name + ", city=" + city + "]";
	}
	
}
