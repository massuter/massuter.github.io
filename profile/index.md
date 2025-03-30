---
layout: default
title: nav.profile # Use nav key
permalink: /profile/
lang: ja
---

# {{ 'profile.title' | t }}

## {{ site.author.name }} ({{ site.author.id }})

{{ 'profile.intro' | t }}

<!-- Add more descriptive text about the streamer here if desired -->

## {{ 'profile.links_title' | t }}

{{ 'profile.links_intro' | t }}

<ul class="profile-links-list" style="list-style: none; padding-left: 0;">
  {% for link in site.data.sns-links.links %}
    <li style="margin-bottom: 15px; display: flex; align-items: center;">
      <img src="{{ '/assets/images/icons/' | append: link.icon | relative_url }}" alt="{{ link.platform }}" style="height: 24px; width: 24px; margin-right: 15px; vertical-align: middle; filter: var(--logo-filter);">
      <a href="{{ link.url }}" target="_blank" rel="noopener noreferrer" style="font-size: 1.1em;">
        {{ link.platform }}
      </a>
    </li>
  {% endfor %}
</ul>
