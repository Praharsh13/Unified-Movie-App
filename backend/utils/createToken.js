import jwt from 'jsonwebtoken'
//Creating token for users
const createToken=(res,userId)=>{
    const token=jwt.sign({userId},process.env.JWT_KEY,
        {expiresIn: '30d',
    });


    //Set token as an cookie


    res.cookie('jwt',token,
    {
        httpOnly:true,
        secure:process.env.NODE_ENV!=="development",
        sameSite:"strict",
        maxAge:30*24*60*60*1000
    });

    return token;

};

export default createToken;