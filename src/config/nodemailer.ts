import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST as string,
    port: 2525,
    auth: {
        user: process.env.MAIL_USER as string,
        pass: process.env.MAIL_PASS as string
    }
})