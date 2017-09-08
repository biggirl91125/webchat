function structure(corpId){
	this.corpId=corpId;
}
module.exports = structure;

//获取企业组织结构
structure.prototype.get=function(connection,callback){
	var query="select dept_id,dept_name,parent_id from crm_im_depts where corp_id='"+this.corpId+"';";
	connection.query(query, function(err, rows){
		if(err) {
			callback(err,null);
			log.writeErr(err);
		}		
		else if(!rows.length) callback(err, null);
		else callback(err, rows);
	});
};