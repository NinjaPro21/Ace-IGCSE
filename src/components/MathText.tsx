import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { normalizeMathMarkdown } from '@/lib/mathMarkdown'

const MD_PLUGINS = {
  remark: [remarkMath],
  rehype: [rehypeKatex],
}

interface MathTextProps {
  content: string
  className?: string
  /** When true, allows block-level markdown (paragraphs, display math). */
  block?: boolean
}

export function MathText({ content, className, block = false }: MathTextProps) {
  const prepared = normalizeMathMarkdown(content)
  const Tag = block ? 'div' : 'span'

  return (
    <Tag className={className ?? (block ? 'enlight-math-block' : 'enlight-math-text')}>
      <ReactMarkdown remarkPlugins={MD_PLUGINS.remark} rehypePlugins={MD_PLUGINS.rehype}>
        {prepared}
      </ReactMarkdown>
    </Tag>
  )
}
