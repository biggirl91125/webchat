Ext.define('Candidate', {
	extend : 'Ext.tree.Panel',
	
	//border : false,
	//collapsible : true,
	//collapsed   : true,
	hideHeaders : true,
	rootVisible : false,
	columnLines : true,
	buttonAlign : 'center',
	title       : '发起会议',
	width       : 200,
	
	
	listeners : {
		"afterrender":function(){
			msg.on("GroupsCandidata",this.GroupsCandidata,this);
			msg.on("PersonsCandidata",this.returnPersonsCandidata,this);

			msg.fireEvent("candidate");
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
		
		this.buttons=[{ border : true,text : '确定', handler : this.ensure, scope : this}];
		
		this.callParent(arguments);
		return this;
	},
	
	GroupsCandidata:function(data){
		console.info(data);
		for( i in data)
		{
			console.info(data[i]);
			for(j in this.getRootNode().childNodes)
			{
				if(data[i].groupType == 1)
				{
					if(this.getRootNode().childNodes[j].data.text == '公告组')
						this.getRootNode().childNodes[j].appendChild({
							text:data[i].groupName,
							employee_id:data[i].groupName,
							members:data[i].names,
							memberIds:data[i].Members,
							admin:data[i].chairMen,
							type:'anngroup',//1
							leaf:true,	
							id:data[i].groupName,
							checked : false 
						});
					
				}
				else if(data[i].groupType == 0)
				{
					if(this.getRootNode().childNodes[j].data.text == '普通群组')
						this.getRootNode().childNodes[j].appendChild({
							text:data[i].groupName,
							employee_id:data[i].groupName,
							members:data[i].Members,
							admin:data[i].chairMen,
							type:'group',//0
							leaf:true,
							id:data[i].groupName,
							checked : false 
						});
				}
			}
		}
		
	},

	returnPersonsCandidata:function(data){
		
		for(var i in data) 
		{
			
			this.getRootNode().appendChild({text: i,leaf: false,iconCls : 'personiconCls'});
			if(data[i] instanceof Array)
			{
				for(var j in data[i])
				{
					
					this.getRootNode().lastChild.appendChild({
						text:data[i][j].chinese_name,
						employee_id:data[i][j].employee_id,
						corp_id:data[i][j].corp_id,
						dept_id:data[i][j].dept_name,
						email_addr:data[i][j].email_addr,
						type:'person',//2
						leaf:true,
						id:data[i][j].employee_id,
						checked : false
					});
				}
			}
			else
			{
				for(var j in data[i])
				{
					this.getRootNode().lastChild.appendChild({text: j,leaf: false,iconCls : 'personiconCls'});
					for(var k in data[i][j])
						this.getRootNode().lastChild.lastChild.appendChild({
							text:data[i][j][k].chinese_name,
							employee_id:data[i][j][k].employee_id,
							corp_id:data[i][j][k].corp_id,
							dept_id:data[i][j][k].dept_name,
							email_addr:data[i][j][k].email_addr,
							type:'person',//2
							leaf:true,
							id:data[i][j][k].employee_id,
							checked : false
						});
				}
			}
		}	
		
	},
	
	ensure:function(){
		//console.info(this.getView().getChecked());
		var nodes = this.getView().getChecked();
		this.groups=[];
		this.person=[];
        for (var j = 0; j < nodes.length; j++) 
		{  
			if(nodes[j].raw.type=='groups')	  
			{
				this.groups.push({
					groupName:nodes[j].raw.text,
					admin:nodes[j].raw.admin,
					members:nodes[j].raw.members,
					type:'groups'
				});
			}
			else
			{
				this.person.push({
					chinese_name:nodes[j].raw.text,
					employee_id:nodes[j].raw.employee_id,
					type:'person'
				});
			}
      } 
	  if((this.groups.length>0 && this.person.length>0) || this.groups.length>1)
		  alert('群组只能单选');
	  else
	  {
		if(this.groups.length>0 && this.person.length==0)
			var data=this.groups;
		else
			var data=this.person;
		msg.fireEvent('member',data);
	  }
	}
	
})