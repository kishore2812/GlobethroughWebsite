import React, { useState, useEffect } from "react";
import useFlightStore from "../../Stores/FlightStore";
import { FaEdit } from "react-icons/fa"; // Edit icon
import "./PassengerDetails.scss";
import Select from "react-select";
import { countries } from "countries-list"; // Import countries data

const countryOptions = Object.keys(countries).map((countryCode) => ({
  label: `${countries[countryCode].name} (+${countryCode})`, // Format as "Country (+CountryCode)"
  value: `+${countryCode}`, // Use country code with "+" prefix
}));

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

const PassengerDetails: React.FC = () => {
  const {
    adults,
    children,
    infants,
    passengers, // This comes directly from the Zustand store, so it persists
    setAdults,
    setChildren,
    setInfants,
    setPassengers,
  } = useFlightStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const totalPassengers = adults + children + infants;

    // If there are already passengers, don't reinitialize
    if (passengers.length > 0) {
      // Only update the passengers if the total number of passengers has changed
      if (passengers.length !== totalPassengers) {
        const newPassengers: Passenger[] = [];
        for (let i = 0; i < totalPassengers; i++) {
          // Check existing passengers and update if necessary
          if (i < adults) {
            if (passengers[i]?.type === "Adult") {
              newPassengers.push(passengers[i]);
            } else {
              newPassengers.push({
                type: "Adult",
                firstName: "",
                lastName: "",
                countryCode: "",
                gender: "",
                phoneNumber: "",
                dob: "",
                email: "",
              });
            }
          } else if (i < adults + children) {
            if (passengers[i]?.type === "Child") {
              newPassengers.push(passengers[i]);
            } else {
              newPassengers.push({
                type: "Child",
                firstName: "",
                lastName: "",
                countryCode: "",
                gender: "",
                phoneNumber: "",
                dob: "",
                email: "",
              });
            }
          } else {
            if (passengers[i]?.type === "Infant") {
              newPassengers.push(passengers[i]);
            } else {
              newPassengers.push({
                type: "Infant",
                firstName: "",
                lastName: "",
                countryCode: "",
                gender: "",
                phoneNumber: "",
                dob: "",
                email: "",
              });
            }
          }
        }
        setPassengers(newPassengers);
      }
    } else {
      // If there are no passengers yet (e.g., on first load or after reset), initialize the passengers
      const newPassengers: Passenger[] = [];
      for (let i = 0; i < totalPassengers; i++) {
        if (i < adults) {
          newPassengers.push({
            type: "Adult",
            firstName: "",
            lastName: "",
            countryCode: "",
            gender: "",
            phoneNumber: "",
            dob: "",
            email: "",
          });
        } else if (i < adults + children) {
          newPassengers.push({
            type: "Child",
            firstName: "",
            lastName: "",
            countryCode: "",
            gender: "",
            phoneNumber: "",
            dob: "",
            email: "",
          });
        } else {
          newPassengers.push({
            type: "Infant",
            firstName: "",
            lastName: "",
            countryCode: "",
            gender: "",
            phoneNumber: "",
            dob: "",
            email: "",
          });
        }
      }
      setPassengers(newPassengers);
    }
  }, [adults, children, infants, passengers, setPassengers]);

  // Open the modal and select the passenger to edit
  const toggleEdit = (index: number) => {
    setSelectedPassengerIndex(index);
    setIsModalOpen(true);
  };

  // Save changes made to a passenger
  const saveChanges = (data: Passenger) => {
    if (selectedPassengerIndex !== null) {
      const updatedPassengers = [...passengers];
      updatedPassengers[selectedPassengerIndex] = data;
      setPassengers(updatedPassengers);
      setIsModalOpen(false);
    }
  };

  // Delete a passenger
  const deletePassenger = (index: number) => {
    if (passengers[index].type === "Adult" && adults === 1) {
      alert("You cannot delete the last adult.");
      return;
    }

    const newPassengerData = passengers.filter((_, i) => i !== index);
    setPassengers(newPassengerData);

    if (passengers[index].type === "Adult") {
      setAdults(adults - 1);
    } else if (passengers[index].type === "Child") {
      setChildren(children - 1);
    } else if (passengers[index].type === "Infant") {
      setInfants(infants - 1);
    }
  };

  // Add a new passenger (assuming it's an Adult by default)
  const addPassenger = () => {
    const newPassenger: Passenger = {
      type: "Adult",
      firstName: "",
      lastName: "",
      countryCode: "",
      gender: "",
      phoneNumber: "",
      dob: "",
      email: "",
    };
    setPassengers([...passengers, newPassenger]);
    setAdults(adults + 1);
  };

  // Render the list of passengers
  const renderPassengerCards = () => {
    return passengers.map((passenger, i) => (
      <div key={i} className="passenger-details__item">
        <div className="passenger-details__item-info">
          <h3>
            Passenger {i + 1} ({passenger.type})
          </h3>
          {passenger.firstName && passenger.lastName ? (
            <p>
              {passenger.firstName} {passenger.lastName}
            </p>
          ) : (
            <span>Please fill the details</span>
          )}
        </div>
        <div className="passenger-details__item-actions">
          <button onClick={() => toggleEdit(i)}>
            <FaEdit />
          </button>
          <button onClick={() => deletePassenger(i)}>Delete</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="passenger-details">
      {renderPassengerCards()}
      <button className="passenger-details__add-button" onClick={addPassenger}>
        Add Passenger
      </button>

      {isModalOpen && selectedPassengerIndex !== null && (
        <div className="passenger-details__modal">
          <div className="passenger-details__modal-content">
            <h2>Edit Passenger Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                saveChanges({
                  type: passengers[selectedPassengerIndex].type,
                  firstName: formData.get("firstName") as string,
                  lastName: formData.get("lastName") as string,
                  countryCode: formData.get("countryCode") as string,
                  gender: formData.get("gender") as string,
                  phoneNumber: formData.get("phoneNumber") as string,
                  dob: formData.get("dob") as string,
                  email: formData.get("email") as string,
                });
              }}
            >
              <div className="passenger-details__form-row">
                <div className="passenger-details__form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={passengers[selectedPassengerIndex].firstName}
                  />
                </div>
                <div className="passenger-details__form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={passengers[selectedPassengerIndex].lastName}
                  />
                </div>
              </div>

              <div className="passenger-details__form-row">
                <div className="passenger-details__form-group">
                  <label htmlFor="countryCode">Country Code</label>
                  <Select
                    name="countryCode"
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) =>
                        option.value ===
                        passengers[selectedPassengerIndex]?.countryCode
                    )}
                    onChange={(option) =>
                      saveChanges({
                        ...passengers[selectedPassengerIndex],
                        countryCode: option?.value || "",
                      })
                    }
                    isSearchable={true} // Enable search
                    placeholder="Select Country"
                  />
                </div>
                <div className="passenger-details__form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    name="gender"
                    defaultValue={passengers[selectedPassengerIndex].gender}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="passenger-details__form-row">
                <div className="passenger-details__form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    defaultValue={
                      passengers[selectedPassengerIndex].phoneNumber
                    }
                  />
                </div>
                <div className="passenger-details__form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    defaultValue={passengers[selectedPassengerIndex].dob}
                  />
                </div>
              </div>

              <div className="passenger-details__form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={passengers[selectedPassengerIndex].email}
                />
              </div>

              <div className="passenger-details__form-actions">
                <button
                  type="button"
                  className="passenger-details__cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="passenger-details__save-button"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDetails;
