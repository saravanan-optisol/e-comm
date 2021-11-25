import User from '../models/user.model'

let userQuery = {

    checkUsernameExist: async (userName: string) =>{
        let checkusername = await User.findAll({ where:{ username: userName }})
            if(checkusername.length > 0){
                return 'username already exists'
            }
    },

    checkEmailExist: async (Email: string) =>{
        let checkemail = await User.findAll({ where:{ email: Email }})
            if(checkemail.length > 0){
                return 'email already exists'
            }
    },

    createUser: async (username: string, email: string, pwd: string, role_id: number)=>{
        const user = await User.create({
            username,
            email,
            password: pwd,
            role_id
        })
        return user;
    },

    findUser: async (user_id: any) =>{
        const user = await User.scope('withoutPassword').findByPk(user_id);
        return user;
    },

    findUserWithPwd: async (user_id: any) =>{
        const user = await User.findByPk(user_id);
        return user;
    },

    updateUserProfile: async (user_id: any, updateData: object) =>{
        await User.update(updateData, {
            where:{
                //@ts-ignore
                user_id: user_id
            }
        })
    },

    getAllUser: async() =>{
        let user = await User.scope('withoutPassword').findAll();
        return user;
    },

    findByEmail: async(email:string) =>{
        let user = await User.findOne({ where: { email: email }})
        return user;
    },

    findByUsername: async(userName:string) =>{
        let user = await User.findOne({ where: { username: userName }})
        return user;
    },

    updateOTP: async (OTP: number, uid: any) =>{
        await User.update({otp: OTP}, {where: {user_id: uid}})
    },

    resetOTP: async (uid: any)=>{
        await User.update({otp: null}, {where: {user_id: uid}})
    },

    updatePassword: async (pwd:string, uid: any) =>{
        await User.update({password: pwd}, {where: {user_id: uid}});
    },

    deleteAccount: async (user_id: any) =>{
        await User.destroy({ where: { user_id }})
    }

}

export default userQuery;