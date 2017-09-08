var log=require('./log');
function groupMessage(groupmessage){
	this.groupName=groupmessage.groupName;
	//this.groupType=groupmessage.groupType;
	this.sender=groupmessage.sender;
	this.sender_name=groupmessage.sender_name;
	this.content=groupmessage.content;
	this.corpId=groupmessage.corpId;
}

module.exports = groupMessage;

groupMessage.prototype.save = function save(connection,callback){
	var query = "insert into crm_im_groupMsgs(corp_id,groupName,sender,sender_name,content,time) values('"+this.corpId+"','"+this.groupName+"','"+this.sender+"','"+this.sender_name+"','"+this.content+"',now());";
	connection.query(query, function(err, result){
		if(err){
			log.writeErr(err);
			callback(err);
		}
	});
};
groupMessage.prototype.get=function get(connection,callback){
	var query = "select DISTINCT crm_im_groups.groupName,crm_im_groups.groupType,crm_im_groups.chairMen from crm_im_groups,crm_im_groupMsgs where crm_im_groupMsgs.corp_id='"+this.corpId+"' and crm_im_groupMsgs.groupName=crm_groups.groupName;";
	connection.query(query, function(err, result){
		if(err){
			log.writeErr(err);
			callback(err);
		}
		callback(err,result);
	});
};