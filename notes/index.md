---
layout: default
title: nav.notes # Use nav key
permalink: /notes/
lang: ja
---

# {{ 'notes.title' | t }}

{{ 'notes.description' | t }}

<div class="note-articles-list">
  {% if site.data.notes and site.data.notes.size > 0 %}
    {% assign sorted_notes = site.data.notes | sort: 'publish_at' | reverse %}
    {% for note in sorted_notes %}
      <article class="note-article-item" style="margin-bottom: calc(var(--spacing-unit) * 1.5); padding-bottom: var(--spacing-unit); border-bottom: 1px solid var(--color-border);">
        <h2><a href="{{ note.note_url }}" target="_blank" rel="noopener noreferrer">{{ note.name | escape }}</a></h2>
        {% if note.eyecatch %}
          <a href="{{ note.note_url }}" target="_blank" rel="noopener noreferrer" style="display: block; margin-bottom: calc(var(--spacing-unit) / 2);">
            <img src="{{ note.eyecatch }}" alt="{{ note.name | escape }} thumbnail" style="max-width: 100%; height: auto; border-radius: var(--border-radius);">
          </a>
        {% endif %}
        <p style="font-size: 0.9em; opacity: 0.8;">{{ 'notes.published_date' | t }}: {{ note.publish_at | date: "%Y-%m-%d" }}</p> {# Consider locale-aware date formatting later #}
        {% if note.body %}
          <p>{{ note.body | strip_html | truncatewords: 50 }}</p> {# Display a truncated summary #}
        {% endif %}
        <a href="{{ note.note_url }}" target="_blank" rel="noopener noreferrer" class="read-more-link">{{ 'notes.read_more' | t }}</a>
      </article>
    {% endfor %}
  {% else %}
    <p>{{ 'notes.no_articles' | t }}</p>
    <!-- Placeholder for when _data/notes.yml is empty or doesn't exist -->
    <p><em>{{ 'notes.placeholder' | t }}</em></p>
  {% endif %}
</div>
