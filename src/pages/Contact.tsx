import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Contact = () => {
  useDocumentTitle("Contact");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact</h1>
          <p className="text-sm leading-relaxed">
            For questions, feedback, or privacy-related inquiries, please reach out via email:
          </p>
          <p className="text-base font-medium mt-4">ethisay.kontakt@gmail.com</p>
        </article>
      </main>
    </div>
  );
};

export default Contact;