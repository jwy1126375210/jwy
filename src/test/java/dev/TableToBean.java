package dev;

import cn.com.jwy.common.mybatis.TableUtils;

/**
 * 表结构转换成实体类
 */
public class TableToBean {
	
	public static void main(String[] args) {
		TableUtils.runToBean("jdbc:mysql://localhost:3306/jiangwenyu", "root", "", "cn.com.jwy", "sys", "sys_*", 1);
	}
}
