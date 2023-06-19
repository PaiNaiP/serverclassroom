import { uploadFiles } from "../middleware/upload-middleware"
import taskService from "../service/task-service"

class TaskController{

    async createFiles(req:any, res:any, next:any){
        try {
            uploadFiles(req, res, async(err:any)=>{
                if(err){
                    next(err)
                }
                else if(req.files)
                    {
                        const {deadlineDatetime, title, description, point, class_id, isForm, user_id} = req.body
                        const userData = await taskService.create(req.files, deadlineDatetime, title, description, point, class_id, isForm, user_id)
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

    async viewTasks(req:any, res:any, next:any){
        try {
            const {class_id} = req.body
            const taskData = await taskService.viewTasks(class_id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async update(req:any, res:any, next:any){
        try {
            uploadFiles(req, res, async(err:any)=>{
                if(err){
                    next(err)
                }
                else if(req.files)
                    {
                        const {id,oldFiles, deadlineDatetime, title, description, point, isForm} = req.body
                        const userData = await taskService.update(id, req.files, oldFiles, deadlineDatetime, title, description, point, isForm)
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

    async delete(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const taskData = await taskService.delete(id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async addTheme(req:any, res:any, next:any){
        try {
            const {id, theme_id} = req.body
            const taskData = await taskService.addTheme(id, theme_id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async deleteTheme(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const taskData = await taskService.deleteTheme(id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async allTaskWithoutTheme(req:any, res:any, next:any){
        try {
            const {class_id} = req.body
            const taskData = await taskService.allTaskWithoutTheme(class_id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async allTaskWithTheme(req:any, res:any, next:any){
        try {
            const {class_id} = req.body
            const taskData = await taskService.allTaskWithTheme(class_id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async viewTaskOne(req:any, res:any, next:any){
        try {
            const {id, user_id} = req.body
            const taskData = await taskService.viewTaskOne(id, user_id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }

    async getDecor(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const taskData = await taskService.getDecor(id)
            res.send(taskData)
        } catch (e) {
            next(e)
        }
    }
}
export default new TaskController()