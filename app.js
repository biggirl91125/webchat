/**
 * Module dependencies.
 */
var express = require('express');
var net=require('net');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var connection= require('./models/db');
var userList=require('./models/userList');
var groupList=require('./models/groupList');
//ListenHandler用于处理客户端各种请求和信息
var ListenHandler = require('./models/listenHandler');
var buff=require('./models/buffer');
var log=require('./models/log');
var httpcli=require('./models/httpclient');
 
/**
 *公共变量
 */ 
var onlineUsers=new userList();//保存员工socket
var onlineGuests=new userList();//保存游客socket
var type;//客户端类型：pc端/移动端
var onlineGroups = new groupList(connection);//保存所有群组信息
//初始化群组
onlineGroups.initGroup();

/**
 *http服务器
 */
//创建应用并进行初始配置
var app = express();
log.use(app);
var port=process.env.PORT||3001;
app.configure(function(){
	app.set('port',port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	//app.use(express.bodyParser({uploadDir:'./uploadfiles'}));
	app.use(express.bodyParser());
	app.use(express.urlencoded()); 
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.static(path.join(__dirname, '/uploadfiles')));
});

routes(app);
var server1 = http.createServer(app);
var io = require('socket.io').listen(server1,{log:false});
 
//工作流请求（外部post请求）
app.post('/workflow',function(req,res){
	ListenHandler.workFlowHandler(req,res,onlineUsers,onlineGroups);
});
//坐席消息
app.post('/agent',function(req,res){
	ListenHandler.agentHandler(req,res,onlineGuests);
});
http.createServer(function(req,res){
	console.log(req.url+' '+'connected');
   
  var itv=setInterval(function(){
    res.write(new Date+'');
  },1000);
   
  req.connection.on('close',function(){
    console.log(req.url+' '+'disconnected');
    clearInterval(itv);
  });
}).listen(3001);
//服务器端socket
/*
io.sockets.on('connection',function(socket){
	//console.log(req.url+' '+'connected');
	type='WEB_SOCKET'; 
	var clientIp=socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
	console.log(socket.handshake);
	//每次有客户端连接时，向客户端请求其姓名，以便断网重连时不会丢失客户端
	socket.emit('reLogin');
	//接收登录请求，验证登录信息
	socket.on('login', function(data){
		ListenHandler.loginHandler(connection, data, socket,onlineGuests,onlineUsers,type); 
	});
	//接收企业组织结构请求
	socket.on('grpsCorp', function(data){ 
		ListenHandler.grpsCorpHandler(connection, data, socket,type);
	});
	//接收私信列表请求
	socket.on('users', function(data){ 
		ListenHandler.usersHandler(connection, data, socket,type);
	});
	//接收群组列表请求
	socket.on('groups', function(data){ 
		ListenHandler.groupsHandler(data, socket,onlineGroups,type);
	});
	//接收顾客咨询并转发
	socket.on('consult',function(data){
		ListenHandler.consultHandler(data, socket,type);
	});
	//接收内部私信消息并转发
	socket.on('message', function(data){ 
		ListenHandler.messageHandler(connection, data, socket, onlineUsers,type);
	});
	//接收群消息并群发
	socket.on('groupMessage', function(data){
		ListenHandler.groupMessageHandler(connection, data, onlineUsers,onlineGroups,socket,type);
	});
	//未读消息请求
	socket.on('unreadMessages', function(data){
		ListenHandler.unreadMessagesHandler(data, socket,type);
	});
	//接收文件传送消息
	socket.on('sendFile', function(data){
		ListenHandler.sendFileHandler(connection, data, socket, onlineUsers, onlineGuests,type);
	});
	//返回通话记录
	socket.on('convers',function(data){
		ListenHandler.conversHandler(connection,data,socket,onlineGroups,type);
	});	
	
	//接收建群请求
	socket.on('createGroup', function(data){
		ListenHandler.createGroupHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//接收编辑群组信息请求
	socket.on('editGroup', function(data){
		ListenHandler.editGroupHandler(socket, data, onlineUsers,onlineGroups,type);
	});	
	//接收删除群组请求
	socket.on('deleteGroup', function(data){
		ListenHandler.deleteGroupHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//接收添加成员请求
	socket.on('addMember',function(data){
		ListenHandler.addMemberHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//接收删除成员请求
	socket.on('delMember',function(data){
		ListenHandler.delMemberHandler(data, socket, onlineUsers,onlineGroups,type);
	});
	//接收员工登出消息  
	socket.on('logout',function(data){
		ListenHandler.logoutHandler(data, onlineUsers,onlineGuests,socket,type);
	});	
	//用户未通过登出按钮失去连接(断网、用户关闭页面)
	socket.on('disconnect',function(){ 
		ListenHandler.disconnectHandler(socket, onlineUsers,onlineGuests,type);
	});
	//管理员的消息事件
	socket.on('login_admin',function(data){
		ListenHandler.loginAdminHandler(connection, data, socket,onlineUsers,type); 
	});
	socket.on('members',function(data){
		ListenHandler.membersHandler(connection, data, socket,type);
	});
	socket.on('grps',function(data){
		ListenHandler.grpsHandler(data, socket,onlineGroups,type);
	});
});
app.configure('development', function(){
	app.use(express.errorHandler());
});
//处理未被捕捉的异常
process.on('uncaughtException', function(err){
	console.log(err);
}); 
server1.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
 */
/**
 *tcp服务器
 */
var server2=net.createServer();
server2.on('connection',function(socket){
	console.log('got a new connection');
	type='SOCKET';
	var buf=new buff(1024);
	socket.on('data',function(data){
		console.log('got data:'+data);
		buf.setCont(data);
		console.log(buf.getLen());
		while(buf.length){
			var info=buf.get();
			if(info){
				console.log(info);
				//正则化数据
				regularize(socket,info,type);
			}
		}
		
	});
	socket.on('close',function(){
		console.log('connection closed');
		ListenHandler.disconnectHandler(socket, onlineUsers, onlineAgents,onlineGuests, help,type);
		console.log('del socket');
	});
});
server2.on('error',function(err){
	console.log('Server error:'+err.message);
});
server2.on('close',function(){
	console.log('Server closed!');
});

server2.listen(4002,function(){
	console.log('Tcp server listening on port 4002');
});
/**
 *辅助函数
 */
 function regularize(socket,data,type){
	var cmd_re=/(\w+)[:](.*)/;
	var cmd_match=cmd_re.exec(data);
			 
	if(cmd_match){
		var command=cmd_match[1];
		var args=cmd_match[2];
		args=JSON.parse(args);
		exec_cmd(socket,command,args,type);
	}
	 
 }
function exec_cmd(socket,command,args,type){
	console.log("command:"+command);
	switch(command){
		case 'login':
			ListenHandler.loginHandler(connection, args, socket,onlineAgents,onlineGuests,onlineUsers,type);
			break;
		case 'users':
			ListenHandler.usersHandler(connection, args, socket,type);
			break;
		case 'groups':
			ListenHandler.groupsHandler(args, socket,onlineGroups,type);
			break;
		case 'msg':
			ListenHandler.messageHandler(connection, args, socket, onlineUsers, onlineGuests, onlineAgents, help,type);
			break;
		case 'groupMsg':
			ListenHandler.groupMessageHandler(connection, args, onlineUsers,onlineGroups,socket,type);
			break;
		case 'unread':
			ListenHandler.unreadMessagesHandler(args, socket,type);
			break;
		case 'sendFile':
			ListenHandler.sendFileHandler(connection, args, socket, onlineUsers, onlineGuests, onlineAgents, help,type);
			break;
		case 'convers':
			ListenHandler.conversHandler(connection,args,socket,onlineGroups,type);
			break;
		case 'creGroup':
			ListenHandler.createGroupHandler(args, socket, onlineUsers,onlineGroups,type);
			break;
		case 'editGroup':
			ListenHandler.editGroupHandler(socket, args, onlineUsers,onlineGroups,type);
			break;
		case 'delGroup':
			ListenHandler.deleteGroupHandler(args.groupName,args.corpId, socket, onlineUsers,onlineGroups,type);
			break;
		case 'addMember':
			ListenHandler.addMemberHandler(args, socket, onlineUsers,onlineGroups,type);
			break;
		case 'delMember':
			ListenHandler.delMemberHandler(args, socket, onlineUsers,onlineGroups,type);
			break;
		case 'logout':
			ListenHandler.logoutHandler(args, onlineUsers, onlineAgents, help,socket,type);
			break;
	}
}

