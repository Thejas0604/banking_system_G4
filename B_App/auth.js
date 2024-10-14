// Middleware for Admin authentication
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const authenticateAdminToken = (req, res, next) => {
    let storedTKN = req.cookies.jwt;
    console.log("admin:", storedTKN);

    if (!storedTKN) {
        return res.status(401).send("Dead Token!");
    }

    try {
        const decoded = jwt.verify(storedTKN, process.env.JWT_PRIVATE_KEY);
        if (decoded) {
            console.log(decoded);
            console.log("valid token");
        }
        next();
    } catch (err) {
        return res.status(403).redirect("/");
    }
};

// Middleware for User authentication
const authenticateUserToken = (req, res, next) => {
    let storedTKN = req.cookies.jwt;
    console.log("user:", storedTKN);

    if (!storedTKN) {
        return res.status(401).render("login", {
            showSuccessCard: false,
            message: "No Token Provided !",
        });
    }

    try {
        const decoded = jwt.verify(storedTKN, process.env.JWT_PRIVATE_KEY);
        if (decoded) {
            console.log(decoded);
            console.log("valid token");
        }
        next();
    } catch (err) {
        console.log("invalid token");
        return res.status(403).redirect("/");
    }
};

export { authenticateAdminToken, authenticateUserToken };
