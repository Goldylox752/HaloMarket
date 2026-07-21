import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Chat from "@/components/Chat";
import { getOrCreateConversation } from "@/app/actions/messaging";



export const metadata = {

title:"Messages | Halo Marketplace",

description:
"Chat securely with buyers and sellers on Halo Marketplace."

};




// Get user conversations

async function getConversations(userId){


const supabase = await createClient();


const {
data,
error
}=await supabase

.from("conversations")

.select(`

id,

user1_id,

user2_id,

last_message,

last_message_at,


user1:profiles!conversations_user1_id_fkey(

username,

avatar,

verified

),


user2:profiles!conversations_user2_id_fkey(

username,

avatar,

verified

)

`)

.or(
`user1_id.eq.${userId},user2_id.eq.${userId}`
)

.order(
"last_message_at",
{
ascending:false
}
);



if(error){

console.error(error);

return [];

}



return (data || []).map((conv)=>{


const mine =
conv.user1_id === userId;


const profile =
mine
?
conv.user2
:
conv.user1;



return {

id:conv.id,

otherUserId:
mine
?
conv.user2_id
:
conv.user1_id,


username:
profile?.username || "Halo User",


avatar:
profile?.avatar || "/avatar.png",


verified:
profile?.verified || false,


lastMessage:
conv.last_message || "Start conversation"

};


});


}






// Get messages

async function getMessages(
conversationId
){


if(!conversationId){

return [];

}


const supabase = await createClient();



const {
data,
error
}=await supabase

.from("messages")

.select(`

id,

conversation_id,

message,

sender_id,

receiver_id,

created_at

`)

.eq(
"conversation_id",
conversationId
)

.order(
"created_at",
{
ascending:true
}
);



if(error){

console.error(error);

return [];

}



return data || [];

}







export default async function MessagesPage({
searchParams
}){


const supabase = await createClient();



const {
data:{
user
}
}=await supabase.auth.getUser();



if(!user){

redirect("/login");

}




const params =
await searchParams;



const sellerId =
params?.seller;



const conversations =
await getConversations(
user.id
);



let conversationId=null;

let messages=[];

let sellerProfile=null;






if(sellerId){



const existing =
conversations.find(
(c)=>c.otherUserId === sellerId
);




conversationId =
existing?.id;



if(!conversationId){


conversationId =
await getOrCreateConversation(
sellerId
);


}





messages =
await getMessages(
conversationId
);





const {
data:profile
}=await supabase

.from("profiles")

.select(`

username,

avatar,

verified

`)

.eq(
"id",
sellerId
)

.single();



sellerProfile =
profile || {

username:"Halo User",

avatar:"/avatar.png",

verified:false

};



}





return (

<main className="
min-h-screen
bg-gray-50
p-6
">


<div className="
mx-auto
max-w-7xl
overflow-hidden
rounded-3xl
bg-white
shadow
">


<div className="
flex
h-[80vh]
flex-col
md:flex-row
">



{/* Sidebar */}


<aside className="
w-full
border-r
bg-gray-50
md:w-96
overflow-y-auto
">


<div className="
border-b
p-6
">


<h1 className="
text-2xl
font-black
">

Messages

</h1>


<p className="
text-sm
text-gray-500
">

Buyer & seller chat

</p>


</div>




{

conversations.length === 0 ?


<div className="
p-8
text-center
">


<p className="
text-gray-500
">

No conversations yet

</p>



<Link

href="/browse"

className="
mt-5
block
font-bold
text-indigo-600
"

>

Browse Listings

</Link>


</div>


:

<ul className="divide-y">


{

conversations.map((conv)=>(


<li key={conv.id}>


<Link

href={`/messages?seller=${conv.otherUserId}`}

className={`

block

p-5

hover:bg-gray-100

${sellerId === conv.otherUserId ? 
"bg-indigo-50":""

}

`}

>


<div className="
flex
gap-4
">


<Image

src={conv.avatar}

alt={conv.username}

width={48}

height={48}

className="
rounded-full
"

/>


<div>


<p className="
font-bold
">

{conv.username}

</p>


<p className="
text-sm
text-gray-500
">

{conv.lastMessage}

</p>


</div>


</div>


</Link>


</li>


))


}


</ul>


}



</aside>





{/* Chat */}


<section className="
flex-1
">


{

sellerId ?


<Chat

user={user}

receiverId={sellerId}

conversationId={conversationId}

initialMessages={messages}

/>


:


<div className="
flex
h-full
items-center
justify-center
text-center
">


<div>

<div className="
text-6xl
">

💬

</div>


<h2 className="
mt-5
text-2xl
font-black
">

Select a conversation

</h2>


<p className="
mt-3
text-gray-500
">

Choose a seller to start chatting.

</p>


</div>


</div>


}



</section>




</div>


</div>


</main>

);


}