import { stripe } from "@/lib/stripe";


export async function POST(request){

const {
product
}= await request.json();



const session =
await stripe.checkout.sessions.create({

payment_method_types:[
"card"
],


line_items:[

{

price_data:{

currency:"cad",

product_data:{
name:product.title
},

unit_amount:
product.price * 100

},

quantity:1

}

],


mode:"payment",


success_url:
`${process.env.NEXT_PUBLIC_URL}/success`,


cancel_url:
`${process.env.NEXT_PUBLIC_URL}/cancel`

});



return Response.json({

url:session.url

});


}
