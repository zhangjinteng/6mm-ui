# Unified translation settings

Use the CMS (screen 2) settings form for CMS content, SEO and contract tags in both hosts.

- One shared settings dialog and settings contract; hosts retain authorization and context callbacks.
- Platform uses the canonical platform CMS configuration; white-label tags use the first enabled owned site's content space.
- Merchants retain independent `agent_translation_config` records and existing encrypted keys. Add target locales, timeout, attempts and optimistic revision columns, without touching existing key ciphertext.
- No settings read initializes a content space or chooses a client-provided tenant. Manual translations remain available when automatic translation is disabled.
- Test frontend failure/secret/lifecycle handling, merchant key compatibility/revision/isolation and HTTP tenant/permission boundaries using isolated databases and fake provider requests.
- Source only. Do not publish packages, upgrade dependencies, run production migrations or change live configuration.
