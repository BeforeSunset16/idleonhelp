import { Container } from '@mantine/core';
import getMdxBySlug from '@/app/lib/mdx';
import classes from './mdx.module.css';

export default async function MdxPage() {
  const { content, frontmatter } = await getMdxBySlug('how-to-create-a-blog-post');

  return (
    <Container size="xl" className={classes.container}>
      <article>
        <h1>{frontmatter.title as string}</h1>
        <div>{content}</div>
      </article>
    </Container>
  );
}
