Ext.define('Wechat.UI.Login.LoginWindow',{
	extend:'Ext.window.Window',

	alias: 'widget.loginwindow',
			
	title:'管理员登陆',
								
	items:[],
		
	collapsible:true,

	closeAction : 'hide',

	constructor:function(config){
		
		var login=this.initLogin();
		this.items.push(login);
		Wechat.obEvent.on("loginResponse",this.loginResponse,this);
		this.callParent(arguments);
	},
	
	initLogin:function(){
		login = Ext.create("Wechat.UI.Login.LoginForm");	  				  	
		var v = [
			{itemId:"loginform button#submit", event:"click",callback:this.submitAction,scope:this},
			{itemId:"loginform button#reset", event:"click",callback:this.resetAction,scope:this}		
  		];  	
  
		Wechat.eventOn(login,v,this);
  
		return login;
	},

	submitAction:function(){
		
		var password= Ext.ComponentQuery.query("loginform textfield#password")[0].getValue();
		var corpname=Ext.ComponentQuery.query("loginform textfield#corpVccId")[0].getValue();
		var roleKey=Ext.ComponentQuery.query("loginform radiogroup#roleKey")[0].getChecked()[0].inputValue;
		var employeeID = Ext.ComponentQuery.query("loginform textfield#emp_id")[0].getValue();
		
		console.info(employeeID);
		console.info(password);
		console.info(corpname);
		console.info(roleKey);
		Corp.CorpInfo={corpname:corpname};
		var logic=new Logic(Wechat.obEvent,corpname,roleKey,'000010'+corpname+employeeID,password);
		Wechat.obEvent.fireEvent('login_admin');	
	},

	resetAction:function(){
		Ext.ComponentQuery.query("loginform textfield#emp_id")[0].reset();
		Ext.ComponentQuery.query("loginform textfield#password")[0].reset();
		Ext.ComponentQuery.query("loginform textfield#corpVccId")[0].reset();
		Ext.ComponentQuery.query("loginform radiogroup#roleKey")[0].reset();
	},
	
	loginResponse:function(data){
		console.info(data);
		if(data.isLogin == "success"){ 
			this.close();
			Wechat.obEvent.fireEvent('grps');
			var db=Ext.create('Wechat.Control.StoreControl');
			var gridframework = Ext.create("Wechat.UI.Container.GridFramework",{
    	  			db:db
    	  		});
		//gridframework.show();
		}else{
			alert('用户名或密码或企业号错误！');
		}
		this.delloginResponse();
	},
	
	delloginResponse:function(){
		Wechat.obEvent.un("loginResponse",this.loginResponse,this);
	}
})