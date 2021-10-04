import jwt from 'jsonwebtoken'
import config from 'config'

export default  function (req: any, res: any, next: any) {
  //get token from header
  const token = req.header('x-auth-token');
  //check its token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'user not autherized' });
  }

  //verify the token
  try {
    const decoded: any = jwt.verify(token, config.get('jwtsecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};
