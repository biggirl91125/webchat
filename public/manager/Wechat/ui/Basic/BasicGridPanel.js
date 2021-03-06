Ext.define('Wechat.UI.Basic.BasicGridPanel', {
	extend : 'Ext.grid.Panel',

	frame  : true,
	collapsible      : true,     //是否在右上角显示收缩按钮
	hideHeaders      : false,
	columnLines      : true,
	rowLine          : true,
	clicksToEdit     : 1,        //表示点击多少次数才可以编辑表格
	animCollapse     : true,     //表示收缩（闭合）面板时，显示动画效果
	trackMouseOver   : true,     //鼠标在行上移动时显示高亮
	enableColumnMove : false,    //禁止用户拖动表头
	bodyStyle        : 'background-image:url(extui/images/all_bg.jpg); ',
	columns  : [],
	loadMask : true, 
	selType  : 'rowmodel',
	buttonAlign : 'center',
	
	constructor : function(config){
		Ext.apply(this, config);
		this.callParent(arguments);
	}
});