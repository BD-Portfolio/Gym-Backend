const path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      sets = require('./routes/sets'),
      admin = require('./routes/admin'),
      user = require('./routes/user'),
      notes = require('./routes/notes'),
      programs = require('./routes/programs'),
      exercise = require('./routes/exercise'),
      messages = require('./routes/messages'),
      app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api/admin', admin);
app.use('/api/user', user);
app.use('/api/sets', sets);
app.use('/api/notes', notes);
app.use('/api/programs', programs);
app.use('/api/exercises', exercise);
app.use('/api/messages', messages);
app.use('/api/get/', express.static(path.join(__dirname )));

const port = process.env.PORT || 3000;
app.listen(port , () =>  console.log(`Listening on port ${port}...`) );