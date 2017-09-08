var log=require('./log');
function User(corpId,empId,roleKey,socket,password,type){
	this.corpId = corpId;
	this.empId = empId||'';
	this.socket = socket||null;
	this.roleKey = roleKey||'';
	this.password = password||'';
	this.SOC_TYPE=type||'';
};
module.exports = User;

//读取员工信息
User.prototype.get = function(connection,callback){
	//var query = "select employee_id,short_employee_id,role_key,node_id,node_name,corp_id,corp_name,department_id,department_name,group_id,group_name,status,created_time,login_pwd,pwd_expiry,login_status,last_login_time,last_logout_time,login_session_id,login_ip,login_cnt,employee_name,nickname,sex,birthday,business_unit,mobile_phone,fix_phone,email,web,qq,address,postcode,related_person,contact_way,skill_type,skill_level,specialty,remark from zs_employee where Corp_ID='"+this.corpId+"' and Employee_ID='"+this.empId+"' limit 0,1;";
	var query = "select * from zs_employee where corp_id='"+this.corpId+"' and employee_id='"+this.empId+"' limit 0,1;";
	console.log(query);
	connection.query(query, function(err, rows){
		if(err) {
			callback(err,null);
			log.writeErr(err);
		}		
		else if(rows.length==0)callback(err, null);
		else callback(err, rows[0]);
	});
};
//获取该企业所有员工信息
User.prototype.getAll = function(connection,callback){
	/*
	var query = "select crm_employee.*,crm_im_depts.dept_name from crm_employee,crm_im_depts,crm_im_emp_grp where crm_employee.corp_id='"+this.corpId+"' and crm_im_emp_grp.employee_id=crm_employee.employee_id and crm_im_emp_grp.grp_id=crm_im_depts.dept_id;";
	connection.query(query, function(err, rows){
		if(err){
			callback(err,null);
			log.writeErr(err);
		}		
		else if(!rows.length) callback(err, null);
		else callback(err, rows);
	});
	*/
	var query1="select Group_Name from zs_employee where Corp_ID='"+this.corpId+"'and Employee_ID='"+this.empId+"';";
	var corpId=this.corpId;
	connection.query(query1,function(err,rows){
		if(rows){
			var grpName=rows[0].Group_Name;
			//var query2 = "select employee_id,short_employee_id,role_key,node_id,node_name,corp_id,corp_name,department_id,department_name,group_id,group_name,status,created_time,login_pwd,pwd_expiry,login_status,last_login_time,last_logout_time,login_session_id,login_ip,login_cnt,employee_name,nickname,sex,birthday,business_unit,mobile_phone,fix_phone,email,web,qq,address,postcode,related_person,contact_way,skill_type,skill_level,specialty,remark from zs_employee where Corp_ID='"+corpId+"' and Group_Name='"+grpName+"';";
			var query2="select * from zs_employee where corp_id='"+corpId+"' and Group_Name='"+grpName+"';";
			connection.query(query2, function(err, rows){
				if(err) callback(err,null);		
				else if(!rows.length){
					callback(err, null);
				}
				else {
					callback(err, rows);
				}
			});
		}
	});
	
};
User.prototype.getAdmin=function(connection,callback){
	var query = "select employee_id,short_employee_id,role_key,node_id,node_name,corp_id,corp_name,department_id,department_name,group_id,group_name,status,created_time,login_pwd,pwd_expiry,login_status,last_login_time,last_logout_time,login_session_id,login_ip,login_cnt,employee_name,nickname,sex,birthday,business_unit,mobile_phone,fix_phone,email,web,qq,address,postcode,related_person,contact_way,skill_type,skill_level,specialty,remark from zs_employee where Corp_ID="+this.corpId+" and Employee_ID="+this.empId+";";
	connection.query(query, function(err, rows){
		if(err) callback(err,null);		
		else if(!rows.length) callback(err, null);
		else callback(err, rows[0]);
	});
};
User.prototype.getGrps=function(connection,callback){
	var query = "select distinct(Group_Name) from zs_employee where Corp_ID="+this.corpId+";";
	connection.query(query, function(err, rows){
		if(err) callback(err,null);		
		else if(!rows.length) callback(err, null);
		else callback(err, rows);
	});
};
User.prototype.getAllMembers=function(connection,callback){
	var query = "select employee_id,short_employee_id,role_key,node_id,node_name,corp_id,corp_name,department_id,department_name,group_id,group_name,status,created_time,login_pwd,pwd_expiry,login_status,last_login_time,last_logout_time,login_session_id,login_ip,login_cnt,employee_name,nickname,sex,birthday,business_unit,mobile_phone,fix_phone,email,web,qq,address,postcode,related_person,contact_way,skill_type,skill_level,specialty,remark from zs_employee where Corp_ID="+this.corpId+";";
	connection.query(query, function(err, rows){
		if(err) callback(err,null);		
		else if(!rows.length) callback(err, null);
		else callback(err, rows);
	});
};




