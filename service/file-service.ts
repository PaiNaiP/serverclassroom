import prisma from "../middleware/prisma-middleware"

class FileService{

    async viewFiles(files:any){
        const filesArray = await Promise.all(files.map(async(file:any)=>{
            const fileData = await prisma.file.findMany({
                where:{
                    id:file
                }
            })
            return fileData
        }))    
        if (filesArray == null) return []
        if (filesArray instanceof Array) return filesArray
        return [filesArray]
    }
}

export default new FileService()