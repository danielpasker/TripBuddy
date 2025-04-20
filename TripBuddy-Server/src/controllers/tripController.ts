import Trip from '../models/tripModel.js';

import { Request, Response } from 'express';

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, users, plan } = req.body;
    const newTrip = new Trip({
      startDate,
      endDate,
      users,
      plan
    });

    await newTrip.save();
    res.status(201).json({ message: 'Trip saved successfully', trip: newTrip });
  } catch (err) {
    res.status(500).json({ message: 'Error saving trip', error: err });
  }
};
