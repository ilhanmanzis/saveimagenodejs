import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routers/router.js";
import cors from "cors";
import fileUpload from "express-fileupload";

dotenv.config()
const app = express();
console.log(process.env.DB_NAME);
const port = process.env.PORT || 5000;


try {
    await db.authenticate();
    console.log('database connected');
} catch (error) {
    console.log(error);
}

app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use(fileUpload());
app.use(router);



app.listen(port,()=>{
    console.log(`server is running port ${port}`);
})