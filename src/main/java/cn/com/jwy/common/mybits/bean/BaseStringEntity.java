package cn.com.jwy.common.mybits.bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Id;

public class BaseStringEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Id
    @Column(name = "id")
	protected String id;
    
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}