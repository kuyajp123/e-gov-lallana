import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    Undo,
    Unlink,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Compose announcement body, advisory text, or meeting minutes...',
    className,
    editable = true,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-2 hover:opacity-80 transition-opacity',
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass:
                    'before:content-[attr(data-placeholder)] before:text-muted-foreground/60 before:float-left before:pointer-events-none before:h-0',
            }),
        ],
        content: value,
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();

            // If completely empty, emit empty string
            if (editor.isEmpty) {
                onChange('');
            } else {
                onChange(html);
            }
        },
        editorProps: {
            attributes: {
                class: 'min-h-[220px] max-w-none p-4 focus:outline-hidden text-sm leading-relaxed text-foreground [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3.5 [&_li]:mb-1 [&_blockquote]:border-l-3 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-3.5 [&_blockquote]:text-muted-foreground [&_hr]:my-4 [&_hr]:border-border',
            },
        },
    });

    // Synchronize value if external value changes (e.g. form reset or prefill)
    useEffect(() => {
        if (!editor) {
            return;
        }

        const currentHtml = editor.getHTML();

        if (value !== currentHtml && (value || !editor.isEmpty)) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt(
            'Enter link URL (e.g. https://...):',
            previousUrl,
        );

        // cancelled
        if (url === null) {
            return;
        }

        // empty -> unset
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        // update
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border border-input bg-card shadow-2xs transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
                !editable && 'cursor-not-allowed opacity-70',
                className,
            )}
        >
            {editable && (
                <div className="flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/30 p-1.5">
                    <Button
                        type="button"
                        variant={
                            editor.isActive('bold') ? 'secondary' : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={
                            editor.isActive('italic') ? 'secondary' : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={
                            editor.isActive('strike') ? 'secondary' : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Button>

                    <div className="mx-1 h-4 w-px bg-border" />

                    <Button
                        type="button"
                        variant={
                            editor.isActive('heading', { level: 2 })
                                ? 'secondary'
                                : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={
                            editor.isActive('heading', { level: 3 })
                                ? 'secondary'
                                : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 3 })
                                .run()
                        }
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </Button>

                    <div className="mx-1 h-4 w-px bg-border" />

                    <Button
                        type="button"
                        variant={
                            editor.isActive('bulletList')
                                ? 'secondary'
                                : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={
                            editor.isActive('orderedList')
                                ? 'secondary'
                                : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={
                            editor.isActive('blockquote')
                                ? 'secondary'
                                : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        title="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                        }
                        title="Divider Line"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <div className="mx-1 h-4 w-px bg-border" />

                    <Button
                        type="button"
                        variant={
                            editor.isActive('link') ? 'secondary' : 'ghost'
                        }
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={setLink}
                        title="Insert Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    {editor.isActive('link') && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-xs text-destructive hover:text-destructive"
                            onClick={() =>
                                editor.chain().focus().unsetLink().run()
                            }
                            title="Remove Link"
                        >
                            <Unlink className="h-4 w-4" />
                        </Button>
                    )}

                    <div className="ml-auto flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-xs"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-xs"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <EditorContent editor={editor} />
        </div>
    );
}
