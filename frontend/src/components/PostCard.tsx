import { useState } from 'react';
import { format } from 'date-fns';
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
    <div className="rounded-xl border border-white/10 bg-[#131A26] p-3">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
          {post.platform}
        </span>
        <span className="ml-auto text-xs text-slate-400">
          {format(new Date(post.posted_at ?? post.first_seen_at), 'PPp')}
        </span>
      </div>
      {post.text ? (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-2 block w-full text-left">
          <p className={`whitespace-pre-wrap text-sm text-slate-200 ${open ? '' : 'line-clamp-4'}`}>
            {post.text}
          </p>
        </button>
      ) : null}
      {thumbs.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {thumbs.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-20 w-20 rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
