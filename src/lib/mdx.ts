import { readFileSync } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

// 获取 MDX 文件内容
export default async function getMdxBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'src/app/mdx', `${slug}.mdx`);
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
