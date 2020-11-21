import Express from 'express'
import SocketIO from 'socket.io';
import http from 'http';
import MemDB from './lib/memDB';

// Setup express app
const app = Express()
app.use(Express.json())

// Setup socket.io
const server = http.Server(app)
const io = new SocketIO(server)

// Globals
// TODO: replace with proper DB when data handling exceeds memory capacity
const bobaDB = new MemDB()

app.get('/', (req, res) => {
  res.send("no boba no life")
})
app.use('/', Express.static('public'))

// When client get user owe info
app.get('/api/get', function (req, res) {
  const {me, other} = req.body
  console.log('getting info of ' + me + ' and ' + other)
  res.json(bobaDB.get({me, other}))
})

// When client owes someone
app.post('/api/owe', function (req, res) {
  const {ower, owee} = req.body
  console.log(ower + ' owes ' + owee)
  bobaDB.updateOwes({ower, owee})
  res.json({requestBody: req.body})
})

// When client owed from someone
app.post('/api/pay', function (req, res) {
  const {ower, owee} = req.body
  console.log(ower + ' pays ' + owee)
  bobaDB.updateOwed({ower,owee})
  res.json({requestBody: req.body})
})

server.listen(8000, () => {
  console.log('listening on port 8000!')
})

