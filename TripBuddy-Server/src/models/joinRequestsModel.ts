import mongoose, {Document, Schema} from 'mongoose';

interface IJoinRequest extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  approvingUsers: mongoose.Types.ObjectId[];
  isActive: boolean;
}

const joinRequestSchema = new Schema<IJoinRequest>({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  tripId: {type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true},
  approvingUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
  isActive: {type: Boolean, default: true, required: true},
});

const JoinRequest = mongoose.model<IJoinRequest>('JoinRequest', joinRequestSchema);

export default JoinRequest;
export {IJoinRequest};
