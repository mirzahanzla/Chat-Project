import React from 'react'

const Company = ({color}) => {
  return (
    <>
    
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6l9 6m-1.5 12V10.333A48.4 48.4 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12z" />
</svg>
    </>
  )
}

export default Company