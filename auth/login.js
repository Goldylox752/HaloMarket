<!-- login.html -->

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Halo Marketplace Login</title>

<style>
* {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background: #f5f7fb;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.auth-card {
    width:380px;
    background:white;
    padding:35px;
    border-radius:16px;
    box-shadow:0 10px 30px rgba(0,0,0,.1);
}

h1 {
    text-align:center;
    margin-bottom:10px;
}

p {
    text-align:center;
    color:#666;
}

input {
    width:100%;
    padding:14px;
    margin:10px 0;
    border:1px solid #ddd;
    border-radius:8px;
}

button {
    width:100%;
    padding:14px;
    background:#111827;
    color:white;
    border:none;
    border-radius:8px;
    cursor:pointer;
}

button:hover {
    opacity:.9;
}

.error {
    color:red;
    margin-top:10px;
    text-align:center;
}

.success {
    color:green;
    margin-top:10px;
    text-align:center;
}
</style>

</head>

<body>

<div class="auth-card">

<h1>Halo Marketplace</h1>

<p>Login to your account</p>


<input 
id="email"
type="email"
placeholder="Email address"
/>


<input 
id="password"
type="password"
placeholder="Password"
/>


<button onclick="login()">
Login
</button>


<div id="message"></div>


</div>


<script type="module">

import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";


const supabase = createClient(
    supabaseUrl,
    supabaseKey
);



window.login = async function(){

const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;


const message =
document.getElementById("message");



const {data,error} =
await supabase.auth.signInWithPassword({

email,
password

});


if(error){

message.className="error";
message.innerHTML =
error.message;

return;

}



message.className="success";
message.innerHTML =
"Login successful";


localStorage.setItem(
"halo_user",
JSON.stringify(data.user)
);



setTimeout(()=>{

window.location.href="/dashboard.html";

},1000);


}


</script>


</body>
</html>