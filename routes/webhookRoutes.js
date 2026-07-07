// ========================================
// Halo Marketplace
// routes/webhookRoutes.js
// Stripe Webhooks
// ========================================


const router = require("express").Router();


const stripe = require("../config/stripe");


const prisma = require("../config/prisma");





// ========================================
// STRIPE WEBHOOK
// POST /api/webhooks/stripe
// ========================================


router.post(

"/",

async(req,res)=>{


const signature =

req.headers["stripe-signature"];



let event;



try{


event = stripe.webhooks.constructEvent(

req.body,

signature,

process.env.STRIPE_WEBHOOK_SECRET

);



}

catch(error){


console.error(

"Stripe webhook error:",

error.message

);



return res.status(400).send(

`Webhook Error: ${error.message}`

);


}





// ========================================
// PAYMENT SUCCESS
// ========================================


if(

event.type ===

"checkout.session.completed"

){



const session =

event.data.object;



const orderId =

session.metadata.orderId;





try{


await prisma.order.update({

where:{

id:orderId

},


data:{


paymentStatus:"paid",


orderStatus:"processing"


}


});



console.log(

`✅ Order ${orderId} paid`

);



}

catch(error){


console.error(

"Order update failed:",

error.message

);


}



}






// ========================================
// PAYMENT FAILED
// ========================================


if(

event.type ===

"checkout.session.async_payment_failed"

){


const session =

event.data.object;



await prisma.order.update({

where:{

id:session.metadata.orderId

},


data:{


paymentStatus:"failed"


}


});


}





res.json({

received:true

});


}

);



module.exports = router;