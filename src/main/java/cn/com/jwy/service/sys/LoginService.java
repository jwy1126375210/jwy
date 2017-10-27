package cn.com.jwy.service.sys;

import java.util.List;

import cn.com.jwy.model.sys.Menu;
import cn.com.jwy.model.sys.User;

public interface LoginService {

	/**
	 * 登录
	 * @param username
	 * @param password
	 * @return
	 */
	public User login(String username, String password);
	
	/**
	 * 获取用户拥有的权限
	 * @param userId
	 * @return
	 */
	public List<Menu> getMenuList(Integer userId);
	
	/**
	 * 获取系统所有的功能权限
	 * @return
	 */
	public List<String> getRights();
	
}
