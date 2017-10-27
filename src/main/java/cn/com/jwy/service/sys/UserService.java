package cn.com.jwy.service.sys;

import java.util.List;

import cn.com.jwy.common.model.Page;
import cn.com.jwy.common.utils.MessageException;
import cn.com.jwy.dto.sys.user.getareas.AreaDto;
import cn.com.jwy.dto.sys.user.getmenus.MenuDto;
import cn.com.jwy.dto.sys.user.getoffices.OfficeDto;
import cn.com.jwy.dto.sys.user.getuserlist.UserDto;
import cn.com.jwy.model.sys.User;

public interface UserService {
	
	/**
	 * 查询用户列表
	 * @param userId
	 * @param pageNo
	 * @param pageSize
	 * @param userType
	 * @param isValid
	 * @param keyword
	 * @return
	 */
	public Page<UserDto> getUserList(Integer userId, Integer pageNo, Integer pageSize, Short userType, Short isValid, String keyword);
	
	/**
	 * 查询用户对象
	 * @param id
	 * @return
	 */
	public User getUser(Integer id);

	/**
	 * 根据登录用户信息获取数据区域
	 * @param loginUserId
	 * @param userId
	 * @return
	 */
	public List<AreaDto> getAreaByUserId(Integer loginUserId, Integer userId);
	
	/**
	 * 根据登录用户信息获取数据税务机关
	 * @param areaId
	 * @param loginUserId
	 * @param userId
	 * @return
	 */
	public List<OfficeDto> getOfficeByUserId(String areaId, Integer loginUserId, Integer userId);
	
	/**
	 * 根据登录用户信息获取功能权限
	 * @param loginUserId
	 * @param userId
	 * @return
	 */
	public List<MenuDto> getMenuByUserId(Integer loginUserId, Integer userId);

	/**
	 * 添加用户
	 * @param user
	 * @param areaDto
	 * @param menuDtos
	 * @return
	 * @throws MessageException
	 */
	public boolean addUser(User user, cn.com.jwy.dto.sys.user.adduser.AreaDto areaDto, 
			List<cn.com.jwy.dto.sys.user.adduser.MenuDto> menuDtos) throws MessageException;

	/**
	 * 修改用户
	 * @param user
	 * @param areaDto
	 * @param menuDtos
	 * @return
	 * @throws MessageException
	 */
	public boolean editUser(User user, cn.com.jwy.dto.sys.user.edituser.AreaDto areaDto,
			List<cn.com.jwy.dto.sys.user.edituser.MenuDto> menuDtos) throws MessageException;

	/**
	 * 删除用户
	 * @param idList
	 * @return
	 */
	public boolean deleteUser(List<Integer> idList);

}
