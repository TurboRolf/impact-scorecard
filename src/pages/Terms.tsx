import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Terms = () => {
  useDocumentTitle("Terms of Service");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service for Ethisay</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: 2 May 2026</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-sm leading-relaxed mb-2">
              Welcome to Ethisay. These Terms of Service ("Terms") govern your use of the Ethisay website and service at ethisay.com (the "Service"), operated by Alexander Gombor as a private individual ("we", "us", "our").
            </p>
            <p className="text-sm leading-relaxed">
              By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
            <p className="text-sm leading-relaxed mb-2">
              You must be at least 13 years old to use the Service. By creating an account, you confirm that you meet this age requirement.
            </p>
            <p className="text-sm leading-relaxed">
              If you are under 18, you confirm that you have permission from a parent or legal guardian to use the Service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">3. Your Account</h2>
            <p className="text-sm leading-relaxed mb-2">You are responsible for:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Providing accurate information when creating your account</li>
              <li>Keeping your login credentials secure</li>
              <li>All activity that occurs under your account</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              You must notify us immediately if you suspect unauthorized access to your account. We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">4. Purpose of the Service</h2>
            <p className="text-sm leading-relaxed mb-2">Ethisay is a platform that allows users to:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Rate and review companies based on ethical, environmental, political, and other criteria</li>
              <li>Create and join boycotts</li>
              <li>Follow other users and discover companies aligned with their values</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">The Service is intended to facilitate informed consumer choices and collective action.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">5. User Content</h2>
            <h3 className="font-semibold text-sm mt-3 mb-1">5.1 Your Responsibility</h3>
            <p className="text-sm leading-relaxed mb-2">
              You retain ownership of the content you post on the Service ("User Content"). However, you are solely responsible for the content you publish.
            </p>
            <p className="text-sm leading-relaxed mb-2">
              Ethisay supports your right to express opinions and share experiences about companies freely, in line with the principles of free speech that apply to social media platforms. You do not need to provide sources for your opinions or personal experiences.
            </p>
            <p className="text-sm leading-relaxed mb-2">That said, you agree that:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>You will not knowingly post false factual statements about companies, individuals, or other entities</li>
              <li>You will not post content that is defamatory, harassing, threatening, obscene, or otherwise unlawful</li>
              <li>You will not post content that infringes on the intellectual property rights of others</li>
              <li>You will not impersonate any person or entity</li>
              <li>You understand that opinions and factual claims are legally distinct, and that knowingly false factual claims may expose you to legal liability</li>
            </ul>

            <h3 className="font-semibold text-sm mt-3 mb-1">5.2 License to Us</h3>
            <p className="text-sm leading-relaxed">
              By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content within the Service for the purpose of operating and promoting Ethisay.
            </p>

            <h3 className="font-semibold text-sm mt-3 mb-1">5.3 Content Removal</h3>
            <p className="text-sm leading-relaxed mb-2">We reserve the right, but not the obligation, to remove any User Content that:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Violates these Terms or applicable law</li>
              <li>Is the subject of a credible complaint from a third party</li>
              <li>We deem harmful to the Service or its users</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Prohibited Conduct</h2>
            <p className="text-sm leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Knowingly post false or fabricated factual claims about companies or individuals</li>
              <li>Engage in harassment, hate speech, or threats against any person or company</li>
              <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
              <li>Use automated systems (bots, scrapers) without our written permission</li>
              <li>Spam, manipulate ratings, or coordinate inauthentic behavior</li>
              <li>Distribute malware or engage in any activity that disrupts the Service</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Disclaimer Regarding User Content</h2>
            <p className="text-sm leading-relaxed mb-2">
              Ethisay is a platform for user-generated content. All ratings, reviews, boycotts, and opinions expressed on the Service are those of the individual users and do not represent the views of Ethisay or its operator.
            </p>
            <p className="text-sm leading-relaxed">
              We do not verify the accuracy of User Content. Users should evaluate such content critically and independently before making decisions based on it.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">8. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              The Service, including its design, branding, logo ("Ethisay"), and original content created by us, is protected by intellectual property laws. You may not copy, modify, or distribute these elements without our written permission.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
            <p className="text-sm leading-relaxed mb-2">
              You may delete your account at any time through the Service. We may suspend or terminate your access to the Service if you violate these Terms or applicable law.
            </p>
            <p className="text-sm leading-relaxed">
              Upon termination, your right to use the Service ends immediately. Provisions that by their nature should survive termination (such as liability and content licenses for previously published content) will remain in effect.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">10. Disclaimer of Warranties</h2>
            <p className="text-sm leading-relaxed">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">11. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed mb-2">
              To the maximum extent permitted by law, Ethisay and its operator shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data, reputation, or business opportunities.
            </p>
            <p className="text-sm leading-relaxed">Nothing in these Terms limits liability that cannot be excluded under applicable law.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">12. Indemnification</h2>
            <p className="text-sm leading-relaxed mb-2">You agree to indemnify and hold harmless Ethisay and its operator from any claims, damages, or expenses arising from:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Your User Content</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">13. Changes to These Terms</h2>
            <p className="text-sm leading-relaxed">
              We may update these Terms from time to time. Significant changes will be communicated via email or a notice on the Service. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">14. Governing Law</h2>
            <p className="text-sm leading-relaxed">
              These Terms are governed by the laws of Sweden. Any disputes shall be resolved in Swedish courts, with Göteborg District Court as the court of first instance.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">15. Contact</h2>
            <p className="text-sm leading-relaxed">For questions about these Terms, please contact:</p>
            <p className="text-sm leading-relaxed mt-2">
              Alexander Gombor<br />
              Email: <a href="mailto:ethisay.kontakt@gmail.com" className="text-primary hover:underline">ethisay.kontakt@gmail.com</a>
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};

export default Terms;