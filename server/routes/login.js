const app = require("express");
const router = app.Router();
const LoginController = require("../controllers/login");

router.post("/signin", async (req, res) => {
  //dang nhap
  const login = await LoginController.signIn(req.body.email, req.body.password);

  if (login == true) {
    return res.status(200).send("Sign in successfully");
  } else {
    return res.status(400).json({ error: "Error when signing in" });
  }
});

router.post("/signup", async (req, res) => {
  // dang ky
  const email = req.body.email;
  const inputPassword = req.body.password;
  console.log(email);
  console.log(inputPassword);
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //regex check email
  const validMail = emailRegex.test(email);
  if (!validMail) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }
  const emailExists = await LoginController.emailExists(email);
  if (emailExists) {
    res.status(400).json({ error: "User with this email exists" });
    return;
  }

  const register = await LoginController.register(email, inputPassword);
  console.log(register);

  if (register == true) {
    res.status(200).send("Registered successfully");
  } else {
    res.status(400).json({ error: "Error when registering" });
  }
});

module.exports = router;
