"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function FavoriteButton({
  productId
}){


const [saved,setSaved] = useState(false);

const [loading,setLoading] = useState(false);

const router = useRouter();




async function toggleFavorite(){


setLoading(true);



const supabase = createClient();



const {
data:{
user
}
} = await supabase.auth.getUser();



if(!user){

router.push("/login");

return;

}





const {
data:existing
} = await supabase

.from("favorites")

.select("id")

.eq("user_id",user.id)

.eq("product_id",productId)

.single();





if(existing){


await supabase

.from("favorites")

.delete()

.eq("id",existing.id);



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

router.refresh();


}





return (

<button

onClick={toggleFavorite}

disabled={loading}

className="
w-full
rounded-xl
border
py-4
font-bold
transition
hover:bg-gray-100
"

>

{

loading

? "Saving..."

: saved

? "❤️ Saved"

: "🤍 Add to Favorites"

}


</button>

);


}