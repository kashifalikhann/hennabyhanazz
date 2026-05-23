import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { images } from '../../lib/images';

export default function InstagramFeed({ lang = 'en' }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-surface animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">Could not load Instagram feed</p>
        <button onClick={fetchPosts} className="btn-ghost text-sm">Retry</button>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.gallery.map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-surface">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-[9px] text-white/60">
                  {lang === 'es' ? 'Foto por' : 'Photo by'} <a href={img.creditUrl} target="_blank" rel="noopener noreferrer" class="underline hover:text-white/90 transition-colors">{img.credit}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted mt-4">
          {lang === 'es' ? 'Fotos de muestra — las fotos reales de Hanazz llegarán pronto' : 'Sample photos — Hanazz\'s actual work photos coming soon'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square rounded-xl overflow-hidden bg-surface"
        >
          <img
            src={post.media_url}
            alt={post.caption || 'Instagram post'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white text-sm font-medium">
              {lang === 'es' ? 'Ver en Instagram' : 'View on Instagram'} ↗
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
