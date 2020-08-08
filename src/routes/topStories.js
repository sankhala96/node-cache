const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/top-stories', async (req, res) => {
    try {
        console.log('fetching data..');

        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const data = await response.json();

        res.send(data)

    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

module.exports = router;