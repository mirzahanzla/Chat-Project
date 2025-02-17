import { useState, useEffect } from 'react';

const Search = () => {
  const [earnings, setEarnings] = useState(0);
  const [paymentAccount, setPaymentAccount] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  // const [bankAccountNumber, setBankAccountNumber] = useState(''); 
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountID, setAccountID] = useState("");

  const fetchData = async () => {
    const authToken = localStorage.getItem('authToken');

    try {
      // Fetch payment accounts
      const accountsResponse = await fetch('/api/getPaymentAccounts', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      console.log("Accounts: ", accountsResponse.accounts);
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        console.log("Accounts: ", accountsData.accounts);
        setAccountID(accountsData.accounts._id);
        setAccounts(accountsData.accounts);
      } else {
        setMessage('Failed to fetch payment accounts. Please try again.');
      }

      // Fetch earnings
      const earningsResponse = await fetch('/api/getEarnings', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData.earnings || 0);
      } else {
        setMessage('Failed to fetch earnings.');
      }
    } catch (error) {
      setMessage('An error occurred while fetching data.');
    }
  };

  // Fetch payment accounts and earnings on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPaymentAccount = async () => {
    // Check if all fields are filled first
    if (!paymentAccount || !accountHolderName || !bankName) {
        setMessage('Please fill in all fields to add the payment account.');
        return;
    }

    // Validate Account Holder Name (should only contain letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(accountHolderName)) {
        setMessage('Account holder name should only contain letters and spaces.');
        return;
    }

    // Validate Account Holder Name length (at least 8 characters)
    if (accountHolderName.length < 8) {
        setMessage('Account holder name must be at least 8 characters long.');
        return;
    }

    // Validate Bank Name (ensure a bank is selected)
    if (!bankName) {
        setMessage('Please select a bank.');
        return;
    }

    // Validate Payment Account Number (must be exactly 16 digits and contain only numbers)
    const accountNumberRegex = /^\d{16}$/;
    if (!accountNumberRegex.test(paymentAccount)) {
        setMessage('Payment account number must be exactly 16 digits with no letters.');
        return;
    }

    const newAccount = { paymentAccount, accountHolderName, bankName };

    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setMessage('Authentication token is missing. Please log in.');
            return;
        }

        const response = await fetch('/api/addPaymentAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(newAccount),
        });

        if (response.status === 201) {
            const result = await response.json();
            console.log("Account: added :", result.newPaymentAccount);
            console.log("Account ID: ", result.newPaymentAccount._id);
            
            setAccounts((prevAccounts) => [...prevAccounts, result.newPaymentAccount]); // use the data from the response
            setMessage(`Payment account ${paymentAccount} added successfully.`);
            
            // Reset the form fields
            setPaymentAccount('');
            setAccountHolderName('');
            setBankName('');
            setAccountID(result.newPaymentAccount[0]._id);
        } else {
            const errorData = await response.json();
            setMessage(errorData.message || 'Failed to add payment account. Please try again.');
        }
    } catch (error) {
        console.error(error);
        setMessage('An error occurred while adding the payment account.');
    }
  };

  useEffect(() => {
    const selected = accounts.find(acc => acc.paymentAccount === selectedAccount);
    if (selected) setAccountID(selected._id);
  }, [selectedAccount, accounts]);  

  const handleRequestWithdrawal = () => {
    if (withdrawalAmount && selectedAccount) {
      const amount = parseFloat(withdrawalAmount);
  
      // Check if the withdrawal amount is less than $10
      if (amount < 10) {
        setMessage("Withdrawal amount must be at least $10.");
        return;
      }
  
      // Check if the withdrawal amount is greater than available earnings
      if (amount > earnings) {
        setMessage("Withdrawal amount can't be greater than available earnings.");
        return;
      }

      if(!accountID){
        alert("There is no account ID found");
        return;
      }
  
      // Prepare the request data
      const requestData = {
        accountID: accountID, // Use the selected account's _id
        amount: amount,
      };
  
      // Use Fetch API to make the request
      fetch('/api/addWithdrawalRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Pass the auth token from localStorage
        },
        body: JSON.stringify(requestData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // Handle the successful response
        setMessage(`Withdrawal request of $${withdrawalAmount} submitted successfully to ${selectedAccount}.`);
        setWithdrawalAmount(''); // Clear the input field
        fetchData();
      })
      .catch(error => {
        // Handle any errors
        setMessage('An error occurred while submitting the withdrawal request: ' + error.message);
      });
    } else {
      setMessage('Please enter a valid amount for withdrawal and select an account.');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      {/* Display Earnings */}
      <div className="text-center text-2xl font-semibold text-green-700 mb-4">
        Earnings: ${earnings}
      </div>

      <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Request Payment Withdrawal</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {accounts.length < 1 ? (
          <>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Account Holder Name:</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter your account holder name"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Select Bank:</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">-- Select Bank --</option>
                <option value="Faysal Bank">Faysal Bank</option>
                <option value="HBL Limited Bank">HBL Limited Bank</option>
                <option value="Alphala Bank">Alphala Bank</option>
                <option value="Habib Bank">Habib Bank</option>
                <option value="Allied Bank">Allied Bank</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Payment Account Number:</label>
              <input
                type="text"
                value={paymentAccount}
                onChange={(e) => setPaymentAccount(e.target.value)}
                placeholder="Enter your payment account number"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={handleAddPaymentAccount}
                className="bg-blue-600 text-white p-3 mt-2 w-full rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Payment Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Select Payment Account:</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">-- Select Account --</option>
                {accounts.map((account) => (
                  <option key={account.paymentAccount} value={account.paymentAccount}>
                    {account.paymentAccount}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {accounts.length > 0 && (
          <>
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Withdrawal Amount:</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter withdrawal amount"
                className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              onClick={handleRequestWithdrawal}
              className="bg-green-600 text-white p-3 w-full rounded-md hover:bg-green-700 transition duration-200"
            >
              Request Withdrawal
            </button>
          </>
        )}

        {message && (
          <div className="text-center text-red-600 mt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Search;