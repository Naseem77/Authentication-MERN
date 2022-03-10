const express = require("express");
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routesUrlSignUp = require('./routes/routeSignUp')
const routesUrlSignIn = require('./routes/routeSignIn')
const cors = require('cors');


dotenv.config()
mongoose.connect(process.env.DB, () => console.log("Database connected"))


app.use(express.json())
app.use(cors())
app.use('/app/routeSignUp',routesUrlSignUp);
app.use('/app/routeSignIn',routesUrlSignIn);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`))