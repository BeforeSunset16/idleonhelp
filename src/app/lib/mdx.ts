import { readFileSync } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

export default async function getMdxBySlug(slug: string, directory: string = 'mdx') {
  const filePath = path.join(process.cwd(), 'src/app', directory, `${slug}.mdx`);
  const fileContent = readFileSync(filePath, 'utf8');

  const { content, frontmatter } = await compileMDX({
    source: fileContent,
    options: {
      parseFrontmatter: true,
    },
    components: {},
  });

  return { content, frontmatter };
}
