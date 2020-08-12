#Prerequisite:
download redis in your machine
https://redis.io/download

opne the downloaded folder and run redis-server.exe


#Start the project
npm i
npm start

It will start on port 5000


APIs:

/top-stories — returns the top 10 stories ranked by score in the last 10 minutes
/comments/:id — returns the top 10 parent comments on a given story, sorted by the total number of comments (including child comments) per thread.
/past-stories — returns all the past top stories that were served previously.
