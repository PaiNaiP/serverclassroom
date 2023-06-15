import { ApiError } from "../exception/api-error"
import prisma from "../middleware/prisma-middleware"
import mailService from "./mail-service"

class GroupService{

    async createGroup(title:string, user_id:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:user_id
        },
        select: {
            id:true,
            email: true
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const group = await prisma.group.create({
            data:{
                title:title,
                user_id:user_id
            }
        }).catch((err)=>{
            console.log(err)
            throw ApiError.BadRequest('Ошибка создания')
        })

        return group
    }

    async editGroup(title:string, id:string){
        const userCandiet = await prisma.group.findFirst({
            where:{
            id:id
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const group = await prisma.group.update({
            where:{
                id:id
            },
            data:{
                title:title
            }
        }).catch((err)=>{
            console.log(err)
            throw ApiError.BadRequest('Ошибка изменения')
        })

        return group
    }

    //TODO: check title for unique

    async deleteGroup(id:string){
        const userCandiet = await prisma.group.findFirst({
            where:{
            id:id
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const group = await prisma.group.delete({
            where:{
                id:id
            }
        }).catch((err)=>{
            console.log(err)
            throw ApiError.BadRequest('Ошибка изменения')
        })

        return group
    }

    async getGroups(user_id:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:user_id
        },
        select: {
            id:true,
            email: true
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const group = await prisma.group.findMany({
            where:{
                user_id:user_id
            }
        })

        if (group == null) return []
        if (group instanceof Array) return group
        return [group]
    }

    async viewFreeUsers(id:string){
        const groupCandiet = await prisma.group.findFirst({
            where:{
            id:id
        }
        })  
        if(!groupCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const memberCandiet = await prisma.memberGroup.findMany({
            where:{
            group_id:id
        }
        })  
        const userIds = memberCandiet.map((candidate) => candidate.user_id);
        const filteredUserIds = userIds.filter(id => id !== null) as string[];

        const groupCandidateUserIds = groupCandiet?.user_id ? [groupCandiet.user_id] : [];
        const freeUsers = await prisma.user.findMany({
            where: {
                isActived:true,
                id: {
                notIn: [...filteredUserIds, ...groupCandidateUserIds],
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

    async sendWelcomeLink(user:string, group:string){
        const groupCandiet = await prisma.group.findFirst({
            where:{
            id:group
        }
        })  
        if(!groupCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:user
        },
        select: {
            id:true,
            email: true
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const memberCandiet = await prisma.memberGroup.findFirst({
            where:{
            user_id:user,
            group_id:group
        },
        })  
        if(memberCandiet){
            throw ApiError.BadRequest('Пользователь уже состоит в группе')
        }
        if(userCandiet.email)
        await mailService.sendGroupActivationWelcomeLink(userCandiet?.email,`${process.env.API_URL}/group/${group}/${user}`, groupCandiet.title)
        return 'done'
    }

    async addUserToGroup(user:string, group:string){
        const groupCandiet = await prisma.group.findFirst({
            where:{
            id:group
        }
        })  
        if(!groupCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:user
        },
        select: {
            id:true,
            email: true
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const memberCandiet = await prisma.memberGroup.findFirst({
            where:{
            user_id:user,
            group_id:group
        },
        select: {
            id:true,
        },
        })  
        if(memberCandiet){
            throw ApiError.BadRequest('Пользователь уже состоит в группе')
        }
        const memberGroup = await prisma.memberGroup.create({
            data:{
                user_id:user,
                group_id: group
            }
        })
        return memberGroup
    }

    async deleteUserFromGroup(user:string, group:string){
        const groupCandiet = await prisma.group.findFirst({
            where:{
            id:group
        }
        })  
        if(!groupCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:user
        },
        select: {
            id:true,
            email: true
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const memberCandiet = await prisma.memberGroup.findFirst({
            where:{
            user_id:user,
            group_id:group
        },
        select: {
            id:true,
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const memberGroup = await prisma.memberGroup.delete({
            where:{
                id:memberCandiet?.id
            }
        })
        return memberGroup
    }

    async viewUsersGroup(id:string){
        const groupCandiet = await prisma.group.findFirst({
            where:{
            id:id
        }
        })  
        if(!groupCandiet){
            throw ApiError.BadRequest('Группа не найдена')
        }
        const members = await prisma.memberGroup.findMany({
            where:{
                group_id:id
            },
            include:{
                user:true
            }
        })
        if (members == null) return []
        if (members instanceof Array) return members
        return [members]
    }
}


export default new GroupService()