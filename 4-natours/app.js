// const fs = require('fs');
const express = require('express');
const morgan = require('morgan')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRouters');

const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req,res,next)=>{
//     console.log('hello from the middleware')
//     next()
// })

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
})

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
// )

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)
// const tourRouter = express.Router();
// const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.orginalUrl} on thid server!`, 404));
})

app.use(globalErrorHandler)

// tourRouter.route('/').get(getAllTours).post(createTour)
// tourRouter.route('/:id').delete(deleteTour).get(getTour).patch(updateTour)
//
// userRouter.route('/').get(getAllUsers).post(createUser)
// userRouter.route('/:id').delete(deleteUser).get(getUser).patch(updateUser)

module.exports = app;

