import express from 'express'
const PORT = process.env.PORT || 5000
import cors from 'cors'
import * as dotenv from 'dotenv';
const app = express()
import {router} from './router'
import errorMiddleware from './middleware/error-middleware'
import bodyParser from 'body-parser'
import prisma from './middleware/prisma-middleware';
app.use(bodyParser.json())
app.use(express.json())
import http from 'http';
const server = http.createServer(app);
app.use('/', router)
dotenv.config();
import { Server, Socket } from 'socket.io';

const io = new Server(server, {cors: {origin: "*"}});

io.on('connection', (socket: Socket) => {
  console.log('A client connected.');
  socket.on('addTask', async (task) => {
    try {
      const date = new Date()
      const member = await prisma.member.findFirst({
          where:{
              user_id:task.user_id
          }
      })
      const complementary = await prisma.taskComment.create({
          data:{
              task_id:task.id,
              member_id:member?.id,
              text:task.text,
              datetime:date.toISOString()
          }
      })
      const complementaryMessage = await prisma.taskComment.findMany({
        where:{
            task_id:task.id
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
      io.emit('taskAdded', complementaryMessage);
      socket.broadcast.emit('messageReceived', complementaryMessage);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  });

  socket.on('addComplementary', async (compl) => {
    try {
      const date = new Date()
      const member = await prisma.member.findFirst({
          where:{
              user_id:compl.user_id
          }
      })
      const complementary = await prisma.complementaryComment.create({
          data:{
              complementary_id:compl.id,
              member_id:member?.id,
              text:compl.text,
              datetime:date.toISOString()
          }
      })
      const complementaryMessage = await prisma.complementaryComment.findMany({
        where:{
            complementary_id:compl.id
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
      io.emit('complementaryAdded', complementaryMessage);
      socket.broadcast.emit('messageCompReceived', complementaryMessage);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  });

  socket.on('getAllUsers', async (task) => {
    try {
      const complementary = await prisma.taskComment.findMany({
        where:{
            task_id:task.id
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
    io.emit('allUsers', complementary);
    } catch (error) {
      console.error('Error getting all users:', error);
    }
  });


  socket.on('myEvent', (data: any) => {
    // Обработка события 'myEvent' от клиента
    console.log('Received myEvent:', data);
  });

  // Отправка событий клиенту
  socket.emit('event1', { message: 'Event 1 data' });
  socket.emit('event2', { message: 'Event 2 data' });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
))
app.use(errorMiddleware)
app.use('/images', express.static('uploads/images'))
app.use('/files', express.static('uploads/files'))

const start = async()=>{
    try {
        const port = 5000;
        server.listen(port, () => {
        console.log(`Server running on port ${port}`);
        });
        await prisma.role.createMany({
            data: [
            { name: 'student'},
            { name: 'teacher'}, 
            ],
            skipDuplicates: true, 
        })
    } catch (e) {
        console.log(e)
    }
}

start()