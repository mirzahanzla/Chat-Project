import React, { useState, useEffect } from 'react';

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

      const response = await fetch('api/uploadVerificationAttachment', {
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Settings</h2>
      <div style={styles.optionContainer}>
        <p style={styles.optionText}>Verify ID</p>
        <button 
          style={styles.verifyButton} 
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
                style={styles.sendButton}
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
            <p style={styles.successMessage}>Attachment uploaded successfully!</p>
          ) : (
            <p style={styles.errorMessage}>Failed to upload attachment. Please try again.</p>
          )}
        </div>
      )}
      
      {verificationStatus?.uploaded && !canUpload && (
        <div style={styles.uploadStatus}>
          <p style={styles.infoMessage}>Your verification is in progress, you cannot upload a new image.</p>
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

export default Settings;