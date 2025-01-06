import { create } from "zustand";
import { Flight } from "../Pages/FlightListPage/flightdata";

type TripType = "one-way" | "round-trip";

interface Airport {
  ID: number;
  Name: string;
  City: string;
  Country: string;
  IATA: string;
  ICAO: string;
  Latitude: number;
  Longitude: number;
  Altitude: number;
  Timezone: number;
  Category: string;
  "Timezone Name": string;
  Type: string;
  Source: string;
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
}

const today = new Date().toISOString().split("T")[0]; // Format as "YYYY-MM-DD"

const useFlightStore = create<FlightStore>((set) => ({
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
  setSelectedDeparture: (flight: Flight | null) =>
    set({ selectedDeparture: flight }),
  setSelectedReturn: (flight: Flight | null) => set({ selectedReturn: flight }),
  setSelectedFlight: (flight: Flight | null) => set({ selectedFlight: flight }),
  setSelectedTrip: (tripType) => set({ selectedTrip: tripType }),
  setDepartureDate: (date) => set({ departureDate: date }),
  setReturnDate: (date) => set({ returnDate: date }),
  setAdults: (count) => set({ adults: count }),
  setChildren: (count) => set({ children: count }),
  setInfants: (count) => set({ infants: count }),
  setSelectedClass: (selectedClass) => set({ selectedClass }),
  setFromAirport: (airport) => set({ fromAirport: airport }),
  setToAirport: (airport) => set({ toAirport: airport }),
}));

export default useFlightStore;
