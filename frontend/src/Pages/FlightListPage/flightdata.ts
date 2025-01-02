import AirIndia from "../../assets/images/AirIndia.png";

export interface Flight {
  id: string;
  flightNumber: string;
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
  stops: number;
  logo: string;
  type: "departure" | "return";
}

export const flightData: Flight[] = [
  {
    id: "1",
    flightNumber: "AB123",
    price: 30000,
    duration: 1,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
    stops: 0,
    logo: AirIndia,
  },
  {
    id: "2",
    flightNumber: "AB456",
    price: 15000,
    duration: 2,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
    stops: 2,
    logo: AirIndia,
  },
  {
    id: "3",
    flightNumber: "AB123",
    price: 25000,
    duration: 1,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
    stops: 0,
    logo: AirIndia,
  },
  {
    id: "4",
    flightNumber: "AB123",
    price: 10000,
    duration: 3,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "departure",
    stops: 1,
    logo: AirIndia,
  },
  {
    id: "5",
    flightNumber: "AB123",
    price: 5000,
    duration: 5,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
    stops: 2,
    logo: AirIndia,
  },
  {
    id: "6",
    flightNumber: "AB123",
    price: 12000,
    duration: 3,
    startTime: "2024-12-10T08:00:00",
    endTime: "2024-12-10T10:00:00",
    type: "return",
    stops: 1,
    logo: AirIndia,
  },
  {
    id: "7",
    flightNumber: "AB124",
    price: 21000,
    duration: 2.5,
    startTime: "2024-12-15T18:00:00",
    endTime: "2024-12-15T20:30:00",
    type: "return",
    stops: 0,
    logo: AirIndia,
  },
  // Add more flight data here
];
