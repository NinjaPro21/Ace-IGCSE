import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

// Decode HTML entities that may have been introduced during JSON authoring.
// remark-math cannot parse &gt; or &lt; inside $...$ delimiters.
function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
}

interface MathTextProps {
  content: string
  className?: string
}

export function MathText({ content, className }: MathTextProps) {
  const decoded = decodeHTMLEntities(content)
  return (
    <span className={className ?? 'enlight-math-text'}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {decoded}
      </ReactMarkdown>
    </span>
  )
}
