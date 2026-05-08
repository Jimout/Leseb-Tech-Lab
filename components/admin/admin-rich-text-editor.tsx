'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'

import { Color } from '@tiptap/extension-color'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Theme tokens from `globals.css` — no hard-coded light/dark colors. */
const PRIMARY_ACCENT_COLOR = 'var(--accent)'
const YELLOW_ACCENT_COLOR = 'var(--ring)'

function currentTextColor(editor: Editor | null): string | undefined {
  if (!editor) return undefined
  const c = editor.getAttributes('textStyle').color
  return typeof c === 'string' ? c : undefined
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      className="h-8 px-2 text-foreground"
      title={title}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function AdminRichTextToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  const ink = currentTextColor(editor)
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input/60 bg-input/20 p-2">
      <ToolbarButton
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border/70" aria-hidden />
      <ToolbarButton
        title="Align left"
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Justify"
        active={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="size-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border/70" aria-hidden />
      <ToolbarButton
        title="Primary accent (theme accent token)"
        active={ink === PRIMARY_ACCENT_COLOR}
        onClick={() => editor.chain().focus().setColor(PRIMARY_ACCENT_COLOR).run()}
      >
        <span className="inline-flex items-center gap-1">
          <span
            className="size-2 rounded-full border border-border/70"
            style={{ backgroundColor: PRIMARY_ACCENT_COLOR }}
            aria-hidden
          />
          <span className="text-xs font-semibold" style={{ color: PRIMARY_ACCENT_COLOR }}>
            A1
          </span>
        </span>
      </ToolbarButton>
      <ToolbarButton
        title="Yellow accent (theme ring token, consistent across light/dark)"
        active={ink === YELLOW_ACCENT_COLOR}
        onClick={() => editor.chain().focus().setColor(YELLOW_ACCENT_COLOR).run()}
      >
        <span className="inline-flex items-center gap-1">
          <span
            className="size-2 rounded-full border border-border/70"
            style={{ backgroundColor: YELLOW_ACCENT_COLOR }}
            aria-hidden
          />
          <span className="text-xs font-semibold" style={{ color: YELLOW_ACCENT_COLOR }}>
            A2
          </span>
        </span>
      </ToolbarButton>
      <ToolbarButton
        title="Default color (inherit)"
        active={!ink}
        onClick={() => editor.chain().focus().unsetColor().run()}
      >
        <span className="text-xs font-semibold text-foreground">A</span>
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border/70" aria-hidden />
      <ToolbarButton
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
    </div>
  )
}

type Props = {
  value: string
  onChange: (html: string) => void
  className?: string
  minHeightClass?: string
}

export function AdminRichTextEditor({
  value,
  onChange,
  className,
  minHeightClass = 'min-h-[200px]',
}: Props) {
  const skipSyncAfterInternalEdit = useRef(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      TextAlign.configure({ types: ['paragraph'] }),
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose max-w-none px-3 py-2 text-sm text-foreground focus:outline-none',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6',
          minHeightClass,
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      skipSyncAfterInternalEdit.current = true
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    if (skipSyncAfterInternalEdit.current) {
      skipSyncAfterInternalEdit.current = false
      return
    }
    const next = value?.trim() ? value : '<p></p>'
    const current = editor.getHTML()
    if (next === current) return
    editor.commands.setContent(next, false)
  }, [editor, value])

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-input bg-input/30 transition-[color,box-shadow]',
        className,
      )}
    >
      <AdminRichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
