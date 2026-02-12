# PRIVACY POLICY
**Effective Date:** December 7, 2025

## 1. DATA COLLECTION & SCOPE
We collect and process the following data to operate the Aether Cognitive Engine:
* **Account Data:** Name, email, and firm affiliation (via Firebase Authentication).
* **Case Data:** Uploaded documents (PDF/Text), case summaries, and strategy parameters.
* **Telemetry:** Usage logs, audit trails, and system performance metrics as defined in our Audit Middleware.

## 2. ATTORNEY-CLIENT PRIVILEGE & WORK PRODUCT
Aether acts as a **Data Processor** acting at the direction of the User (Data Controller).
* **Privilege Preservation:** We implement technical measures designed to preserve the confidential status of your data, extending the attorney-client privilege shield to our processing environment where applicable by law.
* **No Third-Party Training:** Aether **does NOT** use your Case Data to train general-purpose foundation models (e.g., Google Gemini/Vertex AI) without your explicit written consent.

## 3. DATA STORAGE & SECURITY
* **Encryption:** Data is encrypted in transit (TLS 1.3) and at rest (AES-256).
* **Infrastructure:** We utilize secure containerized processing (Docker) and Google Cloud Storage with strict IAM access controls.
* **Audit Logging:** All data access is immutably logged for security audits, in compliance with SOC 2 readiness standards.

## 4. DATA RETENTION & DELETION
* **Retention:** Case Data is retained only for the duration of your active subscription or until specific deletion requests.
* **Right to Erasure:** Users may request the permanent deletion of specific Cases or Documents via the Workspace Settings. Upon deletion, data is cryptographically erased from all active storage.

## 5. SUBPROCESSORS
We utilize the following trusted subprocessors:
* **Google Vertex AI / Gemini:** For cognitive processing (Stateless mode).
* **Firebase (Google):** For identity management.
* **Google Cloud Platform:** For underlying cloud infrastructure and storage.

## 6. YOUR RIGHTS
You have the right to:
* Access, correct, or delete your personal data
* Export your case data in JSON/PDF format
* Object to certain processing activities
* Withdraw consent at any time

To exercise these rights, contact: privacy@eolagateway.net

## 7. CONTACT
For privacy questions: privacy@eolagateway.net

---
**Last Updated:** December 7, 2025
