import { createContext } from "react";

interface Theme {
    /** WhatsApp's primary green color */
    primary: string;
    /** WhatsApp's secondary green color, used for ticks and some buttons */
    secondary: string;
    /** Main background color */
    background: string;
    /** Surface color for cards and other elements */
    surface: string;
    /** Primary text color */
    textPrimary: string;
    /** Secondary text color */
    textSecondary: string;
    /** Color used for icons */
    icon: string;
    /** Color used for dividers */
    divider: string;
    /** Color of the status bar */
    statusBar: string;
    /** Color of the app bar */
    appBar: string;
    /** Accent color used for links and highlights */
    accent: string;
    /** Background color for outgoing chat bubbles */
    outgoingChat: string;
    /** Background color for incoming chat bubbles */
    incomingChat: string;
    /** Color or pattern for the chat background */
    chatBackground: string;
    /** Color indicating success or completion */
    success: string;
    /** Color indicating danger or errors */
    danger: string;
    /** Color indicating warnings */
    warning: string;
    /** Color for muted or less important text */
    muted: string;
}

const ThemeContext = createContext<Theme | undefined> (undefined);
export default ThemeContext;