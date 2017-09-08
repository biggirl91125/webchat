function MsgLog(msg,type){
	this.type = type;//消息收发类型
	this.id = msg.id;
	this.name=msg.name;
	this.time = msg.time;
	this.content = msg.content;
	this.ty=msg.ty;//消息类型:3为顾客消息,2为私信，1为公告，0为普通群消息
	this.chair=msg.chair||'undefined';
}

function MsgStore(msg,empId){
	this.keys = [];
	this.map = {};
	this.msg=msg;
	this.empId=empId;
	this.Total_len=100;
	this.Del_unit=15;
	this.history=5;
	this.load();
	this.msg.on('snd',this.snd,this);
	this.msg.on('rcv',this.rcv,this);
	this.msg.on('getUnread',this.getUnread,this);
	this.msg.on('getHistory',this.getHistory,this);
	this.msg.on('delHistory',this.delHistory,this);
	this.msg.on('localConvers',this.localConvers,this);
	this.msg.on('exit',this.save,this);
}

MsgStore.prototype.snd = function(msg){
	//console.info(msg);
	var m = new MsgLog(msg,"SND");
	this.pushItem(m);
};

MsgStore.prototype.rcv = function(msg){
    var m = new MsgLog(msg,"RCV");
	this.pushItem(m);
};
MsgStore.prototype.getUnread=function(id,num){
	var start=0-num;
	var msgpool = this.map[id];
	var data;
	if(typeof(msgpool)== 'undefined'|| msgpool == null )data=null;  
	data=msgpool.slice(start);
	this.msg.fireEvent('returnSession',data);
};
MsgStore.prototype.getHistory=function(id,count){
		var msgpool = this.map[id];
		var data;
		if(typeof(msgpool)== 'undefined'|| msgpool == null)data=null;
		else {
			start=0-this.history-count;
			end=0-count;
			if(end)data=msgpool.slice(start,end);//slice(start,end)
			else data=msgpool.slice(start);
		}
		this.msg.fireEvent('returnHistory',data);
};      	
MsgStore.prototype.delHistory = function(id){
	var index =this.indexOf(id);
	if(index!=-1){
		delete this.map[id];
		this.keys.splice(index,1);
	}
	this.save();
};
MsgStore.prototype.localConvers =function(){
	var info=[];
	for(var i=0;i<this.keys.length;i++){
		var key=this.keys[i];
		var p;

		if(this.map[key]){
			if(this.map[key][0].ty==0||this.map[key][0].ty==1){
				p={'id':key,'admin':this.map[key][0].chair,'ty':this.map[key][0].ty};
			}	 
			else{
				p={'id':key,'name':this.map[key][0].name,'ty':this.map[key][0].ty};
			}
			info.push(p);
		}
	}
	this.msg.fireEvent('retConversations',info);
};
MsgStore.prototype.pushItem=function(msg){
	var msgpool = this.map[msg.id];
    if(typeof(msgpool)=='undefined')
    {
		this.map[msg.id] = [];  
		msgpool = this.map[msg.id];
		this.keys.push(msg.id);		
    }
    msgpool.push(msg);
	if(msgpool.length>=this.Total_len){
		msgpool.splice(0,this.Del_unit);
	}
	this.save();
};
MsgStore.prototype.indexOf=function(id){
	var index=-1;
	for(var i=0;i<this.keys.length;i++){
		if(id==this.keys[i]){
			index=i;
			break;
		}
	}
	return index;
};
MsgStore.prototype.save=function(){ 
	var object={'ids':this.keys,'map':this.map};
	var str=JSON.stringify(object);
	localStorage.setItem(this.empId,str);
};
MsgStore.prototype.load=function(){
	//localStorage.clear();
	var str=localStorage.getItem(this.empId);
	if(str){
		var object=JSON.parse(str);
		this.keys=object.ids;
		this.map=object.map;
	}
};

