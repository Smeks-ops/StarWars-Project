const express = require('express')
const cors = require('cors')
const { json } = require('body-parser');
const axios = require('axios');
const _ = require('underscore');
const swaggerUI = require('swagger-ui-express')
const swaggerJSDOC = require('swagger-jsdoc')

const app = express()


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SWAPI API",
      version: "1.0.0",
      description: "A simple Star Wars API",
      contact: {
        name: 'Osemeke Echenim',
        email: 'echenim.osemeke@gmail.com'
      },
    },
    servers: [
      {
        url: "https://localhost:7000"
      }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJSDOC(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))



app.use(cors())
app.use(json())

const BASE_URL = `https://swapi.dev/api/`



/**
 * @swagger
 * /:
 *   get:
 *     summary: Homepage
 *     responses:
 *       200:
 *         description: try '/movies or /characters route'
 *         
 */
app.get('/', (req, res) => {
  res.status(200).send('uh oh, try /movies or /characters')
})

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Returns the list of movies already sorted by release date, and listing the titles and opening crawls
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: List of movies
 */
app.get('/movies', async (req, res) => {

  try {
    const response = await axios.get(BASE_URL + '/films/');

    const arrays = (response.data.results)
    const resArray = [];
    for (const data of arrays) {
      const datObj = {
        title: data.title,
        opening_crawl: data.opening_crawl
      }
      resArray.push(datObj)
    }
    res.send(resArray);

  } catch (error) {
    res.status(500).send()
  }
})


/**
 * @swagger
 * /characters:
 *   get:
 *     summary: Returns the list of characters sorted by name, gender or height.
 *     tags: [Characters]
 *     responses:
 *       200:
 *         description: Input a 'sort' parameter with a value of 'name', 'gender' or 'height'. You can also sort for gender and height/name at the same time. 
 */
app.get('/characters', async (req, res) => {
  try {
    let { sort, gender } = req.query

    if (sort) {
      sort = sort.toLowerCase();
    }
    let sortedObj;

    const jsonToReturn = [];
    for (var i = 1; i < 6 && jsonToReturn.length < 50; i++) {
      const response = await axios.get(`${BASE_URL}/people?page=${i}`);
      jsonToReturn.push(response.data)
    }

    for (const json of jsonToReturn) {
      if (gender === "male" || gender === "female") {
        sortedObj = json.results.filter(object => object.gender === gender)
        return res.json({ success: true, count: json.results.length, people: sortedObj });
      }
      if (sort === 'name') {
        sortedObj = _.sortBy(json.results, 'name')
        return res.json({ success: true, count: jsonToReturn.length, people: sortedObj });
      }
      else if (sort == "height") {
        sortedObj = _.sortBy(json.results, 'height')
        return res.json({ success: true, count: jsonToReturn.length, people: sortedObj });
      }
      else if (sort == "mass") {
        sortedObj = _.sortBy(json.results, 'mass')
        return res.json({ success: true, count: jsonToReturn.length, people: sortedObj });
      }
      return res.json({ success: true, message: 'Sorting parameter is Invalid or Not Defined, This list is not Sorted.', count: jsonToReturn.length, people: jsonToReturn });
    }
  } catch (error) {
    console.log('rrrrr', error)
    res.status(500).send({
      error: true,
      messsage: "A sort parameter must be passed"
    })
  }
})



module.exports = app