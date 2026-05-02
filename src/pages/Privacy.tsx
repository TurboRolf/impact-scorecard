import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Privacy = () => {
  useDocumentTitle("Privacy Policy");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy for Ethisay</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: 2 May 2026</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-sm leading-relaxed mb-2">
              This Privacy Policy describes how Ethisay ("we", "us", "our") collects, uses, and protects your personal data when you use our service at ethisay.com (the "Service").
            </p>
            <p className="text-sm leading-relaxed mb-2">
              The data controller is Alexander Gombor, who operates Ethisay as a private individual. You can contact us at <a href="mailto:ethisay.kontakt@gmail.com" className="text-primary hover:underline">ethisay.kontakt@gmail.com</a> with any questions regarding this policy or your personal data.
            </p>
            <p className="text-sm leading-relaxed">
              By using the Service, you consent to the processing of your personal data as described in this policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">2. Personal Data We Collect</h2>
            <p className="text-sm leading-relaxed mb-2">We collect the following types of personal data:</p>
            <h3 className="font-semibold text-sm mt-3 mb-1">Information you provide during registration and use:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Email address</li>
              <li>Password (stored encrypted)</li>
              <li>Username</li>
              <li>Profile picture (if you choose to upload one)</li>
              <li>Bio/profile description (if you choose to provide one)</li>
            </ul>
            <h3 className="font-semibold text-sm mt-3 mb-1">Information generated through your use of the Service:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Content you create (reviews, ratings, boycotts, comments)</li>
              <li>Companies, creators, and boycotts you follow</li>
              <li>Login times and activity timestamps</li>
              <li>Technical information such as IP address and browser type (for security)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">3. Why We Process Your Personal Data</h2>
            <p className="text-sm leading-relaxed mb-2">We process your personal data for the following purposes:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>To provide the Service:</strong> Creating and managing your account, enabling login, displaying your content to other users</li>
              <li><strong>To improve the Service:</strong> Understanding how the Service is used so we can develop it further</li>
              <li><strong>Security:</strong> Preventing abuse, spam, and illegal content</li>
              <li><strong>Communication:</strong> Sending important messages about your account or the Service</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">4. Legal Basis for Processing</h2>
            <p className="text-sm leading-relaxed mb-2">We process your personal data based on the following legal grounds under the GDPR:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Contract:</strong> Processing necessary for us to provide the Service in accordance with our terms of use</li>
              <li><strong>Consent:</strong> For optional information such as profile picture and bio</li>
              <li><strong>Legitimate interest:</strong> To protect the Service from abuse and to improve it</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">5. How Long We Retain Your Data</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Account data:</strong> Retained for as long as your account is active</li>
              <li><strong>Upon account deletion:</strong> Personal data is deleted within 30 days, although anonymized aggregated data may be retained longer</li>
              <li><strong>Content you have published:</strong> Removed when you delete it or your account</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Who We Share Your Data With</h2>
            <p className="text-sm leading-relaxed mb-2">We never sell your personal data. Your data is stored with:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Supabase</strong> (database and authentication) – data may be stored within the EU/EEA or in the United States. Supabase complies with the GDPR and has appropriate safeguards in place.</li>
              <li><strong>Vercel</strong> (hosting) – technical logs required for the Service to function.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">We may also disclose data if required by law or to protect our rights or those of others.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="text-sm leading-relaxed mb-2">Under the GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Access your personal data (data subject access request)</li>
              <li>Rectify inaccurate information</li>
              <li>Erase your data ("right to be forgotten")</li>
              <li>Restrict the processing of your data</li>
              <li>Object to processing based on legitimate interest</li>
              <li>Data portability – receive your data in a machine-readable format</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              To exercise your rights, contact us at <a href="mailto:ethisay.kontakt@gmail.com" className="text-primary hover:underline">ethisay.kontakt@gmail.com</a>.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              You also have the right to lodge a complaint with the Swedish Authority for Privacy Protection (IMY) if you believe we are processing your personal data unlawfully: <a href="https://imy.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">imy.se</a>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">8. Security</h2>
            <p className="text-sm leading-relaxed mb-2">We take appropriate technical and organizational measures to protect your personal data, including:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Encrypted password storage</li>
              <li>HTTPS encryption for all data transmission</li>
              <li>Restricted access to personal data</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">Despite these measures, no method of transmission or storage can be guaranteed to be 100% secure.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">9. Cookies</h2>
            <p className="text-sm leading-relaxed">
              The Service uses only essential cookies necessary for login and security. We do not use tracking cookies or third-party analytics tools.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this policy from time to time. In the event of significant changes, we will notify you via email or through a notice in the Service. The latest version is always available at ethisay.com.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">11. Contact</h2>
            <p className="text-sm leading-relaxed">
              For questions about this policy or your personal data, please contact:
            </p>
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

export default Privacy;