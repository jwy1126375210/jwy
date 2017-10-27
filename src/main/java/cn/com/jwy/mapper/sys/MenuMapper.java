/*
 * 文件名称：MenuMapper.java
 */
package cn.com.jwy.mapper.sys;

import java.util.List;

import cn.com.jwy.common.mybatis.bean.MyMapper;
import cn.com.jwy.model.sys.Menu;

/**
 * 名称：
 * 模块描述：数据库表对应dao操作类
 * 作者：系统自动生成
 */
public interface MenuMapper extends MyMapper<Menu> {
	
	/**
	 * 查询系统所有的功能权限
	 * @return
	 */
	public List<String> selectRightList();
	
}