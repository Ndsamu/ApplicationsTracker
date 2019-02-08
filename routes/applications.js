var express = require('express');
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const pool = require('../utilities/connection')

var router = express.Router();

router.post('/create', [
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

router.post('/delete', async (req, res) => {
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

module.exports = router;