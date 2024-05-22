import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const image = db.define('gambar',{
    name:DataTypes.STRING,
    url:DataTypes.STRING
},{
    freezeTableName: true
});


export default image;

(async()=>{
    await db.sync();
})()