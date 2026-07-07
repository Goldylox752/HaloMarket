// ========================================
// Halo Marketplace
// server.js
// Production Express Server
// ========================================


require("dotenv").config();


const http = require("http");

const app = require("./app");

const {
    connectDatabase,
    disconnectDatabase
} = require("./config/database");




// ========================================
// CONFIG
// ========================================


const PORT = process.env.PORT || 5000;

const NODE_ENV =
process.env.NODE_ENV || "development";




// ========================================
// SERVER START
// ========================================


async function startServer(){

    try {


        console.log("🔄 Connecting database...");


        await connectDatabase();


        const server =
        http.createServer(app);



        // Server tuning

        server.keepAliveTimeout = 65000;

        server.headersTimeout = 66000;



        server.listen(PORT, ()=>{

            logStartup();

        });



        handleShutdown(server);



    } catch(error){


        console.error(
            "❌ Server startup failed:",
            error.message
        );


        process.exit(1);


    }


}





// ========================================
// STARTUP LOGS
// ========================================


function logStartup(){


console.log(`

========================================

🚀 Halo Marketplace API

========================================

Environment : ${NODE_ENV}

Port        : ${PORT}

Database    : Connected

Status      : ONLINE

========================================

`);

}





// ========================================
// SHUTDOWN HANDLER
// ========================================


function handleShutdown(server){



const shutdown = async(signal)=>{


console.log(
`\n⚠️ ${signal} received`
);



try{


server.close(async()=>{


console.log(
"🛑 HTTP server closed"
);



if(disconnectDatabase){


await disconnectDatabase();


console.log(
"🗄 Database disconnected"
);


}



process.exit(0);



});



}catch(error){


console.error(
"Shutdown error:",
error.message
);


process.exit(1);


}



};





process.on(
"SIGINT",
()=>shutdown("SIGINT")
);



process.on(
"SIGTERM",
()=>shutdown("SIGTERM")
);



}







// ========================================
// GLOBAL ERROR HANDLING
// ========================================


process.on(
"unhandledRejection",
(error)=>{


console.error(
"Unhandled Promise Rejection:",
error
);


process.exit(1);


});





process.on(
"uncaughtException",
(error)=>{


console.error(
"Uncaught Exception:",
error
);


process.exit(1);


});






// ========================================
// BOOT
// ========================================


startServer();