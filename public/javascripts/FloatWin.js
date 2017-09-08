Ext.define('FloatWin', {
	extend    : 'Ext.window.Window',
	width     : 110,
	height    : 120,
	maxHeight : 120,
	maxWidth  : 110,
	closable  : false,
	border    : false,
	bodyStyle : "background-image:url('http://192.168.2.176:3000/images/wechat.jpg');padding:55px 5px 0;background-repeat: no-repeat;",
	win       : [],
	flag      : 'close',

	listeners : {
		"afterrender":function(){
			this.body.down('div').on('dblclick',
				function(){
					if(!Ext.getCmp(Sender.senderInfo.employeeID+'tab'))
					{
						var win=Ext.create('MaintabWin',{id:Sender.senderInfo.employeeID+'tab'});
						win.showAt(400,120);
					}
					else
					{
						Ext.getCmp(Sender.senderInfo.employeeID+'tab').showAt(400,120);
					}
						
				});
		}
	},

	initComponent : function(config){
		Ext.apply(this, config);

		this.html='<html>'
				+'<div style="cursor:pointer">' 
				+'<marquee onmouseover=this.stop() onmouseout=this.start() scrollamount="2.5"><strong>双击在线通信</strong></marquee>'
				+'</div>'
				+'</html>';

		
		msg.on("unreadCount",this.alertMsg,this);
		msg.on("clearunreadCount",this.clearunreadCount,this);

		msg.on("maintabOpen",this.tabOpen,this);
		msg.on("maintabClose",this.tabClose,this);
		
		msg.on("workflow",this.alertworkflow,this);//工作流消息提醒
		this.callParent(arguments);
		return this;
	},

	alertMsg:function(id,count,type,name){
		if( Ext.Array.indexOf(this.win,id,0)<0)
		{
			this.win.push(id);
		}
		if(this.win.length>0)
		{
			if(this.flag == 'close')
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"><marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
				+'<font color=red><strong>有新消息!</strong></font>'
				+'</marquee></div>';
			else
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"></div>';
		}
			
		else
		{
			if(this.flag == 'close')
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"><marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
					+'<strong>双击在线通信</font>'
					+'</marquee></div>';
			else
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"></div>';
		}
	},

	clearunreadCount:function(id){
		Ext.Array.remove(this.win,id);
		if(this.win.length>0)
		{
			if(this.flag == 'close')
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"><marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
					+'<font color=red><strong>有新消息!</strong></font>'
					+'</marquee></div>';
			else
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"></div>';
		}
		else
		{
			if(this.flag == 'close')
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"><marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
					+'<strong>双击在线通信</font>'
					+'</marquee></div>';
			else
				this.body.down('div').dom.innerHTML='<div style="cursor:pointer"> </div>';
		}
	},

	tabOpen:function(data){
		this.flag='open';
		this.body.down('div').dom.innerHTML='<div style="cursor:pointer"></div>';
	},
	
	tabClose:function(data){
		this.flag='close';
		if(this.win.length>0)
			this.body.down('div').dom.innerHTML='<div style="cursor:pointer"> <marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
				+'<font color=red><strong>有新消息!</strong></font>'
				+'</marquee></div>';
		else
			this.body.down('div').dom.innerHTML='<div style="cursor:pointer"><marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
				+'<strong>双击在线通信</font>'
				+'</marquee></div>';
	},
	alertworkflow:function(data){
		if(data)
		{
			this.body.down('div').dom.innerHTML='<div style="cursor:pointer"> <marquee onmouseover="this.stop()" onmouseout="this.start()" scrollamount="2.5">'
				+'<font color=red><strong>您有一条预约即将到期!</strong></font>'
				+'</marquee></div>';
		}
	}
})