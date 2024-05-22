import express from "express";
import {
    getImage,
    getImageById,
    saveImage,
    updateImage,
    deleteImage
} from "../controllers/ImageController.js"

const router = express.Router();

router.get('/',(req,res)=>{
    res.json({
        msg:'hello wordl'
    });
});

router.get('/image',getImage);
router.get('/image/:id',getImageById);
router.post('/image',saveImage);
router.put('/image/:id',updateImage);
router.delete('/image/:id',deleteImage);




export default router;