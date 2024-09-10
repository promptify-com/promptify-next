// Font
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500"],
});
const typography = {
  fontFamily: poppins.style.fontFamily,
};

export default typography;
