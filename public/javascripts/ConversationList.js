Ext.define('ConversationList', {
	extend : 'Ext.grid.Panel',
	
	hideHeaders      : true,
	columnLines      : false,
	title			 : '会话',
	clicksToEdit     : 1,        //表示点击多少次数才可以编辑表格
	trackMouseOver   : true,     //鼠标在行上移动时显示高亮
	enableColumnMove : false,    //禁止用户拖动表头

	tbar     : [
		'->',
		'<html><strong>会话</strong></html>',
		'->',
	],
	flag : false,
	receiver : {},

	listeners : {
		'itemclick' : function(dataView, record, item, index, e) {	
			try {
				record.set('msgcount', 0);
				record.commit();
				this.receiver=record.raw;
				//console.info(this.receiver);
				msg.fireEvent('clearunreadCount',this.receiver.employee_id);
				msg.fireEvent('clearRender',this.receiver);
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
			catch (e) {
				if(typeof(console)!='undefined' && console != null)
					console.info(e);
			}
		},

		'itemcontextmenu':function(view, record, item, index, e, eOpts){
			e.preventDefault();    
			e.stopEvent();// 取消浏览器默认事件 
			var array = [{    
					text : '删除常用联系人',    
					handler : function(me) { 
						view.store.remove(record);  
					}
				}];    
			var nodemenu = new Ext.menu.Menu({    
				items : array    
			});    
			nodemenu.showAt(e.getXY());// 菜单打开的位置 
			msg.fireEvent('delConversation',record.raw.employee_id);
		}
	},
	initComponent : function(config){
		Ext.apply(this, config);
		
		this.columns=[{dataIndex: 'text',width:140},
				{dataIndex: 'msgcount',width:45,renderer:this.showUrd}
		],
		
		this.store=Ext.create('Ext.data.Store', {
			fields: ['text','employee_id','type','msgcount'],
			proxy : {
				type   : 'memory',
				data   : {},
				reader : 'json'
			}
		}),
		
		//msg.fireEvent('conversations');
		
		msg.on("unreadCount",this.addCon,this);//动态增加最近通话联系人
		//msg.on("retConversations_per",this.retConversations_per,this);
		//msg.on("retConversations_gro",this.retConversations_group,this);	
		msg.on('retConversations',this.retConversations,this);
		msg.fireEvent('localConversations');
		
	
		
		msg.on("countClear",this.countClear,this);
		msg.on("alertsetRender",this.alertsetRender,this);

		msg.on('returnSession',this.unreadSession,this);//未读
 

		this.callParent(arguments);
	},

	/*retConversations_per:function(data){
		for (i in data.msgs)
		{
			if(data.msgs[i].receiver == Sender.senderInfo.employeeID)
				this.store.add({employee_id:data.msgs[i].sender,text:data.msgs[i].sender_name,type:'person',msgcount:0});
			else
				this.store.add({employee_id:data.msgs[i].receiver,text:data.msgs[i].receiver_name,type:'person',msgcount:0});
		}
		msg.fireEvent('unreadMsg');
	},

	retConversations_group:function(data){
		for(i in data.msgs)
			if(data.msgs[i].groupType == 0)
				this.store.add({text:data.msgs[i].groupName,employee_id:data.msgs[i].groupName,type:'group',msgcount:0});
			else
				this.store.add({text:data.msgs[i].groupName,employee_id:data.msgs[i].groupName,admin:data.msgs[i].chairMen,type:'anngroup',msgcount:0});
		msg.fireEvent('unreadMsg');
	},
	*/
	retConversations:function(data){
		//console.info(data);	
		for(i in data)
		{
			if(data[i].ty == 2)
				this.store.add({employee_id:data[i].id,text:data[i].name,type:'person',msgcount:0});
			else if(data[i].ty == 0)
				this.store.add({text:data[i].id,employee_id:data[i].id,admin:data[i].admin,type:'group',msgcount:0});
			else
				this.store.add({text:data[i].id,employee_id:data[i].id,admin:data[i].admin,type:'group',msgcount:0});
		}
		msg.fireEvent('unreadMsg');
	},

	addCon:function(id,count,type,name){
		//console.info(id);
		//console.info(count);
		//console.info(type);
		//console.info(name);
		console.info(id);
		var index=this.store.find('employee_id',id);
		if(index >= 0)
		{
			var rec=this.store.getAt(index);
			rec.set('msgcount', count);
			rec.commit();
		}
		else 
		{
			if(type == 2)
				this.store.insert(0,{employee_id:id,text:name,type:'person',msgcount:count});
			else if(type == 0)
				this.store.insert(0,{employee_id:id,text:id,type:'group',msgcount:count});
			else if(type == 1)
				this.store.insert(0,{employee_id:id,text:id,admin:name,type:'anngroup',msgcount:count});
			else 
				this.store.insert(0,{employee_id:id,text:id,type:'guest',msgcount:count});
		}
		if(this.flag)
			msg.fireEvent('setRender',id,count,type,name);		
	},

	alertsetRender : function(data){
		if(data == 'success')
			this.flag = true;
	},

	showUrd : function(value){
		if(value == 0)
			return null;
		else if(value == 1)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 2)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 3)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 4)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 5)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 6)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 7)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 8)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 9)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value == 10)
			return '<span style=color:red;font-weight:bold;>'+value+'</span>';
		else if(value>10)
			return '<span style=color:red;font-weight:bold;>10+</span>';	 
	 },
	
	countClear:function(data){
		var index=this.store.find('employee_id',data);
		if(index >= 0)
		{
			var rec=this.store.getAt(index);
			rec.set('msgcount', 0);
			rec.commit();
		}
	},

	unreadSession:function(data){	
		msg.fireEvent('defaultmsg',data);
	}

});