var upload = require('./upload');
module.exports = function(app){
	
	//默认
	app.get('/', function(req, res){
		res.sendfile('views/test2.html');
	});
	app.get('/vol', function(req, res){
		res.sendfile('views/vol_test.html');
	});
	app.get('/test', function(req, res){
		res.sendfile('views/test.html');
	});
	app.get('/guest', function(req, res){
		res.sendfile('views/guest.html');
	});
	app.get('/manager', function(req, res){
		res.sendfile('views/manager.html');
	});
	//上传文件
	app.post('/upload', upload.upload);
	//下载文件
	app.get('/uploadfiles/:fileName', function(req, res){
		var fileName=req.params.fileName;
		res.sendfile('./uploadfiles/'+fileName);
		res.end('ok');
	});
};