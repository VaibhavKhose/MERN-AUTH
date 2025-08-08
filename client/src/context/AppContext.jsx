import { createContext,useEffect,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export  const AppContext = createContext();

 export const AppContextProvider = (props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin,setIsLoggedin]=useState(false);
    const [userData,setUserData]=useState(false);

    const getAuthState = async()=>{
      try {
        const {data}= await axios.get(backendUrl + 'api/auth/is-auth');
      
         if(data.success){
          setIsLoggedin(true);
          getUserData(); // Fetch user data if authenticated

         }
        
      } catch (error) {
        toast.error(error.message);
        
      }
    }

    const getUserData = async()=>{//3:45:46
      try {
        const {data} = await axios.get(backendUrl + "/api/user/data");
         data.success ? setUserData(data.userData) : toast.error(data.message);
         console.log("User Data:", data.userData);
        
      } catch (error) {
       toast.error(error.message);
        
      }
    }

    //  useEffect (()=>{
    //    getAuthState(); // Check authentication state on initial load
    //  },[])

 

    const value ={
        backendUrl,
        setIsLoggedin,setUserData,
        isLoggedin,userData,getUserData,getAuthState


    }
    return(
       <AppContext.Provider value={value}>
      { props.children}
      </AppContext.Provider>
    )

}
 
 