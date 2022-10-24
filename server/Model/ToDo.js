const mongoose=require("mongoose");
const todoschema=mongoose.Schema({
    userId:{
        type:String,
    },
    todos: [{
        checked: Boolean,
        text: String,
      }],
    
  
    
});

const ToDoListModel=mongoose.model("ToDo",todoschema);
module.exports=ToDoListModel;