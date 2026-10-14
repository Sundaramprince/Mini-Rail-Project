/**
 * Type definitions for Mini Rail IRCTC Clone
 */

export type UserRole = 'user' | 'admin';

export interface PassengerMaster {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'T';
  berthPreference: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WS' | 'NONE';
  foodPreference: 'V' | 'NV' | 'J' | 'NA'; // Veg, Non-Veg, Jain, Not Applicable
  seniorCitizen?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  walletBalance: number;
  savedPassengers: PassengerMaster[];
}

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
}

export interface RouteStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  dayNumber: number;
  platform: string;
}

export type ClassCode = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | 'EC' | '2S';

export interface TrainClassInfo {
  code: ClassCode;
  name: string;
  baseFare: number;
  totalSeats: number;
  availableSeats: number;
  racSeats: number;
  wlSeats: number;
}

export type TrainType = 'VANDE_BHARAT' | 'RAJDHANI' | 'SHATABDI' | 'SUPERFAST' | 'EXPRESS' | 'DURONTO';

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distanceKm: number;
  runsOnDays: number[]; // 0 for Sun, 1 for Mon...
  classes: Record<string, TrainClassInfo>;
  route: RouteStop[];
  pantryAvailable: boolean;
  averageSpeedKmH: number;
  isActive: boolean;
}

export type Quota = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS' | 'HP';

export interface BookedPassenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'T';
  berthPreference: string;
  allocatedCoach: string;
  allocatedBerth: number;
  allocatedBerthType: string;
  status: 'CNF' | 'RAC' | 'WL';
  statusNumber?: number; // e.g. RAC 3 or WL 7
  foodPreference?: string;
  isCancelled?: boolean;
}

export interface CancellationDetails {
  cancelledDate: string;
  cancelledPassengerIds: string[];
  refundAmount: number;
  cancellationCharge: number;
  reason: string;
  refundStatus: 'PROCESSED' | 'PENDING';
  transactionRef: string;
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  travelClass: ClassCode;
  quota: Quota;
  passengers: BookedPassenger[];
  baseFareTotal: number;
  tatkalCharge: number;
  gst: number;
  convenienceFee: number;
  grandTotal: number;
  paymentId: string;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CARD' | 'IRCTC_WALLET';
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WAITLISTED' | 'CANCELLED' | 'PARTIALLY_CANCELLED';
  bookingDate: string;
  chartStatus: 'CHART_NOT_PREPARED' | 'CHART_PREPARED';
  cancellations?: CancellationDetails[];
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  pnr: string;
  amount: number;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CARD' | 'IRCTC_WALLET';
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  transactionRef: string;
  timestamp: string;
  notes?: string;
}

export interface LiveStatusData {
  trainNumber: string;
  trainName: string;
  currentStationCode: string;
  currentStationName: string;
  delayMinutes: number;
  statusText: string;
  speedKmH: number;
  passedStationCodes: string[];
  nextStationCode: string;
  nextStationEta: string;
  platform: string;
  lastUpdated: string;
}
