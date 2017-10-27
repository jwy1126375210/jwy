package cn.com.jwy.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormatUtil {
	
	private static final SimpleDateFormat sdfNormal = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static final SimpleDateFormat sdfYmd = new SimpleDateFormat("yyyy-MM-dd");
	private static final SimpleDateFormat sdfNormalChinese = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒");
	private static final SimpleDateFormat sdfYmdChinese = new SimpleDateFormat("yyyy年MM月dd日");
	
	public static Date getDateByNormal(String str) throws ParseException {
		return sdfNormal.parse(str);
	}
	
	public static String getStrByNormal(Date date){
		return sdfNormal.format(date);
	}
	
	public static Date getDateByYmd(String str) throws ParseException{
		return sdfYmd.parse(str);
	}
	
	public static String getStrByYmd(Date date){
		return sdfYmd.format(date);
	}
	
	public static Date getDateByNormalChinese(String str) throws ParseException{
		return sdfNormalChinese.parse(str);
	}
	
	public static String getStrByNormalChinese(Date date){
		return sdfNormalChinese.format(date);
	}
	
	public static Date getDateByYmdChinese(String str) throws ParseException{
		return sdfYmdChinese.parse(str);
	}
	
	public static String getStrByYmdChinese(Date date){
		return sdfYmdChinese.format(date);
	}
	
}
