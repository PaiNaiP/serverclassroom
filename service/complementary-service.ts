import { ApiError } from "../exception/api-error"
import prisma from "../middleware/prisma-middleware"
import fileService from "./file-service"
import fs from 'fs'
import { promisify } from 'util'

const unlinkAsync = promisify(fs.unlink)

class ComplementaryService{
    async getOne(task_id:string, user_id:string){
        const task = await prisma.task.findFirst({
            where:{
                id:task_id
            },
            include:{
                class:true
            }
        })
        if(!task)
            throw ApiError.BadRequest('Задание не найдено')
        const member = await prisma.member.findFirst({
            where:{
                user_id:user_id,
                class_id:task.class?.id
            }
        })
        if(!member)
            throw ApiError.BadRequest('Участник не найден')
        const complementary = await prisma.complementary.findFirst({
            where:{
                member_id: member.id,
                task_id:task_id
            }
        })
        if(complementary?.file){
            const files = await fileService.viewFiles(complementary?.file)
            complementary.file = files;
        }
        return complementary
    }

    async editStatusWithoutFiles(id:string, status:string){
        const dateTime = status ? null : new Date().toISOString();

        const complementary = await prisma.complementary.update({
            where:{
                id:id
            },
            data:{
                datetime:dateTime,
                status:Boolean(!status)
            }
        })

        return complementary
    }

    async addFiles(files:any, id:string){
        const complementaryInfo = await prisma.complementary.findFirst({
            where:{
                id:id
            }
        })
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
            const fl:string[] = []
            complementaryInfo?.file.forEach((x=>{
                fl.push(x)
            }))
            filesArray.forEach((x=>{
                fl.push(x)
            }))
            
        const complementary = await prisma.complementary.update({
            where:{
                id:id
            },
            data:{
                file:fl,
            }
        })
        return complementary
    }

    async deleteFile(file_id:string, id:string){
        const complementaryInfo = await prisma.complementary.findFirst({
            where:{
                id:id
            }
        })
        const index = complementaryInfo?.file.indexOf(file_id);
        if (index !== -1) {
            if(index!==undefined)
            complementaryInfo?.file.splice(index, 1);
        }
        await prisma.file.delete({
            where:{
                id:file_id
            }
        })
        if(file_id){
            fs.access('uploads\\files\\'+file_id, fs.constants.F_OK, async(err) => {
                if (!err) {
                    await unlinkAsync('uploads\\files\\'+file_id)      
                }
            });
        }
        const complementary = await prisma.complementary.update({
            where:{
                id:id
            },
            data:{
                file:complementaryInfo?.file
            }
        })
        return complementary
    }

    async getAll(task_id: string) {
        const complementary = await prisma.complementary.findMany({
          where: {
            task_id: task_id
          },
          include: {
            member: {
              include: {
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
        return complementary;
      }    
      
    async addMark(id:string, mark:string){
        const complementary = await prisma.complementary.update({
            where:{
                id:id
            },
            data:{
                mark:Number(mark),
                status:false
            }
        })
        return complementary
    }
}

export default new ComplementaryService()