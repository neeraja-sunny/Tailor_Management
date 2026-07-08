import mongoose, { Schema } from "mongoose";
const schema = new Schema({ boutique:{type:Schema.Types.ObjectId,ref:"Boutique",required:true,index:true}, category:{type:String,required:true}, description:String, amount:{type:Number,required:true,min:0}, expenseDate:{type:Date,default:Date.now,index:true}, createdBy:{type:Schema.Types.ObjectId,ref:"User"} },{timestamps:true});
export default mongoose.model("Expense",schema);
