const express = require('express')
const bodyParser = require('body-parser')
const { check,validationResult } = require('express-validator/check')
//const { sanitizeBody } = require('express-validator/filter')
const router = express.Router()
const pool = require('./utilities/connection')

router.use(bodyParser.json())

router.get('/', async (req, res) => {
    try {
      const client = await pool.connect()
      const query = await client.query('SELECT * FROM applications')
      const data = { 'applications': (query) ? query.rows : null}
      data.applications.reverse()
      res.render('pages/applications', data)
      client.release()
    } catch (err) {
      console.error(err)
      res.send("Error " + err)
    }
})

router.post('/applications/create', [
    check('company', 'Invalid Company Name.').isLength({ min: 1 }),
    check('position', 'Invalid Position Name.').isLength({ min: 1 }),
    check('experience', 'Invalid Experience Level.').isLength({ min: 1 }),
    check('source', 'Invalid Source.').isLength({ min: 1 })
  ], async (req, res) => {
    try {
      const errors = validationResult(req)
      
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        console.log('Failed to post applicaiton:\n ' + errors)
        res.send(JSON.stringify({response: 'failure'}))
      } else {
        // Data from form is valid.
        const company = req.body.company
        const position = req.body.position
        const experience = req.body.experience
        const source = req.body.source
        // Creation of object to be sent back to client side
        const application = {
            company: company,
            position: position,
            experience: experience,
            source: source
        }
        const query = 'INSERT INTO applications VALUES (\''+company+'\', \''+position+'\', \''+experience+'\', \''+source+'\')'
        console.log(query)
        const client = await pool.connect()
        client.query(query)
        client.release()
        res.send(JSON.stringify({application: application}))
      }
    } catch (err) {
      res.send("Hm. That isn't right. " + err)
    }
})

router.post('/applications/delete', async (req, res) => {
    try {
        var query = ''
        const client = await pool.connect()
        for (i in req.body.names) {
            query = 'DELETE FROM applications WHERE company = \''+req.body.names[i]+'\''
            console.log(query)
            client.query(query)
        }
        client.release()
        res.send(JSON.stringify({response: 'success'}))
    } catch {
        res.send("Hm. That isn't right. " + err)
    }
})

router.get('/color', async (req, res) => {
    try {
      const client = await pool.connect()
      const query = await client.query('SELECT color FROM colors WHERE id=0')
      var db_color = ''
      // Access the query from the database
      query.rows.forEach(row=>{
        db_color = row.color
      })
      console.log('Color (from database): ' + db_color)
      await client.release()
      res.render('pages/color', {color:db_color})
    } catch (err) {
      res.send("Hm. That isn't right. " + err)
    }
})

router.post('/color/update', async (req, res) => {
    try {
      const color = req.body.color
      console.log('SQL Query: ' + 'UPDATE colors SET color = \'' + color + '\' WHERE id = 0')
      const client = await pool.connect()
      client.query('UPDATE colors SET color = \'' + color + '\' WHERE id = 0')
      client.release()
      res.redirect('/color')
    } catch (err) {
      res.send("Hm. That isn't right. " + err)
    }
})

module.exports = router