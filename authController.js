// ========================================
// Halo Marketplace
// controllers/authController.js
// ========================================


const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");


const prisma = require("../config/prisma");







// ========================================
// TOKEN GENERATOR
// ========================================


function generateToken(){


return crypto

.randomBytes(32)

.toString("hex");


}









// ========================================
// CREATE ACCOUNT
// POST /api/v1/auth/register
// ========================================


exports.register = async(req,res)=>{


try{


const {

name,

email,

password


}=req.body;





if(!name || !email || !password){


return res.status(400).json({

success:false,

message:"All fields are required"

});


}






const existingUser =

await prisma.user.findUnique({

where:{

email

}

});





if(existingUser){


return res.status(400).json({

success:false,

message:"Email already registered"

});


}






const hashedPassword =

await bcrypt.hash(

password,

12

);





const verificationToken =

generateToken();






const user =

await prisma.user.create({

data:{


name,


email,


password:hashedPassword,


role:"USER",



emailVerified:false,


verificationToken,


verificationExpires:

new Date(

Date.now() + 24*60*60*1000

)


}

});






// TODO:
// Send verification email here





res.status(201).json({

success:true,

message:

"Account created. Check your email to verify.",


user:{


id:user.id,

email:user.email


}


});


}


catch(error){


console.error(error);


res.status(500).json({

success:false,

message:"Registration failed"

});


}


};









// ========================================
// LOGIN
// POST /api/v1/auth/login
// ========================================


exports.login = async(req,res)=>{


try{


const {

email,

password

}=req.body;





const user =

await prisma.user.findUnique({

where:{

email

}

});





if(!user){


return res.status(401).json({

success:false,

message:"Invalid credentials"

});


}







if(!user.emailVerified){


return res.status(403).json({

success:false,

message:"Please verify your email first"

});


}







const valid =

await bcrypt.compare(

password,

user.password

);





if(!valid){


return res.status(401).json({

success:false,

message:"Invalid credentials"

});


}







const token =

jwt.sign(

{

id:user.id,

role:user.role


},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);







res.json({

success:true,

token,

user:{


id:user.id,

name:user.name,

email:user.email,

role:user.role


}

});


}


catch(error){


res.status(500).json({

success:false

});


}


};









// ========================================
// VERIFY EMAIL
// GET /api/v1/auth/verify/:token
// ========================================


exports.verifyEmail = async(req,res)=>{


try{


const user =

await prisma.user.findFirst({

where:{


verificationToken:req.params.token,


verificationExpires:{

gt:new Date()

}


}


});







if(!user){


return res.status(400).json({

success:false,

message:"Invalid or expired token"

});


}







await prisma.user.update({

where:{

id:user.id

},


data:{


emailVerified:true,


verificationToken:null,


verificationExpires:null


}


});







res.json({

success:true,

message:"Email verified successfully"

});


}


catch(error){


res.status(500).json({

success:false

});


}


};









// ========================================
// RESEND VERIFICATION
// POST /api/v1/auth/resend-verification
// ========================================


exports.resendVerification = async(req,res)=>{


try{


const {

email

}=req.body;





const token =

generateToken();





await prisma.user.update({

where:{

email

},


data:{


verificationToken:token,


verificationExpires:

new Date(

Date.now()+24*60*60*1000

)


}


});





// TODO:
// Send email again





res.json({

success:true,

message:"Verification email resent"

});


}


catch(error){


res.status(500).json({

success:false

});


}


};









// ========================================
// FORGOT PASSWORD
// POST /api/v1/auth/forgot-password
// ========================================


exports.forgotPassword = async(req,res)=>{


try{


const {

email

}=req.body;





const token =

generateToken();





await prisma.user.update({

where:{

email

},


data:{


resetPasswordToken:token,


resetPasswordExpires:

new Date(

Date.now()+60*60*1000

)


}


});





// TODO:
// Send reset email





res.json({

success:true,

message:"Password reset link sent"

});


}


catch(error){


res.status(500).json({

success:false

});


}


};









// ========================================
// RESET PASSWORD
// POST /api/v1/auth/reset-password/:token
// ========================================


exports.resetPassword = async(req,res)=>{


try{


const {

password

}=req.body;





const user =

await prisma.user.findFirst({

where:{


resetPasswordToken:req.params.token,


resetPasswordExpires:{

gt:new Date()

}


}


});






if(!user){


return res.status(400).json({

success:false,

message:"Invalid token"

});


}







await prisma.user.update({

where:{

id:user.id

},


data:{


password:

await bcrypt.hash(

password,

12

),


resetPasswordToken:null,


resetPasswordExpires:null


}


});






res.json({

success:true,

message:"Password updated"

});


}


catch(error){


res.status(500).json({

success:false

});


}


};