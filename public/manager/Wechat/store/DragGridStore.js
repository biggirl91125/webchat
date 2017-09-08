Ext.define('Wechat.Store.DragGridStore',{	

	extend: 'Ext.data.Store', 
	
	alias : 'widget.DragGridStore',


	fields: [
		{
			name: 'employee_id',
			type: 'string'
		}, 
		{
			name: 'chinese_name',
			type: 'string'
		}
		, 
		{
			name: 'role_key',
			type: 'string'
		},
		{
			name: 'team',
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