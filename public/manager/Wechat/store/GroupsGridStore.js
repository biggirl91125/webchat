Ext.define('Wechat.Store.GroupsGridStore',{	

	extend: 'Ext.data.Store', 
	
	alias : 'widget.GroupsGridStore',


	fields: [
		{
			name: 'corpId',
			type: 'string'
		}, 
		{
			name: 'groupName',
			type: 'string'
		}
		, 
		{
			name: 'groupType',
			type: 'string'
		}
		, 
		{
			name: 'chairMen',
			type: 'string',
		}
		, 
		{
			name: 'Members',
			type: 'string'
		}
		, 
		{
			name: 'names',
			type: 'string'
		}
	],
	/* data : [
         {corpId: 'Ed',    groupName: 'Spencer',groupType:'1',chairMen:'chairMen',Members:'Members',names:'names'},
         {corpId: 'Ed',    groupName: 'Spencer',groupType:'1',chairMen:'chairMen',Members:'Members',names:'names'},
         {corpId: 'Ed',    groupName: 'Spencer',groupType:'1',chairMen:'chairMen',Members:'Members',names:'names'},
         {corpId: 'Ed',    groupName: 'Spencer',groupType:'1',chairMen:'chairMen',Members:'Members',names:'names'}
     ],
		*/		
	/*proxy: {
					
			type: 'ajax',
			getMethod : function() {
						return 'POST';
			},
			
			timeout: 900000,
					
			url: '../php/AGroup.php',//file:///C:/Users/fanghuihui/Desktop/grid/php/role.php?_dc=1431999558953
			async : false,
			
			//		extraParams : {},				
					
			reader: {
					type: 'json',
					root: 'root'
			}
	},*/


	autoLoad: true
			
});	