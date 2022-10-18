const express = require("express");

const app = express();
const port = 3001;
app.get("/greetings", (request, response) => {
  response.status(200).send("Hello World!");
});
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
require("dotenv").config();
