// ========================================
// Halo Marketplace
// Production Express Application
// app.js
// ========================================


require("dotenv").config();


const express = require("express");
const path = require("path");

const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");


// Middleware

const {
    notFound,
    errorHandler

} = require("./middleware/errorMiddleware");



const app = express();



// ========================================
// TRUST PROXY
// ========================================

app.set(
    "trust proxy",
    1
);



// ========================================
// SECURITY HEADERS
// ========================================

app.use(

    helmet({

        crossOriginResourcePolicy:{

            policy:"cross-origin"

        }

    })

);



// ========================================
// CORS
// ========================================


const allowedOrigins = [

    process.env.FRONTEND_URL,

    "http://localhost:3000",

    "http://localhost:5173"

].filter(Boolean);



app.use(

    cors({

        origin:(origin,callback)=>{


            if(!origin){

                return callback(
                    null,
                    true
                );

            }



            if(
                allowedOrigins.includes(origin)
            ){

                return callback(
                    null,
                    true
                );

            }



            callback(
                new Error(
                    "CORS blocked"
                )
            );


        },


        credentials:true,


        methods:[

            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"

        ],


        allowedHeaders:[

            "Content-Type",
            "Authorization"

        ]

    })

);



// ========================================
// PERFORMANCE
// ========================================

app.use(
    compression()
);



// ========================================
// LOGGING
// ========================================

app.use(

    morgan(

        process.env.NODE_ENV === "production"

        ? "combined"

        : "dev"

    )

);



// ========================================
// COOKIES
// ========================================

app.use(
    cookieParser()
);



// ========================================
// STRIPE WEBHOOK
// IMPORTANT:
// Must be BEFORE express.json()
// ========================================


app.use(

    "/api/webhooks/stripe",

    express.raw({

        type:"application/json"

    }),

    require(
        "./routes/webhookRoutes"
    )

);



// ========================================
// REQUEST BODY
// ========================================


app.use(

    express.json({

        limit:"10mb"

    })

);



app.use(

    express.urlencoded({

        extended:true,

        limit:"10mb"

    })

);



// ========================================
// RATE LIMITER
// ========================================


const apiLimiter = rateLimit({

    windowMs:
    15 * 60 * 1000,


    max:

    process.env.NODE_ENV === "production"

    ?250

    :5000,


    standardHeaders:true,


    legacyHeaders:false,


    message:{

        success:false,

        message:
        "Too many requests."

    }

});



app.use(

    "/api",

    apiLimiter

);



// ========================================
// STATIC FILES
// ========================================


app.use(

    "/uploads",

    express.static(

        path.join(
            __dirname,
            "uploads"
        )

    )

);



app.use(

    express.static(

        path.join(
            __dirname,
            "public"
        )

    )

);



// ========================================
// HEALTH CHECK
// ========================================


app.get(

    "/api/health",

    (req,res)=>{


        res.status(200).json({

            success:true,

            application:
            "Halo Marketplace",


            version:
            process.env.npm_package_version
            ||
            "1.0.0",


            environment:
            process.env.NODE_ENV
            ||
            "development",


            database:
            "Supabase PostgreSQL",


            uptime:
            process.uptime(),


            timestamp:
            new Date()

        });


    }

);



// ========================================
// WEBSITE
// ========================================


app.get(

    "/",

    (req,res)=>{


        res.sendFile(

            path.join(

                __dirname,

                "public",

                "index.html"

            )

        );


    }

);



// ========================================
// API ROUTES
// ========================================


const routes = {


    auth:"authRoutes",

    users:"userRoutes",

    vendors:"vendorRoutes",

    products:"productRoutes",

    categories:"categoryRoutes",

    brands:"brandRoutes",

    cart:"cartRoutes",

    checkout:"checkoutRoutes",

    orders:"orderRoutes",

    payments:"paymentRoutes",

    reviews:"reviewRoutes",

    wishlist:"wishlistRoutes",

    search:"searchRoutes",

    notifications:"notificationRoutes",

    admin:"adminRoutes",

    messages:"messageRoutes",

    chat:"chatRoutes",

    analytics:"analyticsRoutes",

    coupons:"couponRoutes"


};



Object.entries(routes)
.forEach(

([route,file])=>{


    app.use(

        `/api/${route}`,

        require(
            `./routes/${file}`
        )

    );


})

);



// ========================================
// ERROR HANDLING
// MUST BE LAST
// ========================================


app.use(
    notFound
);


app.use(
    errorHandler
);



// ========================================
// PROCESS HANDLERS
// ========================================


process.on(

    "unhandledRejection",

    (error)=>{


        console.error(

            "Unhandled Promise Rejection:",

            error

        );


    }

);



process.on(

    "uncaughtException",

    (error)=>{


        console.error(

            "Uncaught Exception:",

            error

        );


        process.exit(1);


    }

);



// ========================================
// EXPORT
// ========================================


module.exports = app;