package cn.com.jwy.enums.common;

public enum DelEnum {
	
	DEL_YES((short) 1, "是"),
	DEL_NO((short) 0, "否");

	private short key;
	private String value;
	
	DelEnum(short key, String value) {
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
		for (DelEnum delEnum : DelEnum.values()) {
			if (delEnum.key == key) {
				return delEnum.value;
			}
		}
		return "";
	}
	
}
