Ext.define('Wechat.UI.Login.LoginForm',{
	extend:'Ext.panel.Panel',
			
	alias: 'widget.loginform',
									
	//layout:'fit',
	textAlign : 'center',
	height:186,
			
	items :[
			{
				value      : /*'2001'*/'',
				xtype      : 'textfield',
				labelStyle : 'font-size:15px;',
				fieldLabel : '工号',
				name       : 'emp_id',
				itemId     :  'emp_id',
				width      : 230,
				margin     : 15,
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
				itemId     : 'password',
				width      : 230,
				margin     : 15,
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
				itemId     : 'corpVccId',
				width      : 230,
				margin     : 15,
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
				itemId     : 'roleKey',
				width      : 230,
				margin     : 15,
				labelWidth : 70,
				allowBlank : false, blankText: '本栏不能空白',
				msgTarget  : 'qtip',
				items      :[
					/*{boxLabel:'坐席',name:'roleKey',inputValue:'ROLE_CC_AGENT'/*,checked:true},*/
					/*{boxLabel:'质检',name:'roleKey',inputValue:'ROLE_CRM_CORP_CONF_ADMIN'},
					{boxLabel:'经理',name:'roleKey',inputValue:'ROLE_CRM_CORP_MANAGE_ADMIN'}*/
					{boxLabel:'管理员',name:'roleKey',inputValue:'ROLE_CRM_ADMIN',checked:true}
					]
			}

		],
		buttons : [
			{ text : '登陆', itemId  :'submit',iconCls : 'search_grid',},
			{ text : '重置', itemId  :'reset',iconCls : 'search_grid',}
			]
			

})