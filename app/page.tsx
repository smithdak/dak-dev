import { EditorialHomepage } from '@/components/editorial/EditorialHomepage';
import { JsonLd } from '@/components/seo/JsonLd';
import { HARNESS_CHAPTERS } from '@/lib/harness-types';
import { getAllPatterns } from '@/lib/patterns';
import { getAllPosts } from '@/lib/posts';
import { getAllProducts } from '@/lib/products';
import { generateWebSiteSchema } from '@/lib/schema';
import { SECURITY_CHAPTERS } from '@/lib/security-types';
import { TOOLKIT_LENSES, TOOLKIT_TOPICS } from '@/lib/toolkit-types';

export const metadata = {
  title: 'Dakota Smith | Principal Architect',
  description:
    'Principal architect writing about accountable AI systems, innovation strategy, and governed delivery.',
  alternates: { canonical: '/' },
};

export default async function Home() {
  const allPosts = getAllPosts();
  const allProducts = await getAllProducts();
  const featuredPost = allPosts.find((post) => post.frontmatter.featured) ?? allPosts[0] ?? null;
  const fieldPageCount =
    getAllPatterns().length +
    TOOLKIT_TOPICS.length +
    TOOLKIT_TOPICS.length * TOOLKIT_LENSES.length +
    HARNESS_CHAPTERS.length +
    SECURITY_CHAPTERS.length;

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <EditorialHomepage
        featuredPost={featuredPost}
        publicationRecord={{
          analyses: allPosts.length,
          fieldPages: fieldPageCount,
          systems: allProducts.length,
        }}
      />
    </>
  );
}
