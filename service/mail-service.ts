import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';
dotenv.config();
class MailService {
    private transporter: nodemailer.Transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to:any, link:any){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
            `<div>
                <img src="https://psv4.userapi.com/c236331/u405955725/docs/d20/a664b160e457/Frame_64.png?extra=pcaUU4pSu4jmKl70vWHFtZSLSXU1blT9s-5JTBs4QSt5a8J_tlHPFgPByRggFeooJyidXPOe1-j2pXEFdeF0cyWnb5lQWT-e9oU5Ajeez8YBDdOCrMo5elsLfhGej2qnMsHrSkkco6beEH987gjygVY3TA" 
                alt = "logo">
                <center>
                <h1>Для активации аккаунта нажмите на кнопку: </h1>
                <a href="${link}">
                    <button>Активировать аккаунт</button>
                </a>
                </center>
            </div>
            <style>
            button {
                background: #335DFF;
                border-radius: 7px;
                border: none;
                padding: 15px;
                color:white;
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 600;
                font-size: 18px;
            }
            button:active {
                background: #526adf;
            }
            </style>
            `
        })
    }

    async sendActivationPasswordMail(to:string, link:string){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Смена пароля на ' + process.env.API_URL,
            text: '',
            html:
                `<div>
                    <img src="https://psv4.userapi.com/c236331/u405955725/docs/d20/a664b160e457/Frame_64.png?extra=pcaUU4pSu4jmKl70vWHFtZSLSXU1blT9s-5JTBs4QSt5a8J_tlHPFgPByRggFeooJyidXPOe1-j2pXEFdeF0cyWnb5lQWT-e9oU5Ajeez8YBDdOCrMo5elsLfhGej2qnMsHrSkkco6beEH987gjygVY3TA" 
                    alt = "logo">
                    <center>
                    <h1>Для смены пароля нажмите на кнопку: </h1>
                    <a href="${link}">
                        <button>Сменить пароль</button>
                    </a>
                    </center>
                </div>
                <style>
                button {
                    background: #335DFF;
                    border-radius: 7px;
                    border: none;
                    padding: 15px;
                    color:white;
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 600;
                    font-size: 18px;
                }
                button:active {
                    background: #526adf;
                }
                </style>
                `
            
        })
    }

    async sendActivationWelcomeLink(to:string, link:string, title:string){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Приглашение на курс ${title} на ${process.env.API_URL}`,
            text: '',
            html:
            `<div>
                <img src="https://psv4.userapi.com/c236331/u405955725/docs/d20/a664b160e457/Frame_64.png?extra=pcaUU4pSu4jmKl70vWHFtZSLSXU1blT9s-5JTBs4QSt5a8J_tlHPFgPByRggFeooJyidXPOe1-j2pXEFdeF0cyWnb5lQWT-e9oU5Ajeez8YBDdOCrMo5elsLfhGej2qnMsHrSkkco6beEH987gjygVY3TA" 
                alt = "logo">
                <center>
                <h1>Вас пригласили на курс ${title} на ${process.env.API_URL}</h1>
                <p>Чтобы вступить нажмите на кнопку:</p>
                <a href="${link}">
                    <button>Вступить на курс</button>
                </a>
                </center>
            </div>
            <style>
            button {
                background: #335DFF;
                border-radius: 7px;
                border: none;
                padding: 15px;
                color:white;
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 600;
                font-size: 18px;
            }
            button:active {
                background: #526adf;
            }
            </style>
            `
        })
    }

    async sendGroupActivationWelcomeLink(to:string, link:string, title:string){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Приглашение в группу ${title} на ${process.env.API_URL}`,
            text: '',
            html:
            `<div>
                <img src="https://psv4.userapi.com/c236331/u405955725/docs/d20/a664b160e457/Frame_64.png?extra=pcaUU4pSu4jmKl70vWHFtZSLSXU1blT9s-5JTBs4QSt5a8J_tlHPFgPByRggFeooJyidXPOe1-j2pXEFdeF0cyWnb5lQWT-e9oU5Ajeez8YBDdOCrMo5elsLfhGej2qnMsHrSkkco6beEH987gjygVY3TA" 
                alt = "logo">
                <center>
                <h1>Вас пригласили в группу ${title} на ${process.env.API_URL}</h1>
                <p>Чтобы вступить нажмите на кнопку:</p>
                <a href="${link}">
                    <button>Вступить в группу</button>
                </a>
                </center>
            </div>
            <style>
            button {
                background: #335DFF;
                border-radius: 7px;
                border: none;
                padding: 15px;
                color:white;
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 600;
                font-size: 18px;
            }
            button:active {
                background: #526adf;
            }
            </style>
            `
        })
    }
}

export default new MailService()
