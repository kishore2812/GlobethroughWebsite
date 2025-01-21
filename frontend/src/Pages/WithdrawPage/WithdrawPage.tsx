import { useState } from "react";
import "./withdrawPage.scss";
import Header from "../../Components/Header/Header";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  return (
    <div className="WithdrawPage">
      <div className="WithdrawPage__background"></div>
      <Header />
      <h1>Withdraw Funds</h1>
      <form>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="accountNumber">Account Number:</label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Withdraw</button>
      </form>
    </div>
  );
};

export default Withdraw;
