package dev;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import cn.com.jwy.mapper.sys.MenuMapper;
import cn.com.jwy.mapper.sys.UserMenuMapper;
import cn.com.jwy.model.sys.Menu;
import cn.com.jwy.model.sys.UserMenu;
import tk.mybatis.mapper.entity.Example;

@RunWith(SpringJUnit4ClassRunner.class)    
@ContextConfiguration(locations = {"classpath:/spring-mvc.xml","classpath:/applicationContext.xml"})  
public class AdminUtil {

	@Autowired
	private MenuMapper menuMapper;
	
	@Autowired
	private UserMenuMapper userMenuMapper;
	
	private Integer userId = 1;
	
	@Test
	public void autoUserMenu() {
		// 自动更新管理员所有功能权限
		Example example = new Example(UserMenu.class);
		example.createCriteria().andEqualTo("userId", userId);
		userMenuMapper.deleteByExample(example);
		example = new Example(Menu.class);
		example.createCriteria().andEqualTo("del", 0);
		List<Menu> menus = menuMapper.selectByExample(example);
		if (menus != null && menus.size() > 0) {
			List<UserMenu> userMenus = new ArrayList<UserMenu>();
			for (Menu menu : menus) {
				UserMenu userMenu = new UserMenu();
				userMenu.setUserId(userId);
				userMenu.setMenuId(menu.getId());
				userMenus.add(userMenu);
			}
			int result = userMenuMapper.insertList(userMenus);
			System.out.println("成功设置"+result+"个功能权限");
		}
	}
	
}
