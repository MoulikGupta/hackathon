import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, SlidersHorizontal, ArrowUpDown, X, ChevronDown, Check } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import PageLayout from '../components/PageLayout';
import { fetchResources } from '../lib/api';

const Browse = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSem, setSelectedSem] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [sortBy, setSortBy] = useState('latest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];
    const types = ['All', 'Notes', 'Question Paper', 'Solutions', 'Project Report', 'Study Material', 'Assignment', 'Lab Manual', 'Presentation'];
    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
    ];

    const loadResources = useCallback(async () => {
        setLoading(true);
        try {
            const params = { sort: sortBy };
            if (searchTerm) params.search = searchTerm;
            if (selectedSem !== 'All') params.semester = selectedSem;
            if (selectedType !== 'All') params.resource_type = selectedType;

            const data = await fetchResources(params);
            setResources(data.resources || []);
        } catch (err) {
            console.error('Failed to load resources:', err);
            setResources([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedSem, selectedType, sortBy]);

    useEffect(() => {
        const debounce = setTimeout(loadResources, 300);
        return () => clearTimeout(debounce);
    }, [loadResources]);

    return (
        <PageLayout
            title="Browse Resources"
            subtitle="Library Access"
            action={
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search subjects, titles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 pl-10 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-zinc-600"
                    />
                </div>
            }
        >
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#121217] border border-white/10 rounded-lg text-sm text-white"
                >
                    <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Filters */}
                <div className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'} space-y-8 lg:col-span-1`}>
                    <div className="sticky top-32 space-y-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">

                        {/* Semester Filter */}
                        <div>
                            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <BookOpen className="w-3 h-3" /> Semester
                            </h3>
                            <div className="space-y-1">
                                {semesters.map(sem => (
                                    <button key={sem} onClick={() => setSelectedSem(sem)}
                                        className={`w-full text-left px-3 py-2 text-xs font-mono rounded-md transition-all flex justify-between items-center cursor-pointer ${selectedSem === sem ? 'text-white bg-white/10 border border-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                                        {sem === 'All' ? 'All Semesters' : `Semester ${sem}`}
                                        {selectedSem === sem && <Check className="w-3 h-3 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-white/5" />

                        {/* Resource Type Filter */}
                        <div>
                            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="w-3 h-3" /> Resource Type
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {types.map(t => (
                                    <button key={t} onClick={() => setSelectedType(t)}
                                        className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-full border transition-all cursor-pointer ${selectedType === t ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-white/5" />

                        {/* Sort */}
                        <div>
                            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ArrowUpDown className="w-3 h-3" /> Sort Order
                            </h3>
                            <div className="flex flex-col gap-1">
                                {sortOptions.map(opt => (
                                    <button key={opt.value} onClick={() => setSortBy(opt.value)}
                                        className={`w-full text-left px-3 py-2 text-xs font-mono rounded-md transition-all flex justify-between items-center cursor-pointer ${sortBy === opt.value ? 'text-white bg-white/10 border border-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                                        {opt.label}
                                        {sortBy === opt.value && <Check className="w-3 h-3 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Grid */}
                <div className="lg:col-span-3 min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest animate-pulse">Fetching resources...</p>
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {resources.map((resource, index) => (
                                    <ResourceCard key={resource.id} resource={resource} index={index} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-white font-display text-xl font-medium mb-2">No resources found</h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                                We couldn't find any resources matching your filters. Try adjusting your search term or filters.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedSem('All'); setSelectedType('All'); }}
                                className="mt-8 px-6 py-2 text-xs font-mono uppercase tracking-wider text-primary border border-primary/20 rounded-full hover:bg-primary/10 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default Browse;
