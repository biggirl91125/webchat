var http =require('http');
var querystring =require('querystring');
var contents =querystring.stringify({
      name:'wangchao'
});
for(var i=0;i<1000;i++){
var options = {
      host:'127.0.0.1',
	  port:3001,
      path:'/'+i,
      method:'POST',
      headers:{
         'Content-Type':'application/x-www.form-urlencoded',
         'Content-Length':contents.length,
      }
};
var req =http.request(options,function(res){
      res.setEncoding('utf-8');
      res.on('data',function(data){
          console.log(data);
      });
});
req.write(contents);
req.end();
}