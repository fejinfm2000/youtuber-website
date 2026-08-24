import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly BASE_TITLE = 'CreatorHub — Alex Creator';

  constructor(private title: Title, private meta: Meta) {}

  setPage(config: SeoConfig): void {
    const fullTitle = config.title
      ? `${config.title} | Alex Creator`
      : this.BASE_TITLE;

    this.title.setTitle(fullTitle);

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    if (config.type) {
      this.meta.updateTag({ property: 'og:type', content: config.type });
    }
  }

  setDefault(): void {
    this.setPage({
      title: undefined,
      description: 'Alex Creator — Tech, AI & Software content. Watch videos, explore recommendations, join the community.',
      type: 'website',
    });
  }
}
