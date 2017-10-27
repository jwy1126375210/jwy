package cn.com.jwy.enums.common;

public enum IsValidEnum {
	
	ISVALID_QY((short) 1, "启用"),
	ISVALID_JY((short) 0, "禁用");
	
	private short key;
	private String value;
	
	IsValidEnum(short key, String value) {
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
		for (IsValidEnum isValidEnum : IsValidEnum.values()) {
			if (isValidEnum.key == key) {
				return isValidEnum.value;
			}
		}
		return "";
	}

}
