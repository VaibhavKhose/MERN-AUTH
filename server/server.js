import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"

const app = express()
const port = process.env.PORT || 3000
connectDB();




app.use(cookieParser());// 
app.use(cors({credentials : true}));
// app.use(cors({ credentials: true, origin: true }));

//api endpoint
// app.get('/',(req,res)=> res.send("API Working"));
app.use(express.json()); // middleware  //
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, ()=>console.log(`server started on port:${port}`));