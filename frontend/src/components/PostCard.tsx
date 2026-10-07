import { useState } from 'react';
import { format } from 'date-fns';
import { Badge, Card, Text } from '@radix-ui/themes';
import type { Post } from '../lib/api';

function media(post: Post): string[] {
  if (!post.media_urls) return [];
  try {
    const v: unknown = JSON.parse(post.media_urls);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export default function PostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const thumbs = media(post);
  return (
    <Card size="2">
      <div className="flex items-center gap-2">
        <Badge color="gray" variant="soft">
          {post.platform}
        </Badge>
        <Text size="1" color="gray" className="ml-auto">
          {format(new Date(post.posted_at ?? post.first_seen_at), 'PPp')}
        </Text>
      </div>
      {post.text ? (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-2 block w-full text-left">
          <Text
            as="p"
            size="2"
            className={`whitespace-pre-wrap ${open ? '' : 'line-clamp-4'}`}
          >
            {post.text}
          </Text>
        </button>
      ) : null}
      {thumbs.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {thumbs.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-20 w-20 rounded-[var(--radius-3)] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
