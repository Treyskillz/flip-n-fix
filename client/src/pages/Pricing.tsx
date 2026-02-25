import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Check, Crown, Loader2, Sparkles, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { toast } from "sonner";

const PLAN_ICONS: Record<string, React.ElementType> = {
  free: Zap,
  pro: Sparkles,
  elite: Crown,
  team: Users,
};

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  const { data: plans } = trpc.subscription.plans.useQuery();
  const { data: subStatus } = trpc.subscription.status.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCheckout = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create checkout session");
    },
  });

  const createPortal = trpc.subscription.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to open billing portal");
    },
  });

  // Handle success/cancel URL params
  useEffect(() => {
    if (params.get("success") === "true") {
      toast.success(`Welcome to Freedom One ${params.get("plan")?.toUpperCase() || "Pro"}! Your subscription is now active.`);
    }
    if (params.get("canceled") === "true") {
      toast.info("Checkout was canceled. No charges were made.");
    }
  }, []);

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (planId === "free") return;
    createCheckout.mutate({
      plan: planId as "pro" | "elite" | "team",
      interval,
      origin: window.location.origin,
    });
  };

  const handleManage = () => {
    createPortal.mutate({ origin: window.location.origin });
  };

  const currentPlan = subStatus?.plan || "free";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] text-white">
        <div className="container py-16 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            Choose Your <span className="text-[oklch(0.65_0.18_18)]">Investment Plan</span>
          </h1>
          <p className="text-[oklch(0.6_0_0)] max-w-xl mx-auto mb-8">
            Unlock the full Freedom One system. Every plan includes our core deal analyzer.
            Upgrade anytime to access advanced tools, education, and team features.
          </p>

          {/* Interval Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[oklch(0.2_0_0)]">
            <button
              onClick={() => setInterval("month")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                interval === "month"
                  ? "bg-[oklch(0.48_0.20_18)] text-white"
                  : "text-[oklch(0.6_0_0)] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("year")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                interval === "year"
                  ? "bg-[oklch(0.48_0.20_18)] text-white"
                  : "text-[oklch(0.6_0_0)] hover:text-white"
              }`}
            >
              Yearly <span className="text-xs opacity-75">Save 17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans?.map((plan) => {
            const Icon = PLAN_ICONS[plan.id] || Zap;
            const isCurrentPlan = currentPlan === plan.id;
            const isHighlighted = plan.id === "pro";
            const price = interval === "year" ? plan.priceYearly : plan.priceMonthly;
            const displayPrice = price / 100;
            const monthlyEquivalent = interval === "year" ? Math.round(price / 12) / 100 : displayPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  isHighlighted
                    ? "border-[oklch(0.48_0.20_18)] shadow-lg shadow-[oklch(0.48_0.20_18)]/10 ring-1 ring-[oklch(0.48_0.20_18)]/20"
                    : "border-border/60"
                } ${isCurrentPlan ? "bg-[oklch(0.48_0.20_18)]/5" : "bg-card"}`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[oklch(0.48_0.20_18)] text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[oklch(0.55_0.18_145)] text-white text-xs font-semibold">
                    Current Plan
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${isHighlighted ? "bg-[oklch(0.48_0.20_18)]/15" : "bg-muted"}`}>
                      <Icon className={`w-4 h-4 ${isHighlighted ? "text-[oklch(0.48_0.20_18)]" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-5">
                  {plan.id === "free" ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">Free</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">${monthlyEquivalent.toFixed(0)}</span>
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </div>
                      {interval === "year" && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Billed ${displayPrice.toFixed(0)}/year
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isHighlighted ? "text-[oklch(0.48_0.20_18)]" : "text-[oklch(0.55_0.18_145)]"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {isCurrentPlan ? (
                  plan.id !== "free" ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleManage}
                      disabled={createPortal.isPending}
                    >
                      {createPortal.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  )
                ) : plan.id === "free" ? (
                  <Button variant="outline" className="w-full" disabled={currentPlan !== "free"}>
                    {currentPlan !== "free" ? "Included" : "Get Started"}
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      isHighlighted
                        ? "bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                        : ""
                    }`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={createCheckout.isPending}
                  >
                    {createCheckout.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {!isAuthenticated ? "Sign In to Subscribe" : "Subscribe"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Test mode notice */}
        <div className="max-w-2xl mx-auto mt-10 text-center">
          <p className="text-xs text-muted-foreground">
            Payments are processed securely by Stripe. You can test with card number 4242 4242 4242 4242.
            All plans include a 14-day money-back guarantee.
          </p>
        </div>
      </section>
    </div>
  );
}
