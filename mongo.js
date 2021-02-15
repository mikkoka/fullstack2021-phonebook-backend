const mongoose = require ('mongoose')

if (process.argv.length<3) {
  console.log('give password as first argument')
  process.exit(1)
}

const passwd = process.argv[2]//'fH8dLUNK7kwWp69'
const url = 
  `mongodb+srv://fullstack2021:${passwd}@cluster0.q7sqj.mongodb.net/fs2021phonebook?retryWrites=true&w=majority`

mongoose
  .connect(url, 
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useFindAndModify: false, 
      useCreateIndex: true 
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})  

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
      result.forEach(p => {
        console.log(`${p.name} ${p.number}`)
      })
      mongoose.connection.close()
    })
}
else {
  const name = process.argv[3]
  const number = process.argv[4]

  const p = new Person({
    name: name,
    number: number
  })
  p.save().then(resp => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})}
