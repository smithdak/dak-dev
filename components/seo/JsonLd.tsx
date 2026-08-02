import { serializeJsonLd } from '@/lib/json-ld';

/**
 * JsonLd Component
 * Injects Schema.org JSON-LD structured data into the page head
 */

interface JsonLdProps {
  data: object;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
