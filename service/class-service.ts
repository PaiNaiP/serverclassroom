import * as uuid from 'uuid'
import {ApiError} from '../exception/api-error'
import prisma from '../middleware/prisma-middleware';
import fs from 'fs'
import { promisify } from 'util'

const unlinkAsync = promisify(fs.unlink)
class ClassService{
    async createClass(title:string, chapter:string, subject:string, audience:string, author:string, decor:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:author
        },
        select: {
            id:true,
            email: true
        },
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        let dec='';
        if(Object(decor).code)
            dec=Object(decor).code
        else
            dec=decor
        const classData = await prisma.class.create({
            data:{
                title:title,
                chapter:chapter,
                subject:subject,
                audience:audience,
                user_id:userCandiet.id,
                cover:'',
                decor: dec, 
                isArchive:false
            },
        })
        const role = await prisma.role.findFirst({
            where:{
            name:'teacher'
        }
        })  
        await prisma.member.create({
            data:{
                class_id:classData.id,
                role_id:role?.id,
                user_id: userCandiet.id
            },
        })     
        return classData
    }

        async getClass(user:string){
            const userCandiet = await prisma.user.findFirst({
                where:{
                id:user,
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
            })  
            if(!userCandiet){
                throw ApiError.BadRequest('Пользователь с таким email не найден')
            }
            const memberData = await prisma.member.findMany({
                where: {
                  user_id: user,
                },
                include: {
                user: true,
                class: {
                    include:{
                        user:true
                    },
                  },
                },
              });
              const classData = memberData.map(member => {
                if (member.class && !member.class.isArchive) {
                  return member.class;
                }
                return null;
              }).filter(Boolean);
            if (classData == null) return []
            if (classData instanceof Array) return classData
            return [classData]
            }
    
        async getClassOne(welcomelink:string, user:string){
            const userCandiet = await prisma.user.findFirst({
                where:{
                id:user
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
            })              
            if(!userCandiet){
                throw ApiError.BadRequest('Пользователь с таким email не найден')
            }
            const classCandiet = await prisma.class.findFirst({
                where:{
                id:welcomelink
            }
            })        
            if(!classCandiet){
                throw ApiError.BadRequest('Курс не найден')
            }
            const member = await prisma.member.findMany({
                where:{
                user_id:user,
                class_id:welcomelink
            },
            include: {
                role: true,
                class:{
                    include:{
                        user:{
                            select:{
                                surname: true,
                                name: true,
                                lastname:true,
                                email:true,
                                passwordLink:true,
                                activationLink:true,
                                isActived:true,
                                file:true, 
                                id:true
                            }
                        }
                    }
                }
            },
            })           
            return {
                member
            }
        }

        async getAuthorInfo(user:string){
            const userCandiet = await prisma.class.findFirst({
                where:{
                user_id:user
            }
            })       
            if(!userCandiet){
                throw ApiError.BadRequest('Пользователь с таким email не найден')
            } 
            const author = await prisma.user.findFirst({
                where:{
                id:user
            },
            select:{
                email:true,
                surname:true,
                name:true,
                lastname:true,
                file:true
            }
            })       
            return author
        }

        async edit_avatar(cover:string, welcomelink:string){
            const classCandiet = await prisma.class.findFirst({
                where:{
                    id:welcomelink
                }
            })       
            if(!classCandiet){
                throw ApiError.BadRequest('Пользователь с таким email не найден')
            } 
            if(classCandiet.cover){
                fs.access('uploads\\images\\'+classCandiet.cover, fs.constants.F_OK, async(err) => {
                    if (!err) {
                        await unlinkAsync('uploads\\images\\'+classCandiet.cover)      
                    }
                });
            }
            const data = await prisma.class.update({
                where:{
                    id:welcomelink
                },
                data: {
                    cover:cover
                },
            })
            return data
        }
    
        async updateClass(title:string, chapter:string, subject:string, audience:string, welcomelink:string, decor:string){
            const data = await prisma.class.update({
                where:{
                    id:welcomelink
                },
                data: {
                    title:title,
                    chapter:chapter,
                    subject:subject,
                    audience:audience,
                    decor:decor
                },
            }).catch(()=>{
                throw ApiError.BadRequest('Ошибка с заполнением данных')
            })
            return data
        } 

        async addArchive(id:string){
            const course = await prisma.class.findFirst({
                where:{
                    id:id
                }
            })
            const data = await prisma.class.update({
                where:{
                    id:id
                },
                data:{
                    isArchive:!course?.isArchive
                }
            }).catch(()=>{
                throw ApiError.BadRequest('Ошибка с заполнением данных')
            })
            return data
        }

        async delete(id:string){
            const data = await prisma.class.delete({
                where:{
                    id:id
                }
            })
            return data
        }

        async getClassStudent(user:string){
            const userCandiet = await prisma.user.findFirst({
                where:{
                id:user,
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
            })  
            if(!userCandiet){
                throw ApiError.BadRequest('Пользователь с таким email не найден')
            }
            const memberData = await prisma.member.findMany({
                where: {
                  user_id: user,
                },
                include: {
                  user: true,
                  class: {
                    include:{
                        user:true
                    }
                  },
                },
              });
            const classData = memberData
            .filter(member => member.class && !member.class.isArchive && member.class.user && member.class.user.id !== user)
            .map(member => member.class);
            if (classData == null) return []
            if (classData instanceof Array) return classData
            return [classData]
        }

        async getClassTeacher(user:string){
            const userCandiet = await prisma.user.findFirst({
                where:{
                id:user,
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
            })  
            if(!userCandiet){
                throw ApiError.BadRequest('Пользователь с таким email не найден')
            }
            const classData = await prisma.class.findMany({
                where: {
                  user_id: user,
                  isArchive:false
                },
                include: {
                  user: true,
                },
              });
            if (classData == null) return []
            if (classData instanceof Array) return classData
            return [classData]
    }

    async getClassArchive(user:string){
        const userCandiet = await prisma.user.findFirst({
            where:{
            id:user,
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
        })  
        if(!userCandiet){
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const memberData = await prisma.member.findMany({
            where: {
              user_id: user,
            },
            include: {
            user: true,
            class: {
                include:{
                    user:true
                },
              },
            },
          });
          const classData = memberData.map(member => {
            if (member.class && member.class.isArchive) {
              return member.class;
            }
            return null;
          }).filter(Boolean);
        if (classData == null) return []
        if (classData instanceof Array) return classData
        return [classData]
        }}

export default new ClassService()