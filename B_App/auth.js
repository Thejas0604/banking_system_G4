// Middleware for Admin authentication
const authenticateAdminToken = (req, res, next) => {
    let storedTKN = req.cookies.jwt;
  
    if (!storedTKN) {
      return res.status(401).render("SuccessMsg", {
        showSuccessCard: false,
        message: "Connection Lost. Please Login Again.",
      });
    }
  
    try {
      jwt.verify(storedTKN, "jwt_Admin_privateKey");
      next();
    } catch (err) {
      return res.status(403).render("Admin_login");
    }
  };
  
  // Middleware for User authentication
  const authenticateUserToken = (req, res, next) => {
    let storedTKN = req.cookies.jwt;
  
    if (!storedTKN) {
      return res.status(401).render("SuccessMsg", {
        showSuccessCard: false,
        message: "No Token Provided !",
      });
    }
  
    try {
      jwt.verify(storedTKN, "jwt_User_privateKey");
      next();
    } catch (err) {
      return res.status(403).render("User_login");
    }
  };









  app.post("/Admin_Mode", (req, res) => {
    const { email, password } = req.body;
  
    const sql = "SELECT * FROM admin WHERE Email_Address = ? AND Password = ?";
  
    db.query(sql, [email, password], (err, result) => {
      if (err) {
        res.status(400).render("SuccessMsg", {
          showSuccessCard: false,
          message: "No Token Provided !",
        });
      }
  
      if (result.length >= 1) {
        const token = jwt.sign(
          { email: email, Role: "Admin" },
          "jwt_Admin_privateKey",
          { expiresIn: "20m" }
        );
  
        // Set the token as an HTTP-only cookie
        res.cookie("jwt", token, { httpOnly: true }); // Token will expire in 20 min (1200000 ms)
        res.redirect("/admin_portfolio");
      } else {
        res.status(400).render("Admin_login");
      }
    });
  });