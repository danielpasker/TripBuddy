import mongoose, {Schema, Document} from 'mongoose';
import {TripPlan} from '@customTypes/tripPlan';

interface ITrip extends Document {
  _id: string;
  startDate: Date;
  endDate: Date;
  users: mongoose.Types.ObjectId[];
  plan: TripPlan;
  isOpenToJoin: boolean;
}

const tripPlanSchema = new Schema<TripPlan>({
  location: {type: String, required: true},
  countryCode: {type: String, required: true},
  days: {type: Number, required: true},
  budget: {type: String, required: true},
  participants: {type: Number, required: true},
  tripType: {type: String, required: true},
  plan: [
    {
      day: {type: Number, required: true},
      activities: [
        {
          activity: {type: String, required: true},
          location: {type: String, required: true},
          isValid: {type: Boolean, default: true},
          isCustom: {type: Boolean, default: false},
        },
      ],
    },
  ],
});

const tripSchema = new Schema<ITrip>({
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  plan: tripPlanSchema,
  isOpenToJoin: {type: Boolean, default: false, required: true},
});

const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export default Trip;
export {ITrip};
