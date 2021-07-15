const mongoose  =  require("mongoose")
const bcrypt = require('bcryptjs')
const jwt  =  require('jsonwebtoken')


const employeeSchema  =new mongoose.Schema({
    name :{
        type: String,
        required: true
    },

    email :{
        type: String,
        required: true,
        unique:true
    },

    phone: {
        type:Number,
        required :true,
        unique: true
    },
    work :{
        type: String,
        required: true,
        
    },
    password :{
        type: String,
        required: true,
    },

    confirmpassword:{
        type: String,
        required: true,
    },

    tokens: [{
        token:{
            type: String,
            required: true, 
        }
    }]
}) 

// generateing tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token =  jwt.sign({_id: this._id.toString()} , "mynameisfaishalimamforeverleaving");
        this.tokens =  this.tokens.concat({token:token})
        await this.save();
        return token;
       
    }catch(error){
        res.status(400).send("error")
        
    }
}


//converting password into hash
employeeSchema.pre('save' , async function(next){

    if(this.isModified('password')){
        this.password =  await bcrypt.hash(this.password, 10);
        this.confirmpassword =  await bcrypt.hash(this.confirmpassword, 10);
    }
  
    next();
})


//colletction create  

const Register = new mongoose.model("Register" ,employeeSchema)



module.exports = Register;