import themeService from "../service/theme-service"

class ThemeController{
    async create(req:any, res:any, next:any){
        try {
            const {title, class_id} = req.body
            const themeData = await themeService.create(title, class_id)
            res.send(themeData)
        } catch (e) {
            next(e)
        }
    }

    async viewAll(req:any, res:any, next:any){
        try {
            const {class_id} = req.body
            const themeData = await themeService.viewAll(class_id)
            res.send(themeData)
        } catch (e) {
            next(e)
        }
    }

    async update(req:any, res:any, next:any){
        try {
            const {id, title} = req.body
            const themeData = await themeService.update(id, title)
            res.send(themeData)
        } catch (e) {
            next(e)
        }
    }

    async delete(req:any, res:any, next:any){
        try {
            const {id} = req.body
            const themeData = await themeService.delete(id)
            res.send(themeData)
        } catch (e) {
            next(e)
        }
    }
}

export default new ThemeController()