const jwt = require("jsonwebtoken");

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE3Mjk3MGQwMjg5MjFmY2Y4MGIyZTRjIiwiZW1haWwiOiJ1c2VyQG1haWwuY29tIiwiaWF0IjoxNjM3NzMzOTAzfQ.72eu3R7IYw6FCHO7HaI6qmbsEaSG5GZSp9aPbU8Fv-c';

var decoded = jwt.verify(token, 'IPAKPASSSECRET');

console.log(decoded);