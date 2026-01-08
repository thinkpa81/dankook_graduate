import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Notices from "@/pages/Notices";
import Papers from "@/pages/Papers";
import Regulations from "@/pages/Regulations";
import TalentPool from "@/pages/TalentPool";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/notices" component={Notices} />
      <Route path="/notices/:id" component={Notices} />
      <Route path="/papers" component={Papers} />
      <Route path="/papers/:category" component={Papers} />
      <Route path="/regulations" component={Regulations} />
      <Route path="/talent-pool" component={TalentPool} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;