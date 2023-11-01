// 1. Install necessary dependencies
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { checkCredentials, getCDetails, getCusId, getEDetails, createCurrent } from "./database/database.js";
import { getSavTypeDetails } from "./database/database.js";
import { getSavingsDetails } from "./database/database.js";
import { getCurrentDetails } from "./database/database.js";
import {makeMoneyTransfer} from "./database/database.js";
import { getFDInfo } from "./database/database.js";
import { authenticateAdminToken, authenticateUserToken } from "./auth.js"

// Set up the express app
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

////////////////////////////////////////////////////////////////////////////
//authentication + dashboard

let isAuthenticated = false;
app.get("/", (req, res) => {
  res.render("login");
});

//basic details
let userId = "";
let name = "";
let user_type = "";

app.post("/dashboard", async (req, res) => {
  const userName = req.body.username;
  const pw = req.body.password;

  await checkCredentials(userName, pw).then(async (result) => {
    if (result) {
      userId = result[0].user_id;
      user_type = result[0].user_type;

      if (user_type == "customer") {

        const token = jwt.sign(
          { un: userName, role: "customer" },
          "jwt_User_privateKey",  ///this is a password ///////////
          { expiresIn: "5s" }
        );
        console.log(token);

        res.cookie("jwt", token, { httpOnly: true }); // Token will expire in 20 min (1200000 ms)


        let cDet = await getCDetails(userId);
        let sDet =  await getSavingsDetails(userId);
        let cuDet=  await getCurrentDetails(userId);

        let savingsAccountNo;
        let savingsAccountBalance;
        let withdrawalsLeft;
        let currentAccountNo; 
        let currentAccountBalance;

        if (sDet != undefined) {
          savingsAccountNo = sDet.account_no;
          savingsAccountBalance = sDet.balance;
          withdrawalsLeft = sDet.remaining_withdrawals;
        }
        if (cuDet != undefined) {
          currentAccountNo = cuDet.account_no;
          currentAccountBalance = cuDet.balance;
        }

        res.render("dashboard", {
          "name": cDet.name,
          "savingsAccountNo": savingsAccountNo,
          "savingsAccountBalance": savingsAccountBalance,
          "withdrawalsLeft": withdrawalsLeft,
          "currentAccountNo": currentAccountNo,
          "currentAccountBalance": currentAccountBalance
      });
     

      }

      else if (user_type == "employee") {

        const token = jwt.sign(
          { un: userName, role: "employee" },
          "jwt_Admin_privateKey",  ///this is a password ///////////
          { expiresIn: "5m" }
        );
        console.log(token);

        res.cookie("jwt", token, { httpOnly: true }); // Token will expire in 20 min (1200000 ms)

        let eDet = await getEDetails(userId);

        res.render("employeeDash", {
          "name": eDet.name


        });     
        isAuthenticated = true;
      }
    } else {
      res.redirect("/");
    }
  });
});

app.get("/dashboard", async (req, res) => {
  if (isAuthenticated) {

    if (user_type == "customer") {

      let cDet = await getCDetails(userId);
      let sDet =  await getSavingsDetails(userId);
      let cuDet=  await getCurrentDetails(userId);
  
      let savingsAccountNo;
      let savingsAccountBalance;
      let withdrawalsLeft;
      let currentAccountNo; 
      let currentAccountBalance;
  
      if (sDet != undefined) {
        savingsAccountNo = sDet.account_no;
        savingsAccountBalance = sDet.balance;
        withdrawalsLeft = sDet.remaining_withdrawals;
      }
      if (cuDet != undefined) {
        currentAccountNo = cuDet.account_no;
        currentAccountBalance = cuDet.balance;
      }

        res.render("dashboard", {
          "name": cDet.name,
          "savingsAccountNo": savingsAccountNo,
          "savingsAccountBalance": savingsAccountBalance,
          "withdrawalsLeft": withdrawalsLeft,
          "currentAccountNo": currentAccountNo,
          "currentAccountBalance": currentAccountBalance
        }); 
    }else if (user_type == "employee") {
      let eDet = await getEDetails(userId);

      res.render("employeeDash.ejs", {
        "name": eDet.name,  
      });
    }
  }else {
    res.redirect("/");
  }
    

});

////////////////////////////////////////////////////////////////////////////
//savings
app.get("/savings", authenticateUserToken , async (req, res) => {

  let cDet = await getCDetails(userId);
  let sDet =  await getSavingsDetails(userId);
  let sType = await getSavTypeDetails(sDet.account_type);

  res.render("savings", {
    "name": cDet.name,
    "savingsAccountNo": sDet.account_no,
    "savingsAccountBalance": sDet.balance,
    "withdrawalsLeft": sDet.remaining_withdrawals,
    "accountType": sDet.account_type,
    "interestRate": sType.interest_rate  ///////////////////////////////////////////////////////////// check
  });
});

////////////////////////////////////////////////////////////////////////////
//savings-transfers
app.get("/transfers-savings", async (req, res) => {
  res.render("savings-transfers");
});

////////////////////////////////////////////////////////////////////////////
//savings-transfers-do
app.post("/transfer-savings-do", async (req, res) => {
  const sender = req.body.fromAccount;
  const receiver = req.body.toAccount;
  const amount = req.body.amount;
  try {
    await makeMoneyTransfer(sender, receiver, amount);
    res.render("savings-transfers-do", { "status": "Successful" });
  }catch (err) {
    console.log(err);
    res.render("savings-transfers-do", { "status": "Failed" });

  }
});


////////////////////////////////////////////////////////////////////////////
//current
app.get("/current",async (req, res) => {
  console.log(userId);
  let cDet = await getCDetails(userId);
  let cuDet=  await getCurrentDetails(userId);
  
  res.render("current", {
    "name": cDet.name,
    "currentAccountNo": cuDet.account_no ,
    "currentAccountBalance": cuDet.balance,
  });
});

////////////////////////////////////////////////////////////////////////////
//current-transfers
app.get("/transfers-current", (req, res) => {
  res.render("current-transfers");
});

////////////////////////////////////////////////////////////////////////////
//Fixed-Deposits
app.get("/fd", async(req, res) => {

  let savingsData = await getSavingsDetails(userId);
  let fdData = await getFDInfo(savingsData.account_no);


  let fd_id;
  let amount;
  let start_date;
  let end_date;
  let duration;
  let rate;


  if (fdData != undefined) {

    fd_id = fdData.fd_id;
    amount = fdData.amount;
    start_date = fdData.start_date;
    end_date = fdData.end_date;
    duration = fdData.duration;
    rate = fdData.rate;
  }
  res.render("fd", {
    "fd_id": fd_id,
    "amount": amount,
    "startDate": start_date,
    "endDate": end_date,
    "rate": rate,
    "duration": duration
  });
});

////////////////////////////////////////////////////////////////////////////
//loan-request
app.post("/request-loan-online", (req, res) => {
  const amount = req.body.amount;
  const duration = req.body.duration;
  res.render("loanRequests-online", { amount: amount, duration: duration });
});

////////////////////////////////////////////////////////////////////////////
//Loans
app.get("/loan", (req, res) => {
  res.render("loan", {
    interestRate: "7.5%",
    accountNo: "210383L",
    loanAmount: "LKR.5,000,000",
    duration: "1 year",
    remainingPeriod: "11 months",
    totalInterest: "LKR.375,000",
    oneInstallment: "LKR.468,750",
    noOfInstallmets: "12",
    payPerIns: "LKR.39,062.50",
  });
});

////////////////////////////////////////////////////////////////////////////
//logout
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
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


//////////////////////////////////////////////////////////////////////
//employee dashboard

app.post("/searched-customer", async (req, res) => {
  console.log(req.body.customerSearch)
  const cusId = await getCusId(req.body.customerSearch) ;

  if (cusId == false) {
    res.redirect("/dashboard");
  }
  else{
    let cDet = await getCDetails(cusId);
    let sDet =  await getSavingsDetails(cusId);
    let cuDet=  await getCurrentDetails(cusId); 

    if (cDet == undefined) {
      res.redirect("/dashboard");
    }else{

    
  
    let savingsAccountNo;
    let savingsAccountBalance;
    let withdrawalsLeft;
    let currentAccountNo; 
    let currentAccountBalance;
    let accountType;
    let savingsBId;
    let currentBId;
    let name;
    let address;
    let phone;
  
    if(cDet != undefined){
      name = cDet.name;
      address = cDet.address;
      phone = cDet.telephone;
    }
  

    if (sDet != undefined) {
      savingsAccountNo = sDet.account_no;
      savingsAccountBalance = sDet.balance;
      withdrawalsLeft = sDet.remaining_withdrawals;
      accountType = sDet.account_type;
      savingsBId = sDet.branch_id;
  
    }
    if (cuDet != undefined) {
      currentAccountNo = cuDet.account_no;
      currentAccountBalance = cuDet.balance;
      currentBId = cuDet.branch_id;
    }
    res.render("customer",{
      "name": name,
      "account_type": accountType,
      "address": address,
      "phone": phone,
      "savingsAccountNo": savingsAccountNo,
      "savingsAccountBalance": savingsAccountBalance,
      "withdrawalsLeft": withdrawalsLeft,
      "savingsBId": savingsBId,
      "currentAccountNo": currentAccountNo,
      "currentAccountBalance": currentAccountBalance,
      "currentBId": currentBId,
      "fd_exist": false,
      "loan_exist": false,
      "cusId": cusId
    });

  }
  }

});

app.get("/create-customer", (req, res) => {
  res.render("create-customer");

});

app.post("add-savings", (req, res) => {
  const cusId = req.body.cusId;


  res.render("add-savings");
} );

app.post("/add-current", (req, res) => {
  console.log(req.body.cusId);
  console.log("hi")
  res.render("add-current", {"cusId": req.body.cusId});
} );

app.post("/added-current", (req, res) => {
  const cusId = req.body.cus_id;
  console.log(cusId);
  console.log(req.body.cus_id);
  const BId = req.body.branch_id;
  const startDate = req.body.start_date;
  const startAmount = req.body.start_amount;

  createCurrent(cusId, BId, startDate, startAmount);
  
  res.redirect("");
} );

app.post("/add-fd", (req, res) => {
  const cusId = req.body.cusId;
  res.render("add-fd");
} );
app.post("/add-loan", (req, res) => {
  const cusId = req.body.cusId;
  res.render("add-fd");
} );

