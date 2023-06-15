import multer from 'multer'
import * as uuid from 'uuid'

const Storage = multer.diskStorage({
    destination:'uploads/images',
    filename: (req, file, cb)=>{
        cb(null, `${uuid.v4()}.${file.originalname.split('.').at(-1)}`)    
    },
})

const StorageFiles = multer.diskStorage({
    destination:'uploads/files',
    filename: (req, file, cb)=>{
        cb(null, `${uuid.v4()}.${file.originalname.split('.').at(-1)}`)    
    },
})

const upload = multer({
    storage: Storage
}).single('testImage')

const uploadFiles = multer({
    storage: StorageFiles
}).array('files', 10)

export {upload, uploadFiles}
