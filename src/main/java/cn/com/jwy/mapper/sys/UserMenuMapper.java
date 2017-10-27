/*
 * 文件名称：UserMenuMapper.java
 */
package cn.com.jwy.mapper.sys;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cn.com.jwy.common.mybatis.bean.MyMapper;
import cn.com.jwy.dto.sys.user.getmenus.MenuDto;
import cn.com.jwy.model.sys.Menu;
import cn.com.jwy.model.sys.UserMenu;

/**
 * 名称：
 * 模块描述：数据库表对应dao操作类
 * 作者：系统自动生成
 */
public interface UserMenuMapper extends MyMapper<UserMenu> {
	
	/**
	 * 根据用户id查询用户拥有权限
	 * @param userId
	 * @return
	 */
	public List<Menu> selectMenuListByUserId(@Param("userId") Integer userId);
	
	/**
	 * 查询两个用户拥有的权限
	 * @param loginUserId
	 * @param userId
	 * @return
	 */
	public List<MenuDto> selectMenuListByTwoUserId(@Param("loginUserId") Integer loginUserId, @Param("userId") Integer userId);
	
}