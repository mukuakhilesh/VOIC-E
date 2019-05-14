var mongoose= require('mongoose');
var chatSchema = new mongoose.Schema({
  date:{
      type:Date,
      default:Date.now
  },
  text:{
      type:String
  }


});
var Chat= mongoose.model('user',chatSchema);
module.exports=Chat;