const express = require('express')
const cors = require('cors')
const { json } = require('body-parser');
const axios = require('axios');


const app = express()

app.use(cors())
app.use(json())

const BASE_URL = `https://swapi.dev/api/`

app.get('/', (req, res) => {
  res.status(200).send('suck it!!!')
})

app.get('/movies', async (req, res) => {
  // const sort = {}

  // if (req.query.sortBy && req.query.OrderBy) {
  //   sort[req.query.sortBy] = req.query.OrderBy === 'desc' ? -1 : 1
  // }
  // try {
  //   await req.user.populate({
  //     path: 'movies',
  //     options: { sort }
  //   })
  //   res.send(req.user.movies)
  // } catch (error) {
  //   res.status(500).send()
  // }

  try {
    const response = await axios.get(BASE_URL + '/films/')

    const arrays = (response.data.results)
    for (let result in arrays) {
      res.send(`${arrays[result].title}, ${arrays[result].opening_crawl}`)
    }
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = app