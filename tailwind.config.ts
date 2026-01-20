import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    dark: "var(--primary-dark)",
                },
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                success: "var(--success)",
                danger: "var(--danger)",
                warning: "var(--warning)",
            },
            backgroundImage: {
                "gradient-primary": "var(--gradient-primary)",
                "gradient-secondary": "var(--gradient-secondary)",
                "gradient-hero": "var(--gradient-hero)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
                glow: "var(--shadow-glow)",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
