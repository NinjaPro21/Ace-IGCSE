import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { prepareMathContent } from '@/lib/mathMarkdown'

const MD_PLUGINS = {
  remark: [remarkMath],
  rehype: [rehypeKatex],
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
      <ReactMarkdown remarkPlugins={MD_PLUGINS.remark} rehypePlugins={MD_PLUGINS.rehype}>
        {prepared}
      </ReactMarkdown>
    </Tag>
  )
}
