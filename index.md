---
layout: default
title: nav.home # Use nav key for title consistency
permalink: /
lang: ja
# No need for explicit permalink for default language homepage if configured correctly
---

# {{ site.title }} {{ 'general.welcome_message' | t }}

{{ site.data[page.lang].seo.description | default: site.description }}

<!-- Placeholder content - This will be replaced with more dynamic content later -->

## {{ 'general.latest_info' | t }}

*   **{{ 'nav.notes' | t }}:** [{{ 'general.check_latest_notes' | t }}]({{ '/notes/' | localize_url }})
*   **{{ 'nav.videos' | t }}:** [{{ 'general.check_recent_videos' | t }}]({{ '/videos/' | localize_url }})
*   **{{ 'nav.gallery' | t }}:** [{{ 'general.check_gallery' | t }}]({{ '/gallery/' | localize_url }})

{{ 'general.please_browse' | t }}
