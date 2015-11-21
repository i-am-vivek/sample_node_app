var app = angular.module('oldcrew', [ 'ngRoute' ]); 

app.controller('formcontroller', function($scope,$http,$location,$window) {
	$scope.submitForm=function(isValid){
		var $req={
			url:"/register",
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:this.register,
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				alert(res.data.message);
				if(res.data.status==1)
					$window.location.href="/profile";
				else
					$scope.register.server_error=res.message;
		});
	};
	$scope.submitLoginForm=function(event){
	
		var $req={
			url:"/login",
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:this.login,
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				if(res.data.status==1)
					$window.location.href="/profile";
				else
					$scope.login.server_error=res.data.message;
						alert(res.data.message);
		});
	}
});
app.controller('profilecontroller', function($scope,$http,$location,$window) {
	$scope.profile={};
		$scope.GetData=function(){
		var $req={
			url:"/getUserData",
			method:"GET",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				console.log(res.data.data);
				if(res.data.status==1){
					$scope.profile=res.data.data;
					$('#home').css({background: 'url(uploads/'+$scope.profile.user_image+') repeat'});
				}
					
				else
					alert(res.data.message);		
		});
		}
		$scope.getToDoData=function(){
		var $req={
			url:"/getToDoData",
			method:"GET",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				console.log(res.data.data);
				if(res.data.status==1){
					$scope.todos=res.data.data;
					$('#home').css({background: 'url(uploads/'+$scope.profile.user_image+') repeat'});
				}
					
				else
					alert(res.data.message);		
		});
		}
		$scope.getAlbumData=function(){
		var $req={
			url:"/getAlbumData",
			method:"GET",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				console.log(res.data.data);
				if(res.data.status==1){
					$scope.albums=res.data.data;
				}
				else
					alert(res.data.message);		
		});
		}
		$scope.deleteToDoData=function(value){
			var object={};
			object.id=value;
		var $req={
			url:"/deleteToDoData",
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:object,
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				console.log(res.data.data);
				if(res.data.status==1){
					$scope.todos=res.data.data;
					$scope.getToDoData();
				}
					
				else
					alert(res.data.message);		
		});
		}
		
		$scope.GetData();
		$scope.getToDoData();
		$scope.getAlbumData();
		 boundary = "----------"+new Date();
		$scope.SaveData=function(){
			var $req={
			url:"/saveUserData",
			method:"POST",
			headers: {'Content-Type':undefined},
			data:this.profile,
			responseType:"json",
			transformRequest: function(obj) {
				 var formData = new FormData();
					angular.forEach(obj, function (value, key) {
                    formData.append(key, value);
                });
                formData.append("user_image_file", $("#user_image_file")[0].files[0]);
                return formData;
			}
			};
			$http($req).then(
			function(res){
				$scope.GetData();
			});
		}
		$scope.SaveAlbumData=function(){alert();
			if($("#album_image_file").val()=="" || !this.album.name || !this.album.description) return;
			var $req={
			url:"/saveAlbumData",
			method:"POST",
			headers: {'Content-Type':undefined},
			data:this.album,
			responseType:"json",
			transformRequest: function(obj) {
				 var formData = new FormData();
					angular.forEach(obj, function (value, key) {
                    formData.append(key, value);
                });
                formData.append("image", $("#album_image_file")[0].files[0]);
                return formData;
			}
			};
			$http($req).then(
			function(res){
				this.album="";
				$scope.getAlbumData();
			});
		}
		$scope.SaveToData=function(){
			if(!this.todo.text || !this.todo.date) return;
			var $req={
			url:"/getToDoData",
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:this.todo,
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				$scope.todo.text="";
				$scope.todo.date="";
				$scope.getToDoData();
		 });
		}
		
});
app.directive('usernameAvailable', function($timeout, $q, $http) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
		model.$asyncValidators.usernameExists = function(modelValue, viewValue) {
        var $req={
			url:"/checkusername",
			method:"POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:{uname:elm.val()},
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		return $http($req).then(
			function(res){+
			$timeout(function(){
				model.$setValidity('usernameExists', !!res.data.status); 
			}, 1000);
        });
        
      };
    }
  } 
});

