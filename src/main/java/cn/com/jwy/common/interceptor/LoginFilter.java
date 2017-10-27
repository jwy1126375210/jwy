package cn.com.jwy.common.interceptor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.com.jwy.common.model.LoginUser;

/**
 * 登录验证拦截器
 */
public class LoginFilter implements Filter {
	
	public static final String LOGINUSER = "loginUser";
	
	private static List<String> rights = new ArrayList<String>();// 不需要验证登录的请求
	private static List<String> suffixs = new ArrayList<String>();// 需要拦截的后缀
	
	static {
		rights.add("/");
		rights.add("/login");
		rights.add("/logout");
		rights.add("/validateCode");
		suffixs.add("jsp");
		suffixs.add("html");
	}
	
	public static LoginUser getSessionUser(HttpServletRequest request) {
		return (LoginUser) request.getSession().getAttribute(LOGINUSER);
	}
	
	public static void setSessionUser(HttpServletRequest request, LoginUser loginUser) {
		request.getSession().setAttribute(LOGINUSER, loginUser);
	}
	
	public static void clearSessionUser(HttpServletRequest request){
		request.getSession().removeAttribute(LOGINUSER);
	}
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		// 登录拦截
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		String url = request.getServletPath();
		if((url.indexOf(".") == -1 && !rights.contains(url)) || (url.indexOf(".") > -1 && isIntercept(url))){// 要拦截的请求
			LoginUser loginUser = getSessionUser(request);
			if (loginUser == null) {// 用户不存在，跳转至登录页面
				if (isAjax(request) ) {
					// 处理 AJAX 请求
					response.setHeader("sessionstatus", "timeout_user");// 在响应头设置session状态
					response.sendError(518);
				} else {
					response.sendRedirect(request.getContextPath()+"/login");
				}
				return;
			}
		}
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {}
	
	private static boolean isIntercept(String url){
		if (url.indexOf(".") > -1) {
			String suffix = url.substring(url.lastIndexOf(".")+1);
			if (suffixs.contains(suffix)) {
				return true;
			}
		}
		return false;
	}
	
	public static boolean isAjax( HttpServletRequest request ) {
		return "XMLHttpRequest".equals(request.getHeader("X-Requested-With")) ? true : false;
	}
	
}