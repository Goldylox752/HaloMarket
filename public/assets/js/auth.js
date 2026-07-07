// ========================================
// Halo Marketplace
// assets/js/auth.js
// Authentication Helper
// ========================================



function getToken(){

return localStorage.getItem(
"halo_token"
);

}




function getCurrentUser(){

return JSON.parse(

localStorage.getItem(
"halo_user"

)

) || null;

}





// ========================================
// PROTECT PAGES
// ========================================


function requireAuth(){


const token =
getToken();



if(!token){


window.location.href =
"login.html";


return false;


}



return true;


}







// ========================================
// SELLER ACCESS
// ========================================


function requireSeller(){


const user =
getCurrentUser();



if(!user){


window.location.href =
"login.html";


return false;


}



if(

user.role !== "SELLER" &&

user.role !== "ADMIN"

){


alert(
"Seller account required"
);



window.location.href =
"index.html";


return false;


}



return true;


}







// ========================================
// LOGOUT
// ========================================


function logout(){


localStorage.removeItem(
"halo_token"
);


localStorage.removeItem(
"halo_user"
);



window.location.href =
"login.html";


}