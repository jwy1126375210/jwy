package cn.com.jwy.common.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class CommonUtil {

	/**
	 * 拆分逗号隔开字符串，转成list
	 * @param ids
	 * @return
	 */
	public static List<Integer> StringToIntegerList(String ids){
		List<Integer> idLIst = new ArrayList<Integer>();
		if (StringUtils.isNotEmpty(ids)) {
			String[] array = ids.split(",");
			for (String idStr : array) {
				Integer id = Integer.valueOf(idStr);
				idLIst.add(id);
			}
		}
		return idLIst;
	}
	
}
