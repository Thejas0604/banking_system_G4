// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { checkCredentials } from "./database/loginCheck.js";

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const un = req.body.username;
  const pw = req.body.password;

  await checkCredentials(un, pw).then((result) => {
    if (result) {
      res.render("dashboard");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
