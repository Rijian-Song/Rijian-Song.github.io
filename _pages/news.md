---
layout: page
title: News
permalink: /news/
nav: true
nav_order: 3
---

{% assign updates = site.news | sort: 'date' | reverse %}
{% for item in updates %}

<article>
  <p><time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: '%-d %B %Y' }}</time></p>
  <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
  {{ item.content }}
</article>
{% else %}
There are no news updates at the moment.
{% endfor %}
