import React, { useState, useEffect } from "react";
import useFlightStore from "../../Stores/FlightStore";

interface PassengerData {
  type: string;
  firstName: string;
  lastName: string;
  editing: boolean;
}

const PassengerDetails: React.FC = () => {
  const { adults, children, infants, setAdults, setChildren, setInfants } =
    useFlightStore();

  // Explicitly typing passengerData as an array of PassengerData
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);

  useEffect(() => {
    // Initialize the passenger data based on the counts from the store
    const totalPassengers = adults + children + infants;
    const initialData = Array.from({ length: totalPassengers }, (_, i) => ({
      type: i < adults ? "Adult" : i < adults + children ? "Child" : "Infant",
      firstName: "",
      lastName: "",
      editing: false,
    }));
    setPassengerData(initialData);
  }, [adults, children, infants]);

  const handleInputChange = (
    index: number,
    field: keyof PassengerData,
    value: string
  ) => {
    // Ensure the field is a valid key of PassengerData and passengerData is properly typed
    const newPassengerData = [...passengerData];
    newPassengerData[index][field] = value; // TypeScript will now infer the correct type for field
    setPassengerData(newPassengerData);
  };

  const toggleEdit = (index: number) => {
    const newPassengerData = [...passengerData];
    newPassengerData[index].editing = !newPassengerData[index].editing;
    setPassengerData(newPassengerData);
  };

  const saveChanges = (index: number) => {
    const newPassengerData = [...passengerData];
    newPassengerData[index].editing = false; // Close the form view
    setPassengerData(newPassengerData); // Save the changes and reflect them in the card
  };

  const deletePassenger = (index: number) => {
    const passengerToDelete = passengerData[index];

    // Prevent deletion if it's the only adult
    if (passengerToDelete.type === "Adult" && adults === 1) {
      alert("You cannot delete the last adult.");
      return; // Do not delete if only one adult remains
    }

    // Proceed with deletion
    const newPassengerData = passengerData.filter((_, i) => i !== index);
    setPassengerData(newPassengerData);

    // Update the counts in the Zustand store
    if (passengerToDelete.type === "Adult") {
      setAdults(adults - 1);
    } else if (passengerToDelete.type === "Child") {
      setChildren(children - 1);
    } else if (passengerToDelete.type === "Infant") {
      setInfants(infants - 1);
    }
  };

  const addPassenger = () => {
    const newPassenger = {
      type: "Adult", // Default new passenger as Adult
      firstName: "",
      lastName: "",
      editing: true, // Open form to enter data immediately
    };
    const newPassengerData = [...passengerData, newPassenger];
    setPassengerData(newPassengerData);

    // Update the adults count in the Zustand store
    setAdults(adults + 1);
  };

  const renderPassengerCards = () => {
    return passengerData.map((passenger, i) => (
      <div
        key={i}
        className="passenger-item"
        onClick={() => !passenger.editing && toggleEdit(i)}
      >
        <h3>
          Passenger {i + 1} ({passenger.type})
        </h3>
        {!passenger.editing ? (
          <>
            <p>First Name: {passenger.firstName || "N/A"}</p>
            <p>Last Name: {passenger.lastName || "N/A"}</p>
            <button onClick={() => deletePassenger(i)}>Delete</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={passenger.firstName}
              onChange={(e) =>
                handleInputChange(i, "firstName", e.target.value)
              }
              onClick={(e) => e.stopPropagation()} // Prevent toggle on input click
            />
            <input
              type="text"
              placeholder="Last Name"
              value={passenger.lastName}
              onChange={(e) => handleInputChange(i, "lastName", e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent toggle on input click
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                saveChanges(i);
              }}
            >
              Save
            </button>
          </>
        )}
      </div>
    ));
  };

  return (
    <div className="passenger-details">
      {renderPassengerCards()}
      <button onClick={addPassenger}>Add Passenger</button>
    </div>
  );
};

export default PassengerDetails;
