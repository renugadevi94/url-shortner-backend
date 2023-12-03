const urlRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { SECRET, BEURL } = require("../utils/config");
const User = require("../Model/usersModel");
const Url = require("../Model/urlModel");


const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
};


urlRouter.get("/user/url", async (req, res) => {
  try {
    
    const token = getTokenFrom(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: "session timeout please login again" });
    }
    
    const decodedToken = jwt.verify(token, SECRET);
    
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const urls = await User.findById(decodedToken.id).populate("url");
    res.status(200).json(urls.url);
  } catch (error) {
    return res
      .status(400)
      .json({ Err: "Error on fetching data please login again to fetch" });
  }
});



urlRouter.post("/user/url", async (req, res) => {
  try {
    
    const body = req.body;

    
    const token = getTokenFrom(req);

    
    const decodedToken = jwt.verify(token, SECRET);

    
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    
    const user = await User.findById(decodedToken.id);

    

    let letters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let random = "";
    for (i = 0; i < 4; i++) {
      random += letters[Math.floor(Math.random() * letters.length)];
    }
    const shorturl = `${BEURL}/st/` + random;

    const url = new Url({
      longurl: body.longurl,
      shorturl: shorturl,
      random: random,
      user: user._id,
    });

    

    const savedUrl = await url.save();

    

    user.url = user.url.concat(savedUrl._id);

    await user.save();

    res.status(200).json(savedUrl);
    
  } catch (error) {
    return res
      .status(400)
      .json({ Err: "Error on updating please try again later" });
  }
});

module.exports = urlRouter;