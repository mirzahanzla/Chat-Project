import  { useState, useEffect } from 'react';

// Define the breakpoints
const breakpoints = {
  xs: '490px',
  sm: '640px',
  mdm: '768px',
  md: '900px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Custom hook to get the current screen size
const useCurrentScreenSize = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    const mediaQueries = Object.keys(breakpoints).map((key) => {
      const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[key]})`);
      const handleChange = () => setScreenSize(getScreenSize());
      mediaQuery.addListener(handleChange);
      return { key, mediaQuery, handleChange };
    });

    // Cleanup function to remove event listeners
    return () => {
      mediaQueries.forEach(({ mediaQuery, handleChange }) => {
        mediaQuery.removeListener(handleChange);
      });
    };
  }, []);

  return screenSize;
};

// Helper function to get the current screen size
const getScreenSize = () => {
  const width = window.innerWidth;
  if (width >= parseInt(breakpoints['2xl'])) return '2xl';
  if (width >= parseInt(breakpoints.xl)) return 'xl';
  if (width >= parseInt(breakpoints.lg)) return 'lg';
  if (width >= parseInt(breakpoints.md)) return 'md';
  if (width >= parseInt(breakpoints.mdm)) return 'mdm';
  if (width >= parseInt(breakpoints.sm)) return 'sm';
  if (width >= parseInt(breakpoints.xs)) return 'xs';
  return 'base';
};

// React component to display the current screen size
const ScreenSizeDisplay = () => {
  const screenSize = useCurrentScreenSize();

  return (
    <div>
      <h1>Current Screen Size: {screenSize}</h1>
    </div>
  );
};

export default ScreenSizeDisplay;
