const express = require('express');
const topStories = require('./routes/topStories');
const comments = require('./routes/comments');
const pastStories = require('./routes/pastStories');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(topStories);
app.use(comments);
app.use(pastStories);

app.listen(PORT, () => {
    console.log(`App listning on port ${PORT}`);
})