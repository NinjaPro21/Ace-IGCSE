import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface MathTextProps {
  content: string
  className?: string
}

export function MathText({ content, className }: MathTextProps) {
  return (
    <span className={className ?? 'enlight-math-text'}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </span>
  )
}
