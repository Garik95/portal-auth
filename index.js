require('./models/index.js');
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// general routes
require('./routes/v1')(app);

// specific routes
require('./routes/v1/testRoute')(app);


// set port, listen for requests
const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});