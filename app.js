// ========================================
// Halo Marketplace
// Production Express Application
// app.js
// ========================================


require("dotenv").config();


const express = require("express");
const path = require("path");
const crypto = require("crypto");


const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");



const {
    notFound,
    errorHandler

} = require("./middleware/errorMiddleware");



const app = express();




// ========================================
// CONFIG
// ========================================


const API_VERSION =
process.env.API_VERSION || "v1";





// ========================================
// TRUST PROXY
// ========================================


app.set(
    "trust proxy",
    1
);






// ========================================
// REQUEST ID
// ========================================


app.use((req,res,next)=>{


req.id =
crypto.randomUUID();


res.setHeader(
"X-Request-ID",
req.id
);


next();


});







// ========================================
// SECURITY
// ========================================


app.use(

helmet({

crossOriginResourcePolicy:{
policy:"cross-origin"
},


contentSecurityPolicy:false


})

);







// ========================================
// CORS
// ========================================


const origins = [

process.env.FRONTEND_URL,

"http://localhost:3000",

"http://localhost:5173"

].filter(Boolean);




app.use(

cors({

origin:(origin,callback)=>{


if(!origin)
return callback(null,true);



if(origins.includes(origin))
return callback(null,true);



return callback(
new Error("CORS blocked")
);


},


credentials:true


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
// STRIPE WEBHOOK
// MUST BE BEFORE JSON
// ========================================


app.use(

"/api/webhooks/stripe",

express.raw({

type:"application/json"

}),

require("./routes/webhookRoutes")

);






// ========================================
// BODY PARSER
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
// COOKIES
// ========================================


app.use(
cookieParser()
);







// ========================================
// RATE LIMIT
// ========================================


const limiter = rateLimit({

windowMs:
15 * 60 * 1000,


max:

process.env.NODE_ENV === "production"

?250

:5000,


standardHeaders:true,


legacyHeaders:false


});



app.use(

"/api",

limiter

);







// ========================================
// STATIC
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


res.json({

success:true,

service:
"Halo Marketplace API",

status:
"online",

version:
API_VERSION,


environment:
process.env.NODE_ENV,


uptime:
process.uptime(),


requestId:
req.id,


timestamp:
new Date()

});


}

);






app.get(

"/api/ready",

(req,res)=>{


res.json({

ready:true,

database:
"Supabase"

});


}

);







// ========================================
// FRONTEND
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
// ROUTES
// ========================================


const routes = {


auth:"authRoutes",

users:"userRoutes",

vendors:"vendorRoutes",

products:"productRoutes",

categories:"categoryRoutes",

cart:"cartRoutes",

checkout:"checkoutRoutes",

orders:"orderRoutes",

payments:"paymentRoutes",

reviews:"reviewRoutes",

wishlist:"wishlistRoutes",

search:"searchRoutes",

messages:"messageRoutes",

admin:"adminRoutes"


};





Object.entries(routes)

.forEach(([route,file])=>{


try{


app.use(

`/api/${API_VERSION}/${route}`,

require(
`./routes/${file}`
)

);



}

catch(error){


console.warn(

`⚠️ Route skipped: ${file}`,

error.message

);


}



});







// ========================================
// ERROR HANDLING
// ========================================


app.use(
notFound
);



app.use(
errorHandler
);







module.exports = app;