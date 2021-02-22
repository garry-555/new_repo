
var express    =require("express"),
bodyParser     =require("body-parser"),
methodOverride =require("method-override"),
expressSanitizer=require("express-sanitizer"),  // it's very useful as it restricts user to put any unnecessary js code in blog post
mongoose       = require("mongoose")
app            =express();
  //  APP CONFIG
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public/')); // here is the public directory so that we can share our customs stylesheets
app.use(bodyParser.urlencoded({extended:true})); //app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method")); 
app.use(expressSanitizer());  // ALWAYS AFTR BODY -PARSER
                                     

//  MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,                                // u can place default image as well
	body:String,                                 // image:{type: String, default:"placeholder.jpg"}
	created:{type:Date,default: Date.now}       // date(auto create)
	
});
var Blog =mongoose.model("Blog",blogSchema);

// RESTFUL ROUTES

app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("something went wrong!!!");
		}else{
			  res.render("index",{blogs:blogs});
		}
	});
  
});
// NEW ROUTE
  app.get("/blogs/new",function(req,res){
	  res.render("new");
  });
// CREATE ROUTE
app.post("/blogs",function(req,res){
	req.body.blog.body =req.sanitize(req.body.blog.body);
	//CREATE THE BLOG
	Blog.create(req.body.blog,function(err,newBlog){  //Blog.create(data,callback); //THIS IS THE BASIC FORMAT
		  if(err){
			  res.render("new");
		  }else{
			  	// REDIRECT THE BLOG TO INDEX!
			      res.redirect("/blogs");
		  }
		
		 
	});
});

// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});
// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	 Blog.findById(req.params.id,function(err,editBlog){
		 if(err){
			 res.redirect("/blogs");
		 }else{
			 res.render("edit",{blog:editBlog});
		 }
		 
	 });
});
// UPDATE ROUTE 
app.put("/blogs/:id",function(req,res){
  // res.send("u hv updated ur post!!!!")    //Blog.findByIdAndUpdate(Id,newData,callback);
	req.body.blog.body =req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
	      if(err){
			    res.redirect("/blogs/:id/edit");
		  }else{
			   res.redirect("/blogs/"+ req.params.id);
		  }
	   
	      
      });
});
// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
// DESTROY BLOG AND REDIRECT SOMEWHERE
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	
});






app.listen(5000,function(){
	console.log("its just the beginning! :+)");
});
