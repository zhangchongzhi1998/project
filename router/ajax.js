const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
const r=express.Router();
//添加路由
//127.0.0.1:8080/ajax/test
//浏览器地址栏可以直接验证接口
//注意，浏览器地址栏只能发送get请求
//只能验证get接口
r.get("/test",(req,res)=>{
	console.log("接收到了前台请求.......");
	res.send("ajax接口测试");
})
//第二个测试接口
r.get("/t2",(req,res)=>{
	res.send("第二个ajax接口");
});
//带参数的get请求
r.get("/get_login",(req,res)=>{
	var _uname=req.query.uname;
	var _upwd=req.query.upwd;
	// res.send(_uname+"......"+_upwd);
	var sql="select * from xz_user where uname=? and upwd=?";
	pool.query(sql,[_uname,_upwd],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
	
});
//作业 原生http的get的登录
r.get("/home_get",(req,res)=>{
	var _uname=req.query.uname;
	var _upwd=req.query.upwd;
	var sql="select * from xz_user where uname=? and upwd=?";
	pool.query(sql,[_uname,_upwd],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//restful的get方法
//xhr.open("get",`/ajax/restful_get/${_uname}&${_upwd}`,true);
r.get("/restful_get/:uname-:upwd",(req,res)=>{
	var _uname=req.params.uname;
	var _upwd=req.params.upwd;
	var sql="select * from xz_user where uname=? and upwd=?";
	pool.query(sql,[_uname,_upwd],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//get的删除
r.delete("/del_user/:uid",(req,res)=>{
	var _uid=req.params.uid;
	var sql="delete from xz_user where uid=?";
	pool.query(sql,[_uid],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
})
//作业：查询所有用户
r.get("/alluser",(req,res)=>{
	var sql="select * from xz_user";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		console.log(typeof(result));
		res.send(result);
	});
});
//restful的post登录
r.put("/v1/post_login",(req,res)=>{
	var _uname=req.body.uname;
	var _upwd=req.body.upwd;
	console.log(_uname,_upwd);
	var sql="select * from xz_user where uname=? and upwd=?";
	pool.query(sql,[_uname,_upwd],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//导出路由器对象
module.exports=r;
//页面两个文本框，用户名和密码
//点击按钮，发送请求
//后台（/get_login）接收请求，把接收到的用户名和密码当做响应传递前台
