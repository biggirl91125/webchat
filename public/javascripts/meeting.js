Ext.define('Meeting', {
	extend      : 'Ext.window.Window',
	
	width       : 400,
	height      : 430,
	maxHeight   : 430,
	maxWidth    : 400,
	title       : null,
	closable    : true,
	draggable   : true,
	layout      :"border",
	
	
	candidatepanel   : null,
	meetingpanel: null,
	memberpanel : null,
	
	config:{
		receiver:'',
	},

	listeners : {
		afterRender : function(me) {
			this.addSubPanels(me);
		}
	},
	
	constructor : function(config){
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	addSubPanels:function(me){
		this.add({
			xtype:'toolbar',
			height:30,
			border: false,
			region:"north",
			items:['->','<html ><strong>'+'会议'+'</strong></html>','->']					
		});
		this.candidatepanel=Ext.create('Candidate',{region:"west"});
		this.memberpanel=Ext.create('Member',{region : 'center'});
		this.memberpanel.defaultmember(me.getReceiver());
		this.add(this.candidatepanel);
		this.add(this.memberpanel);
	}
	
	
})