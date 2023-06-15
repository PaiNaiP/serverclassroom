import memberService from "../service/member-service"

class MemberController{
    async getAllUsers(req:any, res:any, next:any){
        try {
            const {welcomeLink} = req.body
            const userData = await memberService.getAllUsers(welcomeLink)
            return res.status(200).send(userData)
        } catch (e) {
            next(e)
        }
    }

    async checkRoleUser(req:any, res:any, next:any){
        try {
            const {user, welcomeLink} = req.body
            const userData = await memberService.checkRoleUser(user, welcomeLink)
            return res.send(userData)
        } catch (e) {
            next(e)
        }
    }

    async sendActiveMail(req:any, res:any, next:any){
        try {
            const {user_id, class_id, role} = req.body
            const memberData = await memberService.sendMail(user_id, class_id, role)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }

    async add(req:any, res:any, next:any){
        try {
            const welcomelink = req.params.link
            const role = req.params.role
            const user = req.params.id            
            await memberService.add(user, welcomelink, role)
            return res.redirect(process.env.CLIENT_URL + '/')
        } catch (e) {
            next(e)
        }
    }

    async viewTeacher(req:any, res:any, next:any){
        try {
            const {class_id} = req.body
            const memberData = await memberService.viewTeacher(class_id)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }

    async viewStudent(req:any, res:any, next:any){
        try {
            const {class_id} = req.body
            const memberData = await memberService.viewStudents(class_id)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }

    async freeUsers(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const memberData = await memberService.viewFreeUsers(id)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }

    async addToClass(req:any, res:any, next:any){
        try {
            const {users, class_id, role_name} = req.body
            const memberData = await memberService.addUserToClass(users, class_id, role_name)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }

    async deleteFromClass(req:any, res:any, next:any){
        try {
            const {user_id, class_id} = req.body
            const memberData = await memberService.deleteUser(user_id, class_id)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }

    async addGroupToClass(req:any, res:any, next:any){
        try {
            const {group_id, class_id} = req.body
            const memberData = await memberService.addGroup(group_id, class_id)
            return res.send(memberData)
        } catch (e) {
            next(e)
        }
    }
}

export default new MemberController()