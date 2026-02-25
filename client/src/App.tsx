import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Lenders from "./pages/Lenders";
import Marketing from "./pages/Marketing";
import Contracts from "./pages/Contracts";
import Course from "./pages/Course";
import Blog from "./pages/Blog";
import Manual from "./pages/Manual";
import Listings from "./pages/Listings";

function Router() {
  return (
    <SiteLayout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/analyzer"} component={Analyzer} />
        <Route path={"/lenders"} component={Lenders} />
        <Route path={"/marketing"} component={Marketing} />
        <Route path={"/contracts"} component={Contracts} />
        <Route path={"/course"} component={Course} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/manual"} component={Manual} />
        <Route path={"/listings"} component={Listings} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
