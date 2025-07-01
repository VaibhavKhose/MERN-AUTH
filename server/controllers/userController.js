import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    
  try {
//  const { userId } = req.body;
const userId = req.user.userId; 
// console.log("Token userId:", req.user.userId);

   
  
    const user = await userModel.findById(userId); 

    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    res.json({
      success : true,
      userData :{
        name : user.name,
        isAccountverified : user.isAccountverified
      }
      
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
