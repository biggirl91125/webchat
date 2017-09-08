var fs=require('fs');

exports.upload=function(req, res){
	var path=req.body.fileId;
	var filename=path.substr(path.lastIndexOf('\\')+1);
	var is=fs.createReadStream(path); 
	var os=fs.createWriteStream("./uploadfiles/"+filename);  
	is.pipe(os);  
	is.on('end',function(){  
        fs.unlinkSync(path);  
	});  
	//res.end('Upload succeed!');
	//fs.renameSync(req.files.file.path,'./uploadfiles/'+req.files.file.name);
}