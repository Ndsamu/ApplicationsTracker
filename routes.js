const express = require('express')
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const router = express.Router()
const pool = require('./utilities/connection')

router.get('/', async (req, res) => {
    try {
      const client = await pool.connect()
      const query = await client.query('SELECT * FROM applications')
      /*query.rows.forEach(row=>{
        console.log('Company: ' + row.company)
      })*/
      const applications = { 'applications': (query) ? query.rows : null}
      res.render('pages/applications', applications)
      client.release()
    } catch (err) {
      console.error(err)
      res.send("Error " + err)
    }
})

router.post('/applications/create', [
    // NOTE: DATA SHOULD NOT BE STORED AS ESCAPED. IT SHOULD BE UNESCAPED BEFORE STORAGE!
    check('company_field', 'Invalid Company Name.').isLength({ min: 1 }),
    check('position_field', 'Invalid Position Name.').isLength({ min: 1 }),
    check('experience_field', 'Invalid Experience Level.').isLength({ min: 1 }),
    check('source_field', 'Invalid Source.').isLength({ min: 1 })
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        res.redirect('/')
        }
      else {
        // Data from form is valid.
        const company = req.body.company_field;
        const position = req.body.position_field;
        const experience = req.body.experience_field;
        const source = req.body.source_field;
        const query = 'INSERT INTO applications VALUES (\''+company+'\', \''+position+'\', \''+experience+'\', \''+source+'\')';
        console.log(query);
        const client = await pool.connect();
        client.query(query);
        client.release();
        /*query.rows.forEach(row=>{
            console.log('Company: ' + row.company)
        })*/
        res.redirect('/')
      }
    } catch (err) {
      res.send("Hm. That isn't right. " + err);
    }
});

router.post('/applications/delete', async (req, res) => {
    try {
      const company = req.body.company;
      const query = 'DELETE FROM applications WHERE company = \''+company+'\'';
      console.log(query);
      const client = await pool.connect();
      client.query(query);
      client.release();
      res.redirect('/')
    } catch {
      res.send("Hm. That isn't right. " + err);
    }
});

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

router.post('/color/update', async (req, res) => {
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

module.exports = router