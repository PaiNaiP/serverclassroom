import taskMessageService from "../service/task-message-service"

class TaskMessageController{

    async addMessage(req:any, res:any, next:any){
        try {
            const {user_id, id, text } = req.body
            const classData = await taskMessageService.addMessage(user_id, id, text)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getAll(req:any, res:any, next:any){
        try {
            const {user_id, id} = req.body
            const classData = await taskMessageService.getAllMessage(user_id, id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }
}

export default new TaskMessageController()