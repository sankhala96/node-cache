const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");

const router = express.Router();
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const PAST_STORIES = "pastStories";

router.get("/past-stories", async (req, res, next) => {
  try {
    console.log("fetching past stories");

    client.smembers(PAST_STORIES, function (error, items) {
      if (error) throw error;

      const response = items.map(item => {
          return JSON.parse(item);
      })
      res.send(response);
    });

  } catch (err) {
    res.status(500);
    next(err);
  }
});

module.exports = router;
