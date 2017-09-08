Ext.define('Msg', {
	extend      : 'Ext.util.Observable',
	
	constructor : function(config){
		Ext.apply(this, config);
		this.callParent(arguments);
	},	
	
});

var msg = Ext.create('Msg',{});