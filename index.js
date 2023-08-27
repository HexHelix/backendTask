const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(
    "Welcome to the math server! Send mathematical operations in the URL."
  );
});

app.get("/history", (req, res) => {
  res.send("History");
});
