import getMdxBySlug from '@/lib/mdx';

export default async function MdxPage() {
  const { content, frontmatter: formatter } = await getMdxBySlug('my-first-blog');

  return (
    <article className="prose prose-lg max-w-3xl mx-auto py-8">
      <h1>{formatter.title as string}</h1>
      <div>{content}</div>
    </article>
  );
}
