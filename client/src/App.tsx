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
import { lazy, Suspense } from "react";

const ScopeOfWork = lazy(() => import("./pages/ScopeOfWork"));
const SavedDeals = lazy(() => import("./pages/SavedDeals"));
const Disclaimers = lazy(() => import("./pages/Disclaimers"));

function Router() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading...</div>}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/analyzer"} component={Analyzer} />
          <Route path={"/scope-of-work"} component={ScopeOfWork} />
          <Route path={"/saved-deals"} component={SavedDeals} />
          <Route path={"/lenders"} component={Lenders} />
          <Route path={"/marketing"} component={Marketing} />
          <Route path={"/contracts"} component={Contracts} />
          <Route path={"/course"} component={Course} />
          <Route path={"/blog"} component={Blog} />
          <Route path={"/manual"} component={Manual} />
          <Route path={"/listings"} component={Listings} />
          <Route path={"/disclaimers"} component={Disclaimers} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
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
