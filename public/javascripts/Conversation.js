Ext.define('Conversation', {
	extend      : 'Ext.window.Window',
	
	width       : 400,
	height      : 427,
	maxHeight   : 427,
	maxWidth    : 400,
	title       : null,
	draggable   : true,
	closable    : true,
	//closeAction : 'destroy',
	closeAction : 'hide',
	border      : false,

	tbar : [],
	receiver : {},
	unreadMsg: [],
	config:{
		id:'',
	},

	msgcount : 0,


	listeners: {
		"afterrender":function(me){
			msg.fireEvent('winOpen',this.receiver.employee_id);		
		},
		"close":function()
		{
			msg.fireEvent('winClose',this.receiver.employee_id);		
		}
	},

	initComponent:function(){
		this.items=[{xtype:'form',
					autoScroll : true,
					bodyStyle : 'overflow-x:hidden; overflow-y:scroll',
					itemId : 'display',
					height:225,
					//width:395,
					width:'100%',
					html:'<html>'
							+'<body>'
							+'</body>'
						+'</html>'
					}];
		this.bbar={
			xtype  : 'container',
			border : false,
			items: [
				{xtype:'toolbar',border:'0 2px 0 2px',items:[/*{text:'复制'},{text:'粘贴'},*/{text:'消息记录',handler : this.historymsg,scope:this}]},
				{xtype:'toolbar',border:'0 2px 0 2px',items:[{xtype:'textarea',itemId:'msg',width:'100%',height:100}]},
				{xtype:'toolbar',border:'0 2px 0 2px',items:['->',{xtype:'button',text:'发送',itemId : 'sendmsg',handler : this.send,scope:this}]},
			]
		},
		msg.on('CINCCBarToAgent',this.receive1,this);
		msg.on('recMsg',this.receive1,this);
		msg.on('sendMsg_succeed',this.display1,this);
		msg.on('recGroupMsg',this.receive2,this);
		msg.on('sendGroupMsg_succeed',this.display2,this);
		msg.on('defaultmsg',this.defaultmsg,this);
		msg.on('returnHistory',this.rehistorymsg,this);

		this.callParent(arguments);
		return this;
	},

	setReceiver:function(rec){
		this.receiver=rec;
		if(this.receiver.type == 'anngroup')
			if(Sender.senderInfo.employeeID != this.receiver.admin)
				this.down('#sendmsg').setDisabled(true);
		this.dockedItems.items[0].add('->');
		this.dockedItems.items[0].add('<html ><strong><font size="4px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+rec.text+'</font></strong></html>');
		this.dockedItems.items[0].add('->');
		this.dockedItems.items[0].add({text:'通话'});
		this.dockedItems.items[0].add({text:'发起会议',
			handler:function(){
				var meet=Ext.create('Meeting',{receiver:rec});
				meet.showAt(600,120);
			}
			});
	},
	
	send:function(){
		if(this.down('#msg').getValue() != '')
		{
			//console.info(Sender.senderInfo.employeeName);
			var data=new Date();  
			time=data.getFullYear()+'/'+(data.getMonth()+1)+'/'+data.getDate();

			if(this.receiver.type == 'person')
				msg.fireEvent('sendMsg',Sender.senderInfo.employeeName,this.receiver.employee_id,this.receiver.text,this.down('#msg').getValue(),time);
			else if(this.receiver.type == 'guest'){
				//msg.fireEvent('sendMsg',Sender.senderInfo.employeeName,this.receiver.employee_id,'GUEST',this.down('#msg').getValue(),time);
				var data={sender_name:Sender.senderInfo.employeeName,receiver:this.receiver.employee_id,receiver_name:'GUEST',content:this.down('#msg').getValue(),time:time};
				msg.fireEvent('AgentToCINCCBar',data);
			}
			else if(this.receiver.type == 'anngroup')
				msg.fireEvent('sendGroupMsg',Sender.senderInfo.employeeName,this.receiver.text,0,this.down('#msg').getValue(),time,this.receiver.admin,1);
			else
				msg.fireEvent('sendGroupMsg',Sender.senderInfo.employeeName,this.receiver.text,0,this.down('#msg').getValue(),time,this.receiver.admin,0);
			this.down('#msg').setValue('');
		}
		
	},

	receive1:function(data){
		if(Ext.getCmp(this.receiver.employee_id+'form'))
			if(data.id == this.receiver.employee_id)
			{
				this.msgcount++;
				var  divCon=document.createElement('div');
				divCon.innerHTML='<strong>'+data.id.substr(12)+'</strong>'+'('+data.time+')'+'<br>'+data.content;
				divCon.className='left';
				this.down('#display').body.down('div').appendChild(divCon);
			}
	},
	receive2:function(data){
		if(Ext.getCmp(this.receiver.employee_id+'form'))
			if(data.id == this.receiver.employee_id)
			{
				this.msgcount++;
				var  divCon=document.createElement('div');
				divCon.innerHTML='<strong>'+data.name+'</strong>'+'('+data.time+')'+'<br>'+data.content;
				divCon.className='left';
				this.down('#display').body.down('div').appendChild(divCon);
			}
	},
	display1:function(data){
		if(Ext.getCmp(this.receiver.employee_id+'form'))
			if(data.sender == Sender.senderInfo.employeeID && data.receiver ==this.receiver.employee_id)
			{	
				this.msgcount++;
				divCon=document.createElement('div');
				divCon.innerHTML='<strong>'+data.sender.substr(12)+'</strong>'+'('+data.time+')'+'<br>'+data.content;
				divCon.className='right';
				this.down('#display').body.down('div').appendChild(divCon);
			}
	},
	display2:function(data){
		if(Ext.getCmp(this.receiver.employee_id+'form'))
			if(data.sender == Sender.senderInfo.employeeID && data.groupName ==this.receiver.employee_id)
			{
				this.msgcount++;
				divCon=document.createElement('div');
				divCon.innerHTML='<strong>'+data.sender.substr(12)+'</strong>'+'('+data.time+')'+'<br>'+data.content;
				divCon.className='right';
				this.down('#display').body.down('div').appendChild(divCon);
			}
	},
	unreadmsg:function(data){
		msg.fireEvent('defaultmsg',data);
	},

	defaultmsg:function(data){	
		for(i in data)
		{
			
			if(data[i].ty == 2)
			{	if(Ext.getCmp(this.receiver.employee_id+'form'))
					if(data[i].id == this.receiver.employee_id)
					{
						this.msgcount++;
						var  divCon=document.createElement('div');
						divCon.innerHTML='<strong>'+data[i].id.substr(12)+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
						divCon.className='left';
						this.down('#display').body.down('div').appendChild(divCon);
					}
			}
			else
			{	
				if(Ext.getCmp(this.receiver.employee_id+'form'))
					if(data[i].id == this.receiver.employee_id)
					{
						this.msgcount++;
						var  divCon=document.createElement('div');
						divCon.innerHTML='<strong>'+data[i].name+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
						divCon.className='left';
						this.down('#display').body.down('div').appendChild(divCon);
					}
			}
		}
	},
	
	historymsg:function(){

		msg.fireEvent('getSession',this.receiver.employee_id,this.msgcount);
	},
	
	rehistorymsg:function(data){
		console.info(data);
		if(data)
			for(var i=data.length-1;i>=0;i--)
			{
				this.msgcount++;
				if(this.down('#display').body.down('div').dom.childNodes.length > 0)	
				{
					var firstnode=this.down('#display').body.down('div').dom.childNodes[0];
					if(data[i].ty == 2)
					{	
						if(Ext.getCmp(this.receiver.employee_id+'form'))
							if(data[i].type == "RCV")
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+Sender.senderInfo.employeeName+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='right';
								this.down('#display').body.down('div').dom.insertBefore(divCon,firstnode);
							}
							else
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+data[i].name+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='left';
								this.down('#display').body.down('div').dom.insertBefore(divCon,firstnode);
							}
					}
					else
					{	
						if(Ext.getCmp(this.receiver.employee_id+'form'))
							if(data[i].type == "RCV")
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+Sender.senderInfo.employeeName+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='right';
								this.down('#display').body.down('div').dom.insertBefore(divCon,firstnode);
							}
							else
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+data[i].name+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='left';
								this.down('#display').body.down('div').dom.insertBefore(divCon,firstnode);
							}
					}
				}
				else
				{
					if(data[i].ty == 2)
					{	if(Ext.getCmp(this.receiver.employee_id+'form'))
							if(data[i].type == "RCV")
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+Sender.senderInfo.employeeName+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='right';
								this.down('#display').body.down('div').appendChild(divCon);
							}
							else
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+data[i].name+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='left';
								this.down('#display').body.down('div').appendChild(divCon);
							}
					}
					else
					{	
						if(Ext.getCmp(this.receiver.employee_id+'form'))
							if(data[i].type == "RCV")
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+Sender.senderInfo.employeeName+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='right';
								this.down('#display').body.down('div').appendChild(divCon);
							}
							else
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+data[i].name+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='left';
								this.down('#display').body.down('div').appendChild(divCon);
							}
					}
				}
			}
	}


});