import React from "react";
import "./CancellationAndDateChange.scss";

const CancellationDateChangePolicy: React.FC = () => {
  return (
    <div className="cancellation__date-change__container">
      <h2>Cancellation & Date Change Policy</h2>
      <div className="cancellation__date-change__card cancellation__date-change__card--cancellation">
        <h3 className="cancellation__date-change__heading cancellation__date-change__heading--cancellation">
          Cancellation Policy
        </h3>
        <div className="cancellation__date-change__content cancellation__date-change__content--cancellation">
          <div className="cancellation__date-change__column cancellation__date-change__column--left">
            <p>Cancel between</p>
            <p>From now - 07 Nov, 19:30 (9:30)</p>
            <p>From now - 07 Nov, 19:30 (9:30)</p>
          </div>
          <div className="cancellation__date-change__column cancellation__date-change__column--center">
            <p>Refound Amount</p>
            <p>
              {" "}
              <strong>₹6000</strong>
            </p>
            <p>
              {" "}
              <strong>₹0000</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Date Change Card */}
      <div className="cancellation__date-change__card cancellation__date-change__card--date-change">
        <h3 className="cancellation__date-change__heading cancellation__date-change__heading--date-change">
          Date Change Policy
        </h3>
        <div className="cancellation__date-change__content cancellation__date-change__content--date-change">
          <div className="cancellation__date-change__column cancellation__date-change__column--left">
            <p>Cancel between</p>
            <p>From now - 07 Nov, 19:30 (9:30)</p>
            <p>From now - 07 Nov, 19:30 (9:30)</p>
          </div>
          <div className="cancellation__date-change__column cancellation__date-change__column--center">
            <p>Refound Amount</p>
            <p>
              {" "}
              <strong>₹6000</strong>
            </p>
            <p>
              {" "}
              <strong>₹0000</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationDateChangePolicy;
