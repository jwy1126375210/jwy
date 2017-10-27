/*
 * 文件名称：UserMapper.java
 */
package cn.com.jwy.mapper.sys;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cn.com.jwy.common.mybatis.bean.MyMapper;
import cn.com.jwy.dto.sys.user.getuserlist.UserDto;
import cn.com.jwy.model.sys.User;

/**
 * 名称： 模块描述：数据库表对应dao操作类 作者：系统自动生成
 */
public interface UserMapper extends MyMapper<User> {

	/**
	 * 查询最大的用户ID
	 * 
	 * @return
	 */
	public Integer selectMaxIdNo();

	/**
	 * 查询用户列表
	 * 
	 * @param start
	 * @param size
	 * @param userType
	 * @param isValid
	 * @param keyword
	 * @return
	 */
	public List<UserDto> selectUserList(@Param("start") int start, @Param("size") int size,
			@Param("loginUserType") Short loginUserType, @Param("officeIdList") List<String> officeIdList,
			@Param("userType") Short userType, @Param("isValid") Short isValid, @Param("keyword") String keyword);

	/**
	 * 查询用户数量
	 * 
	 * @param userType
	 * @param isValid
	 * @param keyword
	 * @return
	 */
	public int selectUserCount(@Param("loginUserType") Short loginUserType,
			@Param("officeIdList") List<String> officeIdList, @Param("userType") Short userType,
			@Param("isValid") Short isValid, @Param("keyword") String keyword);

}