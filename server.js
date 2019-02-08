const cool = require('cool-ascii-faces')
const express = require('express')
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser')
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


const app = express();

// Handles sessions for flash messages
app.use(session({
  secret: 'This is my long string used for sessions in HTTP',
  resave: false,
  saveUninitialized: true
}));

// Initializes flash middleware
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const query = await client.query('SELECT * FROM applications');
      const applications = { 'applications': (query) ? query.rows : null};
      console.log(applications);
      for (application in applications) {
        console.log('Company: ' + application.company);
      }
      console.log(applications);
      res.render('pages/index', applications);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
});

app.post('/index', [
    check('company_field', 'Invalid Company Name.').isLength({ min: 1 }),
    check('position_field', 'Invalid Position Name.').isLength({ min: 1 }),
    check('experience_field', 'Invalid Experience Level.').isLength({ min: 1 }),
    check('source_field', 'Invalid Source.').isLength({ min: 1 }),
    sanitizeBody('company_field').trim().escape(),
    sanitizeBody('position_field').trim().escape(),
    sanitizeBody('experience_field').trim().escape(),
    sanitizeBody('source_field').trim().escape()
  ], async (req, res) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        res.send('Invalid input. Temporary placeholder before better means of handling circumstances.')
        }
      else {
        // Data from form is valid.
        const company = req.body.company_field;
        const position = req.body.position_field;
        const experience = req.body.experience_field;
        const source = req.body.source_field;
        const client = await pool.connect();
        const query = 'INSERT INTO applications VALUES (\''+company+'\', \''+position+'\', \''+experience+'\', \''+source+'\')';
        console.log(query);
        client.query(query);
        client.release();
        res.redirect('/');
      }
    } catch (err) {
      res.send("Hm. That isn't right. " + err);
    }
});

app.post('/delete', async (req, res) => {
    try {
      const company = req.body.company;
      const query = 'DELETE FROM applications WHERE company = \''+company+'\'';
      const client = await pool.connect();
      console.log(query);
      client.query(query);
      client.release();
      res.redirect('/');
    } catch {
      res.send("Hm. That isn't right. " + err);
    }
});

app.get('/form', async (req, res) => {
    try {
      const client = await pool.connect();
      const query = await client.query('SELECT color FROM colors WHERE id=0;');
      var db_color = ''
      // Access the query from the database
      query.rows.forEach(row=>{
        db_color = row.color;
      });
      console.log('Color (from database): ' + db_color);
      await client.release();
      res.render('pages/form', {color:db_color});
    } catch (err) {
      res.send("Hm. That isn't right. " + err);
    }
});

app.post('/form', async (req, res) => {
    try {
      const color = req.body.color;
      console.log('SQL Query: ' + 'UPDATE colors SET color = \'' + color + '\' WHERE id = 0;');
      const client = await pool.connect()
      client.query('UPDATE colors SET color = \'' + color + '\' WHERE id = 0;');
      client.release();
      res.redirect('/form');
    } catch (err) {
      res.send("Hm. That isn't right. " + err);
    }
});

app.get('/cool', (req, res) => res.send(cool()));
app.get('/times', (req, res) => res.send(showTimes()));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}