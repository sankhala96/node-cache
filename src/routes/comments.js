const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");

const cache = require('../middlewares/cache');

const router = express.Router();
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const CACHE_KEY = "comments";

router.get("/comments/:id", cache(), async (req, res, next) => {
	const { id } = req.params;

	try {
		console.log("fetching comments..");

		//getting all commnets for a given story
		const storyData = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
		const data = await storyData.json();
		const comments = data.kids;
		let response = [];
		const sortObj = {
			0: [],
		};

		await Promise.all(
			comments.map(async (id) => {

				//Geting comment details
				const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
				const comment = await commentResponse.json();

				//if comment have sub comments(kids), we will be storing them in a obj based on their length
				if (comment.kids && comment.kids.length) {
					const key = comment.kids.length;

					if (!sortObj[key]) {    //If there is no entery for that key, create a entery
						sortObj[key] = [];
					}
					sortObj[key].push(comment);
				} else {
					sortObj[0].push(comment);
				}
			})
		);

		//pushing the comments in response in ascending order
		Object.keys(sortObj).reverse().map((key) => {
			response = response.concat(sortObj[key]);
		});

		//extracting top 10 commnets sorted by total no of commnets (including child)
		response.splice(9, response.length - 10);

		//set data to redis
		client.setex(id, 600, JSON.stringify(response));

		res.send(response);
	} catch (err) {
		console.error(err);
		res.status(500);
		next(err);
	}
});

module.exports = router;
