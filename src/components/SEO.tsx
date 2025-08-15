import { useEffect } from 'react';
import { getSiteUrl } from '@/config/site';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any> | string;
}

const setOrCreateMeta = (
  selector: { name?: string; property?: string },
  content: string | undefined
) => {
  if (!content) return;
  const attr = selector.name ? 'name' : 'property';
  const value = selector.name ?? selector.property ?? '';
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (selector.name) el.setAttribute('name', selector.name);
    if (selector.property) el.setAttribute('property', selector.property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setOrCreateLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const setOrCreateAlternate = (hreflang: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const SEO = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noIndex = false,
  structuredData,
}: SEOProps) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Basic
    if (description) setOrCreateMeta({ name: 'description' }, description);
    setOrCreateMeta({ name: 'robots' }, noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    const url = canonical ? getSiteUrl(canonical) : window.location.href;
    setOrCreateLink('canonical', url);

    // Self-referential alternates
    setOrCreateAlternate('en', url);
    setOrCreateAlternate('x-default', url);

    // Open Graph
    setOrCreateMeta({ property: 'og:title' }, title);
    if (description) setOrCreateMeta({ property: 'og:description' }, description);
    setOrCreateMeta({ property: 'og:type' }, type);
    setOrCreateMeta({ property: 'og:url' }, url);
    if (image) setOrCreateMeta({ property: 'og:image' }, getSiteUrl(image));

    // Twitter
    setOrCreateMeta({ name: 'twitter:card' }, image ? 'summary_large_image' : 'summary');
    setOrCreateMeta({ name: 'twitter:title' }, title);
    if (description) setOrCreateMeta({ name: 'twitter:description' }, description);
    if (image) setOrCreateMeta({ name: 'twitter:image' }, getSiteUrl(image));

    // Structured Data
    const existing = document.getElementById('seo-ld-json');
    if (existing) existing.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-ld-json';
      const json = typeof structuredData === 'string' ? structuredData : JSON.stringify(structuredData);
      script.textContent = json;
      document.head.appendChild(script);
    }
  }, [title, description, canonical, image, type, noIndex, structuredData]);

  return null;
};

export default SEO;


