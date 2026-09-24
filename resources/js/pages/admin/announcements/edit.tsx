import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Eye, Megaphone, UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import InputError from '@/shared/components/input-error';
import { RichTextEditor } from '@/shared/components/rich-text-editor';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

interface EditAnnouncementProps {
    announcement: {
        id: number;
        title: string;
        slug: string;
        category: string;
        excerpt: string | null;
        content: string;
        is_published: boolean;
        published_at: string | null;
        banner_url: string | null;
    };
    categories: string[];
}

export default function EditAnnouncement({
    announcement,
    categories,
}: EditAnnouncementProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        announcement.banner_url,
    );

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        slug: string;
        category: string;
        excerpt: string;
        content: string;
        banner: File | null;
        is_published: boolean;
        published_at: string;
        remove_banner: boolean;
        _method: string;
    }>({
        title: announcement.title,
        slug: announcement.slug,
        category: announcement.category,
        excerpt: announcement.excerpt ?? '',
        content: announcement.content,
        banner: null,
        is_published: announcement.is_published,
        published_at: announcement.published_at ?? '',
        remove_banner: false,
        _method: 'put',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData((prev) => ({
                ...prev,
                banner: file,
                remove_banner: false,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBanner = () => {
        setData((prev) => ({
            ...prev,
            banner: null,
            remove_banner: true,
        }));
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/announcements/${announcement.id}`, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head
                title={`Edit Announcement: ${announcement.title} | Admin Console`}
            />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                {/* Back button, view public, and title */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="-ml-2 text-muted-foreground hover:text-foreground"
                        >
                            <Link href="/admin/announcements">
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Back to Announcements
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                        >
                            <Link
                                href={`/announcements/${announcement.slug}`}
                                target="_blank"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                View Public Page
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                Edit Announcement
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Update announcement information, article body,
                                or scheduling.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* Left & Middle: Article Content */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold">
                                    Article Information
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Edit headline, slug, category, and excerpt
                                    summary.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="title"
                                        className="text-xs font-semibold"
                                    >
                                        Title{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="h-10 text-sm"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                {/* Custom Slug */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="slug"
                                        className="text-xs font-semibold"
                                    >
                                        URL Slug (Optional Custom Identifier)
                                    </Label>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-xs text-muted-foreground">
                                            /announcements/
                                        </span>
                                        <Input
                                            id="slug"
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData('slug', e.target.value)
                                            }
                                            className="h-8 font-mono text-xs"
                                            placeholder="leave blank to auto-generate from title"
                                        />
                                    </div>
                                    <InputError message={errors.slug} />
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="category"
                                        className="text-xs font-semibold"
                                    >
                                        Category{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() =>
                                                    setData('category', cat)
                                                }
                                                className={`flex items-center justify-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium capitalize transition-all ${
                                                    data.category === cat
                                                        ? 'border-primary bg-primary/10 font-semibold text-primary ring-1 ring-primary'
                                                        : 'border-border/70 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                }`}
                                            >
                                                {data.category === cat && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.category} />
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="excerpt"
                                            className="text-xs font-semibold"
                                        >
                                            Short Excerpt / Teaser
                                        </Label>
                                        <span className="text-2xs text-muted-foreground">
                                            {data.excerpt.length}/500
                                        </span>
                                    </div>
                                    <Textarea
                                        id="excerpt"
                                        placeholder="Brief summary..."
                                        rows={3}
                                        maxLength={500}
                                        value={data.excerpt}
                                        onChange={(e) =>
                                            setData('excerpt', e.target.value)
                                        }
                                        className="text-xs"
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rich Text Body Card */}
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Announcement Body{' '}
                                    <span className="text-destructive">*</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Update full announcement details and
                                    formatting.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <RichTextEditor
                                    value={data.content}
                                    onChange={(html) =>
                                        setData('content', html)
                                    }
                                    placeholder="Write announcement content..."
                                />
                                <InputError message={errors.content} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Publication & Banner Media */}
                    <div className="flex flex-col gap-6">
                        {/* Publication Status Card */}
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Publishing Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2 rounded-lg border border-border/70 bg-muted/20 p-3">
                                    <Checkbox
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'is_published',
                                                Boolean(checked),
                                            )
                                        }
                                    />
                                    <div className="grid gap-1 leading-none">
                                        <Label
                                            htmlFor="is_published"
                                            className="cursor-pointer text-xs font-semibold"
                                        >
                                            Published to Public
                                        </Label>
                                        <p className="text-2xs text-muted-foreground">
                                            Uncheck to revert to internal draft
                                            mode.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="published_at"
                                        className="text-xs font-semibold"
                                    >
                                        Publish Date & Time
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) =>
                                                setData(
                                                    'published_at',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                    <p className="text-2xs text-muted-foreground">
                                        Controls sorting and publication
                                        timeline.
                                    </p>
                                    <InputError message={errors.published_at} />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="h-10 w-full gap-2 font-medium shadow-xs"
                                        disabled={processing}
                                    >
                                        <Megaphone className="h-4 w-4" />
                                        {processing
                                            ? 'Saving changes...'
                                            : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Banner Image Card */}
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Featured Banner
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Replace or remove the current banner image.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="space-y-2">
                                        <div className="relative overflow-hidden rounded-xl border border-border/80">
                                            <img
                                                src={previewUrl}
                                                alt="Cover preview"
                                                className="h-44 w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md"
                                                onClick={handleRemoveBanner}
                                                title="Remove banner"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
                                            Change Banner Image
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                                    >
                                        <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
                                            <UploadCloud className="h-5 w-5" />
                                        </div>
                                        <p className="mt-2 text-xs font-semibold text-foreground">
                                            Upload cover banner
                                        </p>
                                        <p className="text-2xs mt-0.5 text-muted-foreground">
                                            PNG, JPG or WEBP up to 5MB
                                        </p>
                                    </div>
                                )}

                                <InputError message={errors.banner} />
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}
