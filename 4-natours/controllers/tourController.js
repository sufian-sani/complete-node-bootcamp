const fs = require("fs");

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
)

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    if(req.params.id*1>tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data:{
            tours
        }
    })
}

exports.getTour= (req, res) => {
    const id = req.params.id*1;
    const tour = tours.find((el) => el.id === id);

    // if(id>tours.length){
    // if(!tour){
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid ID',
    //     })
    // }

    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    })
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours), err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tours: newTour,
                }
            })
        }
    )
}

exports.updateTour = (req, res) => {
    // if(req.params.id*1>tours.length){
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid ID',
    //     })
    // }
    res.status(201).json({
        status: 'success',
        data: '<Update Data Successfully>'
    })
}

exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    })
}