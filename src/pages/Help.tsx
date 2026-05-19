import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  AlertTriangle,
  Users,
  Home,
  Building2,
  Search,
  UserPlus,
} from "lucide-react";

const Help = () => {
  useDocumentTitle("How to Use Ethisay");

  const steps = [
    {
      number: "1",
      title: "Create an account",
      icon: UserPlus,
      content:
        "Click Join Ethisay and sign up with your email address. Once registered, you can set up your profile with a username, profile picture, and bio.",
    },
    {
      number: "2",
      title: "Find a company",
      icon: Building2,
      content:
        "Click Companies in the navigation bar to browse the directory. Use the search bar to find a specific company, or filter by category — Technology, Finance, Fashion, and more. Each company card shows its current ratings across 8 different categories as well as the number of active boycotts and stances.",
    },
    {
      number: "3",
      title: "Take a stance",
      icon: ThumbsUp,
      content: (
        <>
          <p className="mb-3">
            Found a company you have an opinion about? Click <strong>Add Stance</strong> and choose one of three options:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-emerald-500" />
              <span>
                <strong>Recommend</strong> — you support this company
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>Neutral</strong> — you have no strong opinion
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-destructive" />
              <span>
                <strong>Discourage</strong> — you do not support this company
              </span>
            </div>
          </div>
          <p className="mt-3">
            A stance is quick and takes less than a minute. You can add a note if you want to explain your reasoning.
          </p>
        </>
      ),
    },
    {
      number: "4",
      title: "Write a review",
      icon: Star,
      content: (
        <>
          <p className="mb-3">
            Want to go deeper? Click <strong>Add Review</strong> to rate a company on specific issues:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              ["Environment", "climate impact, waste, and sustainability"],
              ["Labor & Human Rights", "working conditions and supply chain"],
              ["Ethics & Integrity", "corruption and business conduct"],
              ["Politics & Lobbying", "political influence and donations"],
              ["Transparency", "openness about operations and finances"],
              ["Marketing & Advertising", "honesty in advertising"],
              ["Data & Privacy", "how user data is handled"],
              ["Supply Chain", "sourcing and supplier accountability"],
            ].map(([label, desc]) => (
              <li key={label} className="flex flex-col bg-muted/50 rounded px-3 py-2">
                <span className="font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Give a star rating (1–5) and optionally write a short explanation.
          </p>
        </>
      ),
    },
    {
      number: "5",
      title: "Start or join a boycott",
      icon: AlertTriangle,
      content:
        "See an active boycott on a company's page? Click Join to add your name to it. Want to organize one yourself? Click Start Boycott and fill in the form. Boycotts are public and visible to all users.",
    },
    {
      number: "6",
      title: "Follow the feed",
      icon: Home,
      content:
        "The Feed shows you what's happening on Ethisay — new stances, reviews, and boycotts from people you follow and trending activity from the community. Switch between Trending to see what's popular globally, or Following to see updates from people you follow.",
    },
    {
      number: "7",
      title: "Follow creators",
      icon: Users,
      content:
        "Go to Creators to find and follow people whose opinions you trust. Their activity will show up in your feed.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">How to Use Ethisay</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ethisay lets you rate companies, join boycotts, and connect with others who care about how businesses operate. Here's how to get started.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <section
              key={step.number}
              className="rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {step.number}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <step.icon className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                </div>
              </div>
              <div className="pl-11 text-sm leading-relaxed text-foreground/90">
                {step.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            That's it. Your voice matters — the more people participate, the more pressure companies feel to act responsibly.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/companies">
              <Button size="sm" className="gap-1">
                <Building2 className="h-4 w-4" />
                Browse Companies
              </Button>
            </Link>
            <Link to="/creators">
              <Button size="sm" variant="outline" className="gap-1">
                <Users className="h-4 w-4" />
                Find Creators
              </Button>
            </Link>
            <Link to="/">
              <Button size="sm" variant="ghost" className="gap-1">
                <Home className="h-4 w-4" />
                Go to Feed
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
