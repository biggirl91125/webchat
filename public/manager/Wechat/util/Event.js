(function(){
	
	Wechat = Wechat || {};
	
	Wechat.obEvent = new Ext.util.Observable(); 
	
	Wechat.eventOn = function(item,handler,scope){
		item.on('render',Wechat.createCB(Wechat.initControl,handler),scope);
  };

	Wechat.createCB = function(fn,args){
  	
  		return function(){
  		
  			fn.call(this,args);
  		}
  	};
  		

	Wechat.initControl = function(handler){
  	
   		var v = handler;
   
   		for(var i=0;i<v.length;i++){
		{
			var b = Ext.ComponentQuery.query(v[i].itemId);
			console.info(v[i].itemId);
		}
  			
			
			console.info(b);
  			
  			var len = b.length;
  			
  			if( len != 1 )
  				console.info(v[i].itemId + " bind event component isnot 1  is " + len + " !!!!");
  			
  					
  			for(var j=0;j<len;j++){
  			
  				if( len != 1)console.info(b[j]);      
    		
    			b[j].on(v[i].event, v[i].callback,v[i].scope || this);
    		}
		  }  	
  	};
  	
  Wechat.bsStore = function(itemid,store){

		var v = Ext.ComponentQuery.query(itemid);
		
		var len = v.length;
		
		console.info("itemid: " + itemid + " bind " + len + " component!!");
		
		for(var i =0;i<len;i++)
		{
			console.info(v[i]);
			console.info(store);
			v[i].bindStore(store);
		}
			
	
	};
	
 }());