import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function PrivacyPolicy() {
  const back =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('back') || 'Settings'
      : 'Settings';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl(back)}>
            <Button variant="ghost" size="icon" type="button">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Privacy Policy & Terms
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-7">
          <div>
            <p className="text-xs text-gray-400">Last updated: February 25, 2026</p>
            <p className="text-sm text-gray-600 mt-2">
              This Privacy Policy explains how <strong>AI Fitness Coach</strong> (
              &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) may collect, use,
              and protect information when you use our application. By using the
              app, you acknowledge this policy and the terms described below.
            </p>
          </div>

          <Section title="1. Information We Collect">
            <p>
              <strong>Account Data:</strong> When you create an account, we may
              collect information such as your email address, name, and account
              credentials.
            </p>
            <p>
              <strong>Workout Data:</strong> We may store workout sessions,
              exercise logs, rep counts, form scores, and body-related data that
              you choose to enter into the app.
            </p>
            <p>
              <strong>Nutrition Data:</strong> We may store meal logs and food
              information that you add to the app.
            </p>
            <p>
              <strong>Camera Access:</strong> If you use live form analysis, the
              app may access your device camera for pose estimation and movement
              analysis. Camera-related processing may depend on the features you
              use and how the app is configured.
            </p>
            <p>
              <strong>Usage Data:</strong> We may collect limited technical or
              product usage information to maintain and improve the app.
            </p>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="list-disc list-inside space-y-1">
              <li>To provide workout tracking and fitness-related features</li>
              <li>To personalize recommendations and coaching insights</li>
              <li>To improve app performance, stability, and user experience</li>
              <li>To support account-related actions and important notices</li>
              <li>To meet legal, safety, or operational obligations</li>
            </ul>
            <p>
              We do not use your personal information for purposes unrelated to the
              functioning and improvement of the app without an appropriate basis.
            </p>
          </Section>

          <Section title="3. Data Storage & Security">
            <p>
              We take reasonable administrative, technical, and organizational
              measures to help protect your data.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Protected authentication systems</li>
              <li>Secure transmission methods where applicable</li>
              <li>Access controls for sensitive information</li>
              <li>Ongoing maintenance and security improvements</li>
            </ul>
            <p>
              No platform or transmission method can be guaranteed to be completely
              secure, so you should also use a strong, unique password and protect
              your own device access.
            </p>
          </Section>

          <Section title="4. Camera & Sensor Data">
            <p>
              Certain features may use your device camera or motion-related inputs
              to analyze exercise form and movement.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Camera access is used only when a relevant feature is enabled</li>
              <li>Processing methods may vary depending on the feature</li>
              <li>Saved workout outputs may include scores, counts, or summaries</li>
              <li>You may still use other app features without camera access</li>
            </ul>
          </Section>

          <Section title="5. Your Rights">
            <p>Depending on your location and applicable law, you may have rights to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Access</strong> certain personal data associated with your account</li>
              <li><strong>Correct</strong> inaccurate or incomplete information</li>
              <li><strong>Delete</strong> your account and related data</li>
              <li><strong>Request export</strong> of certain data where available</li>
              <li><strong>Withdraw consent</strong> where processing is based on consent</li>
            </ul>
            <p>
              To exercise these rights, use available in-app settings or contact us
              using the details provided below.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain data for as long as it is reasonably necessary to provide
              the service, comply with legal obligations, resolve disputes, and
              enforce our agreements. Retention periods may vary depending on the
              type of data and applicable requirements.
            </p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>
              Our app may rely on third-party tools or infrastructure providers to
              support functionality such as hosting, authentication, analytics, or
              device-based processing.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Base44</strong> — backend and data-related infrastructure</li>
              <li><strong>MediaPipe (Google)</strong> — motion or pose-related processing features</li>
            </ul>
            <p>
              Third-party services operate under their own terms, policies, and
              technical implementations.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              This app is not intended for children under 13 years of age. We do
              not knowingly seek to collect personal data from children in that age
              group. If you believe a child has provided personal data, please
              contact us.
            </p>
          </Section>

          <Section title="9. Terms of Service">
            <p>By using AI Fitness Coach, you agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use the app only for lawful and personal purposes</li>
              <li>Not misuse, disrupt, scrape, or attempt unauthorized access to the service</li>
              <li>Use your own judgment before following workout or nutrition suggestions</li>
              <li>Recognize that AI-generated guidance may be limited or imperfect</li>
            </ul>
            <p>
              We may suspend or restrict access where misuse, abuse, or violations
              of these terms occur.
            </p>
          </Section>

          <Section title="10. Disclaimer and Limitation of Liability">
            <p className="font-semibold text-gray-800 uppercase tracking-wide text-xs">
              USE AT YOUR OWN RISK
            </p>
            <p>
              The content provided by <strong>AI Fitness Coach</strong>, including
              workout instructions, exercise suggestions, AI-generated feedback, and
              nutrition-related content, is intended for general informational and
              wellness purposes only.
            </p>
            <p>
              It is not medical advice, diagnosis, treatment, or a substitute for
              qualified professional guidance.
            </p>
            <p>
              You should consult a qualified healthcare professional before
              beginning a new exercise, nutrition, or wellness program, especially
              if you have injuries, medical conditions, or other health concerns.
            </p>
            <p>
              To the extent permitted by applicable law, we are not responsible for
              injuries, losses, or damages arising from your use of the app, your
              reliance on app content, or the performance of physical activities
              based on app guidance.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Following workouts or recommendations provided in the app</li>
              <li>Improper, unsafe, or unsuitable exercise execution</li>
              <li>Reliance on AI-generated analysis or coaching feedback</li>
              <li>Failure to seek appropriate professional advice when needed</li>
            </ul>
            <p>
              By using the application, you accept responsibility for your own
              health, safety, and decision-making.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this policy from time to time. When we do, we may
              revise the date at the top of this page and take other reasonable
              steps to communicate material changes where appropriate.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>For privacy-related questions, requests, or concerns:</p>
            <p className="font-medium text-gray-800">📧 privacy@aifitnesscoach.app</p>
            <p className="text-xs text-gray-400 mt-1">
              Response times may vary depending on request volume and issue type.
            </p>
          </Section>
        </div>

        <div className="text-center mt-6 pb-8">
          <Link to={createPageUrl(back)}>
            <Button variant="outline" className="rounded-xl" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}