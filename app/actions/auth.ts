"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export async function createSellerAccount(formData: FormData){

const fullName =
formData.get("fullName")?.toString() || "";

const email =
formData.get("email")?.toString() || "";

const password =
formData.get("password")?.toString() || "";

const storeName =
formData.get("storeName")?.toString() || "";


const supabase = await createClient();


const {
data,
error
}=await supabase.auth.signUp({

email,

password,

options:{
data:{
fullName,
storeName,
role:"seller"
}
}

});


if(error){

redirect(
"/sell/register?error="+error.message
);

}



if(data.user){


await supabase
.from("profiles")
.insert({

id:data.user.id,

username:fullName,

role:"seller",

store_name:storeName

});


}



redirect("/dashboard");


}