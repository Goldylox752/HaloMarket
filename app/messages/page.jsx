import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";



async function getMessages(receiverId){


const supabase = await createClient();



const {
data:{
user
}

}= await supabase.auth.getUser();





if(!user){

redirect("/login");

}






let messages = [];





if(receiverId){



const {
data,
error

}= await supabase

.from("messages")

.select(`
id,
message,
sender_id,
receiver_id,
created_at
`)

.or(
`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`
)

.order(
"created_at",
{
ascending:true
}
);





if(error){

console.log(
"Message error:",
error
);

}



messages = data || [];



}







return {

user,

messages

};


}







export const metadata = {

title:"Messages | Halo Marketplace",

description:
"Chat with buyers and sellers."

};







export default async function MessagesPage({
searchParams
}){



const sellerId = searchParams?.seller || "";




const {

user,

messages

}= await getMessages(sellerId);






return (

<main className="
min-h-screen
bg-gray-50
px-6
py-16
">



<div className="
mx-auto
max-w-5xl
">



<div className="
rounded-3xl
bg-white
p-10
shadow
">





<h1 className="
text-4xl
font-black
">

💬 Messages

</h1>




<p className="
mt-3
text-gray-600
">

Chat with Halo Marketplace users.

</p>







{
sellerId ? (


<Chat

user={user}

receiverId={sellerId}

initialMessages={messages}

/>


):(



<div className="
mt-10
rounded-2xl
bg-gray-100
p-10
text-center
">


<h2 className="
text-2xl
font-bold
">

Select a conversation

</h2>



<p className="
mt-3
text-gray-500
">

Open a product and message the seller.

</p>



</div>



)

}





</div>


</div>


</main>

);

}