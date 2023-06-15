import { ApiError } from "../exception/api-error"
import prisma from "../middleware/prisma-middleware"
import fs from 'fs'
import { promisify } from 'util'
import transliteration from 'transliteration'
import fileService from "./file-service"
const unlinkAsync = promisify(fs.unlink)

class TaskService{

    async create(files:any, deadlineDatetime:string, title:string, description:string, point: string | undefined = undefined, class_id:string, isForm:boolean, user_id:string){
        const date = new Date()
        const isoDate = date.toISOString();
        if(deadlineDatetime!=='null'){
            const dateDeadline = new Date(deadlineDatetime)
            deadlineDatetime = dateDeadline.toISOString()
        }
        else{
            const dateDeadline = new Date(0)
            deadlineDatetime = dateDeadline.toISOString()
        }
        if (!point) {
            point = '0';
        }
        const pointNumber: number = parseInt(point) || 0;
        const filesArray = await Promise.all(files.map(async(file:any)=>{
            const decodedText: string = Buffer.from(file.originalname, 'binary').toString('utf-8');
            const fileData = await prisma.file.create({
                data:{
                    id:file.filename,
                    name: decodedText
                }
            })
            return fileData.id
        }))
        const memberData = await prisma.member.findFirst({
            where:{
                class_id: class_id,
                user_id:user_id
            }
        })
        const task = await prisma.task.create({
            data:{
                deadlineDatetime: deadlineDatetime,
                title:title,
                description:description,
                date:isoDate,
                point:Number(pointNumber),
                class_id:class_id,
                files:filesArray,
                isForm:Boolean(isForm),
                member_id:memberData?.id
            }
        })
        const role = await prisma.role.findFirst({
            where:{
            name:'student'
        },
        select: {
            id:true,
        },
        }) 
        const member = await prisma.member.findMany({
            where:{
                class_id:class_id,
                role_id:role?.id
            }
        })
        if(Object(member).id){
            await prisma.complementary.create({
                data:{
                    task_id:task.id,
                    member_id:Object(member).id
                }
            })
        }
        else{
            Object(member).map(async(data:any)=>{
                await prisma.complementary.create({
                    data:{
                        task_id:task.id,
                        member_id:data.id
                    }
                })
            })
        }
        return task
    }

    async viewTasks(class_id:string){
        const tasks = await prisma.task.findMany({
            where:{
                class_id: class_id
            },
            include:{
                member: {
                    include:{
                        user:{
                            select:{
                                email:true,
                                surname:true,
                                name:true,
                                lastname:true,
                                file:true,
                                colorProfile:true,
                                id:true
                            }
                        }
                    }
                },
                class:true,
            },
            orderBy: {
                date: 'desc', // Сортировка по полю даты в порядке убывания (от новых к старым)
            },
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка вывода')
        })
        if (tasks == null) return []
        if (tasks instanceof Array) return tasks
        return [tasks]
    }

    async update(id:string, files:any, oldFiles:string[], deadlineDatetime:string, title:string, description:string, point: string | undefined = undefined, isForm:boolean){
        const oldTask = await prisma.task.findFirst({
            where:{
                id:id
            },
            select:{
                files:true
            }
        })
        // console.log(files)
        if(oldTask){
            await Promise.all(oldTask.files.map(async(file:any)=>{
                if (Array.isArray(oldFiles)) {
                    oldFiles.map((old:string)=>{
                        if(old!==file){
                            file = files.filter((fileName: string[]) => fileName !== oldFiles);
                        }
                    })
                }else{
                    if(oldFiles!==file){
                        file = files.filter((fileName: string[]) => fileName !== oldFiles);
                    }
                }
                if(file.length!==0){
                    fs.access('uploads\\files\\'+file, fs.constants.F_OK, async(err) => {
                        if (!err) {
                            await unlinkAsync('uploads\\files\\'+file)      
                        }
                    });

                    await prisma.file.delete({
                        where:{
                            id:file
                        }
                    }).catch(()=>{
                        console.log('Уже удалено')
                    })
                }            
            }))  
        }  
        if(deadlineDatetime!=='null'){
            const dateDeadline = new Date(deadlineDatetime)
            deadlineDatetime = dateDeadline.toISOString()
        }
        else{
            const dateDeadline = new Date(0)
            deadlineDatetime = dateDeadline.toISOString()
        }
        if (!point) {
            point = '0';
        }
        const pointNumber: number = parseInt(point) || 0;
        const filesArray = await Promise.all(files.map(async(file:any)=>{
            const decodedText: string = Buffer.from(file.originalname, 'binary').toString('utf-8');
            const fileData = await prisma.file.create({
                data:{
                    id:file.filename,
                    name: decodedText
                }
            })
            return fileData.id
        }))
        if (Array.isArray(oldFiles)) {
            oldFiles.map((old:string)=>{
                filesArray.push(old)
            })
        }else{
            filesArray.push(oldFiles)
        }        const task = await prisma.task.update({
            where:{
                id:id
            },
            data:{
                deadlineDatetime: deadlineDatetime,
                title:title,
                description:description,
                point:Number(pointNumber),
                files:filesArray,
                isForm:Boolean(isForm),
            }
        })
        return task
    }

    async delete(id:string){
        const oldTask = await prisma.task.findFirst({
            where:{
                id:id
            },
            select:{
                files:true
            }
        })
        if(oldTask){
            await Promise.all(oldTask.files.map(async(file:any)=>{
                if(file){
                    fs.access('uploads\\files\\'+file, fs.constants.F_OK, async(err) => {
                        if (!err) {
                            await unlinkAsync('uploads\\files\\'+file)      
                        }
                    });

                    await prisma.file.delete({
                        where:{
                            id:file
                        }
                    }).catch(()=>{
                        console.log('Уже удалено')
                    })
                }            
            }))  
        }  
        const complementary = await prisma.complementary.findMany({
            where:{
                task_id:id
            }
        })
        complementary.forEach(async(comp)=>{
            await prisma.complementary.delete({
                where:{
                    id:comp.id
                }
            })
        })
        const task = await prisma.task.delete({
            where:{
                id:id
            }
        })
        return task
    }

    async addTheme(id:string, theme_id:string){
        const themeData = await prisma.theme.findFirst(({
            where:{
                id:theme_id
            }
        }))
        if(!themeData)
            throw ApiError.BadRequest('Тема не найдена')
        const task = await prisma.task.update({
            where:{
                id:id
            },
            data:{
                theme_id:theme_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка добавления')
        })
        return task
    }

    async deleteTheme(id:string){
        const task = await prisma.task.update({
            where:{
                id:id
            },
            data:{
                theme_id:null
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка добавления')
        })
        return task
    }

    async allTaskWithoutTheme(class_id:string){
        const task = await prisma.task.findMany({
            where:{
                class_id:class_id,
                theme_id:null
            },
            orderBy:{
                date:'asc'
            },
            include:{
                member:{
                    include:{
                        user:{
                            select:{
                                email:true,
                                surname:true,
                                name:true,
                                lastname:true,
                                file:true,
                                colorProfile:true,
                                id:true
                            }
                        }                    
                    }
                },
                class:true
            }
        })

        return task
    }

    async allTaskWithTheme(class_id:string){
        const task = await prisma.theme.findMany({
            where:{
                class_id:class_id
            },
            include:{
                task:{
                    orderBy: {
                        date:'asc'
                    },
                    include:{
                        class:true,
                        member:{
                            include:{
                                user:{
                                    select:{
                                        email:true,
                                        surname:true,
                                        name:true,
                                        lastname:true,
                                        file:true,
                                        colorProfile:true,
                                        id:true
                                    }
                                }                            
                            }
                        }
                    }
                },
                class:true
            }
        })

        return task
    }

    async viewTaskOne(id:string, user_id:string){
        const taskData = await prisma.task.findFirst({
            where:{
                id:id
            }
        })
        if(!taskData)
            throw ApiError.BadRequest('Задание не найдено')
        const memberData = await prisma.member.findFirst({
            where:{
                class_id:taskData.class_id,
                user_id:user_id
            },
            include:{
                role:true,
                class:{
                    select:{
                        title:true,
                        chapter:true,
                        subject:true,
                        audience:true,
                        cover:true,
                        decor:true,
                        isArchive:true,
                        user:{
                            select:{
                                email:true,
                                surname:true,
                                name:true,
                                lastname:true,
                                file:true,
                                colorProfile:true,
                                id:true
                            }
                        },
                        task:{
                            where: {
                                id: id
                            },
                            include:{
                                member:{
                                    include:{
                                        user:{
                                            select:{
                                                email:true,
                                                surname:true,
                                                name:true,
                                                lastname:true,
                                                file:true,
                                                colorProfile:true,
                                                id:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                user:{
                    select:{
                        email:true,
                        surname:true,
                        name:true,
                        lastname:true,
                        file:true,
                        colorProfile:true,
                        id:true
                    }
                }
            }
        })
        const files = await fileService.viewFiles(memberData?.class?.task[0].files)
        if(memberData?.class)
        memberData.class.task[0].files = files;
        return memberData
    }
}

export default new TaskService()