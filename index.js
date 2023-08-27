const express = require("express");
const { re } = require("mathjs");

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


app.get(/^(\/[0-9]+\/(plus|minus|dividedby|into)\/[0-9]+)(\/(plus|minus|dividedby|into)\/[0-9]+)*\/?$/, (req, res) => {
    res.json({
        expression: req.originalUrl
    })
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
