package cn.com.jwy.common.utils;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.IndexedColors;

import cn.com.jwy.dto.sys.user.getuserlist.UserDto;
import cn.com.jwy.dto.warn.EnterpriseInfo;
import cn.com.jwy.enums.common.IsValidEnum;
import cn.com.jwy.enums.sys.user.UserTypeEnum;

public class ExportExcelUtil {
	
	/**导出企业异常开票预警信息*/
	public static void exportWarnList(String filename, List<EnterpriseInfo> infos, HttpServletResponse response) throws IOException {
		// 声明一个工作薄  
		HSSFWorkbook workbook = new HSSFWorkbook();
		// 生成一个表格  
		HSSFSheet sheet = workbook.createSheet(filename);
		// 设置表格默认列宽度
		for(int i=0;i<10;i++){
            sheet.setColumnWidth((short) i, (short) (35.7 * 150));
        }
		
		// 创建两种单元格格式
		HSSFCellStyle cs = workbook.createCellStyle();
		HSSFCellStyle cs2 = workbook.createCellStyle();
        // 创建两种字体
		HSSFFont f = workbook.createFont();
		HSSFFont f2 = workbook.createFont();
        f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.BLACK.getIndex());
        cs.setFont(f);
        f2.setFontHeightInPoints((short) 10);
        f2.setColor(IndexedColors.BLACK.getIndex());
        cs2.setFont(f2);
		
        // 创建第一行
        HSSFRow row_0 = sheet.createRow((short) 0);
        // 设置列名
        HSSFCell cell_0_0 = row_0.createCell(0);
        cell_0_0.setCellStyle(cs);
        cell_0_0.setCellValue("企业所属地");
        HSSFCell cell_0_1 = row_0.createCell(1);
        cell_0_1.setCellStyle(cs);
        cell_0_1.setCellValue("所属税务机关");
        HSSFCell cell_0_2 = row_0.createCell(2);
        cell_0_2.setCellStyle(cs);
        cell_0_2.setCellValue("企业名称");
        HSSFCell cell_0_3 = row_0.createCell(3);
        cell_0_3.setCellStyle(cs);
        cell_0_3.setCellValue("纳税人标识");
        HSSFCell cell_0_4 = row_0.createCell(4);
        cell_0_4.setCellStyle(cs);
        cell_0_4.setCellValue("税号");
        HSSFCell cell_0_5 = row_0.createCell(5);
        cell_0_5.setCellStyle(cs);
        cell_0_5.setCellValue("分机号");
        HSSFCell cell_0_6 = row_0.createCell(6);
        cell_0_6.setCellStyle(cs);
        cell_0_6.setCellValue("允许开票区域");
        HSSFCell cell_0_7 = row_0.createCell(7);
        cell_0_7.setCellStyle(cs);
        cell_0_7.setCellValue("预警区域");
        HSSFCell cell_0_8 = row_0.createCell(8);
        cell_0_8.setCellStyle(cs);
        cell_0_8.setCellValue("围栏状态");
        HSSFCell cell_0_9 = row_0.createCell(9);
        cell_0_9.setCellStyle(cs);
        cell_0_9.setCellValue("企业状态");
        // 设置每行每列的值
        if (infos != null && infos.size() > 0) {
        	for (int i=0; i<infos.size(); i++) {
            	EnterpriseInfo info = infos.get(i);
                // 创建一行，在页sheet上
            	HSSFRow row_i = sheet.createRow(i+1);
                // 在row行上创建一个方格
            	HSSFCell cell_i_0 = row_i.createCell(0);
                cell_i_0.setCellStyle(cs);
                cell_i_0.setCellValue(info.getRegion());
                HSSFCell cell_i_1 = row_i.createCell(1);
                cell_i_1.setCellStyle(cs);
                cell_i_1.setCellValue(info.getTaxStation());
                HSSFCell cell_i_2 = row_i.createCell(2);
                cell_i_2.setCellStyle(cs);
                cell_i_2.setCellValue(info.getCompanyName());
                HSSFCell cell_i_3 = row_i.createCell(3);
                cell_i_3.setCellStyle(cs);
                cell_i_3.setCellValue(info.getTaxPayerStatusCh());
                HSSFCell cell_i_4 = row_i.createCell(4);
                cell_i_4.setCellStyle(cs);
                cell_i_4.setCellValue(info.getTaxNum());
                HSSFCell cell_i_5 = row_i.createCell(5);
                cell_i_5.setCellStyle(cs);
                cell_i_5.setCellValue(info.getExtNum());
                HSSFCell cell_i_6 = row_i.createCell(6);
                cell_i_6.setCellStyle(cs);
                cell_i_6.setCellValue(info.getAllowRegion());
                HSSFCell cell_i_7 = row_i.createCell(7);
                cell_i_7.setCellStyle(cs);
                cell_i_7.setCellValue(info.getRecRegion());
                HSSFCell cell_i_8 = row_i.createCell(8);
                cell_i_8.setCellStyle(cs);
                cell_i_8.setCellValue(info.getFenceStatusCh());
                HSSFCell cell_i_9 = row_i.createCell(9);
                cell_i_9.setCellStyle(cs);
                cell_i_9.setCellValue(info.getEnterpriseStatusCh());
            }
        }
        
        filename = filename + ".xls";
	    response.setContentType("application/vnd.ms-excel");   
	    response.setHeader("Content-disposition", "attachment;filename=" + new String(filename.getBytes("utf-8"), "iso-8859-1"));   
	    OutputStream ouputStream = response.getOutputStream();   
	    workbook.write(ouputStream);   
	    ouputStream.flush();   
	    ouputStream.close();  
	    workbook.close();
    }
	
	/**导出用户列表
	 * @throws IOException */
	public static void exportUserList(String filename, List<UserDto> userDtos, HttpServletResponse response) throws IOException {
		// 声明一个工作薄  
		HSSFWorkbook workbook = new HSSFWorkbook();
		// 生成一个表格  
		HSSFSheet sheet = workbook.createSheet(filename);
		// 设置表格默认列宽度
		for(int i=0;i<8;i++){
            sheet.setColumnWidth((short) i, (short) (35.7 * 150));
        }
		
		// 创建两种单元格格式
		HSSFCellStyle cs = workbook.createCellStyle();
		HSSFCellStyle cs2 = workbook.createCellStyle();
        // 创建两种字体
		HSSFFont f = workbook.createFont();
		HSSFFont f2 = workbook.createFont();
        f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.BLACK.getIndex());
        cs.setFont(f);
        f2.setFontHeightInPoints((short) 10);
        f2.setColor(IndexedColors.BLACK.getIndex());
        cs2.setFont(f2);
		
        // 创建第一行
        HSSFRow row_0 = sheet.createRow((short) 0);
        // 设置列名
        HSSFCell cell_0_0 = row_0.createCell(0);
        cell_0_0.setCellStyle(cs);
        cell_0_0.setCellValue("账号");
        HSSFCell cell_0_1 = row_0.createCell(1);
        cell_0_1.setCellStyle(cs);
        cell_0_1.setCellValue("真实姓名");
        HSSFCell cell_0_2 = row_0.createCell(2);
        cell_0_2.setCellStyle(cs);
        cell_0_2.setCellValue("账户类型");
        HSSFCell cell_0_3 = row_0.createCell(3);
        cell_0_3.setCellStyle(cs);
        cell_0_3.setCellValue("手机号");
        HSSFCell cell_0_4 = row_0.createCell(4);
        cell_0_4.setCellStyle(cs);
        cell_0_4.setCellValue("数据权限");
        HSSFCell cell_0_5 = row_0.createCell(5);
        cell_0_5.setCellStyle(cs);
        cell_0_5.setCellValue("功能权限");
        HSSFCell cell_0_6 = row_0.createCell(6);
        cell_0_6.setCellStyle(cs);
        cell_0_6.setCellValue("状态");
        HSSFCell cell_0_7 = row_0.createCell(7);
        cell_0_7.setCellStyle(cs);
        cell_0_7.setCellValue("备注");
        // 设置每行每列的值
        if (userDtos != null && userDtos.size() > 0) {
        	for (int i=0; i<userDtos.size(); i++) {
            	UserDto userDto = userDtos.get(i);
                // 创建一行，在页sheet上
            	HSSFRow row_i = sheet.createRow(i+1);
                // 在row行上创建一个方格
            	HSSFCell cell_i_0 = row_i.createCell(0);
                cell_i_0.setCellStyle(cs);
                cell_i_0.setCellValue(userDto.getUsername());
                HSSFCell cell_i_1 = row_i.createCell(1);
                cell_i_1.setCellStyle(cs);
                cell_i_1.setCellValue(userDto.getRealName());
                HSSFCell cell_i_2 = row_i.createCell(2);
                cell_i_2.setCellStyle(cs);
                cell_i_2.setCellValue(UserTypeEnum.getValue(userDto.getUserType()));
                HSSFCell cell_i_3 = row_i.createCell(3);
                cell_i_3.setCellStyle(cs);
                cell_i_3.setCellValue(userDto.getPhone());
                HSSFCell cell_i_4 = row_i.createCell(4);
                cell_i_4.setCellStyle(cs);
                cell_i_4.setCellValue(userDto.getOfficeList());
                HSSFCell cell_i_5 = row_i.createCell(5);
                cell_i_5.setCellStyle(cs);
                cell_i_5.setCellValue(userDto.getMenuList());
                HSSFCell cell_i_6 = row_i.createCell(6);
                cell_i_6.setCellStyle(cs);
                cell_i_6.setCellValue(IsValidEnum.getValue(userDto.getIsValid() ));
                HSSFCell cell_i_7 = row_i.createCell(7);
                cell_i_7.setCellStyle(cs);
                cell_i_7.setCellValue(userDto.getRemark());
            }
        }
        
        filename = filename + ".xls";
	    response.setContentType("application/vnd.ms-excel");   
	    response.setHeader("Content-disposition", "attachment;filename=" + new String(filename.getBytes("utf-8"), "iso-8859-1"));   
	    OutputStream ouputStream = response.getOutputStream(); 
	    workbook.write(ouputStream);   
	    ouputStream.flush();   
	    ouputStream.close();  
	    workbook.close();
    }
	
}
