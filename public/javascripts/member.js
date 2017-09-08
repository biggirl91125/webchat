Ext.define('Member', {
	extend : 'Ext.grid.Panel',
	
	//border : false,
	hideHeaders      : true,
	columnLines      : false,
	title            : '会议成员',
	clicksToEdit     : 1,        //表示点击多少次数才可以编辑表格
	trackMouseOver   : true,     //鼠标在行上移动时显示高亮
	enableColumnMove : false,    //禁止用户拖动表头
	width            : 200,
	buttonAlign      : 'center',
	
	groupnum : 0,
	personnum: 0,
	
	receiver :{},

	store  : Ext.create('Ext.data.Store', {
		fields: ['text','employee_id','type'],
		proxy : {
			type   : 'memory',
			data   : {},
			reader : 'json'
		}
	}),
	
	columns  : [{dataIndex: 'text',width:100},
				{
					width  : 100,
					xtype  : 'actioncolumn',
					items  : [{
						iconCls : 'delete_node',
						tooltip : '删除',
						text    : '删除',  
						handler : function(grid, rowIndex)
						{
							var rowItem = grid.getStore().getAt(rowIndex);
							//console.info(rowItem);
							if(rowItem.raw.key != 'yes')
								grid.ownerCt.deleteMember(rowItem);
						}
					}]
				},	
	],
	
	initComponent : function(config){
		Ext.apply(this, config);
		
		this.store.removeAll();
		this.store.add({employee_id:Sender.senderInfo.employeeID,text:Sender.senderInfo.employeeName,type:'person',key:'yes'});

		this.buttons=[{ border : true,text : '发起会议', handler : this.launchmeet, scope : this}];
		msg.on('member',this.addmember,this);
		
		this.callParent(arguments);
		return this;
	},
	
	deleteMember:function(record){
		this.store.remove(record);
		if(record.data.type =='person')
			this.personnum = this.personnum-1;
		else
			this.groupnum =this.groupnum-1;
	},

	addmember:function(data){
		console.info(data);
		for (i in data)
		{
			 if(this.store.find('employee_id',data[i].employee_id)<0)
			{
				 if(data[i].type=='person' && this.groupnum==0)
				{
					this.store.add({employee_id:data[i].employee_id,text:data[i].chinese_name,type:'person'});
					this.personnum+=1;
				}
				 else if(0<this.groupnum<1 && this.personnum == 0 )
				{
					 
					 this.store.add({employee_id:data[i].groupName,text:data[i].groupName,admin:data[i].admin,members:data[i].members,type:'group'});
					 this.groupnum+=1;
				 }
				 else
					 alert('群组只能单选');	 
			 }
		}
	},
	
	defaultmember:function(record){
		//console.info(record);
		this.receiver=record;
		if(record)
		{
			if(record.type == 'person')
			{
				this.store.add({employee_id:record.employee_id,text:record.text,type:'person',key:'yes'});
				this.personnum+=1;
			}
			else
			{
				this.store.removeAll();
				this.store.add({employee_id:record.employee_id,text:record.text,type:'person',key:'yes'});
				this.groupnum+=1;
			}
		}		
	},

	launchmeet:function(){
		alert('发起会议');
	}

});