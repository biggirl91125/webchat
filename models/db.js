var settings = require('./settings');
var Mysql = require('mysql');
var log=require('./log');

function db(){
	this.connection=Mysql.createConnection(settings);
	this.connection.connect(function(err){
		if(err)throw(err);
	});
}

//定期删除一个月之前的记录
db.prototype.monthStore=function(){
	
	//定期删除一个月之前私信消息
	setInterval(this.delMsgs.bind(this),7*24*60*60*1000);
	//定期删除一个月之前群组消息
	setInterval(this.delGroupMsgs.bind(this),7*24*60*60*1000);
};
db.prototype.delMsgs=function(){
	var query="delete from crm_im_msgs where time<date_sub(date(now()),interval 1 month);";
	this.connection.query(query,function(err){
		console.log('db1');
		if(err)log.writeErr(err);
	})
};
db.prototype.delGroupMsgs=function(){
	var query="delete from crm_im_groupmsgs where time<date_sub(date(now()),interval 1 month);";
	this.connection.query(query,function(err){
		console.log('db2');
		if(err)log.writeErr(err);
	})
};
var db=new db();
module.exports =db.connection;
//设定两个定时器
db.monthStore();