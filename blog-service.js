const fs = require("fs");
//const { getEnabledCategories } = require("trace_events");
let posts = [];
let categories = [];
function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject("unable to read data from posts.json");
        return;
      }
      posts = JSON.parse(data);
      fs.readFile("data/categpories.json", "utf8", (err, data) => {
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

module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
};
