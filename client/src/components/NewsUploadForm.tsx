import { FormEvent, useRef, useState } from 'react';
import { NEWS_CATEGORIES, NewsCategory } from '../types';
import { createNewsRequest } from '../api/news';
import { getErrorMessage } from '../api/client';
import { AlertBanner } from './AlertBanner';

interface NewsUploadFormProps {
  onPublished?: () => void;
}

export function NewsUploadForm({ onPublished }: NewsUploadFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NewsCategory>('politics');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  function resetForm() {
    setTitle('');
    setBody('');
    setCategory('politics');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await createNewsRequest({ title, body, category, image });
      setSuccess('Article published.');
      resetForm();
      onPublished?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-ink-200 bg-white p-6">
      <p className="dateline mb-4">New dispatch</p>

      {error && (
        <div className="mb-4">
          <AlertBanner variant="error" onDismiss={() => setError(null)}>
            {error}
          </AlertBanner>
        </div>
      )}
      {success && (
        <div className="mb-4">
          <AlertBanner variant="success" onDismiss={() => setSuccess(null)}>
            {success}
          </AlertBanner>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="label-text">
          Headline
        </label>
        <input
          id="title"
          required
          minLength={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Council approves new transit line"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="label-text">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as NewsCategory)}
          className="input-field"
        >
          {NEWS_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="body" className="label-text">
          Story
        </label>
        <textarea
          id="body"
          required
          minLength={10}
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input-field resize-none"
          placeholder="Write the full story here…"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="image" className="label-text">
          Image (optional)
        </label>
        <input
          id="image"
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleImageChange}
          className="block w-full text-sm text-ink-600 file:mr-4 file:rounded-sm file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-ink-700 hover:file:bg-ink-200"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 h-40 w-full max-w-xs object-cover"
          />
        )}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Publishing…' : 'Publish article'}
      </button>
    </form>
  );
}
