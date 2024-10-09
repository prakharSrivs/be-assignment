const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const createUserObj = (email, name, password, role)=>{
    return { email, name, password, role };
}

const registerUser = async(req, res) => {
    const { email, name, password, role } = req.body;

    if(!(name && password && email && role )) return res.status(400).send({ "error": "Incomplete Information" });
    
    let user = await User.findOne({ email });
    if(user) return res.status(403).json({ "error":"User Already Exists "});

    const hash = await bcrypt.hash(password,12);

    try {
        const userObj = createUserObj( email, name, hash, role );
        const newUser = new User(userObj);
        await newUser.save();

        const token = jwt.sign({ id:newUser.id, name, email },process.env.SECRET,{expiresIn:'1h'});
        res.status(201).json({ message:"User Created Successfully", token });
    }
    catch(e){
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
}

const loginUser = async(req, res) => {
    const { email, password } = req.body;
    if(email==undefined || password == undefined) return res.sendStatus(400);

    //Checking if the User exists or not
    let user = await User.findOne({ email });

    if(!user) return res.status(401).json({"message":"User Not Registered"}) 

    // Comparing the password with the hashed ones
    if(await bcrypt.compare(password, user.password))
    {
        //Creating a token
        const token = jwt.sign(
            { id:user.id, name: user.name, email:user.email }, 
            process.env.SECRET, 
            { expiresIn: "1h" }
        );
        return res.status(200).json({ message:"User Logged In Successfully ", token });
    }else{
        return res.status(401).json({ message:"Invalid Credentials" });
    }
}

const returnAdmins = async(req, res)=>{
    try{
        const data = await User.find({ role:"admin" });
        const responseData = [];
        data.forEach( admin => responseData.push({ id:admin.id, name:admin.name, email:admin.email }))
        return res.json(responseData);
    }catch(e){
        console.log(e);
        return res.status(500).send("Internal Server Error !!")
    }
}

module.exports = {
    returnAdmins,
    loginUser,
    registerUser
}