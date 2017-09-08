Ext.define('ContactList', {
	extend : 'Ext.tree.Panel',
	
	border : false,
	collapsible : true,
	hideHeaders : true,
	rootVisible : false,
	columnLines : true,
	title       : '通讯录',
	
	groups   : [],
	persons     : '',
	
	receiver    : {},

	dockedItems: [
		{	xtype:'toolbar',
			dock:'top',
			items:[
				'->',
				'<html><strong>通讯录</strong></html>',
				'->',
				{xtype  : 'button',
				 text   : '会议',
				handler : function()
				{
					var meet=Ext.create('Meeting',{});
					meet.showAt(600,120);
				}
			}
			]			
		},
		/*{
			xtype: 'toolbar',
			dock: 'top',
			items: [{
				fieldLabel: '搜索',   
                labelWidth: 30,   
                xtype: 'textfield',
				}]
		}*/			
	],
	
	listeners : {
		"itemclick":function(view,record,item,index,e,eOpts) 
			{
				if (record.get('leaf')) 
				{	
					//console.info(record.raw);
					/*var detail=Ext.create('Detail',{type:record.raw.type});
					if(record.raw.type=='person')
						detail.fillPersonDataField(record.raw);
					else if(record.raw.type=='group')
						detail.fillGroupDataField(record.raw);
					else
						detail.fillannGroupDataField(record.raw);
					detail.showAt(750,153);*/
					//console.log(record.raw);
					this.receiver=record.raw;
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
						//console.info("not exist",this.receiver,this.receiver.employee_id);
						var conversation=Ext.create('Conversation',{id:this.receiver.employee_id+'form'});
						conversation.setReceiver(this.receiver);
						conversation.showAt(600,120);
						winInfo.push(this.receiver.employee_id+'form');
					}
					else
					{
						if(winInfo.length != 0)
						{
							console.info(winInfo[0]);
							if(winInfo[0]!= (this.receiver.employee_id+'form'))
							{
								Ext.getCmp(winInfo[0]).close();
								Ext.Array.splice(winInfo,'0',1);
							}
						}
						console.info("exist1");
						Ext.getCmp(this.receiver.employee_id+'form').show();
						msg.fireEvent('winOpen',this.receiver.employee_id);
						console.info("exist2");
						winInfo.push(this.receiver.employee_id+'form');
					}
				}
		},

		"afterrender":function(){
			msg.fireEvent("alertsetRender","success");
		},
		
	},

	initComponent : function(config){
		Ext.apply(this, config);
		this.root={
            text: 'Root',
            expanded: true,
            children: [{
                text: '普通群组',
                leaf: false,
				iconCls : 'groupiconCls',
            }, {
                text: '公告组',
                leaf: false,
				iconCls : 'groupiconCls',
            }]
        };
		
		msg.fireEvent('groups');
		msg.fireEvent('persons');

		msg.on("returnGroups",this.returnGroups,this);
		msg.on("returnPersons",this.returnPersons,this);

		msg.on("setRender",this.setRender,this);//提示
		msg.on("clearRender",this.clearRender,this);//清除提示
		
		this.callParent(arguments);
		return this;
	},
	
	returnGroups:function(data){
		this.groups.push(data);
		//console.info(data);
		for(i in this.getRootNode().childNodes)
		{
			if(data.groupType == 1)
			{
				if(this.getRootNode().childNodes[i].data.text == '公告组')
					this.getRootNode().childNodes[i].appendChild({
						text:data.groupName,
						employee_id:data.groupName,
						members:data.names,
						memberIds:data.Members,
						admin:data.chairMen[0],
						type:'anngroup',//1
						leaf:true,	
						id:data.groupName,
					});
				
			}
			else if(data.groupType == 0)
			{
				if(this.getRootNode().childNodes[i].data.text == '普通群组')
					this.getRootNode().childNodes[i].appendChild({
						text:data.groupName,
						employee_id:data.groupName,
						members:data.names,
						admin:data.chairMen[0],
						type:'group',//0
						leaf:true,
						id:data.groupName,
						//checked : false 
					});
			}
		}
	},

	returnPersons:function(data){
		console.info(data);
		this.persons=data;
		for(var i in data) 
		{
			//console.info(i);
			//console.info(data[i]);
			this.getRootNode().appendChild({text: i,leaf: false,iconCls : 'personiconCls'});
			if(data[i] instanceof Array)
			{
				for(var j in data[i])
				{
					//console.info(j);
					//console.info(data[i][j]);
					this.getRootNode().lastChild.appendChild({
						text:data[i][j].short_employee_id,
						employee_id:data[i][j].employee_id,
						corp_id:data[i][j].corp_id,
						dept_id:data[i][j].Group_Name,
						email_addr:data[i][j].email_addr,
						type:'person',//2
						leaf:true,
						id:data[i][j].employee_id,
					});
				}
			}
			else
			{
				for(var j in data[i])
				{
					//console.info(j);
					//console.info(data[i][j]);
					this.getRootNode().lastChild.appendChild({text: j,leaf: false,iconCls : 'personiconCls'});
					for(var k in data[i][j])
						this.getRootNode().lastChild.lastChild.appendChild({
							text:data[i][j][k].short_employee_id,
							employee_id:data[i][j][k].employee_id,
							corp_id:data[i][j][k].corp_id,
							dept_id:data[i][j][k].Group_Name,
							email_addr:data[i][j][k].email_addr,
							type:'person',//2
							leaf:true,
							id:data[i][j][k].employee_id,
						});
				}
			}
		}
		
		msg.on("candidate",this.candidate,this);
	},

	setRender:function(id,count,type,name){
		var child=this.getStore().getById(id);
		if(child.data.text.indexOf("black")>=0)
		{
			var newtext=child.data.text.replace("black","red");
			child.set('text',newtext);
			child.commit();
		}	
		else
		{
			var newtext="<font color=red>"+child.data.text+"</font>";
			child.set('text',newtext);
			child.commit();
		}
		while(child.parentNode != null){
			child.parentNode.expand();
			child=child.parentNode;
		}	
	},

	clearRender:function(data){
		var child=this.getStore().getById(data.employee_id);
		if(child && child.data.text.indexOf('red')>=0)
		{	
			var newtext=child.data.text.replace("red","black");
			child.set('text',newtext);
			child.commit();
		}				
	},
	
	candidate:function(){
		msg.fireEvent('GroupsCandidata',this.groups);	
		msg.fireEvent('PersonsCandidata',this.persons);	
	}
})