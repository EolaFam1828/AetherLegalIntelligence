> **[← Back to README](../README.md)** | **[Terms of Service](TERMS_OF_SERVICE.md)** | **[Acceptable Use](ACCEPTABLE_USE_POLICY.md)** | **[MSA](MASTER_SERVICES_AGREEMENT.md)**

# PRIVACY POLICY
**Effective Date:** December 7, 2025

## 1. DATA COLLECTION & SCOPE
We collect and process the following data to operate the Aether Cognitive Engine:
* **Account Data:** Name, email, and firm affiliation (via SSO identity provider).
* **Case Data:** Uploaded documents (PDF/Text), case summaries, and strategy parameters.
* **Telemetry:** Usage logs, audit trails, and system performance metrics as defined in our Audit Middleware.

## 2. ATTORNEY-CLIENT PRIVILEGE & WORK PRODUCT
Aether acts as a **Data Processor** acting at the direction of the User (Data Controller).
* **Privilege Preservation:** We implement technical measures designed to preserve the confidential status of your data, extending the attorney-client privilege shield to our processing environment where applicable by law.
* **No Third-Party Training:** Aether **does NOT** use your Case Data to train general-purpose foundation models (e.g., Google Gemini/Vertex AI) without your explicit written consent.

## 3. DATA STORAGE & SECURITY
* **Encryption:** Data is encrypted in transit. Storage encryption depends on the host filesystem configuration.
* **Infrastructure:** Containerized deployment behind an identity proxy. Not directly exposed to the internet.
* **Audit Logging:** Mutating API actions are logged (user, action, resource, timestamp). Logs capture actions but not before/after data state.

## 4. DATA RETENTION & DELETION
* **Retention:** Case Data is retained only for the duration of your active subscription or until specific deletion requests.
* **Right to Erasure:** Users may request the permanent deletion of specific Cases or Documents via the Workspace Settings. Upon deletion, data is cryptographically erased from all active storage.

## 5. SUBPROCESSORS
We utilize the following trusted subprocessors:
* **Google Gemini:** For cognitive processing (stateless mode, no data retention).
* **SSO Identity Provider:** For authentication and identity management.
* **Self-Hosted Infrastructure:** Containerized deployment with encrypted storage.

## 6. YOUR RIGHTS
You have the right to:
* Access, correct, or delete your personal data
* Request export of your case data
* Object to certain processing activities
* Withdraw consent at any time

To exercise these rights, contact: privacy@eolagateway.net

## 7. CONTACT
For privacy questions: privacy@eolagateway.net

---
**Last Updated:** December 7, 2025


---

**[← Back to README](../README.md)** | **[Terms of Service](TERMS_OF_SERVICE.md)** | **[Acceptable Use](ACCEPTABLE_USE_POLICY.md)** | **[MSA](MASTER_SERVICES_AGREEMENT.md)**
