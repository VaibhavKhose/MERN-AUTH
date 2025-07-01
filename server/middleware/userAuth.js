

import jwt from "jsonwebtoken"

const userAuth = (req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        return res.json({
            success:false,
            message:"Not Authorized Login Again"
        })
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.id){
            // req.body.userId = tokenDecode.id
             req.user = { userId: decoded.id }
        }else{
            res.json({
            success:false,
            message:"Not Authorized Login Again"
        });
        }
         next();
    } catch (error) {
         res.json({
            success:false,
            message: error.message
        })
        
    }
}

export default userAuth;