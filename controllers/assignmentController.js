const User = require("../models/UserSchema");
const Assignment = require("../models/AssignmentSchema")

const createAssignmentObj = (task, userId, adminId, verdict ) => {
    return { task, userId, adminId, verdict };
}

const uploadAssignment = async(req, res)=>{
    const { task, adminEmail } = req.body;
    const userId = req.id;
    const admin = await User.findOne({ email:adminEmail, role:"admin" });
    if( !admin ) return res.status(401).send(" Admin Not Found ");

    try{
        const assignmentObj = createAssignmentObj( task, userId, admin.id, "submitted");
        const newAssignment = new Assignment(assignmentObj);
        await newAssignment.save();

        return res.status(200).send("Assignment Uploaded Successfully");
    }catch(e){
        console.log(e);
        return res.status(500).send("Interval Server Error");
    }
}

const returnTaggedAssignment = async(req, res)=>{
    const adminId = req.id;

    try{
        const admin = await User.findById(adminId);
        if( !admin || admin.role !== "admin" ) return res.status(401).send(" Access Restricted ");

        const assignments = await Assignment.find({ adminId });
        return res.json(assignments);
    }catch(e){
        return res.status(500).send("Internal Server Error!!")
    }
 
}

const acceptAssignment = async(req,res)=>{
    const assignmentId = req.params.id;

    try{
        const assignment = await Assignment.findById(assignmentId);
        if( !assignment ) return res.status(401).send("Assignment does not exist");

        assignment.verdict = "accepted";
        await Assignment.findByIdAndUpdate(assignmentId, assignment, { new: true });
        return res.status(202).send(" Assignment Accepted Successfully ");
    }catch(e){
        return res.status(500).send("Internal Server Error !!")
    }
}

const rejectAssignment = async(req,res)=>{
    const assignmentId = req.params.id;

    try{
        const assignment = await Assignment.findById(assignmentId);
        if( !assignment ) return res.status(401).send("Assignment does not exist");

        assignment.verdict = "rejected";
        await Assignment.findByIdAndUpdate(assignmentId, assignment, { new: true });
        return res.status(202).send(" Assignment Rejected Successfully ");
    }catch(e){
        return res.status(500).send("Internal Server Error !!")
    }
}

module.exports = {
    uploadAssignment,
    acceptAssignment,
    rejectAssignment,
    returnTaggedAssignment
}