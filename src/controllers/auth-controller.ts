import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";

export class AuthController{
          constructor(){}

           register=(req:Request,res:Response,next:NextFunction)=>{
          
                try{
                   
                    const body = req.body as IUser
            
                    res.json(body)
                    

                }catch(e){
                 next(e)
                }
         }
               
          
}