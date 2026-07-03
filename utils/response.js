// ==========================================
// HALO MARKETPLACE
// API Response Helpers
// utils/response.js
// ==========================================

exports.success = (
    res,
    data = {},
    message = "Success",
    status = 200
) => {

    return res.status(status).json({

        success: true,

        message,

        data

    });

};

exports.error = (
    res,
    message = "Something went wrong",
    status = 500
) => {

    return res.status(status).json({

        success: false,

        message

    });

};

exports.created = (
    res,
    data,
    message = "Created Successfully"
) => {

    return res.status(201).json({

        success: true,

        message,

        data

    });

};
