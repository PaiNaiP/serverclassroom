import {ApiError} from '../exception/api-error'
import express, { Request, Response, NextFunction } from 'express';

export default function errorMiddleware(err:any, req:Request, res:Response, next:Function){
    if(err instanceof ApiError){
        console.log(err)
        return res.status(err.status).json({message: err.message, errors:err.errors})
    }
    return res.status(500).json({message:'Непридвиденная ошибка'})
}