function buff(size){	
	this.size = size;
	this.buffer = new Array(this.size);		
	this.offset = 0;	
	this.length = 0;	
}	
module.exports = buff;
buff.prototype.get = function(){	
	if(this.length == 0)return null;
		
	var len = this.getLen();	
	if(len == -1)return null;
		
	var contLen = this.getContIndex();			
	if(len>this.length-contLen)return null;	
	var command= this.buffer.slice(contLen,contLen + len);	
	this.move(contLen+len);
		
	return command.join("");
};
/*
buff.prototype.copy = function(source){	
	var len = source.length;	
	this.set(len,source);	
};	

buff.prototype.set = function(len,part){
	this.setLen(len);
	this.setCont(part);	
};
*/
buff.prototype.setCont = function(part){ 
	var len = part.length;  
	for(var i=0;i<len;i++){
		//String.fromCharCode将十进制数转为ascii码
		this.buffer[this.offset++] = String.fromCharCode(part[i]);
	}			
	this.length += i;	 			
};
buff.prototype.move = function(len){
	this.buffer.splice(0,len);
		
	this.offset = this.offset - len;
	this.length = this.length - len;
};
/*
buff.prototype.setLen = function(len){	
	var k = "[" + len + "]";	
	this.setCont(k);
};
*/
buff.prototype.getLen = function(){	
	var index = this.getContIndex();
	if( index == -1) return -1;	
	//获取'[]'中的长度（字符型）
	var buf = this.buffer.slice(1,index-1);	
	//将字符型长度转换为整型长度
	var len = parseInt(buf.join(""));
	return len;
};
//获取内容的起始位置	
buff.prototype.getContIndex = function(){	
	var index = this.buffer.indexOf("]");	
	if(index == -1){
		
		return index;
	} 
	else return index+1;
};