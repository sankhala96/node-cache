const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const cache = require('../middlewares/cache');

const router = express.Router();
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const CACHE_KEY = "topStories";

router.get('/top-stories', cache(CACHE_KEY), async (req, res) => {
    try {
        console.log('fetching data..');

        const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const data = await topStoriesResponse.json();
        let response = [];

        //Taking only top 10 stories
        data.splice(9, data.length - 10);

        //get data for all top stories
        response = await  Promise.all( data.map(async (id) => {
            const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            
            return storyResponse.json();
        }) )

        //set data to redis
        client.setex(CACHE_KEY, 600, JSON.stringify(response));

        res.send(response)

    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

module.exports = router;