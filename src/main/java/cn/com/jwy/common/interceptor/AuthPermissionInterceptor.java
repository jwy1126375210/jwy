package cn.com.jwy.common.interceptor;

import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import cn.com.jwy.common.model.LoginUser;
import cn.com.jwy.enums.sys.menu.MenuTypeEnum;
import cn.com.jwy.model.sys.Menu;

/**
 * <p>
 * 权限拦截器（必须在登录拦截器之后执行）
 * </p>
 * 
 */
public class AuthPermissionInterceptor extends HandlerInterceptorAdapter {
	
	public static final String RIGHTS = "rights";

	/**
	 * 不用权限验证地址
	 */
	private Set<String> noAuthPages;

	/**
	 * <p>
	 * 用户权限验证
	 * </p>
	 * <p>
	 * 方法拦截 Controller 处理之前进行调用。
	 * </p>
	 */
	@SuppressWarnings("unchecked")
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		LoginUser loginUser = LoginFilter.getSessionUser(request);
		String url = request.getServletPath();
		List<Menu> menus = loginUser.getMenus();
		// 不需要验证的url
		if (!isAuthNeed(url)) {
			return true;
		}
		// 判断该请求是否需要进行功能验证
		List<String> rights = (List<String>) request.getSession().getAttribute(RIGHTS);
		if (rights != null && rights.contains(url)) {// 需要进行功能验证
			if (menus != null && menus.size() > 0) {
				for (Menu menu : menus) {
					if (menu.getMenuType() == MenuTypeEnum.MENUTYPE_GN.getKey() && menu.getAuthority().equals(url)) {// 验证通过
						return true;
					}
				}
			}
		} else {
			// 验证是否拥有此权限
			if (menus != null && menus.size() > 0) {
				for (Menu menu : menus) {
					if (isPermission(url, menu.getAuthority())) { 
						return true;
					}
				}
			}
		}
		// 没有访问权限
		if (LoginFilter.isAjax(request) ) {
			// 处理 AJAX 请求
			response.setHeader("sessionstatus", "noauth_user");// 在响应头设置session状态
			response.sendError(403);
		} else {
			response.sendRedirect(request.getContextPath()+"/Contents/error/403.html");
		}
		return false;
	}
	
	protected boolean isAuthNeed(String uri) {
		for (String path : noAuthPages) {
			if (isPermission(uri, path)) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 判断是否符合规则
	 * 
	 * @param from
	 * @param to
	 * @return
	 */
	public static boolean isPermission(String from, String to) {
		if (from == null || to == null) {
			return false;
		}
		if (to.endsWith("*")) {
			if (from.startsWith(to.substring(0, to.length() - 1))) {
				return true;
			}
		} else {
			if (from.equals(to)) {
				return true;
			}
		}
		return false;
	}
	
	public Set<String> getNoAuthPages() {
		return noAuthPages;
	}

	public void setNoAuthPages(Set<String> noAuthPages) {
		this.noAuthPages = noAuthPages;
	}

}
