
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const TRACKING_ID = "G-7L3YFHZ4QT"; 

ReactGA.initialize(TRACKING_ID);

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);
};

export default usePageTracking;
