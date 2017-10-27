package cn.com.jwy.enums.sys.user;

public enum UserTypeEnum {
	
	USERTYPE_XTGLY((short) 1, "系统管理员"),
	USERTYPE_YHGLY((short) 2, "用户管理员"),
	USERTYPE_PTYH((short) 3, "普通用户");
	
	private short key;
	private String value;
	
	UserTypeEnum(short key, String value) {
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
		for (UserTypeEnum userTypeEnum : UserTypeEnum.values()) {
			if (userTypeEnum.key == key) {
				return userTypeEnum.value;
			}
		}
		return "";
	}
	
}
