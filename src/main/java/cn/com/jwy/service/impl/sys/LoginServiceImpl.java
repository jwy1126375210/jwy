package cn.com.jwy.service.impl.sys;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.com.jwy.enums.common.DelEnum;
import cn.com.jwy.enums.sys.menu.AdminTypeEnum;
import cn.com.jwy.enums.sys.user.UserTypeEnum;
import cn.com.jwy.mapper.sys.MenuMapper;
import cn.com.jwy.mapper.sys.UserMapper;
import cn.com.jwy.mapper.sys.UserMenuMapper;
import cn.com.jwy.model.sys.Menu;
import cn.com.jwy.model.sys.User;
import cn.com.jwy.service.sys.LoginService;
import tk.mybatis.mapper.entity.Example;

@Service
public class LoginServiceImpl implements LoginService {
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private MenuMapper menuMapper;
	
	@Autowired
	private UserMenuMapper userMenuMapper;
	
	@Override
	public User login(String username, String password) {
		Example example = new Example(User.class);
		example.createCriteria().andEqualTo("username", username).andEqualTo("password", password).andEqualTo("del", DelEnum.DEL_NO.getKey());
		List<User> users = userMapper.selectByExample(example);
		if (users.size() > 0) {
			return users.get(0);
		} else {
			return null;
		}
	}

	@Override
	public List<Menu> getMenuList(Integer userId) {
		User user = userMapper.selectByPrimaryKey(userId);
		List<Menu> menus = new ArrayList<Menu>();
		if (user.getUserType() == UserTypeEnum.USERTYPE_XTGLY.getKey()) {// 系统管理员拥有所有权限
			Example example = new Example(Menu.class);
			example.createCriteria().andEqualTo("del", DelEnum.DEL_NO.getKey());
			menus = menuMapper.selectByExample(example);
		} else {
			menus = userMenuMapper.selectMenuListByUserId(userId);// 普通用户拥有的权限
			if (user.getUserType() == UserTypeEnum.USERTYPE_YHGLY.getKey()) {// 用户管理员默认拥有的权限
				Example example = new Example(Menu.class);
				example.createCriteria().andEqualTo("del", DelEnum.DEL_NO.getKey()).andEqualTo("adminType", AdminTypeEnum.ADMINTYPE_YES.getKey());
				menus.addAll(menuMapper.selectByExample(example));
			}
		}
		return menus;
	}

	@Override
	public List<String> getRights() {
		return menuMapper.selectRightList();
	}
	
}
