const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const PromisePool = require('@supercharge/promise-pool')

const cache = require('../middlewares/cache');

const router = express.Router();
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const CACHE_KEY = "topStories";
const PAST_STORIES = "pastStories";

router.get('/top-stories', cache(CACHE_KEY), async (req, res, next) => {
    try {
        console.log('fetching data..');

        const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const data = await topStoriesResponse.json();

        const { results, errors } = await PromisePool.for(data)
          .withConcurrency(100)
          .process(async (id) => {
            const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return story.json();;
          });

        results.sort(function(a, b){ 
            return a.score-b.score
        })

        //Taking only top 10 stories
        const response = results.slice(results.length-10);

        //set data to redis
        client.setex(CACHE_KEY, 6, JSON.stringify(response));

        //Adding the fetched stories to past stories key
        const multi = client.multi()
        response.map(obj => {
            multi.rpush(PAST_STORIES, JSON.stringify(obj))
        });

        multi.exec(function(err, response) {
            if(err) throw err; 
        })

        res.send(response)

    } catch (err) {
        console.error(err);
        res.status(500);
        next(err);
    }
});

module.exports = router;