Ext.define('Wechat.Store.TeamsStore',{	

	extend: 'Ext.data.ArrayStore', 
	
	alias : 'widget.TeamsStore',


	fields: [
		{
			name: 'teamdisplay',
			type: 'string'
		},
		{
			name: 'teamvalue',
			type: 'string'
		}
	],
	autoLoad: true
			
});	