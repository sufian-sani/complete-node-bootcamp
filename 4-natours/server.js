const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const app = require('./app')

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful!'))

// mongoose.connect()

// console.log(app.get('env'))


// const tastTour = new Tour({
//     name: 'The Forest Camper',
//     price: 997
// })
//
// tastTour.save().then(doc => {
//     console.log(doc)
// }).catch(err => {
//     console.log('ERROR :', err)
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port: ${port}...`);
})