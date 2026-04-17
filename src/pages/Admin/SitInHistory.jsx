import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquarePlus, Loader2, FlaskConical, User } from 'lucide-react';
import SitInMetricCards from '../../components/sit-in/SitInMetricCards';
import FeedbackModal from '../../components/modals/FeedbackModal';
import sitinService from '../../services/sitin.service';
import { toast } from 'sonner';

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SitInHistory() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await sitinService.getAllRecords();
      // The API returns { status, message, data: { records: [], meta: {} } }
      const recordsArray = res.data?.records || [];
      setRecords(recordsArray);
      setFilteredRecords(recordsArray);
    } catch (err) {
      toast.error('Failed to load sit-in history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecords(records);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = records.filter(r => 
      r.student_id?.toLowerCase().includes(q) ||
      `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
      r.lab_name?.toLowerCase().includes(q) ||
      r.purpose?.toLowerCase().includes(q)
    );
    setFilteredRecords(filtered);
  }, [searchQuery, records]);

  // Compute stats from records
  const computeStats = () => {
    const total = records.length;
    const ongoing = records.filter(r => r.status?.toLowerCase() === 'ongoing').length;
    
    // Calculate total duration in minutes
    let totalMinutes = 0;
    records.forEach(r => {
      if (r.time_in && r.time_out) {
        totalMinutes += Math.floor((new Date(r.time_out) - new Date(r.time_in)) / 60000);
      }
    });

    const avgMinutes = total > 0 ? Math.floor(totalMinutes / total) : 0;
    const avgDuration = `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`;
    const totalDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

    // Most used lab
    const labCounts = records.reduce((acc, r) => {
      acc[r.lab_name] = (acc[r.lab_name] || 0) + 1;
      return acc;
    }, {});
    const mostUsedLab = Object.entries(labCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return {
      totalRecords: total,
      activeNow: ongoing,
      avgDuration: avgDuration,
      mostUsedLab: mostUsedLab,
      totalDuration: totalDuration
    };
  };

  const stats = computeStats();

  const handleOpenFeedback = (record) => {
    setSelectedRecord({
      id: record.id,
      name: `${record.first_name} ${record.last_name}`,
      studentId: record.student_id,
      existingRemark: record.admin_remark,
      studentRating: record.student_rating,
      studentComment: record.student_comment
    });
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (recordId, text) => {
    try {
      await sitinService.submitFeedback({ log_id: recordId, feedback: text });
      toast.success('Feedback submitted successfully!');
      fetchRecords(); // Refresh to show updated feedback
    } catch (err) {
      toast.error(err.customMessage || 'Failed to submit feedback.');
      throw err; 
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#001F3F]">Sit-In History</h1>
        <p className="text-sm text-[#6A9AB0]">Comprehensive logs and feedback tracking for all sit-in sessions.</p>
      </div>

      <SitInMetricCards stats={stats} />

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#6A9AB0]/15 shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-4 border-b border-[#6A9AB0]/15 flex items-center justify-between gap-4">
           <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6A9AB0]" />
            <input
              type="text"
              placeholder="Search by student, lab, or purpose..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#6A9AB0]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D8C]/30 text-[#001F3F]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#EAD8B1]/10 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">ID Number</th>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Student Name</th>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Purpose</th>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Lab Number</th>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Sit-In Start</th>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Sit-In End</th>
                <th className="py-3 px-4 text-[11px] font-bold tracking-widest uppercase text-[#001F3F]/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6A9AB0]/10">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#3A6D8C] mx-auto" />
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sm text-[#6A9AB0]/60 italic">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-[#EAD8B1]/5 transition-colors text-sm">
                    <td className="py-3 px-4 font-mono text-[#3A6D8C]">{record.student_id}</td>
                    <td className="py-3 px-4 font-bold text-[#001F3F]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3A6D8C]/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {record.profile_pic ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${record.profile_pic}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-[#3A6D8C]" />
                          )}
                        </div>
                        <span>{record.first_name} {record.last_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6A9AB0] truncate max-w-[150px]">{record.purpose}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#3A6D8C]/10 text-[#3A6D8C] px-2 py-1 rounded text-xs font-bold">{record.lab_name}</span>
                    </td>
                    <td className="py-3 px-4 text-[#001F3F]">{formatDate(record.time_in)}</td>
                    <td className="py-3 px-4 text-[#001F3F]">{record.time_out ? formatDate(record.time_out) : <span className="text-[#6A9AB0] italic text-xs">Ongoing</span>}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenFeedback(record)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          record.admin_remark 
                            ? 'bg-[#3A6D8C] text-white border-[#3A6D8C]' 
                            : 'border-[#6A9AB0]/20 text-[#3A6D8C] hover:bg-[#3A6D8C] hover:text-white'
                        }`}
                      >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        {record.admin_remark ? 'View/Edit' : 'Feedback'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        studentName={selectedRecord?.name}
        idNumber={selectedRecord?.studentId}
        recordId={selectedRecord?.id}
        initialRemark={selectedRecord?.existingRemark}
        studentRating={selectedRecord?.studentRating}
        studentComment={selectedRecord?.studentComment}
      />
    </div>
  );
}
