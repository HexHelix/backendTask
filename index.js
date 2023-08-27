const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const math = require('mathjs');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./history.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS operations (id INTEGER PRIMARY KEY, question TEXT, answer TEXT)`);
  });

  const saveOperation = (question, answer) => {
    db.run(`INSERT INTO operations (question, answer) VALUES (?, ?)`, [question, answer], (err) => {
      if (err) {
        console.error('Error saving operation:', err.message);
      }
    });
  };

app.get("/", (req, res) => {
  res.send(
    "Welcome to the math server! Send mathematical operations in the URL."
  );
});

app.get("/history", (req, res) => {
  res.send("History");
});


app.get(/^(\/[0-9]+\/(plus|minus|dividedby|into)\/[0-9]+)(\/(plus|minus|dividedby|into)\/[0-9]+)*\/?$/, (req, res) => {
    const expression = req.originalUrl.slice(1);

    const operators = {
      into: '*',
      plus: '+',
      minus: '-',
      dividedby: '/'
    };
  
    const parts = expression.split('/').filter(part => part !== '');
  
    let sanitizedExpression = '';
    for (let i = 0; i < parts.length; i++) {
      if (operators[parts[i]]) {
        sanitizedExpression += operators[parts[i]];
      } else {
        sanitizedExpression += parts[i];
      }
    }
  
    let result;
    try {
      result = math.evaluate(sanitizedExpression);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid expression' });
    }
  
    const question = sanitizedExpression;
    const answer = result.toString();
  
    saveOperation(question, answer);
  
    res.json({ question, answer });
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
