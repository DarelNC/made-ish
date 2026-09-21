import { Archivo_Black, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { profile } from "@/content/site";
import { DEFAULT_THEME, themeInitScript } from "@/lib/themes";
import "./globals.css";
import "./themes.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: "italic",
  weight: ["700", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: `${profile.headline.join(" ")} / ${profile.brand}`,
  description: profile.bio,
};

export default function RootLayout({ children }) {
  return (
    // The inline script picks the theme before first paint, so the attribute
    // it sets legitimately differs from what the server rendered.
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      {/* Browser extensions (Dark Reader, Grammarly, ColorZilla) add attributes to <body> before React
          loads. This body has none of its own, so silencing its attribute check hides nothing real. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
