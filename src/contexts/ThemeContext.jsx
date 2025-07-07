import { ThemeProvider } from "@material-tailwind/react";
import { lightTheme } from "../theme";

const ThemeContext = ({ children }) => {
  return (
    <ThemeProvider value={lightTheme}>
      <div className="bg-white text-gray-900">{children}</div>
    </ThemeProvider>
  );
};

export default ThemeContext;