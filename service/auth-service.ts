import bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import MailService from './mail-service'
import TokenService from './token-service'
import {ApiError} from '../exception/api-error'
import prisma from '../middleware/prisma-middleware'

class AuthService{
    async registration(email:string, password:string, name:string, surname:string, lastname:string, color:string){
        const userCandiet = await prisma.user.findFirst(
            {where:{
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
        }, )
        if(userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email уже существует')
        }
        const hashPassword = await bcrypt.hash(password, 4)
        const activationLink = uuid.v4();
        if(!surname)
            throw ApiError.BadRequest('Введите фамилию')
        if(!name)
            throw ApiError.BadRequest('Введите имя')
        if(!email)
            throw ApiError.BadRequest('Введите почту')
        if(!password)
            throw ApiError.BadRequest('Введите пароль')
        await prisma.user.create({
            data:{
                surname:surname,
                name:name,
                lastname:lastname,
                password:hashPassword,
                activationLink:activationLink,
                email:email,
                isActived:false,
                passwordLink:'',
                file:'',
                colorProfile:color
            },
        })        
        await MailService.sendActivationMail(email,`${process.env.API_URL}/auth/activate/${activationLink}`)
        const userData = await prisma.user.findFirst({
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
        const user = userData
        const tokens = TokenService.generateTokens({...userData})
        if(userData){
            if(tokens.refreshToken)
            await TokenService.saveToken(userData.id, tokens.refreshToken)
        }
        return {
            ...tokens,
            user
        }
    }
    
    async activate(activationLink:string){
        const user = await prisma.user.findFirst({where:{
            activationLink:activationLink
        }})
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                isActived:true,
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
    }

    async login(email:string, password:string){
        let isPassEquals:any;
        const userCandiet = await prisma.user.findFirst({where:{
            email:email
        }})
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        if(userCandiet.password){
            isPassEquals = await bcrypt.compare(password, userCandiet.password)
        }
        if(!isPassEquals)
            throw ApiError.BadRequest('Неверный пароль')
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
        const tokens = TokenService.generateTokens({...user})
        if(user)
        await TokenService.saveToken(user.id, tokens.refreshToken)
        return {
            ...tokens,
            user
        }
    }

    async logout(refreshToken:string){
        const token = await TokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken:string){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        await TokenService.findToken(refreshToken)
        const user = await prisma.user.findFirst({
            where:{
            id:Object(userData).id
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
            id:true,
            colorProfile:true
        },
        })
        const tokens = TokenService.generateTokens({...user})
        if(user)
        await TokenService.saveToken(user.id, tokens.refreshToken)
        return {
            ...tokens,
            user
        }
    }
}

export default new AuthService()