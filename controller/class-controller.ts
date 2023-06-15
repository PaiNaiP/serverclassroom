import { upload } from "../middleware/upload-middleware"
import classService from "../service/class-service"

class ClassController{
    async createClass(req:any, res:any, next:any){
        try {
            const {title, chapter, subject, audience, user_id, decor} = req.body
            const classData = classService.createClass(title, chapter, subject, audience, user_id, decor)
            return res.send(await classData)
        } catch (e) {
            next(e)
        }
    }

    async getClass(req:any, res:any, next:any){
        try {
            const {user} = req.body
            const classData = await classService.getClass(user)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getClassArchive(req:any, res:any, next:any){
        try {
            const {user} = req.body
            const classData = await classService.getClassArchive(user)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getClassOne(req:any, res:any, next:any){
        try {
            const {welcomelink, user} = req.body
            const classData = await classService.getClassOne(welcomelink, user)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getAuthorInfo(req:any, res:any, next:any){
        try {
            const {user} = req.body
            const classData = await classService.getAuthorInfo(user)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async editCover(req:any, res:any, next:any){
        try {
            upload(req, res, async(err:any)=>{
                if(err){
                    next(err)
                }
                else if(req.file)
                    {
                        const {welcomelink} = req.body
                        const userData = await classService.edit_avatar(req.file.filename, welcomelink)
                        return res.send(userData)
                    }
                    else {
                        next('Файл отсутствует')
                    }
            })
        } catch (e) {
            next(e)
        }
    }

    async updateClass(req:any, res:any, next:any){
        try {
            const {title, chapter, subject, audience, welcomeLink, decor} = req.body
            const classData = await classService.updateClass(title, chapter, subject, audience, welcomeLink, decor)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async addArchive(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const classData = await classService.addArchive(id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getClassStudent(req:any, res:any, next:any){
        try {
            const {user} = req.body
            const classData = await classService.getClassStudent(user)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getClassTeacher(req:any, res:any, next:any){
        try {
            const {user} = req.body
            const classData = await classService.getClassTeacher(user)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async delete(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const classData = await classService.delete(id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }
}
export default new ClassController()