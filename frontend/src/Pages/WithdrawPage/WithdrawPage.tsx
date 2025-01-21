import { useState } from "react";
import "./withdrawPage.scss";
import Header from "../../Components/Header/Header";

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
            <span>$1000</span>
          </div>
          <div className="withdraw-page-card-section smaller-text">
            <span>Total Withdrawal Amount</span>
            <span>$500</span>
          </div>
          <div className="withdraw-page-card-section smaller-text">
            <span>Incentive Claims</span>
            <span>$100</span>
          </div>
          <div className="withdraw-page-input-section">
            <label htmlFor="withdrawAmount">Enter Amount to Withdraw</label>
            <input
              type="number"
              id="withdrawAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Withdraw Amount"
            />
          </div>
        </div>

        {/* Second Card */}
        <div className="withdraw-page-card">
          <div className="withdraw-page-credit-card-placeholder"></div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
