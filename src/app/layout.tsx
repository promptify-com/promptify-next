import { ReactNode } from "react";
import "@/styles/globals.css";
// Mui
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ThemeConfig from "@/_theme";
// Redux
import ReduxProvider from "@/_redux";
// Sooner
// import { Toaster } from "sonner";

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <html>
        <body>
          <AppRouterCacheProvider>
            <ThemeConfig>
              {/* <Toaster richColors />  */}
              {children}
            </ThemeConfig>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ReduxProvider>
  );
}
