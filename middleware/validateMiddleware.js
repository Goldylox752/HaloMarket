// ========================================
// Halo Marketplace
// Request Validation Middleware
// middleware/validateMiddleware.js
// ========================================


const validate = (schema) => {


    return async (req, res, next) => {


        try {


            const result =
                schema.safeParse({

                    body:req.body,

                    params:req.params,

                    query:req.query

                });



            if(!result.success){


                return res.status(422).json({

                    success:false,

                    message:"Validation failed.",

                    errors:
                    result.error.errors.map(
                        error => ({

                            field:
                            error.path.join("."),

                            message:
                            error.message

                        })
                    )

                });


            }



            req.validated =
                result.data;


            next();



        } catch(error){


            console.error(
                "Validation Error:",
                error
            );


            return res.status(500).json({

                success:false,

                message:"Validation middleware failed."

            });


        }


    };


};



module.exports = validate;