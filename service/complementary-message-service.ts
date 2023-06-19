import prisma from "../middleware/prisma-middleware";

class ComplementaryMessageService{

    async addMessage(user_id:string, id:string, text:string){
        const date = new Date()
        const member = await prisma.member.findFirst({
            where:{
                user_id:user_id
            }
        })
        const complementary = await prisma.complementaryComment.create({
            data:{
                complementary_id:id,
                member_id:member?.id,
                text:text,
                datetime:date.toISOString()
            }
        })
        return complementary
    }

    async getAllMessage(id:string){
        const complementary = await prisma.complementaryComment.findMany({
            where:{
                complementary_id:id
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
    async allUsers(task_id: string) {
        const complements = await prisma.complementary.findMany({
            where: {
                task_id: task_id,
                complementaryComment: {
                some: {}
                }
            },
            include: {
                complementaryComment: true,
                member: {
                    select: {
                            user: {
                            select: {
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
        });
        return complements;
    }

    async getUserMessage(user_id:string, task_id:string){
        const task = await prisma.task.findFirst({
            where:{
                id:task_id
            }
        })
        const member = await prisma.member.findFirst({
            where:{
                user_id:user_id,
                class_id:task?.class_id
            }
        })
        const complementary = await prisma.complementary.findFirst({
            where:{
                task_id:task?.id,
                member_id:member?.id
            }
        })
        const complementaryComment = await prisma.complementaryComment.findMany({
            where:{
                complementary_id:complementary?.id
            },
            include:{
                member:{
                    select:{
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
        return complementaryComment
    }
}
export default new (ComplementaryMessageService)