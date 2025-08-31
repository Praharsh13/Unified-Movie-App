// import jwt from 'jsonwebtoken'
// //Creating token for users
// const createToken=(res,userId)=>{
//     const token=jwt.sign({userId},process.env.JWT_KEY,
//         {expiresIn: '30d',
//     });


//     //Set token as an cookie


//     res.cookie('jwt',token,
//     {
//         httpOnly:true,
//         secure:process.env.NODE_ENV!=="development",
//         sameSite:"strict",
//         maxAge:30*24*60*60*1000
//     });

//     return token;

// };

// export default createToken;

import jwt from 'jsonwebtoken';

export default function createToken(res, userId) {
  const secret = process.env.JWT_SECRET || process.env.JWT_KEY;
  const token = jwt.sign({ userId }, secret, { expiresIn: '30d' });

  // optional cookie (helpful for same-origin admin tools)
  // do NOT rely on it for cross-site auth
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // must be true on HTTPS
    sameSite: 'none',                                // allow cross-site
    path: '/',                                       // send to all paths
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
}