Ext.define('Detail', {
	extend : 'Ext.window.Window',
	
	title  : '详细资料',
	border : true,
	frame  : true,
	width  : 300,
	height : 230,
	draggable : true,
	buttonAlign : 'center',
	layout : {
		type    : 'table',
		columns : 1
	},
	autoScroll  : true,
	
	receiver    : {},

	config:{
      type:'',
    },

	initComponent:function(){
		var me=this;
		if(me.getType()=='person')
		{
			this.items=[
			{	
				xtype      : 'displayfield',
				fieldLabel : '姓名',
				itemId     : 'name',
				readOnly   : true,
				labelAlign : 'right',
				height     : 25,
				padding    : 0,
				value      : '',
				flex       : 1},
			{
				xtype      : 'displayfield',
				fieldLabel : '工号',
				itemId     : 'emId',
				readOnly   : true,
				labelAlign : 'right',
				height     : 25,
				padding    : 2,
				value      : '',
				flex       : 1},
			{
				xtype      : 'displayfield',
				fieldLabel : '公司',
				itemId     : 'company',
				readOnly   : true,
				labelAlign : 'right',
				height     : 25,
				padding    : 2,
				value      : '',
				flex       : 1},
			{
				xtype      : 'displayfield',
				fieldLabel : '部门',
				itemId     : 'department',
				readOnly   : true,
				labelAlign : 'right',
				height     : 25,
				padding    : 2,
				value      : '',
				flex       : 1},
			{
				xtype      : 'displayfield',
				fieldLabel : '邮箱',
				itemId     : 'email',
				readOnly   : true,
				labelAlign : 'right',
				height     : 25,
				padding    : 2,
				value      : '',
				flex       : 1},
			];
		}
		else
		{
			this.items=[];
		}
		this.buttons=[{ text : '消息', handler : this.sendMsg, scope : this}];
		this.callParent(arguments);
		return this;
	},

	fillPersonDataField : function(record){
		this.receiver=record;
		this.down('#name').setValue(record.text);
		this.down('#emId').setValue(record.employee_id);
		this.down('#company').setValue(record.corp_id);
		this.down('#department').setValue(record.dept_id);
		this.down('#email').setValue(record.email_addr);

	},
	
	fillGroupDataField :function(record){
		this.receiver=record;
		for(i in record.members)
		{
			if(i==0)
			{
				this.add({
					xtype      : 'displayfield',
					fieldLabel : '群成员',
					readOnly   : true,
					labelAlign : 'right',
					height     : 25,
					padding    : 2,
					value      : record.members[i],
					flex       : 1
				})
			}
			else
			{
				this.add({
					xtype      : 'displayfield',
					fieldLabel : '   ',
					labelSeparator : '',
					readOnly   : true,
					labelAlign : 'right',
					height     : 25,
					padding    : 2,
					value      : record.members[i],
					flex       : 1
				})
			}
		}
	},
	fillannGroupDataField :function(record){
		this.receiver=record;
		this.add({
					xtype      : 'displayfield',
					fieldLabel : '管理员',
					readOnly   : true,
					labelAlign : 'right',
					height     : 25,
					padding    : 2,
					value      : record.admin[0].substr(12),
					flex       : 1
				});
		for(i in record.members)
		{
			if(record.memberIds[i] != record.admin[0])
				if(i == 0 || i == 1)
					this.add({
						xtype      : 'displayfield',
						fieldLabel : '群成员',
						readOnly   : true,
						labelAlign : 'right',
						height     : 25,
						padding    : 2,
						value      : record.members[i],
						flex       : 1
					});
				else
					this.add({
						xtype      : 'displayfield',
						fieldLabel : ' ',
						labelSeparator : '',
						readOnly   : true,
						labelAlign : 'right',
						height     : 25,
						padding    : 2,
						value      : record.members[i],
						flex       : 1
					});
		}
	},

	sendMsg:function(){
		this.close();
		//console.info(this.receiver);
		msg.fireEvent('countClear',this.receiver.employee_id);
		msg.fireEvent('clearRender',this.receiver);
		msg.fireEvent('clearunreadCount',this.receiver.employee_id);
		if(!Ext.getCmp(this.receiver.employee_id+'form'))
		{	
			if(winInfo.length != 0)
			{
				Ext.getCmp(winInfo[0]).close();
				Ext.Array.splice(winInfo,'0',1);
			}
			var conversation=Ext.create('Conversation',{id:this.receiver.employee_id+'form'});
			conversation.setReceiver(this.receiver);
			conversation.showAt(600,120);
			winInfo.push(this.receiver.employee_id+'form');
		}
		else
		{
			if(winInfo.length != 0)
			{
				Ext.getCmp(winInfo[0]).close();
				Ext.Array.splice(winInfo,'0',1);
			}
			Ext.getCmp(this.receiver.employee_id+'form').show();
			msg.fireEvent('winOpen',this.receiver.employee_id);
			winInfo.push(this.receiver.employee_id+'form');
		}			
	}
});