const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')

// template
app.set('view engine', 'ejs')


// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: 'efhzeihzevhzepghvzehca',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(require('./middleware/flash'))


// route
app.get('/', (req, res) => {
  let Message = require('./models/message')
  Message.all(function(messages){
    res.render('pages/index', {messages : messages} )
  })
})

app.get('/message/:id', (req, res) =>{
  let Message = require('./models/message')
  Message.find(req.params.id, (message) => {
    res.render('messages/show', {message: message})
  })
})

app.post('/', (req, res) => {
  if(req.body.message === undefined || req.body.message === ''){
    req.flash('error', "Message vide")
    res.redirect('/')
  } else {
    let Message = require('./models/message')
    Message.create(req.body.message, function(){
      req.flash('success', "Merci!")
      res.redirect('/')
    })
  }
})


app.listen(8080)