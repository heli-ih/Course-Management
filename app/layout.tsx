import "@styles/globals.css";
import React, { ReactNode } from "react";
import { Providers } from "./providers";

// export const metadata = {
//   title: "Promptopia",
//   description: "Discover & Share AI Prompts",
// };

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="white">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
