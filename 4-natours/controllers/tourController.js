const Tour = require("../models/tourModel");
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data:{
            tours
        }
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if(!tour) {
        return next(new AppError('No tours found by ID',404));
    }
    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})

// exports.createTour = async (req, res) => {
//     try{
//         const newTour = await Tour.create(req.body)
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         })
//     } catch (err){
//         res.status(400).json({
//             status: 'fail',
//             message: 'Invalid data send!'
//         })
//     }
// }

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })

    if(!tour) {
        return next(new AppError('No tours found by ID',404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            tour
        }
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if (!tour) {
        return next(new AppError('No tours found by ID', 404));
    }

    res.status(201).json({
        status: 'success',
        data: null
    })
})

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingQuantity' },
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            {
              $match: { _id: { $ne: 'EASY' } }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};