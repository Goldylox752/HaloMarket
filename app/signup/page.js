import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";



export default function SignupPage(){



async function signup(formData){

"use server";



const username = formData.get("username");

const email = formData.get("email");

const password = formData.get("password");

const location = formData.get("location");



const supabase = await createClient();





const {

data,

error

}=await supabase.auth.signUp({

email,

password,

options:{

data:{

username

}

}

});






if(error){

redirect(
"/signup?error=Could not create account"
);

}





if(data.user){



await supabase

.from("profiles")

.insert({

id:data.user.id,

username,

location,

avatar:null,

rating:5

});



}





redirect("/dashboard");


}







return (

<main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">



<div className="w-full max-w-md">



<div className="bg-white rounded-3xl shadow p-10">





<h1 className="text-4xl font-bold text-center">

Join Halo

</h1>



<p className="text-gray-500 text-center mt-3">

Create your marketplace account

</p>







<form

action={signup}

className="mt-8 space-y-5"

>





<input

name="username"

required

placeholder="Username / Store Name"

className="w-full border rounded-xl p-4"

/>






<input

name="email"

type="email"

required

placeholder="Email address"

className="w-full border rounded-xl p-4"

/>






<input

name="password"

type="password"

required

placeholder="Password"

className="w-full border rounded-xl p-4"

/>






<input

name="location"

placeholder="City / Province"

className="w-full border rounded-xl p-4"

/>







<button

className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg"

>

Create Account

</button>





</form>








<div className="text-center mt-6">


<p className="text-gray-500">

Already have an account?

</p>




<Link

href="/login"

className="text-indigo-600 font-bold"

>

Login

</Link>



</div>





</div>


</div>


</main>

)

}
