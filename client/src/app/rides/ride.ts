export interface Ride {
  _id: string;
  driver: string;
  notes: string;
  seatsAvailable: number;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  isDriving: boolean;
  nonSmoking: boolean;
}
