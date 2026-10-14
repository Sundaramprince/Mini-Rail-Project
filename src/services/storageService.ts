import { Booking, Train, User, Station, BookedPassenger, CancellationDetails, PaymentTransaction, LiveStatusData } from '../types/railway';
import { INITIAL_TRAINS, INITIAL_USERS, INITIAL_BOOKINGS, STATIONS } from '../data/seedData';

const STORAGE_KEYS = {
  TRAINS: 'irctc_trains_v1',
  BOOKINGS: 'irctc_bookings_v1',
  USERS: 'irctc_users_v1',
  CURRENT_USER_ID: 'irctc_current_user_id_v1',
  TRANSACTIONS: 'irctc_transactions_v1',
  THEME: 'irctc_theme_v1',
};

class StorageService {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }

  // Stations
  getStations(): Station[] {
    return STATIONS;
  }

  getStationByCode(code: string): Station | undefined {
    return STATIONS.find(s => s.code.toUpperCase() === code.toUpperCase());
  }

  // Trains
  getTrains(): Train[] {
    const trains = this.getStorageItem<Train[]>(STORAGE_KEYS.TRAINS, []);
    if (!trains || trains.length === 0) {
      this.setStorageItem(STORAGE_KEYS.TRAINS, INITIAL_TRAINS);
      return INITIAL_TRAINS;
    }
    return trains;
  }

  saveTrains(trains: Train[]): void {
    this.setStorageItem(STORAGE_KEYS.TRAINS, trains);
  }

  getTrainById(id: string): Train | undefined {
    return this.getTrains().find(t => t.id === id);
  }

  getTrainByNumber(trainNumber: string): Train | undefined {
    return this.getTrains().find(t => t.trainNumber === trainNumber);
  }

  addTrain(train: Train): void {
    const trains = this.getTrains();
    trains.push(train);
    this.saveTrains(trains);
  }

  updateTrain(updatedTrain: Train): void {
    const trains = this.getTrains().map(t => (t.id === updatedTrain.id ? updatedTrain : t));
    this.saveTrains(trains);
  }

  deleteTrain(trainId: string): void {
    const trains = this.getTrains().filter(t => t.id !== trainId);
    this.saveTrains(trains);
  }

  // Users
  getUsers(): User[] {
    const users = this.getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    if (!users || users.length === 0) {
      this.setStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
      return INITIAL_USERS;
    }
    // Automatically sanitize and replace legacy 'Sundaram' references
    let modified = false;
    users.forEach(u => {
      if (u.name.toLowerCase().includes('sundaram')) {
        u.name = 'Rahul Sharma';
        u.email = 'rahul.sharma@rail.in';
        modified = true;
      }
      u.savedPassengers?.forEach(sp => {
        if (sp.name.toLowerCase().includes('sundaram')) {
          sp.name = 'Rahul Sharma';
          modified = true;
        }
      });
    });
    if (modified) {
      this.saveUsers(users);
    }
    return users;
  }

  saveUsers(users: User[]): void {
    this.setStorageItem(STORAGE_KEYS.USERS, users);
  }

  getCurrentUser(): User {
    const currentId = this.getStorageItem<string>(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id);
    const users = this.getUsers();
    const user = users.find(u => u.id === currentId);
    return user || users[0] || INITIAL_USERS[0];
  }

  setCurrentUser(userId: string): void {
    this.setStorageItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers().map(u => (u.id === updatedUser.id ? updatedUser : u));
    this.saveUsers(users);
  }

  registerUser(name: string, email: string, phone: string): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      walletBalance: 2000,
      savedPassengers: [
        { id: `sp-${Date.now()}`, name, age: 25, gender: 'M', berthPreference: 'LB', foodPreference: 'V', seniorCitizen: false }
      ],
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser.id);
    return newUser;
  }

  addWalletBalance(userId: string, amount: number): number {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return 0;
    user.walletBalance = (user.walletBalance || 0) + amount;
    this.saveUsers(users);
    return user.walletBalance;
  }

  // Bookings
  getBookings(): Booking[] {
    const bookings = this.getStorageItem<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    if (!bookings || bookings.length === 0) {
      this.setStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      return INITIAL_BOOKINGS;
    }
    let modified = false;
    bookings.forEach(b => {
      if (b.userName.toLowerCase().includes('sundaram')) {
        b.userName = 'Rahul Sharma';
        b.userEmail = 'rahul.sharma@rail.in';
        modified = true;
      }
      b.passengers?.forEach(p => {
        if (p.name.toLowerCase().includes('sundaram')) {
          p.name = 'Rahul Sharma';
          modified = true;
        }
      });
    });
    if (modified) {
      this.saveBookings(bookings);
    }
    return bookings;
  }

  saveBookings(bookings: Booking[]): void {
    this.setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);
  }

  getBookingByPnr(pnr: string): Booking | undefined {
    const cleanPnr = pnr.replace(/\D/g, '');
    return this.getBookings().find(b => b.pnr.replace(/\D/g, '') === cleanPnr);
  }

  getUserBookings(userId: string): Booking[] {
    return this.getBookings().filter(b => b.userId === userId);
  }

  // Generate 10-digit Indian Railway PNR
  generatePnr(): string {
    // Standard format: 3-digit zone prefix (e.g. 245, 832, 654) + 7 digits
    const prefix = Math.floor(100 + Math.random() * 900).toString();
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();
    return `${prefix}${suffix}`;
  }

  // Create new booking with smart seat allocation
  createBooking(params: {
    userId: string;
    trainId: string;
    travelClass: string;
    quota: string;
    journeyDate: string;
    passengers: Array<{
      name: string;
      age: number;
      gender: 'M' | 'F' | 'T';
      berthPreference: string;
      foodPreference?: string;
    }>;
    paymentMethod: 'UPI' | 'NET_BANKING' | 'CARD' | 'IRCTC_WALLET';
  }): { success: boolean; booking?: Booking; error?: string } {
    const trains = this.getTrains();
    const trainIndex = trains.findIndex(t => t.id === params.trainId);
    if (trainIndex === -1) {
      return { success: false, error: 'Train not found' };
    }

    const train = trains[trainIndex];
    const classInfo = train.classes[params.travelClass];
    if (!classInfo) {
      return { success: false, error: 'Selected class not available on this train' };
    }

    const user = this.getCurrentUser();
    const passengerCount = params.passengers.length;

    // Pricing calculation
    let baseRate = classInfo.baseFare;
    let tatkalCharge = 0;
    if (params.quota === 'TQ') {
      tatkalCharge = Math.round(baseRate * 0.3); // 30% tatkal charge
    }
    const baseFareTotal = (baseRate + tatkalCharge) * passengerCount;
    const gst = Math.round(baseFareTotal * 0.05); // 5% GST for AC / Express
    const convenienceFee = params.paymentMethod === 'UPI' ? 15 : 30; // IRCTC standard convenience fee
    const grandTotal = baseFareTotal + gst + convenienceFee;

    // Check wallet balance if paying via wallet
    if (params.paymentMethod === 'IRCTC_WALLET') {
      if ((user.walletBalance || 0) < grandTotal) {
        return { success: false, error: `Insufficient wallet balance. Required: ₹${grandTotal}, Available: ₹${user.walletBalance || 0}` };
      }
      user.walletBalance -= grandTotal;
      this.updateUser(user);
    }

    // Determine seat allocations
    const bookedPassengers: BookedPassenger[] = [];
    let currentAvailable = classInfo.availableSeats;
    let currentRac = classInfo.racSeats;
    let currentWl = classInfo.wlSeats;

    // Coach prefix by class
    const coachPrefixMap: Record<string, string> = {
      '1A': 'H',
      '2A': 'A',
      '3A': 'B',
      '3E': 'M',
      'SL': 'S',
      'CC': 'C',
      'EC': 'E',
      '2S': 'D',
    };
    const coachLetter = coachPrefixMap[params.travelClass] || 'S';
    const coachNum = Math.floor(1 + Math.random() * 4);
    const coach = `${coachLetter}${coachNum}`;

    let overallBookingStatus: Booking['bookingStatus'] = 'CONFIRMED';

    params.passengers.forEach((p, idx) => {
      let status: 'CNF' | 'RAC' | 'WL' = 'CNF';
      let berthNum = 0;
      let berthType = '';
      let statusNumber: number | undefined = undefined;

      if (currentAvailable > 0) {
        status = 'CNF';
        currentAvailable -= 1;
        berthNum = 72 - currentAvailable;
        if (berthNum <= 0) berthNum = idx + 12;

        // Map berth preference or assign standard
        if (params.travelClass === 'CC' || params.travelClass === 'EC') {
          berthType = (berthNum % 3 === 0) ? 'Window Side' : (berthNum % 2 === 0 ? 'Aisle' : 'Middle');
        } else {
          const mod = berthNum % 8;
          if (mod === 1 || mod === 4) berthType = 'Lower Berth (LB)';
          else if (mod === 2 || mod === 5) berthType = 'Middle Berth (MB)';
          else if (mod === 3 || mod === 6) berthType = 'Upper Berth (UB)';
          else if (mod === 7) berthType = 'Side Lower (SL)';
          else berthType = 'Side Upper (SU)';
        }
      } else if (currentRac > 0) {
        status = 'RAC';
        statusNumber = 10 - currentRac + 1;
        currentRac -= 1;
        berthNum = 71;
        berthType = 'Side Lower (Shared)';
        overallBookingStatus = 'RAC';
      } else {
        status = 'WL';
        currentWl += 1;
        statusNumber = currentWl;
        berthNum = 0;
        berthType = 'Waitlisted';
        overallBookingStatus = 'WAITLISTED';
      }

      bookedPassengers.push({
        id: `pax-${Date.now()}-${idx}`,
        name: p.name,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berthPreference,
        allocatedCoach: status === 'CNF' || status === 'RAC' ? coach : 'WL',
        allocatedBerth: berthNum,
        allocatedBerthType: berthType,
        status,
        statusNumber,
        foodPreference: p.foodPreference || 'Veg',
      });
    });

    // Update train seats
    classInfo.availableSeats = currentAvailable;
    classInfo.racSeats = currentRac;
    classInfo.wlSeats = currentWl;
    this.updateTrain(train);

    // Create booking record
    const pnr = this.generatePnr();
    const paymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      pnr,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      trainId: train.id,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      trainType: train.trainType,
      sourceCode: train.sourceCode,
      sourceName: train.sourceName,
      destinationCode: train.destinationCode,
      destinationName: train.destinationName,
      journeyDate: params.journeyDate,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      travelClass: params.travelClass as any,
      quota: params.quota as any,
      passengers: bookedPassengers,
      baseFareTotal,
      tatkalCharge,
      gst,
      convenienceFee,
      grandTotal,
      paymentId,
      paymentMethod: params.paymentMethod,
      bookingStatus: overallBookingStatus,
      bookingDate: new Date().toISOString().split('T')[0],
      chartStatus: 'CHART_NOT_PREPARED',
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    // Record payment
    this.recordTransaction({
      id: paymentId,
      bookingId: newBooking.id,
      pnr: newBooking.pnr,
      amount: grandTotal,
      paymentMethod: params.paymentMethod,
      status: 'SUCCESS',
      transactionRef: `TXN${Date.now()}`,
      timestamp: new Date().toISOString(),
      notes: `Booking for PNR ${pnr}`,
    });

    return { success: true, booking: newBooking };
  }

  // Cancel Ticket with Official IRCTC Refund Calculation
  cancelBooking(bookingId: string, passengerIdsToCancel: string[], reason: string): {
    success: boolean;
    cancellation?: CancellationDetails;
    error?: string;
  } {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    const activePassengers = booking.passengers.filter(p => !p.isCancelled);
    const cancellingPassengers = activePassengers.filter(p => passengerIdsToCancel.includes(p.id));

    if (cancellingPassengers.length === 0) {
      return { success: false, error: 'No valid passengers selected for cancellation' };
    }

    // Time calculations
    const now = new Date();
    const journeyDateTime = new Date(`${booking.journeyDate}T${booking.departureTime}:00`);
    const diffHours = (journeyDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Calculate per passenger refund
    const perPaxFare = booking.baseFareTotal / booking.passengers.length;
    let totalDeduction = 0;
    let totalRefund = 0;

    cancellingPassengers.forEach(pax => {
      let deduction = 0;
      if (pax.status === 'WL' || pax.status === 'RAC') {
        // Flat clerical cancellation charge
        deduction = 60;
      } else {
        // Confirmed Ticket IRCTC Rules
        if (diffHours > 48) {
          // Flat cancellation charge
          const flatChargeMap: Record<string, number> = {
            '1A': 240,
            'EC': 240,
            '2A': 200,
            '3A': 180,
            '3E': 180,
            'CC': 180,
            'SL': 120,
            '2S': 60,
          };
          deduction = flatChargeMap[booking.travelClass] || 120;
        } else if (diffHours >= 12 && diffHours <= 48) {
          // 25% of fare (subject to minimum flat charge)
          deduction = Math.max(120, Math.round(perPaxFare * 0.25));
        } else if (diffHours >= 4 && diffHours < 12) {
          // 50% of fare
          deduction = Math.max(120, Math.round(perPaxFare * 0.5));
        } else {
          // Less than 4 hours: No refund
          deduction = perPaxFare;
        }
      }

      deduction = Math.min(deduction, perPaxFare);
      const refund = Math.max(0, perPaxFare - deduction);

      totalDeduction += deduction;
      totalRefund += refund;
    });

    // Mark passengers as cancelled
    booking.passengers.forEach(p => {
      if (passengerIdsToCancel.includes(p.id)) {
        p.isCancelled = true;
      }
    });

    const remainingActive = booking.passengers.filter(p => !p.isCancelled);
    if (remainingActive.length === 0) {
      booking.bookingStatus = 'CANCELLED';
    } else {
      booking.bookingStatus = 'PARTIALLY_CANCELLED';
    }

    const cancellationRecord: CancellationDetails = {
      cancelledDate: new Date().toISOString(),
      cancelledPassengerIds: passengerIdsToCancel,
      refundAmount: totalRefund,
      cancellationCharge: totalDeduction,
      reason: reason || 'Passenger requested cancellation',
      refundStatus: 'PROCESSED',
      transactionRef: `REF${Date.now()}`,
    };

    if (!booking.cancellations) {
      booking.cancellations = [];
    }
    booking.cancellations.push(cancellationRecord);
    this.saveBookings(bookings);

    // Release seats on train
    const train = this.getTrainById(booking.trainId);
    if (train && train.classes[booking.travelClass]) {
      const classInfo = train.classes[booking.travelClass];
      classInfo.availableSeats += cancellingPassengers.length;
      this.updateTrain(train);
    }

    // Credit refund to user's IRCTC wallet
    const users = this.getUsers();
    const user = users.find(u => u.id === booking.userId);
    if (user && totalRefund > 0) {
      user.walletBalance = (user.walletBalance || 0) + totalRefund;
      this.saveUsers(users);
    }

    // Record refund transaction
    this.recordTransaction({
      id: `txn_${Date.now()}`,
      bookingId: booking.id,
      pnr: booking.pnr,
      amount: totalRefund,
      paymentMethod: 'IRCTC_WALLET',
      status: 'REFUNDED',
      transactionRef: cancellationRecord.transactionRef,
      timestamp: new Date().toISOString(),
      notes: `Refund for PNR ${booking.pnr} (${cancellingPassengers.length} passengers)`,
    });

    return { success: true, cancellation: cancellationRecord };
  }

  // Transactions
  getTransactions(): PaymentTransaction[] {
    return this.getStorageItem<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  }

  recordTransaction(txn: PaymentTransaction): void {
    const list = this.getTransactions();
    list.unshift(txn);
    this.setStorageItem(STORAGE_KEYS.TRANSACTIONS, list);
  }

  // Reset to factory defaults
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TRAINS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    this.setStorageItem(STORAGE_KEYS.TRAINS, INITIAL_TRAINS);
    this.setStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  // Live Train Status Simulator
  getLiveTrainStatus(trainNumber: string): LiveStatusData | null {
    const train = this.getTrainByNumber(trainNumber);
    if (!train || !train.route || train.route.length === 0) return null;

    // Simulate progress along the route
    const stops = train.route;
    const currentIdx = Math.min(1, stops.length - 1);
    const currentStop = stops[currentIdx];
    const nextStop = stops[Math.min(currentIdx + 1, stops.length - 1)];

    return {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      currentStationCode: currentStop.stationCode,
      currentStationName: currentStop.stationName,
      delayMinutes: 0,
      statusText: 'Right Time · Approaching platform',
      speedKmH: train.averageSpeedKmH,
      passedStationCodes: stops.slice(0, currentIdx + 1).map(s => s.stationCode),
      nextStationCode: nextStop.stationCode,
      nextStationEta: nextStop.arrivalTime,
      platform: currentStop.platform,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

export const storageService = new StorageService();
