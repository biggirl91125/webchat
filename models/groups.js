var log=require('./log');
function Group(corpId,groupname,grouptype,members,chairMen,names){
	this.corpId = corpId;	
	this.groupName = groupname;
	this.groupType=	grouptype;
	this.Members = members;
	this.chairMen = chairMen;
	this.names=names;
}
module.exports = Group;
 
//获取成员或会议主持
Group.prototype.get = function(chairflage){	
	var flag = chairflage===true;	
	if( flag == false)return this.Members;
	else return this.chairMen;
};
//增加成员或会议主持		
Group.prototype.add = function(empId,name,chairflage){		
	var flag = chairflage===true;				
	var exist = this.indexOf(empId,chairflage);	
	if( exist != -1 )return;	
	if(flag)this.chairMen.push(empId);
	this.Members.push(empId);
	this.names.push(name);
};
//查找成员
Group.prototype.find = function(empId,chairflage){	
    var flag = chairflage===true;	
	var exist = this.indexOf(empId,chairflage);	
	if(exist == -1)return null;	
	if(flag==false){
	return this.Members[exist];
	}
	else return this.chairMen[exist];	
};
//删除成员或会议主持
Group.prototype.del = function(empId,name,chairflage){				
	var flag = chairflage===true;
	if(flag){
		var index1=this.indexOf(empId,flag);
		if(index1 == -1)return;
		this.chairMen.splice(index1,1);
	} 
	var index2 = this.indexOf(empId,flag);	
    if(index1==-1)return;
	this.Members.splice(index2,1);
	this.names.splice(index2,1);
};
//索引	  
Group.prototype.indexOf = function(empId,chairflage){	
	var flag = chairflage===true;	
	var index = -1;
    if(flag == false)
	{ 	
		for(var i=0;i<this.Members.length;i++){
			if(this.Members[i] == empId){
				index = i;
				break;
			}
		}
	}else
	{
		for(var i=0;i<this.chairMen.length;i++){
			if(this.chairMen[i] == empId){
				index = i;
				break;
			}
		}
	}
	return index;
};	















