import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Clock, Monitor, ClipboardList, Loader2, GraduationCap, BookOpen } from 'lucide-react';
import reservationService from '../../services/reservation.service';
import sitinService from '../../services/sitin.service';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { ASSET_URL } from '../../config';

const STATUS_STYLES = {
  approved:    'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending:     'bg-amber-50  text-amber-700  border-amber-100',
  rejected:    'bg-red-50    text-red-700    border-red-100',
  fulfilled:   'bg-primary/5 text-primary    border-primary/10',
  rescheduled: 'bg-sky-50    text-sky-700    border-sky-100',
  active:      'bg-emerald-50 text-emerald-700 border-emerald-100',
  completed:   'bg-bg-secondary text-primary-light border-border',
};

function StatusBadge({ status }) {
  const s = (status || 'unknown').toLowerCase();
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${STATUS_STYLES[s] || 'bg-bg-secondary text-primary-light border-border'}`}>
      {status}
    </span>
  );
}

function StudentDetailsModal({ isOpen, onClose, student }) {
  const [data, setData] = useState({ reservations: [], sitInHistory: [], loading: true, error: null });

  useEffect(() => {
    if (isOpen && student) {
      const fetchData = async () => {
        setData(prev => ({ ...prev, loading: true, error: null }));
        try {
          const [resRes, sitRes] = await Promise.all([
            reservationService.getAll({ student_id: student.student_id }),
            sitinService.getHistoryByStudent(student.student_id),
          ]);
          setData({ reservations: resRes.data || [], sitInHistory: sitRes.data || [], loading: false, error: null });
        } catch {
          setData({ reservations: [], sitInHistory: [], loading: false, error: 'Failed to load student data.' });
        }
      };
      fetchData();
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col border border-border animate-fade-in-up">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-border bg-bg-secondary/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
              <ClipboardList className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-black text-primary tracking-tight">Student Profile</h3>
              <p className="text-xs text-primary-light font-medium">Academic &amp; Session Overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-primary-light hover:text-primary hover:bg-bg-secondary border border-transparent hover:border-border transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

          {/* Profile Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-white border border-border rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-primary-hover p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                {student.profile_pic ? (
                  <img src={`${ASSET_URL}/${student.profile_pic}`} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User className="h-10 w-10 text-primary/20" />
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-1">{student.student_id}</p>
              <h2 className="text-2xl font-black text-primary tracking-tight leading-tight mb-3">
                {student.first_name} {student.last_name}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border">
                  <GraduationCap className="h-4 w-4 text-primary-light" />
                  <span className="text-sm font-bold text-primary">{student.course}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border">
                  <BookOpen className="h-4 w-4 text-primary-light" />
                  <span className="text-sm font-bold text-primary">{student.course_level} Year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading / Error */}
          {data.loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
              <p className="text-sm font-bold text-primary-light">Loading student data...</p>
            </div>
          ) : data.error ? (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-red-500">{data.error}</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Recent Reservations */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary-light" />
                  <h4 className="text-sm font-black text-primary uppercase tracking-wide">Recent Reservations</h4>
                  <span className="ml-auto text-xs font-bold text-primary-light bg-bg-secondary border border-border px-2 py-0.5 rounded-lg">
                    {data.reservations.length} total
                  </span>
                </div>
                {data.reservations.length > 0 ? (
                  <div className="space-y-2">
                    {data.reservations.slice(0, 4).map(res => (
                      <div key={res.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white hover:border-primary/20 hover:shadow-sm transition-all">
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-sm font-bold text-primary truncate">
                            {res.lab_code ? `${res.lab_code} — ${res.name}` : res.name || 'Laboratory'}
                          </p>
                          <div className="flex items-center gap-3 text-xs font-medium text-primary-light">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />{res.reserved_date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Monitor className="h-3.5 w-3.5" />PC {res.pc_number}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={res.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-border rounded-xl">
                    <p className="text-sm font-bold text-primary-light italic">No reservations found.</p>
                  </div>
                )}
              </section>

              {/* Sit-In History */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary-light" />
                  <h4 className="text-sm font-black text-primary uppercase tracking-wide">Recent Sit-In Records</h4>
                  <span className="ml-auto text-xs font-bold text-primary-light bg-bg-secondary border border-border px-2 py-0.5 rounded-lg">
                    {data.sitInHistory.length} total
                  </span>
                </div>
                {data.sitInHistory.length > 0 ? (
                  <div className="space-y-2">
                    {data.sitInHistory.slice(0, 4).map(log => (
                      <div key={log.id} className="relative flex items-center justify-between p-3.5 rounded-xl border border-border bg-white hover:border-primary/20 transition-all overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${log.status === 'active' ? 'bg-emerald-500' : 'bg-border'}`} />
                        <div className="ml-3 space-y-1 min-w-0 flex-1">
                          <p className="text-sm font-bold text-primary truncate">{log.lab_name}</p>
                          <div className="flex items-center gap-3 text-xs font-medium text-primary-light">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />{formatDate(log.date)}
                            </span>
                            {log.total_minutes && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />{log.total_minutes} min
                              </span>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={log.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-border rounded-xl">
                    <p className="text-sm font-bold text-primary-light italic">No activity found.</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-bg-secondary/20 border-t border-border flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-border text-sm font-bold text-primary-light hover:text-primary hover:bg-white transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsModal;
