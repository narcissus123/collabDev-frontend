import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import ScrollToTopButton from "./ScrollToTopButton/ScrollToTopButton";

interface LayoutProps {
  footer?: boolean;
  header?: boolean;
}

export default function Layout({ header, footer }: LayoutProps) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {header && <Header />}
      <Box component="main" flexGrow={1}>
        <Outlet />
      </Box>
      {footer && <Footer />}
      <ScrollToTopButton />
    </Box>
  );
}
