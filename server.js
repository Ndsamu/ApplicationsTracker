// NPM Packages
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Networking
const PORT = process.env.PORT || 5000
const pool = require('./utilities/connection');

// Local files
const applications = require('./routes/applications');
const color = require('./routes/color')


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/applications', applications);
app.use('/color', color);

app.get('/color', color);
app.post('/color', color);

app.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const query = await client.query('SELECT * FROM applications');
      query.rows.forEach(row=>{
        console.log('Company: ' + row.company);
      });
      const applications = { 'applications': (query) ? query.rows : null};
      console.log(JSON.stringify(applications));
      res.render('pages/index', applications);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));