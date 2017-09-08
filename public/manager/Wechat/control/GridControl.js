Ext.define('Wechat.Control.GridControl', {
	db		 : null,

	groupstore	 : null,
	group	 : null,
	groupsgridID	 : "",
	groupsgridItemID : "",

	modifyItemID:"",
	dragstore : null,
	drag : null,
	draggridID : "",
	draggridItemID: "",
	modify:null,
	memberstore:null,
	member : null,
	membersgridID:"",
	membersgridItemID:"",
	oldgroupname:"",
	//teamsstore:null,
    
	createORedit : "create",//创建群组还是更改群组

	constructor : function(config) {
		
		console.info(config);
		this.group.bindStore(this.groupstore);		
		Wechat.obEvent.on('delGroupRes',this.delGroups,this);
		Wechat.obEvent.on('editGroupRes',this.editGroupRes,this);
		Wechat.obEvent.on('creGroupRes',this.creGroupRes,this);
		this.initGroupsControl();
    	
	},

	initGroupsControl:function(){
  		var v = [

			{itemId:this.groupsgridItemID + " #modify",event:"click",callback:this.modifyAction,scope:this},
			
			{itemId:this.groupsgridItemID + " #onedelete", event:"click",callback:this.onedeleteAction,scope:this},
			
  			{itemId:this.groupsgridItemID + " #registergroup", event:"click",callback:this.registergroupAction,scope:this},
  				
			{itemId:this.groupsgridItemID + " #batchdelete", event:"click",callback:this.batchdeleteAction,scope:this}
		  	
  		];  	
  		
		Wechat.eventOn(this.group,v,this);
    
  },
  initDragStore:function(config)
  {
		//Wechat.obEvent.fireEvent("members");
		this.drag=Ext.ComponentQuery.query(this.modifyItemID+" grid")[0];
		this.member=Ext.ComponentQuery.query(this.modifyItemID+" grid")[1];
		//this.teams=Ext.ComponentQuery.query(this.modifyItemID+" grid>toolbar>combo")[1];
		console.info(this.teams);
		this.drag.bindStore(this.dragstore);
		this.member.bindStore(this.memberstore);
		//this.teams.bindStore(this.teamsstore);

		this.initModifyControl();
  },
  initModifyControl:function()
  {
	  console.info( Ext.ComponentQuery.query(this.modifyItemID + " toolbar>button[text='查询']"));
		var v=[
			{itemId:this.modifyItemID,event:"collapse",callback:this.cancelAction,scope:this},
			{itemId:this.modifyItemID + " button#submit",event:"click",callback:this.submitAction,scope:this},
			{itemId:this.modifyItemID + " button#cancel",event:"click",callback:this.cancelAction,scope:this},
			{itemId:this.modifyItemID + " #membersgrid actioncolumn",event:"click",callback:this.deleteAction,scope:this},
			{itemId:this.modifyItemID + " toolbar>button[text='查询']",event:"click",callback:this.searchAction,scope:this},
			//{itemId:this.modifyItemID + " #membersgrid",event:"drop",callback:this.dropAction,scope:this}
		];
		Wechat.eventOn(this.modify,v,this);
		
		this.memberstore.addListener("add",this.memberschange,this);//监听已选择成员数据变化

  },
  /**********gridframework 操作*********************/
  modifyAction : function(grid,cell,rowIndex, colIndex){
	  Wechat.obEvent.fireEvent("members");
	  Wechat.obEvent.fireEvent("grpsCorp");
	  this.teams=Ext.ComponentQuery.query(this.modifyItemID+" grid>toolbar>combo")[1];
	  
	  this.createORedit="edit";
	  var record = grid.getStore().getAt(rowIndex);
	 // this.modify=Ext.ComponentQuery.query(this.modifyItemID)[0];
	  console.info(record);
	  //初始化已选名单和基本信息
	  this.oldgroupname=record.data.groupName;
	  Ext.ComponentQuery.query(this.modifyItemID+" textfield")[0].setValue(record.data.groupName);
	  Ext.ComponentQuery.query(this.modifyItemID+" textfield")[1].setValue(record.data.corpId);
	  var groupTye="0";
	   if(record.data.groupType == "1")
			 groupTye="公告组";
		  else
			 groupTye="普通组";
	  Ext.ComponentQuery.query(this.modifyItemID+" combobox")[0].setValue(groupTye);
	  Ext.ComponentQuery.query(this.modifyItemID+" textfield")[1].getEl().dom.readOnly =true ;
	  var memers=[];
	 //兼容数组的indexof方法
	 if (!Array.indexOf) 
	{  
		Array.prototype.indexOf = function (obj) {  
        for (var i = 0; i < this.length; i++) 
		{  
            if (this[i] == obj) {  
                return i;  
            }  
        }  
        return -1;  
		}  
	}  
	var Members=record.data.Members.split(",") ;
	var names=record.data.names.split(",") ;
	var chairMen=record.data.chairMen.split(",") ;
	  for(var j=0;j<Members.length;j++)
	  {
		   var person={};
			person.employee_id=Members[j];
			person.chinese_name=names[j];
			if(chairMen.indexOf(person.employee_id)>=0)
				person.chairMen = "是";
			else
				person.chairMen = "否";
			memers.push(person);
	  }
		
		console.info(memers);
		Wechat.obEvent.fireEvent('returnExistMembers',memers);
		this.modify.expand();
		//console.info(this.teams.store);
	},  
  
  onedeleteAction:function(grid,cell,rowIndex, colIndex){	
	  var record = grid.getStore().getAt(rowIndex);
	  var raws=[];
	  raws.push(record);
	  this.confirmDelete(raws);
  },
  
  registergroupAction:function(button,e,options){
	  Wechat.obEvent.fireEvent("members");
	  this.createORedit="create";
	  Ext.ComponentQuery.query(this.modifyItemID+" textfield")[1].setValue(Corp.CorpInfo.corpname);
	  this.modify.expand();
	},
  batchdeleteAction:function(button,e,options){
	  var grid=button.up('grid');	
	  var rows = grid.getView().getSelectionModel().getSelection();
	  var len = rows.length;
	  if(len<=0){
		  Ext.Msg.alert('系统提示', '请选择要删除的数据！');
		  return;
	 };
	 this.confirmDelete(rows);
  },
	confirmDelete:function(records)
	{
		var me = this;
		
		Ext.MessageBox.confirm("系统提示","确认删除吗？",
			function(btn,txt)
			{
				if(btn!="yes")return;
				var len = records.length;
				for(var i=0;i<len;i++)
				{
					var group={};
					group.groupName=records[i].data.groupName;
					group.groupType=records[i].data.groupType;
					Wechat.obEvent.fireEvent('delGroup',group);
				}		
			}  	
		);	
	},
	
  delGroups:function(data)
  {
	  if(data)
	  {
		  var rowItem=this.group.getStore().findRecord("groupName",data.groupName);
		  this.group.getStore().remove(rowItem);
	  }
  },
  editGroupRes:function(data)
  {
	  console.info(data);
	if(data)
	{
		var item=this.group.getStore().find("groupName",data.groupName);
		this.group.getStore().getAt(item).set('groupName', data.newGrpName);
		this.group.getStore().getAt(item).set('groupType', data.groupType);
		this.group.getStore().getAt(item).set('chairMen', data.chairMen);
		this.group.getStore().getAt(item).set('Members', data.Members);
		this.group.getStore().getAt(item).set('names', data.names);
		this.group.getStore().commitChanges();
		
	}
  },
 creGroupRes:function(data)
  {
		console.info(data);
		if(data)
	   {
			var Members=data.Members.split(",");
			var names=data.names.split(",");
			var chairMen=data.chairMen.split(",");
			var record={};
			record.Members=Members;
			record.names=names;
			record.chairMen=chairMen;
			record.corpId=data.corpId;
			record.groupName=data.groupName;
			record.groupType=data.groupType;
			console.info(this.group.getStore());
			console.info(this.group.getStore().find("groupName",data.groupName));
			if(this.group.getStore().find("groupName",data.groupName)>=0)
				Ext.MessageBox.confirm("系统提示","已存在"+data.groupName+",不要相同班组名",
					function(btn,txt)
					{
						if(btn!="yes")
							return;	
					} 
				);
			else
				this.group.getStore().add(record);
		}
  },
  /**********modifypanel 操作*********************/
 memberschange:function(store,records,index,eOpts )
{ 
	console.info(store.find("employee_id",records[0].raw.employee_id));
	console.info(store.indexOfTotal(records[0]));
	if(store.find("employee_id",records[0].raw.employee_id) !=store.indexOfTotal(records[0]) )
	{
		Ext.MessageBox.confirm("系统提示","已存在"+records[0].raw.employee_id+",不要重复添加",
				function(btn,txt)
				{
					if(btn!="yes")
						return;
					store.removeAt(index);		
				} 
		);
	}
},
 submitAction:function(button,e,options)
{
	
	var groupName = Ext.ComponentQuery.query(this.modifyItemID+" textfield")[0].getValue( ) ;
	var corpId = Ext.ComponentQuery.query(this.modifyItemID+" textfield")[1].getValue( ) ;
	var groupType = Ext.ComponentQuery.query(this.modifyItemID+" combobox")[0].getValue( );
	console.info(groupType);
	var Members=[];
	var chairMen=[];
	var names=[];
	var person=Ext.ComponentQuery.query(this.modifyItemID+" grid")[1].getStore();
	for(i in person.data.items)
	{
		Members.push(person.data.items[i].data.employee_id);
		names.push(person.data.items[i].data.chinese_name);
		if(person.data.items[i].data.chairMen == "是")
			chairMen.push(person.data.items[i].data.employee_id);
	}
	if(Members.length == 0)
		Ext.MessageBox.confirm("系统提示","群组成员不能为空!!!");
	else if(groupName=="")
		Ext.MessageBox.confirm("系统提示","群组名称不能为空!!!");
	else if(this.groupstore.find("groupName",groupName)>=0)
		Ext.MessageBox.confirm("系统提示","已存在该群组名，请使用不同的群组名!!!");
	else if(groupType ==  null)
		Ext.MessageBox.confirm("系统提示","群组类型不能为空!!!");
	else if(chairMen.length == 0)
		Ext.MessageBox.confirm("系统提示","群组管理员不能为空,请双击管理员修改管理员!!!");
	else
	{
		var data={};
		
		data.groupType=(groupType == "公告组"?"1":"0");
		data.Members=Members.join(",");
		data.chairMen=chairMen.join(",");
		data.names=names.join(",");
		data.corpId=corpId;
		
		console.info(data);
		if(this.createORedit == "edit")
		{
			data.groupName=this.oldgroupname;
			data.newGrpName=groupName;
			Wechat.obEvent.fireEvent("editGroup",data);
		}	
		else if(this.createORedit == "create")
		{
			data.groupName=groupName;
			Wechat.obEvent.fireEvent("addGroup",data);
		}
			
		this.cancelAction();
	}
	
 },
cancelAction:function()
 {
	//console.info("collapse");
	this.modify.collapse(Ext.Component.DIRECTION_RIGHT);
	Ext.ComponentQuery.query(this.modifyItemID+" textfield")[0].reset();
	Ext.ComponentQuery.query(this.modifyItemID+" textfield")[1].reset();
	Ext.ComponentQuery.query(this.modifyItemID+" combobox")[0].reset();
	Ext.ComponentQuery.query(this.modifyItemID + " #membersgrid")[0].getStore().removeAll();
 },
deleteAction:function(grid,cell,rowIndex, colIndex)
{
	var record = grid.getStore().getAt(rowIndex);
	Ext.MessageBox.confirm("系统提示","确认删除该组员吗？",
			function(btn,txt)
			{
				if(btn!="yes")
					return;
				grid.getStore().remove(record);		
			}  	
		);	
 },
searchAction:function(button,e,options)
{
	 var empid='';
	 var rolekey='';
	 var team='';
	 empid=Ext.ComponentQuery.query(this.modifyItemID+" grid>toolbar>textfield[fieldLabel='工号']")[0].getValue( );
	 rolekey=Ext.ComponentQuery.query(this.modifyItemID+" grid>toolbar>combo[fieldLabel='角色']")[0].getValue( );
	 //team=Ext.ComponentQuery.query(this.modifyItemID+" grid>toolbar>combo[fieldLabel='班组']")[0].getValue( );
	 team=Ext.ComponentQuery.query(this.modifyItemID+" grid>toolbar>textfield[fieldLabel='班组']")[0].getValue( );
	 console.info(empid);
	 console.info(rolekey);
	 if(empid == '' && rolekey == null && team == '')
		Ext.MessageBox.confirm("系统提示","查询条件不能为空",
			function(btn,txt)
			{
				if(btn!="yes")
					return;
			}  	 
	 );
	 else
	{
		var grid=button.up('grid');
		var store=grid.getStore();
		grid.getStore().filterBy(function(record)
			{
				if(empid.length != 0 && rolekey!=null && team!='')
					return record.get('employee_id') == empid && record.get('role_key') == rolekey && record.get('team') == team;  
				else if(empid.length != 0 && rolekey==null && team =='')
					return record.get('employee_id') == empid ;
				else if(empid.length == 0 && rolekey != null && team =='')
				{
					//console.info(rolekey);
					return  record.get('role_key') == rolekey; 
				}
				else if(empid.length == 0 && rolekey == null && team !='')
					return record.get('team') == team;
				else if(empid.length != 0 && rolekey!=null && team =='' )
					return record.get('employee_id') == empid && record.get('role_key') == rolekey;
				else if(empid.length != 0 && rolekey==null && team !='')
					return record.get('employee_id') == empid && record.get('team') == team;
				else if(empid.length == 0 && rolekey!=null && team !='')
					return record.get('role_key') == rolekey && record.get('team') == team; 
			});
	 }
}
});