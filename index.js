const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postData', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/api/persons', (req, resp) => {
  Person
    .find({})
    .then(result => resp.json(result))
})

app.get('/info', (req, resp) => {
  Person.countDocuments({}, (err, result) => {
    resp
      .send(`<p>Phonebook has info for ${result} people</p> ${new Date()}`)
  })

})

const personErrorHandler = (err, req, resp, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return resp.status(400).json({ error: 'malformatted id' })
  }
}

app.get('/api/persons/:id', (req, resp, next) => {
  Person
  .findById(req.params.id)
  .then(p => {
    if (p)
      resp.json(p)
    else
      resp.status(404).json({error : 'not found'})
  })
    .catch(err => next(err))
})

app.use(personErrorHandler)

const deleteErrorHandler = (err, req, resp, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return resp.status(400).json({ error: 'malformatted id' })
  }
}
app.delete('/api/persons/:id', (req, resp) => {

  Person
    .findByIdAndRemove(req.params.id)
    .then(result => 
      {if (result) 
        resp.status(204).end()
      else 
        resp.status(404).end()})
        .catch(err => next(err))
})

app.use(deleteErrorHandler)

app.put('/api/persons/:id', (req, resp) => {
  Person
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updated => resp.json(updated)) 


})

const postErrorHandler = (err, req, resp, next) => {
  console.error(err.message)
    return resp
      .status(400)
      .json(err.message)
}

app.post('/api/persons', (req, resp, next) => {

  if (!req.body.name || !req.body.number) {
    return resp
      .status(400)
      .json({'error': 'name or number not defined'})
  }

  const newPerson = new Person(req.body)
  newPerson
    .save()
    .then(result => {
      persons = persons.concat(result)
      resp.json(result)
    })
    .catch(err => next(err))

})

app.use(postErrorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`);
