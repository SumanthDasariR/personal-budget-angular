const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const budget = require("./budgetData.json");
app.use(cors());
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.get("/budget", (req, res) => {
  res.json(budget);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
