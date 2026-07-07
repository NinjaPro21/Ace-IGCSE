import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { prepareMathContent } from '@/lib/mathMarkdown'

const MD_PLUGINS = {
  remark: [remarkMath],
  rehype: [rehypeKatex],
}

/** Inline mode must not emit block elements (avoids <p> inside <p> hydration crashes). */
const INLINE_MD_COMPONENTS: Components = {
  p: ({ children }) => <span className="enlight-math-para">{children}</span>,
  ul: ({ children }) => <span className="enlight-math-list">{children}</span>,
  ol: ({ children }) => <span className="enlight-math-list">{children}</span>,
  li: ({ children }) => <span className="enlight-math-list-item">{children}</span>,
}

interface MathTextProps {
  content: string
  className?: string
  /** When true, allows block-level markdown (paragraphs, display math). */
  block?: boolean
  /** When true, wraps bare fractions/functions in titles. */
  title?: boolean
}

export function MathText({ content, className, block = false, title = false }: MathTextProps) {
  const prepared = prepareMathContent(content, title ? 'title' : 'quiz')
  const Tag = block ? 'div' : 'span'

  return (
    <Tag className={className ?? (block ? 'enlight-math-block' : 'enlight-math-text')}>
      <ReactMarkdown
        remarkPlugins={MD_PLUGINS.remark}
        rehypePlugins={MD_PLUGINS.rehype}
        components={block ? undefined : INLINE_MD_COMPONENTS}
      >
        {prepared}
      </ReactMarkdown>
    </Tag>
  )
}
