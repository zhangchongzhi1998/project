const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//console.log(pool);
//创建路由器对象
const r=express.Router();
//添加路由
//1.用户注册(post /reg)
r.post('/reg',(req,res)=>{
  //1.1获取post请求的数据
  let obj=req.body;
  console.log(obj);
  //1.2验证各项数据是否为空
  if(!obj.uname){//===''
    res.send({code:401,msg:'uname required'});
	return;//阻止函数往后执行，就会跳出函数
  }
  //添加其它3项验证
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
    return;
  }
  if(!obj.email){
    res.send({code:403,msg:'email required'});
	return;
  }
  if(!obj.phone){
    res.send({code:404,msg:'phone required'});
	return;
  }
  //1.3执行SQL命令
  pool.query('insert into xz_user set ?',[obj],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//成功
	res.send({code:200,msg:'reg suc'});
  });
});
//2.用户登录(post /login)
r.post('/login',(req,res)=>{
  //2.1获取post请求的数据
  let obj=req.body;
  console.log(obj);
  //2.2检测各项数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
	return;
  }
  //2.3执行SQL命令
  pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//根据结果判断是否登录成功
	//如果是空数组说明登录失败，否则说明登录成功
	if(result.length===0){
	  res.send({code:301,msg:'login err'});
	}else{
	  res.send({code:200,msg:'login suc'});
	}
  });
});
//3.检测用户是否存在(get /checkUser)
r.get('/checkUser',(req,res)=>{
  //3.1获取查询字符串传递的数据
  let obj=req.query;
  console.log(obj);
  //3.2检测是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	return;
  }
  //3.3执行SQL命令
  pool.query('select * from xz_user where uname=?',[obj.uname],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//如果结果是空数组表示没有此用户，可以使用；否则此用户存在，不可以使用
	if(result.length===0){
	  res.send({code:200,msg:'可以使用'});
	}else{
	  res.send({code:201,msg:'该用户已被注册'});
	}
  });
});
//4.修改用户(post /update)
r.post('/update',(req,res)=>{
  //4.1获取post请求的数据
  let obj=req.body;
  console.log(obj);
  //4.2验证各项数据是否为空
  //批量验证
  let i=400;//初始化变量，用于保存状态码
  for(let k in obj){
	i++;
	//k 属性名
	//obj[k] 属性值
    //console.log(k,obj[k]);
	//如果属性值为空，则提示对应的属性名是必须
    if(!obj[k]){
	  res.send({code:i,msg:k+' required'});
	  return;
	}
  }
  //4.3执行SQL命令
  pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//结果是对象，如果对象下的affectedRows为0表示修改失败，否则表示修改成功
	if(result.affectedRows===0){
	  res.send({code:301,msg:'update err'});
	}else{
	  res.send({code:200,msg:'update suc'});
	}
  });
});
//导出路由器对象
module.exports=r;