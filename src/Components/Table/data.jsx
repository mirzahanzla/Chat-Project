const STATUS_PENDING = { id: 1, name: "Pending", };
const STATUS_IN_REVIEW = { id: 2, name: "In Review",};
const STATUS_RESOLVED = { id: 3, name: "Resolved", };

export const STATUSES = [
  STATUS_PENDING,
  STATUS_IN_REVIEW,
  STATUS_RESOLVED,
];

export const DATA = [
  {
    id:1,
    user: { name: "Alice Johnson", username: "@alice",  img:'p1.jpg' },
    issue: "Contract",
    time: new Date("2023-08-25 09:00:00").toLocaleTimeString(),
    description: "User cannot login with correct credentials.",
    attachment: "/Media/p1.jpg",
    status: STATUS_PENDING,
  
  },
  {
    id:2,
    user: { name: "Bob Smith", username: "@bob",  img:'p2.jpg' },
    issue: "Payment",
    time: new Date("2023-08-25 10:30:00").toLocaleTimeString(),
    description: "Payment not processed after submission.",
    attachment: "invoice2.pdf",
    status: STATUS_IN_REVIEW,
      
  },
  {
    id:3,
    user: { name: "Catherine Lee", username: "@catherine" , img:'p3.jpg'},
    issue: "Account",
    time: new Date("2023-08-25 11:45:00").toLocaleTimeString(),
    description: "Unable to reset password.",
    attachment: "password_reset.png",
    status: STATUS_PENDING,
       
  },
  {
    id:4,
    user: { name: "Daniel Kim", username: "@daniel" , img:'p4.jpg'},
    issue: "Contract",
    time: new Date("2023-08-25 12:00:00").toLocaleTimeString(),
    description: "Contract terms are incorrect.",
    attachment: "contract_terms.docx",
    status: STATUS_RESOLVED,
       
  },
  {
    id:5,
    user: { name: "Eva Green", username: "@eva" , img:'p5.jpg'},
    issue: "Technical",
    time: new Date("2023-08-25 13:15:00").toLocaleTimeString(),
    description: "Website is down.",
    attachment: "error_log.txt",
    status: STATUS_PENDING,
       
  },
  {
    id:6,
    user: { name: "Frank Wright", username: "@frank" , img:'p6.jpg'},
    issue: "Payment",
    time: new Date("2023-08-25 14:00:00").toLocaleTimeString(),
    description: "Overcharged on last invoice.",
    attachment: "invoice3.pdf",
    status: STATUS_IN_REVIEW,
       
  },
  {
    id:7,
    user: { name: "Grace Brown", username: "@grace" ,  img:'p7.jpg'},
    issue: "Account",
    time: new Date("2023-08-25 14:45:00").toLocaleTimeString(),
    description: "Account locked after multiple login attempts.",
    attachment: "login_issue.png",
    status: STATUS_PENDING,
      
  },
  {
    id:8,
    user: { name: "Henry Davis", username: "@henry" , img:'p8.jpg'},
    issue: "Technical",
    time: new Date("2023-08-25 15:30:00").toLocaleTimeString(),
    description: "Unable to upload files.",
    attachment: "upload_error.png",
    status: STATUS_RESOLVED,
       
  },
  {
    id:1,
    user: { name: "Ivy Scott", username: "@ivy" ,   img:'p9.jpg'},
    issue: "Contract",
    time: new Date("2023-08-25 16:00:00").toLocaleTimeString(),
    description: "Contract missing signature field.",
    attachment: "contract_missing_signature.pdf",
    status: STATUS_IN_REVIEW,
     
  },
  {
    id:1,
    user: { name: "Jack Evans", username: "@jack",    img:'p10.jpg' },
    issue: "Payment",
    time: new Date("2023-08-25 17:00:00").toLocaleTimeString(),
    description: "Refund not processed.",
    attachment: "refund_issue.pdf",
    status: STATUS_PENDING,
    
  },
  {
    id:1,
    user: { name: "Kelly Martin", username: "@kelly" ,  img:'p1.jpg'},
    issue: "Technical",
    time: new Date("2023-08-26 08:30:00").toLocaleTimeString(),
    description: "System slow during peak hours.",
    attachment: "performance_issue.log",
    status: STATUS_PENDING,
      
  },
  {
    id:1,
    user: { name: "Leo Turner", username: "@leo",    img:'p12.jpg' },
    issue: "Account",
    time: new Date("2023-08-26 09:00:00").toLocaleTimeString(),
    description: "Email verification failed.",
    attachment: "email_verification.png",
    status: STATUS_RESOLVED,
    
  },
  {
    id:1,
    user: { name: "Maria Young", username: "@maria",   img:'p1.jpg'},
    issue: "Payment",
    time: new Date("2023-08-26 09:30:00").toLocaleTimeString(),
    description: "Payment gateway not accepting card.",
    attachment: "payment_error.png",
    status: STATUS_IN_REVIEW,
     
  },
  {
    id:1,
    user: { name: "Nathan Clark", username: "@nathan" ,  img:'p2.jpg'},
    issue: "Technical",
    time: new Date("2023-08-26 10:00:00").toLocaleTimeString(),
    description: "File download corrupt.",
    attachment: "download_corrupt.zip",
    status: STATUS_PENDING,
      
  },
  {
    user: { name: "Olivia Baker", username: "@olivia",  img:'p3.jpg' },
    issue: "Account",
    time: new Date("2023-08-26 11:00:00").toLocaleTimeString(),
    description: "Account deactivated without notice.",
    attachment: "account_issue.png",
    status: STATUS_RESOLVED,
      
  },
  {
    user: { name: "Peter Harris", username: "@peter" ,img:'p1.jpg'},
    issue: "Contract",
    time: new Date("2023-08-26 11:30:00").toLocaleTimeString(),
    description: "Signed contract not saved.",
    attachment: "contract_issue.pdf",
    status: STATUS_PENDING,
        
  },
  {
    user: { name: "Quinn Adams", username: "@quinn",img:'p3.jpg' },
    issue: "Technical",
    time: new Date("2023-08-26 12:00:00").toLocaleTimeString(),
    description: "Website layout broken on mobile.",
    attachment: "mobile_issue.png",
    status: STATUS_IN_REVIEW,
    
  },
  {
    user: { name: "Rachel Nelson", username: "@rachel", img:'p4.jpg' },
    issue: "Payment",
    time: new Date("2023-08-26 12:30:00").toLocaleTimeString(),
    description: "Credit card declined.",
    attachment: "payment_issue.png",
    status: STATUS_RESOLVED,
       
  },
  {
    user: { name: "Sam Wilson", username: "@sam" ,    img:'p5.jpg'},
    issue: "Account",
    time: new Date("2023-08-26 13:00:00").toLocaleTimeString(),
    description: "Unable to update profile information.",
    attachment: "profile_issue.png",
    status: STATUS_PENDING,
    
  },
  {
    user: { name: "Tina Lewis", username: "@tina", img:'p1.jpg' },
    issue: "Technical",
    time: new Date("2023-08-26 13:30:00").toLocaleTimeString(),
    description: "App crashes on launch.",
    attachment: "crash_report.log",
    status: STATUS_IN_REVIEW,
       
  },
];


