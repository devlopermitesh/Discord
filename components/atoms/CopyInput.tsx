import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
interface CopyInputProps {
  value: string
  label?: string
}

export function CopyInput({ value, label }: CopyInputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2s
  }

  return (
    <div className="space-y-2 text-primary">
      {label && <label className="text-sm font-medium text-primary">{label}</label>}
      <div className="flex items-center gap-0 rounded-md overflow-hidden border border-discord-border focus-within:border-discord-blurple focus-within:ring-2 focus-within:ring-discord-blurple/30 transition-all">
        {/* Static readonly input */}
        <Input
          type="text"
          value={value}
          readOnly
          disabled
          className={cn(
            'border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0',
            'bg-primary-foreground text-primary placeholder-gray-500',
            'pr-0' // Remove right padding since button overlaps
          )}
        />

        {/* Copy Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-full rounded-l-none border-l border-discord-border px-4 hover:bg-discord-darker transition-colors"
        >
          {copied ? (
            <span className="text-green-400 text-sm">Copied!</span>
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
    </div>
  )
}
