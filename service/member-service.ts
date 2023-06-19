import { ApiError } from "../exception/api-error"
import prisma from "../middleware/prisma-middleware"
import mailService from "./mail-service"

class MemberService{

    async getAllUsers(welcomeLink:string){
        const classData = await prisma.member.findMany({
            where:{
                class_id:welcomeLink
            },
            select:{
                user_id:true
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Курс не найден')
        })
        const freeUsers = await prisma.user.findMany({
            where:{
                isActived:true,
                NOT:{
                    id:{in:Object(classData).user_id}
                }
            },
            select: {
                surname: true,
                name: true,
                lastname:true,
                email:true,
                passwordLink:true,
                activationLink:true,
                isActived:true,
                file:true, 
                id:true
            },
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка вывода')
        })
            if (freeUsers == null) return []
            if (freeUsers instanceof Array) return freeUsers
            return [freeUsers]
    }

    async checkRoleUser(user:string, welcomeLink:string){
        const role = await prisma.member.findMany({
            where:{
                user_id:user, 
                class_id:welcomeLink
            },
            include:{
                role:true
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка вывода')
        })
        if (role == null) return []
        if (role instanceof Array) return role
        return [role]    
    }

    async sendMail(user_id:string, class_id:string, roleTitle:string){
        const role = await prisma.role.findFirst({
            where:{
                name:roleTitle
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Роль не найдена')
        })
        const user = await prisma.user.findFirst({
            where:{
                id:user_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Пользователь не найден')
        })
        const classData = await prisma.class.findFirst({
            where:{
                id:class_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Курс не найден')
        })
        if(user?.email && classData?.id && role?.id && user.id && classData.title){
            await mailService.sendActivationWelcomeLink(user?.email,`${process.env.API_URL}/member/${classData?.id}/${role.id}/${user.id}`, classData.title)
        }
        return 'Done'
    }

    async add(user_id:string, class_id:string, role_id:string){
        const member = await prisma.member.findFirst({
            where:{
                user_id:user_id,
                class_id:class_id
            }
        })
        if(member){
            throw ApiError.BadRequest('Пользователь уже на курсе')
        }
        const memberData = await prisma.member.create({
            data:{
                role_id:role_id,
                user_id:user_id,
                class_id:class_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Ошибка создания')
        })
        const role = await prisma.role.findFirst({
            where:{
                id:role_id
            }
        })
        if(role?.name==="student"){
            const tasks = await prisma.task.findMany({
                where:{
                    class_id:class_id
                }
            })
            tasks.map(async(task)=>{
                const complementaryData = await prisma.complementary.findFirst({
                    where:{
                        task_id:task.id,
                        member_id:user_id
                    }
                })
                if(!complementaryData){
                    await prisma.complementary.create({
                        data:{
                            task_id:task.id, 
                            member_id:memberData.id
                        }
                    })
                }
            })
        }
        return memberData
    }

    async viewTeacher(class_id:string){
        const role = await prisma.role.findFirst({
            where:{
                name:'teacher'
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Роль не найдена')
        })
        await prisma.member.findMany({
            where:{
                class_id:class_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Курс не найден')
        })
        const member = await prisma.member.findMany({
            where:{
                class_id:class_id,
                role_id:String(role?.id)
            },
            include:{
                class:true,
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

        if (member == null) return []
        if (member instanceof Array) return member
        return [member]       
    }

    async viewStudents(class_id:string){
        const role = await prisma.role.findFirst({
            where:{
                name:'student'
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Роль не найдена')
        })
        await prisma.member.findMany({
            where:{
                class_id:class_id
            }
        }).catch(()=>{
            throw ApiError.BadRequest('Курс не найден')
        })
        const member = await prisma.member.findMany({
            where:{
                class_id:class_id,
                role_id:String(role?.id)
            },
            include:{
                class:true,
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

        if (member == null) return []
        if (member instanceof Array) return member
        return [member]     
    }

    async viewFreeUsers(id:string){
        const groupCandiet = await prisma.class.findFirst({
            where:{
            id:id
        }
        })  
        if(!groupCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const memberCandiet = await prisma.member.findMany({
            where:{
            class_id:id
        }
        })  
        const userIds = memberCandiet.map((candidate) => candidate.user_id);
        const filteredUserIds = userIds.filter(id => id !== null) as string[];

        const freeUsers = await prisma.user.findMany({
            where: {
                isActived:true,
                id: {
                notIn: filteredUserIds,
            },
            },
            select:{
                    email:true,
                    surname:true,
                    name:true,
                    lastname:true,
                    file:true,
                    colorProfile:true,
                    id:true
            }
            });
        if (freeUsers == null) return []
        if (freeUsers instanceof Array) return freeUsers
        return [freeUsers]
    }

    async addUserToClass(users:any, class_id:any, role_name:string){
        users.map(async(user:any)=>{
            const role = await prisma.role.findFirst({
                where:{
                    name:role_name
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Роль не найдена')
            })
            const userData = await prisma.user.findFirst({
                where:{
                    email:user
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Пользователь не найден')
            })
            const classData = await prisma.class.findFirst({
                where:{
                    id:class_id
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Курс не найден')
            })
            if(userData?.email && classData?.id && role?.id && userData.id && classData.title){
                await mailService.sendActivationWelcomeLink(userData?.email,`${process.env.API_URL}/member/${classData?.id}/${role.id}/${userData.id}`, classData.title)
            }
        })
        return 'Done'
    }


    async deleteUser(user_id:string, class_id:string){

        const classData = await prisma.class.findFirst({
            where:{
                id:class_id
            }
        })
        if(!classData)
            throw ApiError.BadRequest('Курс не найден')

        const userData = await prisma.user.findFirst({
            where:{
                id:user_id
            }
        })
        if(!userData)
            throw ApiError.BadRequest('Пользователь не найден')

        const memberData = await prisma.member.findFirst({
            where:{
                user_id:user_id,
                class_id:class_id
            }
        })
        const task = await prisma.task.findMany({
            where:{
                class_id:class_id
            }
        })
        const role_id = memberData?.role_id
        const role = await prisma.role.findFirst({
            where:{
                id:role_id||undefined
            }
        })
        if(role?.name==='student'){
            task.forEach(async(tsk)=>{
                const complementary = await prisma.complementary.findFirst({
                    where:{
                        member_id:memberData?.id,
                        task_id:tsk.id
                    }
                })
                await prisma.complementary.delete({
                    where:{
                        id:complementary?.id
                    }
                })
            })
        }
        if(!memberData)
            throw ApiError.BadRequest('Пользователь не найден')
        
        const member = await prisma.member.delete({
            where:{
                id:memberData.id
            }
        })
        return member
    }

    async addGroup(group_id:string, class_id:string){
        const group = await prisma.group.findFirst({
            where:{
                id:group_id
            }
        })
        if(!group)
            throw ApiError.BadRequest('Группа не найдена')
        const memberGroup = await prisma.memberGroup.findMany({
            where:{
                group_id:group_id
            }
        })
        if(!memberGroup)
            throw ApiError.BadRequest('Участник группы не найден')
        memberGroup.map(async(mmbr)=>{
            const role = await prisma.role.findFirst({
                where:{
                    name:'student'
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Роль не найдена')
            })
            const userData = await prisma.user.findFirst({
                where:{
                    id:String(mmbr.user_id)
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Пользователь не найден')
            })
            const classData = await prisma.class.findFirst({
                where:{
                    id:class_id
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Курс не найден')
            })
            const findMember = await prisma.member.findFirst({
                where:{
                    user_id:mmbr.user_id,
                    class_id:class_id
                }
            })
            if(!findMember){
                if(userData?.email && classData?.id && role?.id && userData.id && classData.title){
                    await mailService.sendActivationWelcomeLink(userData?.email,`${process.env.API_URL}/member/${classData?.id}/${role.id}/${userData.id}`, classData.title)
                }
            }
        })
        return 'Done'
    }

}

export default new MemberService()