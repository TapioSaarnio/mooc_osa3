const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });



let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
    { name: 'Dan Abramov', number: '12-43-234345', id: 3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4}
  ]

let howManyPersons = persons.length

  app.get('/api/persons', (req, res) => {

    res.send(persons)
  })

  app.get('/info', (req, res) => {

    const date = new Date()

    res.send(`<p>Phonebook has info for ${howManyPersons} people</p>
               <p>${date}`)
  })

  app.get('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){

        res.json(person)
    } else {

        res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
     console.log('joo')
      persons.splice(persons.indexOf(person), 1)
      res.status(202).end()
    } else {
      console.log('ei')
      res.status(404).end()
    }

  })

  app.post('/api/persons', (req, res) => {

    const body = req.body

    const person =  {

      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER))

    }

    let i

    for (i = 0; i < persons.length; i++){
      
      if(persons[i].name === person.name){
        
         res.status(400).send({ error: "name must be unique"})

      }
    }

    if(person.number===""){

      res.status(400).send({ error: "number cannot be empty"})

    }

    persons = persons.concat(person)

    res.json(person)
    
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

