const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const users = require('./models/users.js')
const exercises = require('./models/exercises.js')
const e = require('express')
require('dotenv').config()
console.log('Connecting to ' + process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(bodyParser.urlencoded({ extended: "false" }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
    users.create(req.body.username, (err, doc) => {
      if (err) {
        res.send(err);
        return;
      }
      res.json(doc);
    });
});

app.get('/api/users', (req, res) => {
  users.findAll((err, docs) => {
    if (err) {
      res.send(err);
      return;
    }
    res.json(docs);
  });
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let exercise = {
    userRef: req.params._id,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date ? new Date(req.body.date) : new Date()
  };
  exercises.create(exercise, (err, doc) => {
    if (err) {
      res.send(err);
      return;
    }
    users.findById(req.params._id, (err, match) => {
      if (err) {
        res.send(err);
        return;
      }
      res.json({
        _id: match._id,
        username: match._doc.username,
        description: doc.description,
        duration: doc.duration,
        date: doc.date.toDateString()
      });
    });
  })
});


app.get('/api/users/:_id/logs', (req, res) => {
  exercises.find(req.params._id, req.query, (err, found) => {
    if (err) {
      res.send(err);
      return;
    }
    users.findById(req.params._id, (err, match) => {
      if (err) {
        res.send(err);
        return;
      }
      res.json({
        ...match._doc,
        count: found ? found.length : 0,
        log: found.map(exercise => ({ ...exercise._doc, date: exercise._doc.date.toDateString() }))
      });
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
