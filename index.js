const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();
const mthodOverride = require("method-override");
const PORT = process.env.PORT || 5000;

// Schema
const Post = require("./models/PostModel");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override
app.use(mthodOverride("_method"));

// Connect with Database
const uri =
  "mongodb+srv://agradut:agradut@cluster0.dziq6.mongodb.net/mycrud?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected with MongoDB ");
  })
  .catch((error) => {
    console.log("Error Found !", error);
    process.exit(1);
  });

// Handlebars
app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

app.get("/", async (req, res) => {
  const posts = await Post.find({}).lean();
  res.render("home", {
    posts,
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

// edit Page
app.get("/edit/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id }).lean();
  res.render("edit", {
    post,
  });
});

// Post Method
app.post("/add", async (req, res) => {
  const { title, body } = req.body;
  const newPost = new Post({
    title,
    body,
  });
  const post = await newPost.save();

  if (post) {
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

// Update
app.put("/update", async (req, res) => {
  const { title, body, id } = req.body;

  const post = await Post.findById(id);

  if (post) {
    post.title = title;
    post.body = body;

    const updatedPost = await post.save();

    if (updatedPost) {
      res.redirect("/");
    } else {
      res.redirect("/edit/" + id);
    }
  } else {
    res.redirect("/");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const deleted = await Post.deleteOne({ _id: req.params.id });
  if (deleted) {
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

app.listen(PORT, console.log(`Server Running On port ${PORT}`));
