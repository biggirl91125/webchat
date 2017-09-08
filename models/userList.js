var User=require('./users');
var log=require('./log');
function userList()
{
	this.corps = [];//数组
	this.users = {};//对象
};
module.exports = userList;
userList.prototype.add = function(user){	
	var corpId = user.corpId; 
	var index = this.indexOfCorp(corpId); 
	if( index == -1){
		this.corps.push(corpId);
		this.users[corpId] = [];
	}	
	this.addUser(user); 
}; 

userList.prototype.del = function(corpId,empId,socketId){
	var index = this.indexOfCorp(corpId);
	if(index == -1 )return -1; 
	return this.delUser(corpId,empId,socketId);  
};
  
userList.prototype.find = function(corpId,empId){ 
	var index = this.indexOfCorp(corpId);
	if(index == -1 ){
	return null;
	}
	return this.findUser(corpId,empId);	
}; 
 
userList.prototype.indexOfCorp = function(corpId){
	var index = -1;
	for(var i=0;i<this.corps.length;i++){
		if(this.corps[i] == corpId){
			index = i;
			break;
		}
	}
	return index;
};
/************************** op user ****************/
userList.prototype.addUser = function(user){
	var index = this.indexOfUser(user.corpId,user.empId);
	if( index == -1 ){
		(this.users[user.corpId]).push(user);
	}
	else
		(this.users[user.corpId])[index] = user;  	
};

userList.prototype.delUser = function(corpId,empId,socketId){	
	var index = this.indexOfUser(corpId,empId,socketId);
	if( index == -1 )return -1;
	(this.users[corpId]).splice(index,1);
	return 1;
};

userList.prototype.findUser = function(corpId,empId){
	var index = this.indexOfUser(corpId,empId);
	if( index == -1 )return null;
	return (this.users[corpId])[index];
};

userList.prototype.delUserBySocket=function(socketId){
	var corp_id='';
	var index_user=-1;
	for(var i=0;i<this.corps.length;i++){
		var corpId=this.corps[i];
		var users=this.users[corpId];
		for(var j=0;j<users.length;j++){
			if(socketId==users[j].socket.id){
				corp_id=corpId;
				index_user=j;
				break;
			}
		}
	}
	if(index_user==-1)return 0;	
	(this.users[corp_id]).splice(index_user,1);
	return 1;
};
userList.prototype.indexOfUser = function(corpId,empId,socketId){	
	var index = -1;
	var u = this.users[corpId];
	if(u){
		if(typeof(socketId)!='undefined'){
			for(var i=0;i<u.length;i++){
				if(u[i].socket.id == socketId){
					index = i;
					break;
				}
			}
		}
		else{
			for(var i=0;i<u.length;i++){
				if(u[i].empId == empId){
					index = i;
					break;
				}
			}
		}
	}
	return index;
};




