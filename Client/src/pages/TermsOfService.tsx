import Layout from "@/components/shared/Layout";

export default function TermsOfService() {
  return (
    <Layout
      title="Terms of Service"
      description={`Last updated: ${new Date().toLocaleDateString()}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using WoltFlow ("Service"), you accept and agree
              to be bound by the terms and provision of this agreement. If you
              do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Service Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              WoltFlow is an automation service that helps users manage their
              Wolt and Cibus accounts. The service includes email monitoring,
              automated voucher claiming, and notification features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. User Responsibilities
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not interfere with the service's operation</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Account Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account information and for all activities that occur under your
              account. You must notify us immediately of any unauthorized use of
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Service Availability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain service availability but do not guarantee
              uninterrupted access. The service may be temporarily unavailable
              due to maintenance, updates, or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              WoltFlow is provided "as is" without warranties of any kind. We
              are not liable for any direct, indirect, incidental, or
              consequential damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Privacy Policy
              </a>
              , which also governs your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Modifications to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              the service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and access to the service
              at our sole discretion, without prior notice, for conduct that
              violates these terms or is otherwise harmful to the service or
              other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us at support@woltflow.com
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
