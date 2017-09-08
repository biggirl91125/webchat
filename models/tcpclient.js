var net=require('net');
var port=4002;
var conn=net.createConnection(port);
/*
conn.on('connect',function(){
	console.log("connected to server");
});
*/
conn.write("login:{\"empId\":\"0000109000003005\",\"corpId\":\"900000\",\"password\":\"111111\",\"roleKey\":\"ROLE_CC_AGENT\"}#");
//conn.write("users:{\"empId\":\"0000109000002001\",\"corpId\":\"900000\"}#");
//setTimeout(gro1,10000);
function gro1(){
conn.write("groups:{\"empId\":\"0000109000002001\",\"corpId\":\"900000\"}#");
}
//conn.write("login:{\"empId\":\"0000109000003005\",\"corpId\":\"900000\",\"password\":\"111111\",\"roleKey\":\"ROLE_CC_AGENT\"}#");
//conn.write("users:{\"empId\":\"0000109000003005\",\"corpId\":\"900000\"}#");
//setTimeout(gro2,10000);
function gro2(){
conn.write("groups:{\"empId\":\"0000109000003005\",\"corpId\":\"900000\"}#");
}

//conn.write("msg:{\"sender\":\"2001\",\"corpId\":\"900000\",\"sender_name\":\"2001\",\"receiver\":\"0000109000002002\",\"receiver_name\":\"2002\",\"content\":\"wei\"}#");
//setTimeout(groMsg,40000);
function groMsg(){
conn.write("groupMsg:{\"sender\":\"2001\",\"corpId\":\"900000\",\"sender_name\":\"2001\",\"groupName\":\"Damon\",\"groupType\":0,\"content\":\"spring\"}#");
}
//conn.write("unread:{\"empId\":\"2002\",\"corpId\":\"900000\"}#");
//conn.write("convers:{\"empId\":\"2001\",\"corpId\":\"900000\"}#");

//conn.write("creGroup:{\"corpId\":\"900000\",\"groupName\":\"CATI\",\"groupType\":1,\"Members\":\"0000109000003007,0000109000003008\",\"chairMen\":\"0000109000003008\",\"names\":\"3007,3008\"}#");

conn.on('data',function(data){
	console.log(data);
	
	var cmd_re=/(\w+)[:](.*)/g;
	var cmd_match=cmd_re.exec(data);
	if(cmd_match){
		var command=cmd_match[1];
		var args=cmd_match[2];
		args=JSON.parse(args);
		exec_cmd(command,args);
	}
	
});
function exec_cmd(command,args){
	switch(command){
		case 'loginResponse':
			console.log("login:");
			console.log(args);
			break;
		case 'returnUsers':
			console.log("users:"+args);
			break;
		case 'returnGroups':
			console.log("groups:"+args);
			break;
		case 'recMsg':
			console.log("msg1:");
			console.log(args);
			break;
		case 'msgSent':
			console.log("msg2:");
			console.log(args);			
			break;
		case 'recGroupMsg':
			console.log("groupMsg:");
			console.log(args);			
			break;
		case 'recFile':
			console.log("sendFile:"+args); 
			break;
		case 'retPerConvers':
			console.log("perconvers:");
			console.log(args); 			
			break;
		case 'retGroConvers':
			console.log("groconvers:");
			console.log(args); 			
			break;
		case 'creGroupRes':
			console.log("creGroup:");
			console.log(args);			
			break;
		case 'editGroupRes':
			console.log("editGroup:"+args);
			break;
		case 'delGroupRes':
			console.log("delGroup:"+args); 
			break;
		case 'addMemberRes':
			console.log("addMember:"+args); 
			break;
		case 'delMemberRes':
			console.log("delMember:"+args); 
			break;
	}
}
conn.on('error',function(err){
	console.log(err.message);
});
conn.on('close',function(){
	console.log("connection got closed,reconnect...");
	connect();
});