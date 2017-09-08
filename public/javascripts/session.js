function win(id){
	this.id=id;
	this.count=0;
	this.status=false;
}
function session(msg){
	this.wins=[];
	this.msg=msg;
	this.msg.on('addWin',this.add,this);
	this.msg.on('delWin',this.del,this);
	this.msg.on('winStatus',this.find,this);
	this.msg.on('modStatus_open',this.modStatus_open,this);
	this.msg.on('modStatus_close',this.modStatus_close,this);
	this.msg.on('modCount',this.modCount,this);
}
session.prototype.add=function(winId){
	var w=new win(winId);
	this.wins.push(w);
};
session.prototype.del=function(winId){
	var index=this.indexOf(winId);
	console.log(index);
	if(index==-1)return;
	else {
		this.wins.splice(index,1);
	}
	this.msg.fireEvent('delHistory',winId);
};
session.prototype.find=function(msg,guestId){
	if(guestId){
		var index=this.indexOf(guestId);
	}
	else{
		var index=this.indexOf(msg.id);
		if(index==-1){
			this.add(msg.id);
			index=this.indexOf(msg.id);
		}
	} 
	var status=this.wins[index].status;
	this.msg.fireEvent('winStatus_suc',status,msg);
	
};
session.prototype.modStatus_open=function(winId){
	var index=this.indexOf(winId);
	if(index==-1){
		this.add(winId);
		index=this.indexOf(winId);
	}
	this.wins[index].status=true;
	if(this.wins[index].count>0){
		this.msg.fireEvent('getUnread',winId,this.wins[index].count);
		this.wins[index].count=0;
	}
};
session.prototype.modStatus_close=function(winId){
	var index=this.indexOf(winId);
	if(index==-1){
		this.add(winId);
		index=this.indexOf(winId);
	}
	this.wins[index].status=false;
};
session.prototype.modCount=function(winId,ty,name){
	var index=this.indexOf(winId);
	if(index==-1){
		this.add(winId);
		index=this.indexOf(winId);
	}
	var count=++this.wins[index].count;
	this.msg.fireEvent('unreadCount',winId,count,ty,name);
};
session.prototype.indexOf=function(winId){
	var index=-1;
	for(var i=0;i<this.wins.length;i++){
		if(this.wins[i].id==winId){
			index=i;
			break;
		}
	}
	return index;
};
