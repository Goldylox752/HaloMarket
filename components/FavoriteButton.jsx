"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function FavoriteButton({ productId }) {


const [saved,setSaved] = useState(false);

const [loading,setLoading] = useState(false);



async function toggleFavorite(){


setLoading(true);


const supabase = createClient();



const {
data:{
user
}

} = await supabase.auth.getUser();



if(!user){

alert("Please login to save favourites.");

setLoading(false);

return;

}





if(saved){


await supabase

.from("favorites")

.delete()

.eq("user_id", user.id)

.eq("product_id", productId);



setSaved(false);



}else{


await supabase

.from("favorites")

.insert({

user_id:user.id,

product_id:productId

});



setSaved(true);


}



setLoading(false);


}





return (

<button

onClick={toggleFavorite}

disabled={loading}

className="w-full rounded-xl border py-4 font-bold transition hover:bg-gray-100"

>


{saved ? "❤️ Saved" : "🤍 Add to Favourites"}


</button>


);


}