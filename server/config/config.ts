const env: any = process.env.NODE_ENV || 'development'; 

const config: any = {
    development: {
        port: 5000,
        jwtSecret: 'asdfghjk',
        database: 'e-comm',
        username: 'root',
        password: '',
        option: {
            dialect: "mysql",
            logging: false
        },
        mailid: 'verify.upi@gmail.com',
        mailpwd: 'upipwd01',
    }
}

export default config[env];