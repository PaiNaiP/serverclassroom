import { uploadFiles } from "../middleware/upload-middleware"
import complementaryService from "../service/complementary-service"

class ComplementaryController{
    async getOne(req:any, res:any, next:any){
        try {
            const {task_id, user_id} = req.body
            const classData = await complementaryService.getOne(task_id, user_id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async editStatusWithoutFiles(req:any, res:any, next:any){
        try {
            const {id, status} = req.body
            const classData = await complementaryService.editStatusWithoutFiles(id, status)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async addFiles(req:any, res:any, next:any){
        try {
            uploadFiles(req, res, async(err:any)=>{
                if(err){
                    next(err)
                }
                else if(req.files)
                    {
                        const {id} = req.body
                        const userData = await complementaryService.addFiles(req.files, id)
                        return res.send(userData)
                    }
                    else {
                        next(err)
                    }
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteFile(req:any, res:any, next:any){
        try {
            const {file_id, id} = req.body
            const classData = await complementaryService.deleteFile(file_id, id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getAll(req:any, res:any, next:any){
        try {
            const {task_id} = req.body
            const classData = await complementaryService.getAll(task_id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async addMark(req:any, res:any, next:any){
        try {
            const {id, mark} = req.body
            const classData = await complementaryService.addMark(id, mark)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }
}


export default new ComplementaryController()