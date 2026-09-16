import React from "react";

const { useState, useEffect, useCallback } = React;

/** Reads the current hash route as ["shop", "men"] style segments. */
function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const segments = hash.split("/").filter(Boolean);
  return segments.length ? segments : ["home"];
}

/** Minimal hash-based router hook — no dependencies, no build step required. */
export function useHashRoute() {
  const [route, setRoute] = useState(readRoute());

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path.startsWith("/") ? path : `/${path}`;
  }, []);

  return [route, navigate];
}
