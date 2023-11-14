export const getDeviceType = (ua: string | null) => {
  const isMobile = ua?.match(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|mobile|netfront|opera m(ob|in)i|phone/i,
  );

  return isMobile ? "mobile" : "desktop";
};
