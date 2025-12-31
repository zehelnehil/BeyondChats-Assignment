import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticle } from '../services/api';
import { ArrowLeft, ExternalLink, BookOpen, FileText, Share2, MessageCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [activeTab, setActiveTab] = useState('enhanced'); // 'original', 'enhanced'

    useEffect(() => {
        getArticle(id).then(({ data }) => setArticle(data));
    }, [id]);

    if (!article) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-48 bg-slate-200 rounded mb-4"></div>
                <div className="h-6 w-96 bg-slate-200 rounded"></div>
            </div>
        </div>
    );

    // Image mapping
    const getImage = (id) => {
        const images = [
            '/article-images/chatbot_guide.png',
            '/article-images/google_ads.png',
            '/article-images/healthcare.png',
            '/article-images/building.png',
            '/article-images/open_ended.png'
        ];
        return images[(id - 1) % images.length];
    };
    const heroImage = getImage(article.id);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Navigation */}
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Link>

                {/* Blog Header: Title & Metadata */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm border-b border-slate-100 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                BC
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">BeyondChats Team</div>
                                <div className="text-slate-500">{new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                        </div>

                        {/* Social Mockups for "Blog Feel" */}
                        <div className="flex-grow sm:text-right flex items-center gap-4 sm:justify-end text-slate-400">
                            <div className="flex items-center gap-1 hover:text-rose-500 cursor-pointer transition-colors"><Heart size={18} /> <span>278</span></div>
                            <div className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer transition-colors"><MessageCircle size={18} /> <span>12</span></div>
                            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer transition-colors"><Share2 size={18} /></div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 mb-8">
                    <button
                        onClick={() => setActiveTab('enhanced')}
                        className={`py-3 px-4 flex items-center gap-2 font-semibold transition-all relative ${activeTab === 'enhanced' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <BookOpen size={18} /> Enhanced Version
                        {activeTab === 'enhanced' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('original')}
                        className={`py-3 px-4 flex items-center gap-2 font-semibold transition-all relative ${activeTab === 'original' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <FileText size={18} /> Original Version
                        {activeTab === 'original' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                </div>

                {/* Featured Image - Clear and Clean */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                >
                    <img
                        src={heroImage}
                        alt={article.title}
                        className="w-full h-full object-cover max-h-[500px]"
                    />
                </motion.div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'enhanced' ? (
                                    article.updated_content ? (
                                        <div
                                            className="prose prose-lg prose-slate max-w-none 
                                            prose-headings:font-bold prose-headings:text-slate-900 
                                            prose-p:text-slate-600 prose-p:leading-8
                                            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                                            prose-img:rounded-xl prose-img:shadow-md prose-img:my-8"
                                            dangerouslySetInnerHTML={{ __html: marked.parse(article.updated_content) }}
                                        />
                                    ) : (
                                        <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                            <div className="inline-block p-3 rounded-full bg-white shadow-sm mb-3">
                                                <BookOpen size={32} className="text-slate-400" />
                                            </div>
                                            <h3 className="font-semibold text-slate-900">Content Processing</h3>
                                            <p className="text-slate-500 text-sm">Our AI is enhancing this article.</p>
                                        </div>
                                    )
                                ) : (
                                    <div
                                        className="prose prose-lg prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / References */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ExternalLink size={16} /> Reference Sources
                            </h3>
                            {article.citations && article.citations.length > 0 ? (
                                <ul className="space-y-4">
                                    {article.citations.map((cite, i) => (
                                        <li key={i}>
                                            <a
                                                href={cite.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block p-3 bg-white rounded-lg border border-slate-100 hover:border-indigo-300 hover:shadow-sm transition-all text-sm group"
                                            >
                                                <div className="font-medium text-slate-700 group-hover:text-indigo-600 line-clamp-2 mb-1">
                                                    {cite.title || 'Source Link'}
                                                </div>
                                                <div className="text-slate-400 text-xs truncate">
                                                    {new URL(cite.url).hostname}
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500">No external references cited.</p>
                            )}

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Original Article</span>
                                <a href={article.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
                                    Read on BeyondChats <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
