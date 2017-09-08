Ext.define('Wechat.UI.Basic.BasicPanel', {
	extend : 'Ext.panel.Panel',
	frame  : true,
	border : false,
	collapsible : false,
	autoScroll  : true,
	header : true,
	items  : [],


	layout : {
		type  : 'vbox',
		align : 'stretch'/*'center' 'stretch'*/
	},
	
	constructor : function(config){

		Ext.apply(this, config);

		this.callParent(arguments);
	}
})