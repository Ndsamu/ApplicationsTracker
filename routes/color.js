var express = require('express');
const pool = require('../utilities/connection')
var router = express.Router();

router.get('/color', async (req, res) => {
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
      res.render('pages/color', {color:db_color});
    } catch (err) {
      res.send("Hm. That isn't right. " + err);
    }
});

router.post('/color', async (req, res) => {
    try {
      const color = req.body.color;
      console.log('SQL Query: ' + 'UPDATE colors SET color = \'' + color + '\' WHERE id = 0;');
      const client = await pool.connect()
      client.query('UPDATE colors SET color = \'' + color + '\' WHERE id = 0;');
      client.release();
      res.redirect('/color');
    } catch (err) {
      res.send("Hm. That isn't right. " + err);
    }
});

module.exports = router;