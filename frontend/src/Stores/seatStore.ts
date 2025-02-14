import { create } from "zustand";

interface SelectedSeat {
  number: string;
  price: number;
}

interface SeatStore {
  selectedSeats: Record<string, SelectedSeat[]>;
  selectSeat: (flightId: string, seat: SelectedSeat) => void;
  deselectSeat: (flightId: string, seatNumber: string) => void;
  resetSeats: () => void;
}

const useSeatStore = create<SeatStore>((set) => ({
  selectedSeats: {},

  selectSeat: (flightId, seat) =>
    set((state) => ({
      selectedSeats: {
        ...state.selectedSeats,
        [flightId]: [...(state.selectedSeats[flightId] || []), seat],
      },
    })),

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
