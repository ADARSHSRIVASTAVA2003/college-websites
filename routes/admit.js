const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");


const admitSchema =new mongoose.Schema({
    userid:{
        type:String,
        require:true
    },
    Name:{
        type:String,
        require:true

    },
    password:{
        type:String,
        require:true

    },
    addhar:{
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
    photo:{
        type:String,
        require:true
    },
    addharphoto:{
        type:String,
        require:true
    },
    Gender:{
        type:String,
        require:true
    },
    Village:{
        type:String,
        require:true
    },
    post:{
        type:String,
        require:true
    },
    District:{
        type:String,
        require:true
    },
    Sate:{
        type:String,
        require:true
    },
    mm10:{
        type:Number,
        require:true
    },
    om10:{
        type:Number,
        require:true
    },
    mm12:{
        type:Number,
        require:true
    },
    om12:{
        type:Number,
        require:true
    },
    
    course:{
        type:String,
        require:true
    },
    Department:{
        type:String,
        require:true
    },
    photo10:{
        type:String,
        require:true
    },
    photo12:{
        type:String,
        require:true
    },
    cuetregnumber:{
        type:Number,
        require:true
    },





    // this is marks

     Marks:{
    subject1:{
        type:Number,
        default:0,
    },
    subject2:{
        type:Number,
        default:0,

    },
    subject3:{
        type:Number,
        default:0,

    },
    subject4:{
        type:Number,
        default:0,

    },
    subject5:{
        type:Number,
        default:0,

    },
    subject6:{
        type:Number,
        default:0,
        
    },
     }

});
const student = mongoose.model("student",admitSchema);

module.exports = student;
