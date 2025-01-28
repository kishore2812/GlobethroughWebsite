import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Flight } from "../Pages/FlightListPage/flightdata";

type TripType = "one-way" | "round-trip";

interface Airport {
  ID: number;
  name: string;
  City: string;
  Country: string;
  iataCode: string;
  ICAO: string;
  Latitude: number;
  Longitude: number;
  Altitude: number;
  Timezone: number;
  Category: string;
  TimezoneName: string;
  Type: string;
  Source: string;
}

interface Passenger {
  type: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  gender: string;
  phoneNumber: string;
  dob: string;
  email: string;
}

interface FlightStore {
  selectedTrip: TripType;
  departureDate: string | null;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  selectedClass: string;
  fromAirport: Airport | null;
  toAirport: Airport | null;
  selectedFlight: Flight | null;
  selectedDeparture: Flight | null;
  selectedReturn: Flight | null;
  passengers: Passenger[];
  setSelectedDeparture: (flight: Flight | null) => void;
  setSelectedReturn: (flight: Flight | null) => void;
  setSelectedFlight: (flight: Flight | null) => void;
  setSelectedTrip: (tripType: TripType) => void;
  setDepartureDate: (date: string | null) => void;
  setReturnDate: (date: string | null) => void;
  setAdults: (count: number) => void;
  setChildren: (count: number) => void;
  setInfants: (count: number) => void;
  setSelectedClass: (selectedClass: string) => void;
  setFromAirport: (airport: Airport | null) => void;
  setToAirport: (airport: Airport | null) => void;
  setPassengers: (passengers: Passenger[]) => void;
}

const today = new Date().toISOString().split("T")[0]; // Format as "YYYY-MM-DD"

const useFlightStore = create(
  persist<FlightStore>(
    (set) => ({
      selectedTrip: "one-way",
      departureDate: today,
      returnDate: null,
      adults: 1,
      children: 0,
      infants: 0,
      selectedClass: "",
      fromAirport: null,
      toAirport: null,
      selectedFlight: null,
      selectedDeparture: null,
      selectedReturn: null,
      passengers: [], // Initialize with an empty array

      setSelectedDeparture: (flight) => set({ selectedDeparture: flight }),
      setSelectedReturn: (flight) => set({ selectedReturn: flight }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedTrip: (tripType) => set({ selectedTrip: tripType }),
      setDepartureDate: (date) => set({ departureDate: date }),
      setReturnDate: (date) => set({ returnDate: date }),
      setAdults: (count) => set({ adults: count }),
      setChildren: (count) => set({ children: count }),
      setInfants: (count) => set({ infants: count }),
      setSelectedClass: (selectedClass) => set({ selectedClass }),
      setFromAirport: (airport) => set({ fromAirport: airport }),
      setToAirport: (airport) => set({ toAirport: airport }),
      setPassengers: (passengers) => set({ passengers }),
    }),
    {
      name: "flight-store", // Unique storage key for persistence
    }
  )
);

export default useFlightStore;
