export function GetBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
}
