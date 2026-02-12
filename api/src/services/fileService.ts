import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import File from "../models/fileUploadModel";
import { Request, Response } from "express";
import sharp from "sharp";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

// Create folder to save files
export const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const allowedTypes = [ "image/jpeg", "image/png", "image/gif","application/pdf"];

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  const { file } = req;

    if (!file) {
      throw new Error( "Arquivo não encontrado, tente novamente por favor.");
    }

    const fileType: string = file.mimetype; 

    if (!fileType || !allowedTypes.includes(fileType)) {
      throw new Error("O tipo do arquivo é inválido, tente outro tipo por favor.");
    }
    
    const originalName = file.originalname;
    const extension = path.extname(originalName).toLowerCase();
    const filename = uuidv4() + extension;

    const outputPath = path.join(uploadDir, filename);

    if (fileType.startsWith("image/")) {
      await sharp(file.buffer)
        .resize({ width: 1024 })
        .toFormat("jpeg", { quality: 80 })
        .toFile(outputPath);
    } else {
      fs.writeFileSync(outputPath, file.buffer);
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    // Save file
    const newFile = new File({
      filename,
      originalName,
      path: outputPath,
      url: fileUrl,
      fileType,
      createdAt: new Date()
    });

    return await newFile.save();
};
