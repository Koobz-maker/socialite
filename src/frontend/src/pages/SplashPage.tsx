import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Image, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: Image,
    title: "Share your world",
    desc: "Post photos and stories to express yourself authentically.",
  },
  {
    icon: Users,
    title: "Build your circle",
    desc: "Follow friends and creators who inspire you daily.",
  },
  {
    icon: Zap,
    title: "Stay in the moment",
    desc: "A live feed that surfaces the content that matters most.",
  },
  {
    icon: Bell,
    title: "Never miss a beat",
    desc: "Real-time notifications for likes, comments, and new followers.",
  },
];

export default function SplashPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/home" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      data-ocid="splash.page"
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 max-w-xl"
        >
          {/* Logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-elevated">
            <span className="font-display text-2xl font-bold text-primary-foreground">
              S
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Share your story.
            <br />
            <span className="text-primary">Connect for real.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-sm leading-relaxed">
            Socialite brings together photo sharing, real-time feeds, and
            meaningful connections in one beautiful place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
            <Button
              data-ocid="splash.signup_button"
              size="lg"
              className="btn-primary px-8 text-base"
              disabled={isInitializing}
              onClick={login}
            >
              {isInitializing ? "Loading..." : "Get started free"}
            </Button>
            <Button
              data-ocid="splash.login_button"
              size="lg"
              variant="outline"
              className="px-8 text-base border-border"
              disabled={isInitializing}
              onClick={login}
            >
              Sign in
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-t border-border py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-display text-2xl font-semibold text-foreground text-center mb-10"
          >
            Everything you need to connect
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-5 flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
