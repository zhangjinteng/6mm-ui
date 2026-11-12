# Shared translation settings entry

Use one `MmTranslationSettingsButton` across tag translations, CMS content translations and SEO translations, consumed by both Agent and Platform. It retains the small default `MmButton`, success-colored decorative dot, Chinese `翻译设置` / English `Translation settings`, trailing 15px `settings-2` icon and centered inline-flex label.

Only presentation is shared. Each caller retains its visibility, disabled conditions, click handler, API and tenant/permission scope. No key, settings row or status is fetched by the button itself. The decorative dot matches the requested design and is not a credential-health indicator. The tag details drawer uses the same entry without inheriting its unrelated grid-action styling.

Verify shared geometry/alignment, disabled and click behavior, tag integration, SEO drafts/settings, and CMS platform/white-label permission cases. Do not publish packages, upgrade dependencies or change business data.
