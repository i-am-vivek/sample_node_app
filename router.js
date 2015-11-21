module.exports={
	login:function(req,res){
		if(req.session.uname)
			res.redirect("/profile");
		data={};
		data.title="Old Crew";
		data.action="Login";
		res.render("frontend/login",data);
	},
	loginpost:function(req,res){
		req.db.collection('users').findOne({$and: [ { password: req.body.pwd }, { user_email: req.body.uname } ]}, function(err, result) {
			
			if(err){
				res.type("json");
				res.write('{"status":"0","message":"Error in data fetching"}');
				res.end();
			}
			else if(result){
				req.session.uname=result.user_name;
				req.session.email=result.user_email;
				res.type("json");
				res.write('{"status":"1","message":"successfully logged in"}');
				res.end();
			}
			else{
				res.type("json");
				res.write('{"status":"0","message":"successfully not logged in"}');
				res.end();
			}
			
		});
	},
	register:function(req,res){
		if(typeof req.session.uname!="undefined")
			res.redirect("/profile");
		data={};
		data.title="Old Crew";
		data.action="Register";
		res.render("frontend/register",data);
	},
	registerpost:function(req,res){
		req.db.collection('users').count({$or: [ { user_name: req.body.uname }, { user_email: req.body.email } ]}, function(err, count) {
			if(count){
				res.type("json");
				res.write('{"status":"0","message":"username already exists"}');
				res.end();
			}
			else{
				console.log("hai");
				var document={
					"user_name":req.body.uname,
					"user_email":req.body.email,
					"password":req.body.pwd,
					"user_image":"empty.jpeg"
				};
				req.db.collection('users').insert(document,function(err, result){
					results={};
					if(err){
						res.type("json");
						res.write('{"status":"0","message":"Error in insertion"}');
						res.end();
					}
					else{
						res.type("json");
						req.session.uname=req.body.uname;
						req.session.email=req.body.email;
						res.write('{"status":"1","message":"user added succesfully"}');
						res.end();
					}
						
				});
				
			}
		});
	},
	checkusername:function(req,res){
			bands=req.db.collection('users').count({"user_name":req.body.uname}, function(err, count) {
			var result={};
			result.status=(count>0)?0:1;
			result.name=req.body.uname;
			res.type("json");
			res.write(JSON.stringify(result));
			res.end();
		});
	},
	loginp:function(req,res){
		login(req,res);
	},
	profile:function(req,res){
		if(req.session.uname){
			data={};
			data.title="Old Crew";
			data.action="Register";
			res.render("main/profile",data);
		}
		else{
			res.redirect("/login");
			res.end();
		}
	},
	getUserData:function(req,res){
		req.db.collection('users').findOne({"user_name":req.session.uname}, function(err, result) {
			if(err || !result){
				res.type("json");
				res.write('{"status":"0","message":"Error in fetching"}');
				res.end();
			}
			else{
				res.type("json");
				object={};
				object.status=1;
				object.message="fetched data succesfully";
				object.data=result;
				res.json(object);
				res.end();
			}
		});
	},
	getToDoData:function(req,res){
		console.log("ahahha");
		req.db.collection('todos').find({"user_name":req.session.uname}).toArray(function(err, result) {
			if(err || !result){
				res.type("json");
				res.write('{"status":"0","message":"Error in fetching"}');
				res.end();
			}
			else{
				res.type("json");
				object={};
				object.status=1;
				object.message="fetched data succesfully";
				object.data=result;
				res.json(object);
				res.end();
			}
		});
	},
	saveUserData:function(req,res){
		var document={
			"name":req.body.name,
			"user_dob":req.body.user_dob,
			"user_gender":req.body.user_gender
		};
		if(req.file)
		document.user_image=req.file.filename;
		console.log(document);
		req.db.collection('users').update({user_name:req.session.uname},{$set:document},function(err, result){
			results={};
			if(err){
				res.type("json");
				res.write('{"status":"0","message":"Error in updation"}');
				res.end();
			}
			else{
				res.type("json");
				res.write('{"status":"1","message":"user added succesfully"}');
				res.end();
			}
				
		});	
	},
	saveToDoData:function(req,res){
		console.log(req.body);
		var document={
			"user_name":req.session.uname,
			"text":req.body.text,
			"date":req.body.date
		};
		req.db.collection('todos').insert(document,function(err, result){
			results={};
			if(err){
				res.type("json");
				res.write('{"status":"0","message":"Error in updation"}');
				res.end();
			}
			else{
				res.type("json");
				res.write('{"status":"1","message":"todo added succesfully"}');
				res.end();
			}
		});	
	},
	deleteToDoData:function(req,res){
		console.log(req.body);
		req.db.collection('todos').remove({"_id": new req.ObjectID(req.body.id)},function(err, result){
			results={};
			if(err){
				res.type("json");
				res.write('{"status":"0","message":"Error in deletion"}');
				res.end();
			}
			else{
				res.type("json");
				res.write('{"status":"1","message":"todo deleted succesfully"}');
				res.end();
			}
		});	
	},
	getAlbumData:function(req,res){
		console.log("ahahha");
		req.db.collection('album').find({"user_name":req.session.uname}).toArray(function(err, result) {
			if(err || !result){
				res.type("json");
				res.write('{"status":"0","message":"Error in fetching"}');
				res.end();
			}
			else{
				res.type("json");
				object={};
				object.status=1;
				object.message="fetched data succesfully";
				object.data=result;
				res.json(object);
				res.end();
			}
		});
	},
	saveAlbumData:function(req,res){
		var document={
		"user_name":req.session.uname,
		"name":req.body.name,
		"description":req.body.description
		};
		if(req.file)
		document.image=req.file.filename;
		console.log(document);
		req.db.collection('album').insert(document,function(err, result){
			results={};
			if(err){
				res.type("json");
				res.write('{"status":"0","message":"Error in updation"}');
				res.end();
			}
			else{
				res.type("json");
				res.write('{"status":"1","message":"album added succesfully"}');
				res.end();
			}
				
		});	
	}
	
};
