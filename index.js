const cool = require('cool-ascii-faces')
const express = require('express')
const bodyParser = require('body-parser')
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
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    try {
      //const client = await pool.connect();
      //const result = await client.query('SELECT * FROM test_table');
      //const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/index', results );
      res.send('pages/index');
      //client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/form', async (req, res) => {
    try {
      const client = await pool.connect();
      const query = await client.query('SELECT color FROM colors WHERE id=0;');
      var db_color = 'red' // Default color = red
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