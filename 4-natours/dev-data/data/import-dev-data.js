const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
// const app = require('./app')

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful!'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,"utf-8"))

const importData = async () => {
    try{
        await Tour.create(tours)
        console.log('Data Successfully loaded!')
        process.exit();
    } catch (err){
        console.log(err)
    }
    process.exit();
}

const deleteData = async () => {
    try{
        await Tour.deleteMany()
        console.log('Data Successfully deleted!')
        process.exit();
    } catch (err) {
        console.log(err)
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
