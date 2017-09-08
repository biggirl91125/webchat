Ext.define('Wechat.UI.Basic.BasicWindow', {
	extend      : 'Ext.window.Window',
	alias       : 'widget.Window',
	
	width       : 360,
	height      : 240,
	title       : 'Wechat Window',
	layout      : 'fit', //'vbox' 'column'
	closable    : true,
	modal       : true,
	plain       : false,
	
	//collapsible : false,
	closeAction : 'close',
	labelAlign  : 'right',
	buttonAlign : 'right',
	floating    : true,
    frame       : true,
	border      : true,
	
	resizable   : false,
	draggable   : false,

	shadow      : false,
	padding     : '15px 15px',
	items       : [],
	
	constructor : function(config){
		Ext.apply(this, config);
		this.callParent(arguments);
	}
});