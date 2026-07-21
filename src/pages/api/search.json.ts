import { getCollection } from 'astro:content';

export async function GET() {
  const acts = await getCollection('act');
  const amendments = await getCollection('amendments');
  const blogs = await getCollection('blog');
  
  // Use import.meta.glob to read raw Astro files
  const directionFiles = import.meta.glob('/src/pages/direction/*.astro', { query: '?raw', import: 'default' });
  const oldActFiles = import.meta.glob('/src/pages/old-act/*.astro', { query: '?raw', import: 'default' });

  const searchData = [];
  const baseUrl = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL;

  // Process acts
  for (const act of acts) {
    searchData.push({
      id: act.id,
      title: act.data.title,
      type: 'act',
      url: `${baseUrl}/act/${act.id}`,
      body: act.body || ''
    });
  }

  // Process amendments
  for (const amd of amendments) {
    searchData.push({
      id: amd.id,
      title: amd.data.title,
      type: 'amendment',
      url: `${baseUrl}/amendments/${amd.data.target_act}/${amd.data.version}`,
      body: amd.body || ''
    });
  }

  // Process blogs
  for (const blog of blogs) {
    searchData.push({
      id: blog.id,
      title: blog.data.title,
      type: 'blog',
      url: `${baseUrl}/blog/${blog.id}`,
      body: blog.body || ''
    });
  }

  // Helper to extract text from raw Astro content
  const extractTextFromAstro = (rawContent: string) => {
    // Remove frontmatter
    let text = rawContent.replace(/---[\s\S]*?---/, '');
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Remove script/style tags content if any (basic)
    text = text.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
    // Normalize whitespace
    text = text.replace(/\s+/g, ' ').trim();
    return text;
  };
  
  const extractTitleFromAstro = (rawContent: string, defaultTitle: string) => {
    const abbrMatch = rawContent.match(/const\s+abbr\s*=\s*["']([^"']+)["']/);
    if (abbrMatch && abbrMatch[1]) return abbrMatch[1];

    const titleMatch = rawContent.match(/const\s+title\s*=\s*["']([^"']+)["']/);
    if (titleMatch && titleMatch[1]) return titleMatch[1];
     
    const h2Match = rawContent.match(/<h2[^>]*>(.*?)<\/h2>/);
    if (h2Match && h2Match[1]) return h2Match[1].replace(/<[^>]+>/g, '').trim();
    
    return defaultTitle;
  }

  for (const path in directionFiles) {
    // skip overview or non-content if they exist, but standard .astro are fine
    const rawContent = await directionFiles[path]() as string;
    const filename = path.split('/').pop()?.replace('.astro', '') || '';
    
    const title = extractTitleFromAstro(rawContent, filename);
    const body = extractTextFromAstro(rawContent);
    searchData.push({
      id: filename,
      title: title,
      type: 'direction',
      url: `${baseUrl}/direction/${filename}`,
      body: body
    });
  }

  for (const path in oldActFiles) {
    const rawContent = await oldActFiles[path]() as string;
    const filename = path.split('/').pop()?.replace('.astro', '') || '';
    
    const title = extractTitleFromAstro(rawContent, filename);
    const body = extractTextFromAstro(rawContent);
    searchData.push({
      id: filename,
      title: title,
      type: 'old-act',
      url: `${baseUrl}/old-act/${filename}`,
      body: body
    });
  }

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
