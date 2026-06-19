import { NewsArticle } from '../types';
import { CategoryChip } from './CategoryChip';

interface NewsCardProps {
  article: NewsArticle;
  onDelete?: (id: number) => void;
  canDelete?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function NewsCard({ article, onDelete, canDelete }: NewsCardProps) {
  return (
    <article className="group relative border-t-2 border-ink-800 bg-white pt-3">
      <div className="flex items-center justify-between px-4">
        <span className="dateline">
          {formatDate(article.createdAt)} · {article.authorName}
        </span>
        <CategoryChip category={article.category} />
      </div>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="mt-3 h-44 w-full object-cover"
        />
      )}

      <div className="px-4 py-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
          {article.body}
        </p>
      </div>

      {canDelete && onDelete && (
        <div className="flex justify-end border-t border-ink-100 px-4 py-2">
          <button
            onClick={() => onDelete(article.id)}
            className="font-mono text-[11px] uppercase tracking-wide text-wire opacity-0 transition-opacity hover:underline group-hover:opacity-100"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
