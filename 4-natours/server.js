const mongoose = require('mongoose');
const dotenv = require("dotenv");
const app = require('./app')

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful!'))

// mongoose.connect()

// console.log(app.get('env'))

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port: ${port}...`);
})