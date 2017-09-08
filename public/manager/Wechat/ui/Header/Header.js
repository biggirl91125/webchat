Ext.define('Wechat.UI.Header.Header',{
	extend : 'Wechat.UI.Basic.BasicPanel',
	alias   :'widget.headerpanel',
	border : false,
	frame  : false,
	border : true,
	header : false,
	
	//title  : '背景',
	region : 'north',
	//collapsible : true,
	//collapsed   : true,
	autoScroll  : true,
	height:60,
	bodyStyle: {  
		//background: '#ffc',  
		background: 'url(/images/logo-cintel.gif) no-repeat #FFFFFF',  
        padding: '10px'  
     },  
	//width :1250,
	
	constructor:function(config)
	{
		Ext.apply(this, config);
		
		this.callParent(arguments);
	}

})