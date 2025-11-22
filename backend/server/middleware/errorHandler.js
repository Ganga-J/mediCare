// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log full error stack for debugging
    console.error('🔥 Error Stack:', err.stack);

    // Default status code and message
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle duplicate key errors (MongoDB)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for field "${field}": ${err.keyValue[field]}`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token, authorization denied';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired, please login again';
    }

    // Response object
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    };

    res.status(statusCode).json(response);
};

module.exports = errorHandler;