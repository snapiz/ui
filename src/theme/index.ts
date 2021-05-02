import { extendTheme } from "@chakra-ui/react";
import styles from "./styles";

export default extendTheme({
  styles,
  fonts: {
    body: "'Montserrat', Helvetica, Arial, serif",
    heading: "'Montserrat', Helvetica, Arial, serif",
    mono: "'Montserrat', Helvetica, Arial, serif",
  },
  colors: {
    primary: "#7367f0",
    secondary: "#82868b",
  },
});
