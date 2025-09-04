import ReactMarkdown from "react-markdown";
import { getDomain } from "@/config/domain";

const text = `



Welcome to AI Video Generator. Your privacy is important to us, and we are committed to protecting the information you share with us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or use our services.


## 1. Information We Collect

We may collect the following types of information:

### 1.1 Personal Information
- Name, email address, and contact information provided during account registration or inquiries.
- Payment information for subscription or purchases (handled securely via third-party payment processors).

### 1.2 Uploaded Data
- Photos and videos you upload to generate AI content. **Note:** We do not save or store uploaded media after processing unless explicitly agreed upon by you.

### 1.3 Automatically Collected Information
- **Log Data**: IP address, browser type, operating system, and timestamps.
- **Usage Data**: Pages visited, features used, and other interaction data.


## 2. How We Use Your Information

We use the collected information for the following purposes:
- To provide, operate, and maintain our services.
- To improve and personalize user experiences.
- To process payments and send transactional communications.
- To ensure the security and functionality of our platform.
- To comply with legal obligations or resolve disputes.

## 3. How We Protect Your Data

We implement industry-standard measures to secure your data, including:
- **Encryption**: Secure HTTPS protocol and encrypted payment transactions.
- **Data Minimization**: Limiting data retention to the minimum necessary.
- **Access Controls**: Restricting access to personal data to authorized personnel only.


## 4. Sharing Your Information

We do not sell or rent your personal information to third parties. However, we may share your information in the following cases:
- **Service Providers**: Trusted third parties (e.g., payment processors, cloud storage providers) that help us deliver our services.
- **Legal Compliance**: When required by law, subpoena, or court order.
- **Business Transfers**: In case of a merger, acquisition, or sale of assets, your information may be transferred.


## 5. Your Rights

Depending on your location, you may have the following rights:
- **Access**: Request access to the personal data we hold about you.
- **Correction**: Request corrections to inaccurate or incomplete data.
- **Deletion**: Request the deletion of your personal data, subject to legal obligations.
- **Objection**: Object to the processing of your data for certain purposes.
- **Data Portability**: Request a copy of your data in a machine-readable format.

To exercise these rights, please contact us at **[support@${getDomain().replace(
  "https://",
  ""
)}]**.


## 6. Data Retention

- Uploaded media: We do not store uploaded photos or videos after processing.
- Other personal data: Retained only for as long as necessary to fulfill the purposes outlined in this policy or comply with legal obligations.


## 7. Third-Party Services

Our platform may integrate with third-party tools (e.g., payment processors or analytics services). These services operate independently and are governed by their own privacy policies. We recommend reviewing the privacy policies of these third parties.


## 8. International Users

If you are accessing our services from outside of Europe and the United States, please note that your data may be transferred to and processed in a country with different data protection laws. By using our platform, you consent to this transfer.


## 9. Children's Privacy

Our services are not intended for individuals under the age of 13 (or the age of majority in your jurisdiction). We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the data promptly.


## 10. Updates to This Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on this page with the "Last Updated" date.


## 11. Contact Us

If you have any questions or concerns about this Privacy Policy or your personal data, please contact us at:

**Email**: support@${getDomain().replace("https://", "")}


By using AI Video Generator, you agree to the terms of this Privacy Policy. If you do not agree, please refrain from using our services.




`;
export default function PrivacyPolicyPage() {
  return (
    <div className="w-full  max-w-5xl mx-auto relative overflow-hidden mt-16">
      <h1 className="text-4xl text-center font-bold mb-12">Privacy Policy</h1>
      <p className="text-center text-sm text-gray-500 mb-12">
        Last Updated: 2024-11-08
      </p>
      <ReactMarkdown className="markdown pb-24">{text}</ReactMarkdown>
    </div>
  );
}

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};
