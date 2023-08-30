export function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
}
