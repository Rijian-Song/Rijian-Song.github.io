---
layout: page
title: Research
permalink: /research/
description: Injectable hydrogel networks, tissue interfaces, and local environments for repair.
nav: true
nav_order: 1
display_categories: [research]
horizontal: false
---

I design injectable hydrogels by linking **polymer network architecture, tissue adhesion, and the local biological environment**. Hyaluronic acid (HA) is a central building block in my work: its chemistry provides a way to connect how a material forms and carries load with how it retains therapeutic cargo and interacts with injured tissue.

My research at University College Dublin and my development work at Blafar connect these questions across scales—from functionalised polymers and in situ gelation to wound repair and reproducible formulations. The four directions below bring together published work and the questions I want to pursue next.

<div class="projects research-projects">
{% if site.enable_project_categories and page.display_categories %}
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}
{% else %}
  {% assign sorted_projects = site.projects | sort: "importance" %}
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>

## Where I want to take this work

My next focus is to connect **mechanics that evolve during healing, durable tissue attachment, and the timing of local therapy**. A longer-term direction is to use structured formulation and performance data to guide material design: predicting which experiments are most informative while keeping injectability, biological compatibility, and manufacturing constraints in view.

I welcome collaborations in polymer chemistry, quantitative cell–material interactions, wound biology, and translational development.
