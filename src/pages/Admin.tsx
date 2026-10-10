import React, { useState } from 'react';
import { store } from '../services/store';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  Sliders, 
  BookOpen, 
  History, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export const Admin: React.FC = () => {
  const currentUser = store.getCurrentUser();

  // Authorisation guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-card">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-navy-900">Admin Authorization Required</h2>
        <p className="text-xs text-slate-500">
          This portal is restricted to authorized platform ethics officers and verification staff.
        </p>
        <button
          onClick={() => store.switchUser('user_admin_1')}
          className="px-5 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
        >
          Switch to Admin Persona (Vikram Adiga)
        </button>
      </div>
    );
  }

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'metrics' | 'verifications' | 'moderation' | 'reports' | 'algorithm' | 'blog' | 'audit'>('metrics');

  const metrics = store.getPlatformMetrics();
  const verifications = store.getVerifications();
  const reports = store.getReports();
  const properties = store.getProperties();
  const auditLogs = store.getAuditLogs();
  const articles = store.getBlogArticles();

  // Algorithm weights state
  const [weights, setWeights] = useState(store.getAlgorithmWeights());
  const [weightsSaved, setWeightsSaved] = useState(false);

  // New Blog Article Modal State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategory, setArticleCategory] = useState<'Fair Rental Guide' | 'Legal & Compliance' | 'Market Transparency'>('Fair Rental Guide');

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights({ ...weights, [key]: value });
  };

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = weights.budgetWeight + weights.locationWeight + weights.moveInWeight + weights.propertyTypeWeight + weights.amenitiesWeight + weights.lifestyleWeight;
    if (sum !== 100) {
      alert(`Weights must sum to 100%. Current sum: ${sum}%`);
      return;
    }
    store.updateAlgorithmWeights(weights);
    setWeightsSaved(true);
    setTimeout(() => setWeightsSaved(false), 2000);
  };

  const handleReviewVerification = (id: string, status: 'verified' | 'failed', notes: string) => {
    store.reviewVerification(id, status, notes);
  };

  const handleResolveReport = (id: string, status: 'action_taken' | 'resolved' | 'dismissed') => {
    store.resolveReport(id, status, `Reviewed and resolved by ${currentUser.name}`);
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;

    store.createBlogArticle({
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: articleTitle,
      category: articleCategory,
      summary: articleSummary,
      content: articleContent,
      author: currentUser.name,
      authorRole: 'Platform Staff',
      readTimeMinutes: 5,
      publishedAt: new Date().toISOString().split('T')[0],
      tags: ['Admin Published', 'Rental Fairness'],
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    });

    setShowArticleModal(false);
    setArticleTitle('');
    setArticleSummary('');
    setArticleContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Platform Administration & Trust Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
              Staff Level 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'metrics' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'verifications' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Verifications ({verifications.filter(v => v.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'moderation' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'reports' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Reports ({reports.filter(r => r.status === 'submitted').length})
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'algorithm' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Algorithm Tuning
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'blog' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'audit' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE PLATFORM METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-semibold block mb-1">Total Users</span>
              <span className="text-3xl font-black text-navy-900">{metrics.totalUsers}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-semibold block mb-1">Active Published Listings</span>
              <span className="text-3xl font-black text-teal-700">{metrics.activeListings}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-semibold block mb-1">Established Mutual Matches</span>
              <span className="text-3xl font-black text-emerald-600">{metrics.activeMatches}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-xs font-semibold block mb-1">Active Leases</span>
              <span className="text-3xl font-black text-blue-600">{metrics.activeLeases}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Pending Verifications</span>
              <span className="text-2xl font-black text-amber-600 block">{metrics.pendingVerifications}</span>
              <p className="text-xs text-slate-500">Awaiting document inspection by Trust Desk.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Open User Reports</span>
              <span className="text-2xl font-black text-rose-600 block">{metrics.openReports}</span>
              <p className="text-xs text-slate-500">Rental bidding demands or suspicious accounts.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Monthly Rental Volume Tracked</span>
              <span className="text-2xl font-black text-navy-900 block">₹{(metrics.activeRentVolumeInr / 100000).toFixed(1)} Lakhs</span>
              <p className="text-xs text-slate-500">Transacted under fair tenancy terms.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-sm">Identity & Property Verification Requests</h3>
            <span className="text-xs text-slate-500">UIDAI Masked & BBMP Tax Check Targets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifications.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-navy-900">
                      {req.userName}
                      <span className="block text-[11px] text-slate-400 font-normal">{req.userEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 capitalize">{req.userRole}</td>
                    <td className="py-3.5 px-4 font-medium capitalize">{req.verificationType.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4">
                      {req.documents.map((d) => (
                        <span key={d.id} className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] mr-1">
                          {d.documentName}
                        </span>
                      ))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'verified' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status !== 'verified' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleReviewVerification(req.id, 'verified', 'Verified against official municipal tax & identity database')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewVerification(req.id, 'failed', 'Submitted documents unclear or illegible')}
                            className="px-3 py-1 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROPERTY MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-sm">Platform Property Catalog</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Media Authenticity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3.5 px-4 font-bold text-navy-900">
                      {p.title}
                      <span className="block text-[11px] text-slate-500 font-normal">{p.locality}, {p.city}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">₹{p.rent.toLocaleString('en-IN')}/mo</td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-slate-700">{p.status}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">{p.verificationStatus}</td>
                    <td className="py-3.5 px-4 text-teal-700">{p.c2paAuthentic ? 'C2PA Verified' : 'Standard'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => store.togglePropertyStatus(p.id)}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUSPICIOUS REPORTS & DISPUTES */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-sm">Suspicious Activity & Anti-Bidding Reports</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-600 uppercase tracking-wider">{rep.reason.replace('_', ' ')}</span>
                    <span className="text-slate-400">• Ref: {rep.id}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                    {rep.status}
                  </span>
                </div>

                <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {rep.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Reported by: {rep.reporterName} • Target: {rep.reportedPropertyTitle || rep.reportedUserName || 'Listing'}
                  </span>
                  {rep.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'action_taken')}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px]"
                      >
                        Suspend / Action
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1 border border-slate-300 text-slate-600 rounded-lg text-[11px]"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ALGORITHM TUNING */}
      {activeTab === 'algorithm' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900 text-base">Mutual Merit Compatibility Weights Tuning</h3>
              <p className="text-xs text-slate-500">
                Adjust transparent factor weights in the scoring engine. Total must sum to 100%.
              </p>
            </div>
            {weightsSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Weights Saved & Applied to Live Engine!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveWeights} className="space-y-4 max-w-xl">
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Budget Compatibility Weight</span>
                  <span>{weights.budgetWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={weights.budgetWeight}
                  onChange={(e) => handleWeightChange('budgetWeight', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Location Proximity Weight</span>
                  <span>{weights.locationWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.locationWeight}
                  onChange={(e) => handleWeightChange('locationWeight', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Move-In Date Alignment Weight</span>
                  <span>{weights.moveInWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={weights.moveInWeight}
                  onChange={(e) => handleWeightChange('moveInWeight', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Property Type & Layout Weight</span>
                  <span>{weights.propertyTypeWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={weights.propertyTypeWeight}
                  onChange={(e) => handleWeightChange('propertyTypeWeight', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Essential Amenities Weight</span>
                  <span>{weights.amenitiesWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={weights.amenitiesWeight}
                  onChange={(e) => handleWeightChange('amenitiesWeight', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-navy-900 mb-1">
                  <span>Lifestyle & House Rules Weight</span>
                  <span>{weights.lifestyleWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={weights.lifestyleWeight}
                  onChange={(e) => handleWeightChange('lifestyleWeight', Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold text-navy-900">
                Sum: {weights.budgetWeight + weights.locationWeight + weights.moveInWeight + weights.propertyTypeWeight + weights.amenitiesWeight + weights.lifestyleWeight}%
              </span>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Apply Weights to Compatibility Engine
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: BLOG CONTENT MANAGEMENT */}
      {activeTab === 'blog' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-base">Knowledge Hub Articles ({articles.length})</h3>
            <button
              onClick={() => setShowArticleModal(true)}
              className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Publish New Article
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {articles.map((art) => (
              <div key={art.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-navy-900">{art.title}</h4>
                  <p className="text-slate-500 mt-0.5">{art.category} • By {art.author}</p>
                </div>
                <button
                  onClick={() => store.deleteBlogArticle(art.id)}
                  className="text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {showArticleModal && (
            <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
                <h3 className="font-bold text-navy-900 text-sm">Publish New Article</h3>
                <form onSubmit={handleCreateArticle} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="Fair Rental Guide">Fair Rental Guide</option>
                      <option value="Legal & Compliance">Legal & Compliance</option>
                      <option value="Market Transparency">Market Transparency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Summary</label>
                    <textarea
                      rows={2}
                      value={articleSummary}
                      onChange={(e) => setArticleSummary(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Content</label>
                    <textarea
                      rows={6}
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowArticleModal(false)}
                      className="px-4 py-2 border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-sm">Security & Audit Logs</h3>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-navy-900 whitespace-nowrap">
                      {log.userName} ({log.userRole})
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-teal-800">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
