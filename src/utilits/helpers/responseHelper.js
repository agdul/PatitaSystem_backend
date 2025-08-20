


const responseHelper = {
    success: (res, message = 'Todo ok!', data = null, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    },
    error: (res, message = 'Error interno.', data = null, statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message: message,
            data: data
        })
    }
};

module.exports = responseHelper;