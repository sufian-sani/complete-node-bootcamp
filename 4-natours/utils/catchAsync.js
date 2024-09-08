// module.exports = fn => {
//     return (req, res, next) => {
//         fn(req, req, next).catch(next);
//     }
// }

const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;