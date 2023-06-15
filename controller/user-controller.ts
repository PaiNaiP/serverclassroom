import { validationResult } from 'express-validator'
import userService from '../service/user-service'
import {ApiError} from '../exception/api-error'
import { upload } from '../middleware/upload-middleware'


class UserController{
    async editUserInfo(req:any, res:any, next:any){
        try {
            const {surname, name, lastname, email, id} = req.body
            const userData = await userService.edit(id, email, surname, name, lastname)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    

    async resetPassword(req:any, res:any, next:any){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации'))
            }
            const {email} = req.body
            const userData = await userService.reset(email)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async activate_password(req:any, res:any, next:any){
        try {
            const passwordLink = req.params.link;
            await userService.activate_password(passwordLink)
            return res.redirect(process.env.CLIENT_URL + `/changepassword/${passwordLink}`)
        } catch (e) {
            next(e)         
        }
    }

    async editAvatar(req:any, res:any, next:any){
        try {
            upload(req, res, async(err:any)=>{
                if(err){
                    console.log(err)
                }
                else if(req.file)
                    {
                        const {email} = req.body
                        const userData = await userService.edit_avatar(req.file.filename, email)
                        return res.json(userData)
                    }
                    else {
                        return res.json('Файл отсутствует')
                    }
            })
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req:any, res:any, next:any){
        try {
            const {password, passwordLink} = req.body
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                console.log(errors)
                return next(ApiError.BadRequest('Пароль должен содержать минимум 6 символов и максимум 32', Object(errors)))
            }
            const updatedUser = await userService.changePassword(password, passwordLink)
            return res.json(updatedUser)
        } catch (e) {
            next(e)
        }
    }

    async getUserInfo(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const userData = userService.getUserInfo(id)
            return res.send(await userData)
        } catch (e) {
            next(e)
        }
    }
}

export default new UserController()