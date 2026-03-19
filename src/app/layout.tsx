import type { Metadata } from "next";
import ThemeProvider from "@/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Medaide - Modern Healthcare Management",
  description: "Connect with top doctors, book appointments seamlessly, and manage your healthcare journey with Medaide's intelligent platform.",
  keywords: "healthcare, medical, appointments, doctors, clinic management, patient portal",
  icons: {
    icon: '/logo2.svg',
  },
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
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
