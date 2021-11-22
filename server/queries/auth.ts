import User from '../models/user.model'

const authQuery : any = {
    checkExisting: async (credential: any, res: any) =>{
    let user;
        if(credential.indexOf('@') === -1){
          user = await User.findOne({ where: { username: credential },raw: true});
      }else{
          user = await User.findOne({ where: { email: credential },raw: true});
      } 
  
      //check the user exists or not
          if(user === null){
          return res.status(400).json({msg: 'username of email not exists'});
      } 
    }
}

export default authQuery;