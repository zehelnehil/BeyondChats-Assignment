import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, CheckCircle, Clock, FileText } from 'lucide-react';

const ArticleCard = ({ article }) => {
    // Deterministic image mapping based on ID (assuming standard order 1-5)
    // Adjust logic if IDs vary, but for this task 1-5 is expected.
    const getImage = (id) => {
        const images = [
            '/article-images/chatbot_guide.png',
            '/article-images/google_ads.png',
            '/article-images/healthcare.png',
            '/article-images/building.png', // Fallback or pending generation
            '/article-images/open_ended.png' // Fallback or pending generation
        ];
        // Cycle through if ID > 5
        return images[(id - 1) % images.length];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full"
        >
            {/* Real Image Header */}
            <div className="h-48 overflow-hidden relative">
                <img
                    src={getImage(article.id)}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        // Fallback to gradient if image missing
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />

                {/* Fallback Gradient (Hidden by default unless img fails) */}
                <div className="hidden absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
                    <FileText size={48} className="text-white/50" />
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border border-white/20 flex items-center gap-1 ${article.status === 'PROCESSED' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'}`}>
                        {article.status === 'PROCESSED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {article.status}
                    </span>
                </div>

                {/* Overlay gradient for text readability if needed, though text is below */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
                    <Calendar size={14} />
                    {new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {article.title}
                </h2>

                {/* Excerpt */}
                <div className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-grow opacity-80"
                    dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* Footer Action */}
                <Link
                    to={`/article/${article.id}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors"
                >
                    Read Enhancement
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

export default ArticleCard;
