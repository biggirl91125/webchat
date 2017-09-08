var log=require('./log');
function Message(message){
	this.sender=message.sender;
	this.sender_name=message.sender_name;
	this.receiver=message.receiver;
	this.receiver_name=message.receiver_name;
	this.content=message.content;
	this.corpId=message.corpId;
}

module.exports = Message;

Message.prototype.save = function save(connection,callback){
	var query = "insert into crm_im_msgs(corp_id,sender,sender_name,receiver,receiver_name,content,time) values('"+this.corpId+"','"+this.sender+"','"+this.sender_name+"','"+this.receiver+"','"+this.receiver_name+"','"+this.content+"',now());";
	connection.query(query, function(err, result){
		if(err){
			log.writeErr(err);
			callback(err);
		}
	});
};
Message.prototype.get=function get(connection,callback){
	var query="select DISTINCT sender,receiver,sender_name,receiver_name from crm_im_msgs where corp_id='"+this.corpId+"' and (sender='"+this.sender+"' or receiver='"+this.sender+"');";
	connection.query(query,function(err,result){
		if(err){
			log.writeErr(err);
			callback(err);
		}
		callback(err,result);
	});
};