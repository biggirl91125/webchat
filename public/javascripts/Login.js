Ext.define('Login', {
	constructor:function(config){
		Ext.apply(this,config);
		 
		//var employeeID = this.employeeID;
		var password = this.password;
		var corpname = this.corpname;
		var roleKey = this.roleKey;
		var employeeID ='000010'+corpname+this.employeeID;
		//初始化逻辑
		//console.log('LOGIN:',Login);
		//初始化电话条和坐席的交互模块
		//var cinccBar=new CINCCBar(msg,Login);
		var logic=new Logic(msg,corpname,roleKey,employeeID,password);
		Sender.senderInfo={employeeID:employeeID,password:password,corpname:corpname,roleKey:roleKey};
		msg.on("loginResponse",this.loginResponse,this);
			
	},
	
	submit:function(){
		msg.fireEvent('login');
	},
	loginResponse:function(data){
		console.log(data);
		if(data.isLogin=='success'){ 
			Sender.senderInfo.employeeName=data.myName;
			var see=new session(msg);
			var store=new MsgStore(msg,Sender.senderInfo.employeeID);
			Ext.create('MaintabWin',{id:Sender.senderInfo.employeeID+'tab'});
			var floatwin=Ext.create('FloatWin',{});
			floatwin.showAt(800,50);
		}else{
			alert('用户名或密码或企业号错误！');
		}
		this.delloginResponse();
	},
	delloginResponse:function(){
		msg.un('loginResponse',this.loginResponse,this);
	}
	
});