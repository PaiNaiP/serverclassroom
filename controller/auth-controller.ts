import {validationResult} from 'express-validator'
import { ApiError } from '../exception/api-error'
import AuthService from '../service/auth-service'

class AuthController{
    async login(req:any, res:any, next:any){
        try {
            const {email, password} = req.body
            const userData = await AuthService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.send(userData)
        } catch (e) {
            next(e)
        }
    }
    
    async registration(req:any, res:any, next:any){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                console.log(errors)
                return next(ApiError.BadRequest('Пароль должен содержать минимум 6 символов и максимум 32', Object(errors)))
            }
            const {email, password, surname, name, lastname, color} = req.body
            const userData = await AuthService.registration( email, password, name, surname, lastname, color )
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async activate(req:any, res:any, next:any){
        try {
            const activationLink = req.params.link;
            await AuthService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL+`/signin`)
        } catch (e) {
            next(e)         
        }
    }

    async logout(req:any, res:any, next:any){
        try {
            const {id} = req.user
            const token = await AuthService.logout(id)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e) 
        }
    }

    async refresh(req:any, res:any, next:any){
        try {
            const {refreshToken} = req.cookies
            const userData = await AuthService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e) 
        }
    }
}
export default new AuthController()