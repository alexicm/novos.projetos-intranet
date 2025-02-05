import type React from "react"

interface ZoomableTextProps {
  children: React.ReactNode
  className?: string
}

const ZoomableText: React.FC<ZoomableTextProps> = ({ children, className }) => {
  return (
    <div className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500`} tabIndex={0}>
      {children}
    </div>
  )
}

export default ZoomableText

