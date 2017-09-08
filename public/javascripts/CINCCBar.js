CINCCBar=function(msg,login){
	this.Login=login;
	this.msg=msg;
	console.log(this.Login,typeof this.Login,typeof this.msg);
	this.Login.on('CINCCBarToAgent',this.CINCCBarToAgent,this);
	this.msg.on('AgentToCINCCBar',this.AgentToCINCCBar,this);
	
};
//电话条到坐席
CINCCBar.prototype.CINCCBarToAgent=function(sessionId,msgseq,type,userId,vccPublicId,msgType,content,sessionUrl,recongnition,msgevent,eventKey,title,data,timeStamp){
	var data={sessionId:sessionId,msgseq:msgseq,type:type,id:userId,vccPublicId:vccPublicId,msgType:msgType,content:content,sessionUrl:sessionUrl,recongnition:recongnition,msgevent:msgevent,eventKey:eventKey,title:title,data:data,time:timeStamp};
	console.info(data);
	this.msg.fireEvent('CINCCBarToAgent',data);
};
//坐席到电话条
CINCCBar.prototype.AgentToCINCCBar=function(data){
	console.info(data);
	this.Login.fireEvent('AgentToCINCCBar',data);
};