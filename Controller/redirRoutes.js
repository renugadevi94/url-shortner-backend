const redirectRouter = require("express").Router();

const Url = require("../Model/urlModel");


redirectRouter.get("/st/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const urlData = await Url.findOne({ random: id });
    res.redirect(urlData.longurl);
  } catch (error) {
    console.error(error);
  }
});

module.exports = redirectRouter;