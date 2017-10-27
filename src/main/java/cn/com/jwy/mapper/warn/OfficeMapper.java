/*
 * 文件名称：OfficeMapper.java
 */
package cn.com.jwy.mapper.warn;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cn.com.jwy.common.mybatis.bean.MyMapper;
import cn.com.jwy.model.warn.Office;

/**
 * 名称：
 * 模块描述：数据库表对应dao操作类
 * 作者：系统自动生成
 */
public interface OfficeMapper extends MyMapper<Office> {
	
	/**
	 * 根据市级code查询税务机关
	 * @param cityCode
	 * @return
	 */
	public List<Office> selectOfficeListByCityCode(@Param("cityCode") String cityCode);
	
	/**
	 * 根据省级code查询税务机关
	 * @param provinceCode
	 * @return
	 */
	public List<Office> selectOfficeListByProvinceCode(@Param("provinceCode") String provinceCode);
	
	/**
	 * 查询税务机关的所有下级税务机关
	 * @param officeIds
	 * @return
	 */
	public List<Office> selectChildByOfficeIds(@Param("officeIds") String officeIds, @Param("loginUserId") Integer loginUserId);
	
}