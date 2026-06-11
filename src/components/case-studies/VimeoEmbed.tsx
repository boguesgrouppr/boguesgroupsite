import { getVimeoEmbedUrl } from "@/lib/case-studies-shared";

interface VimeoEmbedProps {
  videoUrl: string;
  title: string;
}

export default function VimeoEmbed({ videoUrl, title }: VimeoEmbedProps) {
  const embedUrl = getVimeoEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
