import React, { useState, useEffect } from "react";
import useFlightStore from "../../Stores/FlightStore";
import { FaEdit } from "react-icons/fa"; // Edit icon
import "./PassengerDetails.scss";
import Select from "react-select";
import { countries } from "countries-list"; // Import countries-list package

// Get the list of countries and their country codes
const countryOptions = Object.keys(countries).map((countryCode) => ({
  label: `${
    countries[countryCode as keyof typeof countries].name
  } (+${countryCode})`,
  value: `+${countryCode}`, // Use + followed by the country code
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
interface FormErrors {
  [key: string]: string; // Key is the field name, value is the error message
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  // Phone number validation (basic international format)
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle form submission and validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const countryCode = formData.get("countryCode") as string;
    const gender = formData.get("gender") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const dob = formData.get("dob") as string;
    const email = formData.get("email") as string;

    const errors: FormErrors = {};

    if (!firstName) errors.firstName = "First Name is required.";
    if (!lastName) errors.lastName = "Last Name is required.";
    if (!countryCode) errors.countryCode = "Country Code is required.";
    if (!gender) errors.gender = "Gender is required.";
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number.";
    }
    if (!dob) errors.dob = "Date of Birth is required.";
    if (!email || !validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    saveChanges({
      type: passengers[selectedPassengerIndex!].type,
      firstName,
      lastName,
      countryCode,
      gender,
      phoneNumber,
      dob,
      email,
    });
  };

  const saveChanges = (data: Passenger) => {
    if (selectedPassengerIndex !== null) {
      const updatedPassengers = [...passengers];
      updatedPassengers[selectedPassengerIndex] = data;
      setPassengers(updatedPassengers);
      setIsModalOpen(false);
    }
  };
  const updateChanges = (data: Passenger) => {
    if (selectedPassengerIndex !== null) {
      const updatedPassengers = [...passengers];
      updatedPassengers[selectedPassengerIndex] = data;
      setPassengers(updatedPassengers);
    }
  };

  // Open the modal and select the passenger to edit
  const toggleEdit = (index: number) => {
    setSelectedPassengerIndex(index);
    setIsModalOpen(true);
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
            <FaEdit /> Edit
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
            <h2>Passenger Details</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="passenger-details__form-row">
                <div className="passenger-details__form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={passengers[selectedPassengerIndex].firstName}
                  />
                  {formErrors.firstName && (
                    <p className="error">{formErrors.firstName}</p>
                  )}
                </div>
                <div className="passenger-details__form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={passengers[selectedPassengerIndex].lastName}
                  />
                  {formErrors.lastName && (
                    <p className="error">{formErrors.lastName}</p>
                  )}
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
                    onChange={(option) => {
                      const updatedPassenger = {
                        ...passengers[selectedPassengerIndex],
                        countryCode: option?.value || "",
                      };
                      updateChanges(updatedPassenger);
                    }}
                    isSearchable={true}
                    placeholder="Select Country"
                  />
                  {formErrors.countryCode && (
                    <p className="error">{formErrors.countryCode}</p>
                  )}
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
                    type="text"
                    name="phoneNumber"
                    defaultValue={
                      passengers[selectedPassengerIndex].phoneNumber
                    }
                  />
                  {formErrors.phoneNumber && (
                    <p className="error">{formErrors.phoneNumber}</p>
                  )}
                </div>
                <div className="passenger-details__form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    defaultValue={passengers[selectedPassengerIndex].dob}
                  />
                  {formErrors.dob && <p className="error">{formErrors.dob}</p>}
                </div>
              </div>

              <div className="passenger-details__form-row">
                <div className="passenger-details__form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={passengers[selectedPassengerIndex].email}
                  />
                  {formErrors.email && (
                    <p className="error">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="passenger-details__form-actions">
                <button
                  className="passenger-details__save-button"
                  type="submit"
                >
                  Save Changes
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
