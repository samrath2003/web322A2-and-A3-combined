const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const posts = require("./data/posts.json");
const categories = require("./data/categories.json");
const blogService = require("./blog-service");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;

cloudinary.config({
  cloud_name: "dyxegadrc",
  api_key: "638954724841219",
  api_secret: "ovdWTvISmMmtMi-yqVg7unekDx8",
  secure: true,
});

const upload = multer();

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
  if (req.query.category) {
    const category = parseInt(req.query.category, 10);
    if (category < 1 || category > 5) {
      return res.status(400).json({ message: "Invalid category filter" });
    }

    blogService.getPostsByCategory(category).then((PostsByCategory) => {
      res.json(PostsByCategory);
    });
  } else if (req.query.minDate) {
    const minDate = new Date(req.query.minDate);
    blogService
      .getPostsByMinDate(minDate)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    blogService
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});
app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});
app.get("/post/:value", (req, res) => {
  const value = parseInt(req.params.value, 10);
  blogService
    .getPostById(value)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/posts/add", upload.single("featureImage"), async (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;

    blogService
      .addPost(req.body)
      .then(() => {
        res.redirect("/posts");
      })
      .catch((err) => {
        console.log(err + "error in adding post");
      });
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
