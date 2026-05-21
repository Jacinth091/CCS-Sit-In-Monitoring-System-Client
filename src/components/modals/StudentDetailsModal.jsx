import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Clock, Monitor, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import reservationService from '../../services/reservation.service';
import sitinService from '../../services/sitin.service';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { ASSET_URL } from '../../config';

function StudentDetailsModal({ isOpen, onClose, student }) {
  const [data, setData] = useState({
    reservations: [],
    sitInHistory: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (isOpen && student) {
      const fetchData = async () => {
        setData(prev => ({ ...prev, loading: true, error: null }));
        try {
          // Fetch reservations - Admin reservations usually require filters
          const resRes = await reservationService.getAll({ student_id: student.student_id });
          // Fetch sit-in history
          const sitRes = await sitinService.getHistoryByStudent(student.student_id);

          setData({
            reservations: resRes.data || [],
            sitInHistory: sitRes.data || [],
            loading: false,
            error: null
          });
        } catch (err) {
          console.error("Failed to fetch student details:", err);
          setData({ reservations: [], sitInHistory: [], loading: false, error: "Failed to load student data." });
        }
      };
      fetchData();
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between">
          <h3 className="text-lg font-black text-primary uppercase tracking-tight">Student Details</h3>
          <button onClick={onClose} className="p-2 text-primary-light hover:text-primary transition-colors border border-transparent hover:border-border rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Profile Section */}
          <div className="flex items-center gap-6 mb-8 p-4 bg-bg-secondary/30 rounded-xl">
            <div className="w-20 h-20 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden">
              {student.profile_pic ? <img src={`${ASSET_URL}/${student.profile_pic}`} className="w-full h-full object-cover" /> : <User className="h-10 w-10 text-primary/20" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-primary">{student.first_name} {student.last_name}</h2>
              <p className="text-xs font-black text-primary-light uppercase tracking-widest">{student.student_id}</p>
              <p className="text-xs font-bold text-primary-light">{student.course} - {student.course_level}</p>
            </div>
          </div>

          {data.loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20" /></div>
          ) : data.error ? (
            <div className="text-red-500 text-center py-10 font-bold">{data.error}</div>
          ) : (
            <div className="space-y-8">
              {/* Reservations */}
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-4">Recent Reservations</h4>
                {data.reservations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.reservations.slice(0, 4).map(res => (
                      <div key={res.id} className="p-4 rounded-xl border border-border bg-bg-secondary/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-primary">{res.lab_name}</p>
                          <p className="text-[10px] font-black text-primary-light uppercase">{formatDate(res.reserved_date)} · {formatTime(res.reserved_time)}</p>
                        </div>
                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${res.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{res.status}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-primary-light italic">No reservations found.</p>}
              </section>

              {/* Sit-In History */}
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-4">Recent Sit-ins</h4>
                {data.sitInHistory.length > 0 ? (
                  <div className="space-y-2">
                    {data.sitInHistory.slice(0, 5).map(log => (
                      <div key={log.id} className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-bg-secondary/10 text-xs font-bold text-primary">
                        <p>{log.lab_name}</p>
                        <p>{formatDate(log.date)}</p>
                        <p>{log.total_minutes} mins</p>
                        <p className="text-right uppercase">{log.status}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-primary-light italic">No sit-in history found.</p>}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsModal;
