import React from 'react';

/**
 * A simple component that converts basic markdown-like syntax into JSX.
 * Supports:
 * **text** -> bold
 * *text* -> italic
 * \n -> <br />
 * [text](url) -> anchor
 */
export default function RichTextRenderer({ text, className = "" }) {
  if (!text) return null;

  // Split by potential markers but keep the markers for processing
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

  return (
    <div className={`whitespace-pre-wrap break-words ${className}`}>
      {parts.map((part, index) => {
        // Bold: **text**
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-black text-primary">{part.slice(2, -2)}</strong>;
        }
        
        // Italic: *text*
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={index} className="italic italic-primary-light">{part.slice(1, -1)}</em>;
        }

        // Link: [text](url)
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a 
              key={index} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary-hover underline underline-offset-4 font-bold decoration-primary-hover/30 hover:decoration-primary-hover"
            >
              {linkMatch[1]}
            </a>
          );
        }

        // Plain text
        return part;
      })}
    </div>
  );
}
