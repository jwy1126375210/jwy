package cn.com.jwy.service.impl.sys;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.com.jwy.common.model.Page;
import cn.com.jwy.common.utils.MessageException;
import cn.com.jwy.dto.sys.user.getareas.AreaDto;
import cn.com.jwy.dto.sys.user.getmenus.MenuDto;
import cn.com.jwy.dto.sys.user.getoffices.OfficeDto;
import cn.com.jwy.dto.sys.user.getuserlist.UserDto;
import cn.com.jwy.enums.common.DelEnum;
import cn.com.jwy.enums.sys.user.UserTypeEnum;
import cn.com.jwy.mapper.sys.MenuMapper;
import cn.com.jwy.mapper.sys.UserMapper;
import cn.com.jwy.mapper.sys.UserMenuMapper;
import cn.com.jwy.mapper.sys.UserOfficeMapper;
import cn.com.jwy.mapper.warn.AreaMapper;
import cn.com.jwy.mapper.warn.OfficeMapper;
import cn.com.jwy.model.sys.Menu;
import cn.com.jwy.model.sys.User;
import cn.com.jwy.model.sys.UserMenu;
import cn.com.jwy.model.sys.UserOffice;
import cn.com.jwy.model.warn.Area;
import cn.com.jwy.model.warn.Office;
import cn.com.jwy.service.sys.UserService;
import tk.mybatis.mapper.entity.Example;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private MenuMapper menuMapper;

	@Autowired
	private AreaMapper areaMapper;

	@Autowired
	private UserMenuMapper userMenuMapper;
	
	@Autowired
	private OfficeMapper officeMapper;

	@Autowired
	private UserOfficeMapper userOfficeMapper;
	
	@Override
	public Page<UserDto> getUserList(Integer userId, Integer pageNo, Integer pageSize, Short userType, Short isValid,
			String keyword) {
		User user = userMapper.selectByPrimaryKey(userId);
		Page<UserDto> page = new Page<UserDto>();
		page.setPageNo(pageNo);
		page.setPageSize(pageSize);
		int start = (pageNo - 1) * pageSize;
		int size = pageSize;
		// 当前用户拥有的数据权限
		List<String> officeIdList = new ArrayList<String>();
		if (user.getUserType() == UserTypeEnum.USERTYPE_YHGLY.getKey()) {// 用户管理员
			Example example = new Example(UserOffice.class);
			example.createCriteria().andEqualTo("userId", userId);
			List<UserOffice> userOffices = userOfficeMapper.selectByExample(example);
			if (userOffices != null && userOffices.size() > 0) {
				for (UserOffice userOffice : userOffices) {
					officeIdList.add(userOffice.getOfficeId());
				}
			}
		}
		List<UserDto> list = userMapper.selectUserList(start, size, user.getUserType(), officeIdList, userType, isValid, keyword);
		if (list != null && list.size() > 0) {
			for (UserDto userDto : list) {
				if (userDto.getUserType() == UserTypeEnum.USERTYPE_XTGLY.getKey()) {
					userDto.setOfficeList("全部");
					userDto.setMenuList("全部");
				} else if (userDto.getUserType() == UserTypeEnum.USERTYPE_YHGLY.getKey()) {
					userDto.setMenuList("账户管理,"+userDto.getMenuList());
				}
			}
		}
		int count = userMapper.selectUserCount(user.getUserType(), officeIdList, userType, isValid, keyword);
		page.setList(list);
		page.setTotalCount(count);
		return page;
	}
	
	@Override
	public User getUser(Integer id) {
		return userMapper.selectByPrimaryKey(id);
	}

	@Override
	public List<AreaDto> getAreaByUserId(Integer loginUserId, Integer userId) {
		List<AreaDto> areaDtos = new ArrayList<AreaDto>();
		User user = userMapper.selectByPrimaryKey(loginUserId);
		String check_areaId = null;// 修改的时候，默认选中的区域
		if (userId != null) {// 是修改，设置初始选中的区域
			Example example = new Example(UserOffice.class);
			example.createCriteria().andEqualTo("userId", userId);
			List<UserOffice> userOffices = userOfficeMapper.selectByExample(example);
			if (userOffices != null && userOffices.size() > 0) {
				check_areaId = userOffices.get(0).getAreaId();
			}
		}
		if (user.getUserType() == UserTypeEnum.USERTYPE_XTGLY.getKey()) {// 系统管理员(查询全部区域)
			Example example = new Example(Area.class);
			example.createCriteria().andLessThanOrEqualTo("type", 1);
			List<Area> areas = areaMapper.selectByExample(example);// 查询省级和市级的区域
			if (areas != null && areas.size() > 0) {
				for (Area area : areas) {
					if (area.getType() == 0) {// 省级区域
						String areaId = area.getId();
						AreaDto areaDto = new AreaDto();
						BeanUtils.copyProperties(area, areaDto);
						List<AreaDto> sub_areaDtos = new ArrayList<AreaDto>();
						for (Area sub_area : areas) {
							if (sub_area.getType() == 1 && sub_area.getPId().equals(areaId)) {// 市级区域
								AreaDto sub_areaDto = new AreaDto();
								BeanUtils.copyProperties(sub_area, sub_areaDto);
								if (sub_area.getId().equals(check_areaId)) {
									sub_areaDto.setChecked(true);
								}
								sub_areaDtos.add(sub_areaDto);
							}
						}
						areaDto.setChildrens(sub_areaDtos);
						if (areaId.equals(check_areaId)) {
							areaDto.setChecked(true);
						}
						areaDtos.add(areaDto);
					}
				}
			}
		} else if (user.getUserType() == UserTypeEnum.USERTYPE_YHGLY.getKey()) {// 用户管理员(查询当前登录用户拥有权限的区域)
			// 查询当前登录用户拥有权限的区域
			Example example = new Example(UserOffice.class);
			example.createCriteria().andEqualTo("userId", loginUserId);
			List<UserOffice> offices = userOfficeMapper.selectByExample(example);
			String login_areaId = null;// 当前登录用户拥有的区域
			if (offices != null && offices.size() > 0) {
				login_areaId = offices.get(0).getAreaId(); 
			}
			if (login_areaId.substring(2).equals("0000")) {// 是省级区域
				AreaDto areaDto = new AreaDto();
				Area area = areaMapper.selectByPrimaryKey(login_areaId);
				BeanUtils.copyProperties(area, areaDto);
				List<AreaDto> sub_areaDtos = new ArrayList<AreaDto>();
				// 查询市级区域
				example = new Example(Area.class);
				example.createCriteria().andEqualTo("type", 1).andEqualTo("pId", login_areaId); 
				List<Area> areas = areaMapper.selectByExample(example);
				if (areas != null && areas.size() > 0) {
					for (Area sub_area : areas) {
						AreaDto sub_areaDto = new AreaDto();
						BeanUtils.copyProperties(sub_area, sub_areaDto);
						if (sub_area.getId().equals(check_areaId)) {
							sub_areaDto.setChecked(true);
						}
						sub_areaDtos.add(sub_areaDto);
					}
				}
				areaDto.setChildrens(sub_areaDtos);
				if (login_areaId.equals(check_areaId)) {
					areaDto.setChecked(true);
				}
				areaDtos.add(areaDto);
			} else {// 是市级区域
				AreaDto sub_areaDto = new AreaDto();
				Area sub_area = areaMapper.selectByPrimaryKey(login_areaId);
				BeanUtils.copyProperties(sub_area, sub_areaDto);
				if (login_areaId.equals(check_areaId)) {
					sub_areaDto.setChecked(true);
				}
				List<AreaDto> sub_areaDtos = new ArrayList<AreaDto>();
				sub_areaDtos.add(sub_areaDto);
				// 查询省级区域
				AreaDto areaDto = new AreaDto();
				Area area = areaMapper.selectByPrimaryKey(sub_areaDto.getpId());
				BeanUtils.copyProperties(area, areaDto);
				areaDto.setChildrens(sub_areaDtos);
				if (area.getId().equals(check_areaId)) {
					areaDto.setChecked(true);
				}
				areaDtos.add(areaDto);
			}
		}
		return areaDtos;
	}
	
	@Override
	public List<OfficeDto> getOfficeByUserId(String areaId, Integer loginUserId, Integer userId) {
		List<OfficeDto> officeDtos = new ArrayList<OfficeDto>();
		User user = userMapper.selectByPrimaryKey(loginUserId);
		List<String> officeIdList = new ArrayList<String>();// 修改的时候，默认选中的税务机关
		if (userId != null) {// 是修改，设置初始选中的税务机关
			Example example = new Example(UserOffice.class);
			example.createCriteria().andEqualTo("userId", userId);
			List<UserOffice> userOffices = userOfficeMapper.selectByExample(example);
			if (userOffices != null && userOffices.size() > 0) {
				for (UserOffice userOffice : userOffices) {
					officeIdList.add(userOffice.getOfficeId());
				}
			}
		}
		// 获取区域下的税务机关
		Example example = new Example(Office.class);
		example.createCriteria().andEqualTo("areaId", areaId);
		List<Office> offices = officeMapper.selectByExample(example);
		if (offices != null && offices.size() > 0) {
			String officeIds = "";
			for (Office office : offices) {
				officeIds += office.getId() + ",";
			}
			officeIds = officeIds.substring(0, officeIds.length() - 1);
			if (user.getUserType() == UserTypeEnum.USERTYPE_XTGLY.getKey()) {// 系统管理员（查询所选区域下所有的税务机关）
				offices = officeMapper.selectChildByOfficeIds(officeIds, null);
			} else if (user.getUserType() == UserTypeEnum.USERTYPE_YHGLY.getKey()) {// 用户管理员(查询所选区域下当前用户拥有的税务机关)
				offices = officeMapper.selectChildByOfficeIds(officeIds, loginUserId);
			}
			for (Office office : offices) {
				OfficeDto officeDto = new OfficeDto();
				BeanUtils.copyProperties(office, officeDto);
				if (officeIdList.size() > 0 && officeIdList.contains(office.getId())) {
					officeDto.setChecked(true);
				}
				officeDtos.add(officeDto);
			}
		}
		return officeDtos;
	}
	
	@Override
	public List<MenuDto> getMenuByUserId(Integer loginUserId, Integer userId) {
		List<MenuDto> menuDtos = new ArrayList<MenuDto>();
		User user = userMapper.selectByPrimaryKey(loginUserId);
		List<Integer> menuIdList = new ArrayList<Integer>();// 修改的时候，默认选中的功能权限
		if (userId != null) {// 是修改，设置初始选中的税务机关
			Example example = new Example(UserMenu.class);
			example.createCriteria().andEqualTo("userId", userId);
			List<UserMenu> userMenus = userMenuMapper.selectByExample(example);
			if (userMenus != null && userMenus.size() > 0) {
				for (UserMenu userMenu : userMenus) {
					menuIdList.add(userMenu.getMenuId());
				}
			}
		}
		if (user.getUserType() == UserTypeEnum.USERTYPE_XTGLY.getKey()) {// 系统管理员（查询所有的功能权限）
			Example example = new Example(Menu.class);
			example.createCriteria().andEqualTo("del", 0).andEqualTo("adminType", 0);
			example.setOrderByClause("sort asc");
			List<Menu> menus = menuMapper.selectByExample(example);
			if (menus != null && menus.size() > 0) {
				for (Menu menu : menus) {
					MenuDto menuDto = new MenuDto();
					menuDto.setId(menu.getId());
					menuDto.setMenuName(menu.getMenuName());
					menuDto.setMenuType(menu.getMenuType());
					menuDto.setPid(menu.getPid());
					menuDto.setSort(menu.getSort());
					menuDto.setRemark(menu.getRemark());
					if (menuIdList.size() > 0 && menuIdList.contains(menu.getId())) {
						menuDto.setChecked(true);
					}
					menuDtos.add(menuDto);
				}
			}
		} else if (user.getUserType() == UserTypeEnum.USERTYPE_YHGLY.getKey()) {// 用户管理员(查询当前登录用户和需要修改用户两者的功能权限)
			menuDtos = userMenuMapper.selectMenuListByTwoUserId(loginUserId, userId);
			if (menuDtos != null && menuDtos.size() > 0) {
				for (MenuDto menuDto : menuDtos) {
					if (menuIdList.size() > 0 && menuIdList.contains(menuDto.getId())) {
						menuDto.setChecked(true);
					}
				}
			}
		}
		// 将功能权限组装成上下级格式
		List<MenuDto> new_menuDtos = getMenuDtoChildrens(0, menuDtos);
		return new_menuDtos;   
	}
	
	private List<MenuDto> getMenuDtoChildrens(Integer id, List<MenuDto> menuDtos) {
		List<MenuDto> menuDtos_childrens = new ArrayList<MenuDto>();
		if (menuDtos != null && menuDtos.size() > 0) {
			for (MenuDto menuDto : menuDtos) {
				if (menuDto.getPid() != null && menuDto.getPid().equals(id)) {
					menuDto.setChildrens(getMenuDtoChildrens(menuDto.getId(), menuDtos));
					menuDtos_childrens.add(menuDto);
				}
			}
		}
		return menuDtos_childrens;
	}
	
	@Override
	@Transactional
	synchronized public boolean addUser(User user, cn.com.jwy.dto.sys.user.adduser.AreaDto areaDto, List<cn.com.jwy.dto.sys.user.adduser.MenuDto> menuDtos)
			throws MessageException {
		// 生成用户ID
		int idNo = userMapper.selectMaxIdNo() + 1;
		user.setIdNo(idNo);
		// 判断用户名是否存在
		Example example = new Example(User.class);
		example.createCriteria().andEqualTo("del", DelEnum.DEL_NO.getKey()).andEqualTo("username", user.getUsername());
		int count = userMapper.selectCountByExample(example);
		if (count > 0) {
			throw new MessageException("用户名已存在");
		}
		int result = userMapper.insert(user);
		if (result == 1) {
			// 添加数据权限
			List<UserOffice> userOffices = new ArrayList<UserOffice>();
			for (cn.com.jwy.dto.sys.user.adduser.OfficeDto officeDto : areaDto.getOffices()) {
				UserOffice userOffice = new UserOffice();
				userOffice.setUserId(user.getId());
				userOffice.setAreaId(areaDto.getAreaId());
				userOffice.setAreaName(areaDto.getAreaName());
				userOffice.setOfficeId(officeDto.getOfficeId());
				userOffice.setOfficeName(officeDto.getOfficeName());
				userOffices.add(userOffice);
			}
			result = userOfficeMapper.insertList(userOffices);
			if (result != userOffices.size()) {
				throw new RuntimeException();
			}
			// 添加功能权限
			List<UserMenu> userMenus = new ArrayList<UserMenu>();
			for (cn.com.jwy.dto.sys.user.adduser.MenuDto menuDto : menuDtos) {
				UserMenu userMenu = new UserMenu();
				userMenu.setUserId(user.getId());
				userMenu.setMenuId(menuDto.getMenuId());
				userMenus.add(userMenu);
			}
			result = userMenuMapper.insertList(userMenus);
			if (result != userMenus.size()) {
				throw new RuntimeException();
			}
			return true;
		}
		throw new RuntimeException();
	}

	@Override
	public boolean editUser(User user, cn.com.jwy.dto.sys.user.edituser.AreaDto areaDto,
			List<cn.com.jwy.dto.sys.user.edituser.MenuDto> menuDtos) throws MessageException {
		// 判断用户名是否存在
		Example example = new Example(User.class);
		example.createCriteria().andEqualTo("del", DelEnum.DEL_NO.getKey()).andEqualTo("username", user.getUsername()).andNotEqualTo("id", user.getId());
		int count = userMapper.selectCountByExample(example);
		if (count > 0) {
			throw new MessageException("用户名已存在");
		}
		int result = userMapper.updateByPrimaryKeySelective(user);
		if (result == 1) {
			// 删除原有数据权限
			example = new Example(UserOffice.class);
			example.createCriteria().andEqualTo("userId", user.getId());
			userOfficeMapper.deleteByExample(example);
			List<UserOffice> userOffices = new ArrayList<UserOffice>();
			// 添加用户权限
			for (cn.com.jwy.dto.sys.user.edituser.OfficeDto officeDto : areaDto.getOffices()) {
				UserOffice userOffice = new UserOffice();
				userOffice.setUserId(user.getId());
				userOffice.setAreaId(areaDto.getAreaId());
				userOffice.setAreaName(areaDto.getAreaName());
				userOffice.setOfficeId(officeDto.getOfficeId());
				userOffice.setOfficeName(officeDto.getOfficeName());
				userOffices.add(userOffice);
			}
			result = userOfficeMapper.insertList(userOffices);
			if (result != userOffices.size()) {
				throw new RuntimeException();
			}
			// 删除原有的功能权限
			example = new Example(UserMenu.class);
			example.createCriteria().andEqualTo("userId", user.getId());
			userMenuMapper.deleteByExample(example);
			// 添加功能权限
			List<UserMenu> userMenus = new ArrayList<UserMenu>();
			for (cn.com.jwy.dto.sys.user.edituser.MenuDto menuDto : menuDtos) {
				UserMenu userMenu = new UserMenu();
				userMenu.setUserId(user.getId());
				userMenu.setMenuId(menuDto.getMenuId());
				userMenus.add(userMenu);
			}
			result = userMenuMapper.insertList(userMenus);
			if (result != userMenus.size()) {
				throw new RuntimeException();
			}
			return true;
		}
		throw new RuntimeException();
	}

	@Override
	@Transactional
	public boolean deleteUser(List<Integer> idList) {
		// 删除用户功能权限
		Example example = new Example(UserMenu.class);
		example.createCriteria().andIn("userId", idList);
		userMenuMapper.deleteByExample(example);
		// 删除用户数据权限
		example = new Example(UserOffice.class);
		example.createCriteria().andIn("userId", idList);
		userOfficeMapper.deleteByExample(example);
		// 删除用户
		User user = new User();
		user.setDel((short) 1);
		example = new Example(User.class);
		example.createCriteria().andIn("id", idList);
		int result = userMapper.updateByExampleSelective(user, example);
		if (result == idList.size()) {
			return true;
		}
		throw new RuntimeException();
	}

}
