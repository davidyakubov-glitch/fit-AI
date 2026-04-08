import React from 'react';
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
  const urlParams = new URLSearchParams(window.location.search);
  const back = urlParams.get('back') || 'Settings';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy & Terms</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-7">
          <div>
            <p className="text-xs text-gray-400">Last updated: February 25, 2026</p>
            <p className="text-sm text-gray-600 mt-2">
              This Privacy Policy explains how <strong>AI Fitness Coach</strong> ("we", "us", "our") collects, uses, and protects your information when you use our application. By creating an account, you agree to the practices described here.
            </p>
          </div>

          <Section title="1. Information We Collect">
            <p><strong>Account Data:</strong> When you register, we collect your email address, full name, and a securely hashed password. We never store passwords in plain text.</p>
            <p><strong>Workout & Health Data:</strong> We store workout sessions, exercise logs, rep counts, form scores, and body measurements you voluntarily enter.</p>
            <p><strong>Nutrition Data:</strong> Meal logs and food items you add to the app.</p>
            <p><strong>Camera Access:</strong> When you use the live AI form analysis feature, your device camera is accessed to detect pose landmarks in real time. <strong>No video is recorded or transmitted to our servers.</strong> All processing happens locally on your device.</p>
            <p><strong>Usage Data:</strong> Basic analytics about which features you use (no personally identifiable information attached).</p>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="list-disc list-inside space-y-1">
              <li>To provide personalized workout plans and AI coaching recommendations</li>
              <li>To track your fitness progress over time</li>
              <li>To improve form analysis accuracy and app features</li>
              <li>To send account-related emails (password resets, important notices)</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal data to third parties.</p>
          </Section>

          <Section title="3. Data Storage & Security">
            <p>Your data is stored on secure, encrypted servers. We use industry-standard security practices including:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Password hashing (bcrypt)</li>
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Role-based access controls</li>
              <li>Regular security audits</li>
            </ul>
            <p>While we take every reasonable precaution, no system is 100% secure. We encourage you to use a strong, unique password.</p>
          </Section>

          <Section title="4. Camera & Sensor Data">
            <p>The AI form analysis feature uses your device camera exclusively for real-time pose estimation. Key facts:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No video footage is stored or uploaded</li>
              <li>Pose landmark coordinates are processed locally (on-device)</li>
              <li>Only aggregate form scores and rep counts are saved to your account</li>
              <li>You can use the app without camera access (manual logging only)</li>
            </ul>
          </Section>

          <Section title="5. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Access</strong> all data we hold about you</li>
              <li><strong>Correct</strong> inaccurate personal data</li>
              <li><strong>Delete</strong> your account and all associated data (available in Settings → Delete Account)</li>
              <li><strong>Export</strong> your workout history and health data on request</li>
              <li><strong>Withdraw consent</strong> at any time by deleting your account</li>
            </ul>
            <p>To exercise any of these rights, use the Settings page or contact us at the address below.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your account data for as long as your account is active. When you delete your account, all personal data is permanently removed within 30 days. Anonymized, aggregate analytics may be retained indefinitely.</p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>Our app uses the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Base44</strong> — Backend infrastructure & data storage</li>
              <li><strong>MediaPipe (Google)</strong> — On-device pose detection (no data leaves your device)</li>
            </ul>
            <p>Each third party is bound by their own privacy policies and applicable law.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>This app is not intended for children under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has created an account, contact us immediately.</p>
          </Section>

          <Section title="9. Terms of Service">
            <p>By using AI Fitness Coach you agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use the app only for personal, non-commercial fitness purposes</li>
              <li>Not attempt to reverse-engineer, scrape, or abuse the service</li>
              <li>Consult a medical professional before starting any new exercise program</li>
              <li>Accept that AI-generated form feedback is for guidance only and not a substitute for professional coaching</li>
            </ul>
            <p>We reserve the right to suspend accounts that violate these terms.</p>
          </Section>

          <Section title="10. Disclaimer and Limitation of Liability">
            <p className="font-semibold text-gray-800 uppercase tracking-wide text-xs">USE AT YOUR OWN RISK</p>
            <p>
              The content provided by <strong>AI Fitness Coach</strong>, including but not limited to workout instructions, exercise recommendations, AI-generated form feedback, and nutritional guidance, is for <strong>informational and general wellness purposes only</strong>. It does not constitute medical advice, professional fitness instruction, or healthcare services of any kind.
            </p>
            <p>
              <strong>You should consult a qualified healthcare professional or licensed fitness instructor before beginning any exercise program</strong>, particularly if you have any pre-existing medical conditions, injuries, or health concerns.
            </p>
            <p>
              <strong>To the fullest extent permitted by applicable law, we expressly disclaim all liability</strong> for any injuries, physical harm, health complications, property damage, or other losses of any kind arising out of or in connection with:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Following or attempting to follow any workout instructions, exercise plans, or recommendations provided by the app</li>
              <li>Use or misuse of the application or any of its features</li>
              <li>Incorrect, improper, or unsafe execution of any exercise</li>
              <li>Reliance on AI-generated form analysis or coaching feedback</li>
              <li>Any failure to seek appropriate professional advice prior to engaging in physical activity</li>
            </ul>
            <p>
              <strong>You participate in all physical activities and workouts at your own risk.</strong> AI Fitness Coach, its owners, developers, affiliates, and agents shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your use of this application, to the maximum extent permitted by law.
            </p>
            <p>
              By using this application, you acknowledge and accept full responsibility for your own health, safety, and physical well-being.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this policy occasionally. When we do, we'll update the date at the top and notify users via email for material changes. Continued use of the app after changes constitutes acceptance.</p>
          </Section>

          <Section title="12. Contact Us">
            <p>For privacy-related questions, data requests, or concerns:</p>
            <p className="font-medium text-gray-800">📧 privacy@aifitnesscoach.app</p>
            <p className="text-xs text-gray-400 mt-1">We aim to respond to all inquiries within 48 hours.</p>
          </Section>
        </div>

        <div className="text-center mt-6 pb-8">
          <Button onClick={() => window.history.back()} variant="outline" className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}