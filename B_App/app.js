// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { checkCredentials } from "./database/database.js";
import { getUserName } from "./database/database.js";

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

////////////////////////////////////////////////////////////////////////////
//authentication + dashboard
let user_id;
let USERNAME;
let isAuthenticated = false;
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/dashboard", async (req, res) => {
  user_id = req.body.userID;
  USERNAME = await getUserName(user_id);
  const pw = req.body.password;

  await checkCredentials(user_id, pw).then((result) => {
    if (result) {
      res.render("dashboard", {
        userName: USERNAME,
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
      userName: USERNAME,
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
    userName: USERNAME,
    savingsAccountNo: "210383L",
    savingsAccountBalance: 5000,
    WithdrawalsLeft: 3,
    interestRate: "10%",
  });
});

////////////////////////////////////////////////////////////////////////////
//current
app.get("/current", (req, res) => {
  res.render("current", { userName: USERNAME });
});

////////////////////////////////////////////////////////////////////////////
//Fixed-Deposits
app.get("/fd", (req, res) => {
  res.render("fd", {
    status: "Active",
    accountNo: "210383L",
    balance: "LKR.5,000,000",
    period: "1 year",
    matuarity: "12/12/2021",
    startDate: "12/12/2020",
    rate: "17.5%",
  });
});

////////////////////////////////////////////////////////////////////////////
//loan-request
app.post("/request-loan", (req, res) => {
  const amount = req.body.amount;
  const duration = req.body.duration;
  res.render("loanRequests", { amount: amount, duration: duration });
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
