var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')

var app = express();

app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const models = require('./db/models');

// var events = [
//   { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://cdn.pixabay.com/photo/2018/05/31/12/02/celebration-3443810_1280.jpg" },
//   { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://cdn.pixabay.com/photo/2018/05/31/12/02/celebration-3443810_1280.jpg" },
//   { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://cdn.pixabay.com/photo/2018/05/31/12/02/celebration-3443810_1280.jpg" }
// ]

// EVENTS#INDEX (HOME) (GET)
app.get('/', (req, res) => {
  res.render('events-index');
})

// EVENTS#NEW (GET)
app.get('/events/new', (req, res) => {
  res.render(`events-new`);
})

// EVENTS#CREATE (POST)
app.post('/events', (req, res) => {
  models.Event.create(req.body).then(event => {
    res.redirect(`/events/${event.id}`);
  }).catch((err) => {
    console.log(err)
  });
});

// EVENTS#SHOW
app.get('/events/:id', (req, res) => {
  models.Event.findById(req.params.id).then(event => {
    event.getComments({ order: [ ['createdAt', 'DESC'] ] }).then(comments => {
      res.render('events-show', { comments: comments, event: event });
    });
  });
});

// EVENTS#EDIT
app.get('/events/:id/edit', (req, res) => {
  models.Event.findById(req.params.id).then((event) => {
    res.render('events-edit', { event: event });
  });
});

// EVENTS#UPDATE
app.put('/events/:id', (req, res) => {
  models.Event.update(req.body, {where: { id: req.params.id } }).then((comment) => {
    res.redirect(`/events/${req.params.id}`);
  }).catch((err) => {
    console.log(err);
  })
});

// EVENTS#DESTROY
app.delete('/events/:id', (req, res) => {
  models.Event.destory({ where: { id: req.params.id } }).then(event => {
    res.redirect(`/`);
  });
})

// COMMENTS#CREATE
app.post('/events/:eventId/comments', (req, res) => {
  models.Event.findById(req.params.eventId).then(event => {
    req.body.EventId = event.id;
    models.Comment.create(req.body).then(comment => {
      res.redirect(`/events/${req.params.eventId}`);
    }).catch((err) => {
      console.log(err)
    });
  });
});

// COMMENTS#CREATE ASYNC
// app.post('/events/:eventId/comments', async (req, res) => {
//  let event = await models.Event.findOne({ where: { eventId: req.params.eventId }});
//  req.body.EventId = event.id;
//  try {
//    let comment = await models.Comment.create(req.body);
//  } catch (err) {
//    console.log(err)
//  }
//
//  res.redirect(`/events/${req.params.eventId}`);
// })

// COMMENTS#DESTROY
app.delete('/events/:eventId/comments/:id', (req, res) => {
  models.Comment.destory({ where: { id: req.params.id } }).then(comment => {
    res.redirect(`/events/${req.params.eventId}`);
  });
})

app.listen(3000);


//
// var db = require('./db');
// var Artist = db.Artist;
//
// var allSynced = Promise.all([
//   db.Artist.sync(),
//   db.Album.sync(),
//   db.Song.sync({ force: true })
// ]);
//
// ...
//
// allSynced.then(() => {
//   console.log('db synced');
//   app.listen(3000, () => {
//     console.log('server is running')
//   });
// });

// https://gawdiseattle.gitbooks.io/wdi/content/05-node-express/express-sequelize/02terms.html
