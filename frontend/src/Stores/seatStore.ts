import { create } from "zustand";
import useFlightStore from "./FlightStore"; // Import to access passenger count

interface SelectedSeat {
  number: string;
  price: number;
}

interface SeatStore {
  selectedSeats: Record<string, SelectedSeat[]>; // Stores selected seats per flight
  selectSeat: (flightId: string, seat: SelectedSeat) => void;
  deselectSeat: (flightId: string, seatNumber: string) => void;
  resetSeats: () => void;
}

const useSeatStore = create<SeatStore>((set, get) => ({
  selectedSeats: {},

  selectSeat: (flightId, seat) => {
    const { adults, children, infants } = useFlightStore.getState(); // Get passenger count
    const passengerCount = adults + children + infants;
    const currentSeats = get().selectedSeats[flightId] || [];

    if (currentSeats.length >= passengerCount) {
      // FIFO: Remove the first seat to keep count within passenger limit
      currentSeats.shift();
    }

    set((state) => ({
      selectedSeats: {
        ...state.selectedSeats,
        [flightId]: [...currentSeats, seat],
      },
    }));
  },

  deselectSeat: (flightId, seatNumber) =>
    set((state) => ({
      selectedSeats: {
        ...state.selectedSeats,
        [flightId]:
          state.selectedSeats[flightId]?.filter(
            (s) => s.number !== seatNumber
          ) || [],
      },
    })),

  resetSeats: () => set({ selectedSeats: {} }),
}));

export default useSeatStore;
