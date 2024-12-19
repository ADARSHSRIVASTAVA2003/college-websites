const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");

const cuetSchema =new mongoose.Schema({
 userid:{
        type:String,
        require:true
    },
    Name:{
        type:String,
        require:true

    },
    addhar:{
        type:Number,
        require:true
    },
    password:{
        type:Number,
        require:true
    },
    FatherName:{
        type:String,
        require:true

    },
    MotherName:{
        type:String,
        require:true

    },
    email:{
        type:String,
        require:true

    },
    DOB:{
        type:Date,
        require:true
    },
    MobileNumber:{
        type:Number,
        require:true
    },
     Gender:{
        type:String,
        require:true
    },
     om10:{
        type:Number,
        require:true
    },
     om12:{
        type:Number,
        require:true
    },
    cuetregnumber:{
        type:Number,
        require:true
    }
})
const cuetform = mongoose.model("cuetform",cuetSchema);

module.exports = cuetform;