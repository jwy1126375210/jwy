package cn.com.jwy.enums.sys.menu;

public enum MenuTypeEnum {
	
	MENUTYPE_CD((short) 1, "菜单"),
	MENUTYPE_GN((short) 2, "功能");
	
	private short key;
	private String value;
	
	MenuTypeEnum(short key, String value) {
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
		for (MenuTypeEnum menuTypeEnum : MenuTypeEnum.values()) {
			if (menuTypeEnum.key == key) {
				return menuTypeEnum.value;
			}
		}
		return "";
	}
	
}
