package cn.com.jwy.enums.sys.menu;

public enum AdminTypeEnum {
	
	ADMINTYPE_YES((short) 1, "是"),
	ADMINTYPE_NO((short) 0, "否");
	
	private short key;
	private String value;
	
	AdminTypeEnum(short key, String value) {
		this.key = key;
		this.value = value;
	}
	
	public short getKey() {
		return key;
	}

	public String getValue() {
		return value;
	}

	public static String getValue(short key) {
		for (AdminTypeEnum adminTypeEnum : AdminTypeEnum.values()) {
			if (adminTypeEnum.key == key) {
				return adminTypeEnum.value;
			}
		}
		return "";
	}

}
