import image from "../models/imageModel.js";
import path from "path";
import fs from "fs";

export const getImage =async(req,res)=>{
    try {
        const response = await image.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
    }
}



export const getImageById =async(req,res)=>{
    try {
        const response = await image.findOne({
            where:{
                id:req.params.id
            }
        });
        if(!response) return res.status(404).json({
            message:"Data not found"
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)
    }
}


export const saveImage =async(req,res)=>{
    if(req.files === null) return res.status(400).json({
        message:"no file upload"
    });
    const file = req.files.file;
    const fileSize = file.data.length;
    const extension =  path.extname(file.name);

    // mengambil data tahun - menit 
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const dateTime = `${year}${month}${day}_${hours}${minutes}_`;

    const fileName = dateTime + file.md5 + extension;
    const url = `${req.protocol}://${req.get("host")}/image/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(extension.toLowerCase())) return res.status(402).json({
        message: "invalid image extension"
    });
    if(fileSize > 5000000) return res.status(402).json({
        message: "image must be less than 5MB"
    });

    file.mv(`./public/image/${fileName}`, async(error)=>{
        if(error) return res.status(500).json({
            message: error.message
        });
        try {
            await image.create({
                name:fileName,
                url:url
            });
            res.status(201).json({
                message:"upload image successfuly"
            })
        } catch (error) {
            console.log(error.message);
        }
    })



}



export const updateImage =async(req,res)=>{
    const response = await image.findOne({
        where:{
            id:req.params.id
        }
    });
    if(!response) return res.status(404).json({
        message:"Data not found"
    });
    
    let fileName="";


    if(req.files === null){
        fileName = response.name;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension =  path.extname(file.name);
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const dateTime = `${year}${month}${day}_${hours}${minutes}_`;

        fileName = dateTime + file.md5 + extension;
        
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(extension.toLowerCase())) return res.status(402).json({
            message: "invalid image extension"
        });
        if(fileSize > 5000000) return res.status(402).json({
            message: "image must be less than 5MB"
        });
        const filePath = `./public/image/${response.name}`;
        fs.unlinkSync(filePath);

        file.mv(`./public/image/${fileName}`, async(error)=>{
            if(error) return res.status(500).json({
                message: error.message
            });  
        })
    }
    const url = `${req.protocol}://${req.get("host")}/image/${fileName}`;
    console.log(url);
    console.log(fileName);
    try {
        await image.update({
            name:fileName,
            url:url
        },{
            where:{
                id:req.params.id
            }
        });
        res.status(200).json({
            message:"image successfuly updated"
        })
    } catch (error) {
        console.log(error.message);
    }

}


export const deleteImage =async(req,res)=>{
    const response = await image.findOne({
        where:{
            id:req.params.id
        }
    });
    if(!response) return res.status(404).json({
        message:"Data not found"
    });

    try {
        const filePath = `./public/image/${response.name}`;
        fs.unlinkSync(filePath)
        await image.destroy({
            where:{
                id:req.params.id
            }
        });
        res.status(200).json({
            message:"image successfuly delete"
        })
    } catch (error) {
        console.log(error.message);
    }
}