Ext.define('MaintabWin', {
	extend      : 'Ext.window.Window',

	height      : 430,
    width       : 200,
	maxHeight   : 430,
	maxWidth    : 200,
	title       : '企业通信系统',
	layout      : 'fit',
	//closable    : false,
	closable    : true,
	closeAction : 'hide',
	
	listeners   : {
		"show":function(){
			msg.fireEvent('maintabOpen',Sender.senderInfo.employeeID+'tab');	
		},
		"close":function()
		{
			msg.fireEvent('maintabClose',Sender.senderInfo.employeeID+'tab');		
		}
	},

	items       : [
					{
						xtype: 'tabpanel',
						tabPosition: 'bottom',
						width:160,
						height:300,
						items:[],
					}
				],
	
	constructor : function(config){
		Ext.apply(this, config);

		var conv=Ext.create('ConversationList',{});
		var cont=Ext.create('ContactList',{});
		this.items[0].items.push(conv);
		this.items[0].items.push(cont);

		this.callParent(arguments);
	},
	
});