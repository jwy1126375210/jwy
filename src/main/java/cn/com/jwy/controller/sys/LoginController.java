package cn.com.jwy.controller.sys;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.jwy.common.interceptor.AuthPermissionInterceptor;
import cn.com.jwy.common.interceptor.LoginFilter;
import cn.com.jwy.common.model.AjaxResult;
import cn.com.jwy.common.model.LoginUser;
import cn.com.jwy.common.utils.MD5Util;
import cn.com.jwy.common.utils.ValidateCode;
import cn.com.jwy.model.sys.User;
import cn.com.jwy.service.sys.LoginService;

/**
 * 登录
 * @author jiangwenyu
 *
 */

@Controller
public class LoginController {
	
	@Autowired
	private LoginService loginService;
	
	/**
	 * 首页
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/", method = RequestMethod.GET)
	public String index(HttpServletRequest request, HttpServletResponse response){
		LoginUser loginUser = LoginFilter.getSessionUser(request);
		if(loginUser != null){
			return "/index.jsp";
		}else{
			return "redirect:login";
		}
	}
	
	/**
	 * 登录页面
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/login", method = RequestMethod.GET)
	public String login(HttpServletRequest request, HttpServletResponse response){
		return "/Contents/login/login.jsp";
	}
	
	/**
	 * 登录
	 * @param request
	 * @param response
	 * @param username
	 * @param password
	 * @param validator
	 * @return
	 */
	@RequestMapping(value = "/login",method = RequestMethod.POST)
	@ResponseBody
	public AjaxResult login(HttpServletRequest request, HttpServletResponse response, HttpSession session,
			@RequestParam("username") String username, 
			@RequestParam("password") String password,
			@RequestParam("validator") String validator){
		AjaxResult ajax = new AjaxResult();
		try {
			String sessionCode = (String) session.getAttribute("code"); 
			if (!StringUtils.equalsIgnoreCase(validator, sessionCode)) { 
				ajax.setMessage("验证码错误");
			    return ajax;
			}
			username = new String(Base64.decodeBase64(username.getBytes("UTF-8")));
			password = new String(Base64.decodeBase64(password.getBytes("UTF-8")));
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
					// 设置系统的功能权限到session
					session.setAttribute(AuthPermissionInterceptor.RIGHTS, loginService.getRights());
					ajax.setCode(AjaxResult.SUCCESS);
					ajax.setMessage("登录成功");
					ajax.setResult(loginUser);
				} else {
					ajax.setMessage("您的账号被禁用，请联系管理员");
				}
			} else {
				ajax.setMessage("用户不存在或者密码错误");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ajax;
	}
	
	/**
	 * 登出
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/logout", method = RequestMethod.GET)
	public String logout(HttpServletRequest request, HttpServletResponse response){
		LoginFilter.clearSessionUser(request);
		return "redirect:login";
	}
	
	/**
	 * 生成验证码
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/validateCode", method = RequestMethod.GET)  
	public void validateCode(HttpServletRequest request,HttpServletResponse response, HttpSession session) throws Exception{ 
		try {
			// 设置响应的类型格式为图片格式  
		    response.setContentType("image/jpeg");  
		    // 禁止图像缓存。  
		    response.setHeader("Pragma", "no-cache");  
		    response.setHeader("Cache-Control", "no-cache");  
		    response.setDateHeader("Expires", 0);  
		    ValidateCode vCode = new ValidateCode(180,60,4,20);
		    session.setAttribute("code", vCode.getCode()); 
		    vCode.write(response.getOutputStream());  
		} catch (Exception e) {
			e.printStackTrace();
		}
	}  

}
