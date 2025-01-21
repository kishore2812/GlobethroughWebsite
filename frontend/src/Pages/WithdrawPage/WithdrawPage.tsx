import { useState } from "react";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleWithdraw = (e) => {
    e.preventDefault();
    // Logic to handle withdrawal can go here
    console.log("Withdrawal Request:", { amount, accountNumber });
  };

  return (
    <div>
      <h1>Withdraw Funds</h1>
      <form onSubmit={handleWithdraw}>
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
