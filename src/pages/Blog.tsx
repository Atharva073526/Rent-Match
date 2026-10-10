import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/store';
import { Search, BookOpen, Clock, ArrowRight } from 'lucide-react';

export const Blog: React.FC = () => {
  const articles = store.getBlogArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Fair Rental Guide', 'Legal & Compliance', 'Market Transparency', 'Tenant Advice', 'Landlord Playbook'];

  const filteredArticles = articles.filter(a => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q);
    }
    return true;
  });

  const featuredArticle = articles[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Knowledge Hub
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          Rental Insights & Legal Guides
        </h1>
        <p className="text-sm text-slate-600">
          Essential reading on tenant rights, the Model Tenancy Act, security deposit escrow, and ethical housing in India.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & legal guides..."
            className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Article Card */}
      {featuredArticle && selectedCategory === 'All' && !searchQuery && (
        <Link
          to={`/blog/${featuredArticle.slug}`}
          className="group block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={featuredArticle.coverImage}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 sm:p-10 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Featured • {featuredArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 group-hover:text-teal-700 transition-colors leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {featuredArticle.summary}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>By {featuredArticle.author}</span>
                <span className="flex items-center gap-1 font-semibold text-teal-700">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            to={`/blog/${article.slug}`}
            className="group bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover overflow-hidden flex flex-col justify-between transition-all"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={article.coverImage}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2.5">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <h3 className="font-bold text-navy-900 text-sm group-hover:text-teal-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 mt-2">
              <span>{article.author}</span>
              <span>{article.readTimeMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
