export interface Ride {
  _id: string;
  user: string;
  userId: string;
  notes: string;
  seatsAvailable: number;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  isDriving: boolean;
  roundTrip?: boolean;
  nonSmoking: boolean;
  passengerIds?: string[];
  passengerNames?: string[];
}
