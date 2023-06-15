import complementaryMessageService from "../service/complementary-message-service"

class ComplementaryMessageController{

    async addMessage(req:any, res:any, next:any){
        try {
            const {user_id, id, text, } = req.body
            const classData = await complementaryMessageService.addMessage(user_id, id, text)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }

    async getAll(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const classData = await complementaryMessageService.getAllMessage(id)
            return res.send(classData)
        } catch (e) {
            next(e)
        }
    }
}

export default new ComplementaryMessageController()