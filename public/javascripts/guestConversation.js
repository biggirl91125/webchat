Ext.define('guestConversation', {
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
	msgcount : 0,

	listeners: {
		"afterrender":function(me){
			msg.fireEvent('winOpen',Sender.senderInfo.guestId);		
		},
		"close":function()
		{
			msg.fireEvent('winClose',Sender.senderInfo.guestId);
			//console.info(this.down('#display'));
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

		msg.on('recMsg',this.receive,this);
		msg.on('sendMsg_succeed',this.display,this);
		msg.on('returnHistory',this.rehistorymsg,this);
		 

		this.callParent(arguments);
		return this;
	},

	setReceiver:function(){
		this.dockedItems.items[0].add('->');
		this.dockedItems.items[0].add('<strong><font size="4px">'+'在线咨询'+'</font></strong>');
		this.dockedItems.items[0].add('->');
	},
	
	send:function(){
		if(this.down('#msg').getValue() != '')
		{
			
			var data=new Date();  
			time=data.getFullYear()+'/'+(data.getMonth()+1)+'/'+data.getDate();
			msg.fireEvent('sendMsg_guest',this.down('#msg').getValue());	
			this.down('#msg').setValue('');
		}
		
	},

	receive:function(data){
		console.info(data);	
		if(Ext.getCmp(Sender.senderInfo.guestId+'form'))
			//if(data.receiver == Sender.senderInfo.employeeID)
			//{
		{
			this.msgcount++;
			var  divCon=document.createElement('div');
			divCon.innerHTML='<strong>'+'services'+'</strong>'+'('+data.time+')'+'<br>'+data.content;
			divCon.className='left';
			this.down('#display').body.down('div').appendChild(divCon);
			
		}
		//}
	},
	
	display:function(data){
		if(Ext.getCmp(Sender.senderInfo.guestId+'form'))
			if(data.id == Sender.senderInfo.guestId )
			{	
				this.msgcount++;
				divCon=document.createElement('div');
				divCon.innerHTML='<strong>'+data.sender_name+'</strong>'+'('+data.time+')'+'<br>'+data.content;
				divCon.className='right';
				this.down('#display').body.down('div').appendChild(divCon);
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
						if(Ext.getCmp(Sender.senderInfo.guestId+'form'))
							if(data[i].type == "RCV")
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+'GUEST'+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='right';
								this.down('#display').body.down('div').dom.insertBefore(divCon,firstnode);
							}
							else
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+'客服'+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='left';
								this.down('#display').body.down('div').dom.insertBefore(divCon,firstnode);
							}
					}
					
				}
				else
				{
					if(data[i].ty == 2)
					{	if(Ext.getCmp(Sender.senderInfo.guestId+'form'))
							if(data[i].type == "RCV")
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+'GUEST'+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='right';
								this.down('#display').body.down('div').appendChild(divCon);
							}
							else
							{
								var  divCon=document.createElement('div');
								divCon.innerHTML='<strong>'+'客服'+'</strong>'+'('+data[i].time+')'+'<br>'+data[i].content;
								divCon.className='left';
								this.down('#display').body.down('div').appendChild(divCon);
							}
					}
				}
			}	
	}


});