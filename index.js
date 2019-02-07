const cool = require('cool-ascii-faces')
const express = require('express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(expressValidator())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const query = await client.query('SELECT * FROM applications');
      const applications = { 'applications': (query) ? query.rows : null};
      res.render('pages/index', applications);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/index', async (req, res) => {
    try {
      // Checking that all fields have at least one character
      body('company_field', 'Empty Company Name.').exists();
      body('position_field', 'Empty Position Name.').exists();
      body('experience_field', 'Empty Experience Level.').exists();
      body('source_field', 'Empty Source.').exists();

      // Sanitizing input for security risks such as CSRF
      sanitizeBody('company_field').trim().escape();
      sanitizeBody('position_field').trim().escape();
      sanitizeBody('experience_field').trim().escape();
      sanitizeBody('source_field').trim().escape();

      const company = req.body.company_field;
      const position = req.body.position_field;
      const experience = req.body.experience_field;
      const source = req.body.source_field;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        res.send('Invalid input. Temporary placeholder before better means of handling circumstances.')
        }
      else {
        // Data from form is valid.
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
  })
  .post('/delete', async (req, res) => {
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
  })
  .get('/form', async (req, res) => {
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
  })
  .post('/form', async (req, res) => {
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
  })
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}