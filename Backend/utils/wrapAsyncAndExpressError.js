class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

/*wrapAsync is a function taking asyncronous function as input and then return bhi function kar raha hai by executing the
callback function as input if error catch and call the next error handing middleware jo ki admin.js mai hai*/
const wrapAsync = (fnx) => {
    return (req,res,next) =>{
        fnx(req,res,next).catch((err) => next(err));
    }
}


module.exports = {ExpressError,wrapAsync};