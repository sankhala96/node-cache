const express = require('express');
const redis = require('redis');
const topStories = require('./routes/topStories')

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

app.use(topStories);

app.listen(PORT, () => {
    console.log(`App listning on port ${PORT}`);
})