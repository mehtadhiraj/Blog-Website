//Importing required files
var express = require("express"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    app = express();
    
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

//Connecting database
mongoose.connect('mongodb://localhost/blogapp');
app.use(express.static("public"));
app.use(methodOverride('_method'));

//Databas Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{
        type: Date,
        default: Date.now
    }
});

//Creating model of database
var Blog = mongoose.model("Blog",blogSchema);

app.get('/',function(req,res){
   res.redirect("/blogs"); 
});

app.get('/blogs',function(req, res){
   Blog.find({},function(error, blogs){
       if(error){
           console.log(error);
        } else {
            res.render("index",{blogs:blogs});       
        }
   });
});

//new blog form
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

//posting a blog
app.post("/blogs",function(req, res){
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           console.log(err);
           res.render("new");
       }else {
            res.redirect("/blogs");    
       }
   }); 
});

//Content view 
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id, function(error, completeBlog){
       if(error){
           res.redirect("/blogs");
       } else {
           res.render("show",{blog:completeBlog});   
       }
    });
});

//To edit
app.get("/:id/edit",function(req, res){
    Blog.findById(req.params.id, function(error, completeBlog){
       if(error){
           res.redirect("/blogs");
       } else {
           res.render("edit",{blog:completeBlog});   
       }
    });
});

//After Edit
app.put("/blogs/:id",function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, completeBlog){
       if(error){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/"+req.params.id);   
       }
    });
});

//Delete Blog
app.delete("/:id",function(req, res){
   Blog.findByIdAndDelete(req.params.id, function(error, deletblog) {
      if(error){
          console.log(error);
      } else {
          res.redirect("/blogs");
      }
   }); 
});

//Listening to localhost
app.listen(process.env.PORT, process.env.IP,function(req, res){
    console.log('Done');
});