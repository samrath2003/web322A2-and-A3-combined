const fs = require("fs");
//const { getEnabledCategories } = require("trace_events");
let posts = [];
let categories = [];
let PostsByCategory = [];
let PostsByMinDate = [];
let PostsById = [];
function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read data from posts.json");
        return;
      }
      posts = JSON.parse(data);
      fs.readFile("data/categories.json", "utf8", (err, data) => {
        if (err) {
          reject("unable to fetch data from categories.json");
          return;
        }
        categories = JSON.parse(data);
        resolve();
      });
    });
  });
}
function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("heyy no results returned");
      return;
    }
    resolve(posts);
  });
}
function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    var PublishedPosts = [];
    PublishedPosts = posts.filter((post) => post.published);
    if (PublishedPosts.length === 0) {
      reject("no posts with published value true");
    } else {
      resolve(PublishedPosts);
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("no data was observed in categories.json");
    } else resolve(categories);
  });
}

function addPost(postData) {
  return new Promise((resolve, reject) => {
    if (postData.published === undefined) {
      postData.published = false;
    }
    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    PostsByCategory = posts.filter((post) => post.category === category);
    if (PostsByCategory.length > 0) {
      resolve(PostsByCategory);
    } else reject("no results found ");
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    PostsByMinDate = posts.filter(
      (post) => new Date(post.postDate) >= new Date(minDateStr)
    );
    if (PostsByMinDate.length > 0) {
      resolve(PostsByMinDate);
    } else {
      reject("no results found");
    }
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    PostsById = posts.filter((post) => post.id === id);
    if (PostsById.length > 0) {
      resolve(PostsById[0]);
    } else {
      reject("no results found");
    }
  });
}
module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
};
