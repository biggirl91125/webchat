var Group=require('./groups');
var log=require('./log');
function groupList(con)
{
	this.initial=true;
	this.connection=con;
	this.corp = [];
	this.group = {};
};
module.exports = groupList;
//添加群组
groupList.prototype.addGroup = function(group){ 
	//console.log("add1");
	var index = this.indexOfCorp(group.corpId);
	if( index == -1){
		this.corp.push(group.corpId);
		this.group[group.corpId] = [];
	}	
	//console.log("add2");
	var index = this.indexOfGroup(group.corpId,group.groupName);
	if( index == -1 ){
		(this.group[group.corpId]).push(group);
		if(this.initial == false){
			this.saveAdd(group);
		}
	}
	else {
		(this.group[group.corpId])[index]=group;
		if(this.initial == false ){
			this.saveAdd(group);
		}
	}
}; 
//删除群组
groupList.prototype.delGroup = function(corpId,groupname){
	var index = this.indexOfGroup(corpId,groupname);  
	if(index == -1 )return -1; 
	(this.group[corpId]).splice(index,1);
		
	this.saveDel(corpId,groupname);
	return 1; 
};
//查找群组 
groupList.prototype.findGroup = function(corpId,groupname){ 
	var index = this.indexOfGroup(corpId,groupname);  
	if( index == -1 )return null; 
	return (this.group[corpId])[index];   
};
//查找该企业所有群组
groupList.prototype.findCorp=function(corpId){
	var index=this.indexOfCorp(corpId);
	if(index==-1)return null;
	return this.group[corpId];
};
//修改群组 
groupList.prototype.modifyGroup = function(group,newGrpName){
	 
	var index = this.indexOfGroup(group.corpId,group.groupName); 
	//console.log('index',index);
	if( index == -1 )return -1; 
	
	this.saveMod(group,newGrpName);
	
	if(newGrpName!=group.groupName)group.groupName=newGrpName;
	//console.log('group',group);
	(this.group[group.corpId])[index] = group;
	
	return 1;
};

/*********************  op index ******************/
//组索引					
groupList.prototype.indexOfGroup = function(corpId,groupname){		
	var index = this.indexOfCorp(corpId);
	if( index == -1 )return -1;	
	var index = -1;
	var u = this.group[corpId];
	//console.log('u',u);
	if( u == null )return -1;	
	for(var i=0;i<u.length;i++){
		if(u[i].groupName == groupname){
			index = i;
			break;
		}
	}
	//console.log('indexOfGroup',index);
	return index;
};
//企业索引
groupList.prototype.indexOfCorp = function(corpId){
	var index = -1;
	//console.log("len:"+this.corp.length);
	for(var i=0;i<this.corp.length;i++){
		if(this.corp[i] == corpId){
			index = i;
			break;
		}
	}
	//console.log("indexOfCorp:"+index);
	return index;
};
/*************对成员的操作****************/
//添加成员
groupList.prototype.addMember = function(corpId,groupname,empId,name,flage){	
	var v = this.findGroup(corpId,groupname);	
	if( v == null )return -1;	
	v.add(empId,name,flage);
	this.saveMod(v);
	return 1;
};
//删除成员
groupList.prototype.delMember = function(corpId,groupname,empId,name,flage){	
	var v = this.findGroup(corpId,groupname);	
	if( v == null )return -1;	
	v.del(empId,name,flage);
	this.saveMod(v);
	return 1;
};
//查找成员		
groupList.prototype.findMember = function(corpId,groupname,empId,flage){	
	var v = this.findGroup(corpId,groupname);	
	if( v == null )return -1;	
	return v.find(empId,flage);	
};
//获取成员列表
groupList.prototype.getMember = function(corpId,groupname,flage){	
	var v = this.findGroup(corpId,groupname);	
	if( v == null )return null;	
	return v.get(flage);	
};
//获取企业中包含该成员的群组
groupList.prototype.getgroupName = function(corpId,empId){
	//console.log(corpId);
	var index = this.indexOfCorp(corpId);
	//console.log("getGroupName:"+index);
	if( index == -1 )return null;	
	var gl = this.group[corpId];	
	var name = "";
	for(var i=0;i<gl.length;i++)
	{
		var v = gl[i].find(empId,false);
		if( v != null) name = name + gl[i].groupName + ",";		
	}
	if(name){
		name=name.substring(0,name.length-1);
		name=name.split(',');
	}
	return name;	
};

//初始化群组
groupList.prototype.initGroup = function(){
	this.initial = true;
	var query="select * from crm_im_groups;";
	this.connection.query(query,function(err, rows){
		if(err)
		{
			console.log("connect data error");
			log.writeErr(err);
			throw err;
			return;
		}		
		else if(!rows.length)
		{
			console.log("init group is zero");
			this.initial=false;
			return;
		}
		else {
			for(var i=0;i<rows.length;i++)
			{
				var Members=rows[i].Members.split(',');
				var chairMen=rows[i].chairMen.split(',');
				var names=rows[i].names.split(',');
				var group=new Group(rows[i].corp_id,rows[i].groupName,rows[i].groupType,Members,chairMen,names);
				
				this.addGroup(group);
			}
			console.log('init succeed');
			this.initial = false;
		}		
	}.bind(this));
	
};
/************数据库操作**************/
groupList.prototype.saveAdd=function(group){
	var query="insert into crm_im_groups(corp_id,groupName,groupType,Members,names,chairMen) values('"+group.corpId+"','"+group.groupName+"',"+group.groupType+",'"+group.Members+"','"+group.names+"','"+group.chairMen+"');";
	this.connection.query(query, function(err, result){
		if(err) log.writeErr(err);
	});
};
groupList.prototype.saveDel=function(corpId,groupname){
	var query="delete from crm_im_groups where corp_id='"+corpId+"' and groupName='"+groupname+"';"
	this.connection.query(query, function(err, result){
		if(err) log.writeErr(err);
	});
};
groupList.prototype.saveMod=function(group,newGrpName){
	var query="update crm_im_groups set groupName='"+newGrpName+"',groupType="+group.groupType+
	" ,Members='"+group.Members+"',chairMen='"+group.chairMen+"',names='"+group.names+
	"' where corp_id='"+group.corpId+"' and groupName='"+group.groupName+"';";
	this.connection.query(query, function(err, result){
		if(err) log.writeErr(err);
	});
};





