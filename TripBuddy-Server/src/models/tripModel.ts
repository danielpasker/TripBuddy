import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  plan: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TripPlan' }],
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
