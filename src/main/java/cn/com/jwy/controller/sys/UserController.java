package cn.com.jwy.controller.sys;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.jwy.common.interceptor.LoginFilter;
import cn.com.jwy.common.model.AjaxResult;
import cn.com.jwy.common.model.ErrorInfo;
import cn.com.jwy.common.model.LoginUser;
import cn.com.jwy.common.model.Page;
import cn.com.jwy.common.utils.CommonUtil;
import cn.com.jwy.common.utils.DateFormatUtil;
import cn.com.jwy.common.utils.ExportExcelUtil;
import cn.com.jwy.common.utils.MD5Util;
import cn.com.jwy.common.utils.MessageException;
import cn.com.jwy.dto.sys.user.getareas.AreaDto;
import cn.com.jwy.dto.sys.user.getmenus.MenuDto;
import cn.com.jwy.dto.sys.user.getoffices.OfficeDto;
import cn.com.jwy.dto.sys.user.getuserlist.UserDto;
import cn.com.jwy.enums.common.DelEnum;
import cn.com.jwy.model.sys.User;
import cn.com.jwy.service.sys.UserService;

import com.alibaba.fastjson.JSONObject;

/**
 * 用户控制器
 * @author jiangwenyu
 *
 */

@Controller
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService userService;

	/**
	 * 获取登录用户信息
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/getLoginUserInfo", method=RequestMethod.GET)
	@ResponseBody
	public AjaxResult getLoginUserInfo(HttpServletRequest request, HttpServletResponse response) {
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(loginUser);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 获取用户列表
	 * @param request
	 * @param response
	 * @param pageNo
	 * @param pageSize
	 * @param userType
	 * @param isValid
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value="/getUserList", method=RequestMethod.GET)
	@ResponseBody
	public AjaxResult getUserList(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("pageNo") Integer pageNo,
			@RequestParam("pageSize") Integer pageSize,
			@RequestParam(value="userType",required=false) Short userType,
			@RequestParam(value="isValid",required=false) Short isValid,
			@RequestParam(value="keyword",required=false) String keyword) {
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			Page<UserDto> page = userService.getUserList(loginUser.getId(), pageNo, pageSize, userType, isValid, keyword);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(page);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 获取指定用户信息
	 * @param request
	 * @param response
	 * @param userId
	 * @return
	 */
	@RequestMapping(value="/getUserInfo", method=RequestMethod.GET)
	@ResponseBody
	public AjaxResult getUserInfo(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("userId") Integer userId) {
		AjaxResult ajax = new AjaxResult();
		try {
			User user = userService.getUser(userId);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(user);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 获取用户数据权限选择的区域
	 * @param request
	 * @param response
	 * @param userId
	 * @return
	 */
	@RequestMapping(value="/getAreas", method=RequestMethod.GET)
	@ResponseBody
	public AjaxResult getAreas(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value="userId",required=false) Integer userId) {
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			List<AreaDto> areaDtos = userService.getAreaByUserId(loginUser.getId(), userId);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(areaDtos);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 获取用户数据权限选择的税务机关
	 * @param request
	 * @param response
	 * @param areaId
	 * @param userId
	 * @return
	 */
	@RequestMapping(value="/getOffices", method=RequestMethod.GET)
	@ResponseBody
	public AjaxResult getOffices(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("areaId") String areaId,
			@RequestParam(value="userId",required=false) Integer userId) {
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			List<OfficeDto> officeDtos = userService.getOfficeByUserId(areaId, loginUser.getId(), userId);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(officeDtos);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 获取用户功能权限选择的菜单
	 * @param request
	 * @param response
	 * @param userId
	 * @return
	 */
	@RequestMapping(value="/getMenus", method=RequestMethod.GET)
	@ResponseBody
	public AjaxResult getMenus(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value="userId",required=false) Integer userId) {
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			List<MenuDto> menuDtos = userService.getMenuByUserId(loginUser.getId(), userId);
			ajax.setCode(AjaxResult.SUCCESS);
			ajax.setResult(menuDtos);
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 添加用户
	 * @param request
	 * @param response
	 * @param username
	 * @param password
	 * @param isValid
	 * @param userType
	 * @param realName
	 * @param phone
	 * @param remark
	 * @param officeJson
	 * @param menuJson
	 * @return
	 */
	@RequestMapping(value="/addUser", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResult addUser(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("username") String username, 
			@RequestParam("password") String password,
			@RequestParam("isValid") Short isValid,
			@RequestParam("userType") Short userType,
			@RequestParam("realName") String realName,
			@RequestParam("phone") String phone,
			@RequestParam("remark") String remark,
			@RequestParam("officeJson") String officeJson,
			@RequestParam("menuJson") String menuJson){
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			User user = new User();
			user.setUsername(username);
			user.setPassword(MD5Util.md5(password));
			user.setIsValid(isValid);
			user.setUserType(userType);
			user.setRealName(realName);
			user.setPhone(phone);
			user.setRemark(remark);
			user.setAddUser(loginUser.getId());
			user.setAddTime(new Date());
			user.setDel(DelEnum.DEL_NO.getKey());
			// 提取用户数据权限
			cn.com.jwy.dto.sys.user.adduser.AreaDto areaDto = JSONObject.parseObject(officeJson, cn.com.jwy.dto.sys.user.adduser.AreaDto.class);
			// 提取用户功能权限
			List<cn.com.jwy.dto.sys.user.adduser.MenuDto> menuDtos = JSONObject.parseArray(menuJson, cn.com.jwy.dto.sys.user.adduser.MenuDto.class);
			// 数据验证
			if (areaDto == null || areaDto.getAreaId() == null) {
				throw new MessageException("没有区域信息");
			}
			if (areaDto.getOffices() == null || areaDto.getOffices().size() == 0) {
				throw new MessageException("没有税务机关信息");
			}
			if (menuDtos == null || menuDtos.size() == 0) {
				throw new MessageException("没有权限信息");
			}
			boolean result = userService.addUser(user, areaDto, menuDtos);
			if(result){
				ajax.setCode(AjaxResult.SUCCESS);
				ajax.setMessage("添加用户成功");
			}else{
				ajax.setMessage(ErrorInfo.OPTION_ERROR);
			}
		} catch (MessageException e) {
			e.printStackTrace();
			ajax.setMessage(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 编辑用户
	 * @param request
	 * @param response
	 * @param id
	 * @param username
	 * @param password
	 * @param isValid
	 * @param userType
	 * @param realName
	 * @param phone
	 * @param remark
	 * @param officeJson
	 * @param menuJson
	 * @return
	 */
	@RequestMapping(value="/editUser", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResult editUser(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("id") Integer id, 
			@RequestParam("username") String username, 
			@RequestParam("password") String password,
			@RequestParam("isValid") Short isValid,
			@RequestParam("userType") Short userType,
			@RequestParam("realName") String realName,
			@RequestParam("phone") String phone,
			@RequestParam("remark") String remark,
			@RequestParam("officeJson") String officeJson,
			@RequestParam("menuJson") String menuJson) {
		AjaxResult ajax = new AjaxResult();
		try {
			LoginUser loginUser = LoginFilter.getSessionUser(request);
			User _user = userService.getUser(id);
			User user = new User();
			user.setId(id);
			user.setUsername(username);
			if (StringUtils.isNotEmpty(password) && !password.equals(_user.getPassword())) {
				user.setPassword(MD5Util.md5(password));
			}
			user.setIsValid(isValid);
			user.setUserType(userType);
			user.setRealName(realName);
			user.setPhone(phone);
			user.setRemark(remark);
			user.setEditUser(loginUser.getId());
			user.setEditTime(new Date());
			// 提取用户数据权限
			cn.com.jwy.dto.sys.user.edituser.AreaDto areaDto = JSONObject.parseObject(officeJson, cn.com.jwy.dto.sys.user.edituser.AreaDto.class);
			// 提取用户功能权限
			List<cn.com.jwy.dto.sys.user.edituser.MenuDto> menuDtos = JSONObject.parseArray(menuJson, cn.com.jwy.dto.sys.user.edituser.MenuDto.class);
			// 数据验证
			if (areaDto == null || areaDto.getAreaId() == null) {
				throw new MessageException("没有区域信息");
			}
			if (areaDto.getOffices() == null || areaDto.getOffices().size() == 0) {
				throw new MessageException("没有税务机关信息");
			}
			if (menuDtos == null || menuDtos.size() == 0) {
				throw new MessageException("没有权限信息");
			}
			boolean result = userService.editUser(user, areaDto, menuDtos);
			if(result){
				ajax.setCode(AjaxResult.SUCCESS);
				ajax.setMessage("修改用户成功");
			}else{
				ajax.setMessage(ErrorInfo.OPTION_ERROR);
			}
		} catch (MessageException e) {
			e.printStackTrace();
			ajax.setMessage(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 删除用户
	 * @param request
	 * @param response
	 * @param ids
	 * @return
	 */
	@RequestMapping(value="/deleteUser", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResult deleteUser(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("ids") String ids){
		AjaxResult ajax = new AjaxResult();
		try {
			List<Integer> idList = CommonUtil.StringToIntegerList(ids);
			boolean result = userService.deleteUser(idList);
			if(result){
				ajax.setCode(AjaxResult.SUCCESS);
				ajax.setMessage("删除用户成功");
			}else{
				ajax.setMessage(ErrorInfo.OPTION_ERROR);
			}
		} catch (Exception e) {
			e.printStackTrace();
			ajax.setMessage(ErrorInfo.DEFAULT_ERROR);
		}
		return ajax;
	}
	
	/**
	 * 导出用户列表
	 * @param request
	 * @param response
	 * @param userType
	 * @param isValid
	 * @param keyword
	 * @throws IOException 
	 */
	@RequestMapping(value="/excelUserList", method = RequestMethod.GET)
	public void excelUserList(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value="userType",required=false) Short userType,
			@RequestParam(value="isValid",required=false) Short isValid,
			@RequestParam(value="keyword",required=false) String keyword) throws IOException {
		LoginUser loginUser = LoginFilter.getSessionUser(request);
		Page<UserDto> page = userService.getUserList(loginUser.getId(), 1, 100000000, userType, isValid, keyword);
		ExportExcelUtil.exportUserList("电子围栏—账户信息 "+DateFormatUtil.getStrByYmdChinese(new Date()), page.getList(), response);
	}
	
}
