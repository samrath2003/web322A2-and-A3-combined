const posts = require("./data/posts.json");
const categories = require("./data/categories.json");
const blogService = require("./blog-service");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static("public"));
app.get("/", (req, res) => {
  //res.send("helloo your welcome");
  res.redirect("/about");
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  // var container = [];
  //posts.forEach((singlePost, i) => {
  //  if (singlePost.published === true) {
  //    container.push(singlePost);
  // }
  // });
  // res.json(container);
});

app.get("/posts", (req, res) => {
  blogService
    .getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send("the promise was rejected" + err);
    });
});
app.use((req, res) => {
  res.status(404).send("Alas! page not Found :(");
});

blogService
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server running on " + PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize blog data", err);
  });
