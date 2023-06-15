import * as jwt from 'jsonwebtoken'
import prisma from '../middleware/prisma-middleware'
import * as dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
dotenv.config();

class TokenService{

    generateTokens(payload:any){
        let accessToken: any
        let refreshToken: any
        if(process.env.JWT_ACCESS_SECRET&&process.env.JWT_REFRESH_SECRET){
            accessToken= jwt.sign(payload,process.env.JWT_ACCESS_SECRET, {expiresIn:'30s'})
            refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
        }
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token:string){
        try {
            if(process.env.JWT_ACCESS_SECRET){
                const userData =jwt.verify(token,process.env.JWT_ACCESS_SECRET)
                return userData
            }
        } catch (e) {
            return null
        }
    }
    validateRefreshToken(token:string){
        try {
            if(process.env.JWT_REFRESH_SECRET){
                const userData =jwt.verify(token, process.env.JWT_REFRESH_SECRET)
                return userData
            }
        } catch (e) {
            return null
        }
    }

    async saveToken(userId:any, refreshToken:string){
        const tokenData = await prisma.token.findFirst({where:{
            user_id:userId
        }})
        if(tokenData){
            await prisma.token.update({
                where:{
                    id:tokenData.id
                },
                data: {
                    refreshToken:refreshToken, 
                    user_id:userId
                },
            })
        }
        else {
            const token = await prisma.token.create({
                data: {
                    refreshToken:refreshToken, 
                    user_id:userId
                },
            })
            return token;
        }
    }

    async removeToken(id:string){
        const tokenData = await prisma.token.findFirst({where:{
            user_id:id
        }})
        await prisma.token.delete({
            where:{
                id:tokenData?.id
            },
        })
    }

    async findToken(refreshToken:string){
        const tokenData = await prisma.token.findFirst({where:{
            refreshToken:refreshToken
        }})
        return tokenData
    }
}
export default new TokenService()