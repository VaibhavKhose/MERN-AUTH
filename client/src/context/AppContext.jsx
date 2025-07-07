import { createContext } from "react";

export  const AppContent = createContext();

export const AppContextProvider = (props)=>{
    const backendUrl = import.meta.env.Vite_Backend.Url
    const [isLoggedin,setIsLoggedin]=useState(false);
    const [userData,setUserData]=useState(false);
    const value ={
        backendUrl,setIsLoggedin,setUserData,
        isLoggedin,userData


    }
    return(
       < AppContent.Provider value={value}>
      { props.children}
      </AppContent.Provider>
    )

}