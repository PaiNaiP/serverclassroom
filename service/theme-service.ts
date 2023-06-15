import { ApiError } from "../exception/api-error"
import prisma from "../middleware/prisma-middleware"

class ThemeService{
    async create(title:string, class_id:string){
        const classData = await prisma.class.findFirst(({
            where:{
                id:class_id
            }
        }))
        if(!classData)
            throw ApiError.BadRequest('Курс не найден')
        const theme = await prisma.theme.create({
            data:{
                title:title,
                class_id:class_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка создания')
        })
        return theme
    }

    async viewAll(class_id:string){
        const classData = await prisma.class.findFirst(({
            where:{
                id:class_id
            }
        }))
        if(!classData)
            throw ApiError.BadRequest('Курс не найден')
        const theme = await prisma.theme.findMany({
            where:{
                class_id:class_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка создания')
        })
        return theme
    }

    async update(id:string, title:string){
        const themeData = await prisma.theme.findFirst({
            where:{
                id:id
            }
        })
        if(!themeData)
            throw ApiError.BadRequest('Тема не найдена')
        const theme = await prisma.theme.update({
            where:{
                id:id
            },
            data:{
                title:title
            }
        })
        return theme
    }

    async delete(id:string){
        const themeData = await prisma.theme.findFirst({
            where:{
                id:id
            }
        })
        if(!themeData)
            throw ApiError.BadRequest('Тема не найдена')
        await prisma.task.updateMany({
            where:{
                theme_id:id
            },
            data:{
                theme_id:null
            }
        })
        const theme = await prisma.theme.delete({
            where:{
                id:id
            }
        })
        return theme
    }
}

export default new (ThemeService)