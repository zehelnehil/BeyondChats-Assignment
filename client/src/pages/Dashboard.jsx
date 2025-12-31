import { useEffect, useState } from 'react';
import { getArticles, scrapeArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { RefreshCw, Zap, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);

    const fetchArticles = async () => {
        try {
            const { data } = await getArticles();
            setArticles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleScrape = async () => {
        setScraping(true);
        try {
            await scrapeArticles();
            await fetchArticles();
        } catch (err) {
            alert('Scraping failed');
        } finally {
            setScraping(false);
        }
    }

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <RefreshCw size={32} className="text-indigo-600" />
            </motion.div>
        </div>
    );

    return (
        <div>
            {/* Hero Section */}
            <section className="mb-12 text-center max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4 border border-indigo-100">
                        AI Content Enhancement
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Transforming Content <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Intelligently.</span>
                    </h1>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                        Seamlessly fetch articles from the BeyondChats blog, enhance them with AI-driven insights, and explore the evolution of content side-by-side.
                    </p>

                    <motion.button
                        onClick={handleScrape}
                        disabled={scraping}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-lg shadow-lg shadow-indigo-200 transition-all ${scraping ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {scraping ? (
                            <RefreshCw className="animate-spin" size={20} />
                        ) : (
                            <Zap size={20} fill="currentColor" />
                        )}
                        {scraping ? 'Enhancing Content...' : 'Trigger Smart Scrape'}
                    </motion.button>
                </motion.div>
            </section>

            {/* Articles Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Recent Articles</h2>
                    <div className="text-sm text-slate-400">
                        Showing {articles.length} results
                    </div>
                </div>

                {articles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100"
                    >
                        <Search size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Articles Found</h3>
                        <p className="text-slate-500">Click the button above to start scraping content.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, i) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <ArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
