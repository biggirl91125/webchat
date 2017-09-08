var fs = require('fs');
var crypto = require('crypto');
var http = require('http');
var soap=require('soap');
var parseString = require('xml2js').parseString;
var structure = require('./structure');
var User=require('./users');
var userList=require('./userList');
var Group = require('./groups');
var groupList=require('./groupList');
var GroupMessage = require('./groupmessages');
var Message = require('./messages');
var log=require('./log');
//var tcp=require('./tcpclient');
function ListenHandler(){
}

module.exports = ListenHandler;


//登录处理
ListenHandler.loginHandler = function loginHandler(connection, data, socket,onlineGuests,onlineUsers,type){
	var user=new User(data.corpId,data.empId,data.roleKey,socket,data.password,type);
	//顾客登录
	if(data.roleKey=='GUEST'){
		onlineGuests.add(user);
		var data={isLogin:'success',id:socket.id};
		socket_send('loginResponse',data,socket,type);
		return;
	}
	//员工登录
	/**
	*明文密码需加密，密文则注释掉
	*/
	
	var md5 = crypto.createHash('md5');
	//var password = md5.update(user.password).digest('hex');
	var password=user.password;
	
	user.get(connection,function(err,u){
		var data;
		if(!u){
			console.log('not');
			data={isLogin:"failed"};
		}
		else if(u.login_pwd!=password){
			console.log(u.login_pwd,password);
			data={isLogin:"failed"};
		}
		else {
			//存储员工信息
			onlineUsers.add(user);
			//返回员工名		
			data={isLogin:"success",myName:u.chinese_name};
		}
		socket_send('loginResponse',data,socket,type);
	});	 
};
//管理员登录
ListenHandler.loginAdminHandler = function loginAdminHandler(connection, data, socket,onlineUsers,type){
	var user=new User(data.corpId,data.empId,data.roleKey,socket,data.password,type);
	var md5 = crypto.createHash('md5');
	var password = md5.update(user.password).digest('hex');
	if(data.roleKey=="ROLE_CRM_ADMIN"){
		user.getAdmin(connection,function(err,u){
			var data;
			if(!u){
				console.log('1');
				data={isLogin:"failed"};
			}
			else if(u.login_pwd!=password){
				console.log('2');
				console.log(u.Login_Pwd,password);
				data={isLogin:"failed"};
			}
			else {
				//存储员工信息
				onlineUsers.add(user);
				//返回员工名
				data={isLogin:"success",myName:u.Employee_Name};
			}
			socket_send('loginResponse',data,socket,type);
		});
	}
	else{
		var data={isLogin:"failed"};
		socket_send('loginResponse',data,socket,type);
	}
};
//团队成员列表
ListenHandler.membersHandler=function(connection, data, socket,type){
	var user=new User(data.corpId,data.empId);
	console.log("members");
	user.getAllMembers(connection,function(err, docs){
		if(err)throw(err);
		if(docs){
			socket_send('returnMembers',docs,socket,type); 
		}
	});
};

//团队群组列表
ListenHandler.grpsHandler=function(data, socket,onlineGroups,type){
	var groups=onlineGroups.findCorp(data.corpId);
	if(groups)socket_send('returnGrps',groups,socket,type);
};
//企业班组结构
ListenHandler.grpsCorpHandler=function(connection, data, socket,type){
	var user=new User(data.corpId,data.empId);
	user.getGrps(connection,function(err, docs){
		if(err)throw(err);
		if(docs){
			socket_send('returnGrpsCorp',docs,socket,type); 
		}
	});
};
//企业组织结构请求处理
ListenHandler.deptsHandler=function(connection, data, socket,type){
	var struct=new structure(data.corpId);
	struct.get(connection,function(err, docs){
		if(docs){
			var depts={};
			var temp={};
			//找出父部门，保存id和name的对应关系到temp数组，并删除父部门
			for(var i=0;i<docs.length;i++){
				if(docs[i].parent_id=='000'){
					var pname=docs[i].dept_name;
					var id=docs[i].dept_id;
					temp[id]=[];
					temp[id].push(pname);
					docs.splice(i,1);
					i--;
				}
			}
			
			//遍历剩下的数组，建立部门树
			for(var j=0;j<docs.length;j++){
				var id=docs[j].parent_id;
				var pname=temp[id][0];
				if(!depts[pname])depts[pname]=[];
				depts[pname].push(docs[j].dept_name);
			}
			socket.emit('returnDepts',depts);
		}
	});
};
//私信列表请求处理
ListenHandler.usersHandler = function usersHandler(connection, data, socket,type){ 
		/**
		 *数据库获取底层班组信息
		 *（员工部门和班组信息存在于两个表中，则需先获取企业组织结构）
		 */
		 /*
		var user=new User(data.corpId,data.empId);
		user.getAll(connection,function(err, docs){
			if(docs){
				var grps={};
				for(var i=0;i<docs.length;i++){
					var gname=docs[i].dept_name;
					if(!grps[gname])grps[gname]=[];
					grps[gname].push(docs[i]);
				}
				socket.emit('returnUsers',grps);
			}
		});
		*/
		console.log("users");
		//如果员工部门和班组信息在一个表上
		var user=new User(data.corpId,data.empId);
		user.getAll(connection,function(err, docs){
			if(err)throw(err);
			if(docs){
				console.log(docs[0].Group_Name);
				var grpName=docs[0].Group_Name;
				console.log(grpName);
				var grps={};
				grps[grpName]=[];
				for(var i=0;i<docs.length;i++){
					grps[grpName].push(docs[i]);
				}
				socket_send('returnUsers',grps,socket,type); 
			}
		});	
		
		/**
		 * SOAP接口获取底层班组信息
		 */
		 /*
		var url='http://192.168.2.176:8078/cin-cc-ws/services/AgentGrpService?wsdl';
		var args1={corpVccId:data.corpId};
		var grps={};
		soap.createClient(url, function(err, client){
			client.list(args1, function(err, result){
				for(var i=0;i<result.agentGrpContextArray.length;i++){
					var args2={corpVccId:data.corpId,agentGrpId:result.agentGrpContextArray[i].agentGrpId};
					if(!grps[args2.agentGrpId])grps[args2.agentGrpId]=[];
					client.listAgentMember(args2,function(err,res){
						socket.emit('returnUsers',res.agentCtxArray);
						//res.agentCtxArray.forEach(function(grp){
							//console.log(grp);
							//grps[args2.agentGrpId].push(grp);
						//});
						for(var j=0;j<res.agentCtxArray.length;j++){
							grps[args2.agentGrpId].push(res.agentCtxArray[j]);
						}
						socket.emit('returnUsers',grps);
					});
				}
			});
		});
		*/
};
//群组列表请求处理
ListenHandler.groupsHandler = function groupsHandler(data, socket,onlineGroups,type){ 
	var groups=onlineGroups.getgroupName(data.corpId,data.empId);
	if(groups){ 
		for(var i=0;i < groups.length; i++){				
			var group=onlineGroups.findGroup(data.corpId,groups[i]);
			if(group){
				socket_send('returnGroups',group,socket,type);
			}
		}
	}			 		 
};
//顾客咨询
ListenHandler.consultHandler=function consultHandler(data,socket,type){
	//数据中加入socket.id
	var time=new Date();
	time=dateFormat(time);
	var data={id:socket.id,sender:data.sender,sender_name:data.sender_name,corpId:data.corpId,content:data.content,time:time}; 
	//格式化数据
	var xmlBody=formatXML(data);
	console.log('xml',xmlBody);
	
	var options={
		port:14407,
		hostname:'211.150.71.180',
		path:'/MMC',
		method:'post',
		headers:{
			'Connection':'Keep-Alive',
			'Content-Type':'text/xml;charset=utf-8',
			'Content-Length':xmlBody.length
		}
	};
	
	var req=http.request(options,function(res){
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		var _data="";
		res.on('data', function (chunk){
			_data+=chunk;
			console.log('BODY: ' + chunk);
		
		});
		res.on('end', function(){
			console.log("REBOAK:",_data);
		});
		req.on('error', function(e){
			console.log('problem with request: ' + e.message);
		});
		//通知服务器消息发送成功
		socket_send('msg_succeed',data,socket,type);

	});
	//消息体内写入要传输的数据参数
	req.write(xmlBody+'\n');
	req.end();
	
};
//坐席服务处理
ListenHandler.agentHandler = function agentHandler(req,res,onlineGuests){
	var _data="";
	req.on("data",function(data){
		_data+=data;
		//解析XML并推送消息给顾客
		if(_data!="")parseXML(_data,onlineGuests); 
	});
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('OK');
};
//内部私信消息处理
ListenHandler.messageHandler = function messageHandler(connection, data, socket, onlineUsers,type){
	var time=new Date();
	time=dateFormat(time);
	var data={corpId:data.corpId,sender: data.sender,sender_name:data.sender_name,receiver:data.receiver,receiver_name:data.receiver_name, time:time, content: data.content};
	//通知服务器消息发送成功
	socket_send('msg_succeed',data,socket,type);
	
	//保存消息
	var message=new Message({
		sender:data.sender,
		sender_name:data.sender_name,
		receiver: data.receiver,
		receiver_name:data.receiver_name,
		content: data.content,
		corpId:data.corpId
	});
	message.save(connection,function(err){
		if(err) throw(err);
	});
	console.log(data.corpId,data.receiver);
	//员工通信 
	var rece=onlineUsers.find(data.corpId,data.receiver);
	console.log(rece);
	if(rece){
		socket_send('recMsg',data,rece.socket,rece.SOC_TYPE);
		return;
	}
	//保存到本地文件
	saveToFile(0,data.receiver,data);
};
//群消息处理
ListenHandler.groupMessageHandler = function groupMessageHandler(connection, data, onlineUsers,onlineGroups,socket,type){
	var time=new Date();
	time=dateFormat(time);
	var data={corpId:data.corpId,groupName:data.groupName,groupType:data.groupType,chairMen:data.chairMen,sender:data.sender,sender_name:data.sender_name,time:time,content:data.content};
	//通知服务器消息发送成功
	socket_send('groupMsg_succeed',data,socket,type);
	//保存群消息到数据库
	var groupMessage=new GroupMessage({
		groupName:data.groupName,
		groupType:data.groupType,
		sender:data.sender,
		sender_name:data.sender_name,
		content:data.content,
		corpId:data.corpId
	});
	groupMessage.save(connection,function(err){
		if(err) throw err;
	});
	
	//通知其他成员
	var memberList=onlineGroups.getMember(data.corpId,data.groupName,false);
	if(memberList){
		memberList.forEach(function(member){
			if(member!=data.sender){
				var rece=onlineUsers.find(data.corpId,member);
				if(rece){//成员已登录
					socket_send('recGroupMsg',data,rece.socket,rece.SOC_TYPE);
					return;
				} 
				//成员未登录，则保存至文件
				saveToFile(1,member,data); 
			}
		});
	}
};
//工作流请求处理
ListenHandler.workFlowHandler=function(req,res,onlineUsers,onlineGroups){
	//console.log('reqbody',req.body);
	//req中获取所需参数
	var params=req.body.params;
	console.log('params',params);
	var type=params.type;
	console.log('type',type);
	var corpId=params.corpId;
	var sender=params.sender;
	var receiver=params.receiver;
	var msgs=params.msgs;
	var sendTime;
	if(params.sendTime)sendTime=params.sendTime;
	else {
		sendTime=new Date();
		sendTime=dateFormat(sendTime);
	}
	//打包数据
	var data={type:type,corpId:corpId,sender:sender,receiver:receiver,msgs:msgs,time:sendTime};
	//根据消息类型进行处理
	switch(type){
		case 0://私信
			var receiver='000010'+corpId+receiver;
			var emp=onlineUsers.find(corpId,receiver);
			if(emp){
				console.log('online');
				socket_send('workflow',data,emp.socket,emp.SOC_TYPE);
			}
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.end('OK');
			break;
		case 1://公告
			var group=onlineGroups.findGroup(corpId,receiver);
			if(group){
				var memberList=group.Members;
				memberList.forEach(function(member){
					var rece=onlineUsers.find(corpId,member);
					if(rece){socket_send('workflow',data,rece.socket,rece.SOC_TYPE);}
					else saveToFile(2,member,data);
				});
			}
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.end('OK');
			break;
		case 2://群组
			var group=onlineGroups.findGroup(corpId,receiver);
			if(group){
				var memberList=group.Members;
				memberList.forEach(function(member){
					var rece=onlineUsers.find(corpId,member);
					if(rece){socket_send('workflow',data,rece.socket,rece.SOC_TYPE);}
					else saveToFile(3,member,data); 
				});
			}
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.end('OK');
			break;
		default:
			console.log('Default');
	}
	
};
//未读消息请求处理
ListenHandler.unreadMessagesHandler = function unreadMessagesHandler(data,socket,type){ 
	//获取未读私信消息
	readFromFile(0,data.empId,socket,type);
	//获取未读群组消息
	readFromFile(1,data.empId,socket,type);
	//后期添加未读工作流消息
};
//通话记录
ListenHandler.conversHandler=function conversHandler(connection,data,socket,onlineGroups,type){
	//查找私信通话记录
	var msg=new Message({
		sender:data.empId,
		sender_name:'',
		receiver:'',
		receiver_name:'',
		content:'',
		corpId:data.corpId
	});
	msg.get(connection,function(err,rec1){
		if(rec1){
			for(var i=0;i<rec1.length;i++){
				var sender=rec1[i].sender;
				var receiver=rec1[i].receiver;
				for(var j=i-1;j>=0;j--){
					if(sender==rec1[j].receiver&&receiver==rec1[j].sender){
						if(sender==data.empId)rec1.splice(j,1);
						else rec1.splice(i,1);
						i--;
					}
				} 
			}
			//websocket需要区分为returnPerConvers
			socket_send('returnConvers',rec1,socket,type);
		}
	});
	//查找群组通话记录
	var groupMsg=new GroupMessage({
		groupName:'',
		sender:data.empId,
		sender_name:'',
		content:'',
		corpId:data.corpId
	});
	groupMsg.get(connection,function(err,rec2){
		if(rec2){
			var groups=[];
			for(var i=0;i<rec2.length;i++){
				var exist=onlineGroups.findMember(data.corpId,rec2[i].groupName,data.empId,false);
				if(exist)groups.push(rec2[i]); 
			}
			//websocket需要区分为returnGroConvers
			socket_send('returnConvers',groups,socket,type);
		}
	});
	
};
//文件传送请求处理
ListenHandler.sendFileHandler = function sendFileHandler(connection,data,socket, onlineUsers, onlineGuests,type){
	/*
	if(data.sender_name=='GUEST'){
		if(!help[socket.id]){
			//随机安排一位坐席
			var agents=onlineAgents.findCorp(data.corpId);
			if(agents){
				var n = Math.floor(Math.random() * agents.length + 1)-1;
				help[socket.id]=agents[n];
			}
		}
		var cur_agent=onlineUsers.find(data.corpId,help[socket.id]);
        cur_agent.socket.emit('receFile', {sender:data.sender,id:socket.id,sender_name: data.sender_name,receiver:help[socket.id],fileName:data.fileName});
		return;
    }
	if(data.receiver_name=='GUEST')
    {
		var guests=onlineGuests.findCorp(data.corpId);
		for(var i=0;i<guests.length;i++)
		{
			var g=onlineGuests.find(data.corpId,guests[i]);
			if(g.socket.id==data.receiver)
			{
				g.socket.emit('receFile', {sender:'services',fileName:data.fileName});
				break;
			}
			else console.log("guest does not exist!");
		}
		return;
    }
	*/
	var rece=onlineUsers.find(data.corpId,data.receiver);
	if(rece)socket_send('recFile',data,rece.socket,rece.SOC_TYPE);	 
	else socket_send('recFile',data,socket,type);
};

//建群请求处理-----------------刷新
ListenHandler.createGroupHandler = function createGroupHandler(data, socket, onlineUsers,onlineGroups,type){
	 var members=data.Members.split(',');
	 var chairs=data.chairMen.split(',');
	 var names=data.names.split(',');
	 
	//将群组保存到数据库并添加到onlineGroups
	var group=new Group(data.corpId,data.groupName,data.groupType,members,chairs,names);	
	onlineGroups.addGroup(group);
	socket_send('newGroup_succeed',data,socket,type);
	//通知群成员界面更新
	members.forEach(function(member){
		var rece=onlineUsers.find(data.corpId,member);
		if(rece)socket_send('newGroup',data,rece.socket,rece.SOC_TYPE);
	});
};
//删除群组请求处理------------------刷新
ListenHandler.deleteGroupHandler = function deleteGroupHandler(data, socket, onlineUsers,onlineGroups,type){
	
	//通知群成员界面更新
	var memberList=onlineGroups.getMember(data.corpId,data.groupName,false);
	if(memberList){
		memberList.forEach(function(member){
			var rece=onlineUsers.find(data.corpId,member);
			if(rece)socket_send('delGroup',data,rece.socket,rece.SOC_TYPE);
		});
	}
	//从数据库和onlineGroups中删除群组
	onlineGroups.delGroup(data.corpId,data.groupName);	 
	socket_send('delGroup_succeed',data,socket,type);
};
//编辑群组信息请求处理-----------------刷新
ListenHandler.editGroupHandler = function editGroupHandler(socket, data, onlineUsers,onlineGroups,type){
	var members=data.Members.split(',');
	var chairs=data.chairMen.split(',');
	var names=data.names.split(',');
	
	//通知群成员
	//console.log(data.corpId,data.groupName);
	//console.log(onlineGroups);
	var memberList_org=onlineGroups.getMember(data.corpId,data.groupName,false);
	/*
	if(memberList){
		memberList.forEach(function(member){
			var rece=onlineUsers.find(data.corpId,member);
			if(rece)socket_send('updateGroup',data,rece.socket,rece.SOC_TYPE);	 
		});
	}
	*/
	//数据库和onlineGroups更新
	var group=new Group(data.corpId,data.groupName,data.groupType,members,chairs,names);	 
	onlineGroups.modifyGroup(group,data.newGrpName); 
	socket_send('updateGroup_succeed',data,socket,type);
	//console.log(data.corpId,data.newGrpName);
	//console.log(onlineGroups);
	var memberList_new=onlineGroups.getMember(data.corpId,data.newGrpName,false);
	//console.log(memberList_org,memberList_new);
	findMembersAndNotice(memberList_org,memberList_new,data,onlineUsers);
};
//添加群成员
ListenHandler.addMemberHandler = function addMemberHandler(data, socket, onlineUsers,onlineGroups,type){
	onlineGroups.addMember(data.corpId,data.groupName,data.empId,data.name,data.flag);
	socket_send('addMember_succeed',data,socket,type);
	//通知群成员 
	var memberList=onlineGroups.getMember(data.corpId,data.groupName,false);
	if(memberList){
		memberList.forEach(function(member){
			var rece=onlineUsers.find(data.corpId,member);
			if(rece)socket_send('add_member',data,rece.socket,rece.SOC_TYPE); 
		});
	}
};
//删除群成员
ListenHandler.delMemberHandler = function delMemberHandler(data, socket, onlineUsers,onlineGroups,type){
	onlineGroups.delMember(data.corpId,data.groupName,data.empId,data.name,data.flag);
	socket_send('delMember_succeed',data,socket,type);
	//通知群成员
	var memberList=onlineGroups.getMember(data.corpId,data.groupName,false);
	if(memberList){
		memberList.forEach(function(member){
			var rece=onlineUsers.find(data.corpId,member);
			if(rece)socket_send('del_member',data,rece.socket,rece.SOC_TYPE);
		});
	}
};
//登出请求处理
ListenHandler.logoutHandler = function logoutHandler(data,onlineUsers,onlineGuests,socket,type){
	//同非正常登出
	this.disconnectHandler(socket,onlineUsers,onlineGuests,type);
};
//非正常登出请求处理
ListenHandler.disconnectHandler = function disconnectHandler(socket, onlineUsers,onlineGuests,type){
	 
	//顾客登出
	var exist_guest=onlineGuests.delUserBySocket(socket.id);
	//员工登出
	var exist_user=onlineUsers.delUserBySocket(socket.id);
	
};
/**
 *辅助函数
 */
//存文件
function saveToFile(msg_type,empId,data){
	var path;
	switch(msg_type){
		case 0:	
			path='msgs/';
			break;
		case 1:
			path='groupMsgs/';
			break;
		case 2:
			path='notice/';
			break;
		case 3:
			path='comNotice/';
			break;
		default:
	}
	fs.exists('./unreadMessages/'+path+empId+'.txt', function(exists){
		if(exists){
			var contents=fs.readFileSync('./unreadMessages/'+path+empId+'.txt');
			contents=JSON.parse(contents);
			contents.push(data);
			fs.writeFileSync('./unreadMessages/'+path+empId+'.txt',JSON.stringify(contents));
		}else{
			var newMsg=[];
			newMsg.push(data);
			fs.writeFileSync('./unreadMessages/'+path+empId+'.txt',JSON.stringify(newMsg));
		}
	}); 
}
//读文件
function readFromFile(msg_type,empId,socket,type){
	var path;
	var event='recUnread';
	switch(msg_type){
		case 0:
			path='msgs/';
			if(type=='WEB_SOCKET')event='recMsg';
			break;
		case 1:
			path='groupMsgs/';
			if(type=='WEB_SOCKET')event='recGroupMsg';
			break;
		case 2:
			path='notice/';
			break;
		case 3:
			path='comNotice/';
			break;
		default:
	}
	fs.exists('./unreadMessages/'+path+empId+'.txt', function(exists){
		if(exists){
			var messages=fs.readFileSync('./unreadMessages/'+path+empId+'.txt');
			var messages=JSON.parse(messages);
			for(var i=0;i<messages.length;i++)
				socket_send(event,messages[i],socket,type);
			fs.unlinkSync('./unreadMessages/'+path+empId+'.txt');
		}
	});
}
//根据socket类型做出响应
function socket_send(msg_type,data,socket,type){
	if(type=='SOCKET'){
		console.log(msg_type);
		var data=JSON.stringify(data);
		console.log(data);
		var buf=msg_type+'#'+data;
		var sendData='['+buf.length+']'+buf;
		socket.write(sendData);
		console.log('ok');
		return;
	}
	socket.emit(msg_type,data);	
}
//格式化数据为xml
function formatXML(data){
	var xml="<mmc version=\"1.0\"><service name=\"wg_send_to_mmc\"><wg_send_to_mmc><type>01</type><userId>"+data.id+"</userId><vccPublicId>01"+data.corpId+"wc20150415</vccPublicId><vccId>"+data.corpId+"</vccId><msgType>text</msgType><content>"+data.content+"</content><timestamp>20140301090000</timestamp></wg_send_to_mmc></service></mmc>";
	return xml;
}
//解析XML并将消息推送给顾客
function parseXML(xml,onlineGuests){
	parseString(xml,function(err,result){
		var time=new Date();
		time=dateFormat(time);
		var service=result.mmc.service[0].mmc_send_to_wg[0];
		console.log('service',service);
		var content=new Buffer(service.content[0],'base64').toString();
		var agentInfo={corpId:service.vccId[0],sender:service.agent[0],sender_name:'services',receiver:service.userId[0],receiver_name:'GUEST',content:content,time:time};
		console.log('agentinfo',agentInfo);
		var guest=onlineGuests.findUser(agentInfo.corpId,'',agentInfo.receiver);
		if(guest)socket_send('recMsg',agentInfo,guest.socket,guest.SOC_TYPE);
		 
	});
}
function findMembersAndNotice(org,add,data,onlineUsers){
	for(var i=0;i<org.length;i++){
		var index=add.indexOf(org[i]);
		console.log('index',index);
		if(index==-1)add.push(org[i]);
	}
	console.log(add);
	add.forEach(function(member){
			var rece=onlineUsers.find(data.corpId,member);
			if(rece)socket_send('updateGroup',data,rece.socket,rece.SOC_TYPE);	 
	});
}
//设定日期显示格式
function dateFormat(time){
	var year=time.getFullYear();
	var month=time.getMonth()+1;
	var date=time.getDate();
	var hour=time.getHours();
	var minute=time.getMinutes();
	var second=time.getSeconds();
	var tmpTime=year+'/'+month+'/'+date+' '+hour+':'+minute+':'+second;
	return tmpTime;
}




















