import { openai } from '@ai-sdk/openai';
import { generateText } from "ai";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const systemPrompt = `
You are a professional describer.

Rules:
- Describe only the important content.
- Ignore ads, navigation menus, sidebars, footers, headers, cookie banners and decorative elements.
- Return detailed description.
- Focus on key topics, facts and conclusions.
- No Markdown, only plain text
- Don't assume informations on your own, rather consume from the given data 
`;

export async function extractURLHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    const dom = new JSDOM(html, {
      url,
    });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (article?.textContent) {
      return article.textContent.trim();
    }

    return dom.window.document.body.textContent?.trim() || "";
  } catch (error) {
    console.error(error);
    throw new Error("Failed to extract content from URL");
  }
}

async function getURLSummary(content: string) {
  const result = await generateText({
    model: openai("gpt-5-mini"),
    system: systemPrompt,
    prompt: `
Summarize the following content.

CONTENT:
${content.slice(0, 50000)}
`,
  });

  return result.text;
}

export async function summarizeURL(url: string) {
  const content = await extractURLHtml(url);

  if (!content) {
    throw new Error("No readable content found");
  }

  return getURLSummary(content);
}