import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll to top on route change, but preserve scroll on back/forward navigation
// so pages like /companies can restore their previous scroll position.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;