import {
  ArrowRight,
  BookOpen,
  Clock,
  Quote,
  TrendingUp,
  Trophy,
  Users,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ASSET_URL } from "../config";
import { Link } from "react-router";
import ccsLogo from "../assets/images/png/uccslogobg.png";
import Card from "../components/ui/Card";
import testimonialService from "../services/testimonial.service";
import leaderboardService from "../services/leaderboard.service";

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback sample testimonials if none are approved in DB
  const sampleTestimonials = [
    {
      first_name: "Adrian",
      last_name: "Mercado",
      content:
        "The new reservation system makes it so much easier to find a spot during midterms. No more walking around every lab!",
      rating: 5,
      course: "BSCS",
      course_level: "3",
    },
    {
      first_name: "Sophia",
      last_name: "Villarante",
      content:
        "I love being able to track my remaining hours in real-time. The interface is clean and very professional.",
      rating: 5,
      course: "BSIT",
      course_level: "4",
    },
    {
      first_name: "James",
      last_name: "Yap",
      content:
        "CCS finally has a modern portal for sit-in. Great job to the dev team for making lab access transparent.",
      rating: 5,
      course: "BSCS",
      course_level: "2",
    },
    {
      first_name: "Elena",
      last_name: "Santos",
      content:
        "The real-time PC availability feature saved me so much time today. It's incredibly accurate!",
      rating: 4,
      course: "BSIT",
      course_level: "1",
    },
    {
      first_name: "Marcus",
      last_name: "Cruz",
      content:
        "Finally, a system that works! The dashboard is intuitive and really helps me plan my study sessions.",
      rating: 5,
      course: "BSCS",
      course_level: "4",
    },
    {
      first_name: "Isabella",
      last_name: "Luna",
      content:
        "The technical support through the lab portal is very responsive. Keep up the great work!",
      rating: 5,
      course: "BSIT",
      course_level: "3",
    },
  ];

  // Default fallback leaderboard data
  const defaultLeaderboard = [
    { student_name: "Adrian Mercado", course: "BSCS 3", hours: 142.5, rank: 1 },
    { student_name: "Sophia Villarante", course: "BSIT 4", hours: 128.0, rank: 2 },
    { student_name: "James Yap", course: "BSCS 2", hours: 115.2, rank: 3 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch testimonials
        const tResponse = await testimonialService.getApproved();
        if (tResponse.status === "success" && tResponse.data?.length > 0) {
          const shuffled = [...tResponse.data].sort(() => 0.5 - Math.random());
          setTestimonials(shuffled.slice(0, 6));
        } else {
          setTestimonials(sampleTestimonials);
        }

        // Fetch Leaderboard (Monthly by hours)
        const lResponse = await leaderboardService.getLeaderboard('hours', 'monthly');
        if (lResponse && lResponse.data?.entries) {
          setLeaderboardData(lResponse.data.entries.slice(0, 3));
        } else {
          setLeaderboardData(defaultLeaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setTestimonials(sampleTestimonials);
        setLeaderboardData(defaultLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* ───── CLEAN HERO SECTION (Hybrid) ───── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-10 pb-20 overflow-hidden px-4 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 hero-glow rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-8 shadow-xl p-2 transition-transform duration-500">
            <img
              src={ccsLogo}
              alt="CCS Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-primary-light mb-3">
            College of Computer Studies
          </p>

          <h1 className="text-4xl sm:text-6xl font-black text-primary tracking-tight max-w-3xl leading-[1.1] mb-6">
            Laboratory Sit-In{" "}
            <span className="text-primary-hover">Monitoring System</span>
          </h1>

          <p className="text-sm sm:text-base text-primary-light/80 font-medium max-w-xl leading-relaxed mb-10">
            Manage and monitor student access to university computer
            laboratories — simple, fast, and transparent engagement for the
            computing community.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/auth/login"
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              Access Portal
            </Link>
            <Link
              to="/auth/signup"
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-brand-sand text-primary border border-border text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <ArrowRight className="h-5 w-5 rotate-90 text-primary" />
        </div>
      </section>

      {/* ───── SYSTEM INFRASTRUCTURE (How it Works) ───── */}
      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                label: "Real-time Monitoring",
                desc: "Track lab occupancy and sit-in sessions live to ensure workstation availability.",
              },
              {
                icon: BookOpen,
                label: "Session Records",
                desc: "View complete history of all laboratory activity with precise hour calculations.",
              },
              {
                icon: Users,
                label: "Student Management",
                desc: "Maintain technical accountability and professional laboratory etiquette.",
              },
            ].map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-4 bg-bg-secondary/30 border border-transparent rounded-2xl px-8 py-10 hover:bg-white hover:border-primary/10 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-border group-hover:scale-110 group-hover:bg-primary transition-all shadow-sm">
                  <Icon className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                  {label}
                </h3>
                <p className="text-xs text-primary-light/70 font-bold leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TOP PERFORMERS (Leaderboard Preview) ───── */}
      <section className="py-24 bg-bg-secondary/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary-hover" /> Performance
                Rankings
              </h2>
              <p className="text-3xl font-extrabold text-primary tracking-tight uppercase">
                Top Laboratory Users
              </p>
            </div>
            <Link
              to="/community/leaderboards"
              className="px-8 py-3 rounded-xl bg-white border border-border text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
            >
              View Full Rankings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaderboardData.map((student, i) => (
              <Card
                key={i}
                className="p-8 bg-white border-primary/5 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${i === 0 ? "bg-primary" : "bg-primary/20"}`}
                />
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black border-2 border-white shadow-lg ${i === 0 ? "bg-primary text-brand-sand" : "bg-bg-secondary text-primary"}`}
                  >
                    {student.student_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest">
                    Rank #0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-black text-primary uppercase tracking-tight mb-1 group-hover:text-primary-hover transition-colors">
                  {student.student_name}
                </h3>
                <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest mb-6">
                  {student.course}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    <p className="text-[8px] font-black text-primary-light uppercase tracking-widest mb-0.5">
                      Accumulated
                    </p>
                    <p className="text-xl font-black text-primary tracking-tighter">
                      {student.hours !== undefined ? Number(student.hours).toFixed(1) : (student.display_value || student.value || "0.0")}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS (Student Voices) ───── */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -mr-[400px] -mt-[400px]" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-sand">
              Community Feedback
            </p>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              Student Voices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimony, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative hover:bg-white/10 transition-colors group flex flex-col"
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-white/5 group-hover:text-white/10 transition-colors" />

                <div className="flex items-center gap-0.5 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= (testimony.rating || 5) ? "text-brand-sand fill-brand-sand" : "text-white/20 fill-white/10"}`}
                    />
                  ))}
                </div>

                <p className="text-sm text-white/90 leading-loose font-bold italic mb-8 grow">
                  "{testimony.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-xl bg-primary-hover border border-white/20 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-lg overflow-hidden">
                    {testimony.profile_pic ? (
                      <img
                        src={`${ASSET_URL}/${testimony.profile_pic}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {testimony.first_name?.[0]}
                        {testimony.last_name?.[0]}
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-wider">
                      {testimony.first_name} {testimony.last_name}
                    </p>
                    <p className="text-[9px] font-black text-brand-sand uppercase tracking-widest opacity-60">
                      {testimony.course} {testimony.course_level}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOOTER CALLOUT ───── */}
      <section className="py-20 bg-white flex flex-col items-center justify-center text-center px-4">
        <div className="w-12 h-0.5 bg-primary/10 rounded-full mb-8" />
        <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.3em] leading-loose">
          University of Cebu - College of Computer Studies <br />
          <span className="opacity-40 italic">
            Technical Monitoring Division
          </span>
        </p>
      </section>
    </div>
  );
}
