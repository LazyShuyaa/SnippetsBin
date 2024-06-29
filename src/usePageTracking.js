
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const TRACKING_ID = "G-J69CSYXRBB"; 

ReactGA.initialize(TRACKING_ID);

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);
};

export default usePageTracking;
