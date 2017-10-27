package controller.sys;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import cn.com.jwy.common.interceptor.LoginFilter;
import cn.com.jwy.common.model.AjaxResult;
import cn.com.jwy.common.model.LoginUser;
import cn.com.jwy.common.utils.MD5Util;
import cn.com.jwy.controller.sys.UserController;
import cn.com.jwy.model.sys.User;
import cn.com.jwy.service.sys.LoginService;

import com.alibaba.fastjson.JSONObject;

@RunWith(SpringJUnit4ClassRunner.class)    
@ContextConfiguration(locations = {"classpath:/spring-mvc.xml","classpath:/applicationContext.xml"})   
@WebAppConfiguration
public class TestUserController {

	@Autowired
	private MockHttpServletRequest request;
	
	@Autowired
	private MockHttpServletResponse response;
	
	@Autowired
	private UserController userController;
	
	@Autowired
	private LoginService loginService;
	
	@Before
	public void login() {
		String username = "admin";
		String password = "123456";
		password = MD5Util.md5(password);
		User user = loginService.login(username, password);
		if (user != null) {
			if (user.getIsValid() == 1) {
				LoginUser loginUser = new LoginUser();
				BeanUtils.copyProperties(user, loginUser);
				// 设置用户功能权限
				loginUser.setMenus(loginService.getMenuList(user.getId()));
				// 设置用户信息到session
				LoginFilter.setSessionUser(request, loginUser);
			} else {
				System.out.println("您的账号被禁用，请联系管理员");
			}
		} else {
			System.out.println("用户不存在或者密码错误");
		}
	}
	
	@After
	public void logout() {
		LoginFilter.clearSessionUser(request);
	}
	
	@Test
	public void getLoginUserInfo() {
		AjaxResult result = userController.getLoginUserInfo(request, response);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void getUserList() {
		AjaxResult result = userController.getUserList(request, response, 1, 20, null, null, null);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void getUserInfo() {
		AjaxResult result = userController.getUserInfo(request, response, 1);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void getArea() {
		AjaxResult result = userController.getAreas(request, response, null);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void getOffices() {
		AjaxResult result = userController.getOffices(request, response, "330100", null);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void getMenus() {
		AjaxResult result = userController.getMenus(request, response, null);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void addUser() {
		String username = "test1"; 
		String password = "123456";
		Short isValid = (short) 1;
		Short userType = (short) 3;
		String realName = "测试";
		String phone = "13111111111";
		String remark = "测试";
		String officeJson = "{\"areaId\":\"330100\",\"areaName\":\"杭州市\",\"offices\":[{\"officeId\":\"133010200\",\"officeName\":\"杭州市上城国家税务局\"},{\"officeId\":\"133010300\",\"officeName\":\"杭州市下城国家税务局\"},{\"officeId\":\"133010400\",\"officeName\":\"杭州市江干国家税务局\"}]}";
		String menuJson = "[{\"menuId\":\"1\",\"menuName\":\"异地开票监控\"}]";
		AjaxResult result = userController.addUser(request, response, username, password, isValid, userType, realName, phone, remark, officeJson, menuJson);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void editUser() {
		Integer id = 2;
		String username = "test"; 
		String password = "123456";
		Short isValid = (short) 1;
		Short userType = (short) 2;
		String realName = "测试";
		String phone = "13111111111";
		String remark = "测试";
		String officeJson = "{\"areaId\":\"330100\",\"areaName\":\"杭州市\",\"offices\":[{\"officeId\":\"133010200\",\"officeName\":\"杭州市上城国家税务局\"},{\"officeId\":\"133010300\",\"officeName\":\"杭州市下城国家税务局\"},{\"officeId\":\"133010400\",\"officeName\":\"杭州市江干国家税务局\"}]}";
		String menuJson = "[{\"menuId\":\"1\",\"menuName\":\"异地开票监控\"}]";
		AjaxResult result = userController.editUser(request, response, id, username, password, isValid, userType, realName, phone, remark, officeJson, menuJson);
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void deleteUser() {
		AjaxResult result = userController.deleteUser(request, response, "3");
		System.out.println(JSONObject.toJSONString(result));
	}
	
	@Test
	public void excelUserList() throws Exception {
		userController.excelUserList(request, response, null, null, null);
	}
	
}
