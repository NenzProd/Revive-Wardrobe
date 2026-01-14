
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Custom colors for REVIVE WARDROBE
				revive: {
					'red': '#C10000',
					'black': '#1A1A1A',
					'white': '#FFFFFF',
					'gold': '#E5C07B',
					'blush': '#F5D3D3',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'serif': ['Playfair Display', 'Georgia', 'serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'playfair': ['Playfair Display', 'Georgia', 'serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'flip-vertical': {
					'0%, 35%': { transform: 'rotateX(0deg)' },
					'50%, 85%': { transform: 'rotateX(180deg)' },
					'100%': { transform: 'rotateX(360deg)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'zoom-pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				'spin-slow': {
					'from': { transform: 'rotate(0deg)' },
					'to': { transform: 'rotate(360deg)' }
				},
				'clockwise-glow': {
					'0%': { boxShadow: '0 -5px 15px -5px #ef4444' },     /* Top */
					'25%': { boxShadow: '5px 0 15px -5px #ef4444' },      /* Right */
					'50%': { boxShadow: '0 5px 15px -5px #ef4444' },      /* Bottom */
					'75%': { boxShadow: '-5px 0 15px -5px #ef4444' },     /* Left */
					'100%': { boxShadow: '0 -5px 15px -5px #ef4444' }     /* Top */
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out',
				'flip-vertical': 'flip-vertical 8s infinite ease-in-out',
				'slide-in-left': 'slide-in-left 1s ease-out forwards',
				'zoom-pulse': 'zoom-pulse 2s infinite ease-in-out',
				'spin-slow': 'spin-slow 4s linear infinite',
				'clockwise-glow': 'clockwise-glow 3s linear infinite',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		plugin(function ({ addUtilities }) {
			addUtilities({
				".perspective-1000": {
					perspective: "1000px",
				},
				".transform-style-3d": {
					transformStyle: "preserve-3d",
				},
				".backface-hidden": {
					backfaceVisibility: "hidden",
				},
				".rotate-x-180": {
					transform: "rotateX(180deg)",
				},
			});
		}),
	],
} satisfies Config;
