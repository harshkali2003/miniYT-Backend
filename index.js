require('./Database/database')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: ['https://miniytvideo.netlify.app' , 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

const user = require('./Routes/usersAPI')
const videos = require('./Routes/videoAPI')
const admin = require('./Admin/adminAPI')
const subscribers = require('./Routes/subscribeApi')
const contact = require('./Routes/contactAPI')

app.use('/user' , user)
app.use('/video' , videos)
app.use('/admin' , admin)
app.use('/subscribe' , subscribers)
app.use('/contact' , contact)


app.listen(process.env.PORT , ()=>{
    console.log("Server is running on " + process.env.PORT);
})