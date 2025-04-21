import mongoose, { Schema, Document } from 'mongoose';
import { TripPlan } from '@customTypes/tripPlan'; // Import the TripPlan type

// Define the Trip schema (using the TripPlan structure)
interface ITrip extends Document {
  startDate: string;
  endDate: string;
  users: mongoose.Types.ObjectId[];
  plan: TripPlan[]; // Store the TripPlan directly in the Mongoose schema
}

// Schema for the trip plan (using the existing structure)
const tripPlanSchema = new Schema<TripPlan>({
  location: { type: String, required: true },
  countryCode: { type: String, required: true },
  days: { type: Number, required: true },
  budget: { type: String, required: true },
  participants: { type: Number, required: true },
  plan: [{
    day: { type: Number, required: true },
    activities: [{
      activity: { type: String, required: true },
      location: { type: String, required: true },
      isValid: { type: Boolean, default: true },
      validationDetails: { type: Schema.Types.Mixed }
    }]
  }]
});

// Mongoose Trip Schema
const tripSchema = new Schema<ITrip>({
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  plan: [tripPlanSchema] // Array of trip plans
});

const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;
export { ITrip };
