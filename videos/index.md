---
layout: default
title: nav.videos # Use nav key
permalink: /videos/
lang: ja
---

# {{ 'videos.title' | t }}

{{ 'videos.description' | t }}

<div class="video-list">
  {% assign video_list_file = site.static_files | where: "path", "url-list.txt" | first %}
  {% if video_list_file %}
    {% assign video_urls = video_list_file.content | split: "
" %}
    {% assign valid_urls = "" | split: "" %} {# Initialize empty array #}

    {% for url in video_urls %}
      {% assign trimmed_url = url | strip %}
      {% unless trimmed_url == "" or trimmed_url contains "#" %} {# Ignore empty lines and comments #}
        {% assign valid_urls = valid_urls | push: trimmed_url %}
      {% endunless %}
    {% endfor %}

    {% if valid_urls.size > 0 %}
      {% for video_url in valid_urls %}
        {% assign video_id = "" %}
        {% if video_url contains "youtube.com/watch?v=" %}
          {% assign video_id = video_url | split: "v=" | last | split: "&" | first %}
        {% elsif video_url contains "youtu.be/" %}
          {% assign video_id = video_url | split: "youtu.be/" | last | split: "?" | first %}
        {% endif %}

        {% if video_id != "" %}
          <div class="video-item" style="margin-bottom: var(--spacing-unit); padding-bottom: var(--spacing-unit); border-bottom: 1px solid var(--color-border);">
            <div class="video-embed-container" style="position: relative; padding-bottom: 56.25%; /* 16:9 aspect ratio */ height: 0; overflow: hidden; max-width: 100%; background: #000; margin-bottom: 10px; border-radius: var(--border-radius);">
              <iframe
                src="https://www.youtube.com/embed/{{ video_id }}?autoplay=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                title="YouTube video player for {{ video_id }}"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
              </iframe>
            </div>
            <p style="font-size: 0.9em; text-align: center;"><a href="{{ video_url }}" target="_blank" rel="noopener noreferrer">{{ 'videos.watch_on_youtube' | t }}</a></p>
          </div>
        {% else %}
          <!-- Optional: Display invalid URL entry -->
          <!-- <p style="color: red;">Invalid YouTube URL found: {{ video_url | escape }}</p> -->
        {% endif %}
      {% endfor %}
    {% else %}
      <p>{{ 'videos.no_valid_urls' | t }}</p>
    {% endif %}
  {% else %}
    <p>{{ 'videos.no_list_file' | t }}</p>
  {% endif %}
</div>
