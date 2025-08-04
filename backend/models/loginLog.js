// models/loginLog.js
import mongoose from 'mongoose';
const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('LoginLog', loginLogSchema);
