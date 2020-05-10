const http = require('http')
const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))




//app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
//morgan.token('body', function (req, res) { return req.body });



let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
    { name: 'Dan Abramov', number: '12-43-234345', id: 3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4}
  ]

let howManyPersons = persons.length

  app.get('/api/persons', (req, res) => {
     
    Person.find({}).then(people => {
      res.json(people.map(person => person.toJSON()))
    })
  })

  
  app.get('/info', (req, res) => {

    const date = new Date()

    Person.countDocuments({}).then(peopleCount => {

      res.send(`<p>Phonebook has info for ${peopleCount} people</p>
               <p>${date}`)
      
    })
    
  })
  

  app.get('/api/persons/:id', (req, res, next) => {

    Person.findById(req.params.id)
        .then(person => {
          if(person) {
            console.log('poistettu')
            res.json(person.toJSON())
          } else {
            res.status(404).end()
          }
        })
        .catch(error => next(error))

  })

  app.put('/api/persons/:id', (req, res, next) => {

    const body = req.body

    console.log(body)

    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
       .then(updatedPerson => {
         console.log(updatedPerson)
         res.json(updatedPerson.toJSON())
       })
       .catch(error => next(error))
  })


  app.delete('/api/persons/:id', (req, res, next) => {

    Person.findByIdAndRemove(req.params.id)
        .then(person => {
          res.status(204).end()
        })
        .catch(error => next(error))
    
  })

  app.post('/api/persons', (req, res, next) => {

    const body = req.body
    
    if(body.name ===undefined) {
      return res.status(400).json({ error: 'name missing'})
    }

    if(body.number === undefined) {

      return res.status(400).json({error: 'number missing'})
    }

    const person = new Person({

      name: body.name,
      number: body.number

    })

    person.save().then(savedPerson => {

      res.json(savedPerson.toJSON())
    }).catch(error => next(error))
    
  })

  const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, req, res, next) => {

    console.error(error.message)

    if(error.name === 'CastError') {
      return res.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError') {
      return res.status(400).json({error: error.message})
    }
    
    next(error)
  }

  app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

