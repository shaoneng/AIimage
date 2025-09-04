import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Import the plugin for GitHub Flavored Markdown
import { getDomain } from "@/config/domain";

const text = `


Welcome to AI Video Generator! By accessing or using our platform, you agree to comply with and be bound by these Terms of Service . Please read them carefully. If you do not agree with these Terms, you must not use our services.


## 1. Acceptance of Terms

By accessing or using AI Video Generator's services, you confirm that:
- You are at least 13 years old (or the age of majority in your jurisdiction).
- You have read, understood, and agree to these Terms.


## 2. Description of Services

AI Video Generator provides tools for generating AI-powered videos and images. Users can upload media to create custom outputs. While we strive to deliver high-quality results, the outputs may vary based on input quality.


## 3. User Responsibilities

When using AI Video Generator, you agree to:
- Provide accurate and lawful information.
- Use the platform only for personal or professional purposes permitted by these Terms.
- Not upload content that is illegal, offensive, harmful, or violates the rights of others.

**Prohibited Activities** include but are not limited to:
- Using the platform for unlawful purposes.
- Reverse-engineering, copying, or modifying the platform.
- Distributing generated content that infringes intellectual property rights or privacy laws.


## 4. Intellectual Property Rights

### 4.1 Ownership of Content
- All content, materials, and technology on AI Video Generator, including but not limited to software, designs, and trademarks, are owned by AI Video Generator or its licensors and are protected under applicable intellectual property laws.
- You retain ownership of the content you upload to the platform.

### 4.2 License to Use Your Content
By uploading content, you grant AI Video Generator a limited, non-exclusive, royalty-free license to process your content solely for the purpose of providing the requested services.


## 5. Privacy and Data Protection

Our use of your personal data is governed by our [Privacy Policy](#). By using our platform, you agree to our data collection and usage practices as described in the Privacy Policy.

**Uploaded Media:** We do not save or store your uploaded photos or videos after processing unless you explicitly provide consent.


## 6. Payment and Subscription

### 6.1 Pricing
Access to certain features of AI Video Generator may require payment or a subscription. Pricing details are available on our platform and are subject to change.

### 6.2 Refund Policy
Payments made are non-refundable unless required by applicable law. If you believe there has been an error, please contact us at **[support@${getDomain().replace(
  "https://",
  ""
)}]**.


## 7. Disclaimer of Warranties

AI Video Generator provides its services on an "as-is" and "as-available" basis. We make no warranties, expressed or implied, about the accuracy, reliability, or suitability of the platform for your needs.

To the fullest extent permitted by law, we disclaim:
- Any warranties of merchantability, fitness for a particular purpose, or non-infringement.
- Any guarantees that the platform will be error-free, uninterrupted, or secure.


## 8. Limitation of Liability

To the maximum extent permitted by law:
- AI Video Generator shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform.
- Our total liability for any claims related to your use of the platform shall not exceed the amount paid by you for the services in the past 12 months.


## 9. Indemnification

You agree to indemnify, defend, and hold harmless AI Video Generator, its affiliates, and its employees from any claims, liabilities, damages, or expenses arising out of:
- Your use of the platform.
- Your violation of these Terms or applicable laws.
- Any content you upload that infringes the rights of others.


## 10. Termination

We reserve the right to terminate or suspend your account and access to the platform at any time, with or without notice, if you violate these Terms or engage in unlawful activities.


## 11. Governing Law and Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of **[Insert Country or Jurisdiction]**, without regard to its conflict of laws principles.

### 11.1 Dispute Resolution
- Any disputes arising out of or relating to these Terms shall first be resolved through informal negotiation. If unresolved, disputes will be submitted to binding arbitration in **[Insert Location]**.
- Users waive their right to a jury trial or participation in a class action.


## 12. Changes to These Terms

We may update these Terms from time to time to reflect changes in our services or legal obligations. The updated Terms will be posted with the "Last Updated" date. Continued use of the platform signifies your acceptance of the revised Terms.


## 13. Contact Information

If you have any questions or concerns about these Terms, please contact us at:

**Email:** support@${getDomain().replace("https://", "")}  

By using AI Video Generator, you acknowledge that you have read, understood, and agreed to these Terms of Service.


`;

export default function TermsOfServicePage() {
  return (
    <div className="w-full max-w-5xl mx-auto relative overflow-hidden mt-16">
      <h1 className="text-4xl text-center font-bold mb-12">Terms of Service</h1>
      <p className="text-center text-sm text-gray-500 mb-12">
        Effective Date: 2024-11-08
      </p>
      <ReactMarkdown className="markdown pb-24" remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
