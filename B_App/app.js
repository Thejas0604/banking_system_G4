// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { checkCredentials } from "./database/database.js";

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

////////////////////////////////////////////////////////////////////////////
//authentication + dashboard
let un;
let isAuthenticated = false;
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/dashboard", async (req, res) => {
  un = req.body.username;
  const pw = req.body.password;

  await checkCredentials(un, pw).then((result) => {
    if (result) {
      res.render("dashboard", {
        userName: un,
        savingsAccountNo: "210383L",
        savingsAccountBalance: 5000,
        WithdrawalsLeft: 3,
        currentAccountNo: "210383L",
        currentAccountBalance: 5000,
      }); //connect and render dashboard
      isAuthenticated = true;
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", (req, res) => {
  if (isAuthenticated) {
    res.render("dashboard.ejs", {
      userName: un,
      savingsAccountNo: "210383L",
      savingsAccountBalance: 5000,
      WithdrawalsLeft: 3,
      currentAccountNo: "210383L",
      currentAccountBalance: 5000,
    });
  } else {
    res.redirect("/");
  }
});

////////////////////////////////////////////////////////////////////////////
//savings
app.get("/savings", (req, res) => {
  res.render("savings", {
    userName: un,
    savingsAccountNo: "210383L",
    savingsAccountBalance: 5000,
    WithdrawalsLeft: 3,
    interestRate:"10%"
  });
});

////////////////////////////////////////////////////////////////////////////
//current
app.get("/current", (req, res) => {
  res.render("current", { userName: un });
});

////////////////////////////////////////////////////////////////////////////
//Fixed-Deposits
app.get("/fd", (req, res) => {
  res.render("fd");
});

////////////////////////////////////////////////////////////////////////////
//Loans
app.get("/loan", (req, res) => {
  res.render("loan");
});

////////////////////////////////////////////////////////////////////////////
//logout
app.get("/logout", (req, res) => {
  isAuthenticated = false;
  res.redirect("/");
});

////////////////////////////////////////////////////////////////////////////
//about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

////////////////////////////////////////////////////////////////////////////
//contact page
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

////////////////////////////////////////////////////////////////////////////
//starting server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
