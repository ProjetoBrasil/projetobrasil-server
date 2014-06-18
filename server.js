var application_root = __dirname,
    express = require("express"),
    path = require("path");

var app = express();

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var politics = require('./lib/politics');

app.get('/v1/politics', politics.findAll);

app.post('/v1/politics', politics.add);

app.get('/v1/politics/:id', politics.findById);

app.put('/v1/politics/:id', politics.update);

app.delete('/v1/politics/:id', politics.delete);

app.get('/v1', function (req, res) {
  res.send('Ecomm API is running');
});

// Launch server

app.listen(4242);