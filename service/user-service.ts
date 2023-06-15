import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import mailService from './mail-service'
import tokenService from './token-service'
import {ApiError} from '../exception/api-error'
import prisma from '../middleware/prisma-middleware'
import fs from 'fs'
import { promisify } from 'util'

const unlinkAsync = promisify(fs.unlink)

class UserService{
    async edit(id:string, email:string, surname:string, name:string, lastname:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:id
        },
        select: {
            id:true,
            email: true
        },
        })
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        if(userCandiet.email !== email){
            const candiet = await prisma.user.findFirst({
                where:{
                email:email
                },
                select: {
                    id:true
                },
            })
            if(candiet){
                throw ApiError.BadRequest('Пользователь с таким email уже существует')
            }
            const activationLink = uuid.v4();
            await mailService.sendActivationMail(email,`${process.env.API_URL}/auth/activate/${activationLink}`)
            await prisma.user.update({
                where:{
                    id:id
                },
                data: {
                    activationLink:activationLink
                },
            })
        }
        await prisma.user.update({
            where:{
                id:id
            },
            data: {
                email:email,
                name:name,
                surname:surname,
                lastname:lastname
            },
        })
            const user = await prisma.user.findFirst({
                    where:{
                    email:email
                },
                select: {
                    surname: true,
                    name: true,
                    lastname:true,
                    email:true,
                    passwordLink:true,
                    activationLink:true,
                    isActived:true,
                    file:true, 
                    id:true
                },
            })
            const tokens = tokenService.generateTokens({...user})
            if(user)
            await tokenService.saveToken(user.id, tokens.refreshToken)
            return {
                ...tokens,
                user
            }
    } 

    async reset(email:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            email:email
        }
        })
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const passwordLink = uuid.v4();
        await prisma.user.update({
            where:{
                id:userCandiet.id
            },
            data: {
                passwordLink:passwordLink
            },
        })        
        await mailService.sendActivationPasswordMail(email,`${process.env.API_URL}/user/activatePassword/${passwordLink}`)
        const user = await prisma.user.findFirst({
            where:{
            email:email
        },
        select: {
            surname: true,
            name: true,
            lastname:true,
            email:true,
            passwordLink:true,
            activationLink:true,
            isActived:true,
            file:true, 
            id:true
        },
        })        
        return user
    }

    async activate_password(passwordLink:string){
        const user = await prisma.user.findFirst({
            where:{
            passwordLink:passwordLink
        }
        })        
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка смены пароля')
        }
    }

    async edit_avatar(image:string, email:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            email:email
        }
        })        
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        if(userCandiet.file){
            fs.access('uploads\\images\\'+userCandiet.file, fs.constants.F_OK, async(err) => {
                if (!err) {
                    await unlinkAsync('uploads\\images\\'+userCandiet.file)      
                }
            });
        }
        await prisma.user.update({
            where:{
                id:userCandiet.id
            },
            data: {
                file:image
            },
        })  
        const user = await prisma.user.findFirst({
            where:{
            email:email
        },
        select: {
            surname: true,
            name: true,
            lastname:true,
            email:true,
            passwordLink:true,
            activationLink:true,
            isActived:true,
            file:true, 
            id:true
        },
        })             
        return user
    }

    async changePassword(password:string, passwordLink:string){
        if(!password){
            throw ApiError.BadRequest('Введите пароль')
        }
        const hashPassword = await bcrypt.hash(password, 4)
        const userCandiet = await prisma.user.findFirst({
            where:{
            passwordLink:passwordLink
        },
        select: {
            id:true,
            email: true
        },
        })
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        await prisma.user.update({
            where:{
                id:userCandiet.id
            },
            data: {
                password:hashPassword
            },
        })        
        const user = await prisma.user.findFirst({
            where:{
            passwordLink:passwordLink
        },
        select: {
            surname: true,
            name: true,
            lastname:true,
            email:true,
            passwordLink:true,
            activationLink:true,
            isActived:true,
            file:true, 
            id:true
        },
        })       
        return user
    }

    async getUserInfo(id:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:id
        },
        select: {
            id:true,
            email: true
        },
        })        
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const user = await prisma.user.findFirst({
            where:{
            id:id
        },
        select: {
            surname: true,
            name: true,
            lastname:true,
            email:true,
            passwordLink:true,
            activationLink:true,
            isActived:true,
            file:true, 
            id:true
        },
        })                     
        return user
    }

}

export default new UserService()