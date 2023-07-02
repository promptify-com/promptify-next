import "@/styles/globals.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { theme } from "@/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
