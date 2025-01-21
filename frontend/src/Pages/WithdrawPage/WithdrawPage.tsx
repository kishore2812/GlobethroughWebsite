import { useState } from "react";
import "./withdrawPage.scss";
import Header from "../../Components/Header/Header";
import { CiCirclePlus } from "react-icons/ci";

const Withdraw = () => {
  const [amount, setAmount] = useState("");

  return (
    <div className="withdraw-page">
      <div className="withdraw-page-background"></div>
      <Header />

      <div className="withdraw-page-cards">
        {/* First Card */}
        <div className="withdraw-page-card">
          <div className="withdraw-page-card-section wallet-balance">
            <span>Wallet Balance</span>
            <span>₹14587</span>
          </div>
          <div className="withdraw-page-card-section smaller-text">
            <span>Total Withdrawal Amount</span>
            <span>₹14000</span>
          </div>
          <div className="withdraw-page-card-section smaller-text">
            <span>Incentive Claims</span>
            <span>₹587</span>
          </div>
          <div className="withdraw-page-input-section">
            <div className="input-withdraw-container">
              <input
                type="number"
                id="withdrawAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter The amount"
              />
              <button type="button" className="withdraw-button">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="withdraw-page-card">
          <div className="withdraw-page-credit-card-placeholder">
            <CiCirclePlus className="plus-icon" />
            <p>Add Credit Card</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
