import React, { useEffect, useState } from "react";
import "./homepage.scss";
import Header from "../../Components/Header/Header";
import { CgArrowsExchange } from "react-icons/cg";
import {
  format,
  addMonths,
  subMonths,
  isBefore,
  isSameDay,
  eachDayOfInterval,
  endOfWeek,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  addDays,
} from "date-fns";
import { LuCalendar1 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import useFlightStore from "../../Stores/FlightStore";

const prices: { [key: string]: number } = {
  "2024-12-01": 100,
  "2024-12-05": 150,
  "2024-12-10": 200,
  "2024-12-15": 250,
  // Add more dates here
};
// Define an interface for the airport object
interface Airport {
  id: string;
  name: string;
  iataCode: string | null;
  address: {
    cityName: string;
    countryName: string;
  };
}

const HomePage: React.FC = () => {
  const {
    selectedTrip,
    setSelectedTrip,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    adults,
    setAdults,
    children,
    setChildren,
    infants,
    setInfants,
    selectedClass,
    setSelectedClass,
    fromAirport,
    setFromAirport,
    toAirport,
    setToAirport,
  } = useFlightStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAirportListModalOpen, setIsAirportListModalOpen] =
    useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<
    "from" | "to" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calendarType, setCalendarType] = useState<
    "departure" | "return" | null
  >(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showTravelersModal, setShowTravelersModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [airports, setAirports] = useState([]);

  //trip Type Selection
  const handleTripSelection = (tripType: "one-way" | "round-trip") => {
    setSelectedTrip(tripType);
  };

  //Airport Modal
  const handleAirportOpenModal = (selection: "from" | "to") => {
    setCurrentSelection(selection);
    setSearchQuery("");
    setIsAirportListModalOpen(true);
  };

  const handleSelectAirport = (airport: Airport) => {
    if (currentSelection === "from") {
      setFromAirport(airport);
    } else if (currentSelection === "to") {
      setToAirport(airport);
    }
    setIsAirportListModalOpen(false);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        // Fetch token from backend
        const tokenResponse = await fetch(
          "http://localhost:5000/amadeus/token"
        );
        const { access_token } = await tokenResponse.json();

        // Fetch airport data from Amadeus API
        const response = await fetch(
          `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${query}&page%5Blimit%5D=10`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const data = await response.json();
        setAirports(data.data || []);
      } catch (err) {
        console.error("Failed to fetch airports:", err);
        setAirports([]);
      }
    } else {
      setAirports([]);
    }
  };

  // Calendar Modal functions
  // Format the date as "Mon, Jan 28"
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const openCalendar = (type: "departure" | "return" | null) => {
    setCalendarType(type); // Set the calendar type (departure/return)
    setIsCalendarOpen(true); // Open the calendar modal
  };

  // Handler to select the date
  const handleDateSelect = (date: Date) => {
    const selectedDate = format(date, "yyyy-MM-dd");

    if (calendarType === "departure") {
      // If the calendar is in "departure" mode, set the departure date
      setDepartureDate(selectedDate);

      if (selectedTrip === "round-trip" && returnDate) {
        if (departureDate) {
          const updatedDepartureDate = new Date(departureDate); // Existing departure date

          // Ensure return date is set and later than departure date
          const updatedReturnDate = returnDate ? new Date(returnDate) : null;

          if (
            updatedReturnDate &&
            isBefore(updatedReturnDate, updatedDepartureDate)
          ) {
            const newReturnDate = addDays(updatedDepartureDate, 1); // Set return date to 1 day after departure
            setReturnDate(format(newReturnDate, "yyyy-MM-dd"));
          }
        }
      }

      if (selectedTrip === "one-way") {
        setReturnDate(null); // Reset return date for one-way trip
      }
    } else if (calendarType === "return" && selectedTrip === "round-trip") {
      // If the calendar is in "return" mode and it's a round trip
      if (departureDate) {
        const updatedDepartureDate = new Date(departureDate); // Convert departure date to Date object

        if (isBefore(date, updatedDepartureDate)) {
          alert("Return date cannot be earlier than departure date.");
        } else {
          setReturnDate(selectedDate);
        }
      } else {
        alert("Please select a departure date first.");
      }
    }

    setIsCalendarOpen(false); // Close the calendar after selecting a date
  };
  // Whenever departure date changes, check if the return date needs to be updated
  useEffect(() => {
    if (departureDate && returnDate) {
      const updatedDepartureDate = new Date(departureDate);
      const updatedReturnDate = new Date(returnDate);

      if (updatedDepartureDate > updatedReturnDate) {
        const newReturnDate = addDays(updatedDepartureDate, 1); // Set return date to 1 day after departure
        setReturnDate(format(newReturnDate, "yyyy-MM-dd"));
      }
    }
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const generateDays = (currentMonth: Date) => {
    const startOfMonthDate = startOfMonth(currentMonth);
    const endOfMonthDate = endOfMonth(currentMonth);

    // Calculate the first day of the calendar (start of the week for the first day of the month)
    const startOfCalendar = startOfWeek(startOfMonthDate, { weekStartsOn: 0 }); // Sunday as start of the week
    const endOfCalendar = endOfWeek(endOfMonthDate, { weekStartsOn: 0 }); // Saturday as end of the week

    // Generate all days in the range from the start of the calendar to the end of the calendar
    const daysInMonth = eachDayOfInterval({
      start: startOfCalendar,
      end: endOfCalendar,
    });

    return daysInMonth;
  };
  const renderPrice = (day: Date) => {
    const dayString = format(day, "yyyy-MM-dd");
    if (prices[dayString]) {
      return <div className="price-tag">${prices[dayString]}</div>;
    }
    return null;
  };

  // Travelers Modal functions
  const increment = (type: string) => {
    if (type === "adults") setAdults(adults + 1);
    if (type === "children") setChildren(children + 1);
    if (type === "infants") setInfants(infants + 1);
  };

  const decrement = (type: string) => {
    if (type === "adults" && adults > 1) setAdults(adults - 1);
    if (type === "children" && children > 0) setChildren(children - 1);
    if (type === "infants" && infants > 0) setInfants(infants - 1);
  };

  // Class Modal function
  const openClassModal = () => setShowClassModal(true);
  const closeClassModal = (selected: string) => {
    setSelectedClass(selected);
    setShowClassModal(false);
  };
  const handleOptionChange = (option: string) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
  };

  const navigate = useNavigate();

  //validation of the page and navigating to next page
  const handlesearchFlightsbutton = () => {
    let isValid = true;

    // Check if the class is selected
    if (!selectedClass) {
      const classCard = document.getElementById("Select_class_card");
      if (classCard) {
        classCard.classList.add("error-border");
        setTimeout(() => {
          classCard.classList.remove("error-border");
        }, 2000); // Remove the border after 2 seconds
      }
      isValid = false; // Mark as invalid
    }

    // Check if fromAirport is selected
    if (!fromAirport) {
      const fromAirportCard = document.getElementById("From_airport_card");
      if (fromAirportCard) {
        fromAirportCard.classList.add("error-border");
        setTimeout(() => {
          fromAirportCard.classList.remove("error-border");
        }, 2000); // Remove the border after 2 seconds
      }
      isValid = false; // Mark as invalid
    }

    if (!toAirport) {
      const fromAirportCard = document.getElementById("To_airport_card");
      if (fromAirportCard) {
        fromAirportCard.classList.add("error-border");
        setTimeout(() => {
          fromAirportCard.classList.remove("error-border");
        }, 2000); // Remove the border after 2 seconds
      }
      isValid = false; // Mark as invalid
    }

    // Check if the return date is selected for round-trip
    if (selectedTrip === "round-trip" && !returnDate) {
      const returnDateCard = document.getElementById("Return_date_card");
      if (returnDateCard) {
        returnDateCard.classList.add("error-border");
        setTimeout(() => {
          returnDateCard.classList.remove("error-border");
        }, 2000); // Remove the border after 2 seconds
      }
      isValid = false; // Mark as invalid
    }

    // If any of the validations failed, return and prevent navigation
    if (!isValid) return;

    // Proceed to flights list page if everything is valid
    navigate("/flightsListPage");
  };

  return (
    <div className="homepage">
      <Header />
      <div className="homepage_content">
        <h1 className="Homepage_heading">Book Flight Ticket Now</h1>
        <p className="homepage_paragraph">
          Affordable, flexible, & seamless booking experience
        </p>
        <div className="homepage_tripType_card">
          <div className="homepage_trip-selection">
            <button
              className={selectedTrip === "one-way" ? "selected" : ""}
              onClick={() => handleTripSelection("one-way")}
            >
              One Way
            </button>
            <button
              className={selectedTrip === "round-trip" ? "selected" : ""}
              onClick={() => handleTripSelection("round-trip")}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* New Card below the Trip Type Card */}
        <div className="homepage_airport-details_card">
          {/* airportSelection */}
          <div className="homepage_airport-details_row">
            {/* From Airport */}
            <div
              className="homepage_airport-option"
              id="From_airport_card"
              onClick={() => handleAirportOpenModal("from")}
            >
              <span className="homepage_label">
                {fromAirport ? fromAirport.name : "From Where - Select airport"}
              </span>
            </div>

            {/* Travel Icon */}
            <div className="homepage_travel-icon">
              <CgArrowsExchange />
            </div>

            {/* To Airport */}
            <div
              className="homepage_airport-option"
              id="To_airport_card"
              onClick={() => handleAirportOpenModal("to")}
            >
              <span className="homepage_label">
                {toAirport ? toAirport.name : "To Where - Select airport"}
              </span>
            </div>

            {/* Airport List Modal */}
            {isAirportListModalOpen && (
              <>
                {/* Overlay */}
                <div
                  className="homepage_Airportmodal-overlay"
                  onClick={() => setIsAirportListModalOpen(false)} // Close modal when clicking outside
                ></div>
                <div className="homepage_airport-modal">
                  <div className="homepage_modal-header">
                    <input
                      type="text"
                      placeholder="Search airport..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="homepage_modal-input"
                    />
                    <button
                      onClick={() => setIsAirportListModalOpen(false)}
                      className="homepage_modal-close-btn"
                    >
                      Close
                    </button>
                  </div>
                  <div className="homepage_modal-body">
                    {airports.length > 0 ? (
                      airports.map((airport) => (
                        <div
                          key={airport.id}
                          className="homepage_airport-item"
                          onClick={() => handleSelectAirport(airport)}
                        >
                          <strong>{airport.name}</strong> (
                          {airport.iataCode || "N/A"}-{" "}
                          {airport.address.cityName}, )
                        </div>
                      ))
                    ) : (
                      <p className="homepage_no-results">No airports found.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Second row of the card */}
          <div className="homepage_card-row">
            {/* Departure Date Card */}

            <div
              className="homepage_card"
              onClick={() => openCalendar("departure")}
            >
              <div className="homepage_card-heading">Departure Date</div>
              <div className="homepage_card-body">
                <div className="homepage_card-body_span">
                  {/* Calendar Icon on the left */}
                  <LuCalendar1 className="calendar_Icon" />

                  {/* Date or placeholder */}
                  <span className="date-display">
                    {departureDate
                      ? formatDate(new Date(departureDate))
                      : "Select Date"}
                  </span>
                </div>
              </div>
            </div>

            {/* Return Date Card (only if round-trip) */}
            {selectedTrip === "round-trip" || selectedTrip === "one-way" ? (
              <div
                id="Return_date_card"
                className={`homepage_card ${
                  selectedTrip === "one-way" ? "disabled" : ""
                }`} // Add 'disabled' class if one-way
                onClick={() => {
                  if (selectedTrip === "one-way") {
                    // Show alert for one-way trip
                    alert("Return date is only applicable for a round-trip.");
                  } else {
                    // Open calendar for round-trip
                    openCalendar("return");
                  }
                }}
              >
                <div className="homepage_card-heading">Return Date</div>
                <div className="homepage_card-body">
                  <div className="homepage_card-body_span">
                    {/* Calendar Icon on the left */}
                    <LuCalendar1 className="calendar_Icon" />

                    {/* Date or placeholder */}
                    <span className="date-display">
                      {returnDate
                        ? formatDate(new Date(returnDate))
                        : "Select Date"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Calendar Modal */}
            {isCalendarOpen && (
              <>
                {/* Overlay */}
                <div
                  className="homepage_Calendarmodal-overlay"
                  onClick={() => setIsCalendarOpen(false)} // Close modal when clicking outside
                ></div>
                <div className="calendar-modal">
                  <div className="calendar-header">
                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="close-btn"
                    >
                      Close
                    </button>
                  </div>
                  <div className="calendar-nav">
                    <button onClick={handlePreviousMonth}>Prev</button>
                    <h3>{format(currentMonth, "MMMM yyyy")}</h3>
                    <button onClick={handleNextMonth}>Next</button>
                  </div>
                  <div className="calendar-body">
                    <div className="calendar-weekdays">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div key={day} className="calendar-weekday">
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    <div className="calendar-days">
                      {generateDays(currentMonth).map((day) => {
                        const dayString = format(day, "yyyy-MM-dd");
                        const isSelectedDeparture =
                          departureDate &&
                          isSameDay(new Date(departureDate), day);
                        const isSelectedReturn =
                          returnDate && isSameDay(new Date(returnDate), day);
                        const isPast = isBefore(day, new Date());
                        const isCurrentMonth =
                          format(day, "yyyy-MM") ===
                          format(currentMonth, "yyyy-MM");

                        return (
                          <div
                            key={dayString}
                            className={`calendar-day ${
                              isSelectedDeparture ? "selected-departure" : ""
                            } ${isSelectedReturn ? "selected-return" : ""} ${
                              isPast ? "greyed-out" : ""
                            } ${!isCurrentMonth ? "empty" : ""}`}
                            onClick={() =>
                              !isPast && isCurrentMonth && handleDateSelect(day)
                            } // Only allow selecting days of the current month
                          >
                            <span>{format(day, "d")}</span>
                            {renderPrice(day)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Travelers Card */}
            <div
              className="homepage_card"
              onClick={() => setShowTravelersModal(true)}
            >
              <div className="homepage_card-heading">Travelers</div>
              <div className="homepage_card-body">
                <span className="homepage_card-body_span">{`Adults: ${adults}, Children: ${children}, Infants: ${infants}`}</span>
              </div>
            </div>

            {/* Class Selection Card */}
            <div
              className="homepage_card"
              id="Select_class_card"
              onClick={openClassModal}
            >
              <div className="homepage_card-heading">Class</div>
              <div className="homepage_card-body">
                <span className="homepage_card-body_span">
                  {selectedClass || "Select Class"}
                </span>
              </div>
            </div>

            {/* Travelers Modal */}
            {showTravelersModal && (
              <div className="homepage_traveller_modal">
                <div className="homepage_traveller_modal-content">
                  <label className="homepage_traveller_modal-content_label">
                    <span className="label-text">Adults:</span>
                    <div className="button-group">
                      <button onClick={() => decrement("adults")}>-</button>
                      <span>{adults}</span>
                      <button onClick={() => increment("adults")}>+</button>
                    </div>
                  </label>
                  <label className="homepage_traveller_modal-content_label">
                    <span className="label-text">Children:</span>
                    <div className="button-group">
                      <button onClick={() => decrement("children")}>-</button>
                      <span>{children}</span>
                      <button onClick={() => increment("children")}>+</button>
                    </div>
                  </label>
                  <label className="homepage_traveller_modal-content_label">
                    <span className="label-text">Infants:</span>
                    <div className="button-group">
                      <button onClick={() => decrement("infants")}>-</button>
                      <span>{infants}</span>
                      <button onClick={() => increment("infants")}>+</button>
                    </div>
                  </label>
                  <button
                    className="homepage_traveller_modal-content_button"
                    onClick={() => setShowTravelersModal(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Class Modal */}
            {showClassModal && (
              <div className="homepage_Class_modal">
                <div className="homepage_Class_modal-content">
                  <label className="homepage_Class_modal-content_label">
                    <input
                      type="radio"
                      name="class"
                      value="business"
                      onChange={() => closeClassModal("Business")}
                    />{" "}
                    <span>Business</span>
                  </label>
                  <label className="homepage_Class_modal-content_label">
                    <input
                      type="radio"
                      name="class"
                      value="economy"
                      onChange={() => closeClassModal("Economy")}
                    />{" "}
                    <span>Economy</span>
                  </label>
                  <label className="homepage_Class_modal-content_label">
                    <input
                      type="radio"
                      name="class"
                      value="first"
                      onChange={() => closeClassModal("First")}
                    />{" "}
                    <span>First</span>
                  </label>
                  <button onClick={() => setShowClassModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* bottom content */}
        <div className="homepage_select_option-row-container">
          {/* Left Side */}
          <div className="homepage_select_option-left-side">
            <div className="homepage_select_option-option">
              <input
                type="checkbox"
                id="student"
                checked={selectedOption === "student"}
                onChange={() => handleOptionChange("student")}
              />
              <label htmlFor="student">Student</label>
            </div>
            <div className="homepage_select_option-option">
              <input
                type="checkbox"
                id="senior-citizen"
                checked={selectedOption === "senior-citizen"}
                onChange={() => handleOptionChange("senior-citizen")}
              />
              <label htmlFor="senior-citizen">Senior Citizen</label>
            </div>
            <div className="homepage_select_option-option">
              <input
                type="checkbox"
                id="armed-force"
                checked={selectedOption === "armed-force"}
                onChange={() => handleOptionChange("armed-force")}
              />
              <label htmlFor="armed-force">Armed Force</label>
            </div>
          </div>

          {/* Right Side */}
          <div className="homepage_select_option-right-side">
            <button
              className="homepage_select_option-search-button"
              onClick={handlesearchFlightsbutton}
            >
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
