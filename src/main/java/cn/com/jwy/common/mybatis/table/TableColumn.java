package cn.com.jwy.common.mybatis.table;

public class TableColumn {
	
	private String name;// 琛ㄥ瓧娈�
	private String property;// 瀵瑰簲javaBean灞炴�鍚嶇О
	private String type;// 绫诲瀷
	private String caption;// 鎻忚堪
	private int length;// 绫诲瀷闀垮害
	private int digits;// 灏忔暟鐐归暱搴�
	private boolean notnull;// 鏄惁涓虹┖

	public String getCaption() {
		return caption;
	}
	public void setCaption(String caption) {
		this.caption = caption;
	}
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	public int getDigits() {
		return digits;
	}
	public void setDigits(int digits) {
		this.digits = digits;
	}
	public boolean isNotnull() {
		return notnull;
	}
	public void setNotnull(boolean notnull) {
		this.notnull = notnull;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getProperty() {
		return property;
	}
	public void setProperty(String property) {
		this.property = property;
	}
}
