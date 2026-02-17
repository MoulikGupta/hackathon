import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Star, FileText, Calendar, User, Lock, Globe,
    Edit3, Trash2, Tag, BookOpen, Clock
} from 'lucide-react';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { fetchResource, fetchReviews, submitReview, deleteResource, downloadResource } from '../lib/api';

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [resource, setResource] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resData, revData] = await Promise.all([
                fetchResource(id),
                fetchReviews(id),
            ]);
            setResource(resData.resource);
            setReviews(revData.reviews || []);

            // If user already reviewed, prefill
            if (user) {
                const existing = (revData.reviews || []).find(r => r.user_id === user.id);
                if (existing) {
                    setReviewRating(existing.rating);
                    setReviewComment(existing.comment || '');
                }
            }
        } catch (err) {
            console.error('Failed to load resource:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const data = await downloadResource(id);
            window.open(data.file_url, '_blank');
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!reviewRating) return;
        setSubmittingReview(true);
        try {
            await submitReview(id, { rating: reviewRating, comment: reviewComment });
            await loadData();
        } catch (err) {
            console.error('Review failed:', err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        setDeleting(true);
        try {
            await deleteResource(id);
            navigate('/browse');
        } catch (err) {
            console.error('Delete failed:', err);
            setDeleting(false);
        }
    };

    const isOwner = user && resource?.user_id === user.id;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-display text-white">Resource not found</h2>
                <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
            </div>
        );
    }

    const tags = Array.isArray(resource.tags) ? resource.tags : [];
    const createdDate = new Date(resource.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-5xl mx-auto">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/browse')}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8 cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Resources
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-sm border border-primary/20">{resource.type}</span>
                            {resource.privacy === 'private' ? (
                                <span className="text-[11px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-sm border border-yellow-500/20 flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>
                            ) : (
                                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20 flex items-center gap-1"><Globe className="w-3 h-3" /> Public</span>
                            )}
                            <span className="text-[11px] font-mono text-zinc-500">{resource.department} • {resource.semester}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-medium text-white mb-3">{resource.title}</h1>
                        <p className="text-secondary font-mono text-sm mb-2">{resource.subject}</p>

                        {resource.description && (
                            <p className="text-zinc-400 text-sm leading-relaxed">{resource.description}</p>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-xs text-zinc-500 font-mono">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {createdDate}</span>
                        <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> {resource.downloads || 0} downloads</span>
                        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500" /> {Number(resource.avg_rating || 0).toFixed(1)} ({resource.review_count || 0} reviews)</span>
                        {resource.year_batch && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {resource.year_batch}</span>}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <Tag className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                            {tags.map(tag => (
                                <span key={tag} className="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded-sm border border-white/5">#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="pt-6 border-t border-white/10">
                        <h2 className="text-xl font-display font-medium text-white mb-6 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" /> Reviews ({reviews.length})
                        </h2>

                        {/* Write Review */}
                        {user ? (
                            <GlassCard className="mb-8">
                                <form onSubmit={handleReview} className="space-y-4">
                                    <p className="text-sm text-white font-medium">
                                        {reviews.find(r => r.user_id === user.id) ? 'Update your review' : 'Write a review'}
                                    </p>

                                    {/* Star Rating Picker */}
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 cursor-pointer transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-6 h-6 transition-colors ${star <= (hoverRating || reviewRating) ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'}`} />
                                            </button>
                                        ))}
                                        <span className="text-xs text-zinc-500 ml-2 font-mono">{reviewRating}/5</span>
                                    </div>

                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Share your thoughts about this resource..."
                                        rows={3}
                                        className="w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-zinc-700 resize-none"
                                    />

                                    <Button type="submit" disabled={!reviewRating || submittingReview}>
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </Button>
                                </form>
                            </GlassCard>
                        ) : (
                            <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                                <p className="text-zinc-400 text-sm">
                                    <button onClick={() => navigate('/login')} className="text-primary hover:underline cursor-pointer">Sign in</button> to leave a review.
                                </p>
                            </div>
                        )}

                        {/* Review List */}
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-[#121217] border border-white/5 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                {review.user_avatar ? (
                                                    <img src={review.user_avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white font-bold">
                                                        {(review.user_name || 'A').charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm text-white font-medium">{review.user_name || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-zinc-600">{new Date(review.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && <p className="text-sm text-zinc-400 leading-relaxed">{review.comment}</p>}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-600 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar */}
                <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                    {/* Download Card */}
                    <GlassCard className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-white font-medium truncate max-w-[180px]">{resource.file_name}</p>
                                <p className="text-xs text-zinc-500">{resource.file_size ? (resource.file_size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}</p>
                            </div>
                        </div>

                        <Button onClick={handleDownload} className="w-full">
                            <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                    </GlassCard>

                    {/* Rating Summary */}
                    <GlassCard className="space-y-3">
                        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest">Rating</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-white">{Number(resource.avg_rating || 0).toFixed(1)}</span>
                            <div>
                                <div className="flex items-center gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(resource.avg_rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-zinc-500">{resource.review_count || 0} reviews</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Owner Actions */}
                    {isOwner && (
                        <GlassCard className="space-y-3">
                            <h3 className="text-xs font-mono text-secondary uppercase tracking-widest">Actions</h3>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-mono text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleting ? 'Deleting...' : 'Delete Resource'}
                            </button>
                        </GlassCard>
                    )}
                </motion.aside>
            </div>
        </div>
    );
};

export default ResourceDetail;
