﻿Ext.define('LoginWin', {
	extend    : 'Ext.window.Window',
	alias     : 'CIN Login Window',
	title     : '企业通信系统登录窗口',
	closeAction : 'hide',
	initComponent:function(config){
		Ext.apply(this,config);
		this.items = [{
			xtype:'form',
			height:190,
			items:[
			{
				value      : /*'2001'*/'',
				xtype      : 'textfield',
				labelStyle : 'font-size:15px;',
				fieldLabel : '工号',
				name       : 'emp_id',
				itemId    : 'emp_id',
				width      : 240,
				margin     : 8,
				labelWidth : 70,
				allowBlank : false, blankText: '本栏不能空白',
				minLength  : 4, minLengthText: '坐席号应为4位',
				msgTarget  : 'qtip'},
			{
				value      : /*'111111'*/'',
				xtype      : 'textfield',
				fieldLabel : '密码',
				labelStyle : 'font-size:15px;',
				name       : 'password',
				itemId    : 'password',
				width      : 240,
				margin     : 8,
				labelWidth : 70,
				allowBlank : false, blankText: '本栏不能空白',
				minLength  : 0, minLengthText: '请输入密码',
				inputType  : 'password',
				submitValue : false,
				msgTarget  : 'qtip'},
			{
				value      : /*'900000'*/'',
				xtype      : 'textfield',
				labelStyle : 'font-size:15px;',
				fieldLabel : '企业号',
				name       : 'corpVccId',
				itemId    : 'corpVccId',
				width      : 240,
				margin     : 8,
				labelWidth : 70,
				allowBlank : false, blankText: '本栏不能空白',
				enforceMaxLength : true,
				minLength  : 6, minLengthText: '企业号应为6位',
				maxLength  : 6, maxLengthText: '企业号应为6位',
				msgTarget  : 'qtip'},
			{
				xtype      : 'radiogroup',
				labelStyle : 'font-size:15px;',
				fieldLabel : '职位',
				itemId    : 'roleKey',
				width      : 240,
				margin     : 8,
				labelWidth : 70,
				allowBlank : false, blankText: '本栏不能空白',
				msgTarget  : 'qtip',
				items      :[
					{boxLabel:'坐席',name:'roleKey',inputValue:'ROLE_CC_AGENT'/*,checked:true*/},
					{boxLabel:'质检',name:'roleKey',inputValue:'ROLE_CRM_CORP_CONF_ADMIN'},
					{boxLabel:'经理',name:'roleKey',inputValue:'ROLE_CRM_CORP_MANAGE_ADMIN'}
					]
				}
			],
			buttons : [
			/*{ text : '<font color=red>游客路口</font>', handler : this.guestsubmitAction,  scope : this},*/
			{ text : '登陆', handler : this.submitAction, scope : this, focusOnToFront : true},
			{ text : '重置', handler : this.resetAction,  scope : this}
			]
  
		}];
		//msg.on("loginResponse",this.loginResponse,this);
		this.callParent(arguments);
		return this;
	},
	submitAction : function(me){
		//msg.on("loginResponse",this.loginResponse,this);
		var employeeID=me.up('form').down('#emp_id').getValue();
		var password=me.up('form').down('#password').getValue();
		var corpname=me.up('form').down('#corpVccId').getValue();
		var roleKey=me.up('form').down('#roleKey').getChecked()[0].inputValue;
		
		
		var login=new Login({employeeID:employeeID,password:password,corpname:corpname,roleKey:roleKey});
		login.submit();
		//Sender.senderInfo={employeeID:'000010'+corpname+employeeID,password:password,corpname:corpname,roleKey:roleKey};
		
		//初始化逻辑
		/*var logic=new Logic(msg,corpname,roleKey,'000010'+corpname+employeeID,password);
		var see=new session(msg);
		var store=new MsgStore(msg,'000010'+corpname+employeeID);*/
		
		//msg.fireEvent('login');	
	},
	
	resetAction : function(me){
		me.up('form').down('#emp_id').reset();
		me.up('form').down('#password').reset();
		me.up('form').down('#corpVccId').reset();
		me.up('form').down('#roleKey').reset();
	},
	
	loginResponse:function(data){
		console.info(data);
		if(data.isLogin=='success'){ 
			Sender.senderInfo.employeeName=data.myName;
			this.close();
			var win=Ext.create('MaintabWin',{});
			win.showAt(400,120);
		}else{
			alert('用户名或密码或企业号错误！');
		}
	},
	/*guestsubmitAction:function(){
		//console.info('guest');
		//console.info(this.ip);	
		var guest=new Guest({employeeID:this.ip,password:'',corpname:'900000',roleKey:'GUEST'});
		this.close();
		guest.submit();
		
	}*/
}); 
 