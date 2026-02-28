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
import Listings from './pages/Listings';
import Pricing from './pages/Pricing';
import { lazy, Suspense } from "react";

const ScopeOfWork = lazy(() => import("./pages/ScopeOfWork"));
const SavedDeals = lazy(() => import("./pages/SavedDeals"));
const Disclaimers = lazy(() => import("./pages/Disclaimers"));
const Support = lazy(() => import("./pages/Support"));
const Checklists = lazy(() => import("./pages/Checklists"));
const CredibilityPackets = lazy(() => import("./pages/CredibilityPackets"));
const StateGuide = lazy(() => import("./pages/StateGuide"));
const Contractors = lazy(() => import("./pages/Contractors"));
const QuickCheck = lazy(() => import("./pages/QuickCheck"));
const SharedDealView = lazy(() => import("./pages/SharedDealView"));
const RenovationDesigner = lazy(() => import("./pages/RenovationDesigner"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const DealDetail = lazy(() => import("./pages/DealDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfitCalculator = lazy(() => import("./pages/ProfitCalculator"));
const PriceReductionForm = lazy(() => import("./pages/PriceReductionForm"));
const PrivateMoneyProspectus = lazy(() => import("./pages/PrivateMoneyProspectus"));
const ThreeOptionBrochure = lazy(() => import("./pages/ThreeOptionBrochure"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Shared deal view - standalone page without site layout */}
      <Route path="/shared/:shareId">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
          <SharedDealView />
        </Suspense>
      </Route>

      {/* All other routes with site layout */}
      <Route>
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
          <Route path={'/listings'} component={Listings} />
          <Route path={'/pricing'} component={Pricing} />
          <Route path={'/quick-check'} component={QuickCheck} />
          <Route path={"/checklists"} component={Checklists} />
          <Route path={"/credibility-packets"} component={CredibilityPackets} />
          <Route path={"/state-guide"} component={StateGuide} />
          <Route path={'/contractors'} component={Contractors} />
          <Route path={'/renovation-designer'} component={RenovationDesigner} />
          <Route path={'/portfolio'} component={Portfolio} />
          <Route path={'/pipeline'} component={Pipeline} />
          <Route path={'/pipeline/:id'} component={DealDetail} />
          <Route path={'/profile'} component={Profile} />
          <Route path={'/profit-calculator'} component={ProfitCalculator} />
          <Route path={'/price-reduction-form'} component={PriceReductionForm} />
          <Route path={'/private-money-prospectus'} component={PrivateMoneyProspectus} />
          <Route path={'/3-option-brochure'} component={ThreeOptionBrochure} />
          <Route path={"/support"} component={Support} />
          <Route path={"/disclaimers"} component={Disclaimers} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </SiteLayout>
      </Route>
    </Switch>
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
