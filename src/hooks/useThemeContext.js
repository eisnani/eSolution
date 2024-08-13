import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error ('Theme context must be use within the ThemeContextProvider')

  return context;
}