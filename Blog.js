var bodyParser = require("body-parser")
var   mongoose = require("mongoose");
var    express = require("express")
var    app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/Blog_app", {
        useMongoClient: true
    });

    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));

//Creating the blog Schema
var blogSchema = new mongoose.Schema({
     title: String,
     image: String,
     body: String,
     created: {type: Date, default: Date.now}
})

//Modelling the schema
var blog = mongoose.model("blog", blogSchema);

//Creating the first Blog
//blog.create({
  // title: "Test Blog",
   //image: "http://cdn.osxdaily.com/wp-content/uploads/2012/02/read-receipts-imessage-mac.jpg",
   //body: "THIS IS A MAC OS X USELESS FUCKING THING"
//})

//LISTING ALL THE POSTS
app.get("/blogs", function(req, res){
  blog.find({}, function(err, blogs){
    if(err){
      console.log ("ERROR")
    } else{
      res.render("index", {blogs: blogs});
    }
  });
})

//INDEX ROUTE
app.get("/", function(rer, res){
    res.redirect("/blogs")
})

//NEW ROUTE
app.get("/blogs/new", function(req, res){
   res.render("new")
})

//CREATING THE POST
app.post("/blogs", function(req, res){
  //Create blog
  blog.create(req.body.blog, function(err, newBlog){
    if(err){
       res.render("new")
    } else {
        res.redirect("/blogs")
    }
  })

})

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
      blog.findById(req.params.id, function(err, blog){
        if(err){
          res.redirect("/")
        } else {
             res.render("show", {blog: blog});
        }
      })
          })

//EDIT ROUTE
app.get("/blogs/:id/edit",  function(req, res){
      blog.findById(req.params.id, function(err, blog){
        if(err){
             res.redirect("/")
        } else {
          res.render("edit", {blog: blog});
        }
      })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err){
           res.redirect("/blogs/:id/edit")
        } else {
          res.redirect("/blogs/" + req.params.id);
        }
   })
})

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
  //Deleting Command
  blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs")
    } else { res.redirect("/blogs")}
  })
})


    //Creating the server listener
    app.listen("3500", function()
      {
        console.log("The server is running just fine")
      });
