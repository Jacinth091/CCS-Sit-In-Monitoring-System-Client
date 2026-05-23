import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import courseService from "../../services/course.service";

export default function CourseSearchableDropdown({ 
  value, 
  onChange, 
  placeholder = "Select Course...", 
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [coursesList, setCoursesList] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    courseService.getCourses()
      .then(res => {
        if (res && res.data) {
          setCoursesList(res.data);
        }
      })
      .catch(err => console.error("Failed to load courses:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCourses = coursesList.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const defaultStyles = "w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm font-bold text-primary flex items-center justify-between cursor-pointer hover:bg-white transition-all focus:ring-4 focus:ring-primary/5";

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={className || defaultStyles}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-border rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-2 border-b border-border bg-bg-secondary/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-light" />
              <input
                type="text"
                autoFocus
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-bold text-primary bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((c, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(c.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors ${
                    value === c.name
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-bg-secondary"
                  }`}
                >
                  {c.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-primary-light italic">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
