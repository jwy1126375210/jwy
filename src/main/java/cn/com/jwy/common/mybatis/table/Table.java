package cn.com.jwy.common.mybatis.table;

import java.util.List;

public class Table {
	
	private String name;// 琛ㄥ悕
	private String bean;// javaBean鐨勫悕绉�
	private String comment;// 琛ㄦ敞瑙�
	private String idType;// id绫诲瀷
	
	private List<TableColumn> columns;// 琛ㄥ瓧娈�
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public List<TableColumn> getColumns() {
		return columns;
	}
	public void setColumns(List<TableColumn> columns) {
		this.columns = columns;
	}
	public String getBean() {
		return bean;
	}
	public void setBean(String bean) {
		this.bean = bean;
	}
	public String getIdType() {
		return idType;
	}
	public void setIdType(String idType) {
		this.idType = idType;
	}
}
