import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";



const stripe = new Stripe(

process.env.STRIPE_SECRET_KEY

);



export async function POST(request){



const body = await request.text();


const signature = request.headers.get(

"stripe-signature"

);




let event;




try{


event = stripe.webhooks.constructEvent(

body,

signature,

process.env.STRIPE_WEBHOOK_SECRET

);



}

catch(error){



console.log(

"Stripe webhook error:",

error.message

);



return new NextResponse(

"Webhook Error",

{

status:400

}

);



}







if(event.type === "checkout.session.completed"){



const session = event.data.object;




const productId = session.metadata.product_id;

const buyerId = session.metadata.buyer_id;

const sellerId = session.metadata.seller_id;





const supabase = await createClient();






// Get product details


const {

data:product

}=await supabase

.from("products")

.select("*")

.eq("id",productId)

.single();







if(product){





// Create order


await supabase

.from("orders")

.insert({

buyer_id:buyerId,

seller_id:sellerId,

product_id:productId,

amount:product.price,

status:"paid"

});








// Mark product sold


await supabase

.from("products")

.update({

status:"sold"

})

.eq(

"id",

productId

);





}






}





return NextResponse.json({

received:true

});


}
