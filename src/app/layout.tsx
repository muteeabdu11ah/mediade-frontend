import type { Metadata } from "next";
import ThemeProvider from "@/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Aeyron Medical - Modern Healthcare Management",
  description: "Connect with top doctors, book appointments seamlessly, and manage your healthcare journey with Aeyron Medical's intelligent platform.",
  keywords: "healthcare, medical, appointments, doctors, clinic management, patient portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
