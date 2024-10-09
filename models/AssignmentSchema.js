const mongoose = require("mongoose")

const assignmentSchema = mongoose.Schema({
    task : {
        type:String,
        required:true,
    },
    userId :{
        type:String,
        required:true,
    },
    adminId:{
        type:String,
        required:true,
    },
    verdict:{
        type:String,
        required:true,
    },
}, { timestamps: true } )

const Assignment = mongoose.model('Assignment',assignmentSchema);

module.exports = Assignment;