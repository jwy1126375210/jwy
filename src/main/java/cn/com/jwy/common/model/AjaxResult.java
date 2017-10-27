package cn.com.jwy.common.model;

public class AjaxResult {

	public static final int ERROR = -1;// 返回异常
	public static final int FAILURE = 0;// 调用失败
	public static final int SUCCESS = 1;// 调用成功
	
	private int code = FAILURE;// 返回结果类型 
	private String message;// 返回消息
	private Object result;// 返回数据
	
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Object getResult() {
		return result;
	}
	public void setResult(Object result) {
		this.result = result;
	}

}
