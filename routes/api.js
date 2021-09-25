const express = require('express')
const cors = require('cors')
const { json } = require('body-parser');
const axios = require('axios');
const _ = require('underscore');



const app = express()

app.use(cors())
app.use(json())

const BASE_URL = `https://swapi.dev/api/`

app.get('/', (req, res) => {
  res.status(200).send('uh oh, try /movies or /characters')
})

app.get('/movies', async (req, res) => {

  try {
    const response = await axios.get(BASE_URL + '/films/');
    console.log('response', response)

    const arrays = (response.data.results)
    const resArray = [];
    for (const data of arrays) {
      const datObj = {
        title: data.title,
        opening_crawl: data.opening_crawl
      }
      resArray.push(datObj)
    }
    console.log('resArray', resArray)
    res.send(resArray);

  } catch (error) {
    res.status(500).send()
  }
})

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