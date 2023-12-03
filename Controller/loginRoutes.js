const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../Model/usersModel");
const bcrypt = require("bcrypt");
const { SECRET } = require("../utils/config");

loginRouter.post("/login", async (req, res) => {
  
  const { email, password } = req.body;

  
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: "invalid username/Please Sign-up" });
  }

  if (!user.verified) {
    return res.status(401).json({ error: "account not verfied" });
  }
  const passwordCheck = await bcrypt.compare(password, user.password);

  if (!passwordCheck) {
    return res.status(401).json({ error: "password wrong" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };
  
  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });

  res.status(200).send({ token, username: user.username, email: user.email });
});

module.exports = loginRouter;