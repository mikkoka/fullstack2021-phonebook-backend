const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('postData', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/api/persons', (req, resp) => {
  resp.json(persons)

})

app.get('/info', (req, resp) => {
  resp.send(`<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`)

})

app.get('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  const reqPerson = persons.find(p => p.id === id)

  if (reqPerson) 
    return resp.json(reqPerson)

  resp.status(400).json({error : 'not found'})

})

app.delete('/api/persons/:id', (req, resp) => {

  const id = Number(req.params.id)
  const personToDelete = 
    persons.find(p => p.id === id)

  if (personToDelete) {
    persons = persons.filter(p => p.id !== id)
    resp.status(200).end()
  } 
  else {
    resp.status(400).json({error : 'not found'})
  }
})

app.post('/api/persons', (req, resp) => {
  const newPerson = req.body

  if (!newPerson.name || !newPerson.number) {
    return resp
      .status(400)
      .json({'error': 'name or number not defined'})
  }

  if (persons.find(p => p.name === newPerson.name)) {
    return resp
      .status(400)
      .json({'error': `entry for ${newPerson.name} already exists`})
  }

  newPerson.id= Math.floor(Math.random() * 1000000)
  persons = persons.concat(newPerson)
  resp.json(newPerson)


})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);
