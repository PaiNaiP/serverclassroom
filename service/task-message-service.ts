import prisma from "../middleware/prisma-middleware"

class TaskMessageService{

    async addMessage(user_id:string, id:string, text:string){
        const date = new Date()
        const member = await prisma.member.findFirst({
            where:{
                user_id:user_id
            }
        })
        const complementary = await prisma.taskComment.create({
            data:{
                task_id:id,
                member_id:member?.id,
                text:text,
                datetime:date.toISOString()
            }
        })
        return complementary
    }

    async getAllMessage(user_id:string, id:string){
        const complementary = await prisma.taskComment.findMany({
            where:{
                task_id:id
            },
            include:{
                member:{
                    include:{
                        user:{
                            select:{
                                colorProfile: true,
                                surname: true,
                                name: true,
                                lastname: true,
                                email: true,
                                passwordLink: true,
                                activationLink: true,
                                isActived: true,
                                file: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })
        return complementary
    }
}

export default new TaskMessageService()