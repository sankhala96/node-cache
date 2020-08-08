const express = require('express');
const topStories = require('./routes/topStories')

const PORT = process.env.PORT || 5000;

const app = express();

app.use(topStories);

app.listen(PORT, () => {
    console.log(`App listning on port ${PORT}`);
})