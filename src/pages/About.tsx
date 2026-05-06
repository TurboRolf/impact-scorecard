import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const About = () => {
  useDocumentTitle("About");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About Ethisay</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Our mission</h2>
            <p className="text-sm leading-relaxed">
              Ethisay is a platform for people who believe that how a company behaves matters as much as what it sells. We give consumers the tools to evaluate, challenge, and hold companies accountable — not for bad service, but for the decisions that shape society.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">How it works</h2>

            <h3 className="font-semibold text-sm mt-4 mb-1">Take a stance</h3>
            <p className="text-sm leading-relaxed mb-3">
              Give any company a quick Recommend, Neutral, or Discourage rating. It takes seconds and adds your voice to a growing picture of public opinion.
            </p>

            <h3 className="font-semibold text-sm mt-4 mb-1">Write a review</h3>
            <p className="text-sm leading-relaxed mb-3">
              Go deeper by rating companies on specific issues that matter: Environment, Labor &amp; Human Rights, Ethics &amp; Integrity, Politics &amp; Lobbying, Transparency, Marketing &amp; Advertising, Data &amp; Privacy, and Supply Chain. Your assessment becomes part of a public record anyone can reference.
            </p>

            <h3 className="font-semibold text-sm mt-4 mb-1">Start or join a boycott</h3>
            <p className="text-sm leading-relaxed mb-3">
              Organize collective action around a specific issue. Set a clear goal, define what it would take for the boycott to be resolved, and invite others to join. When people act together, companies pay attention.
            </p>

            <h3 className="font-semibold text-sm mt-4 mb-1">Follow the conversation</h3>
            <p className="text-sm leading-relaxed">
              See what others are saying in the feed. Follow creators and activists whose perspectives you trust, and discover companies that align — or conflict — with your values.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">What Ethisay is not</h2>
            <p className="text-sm leading-relaxed mb-3">
              Ethisay is not a place for complaints about bad customer service or cold coffee. It's for the bigger picture: companies that violate the law, mislead the public, exploit workers, silence employees, push political agendas without transparency, mishandle customer data, or abandon the communities they operate in.
            </p>
            <p className="text-sm leading-relaxed">
              Whether your concerns are about environmental violations, religious freedoms in the workplace, political bias in corporate decisions, financial transparency, or the erosion of free speech — Ethisay is a place to make that voice heard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Why it matters</h2>
            <p className="text-sm leading-relaxed">
              Corporations respond to consumer pressure. But that pressure only works when people are informed and organized. Ethisay connects the dots — turning individual opinions into collective intelligence, and collective intelligence into real accountability.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};

export default About;