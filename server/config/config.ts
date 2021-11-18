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
        options : {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'e-comm',
                    version: '1.0.0',
                    description: 'sldkfjiealkjf lakjsdij as lkjiasf'
                },
                servers: [
                    {
                        url: 'http://locahost:5000'
                    }
                ],
            }, 
            apis: ['../routes/*.ts']
        }
    }
}

export default config[env];