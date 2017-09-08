View=function(msg){
	this.msg=msg;
	this.msg.on("div",this.createDiv,this);
	this.msg.on("loginUI",this.loginUI,this);
	this.msg.on("loginResponse",this.loginResponse,this);
	this.msg.on("returnPersons",this.returnPersons,this);
	this.msg.on("returnGroups1",this.returnGroups1,this);
	this.msg.on("returnGroups2",this.returnGroups2,this);
	this.msg.on("recMsg",this.recMsg,this);
	this.msg.on("recGroupMsg",this.recGroupMsg,this);
	this.msg.on("recUnreadMsg1",this.recUnreadMsg1,this);
	this.msg.on("recUnreadMsg2",this.recUnreadMsg2,this);
	this.msg.on("recFile",this.recFile,this);
	this.msg.on("retConversations_per",this.retConversations_per,this);
	this.msg.on("retConversations_gro",this.retConversations_gro,this);
	this.msg.on("addGroup_res",this.addGroup,this);
	this.msg.on("delGroup_res",this.delGroup,this);
	this.msg.on("editGroup_res",this.editGroup,this);
	this.msg.on("logoutRes",this.logout,this);
	this.msg.on("reconnectSucceed",this.reconnectSucceed,this);
	this.msg.on("appoint",this.appoint,this);
	this.msg.on("sendMsg_succeed",this.sendMsg_succeed,this);
	this.msg.on("sendGroupMsg_succeed",this.sendGroupMsg_succeed,this);
	this.msg.on("saveWin",this.saveWin,this);
	this.msg.on("closeWin",this.closeWin,this);
	this.msg.on("unreadCount",this.unreadCount,this);
	this.msg.on("returnSession",this.returnSession,this);
};
View.prototype.reconnectSucceed=function(){
	alert("服务器连接成功！");
};
View.prototype.appoint=function(data){
	console.log("appoint"+data);
};
View.prototype.saveWin=function(data){
	console.log(data);
};
View.prototype.closeWin=function(data){
	console.log(data);	
};
View.prototype.unreadCount=function(id,count){
	console.log("un_id:"+id);
	console.log("un_count:"+count);
};
View.prototype.returnSession=function(data){
	console.log(data);
};
/**
 *创建用户列表
 */
View.prototype.returnPersons=function(data){
	var userList = data.users;
	for(var i=0;i<userList.length;i++){
		document.getElementById("userList").innerHTML+=userList[i].chinese_name+" ";
	}
};
/**
 *创建群组列表
 */
View.prototype.returnGroups1=function(data){
	console.log("1:"+data);
	document.getElementById('group_oth').innerHTML+=data.groupName+":";
	if(data.members){
		console.log("length:"+data.members.length);
		for(var i=0;i<data.members.length;i++){
			document.getElementById('group_oth').innerHTML+=data.members[i]+" ";
		}
	}
};
View.prototype.returnGroups2=function(data){
	console.log(data);
	document.getElementById('group_com').innerHTML+=data.groupName+":";
	if(data.members){
		console.log("length:"+data.members.length);
		for(var i=0;i<data.members.length;i++){
			document.getElementById('group_com').innerHTML+=data.members[i]+" ";
		}
	}
};

/**
 * 私信消息
 */
View.prototype.recMsg=function(data){
	console.log(data);
	document.getElementById('recMsg').innerHTML=data.sender+":"+data.content;
};
View.prototype.sendMsg_succeed=function(data){
	console.log(data);
};
/**
 * 群组消息
 */
View.prototype.recGroupMsg=function(data){
	document.getElementById('recGroupMsg').innerHTML=data.groupName+":"+data.content+"  ";
};
View.prototype.sendGroupMsg_succeed=function(data){
	console.log(data);
};
/**
 *未读消息
 */
 View.prototype.recUnreadMsg1=function(data){
	var msgList1=data.messages;
	for(var i=0;i<msgList1.length;i++){
		document.getElementById('unread_per').innerHTML+=msgList1[i].sender+":"+msgList1[i].content+"  ";
	}
 };
 View.prototype.recUnreadMsg2=function(data){
	var msgList2=data.messages;
	for(var i=0;i<msgList2.length;i++){
		document.getElementById('unread_gro').innerHTML+=msgList2[i].groupName+":"+msgList2[i].content+"  ";
	}
 };
/**
 *接收文件
 */
View.prototype.recFile=function(data){
	alert('file2');
	document.getElementById('recFile').innerHTML=data.sender+"发来文件"+data.fileName;
	window.open('/uploadfiles/'+data.fileName, '_blank');
};
/**
 *显示通话记录
 */
View.prototype.retConversations_per=function(data){
	console.log(data);
	var msgs=data.msgs;
	
	 
};
View.prototype.retConversations_gro=function(data){
	console.log(data);
	var msgs=data.msgs;
	for(var i=0;i<msgs.length;i++){
		document.getElementById('convers_gro').innerHTML+=msgs[i];
	}
};
/**
 *删除员工
 */
View.prototype.delEmp=function(data){
	console.log(data);
	document.getElementById('del').innerHTML=data.empId+" "+data.corpId;
};
/**
 *修改员工
 */
 View.prototype.editEmp=function(data){
	console.log(data);
	document.getElementById('edit').innerHTML=data.user.chinese_name+" "+data.user.role_key;
 };
 /**
 *添加群组
 */
 View.prototype.addGroup=function(data){
	console.log(data);
	document.getElementById('newG').innerHTML=data.groupName+" "+data.corpId;
 };
 /**
 *删除群组
 */
 View.prototype.delGroup=function(data){
	console.log(data);
	document.getElementById('deleted').innerHTML=data.groupName+" "+data.corpId;
 };
 /**
 *修改群组
 */
 View.prototype.editGroup=function(data){
	console.log(data);
	document.getElementById('updated').innerHTML=data.groupName+" "+data.corpId+" "+data.Members;
 };
 /**
 *登出
 */
 View.prototype.logout=function(data){
	console.log(data);
	//document.getElementById('exit').innerHTML=data;
 };
/**
 *登录成功
 */
View.prototype.loginResponse=function(data){
	if(data){ 
		//isLogin=true;
		alert("登录成功！");
		//document.getElementById('userinfo').innerHTML=data.name+" "+data.empId+" "+data.corpId+" "+data.roleKey;
	}else{
			alert('用户名或密码错误！');
	}
};
/**
 *登录界面
 */
 View.prototype.loginUI=function(){ 
	var msg=this.msg; 
	var username=new Ext.form.TextField({
		fieldLabel:'用户名',
		id:'empId',
		allowBlank:false,
		height:30
	});
	var password=new Ext.form.TextField({
		fieldLabel:'密码',
		id:'password',
		inputType:'password',
		allowBlank:false,
		height:30
	});
	var corpname=new Ext.form.TextField({
		fieldLabel:'企业名',
		id:'corpId',
		allowBlank:false,
		height:30
	});
	var radiogroup=new Ext.form.RadioGroup({
		fieldLabel:'职位',
		id:'roleKey',
		items:[
		{
			boxLabel:'坐席',
			name:'roleKey',
			inputValue:'ROLE_CC_AGENT',
			checked:true
		},
		{
			boxLabel:'质检',
			name:'roleKey',
			inputValue:'QA'
		},
		{
			boxLabel:'经理',
			name:'roleKey',
			inputValue:'manager'
		}
		]
	});
	var btn=new Ext.Button({
		text:'登录',
		handler:function(){
			var empId=login.getComponent('empId').value;
			var password=login.getComponent('password').value;
			var corpId=login.getComponent('corpId').value;
			var roleKey=login.getComponent('roleKey').lastValue.roleKey;
			//初始化逻辑
			var logic=new Logic(msg,empId,password,corpId,roleKey);
			msg.fireEvent('login');
		}
	});
	//登录表单
	var login=new Ext.form.Panel({
		title:'用户登录',
		renderTo:Ext.getBody(),
		id:'loginForm',
		width:400,
		height:250,
		draggable:true,
		frame:true,
		bodyPadding:'5 5 0',
		buttonAlign:'center',
		style:{
			marginLeft:'auto',
			marginRight:'auto',
			marginBottom:'auto',
			marginTop:'150px'
		},
		items:[username,password,corpname,radiogroup],
		buttons:[btn]
	});
 };