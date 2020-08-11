const express = require('express');
const topStories = require('./routes/topStories');
const comments = require('./routes/comments');
const pastStories = require('./routes/pastStories');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(topStories);
app.use(comments);
app.use(pastStories);

//Error Handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

//starting server
app.listen(PORT, () => {
    console.log(`App listning on port ${PORT}`);
})