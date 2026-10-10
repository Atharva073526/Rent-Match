import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { store } from '../services/store';
import { ArrowLeft, Clock, Share2, User } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = store.getBlogArticleBySlug(slug || '');
  const allArticles = store.getBlogArticles();

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Article Not Found</h2>
        <Link to="/blog" className="text-teal-700 font-bold underline text-xs">
          Return to Knowledge Hub
        </Link>
      </div>
    );
  }

  const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900"
      >
        <ArrowLeft className="w-4 h-4" /> All Articles
      </Link>

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-b border-slate-200 pb-4">
          <span className="font-semibold text-navy-900">{article.author} ({article.authorRole})</span>
          <span>•</span>
          <span>Published on {article.publishedAt}</span>
          <span>•</span>
          <span>{article.readTimeMinutes} min read</span>
        </div>
      </div>

      <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100">
        <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Article Content */}
      <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 whitespace-pre-line">
        {article.content}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-2">
        {article.tags.map((tag, i) => (
          <span key={i} className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
            #{tag}
          </span>
        ))}
      </div>

      {/* Related Articles */}
      <div className="pt-10 border-t border-slate-200 space-y-4">
        <h3 className="font-bold text-navy-900 text-base">Related Reading</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.id}
              to={`/blog/${rel.slug}`}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 space-y-2 block"
            >
              <span className="text-[10px] font-bold text-teal-700 uppercase">{rel.category}</span>
              <h4 className="font-bold text-navy-900 text-xs line-clamp-2">{rel.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">{rel.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};
