/*
 * 文件名称：AbnormalInfoMapper.java
 */
package cn.com.jwy.mapper.warn;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import cn.com.jwy.common.mybatis.bean.MyMapper;
import cn.com.jwy.dto.warn.EnterpriseInfo;
import cn.com.jwy.model.warn.AbnormalInfo;

/**
 * 名称：
 * 模块描述：数据库表对应dao操作类
 * 作者：系统自动生成
 */
public interface AbnormalInfoMapper extends MyMapper<AbnormalInfo> {
	
	/**
	 * 预警企业列表
	 * @param whereSql
	 * @param start
	 * @param size
	 * @return
	 */
	public List<EnterpriseInfo> selectEnterpriseInfoList(@Param("whereSql") String whereSql, @Param("start") int start, @Param("size") int size);
	
	/**
	 * 预警企业数量
	 * @param whereSql
	 * @return
	 */
	public int selectEnterpriseInfoCount(@Param("whereSql") String whereSql);
	
}