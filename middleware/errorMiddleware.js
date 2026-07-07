// ========================================
// Halo Marketplace
// Production Error Handler Middleware
// middleware/errorMiddleware.js
// ========================================


// ========================================
// 404 NOT FOUND HANDLER
// ========================================

const notFound = (req, res, next) => {


    const error = new Error(
        `Route not found: ${req.originalUrl}`
    );


    res.status(404);


    next(error);


};



// ========================================
// GLOBAL ERROR HANDLER
// ========================================

const errorHandler = (
    err,
    req,
    res,
    next
) => {


    console.error("");

    console.error("==============================");

    console.error("APPLICATION ERROR");

    console.error("==============================");

    console.error(err.stack || err);

    console.error("==============================");

    console.error("");



    let statusCode =
        res.statusCode === 200
        ? 500
        : res.statusCode;



    let message =
        err.message
        ||
        "Internal Server Error";



    // ====================================
    // Supabase / PostgreSQL Errors
    // ====================================


    if(err.code === "23505"){

        statusCode = 409;

        message =
        "Duplicate record already exists.";

    }



    if(err.code === "23503"){

        statusCode = 400;

        message =
        "Related record does not exist.";

    }



    if(err.code === "22P02"){

        statusCode = 400;

        message =
        "Invalid data format.";

    }



    // ====================================
    // JWT / Auth Errors
    // ====================================


    if(
        err.name === "JsonWebTokenError"
    ){

        statusCode = 401;

        message =
        "Invalid authentication token.";

    }



    if(
        err.name === "TokenExpiredError"
    ){

        statusCode = 401;

        message =
        "Authentication token expired.";

    }



    // ====================================
    // Validation Errors
    // ====================================


    if(err.name === "ValidationError"){

        statusCode = 422;

        message =
        err.message;

    }



    res.status(statusCode)
    .json({

        success:false,

        message,


        ...(process.env.NODE_ENV !== "production" && {

            stack:
            err.stack,

            error:
            err

        })

    });


};



// ========================================
// EXPORT
// ========================================

module.exports = {

    notFound,

    errorHandler

};