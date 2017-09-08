Ext.define('Guest', {

	constructor:function(config){
		Ext.apply(this,config);
		
		//var employeeID = this.employeeID;
		var password = this.password;
		var corpname = this.corpname;
		var roleKey = this.roleKey;
		var employeeID ='000010'+corpname+this.employeeID;
		
		Sender.senderInfo={employeeID:employeeID,password:password,corpname:corpname,roleKey:roleKey};
		
		//初始化逻辑
		var see=new session(msg);
		//console.info(msg);
		var store=new MsgStore(msg,employeeID);
		var logic=new Logic(msg,corpname,roleKey,employeeID,password);
	
		msg.on("loginResponse",this.loginResponse,this);
		
		
			
	},
	
	submit:function(){
		msg.fireEvent('login');	
	},
	
	loginResponse:function(data){
		//console.info(data);
		if(data){
			if(data.id!='undefined')Sender.senderInfo.guestId=data.id;
			if(!Ext.getCmp(Sender.senderInfo.guestId+'form'))
			{
				//Sender.senderInfo.employeeID
				var guest=Ext.create('guestConversation',{id:Sender.senderInfo.guestId+'form'});
				guest.setReceiver();
				guest.showAt(400,50);
			}
			else//Sender.senderInfo.employeeID
				Ext.getCmp(Sender.senderInfo.guestId+'form').showAt(400,50);
		}else{
			alert('请重新试一次！');
		}
		this.delloginResponse();
	},
	
	delloginResponse:function(){
		msg.un("loginResponse",this.loginResponse,this);
	}
	
})