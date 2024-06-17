import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This component leads users to the top of the page when they navigate to another page using link.
export default function scrollToTopUtility() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
