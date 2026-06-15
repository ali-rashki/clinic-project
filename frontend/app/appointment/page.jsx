"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Search, ChevronLeft } from 'lucide-react';
import API from '../../lib/api';

const cities = [
  'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم', 'اهواز',
];

const ICON_MAP = {
  'قلب و عروق': '❤️',
  'پوست و مو': '🧴',
  'ارتوپدی': '🦴',
  'چشم‌پزشکی': '👁️',
  'دندانپزشکی': '🦷',
  'اعصاب': '🧠',
  'زنان و زایمان': '🤰',
  'کودکان': '👶',
  'داخلی': '🩺',
  'گوش و حلق و بینی': '👂',
};


// Specialty icons as simple SVG blobs (decorative circles with emoji)
function SpecialtyCard({ label, icon }) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group">
      <div className="w-20 h-20 rounded-full bg-[rgba(93,79,255,0.08)] flex items-center justify-center text-3xl
                      group-hover:bg-[rgba(93,79,255,0.18)] transition-colors shadow-sm border border-[rgba(93,79,255,0.16)]">
        {icon || '⚕️'}
      </div>
      <span className="text-sm text-gray-700 font-medium text-center">{label}</span>
    </div>
  );
}

function Dropdown({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200
                   rounded-xl bg-white text-right text-gray-500 text-sm hover:border-[rgba(93,79,255,0.6)]
                   focus:outline-none focus:ring-2 focus:ring-[rgba(93,79,255,0.24)] transition"
      >
        <span className={value ? 'text-gray-800' : ''}>{value || placeholder}</span>

        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
        >
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                className="w-full text-right px-4 py-2.5 text-sm text-gray-700 hover:bg-[rgba(93,79,255,0.08)] transition-colors"
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SpecialtiesPage() {
  const [tab, setTab] = useState('service'); // 'service' | 'doctor'
  const [specialty, setSpecialty] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [city, setCity] = useState('');
  const [moreFilters, setMoreFilters] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorResults, setDoctorResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    let mounted = true;
    API.get('/specialties/')
      .then((res) => {
        if (!mounted) return;
        setSpecialties(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Failed fetching specialties', err);
        setError(err);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const specialtyOptions = specialties.map((s) => s.name);

  const handleSearch = () => {
    if (tab !== 'doctor') {
      return;
    }

    setSearchError(null);
    setSearchLoading(true);
    API.get('/specialties/doctors/', {
      params: {
        search: doctorName,
      },
    })
      .then((res) => {
        setDoctorResults(res.data || []);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.error('Doctor search failed', err);
        setSearchError(err);
        setSearchLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero banner (ends before the card does) ── */}
      <section
        className="relative lg:min-h-96 px-4 pt-16 pb-0 flex flex-col items-center"
        style={{
          backgroundImage: 'url(/appointment-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          /* Hero ends at ~60% of the card height so card visibly overflows */
          paddingBottom: '180px',
        }}
      >
        {/* Headline */}
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-2 text-center">
          انواع تخصص های پزشکی
        </h1>
        <p className="text-[rgba(255,255,255,0.88)] text-base md:text-lg font-medium mb-10 text-center">
          تخصص و شهر مورد نظرتان را انتخاب کنید و نوبت بگیرید
        </p>
      </section>

      {/* ── Floating Search Card ── */}
      {/* negative margin pulls it up over the hero's bottom edge */}
      <div className="relative z-10 max-w-xl mx-auto px-4" style={{ marginTop: '-160px' }}>
        <div className="bg-white rounded-2xl shadow-2xl p-6">

          {/* Tabs */}
          <div className="flex rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <button
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'service'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-500 bg-white hover:bg-gray-50'
              }`}
              onClick={() => setTab('service')}
            >
              بر اساس تخصص یا خدمت
            </button>
            <button
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'doctor'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'text-gray-500 bg-white hover:bg-gray-50'
              }`}
              onClick={() => setTab('doctor')}
            >
              بر اساس نام پزشک
            </button>
          </div>

          {tab === 'service' ? (
            <>
              {/* Specialty Field */}
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1.5 text-right">
                  به دنبال چه تخصصی هستید؟
                  <span className="text-red-500 mr-0.5">*</span>
                </label>
                <Dropdown
                  placeholder="تخصص، خدمت یا علائم بیماری را وارد کنید"
                  options={specialtyOptions}
                  value={specialty}
                  onChange={setSpecialty}
                />
              </div>

              {/* City Field */}
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1.5 text-right">
                  در کدام شهر نوبت میخواهید؟
                </label>
                <Dropdown
                  placeholder="شهر موردنظر را انتخاب کنید"
                  options={cities}
                  value={city}
                  onChange={setCity}
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1.5 text-right">
                نام پزشک را وارد کنید
                <span className="text-red-500 mr-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="نام پزشک مورد نظر را بنویسید"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-right text-gray-700 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[rgba(93,79,255,0.24)] transition"
                />

                {((doctorResults.length > 0 && doctorName) || searchLoading || searchError || (doctorName && doctorResults.length === 0)) && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20">
                    {searchLoading && (
                      <div className="p-4 text-center text-gray-500">در حال جستجوی پزشک...</div>
                    )}
                    {searchError && (
                      <div className="p-4 text-center text-red-500">خطا در جستجوی پزشک</div>
                    )}
                    {!searchLoading && !searchError && doctorName && doctorResults.length === 0 && (
                      <div className="p-4 text-center text-gray-500">هیچ پزشکی با این نام پیدا نشد.</div>
                    )}
                    {!searchLoading && !searchError && doctorResults.length > 0 && (
                      <ul className="divide-y divide-gray-100">
                        {doctorResults.map((doctor) => (
                          <li key={doctor.id} className="py-3 px-4 hover:bg-gray-50">
                            <button
                              type="button"
                              className="w-full text-right"
                              onClick={() => {
                                setDoctorName(doctor.user_full_name || '');
                                setDoctorResults([]);
                              }}
                            >
                              <div className="font-medium text-gray-800">{doctor.user_full_name || 'دکتر'}</div>
                              <div className="text-sm text-gray-600">{doctor.specialty_name || 'تخصص نامشخص'}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* More Filters */}
          <button
            type="button"
            className="flex items-center gap-1 text-[var(--primary)] py-2 text-sm mb-5 ml-auto"
            onClick={() => setMoreFilters(!moreFilters)}
          >
            <ChevronDown
              size={16}
              className={`transition-transform ${moreFilters ? 'rotate-180' : ''}`}
            />
            فیلترهای بیشتر
          </button>

          {moreFilters && (
            <div className="mb-5 p-4 bg-[rgba(93,79,255,0.08)] rounded-xl text-sm text-gray-600 text-right">
              فیلترهای پیشرفته در اینجا نمایش داده می‌شوند (جنسیت پزشک، روز هفته، نوع بیمه...)
            </div>
          )}

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="w-full py-3.5 bg-[var(--primary)] hover:brightness-95 active:brightness-90
                       text-[var(--primary-foreground)] font-semibold rounded-xl transition flex items-center
                       justify-center gap-2 text-base shadow-md"
          >
            <Search size={18} />
            {tab === 'doctor' ? 'جستجوی پزشک' : 'جستجوی نوبت'}
          </button>
        </div>
      </div>

      {/* ── Specialty List Section ── */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-gray-800 text-xl font-bold">لیست انواع تخصص های پزشکی</h2>
          <button className="flex items-center gap-1 text-[var(--primary)] text-sm font-medium hover:underline">
            <ChevronLeft size={16} />
            مشاهده همه
          </button>
        </div>

        {/* Grid of specialty cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {loading && (
            <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-500">خطا در بارگذاری تخصص‌ها</div>
          )}
          {!loading && !error && specialties.map((s) => (
            <SpecialtyCard key={s.id} label={s.name} icon={ICON_MAP[s.name] || s.icon || '⚕️'} />
          ))}
        </div>
      </section>
    </div>
  );
}