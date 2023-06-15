import groupService from "../service/group-service"

class GroupController{
    async createGroup(req:any, res:any, next:any){
        try {
            const {title, user_id} = req.body
            const groupData = await groupService.createGroup(title, user_id)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async editGroup(req:any, res:any, next:any){
        try {
            const {title, id} = req.body
            const groupData = await groupService.editGroup(title, id)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async deleteGroup(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const groupData = await groupService.deleteGroup(id)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async viewAllUsersInGroup(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const groupData = await groupService.viewUsersGroup(id)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async getGroups(req:any, res:any, next:any){
        try {
            const {user_id} = req.body
            const groupData = await groupService.getGroups(user_id)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async viewFreeUsers(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const groupData = await groupService.viewFreeUsers(id)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async addUserToGroup(req:any, res:any, next:any){
        try {
            const {user, group} = req.body
            const groupData = await groupService.sendWelcomeLink(user, group)
            return res.send(groupData)
        } catch (e) {
            next(e)
        }
    }

    async deleteUserFromGroup(req:any, res:any, next:any){
        try {
            const {user, group} = req.body
            const groupData = await groupService.deleteUserFromGroup(user, group)
            return res.send(groupData)

            //TODO: Autintification about delete
        } catch (e) {
            next(e)
        }
    }

    async activateUserToGroup(req:any, res:any, next:any){
        try {
            const group = req.params.link
            const user = req.params.id  
            await groupService.addUserToGroup(user, group)
            return res.redirect(process.env.CLIENT_URL + '/')
        } catch (e) {
            next(e)
        }
    }
}

export default new GroupController()