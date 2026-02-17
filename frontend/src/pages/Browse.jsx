import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import { MOCK_RESOURCES } from '../data/mockData';

const Browse = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedSem, setSelectedSem] = useState('All');

    const departments = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL'];
    const semesters = ['All', '1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'];

    // Filter Logic
    const filteredResources = MOCK_RESOURCES.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || resource.department === selectedDept;
        const matchesSem = selectedSem === 'All' || resource.semester === selectedSem;
        return matchesSearch && matchesDept && matchesSem;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="text-xs font-mono text-primary uppercase tracking-wider">Library Access</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-medium text-white">
                        Browse Resources
                    </h1>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative w-full md:w-96"
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search by subject, title, or tag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#121217] border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                    />
                </motion.div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Filters */}
                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-8"
                >
                    {/* Department Filter */}
                    <div>
                        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Filter className="w-3 h-3" /> Department
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`px-3 py-1.5 text-xs rounded-sm border transition-all ${selectedDept === dept
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20'
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Semester Filter */}
                    <div>
                        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest mb-4">Semester</h3>
                        <div className="space-y-1">
                            {semesters.map(sem => (
                                <button
                                    key={sem}
                                    onClick={() => setSelectedSem(sem)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-all flex justify-between items-center ${selectedSem === sem
                                            ? 'text-white bg-white/5 border-l-2 border-primary'
                                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {sem}
                                    {selectedSem === sem && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.aside>

                {/* Resource Grid */}
                <div className="lg:col-span-3">
                    {filteredResources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredResources.map((resource, index) => (
                                <ResourceCard key={resource.id} resource={resource} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-lg">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-6 h-6 text-zinc-600" />
                            </div>
                            <h3 className="text-white font-medium mb-1">No resources found</h3>
                            <p className="text-zinc-500 text-sm">Try adjusting your filters or search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Browse;
