import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FetchDataUser from '../../../Table/FetchDataUser';
import Cookies from 'js-cookie';

const UserSetting = ({ onCloseIssue }) => {
    const [isSupportOpen, setIsSupportOpen] = useState(true);
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

            if (!accountID) {
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

    const slideIn = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1 },
        exit: { x: '100%', opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isSupportOpen && (
                <div className='bg-neutral-300/65 z-20 absolute right-0 w-full h-full'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideIn}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-end items-start h-full z-10">
                            <div className="bg-white p-4 lg:w-[700px] h-screen overflow-auto">
                                <div className="hover:cursor-pointer" onClick={() => {
                                    onCloseIssue(false);
                                    setIsSupportOpen(false);
                                }}>
                                    <img src="/Svg/Close.svg" alt="Close" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="justify-center flex text-center py-2 cursor-pointer w-[150px] font-bold poppins-semibold">
                                        <p>Setting </p>
                                    </div>
                                  
                                </div>
                                {/*add start  */}

                                <Settings/>
                                {/* add finish */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

        </AnimatePresence>
    );
};

const Settings = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);  // Store the verification status

  // Fetch verification status when the component mounts
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');  // Assuming the token is stored in localStorage
        const response = await fetch('/api/getVerificationStatus', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setVerificationStatus(result.verificationStatus);
        } else {
          alert(result.message || 'Failed to fetch verification status');
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
        alert('An error occurred while fetching the verification status');
      }
    };

    fetchVerificationStatus();
  }, []);

  // Function to handle the file change (ensure it's an image)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAttachment(file);
    } else {
      alert('Only image files are allowed');
    }
  };

  // Function to handle the file upload
  const handleSendClick = async () => {
    if (!attachment) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('verifyAttachment', attachment);

    try {
      const token = localStorage.getItem('authToken');  // Assuming the token is stored in localStorage

      const response = await fetch('/api/uploadVerificationAttachment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
        alert('Attachment uploaded successfully!');
      } else {
        setUploadSuccess(false);
        alert(result.message || 'Failed to upload attachment');
      }
    } catch (error) {
      setUploadSuccess(false);
      console.error('Error uploading attachment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsUploading(false);
      setAttachment(null);
      setShowUpload(false);
    }
  };

  // If verification is in progress, do not allow uploading
  const canUpload = verificationStatus && !verificationStatus.uploaded;

  return (
    <div >
   
      <div className='flex justify-center flex-col space-y-5 items-center' >
        <p style={styles.optionText}>Verify ID</p>
        <button 
         className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[250px] "
          onClick={() => setShowUpload(true)} 
          disabled={!canUpload}
        >
          {verificationStatus?.uploaded ? 'Verification in Progress' : 'Verify Now'}
        </button>
      </div>

      {verificationStatus?.imageUrl && !verificationStatus.uploaded && (
        <div style={styles.uploadStatus}>
          <img
            src={verificationStatus.imageUrl}
            alt="Uploaded Verification Image"
            style={styles.uploadedImage}
          />
          <p>Your verification image has been uploaded.</p>
        </div>
      )}

      {showUpload && canUpload && (
        <div style={styles.uploadContainer}>
          <input
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={isUploading}
          />
          {attachment && (
            <div style={styles.previewContainer}>
              <p style={styles.previewText}>Attachment Preview:</p>
              <img
                src={URL.createObjectURL(attachment)}
                alt="Attachment Preview"
                style={styles.previewImage}
              />
              <button
                className="OrangeButtonWithText-v4 justify-center flex text-center py-2 cursor-pointer w-[150px]"
                onClick={handleSendClick}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Send'}
              </button>
            </div>
          )}
        </div>
      )}

      {uploadSuccess !== null && (
        <div style={styles.uploadStatus}>
          {uploadSuccess ? (
            <p className='text-green-500'>Attachment uploaded successfully!</p>
          ) : (
            <p className='text-red-500'>Failed to upload attachment. Please try again.</p>
          )}
        </div>
      )}
      
      {verificationStatus?.uploaded && !canUpload && (
        <div >
          <p className='text-orange-400 text-center mt-5'>Your verification is in progress, you cannot upload a new image.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    height: '100vh',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '300px',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  optionText: {
    fontSize: '18px',
  },
  verifyButton: {
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  uploadContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fileInput: {
    marginBottom: '10px',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px',
  },
  previewText: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  previewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  sendButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  uploadedImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  uploadStatus: {
    marginTop: '20px',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
  },
  errorMessage: {
    color: 'red',
  },
  infoMessage: {
    color: 'orange',
  },
};



export default UserSetting;
