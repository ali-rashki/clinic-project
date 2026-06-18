"use client";

import {useState, useRef, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const {login, register} = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // State for conditional doctor fields
    const [role, setRole] = useState("patient");
    const [specialties, setSpecialties] = useState([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(false);

    const loginIdentifierRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const usernameRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const roleRef = useRef(null);

    // Doctor-specific refs
    const specialtyIdRef = useRef(null);
    const consultationFeeRef = useRef(null);
    const genderRef = useRef(null);
    const visitTypeRef = useRef(null);
    const bioRef = useRef(null);
    const experienceYearsRef = useRef(null);
    const licenseNumberRef = useRef(null);
    const cityRef = useRef(null);
    const addressRef = useRef(null);

    const getValue = (ref) => ref.current?.value.trim() || "";

    // Fetch specialties for doctor registration
    useEffect(() => {
        if (isSignUp) {
            setLoadingSpecialties(true);
            fetch("http://127.0.0.1:8000/api/specialties/")
                .then((res) => res.json())
                .then((data) => setSpecialties(data))
                .catch((err) => console.error("Failed to fetch specialties:", err))
                .finally(() => setLoadingSpecialties(false));
        }
    }, [isSignUp]);

    async function handleLogin() {
        setError("");
        setLoading(true);
        try {
            const identifier = getValue(loginIdentifierRef);
            const password = getValue(passwordRef);
            const result = await login(identifier, password);
            if (result.success) {
                router.push("/");
            } else {
                setError(result.error?.detail || "خطا در ورود. لطفا اطلاعات را دوباره بررسی کنید.");
            }
        } catch (err) {
            setError("خطا در ارتباط با سرور");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSignUp() {
        setError("");
        const username = getValue(usernameRef);
        const email = getValue(emailRef);
        const password = getValue(passwordRef);
        const confirmPassword = getValue(confirmPasswordRef);
        const firstName = getValue(firstNameRef);
        const lastName = getValue(lastNameRef);
        const phone = getValue(phoneRef);
        const selectedRole = role;

        if (password !== confirmPassword) {
            setError("رمز عبور با تکرار آن مطابقت ندارد");
            return;
        }

        const payload = {
            username,
            email,
            password,
            password2: confirmPassword,
            first_name: firstName,
            last_name: lastName,
            phone,
            role: selectedRole,
        };

        if (selectedRole === "doctor") {
            payload.specialty_id = parseInt(getValue(specialtyIdRef));
            payload.consultation_fee = parseFloat(getValue(consultationFeeRef));
            payload.gender = getValue(genderRef);
            payload.visit_type = getValue(visitTypeRef);
            payload.bio = getValue(bioRef);
            payload.experience_years = parseInt(getValue(experienceYearsRef)) || 0;
            payload.license_number = getValue(licenseNumberRef);
            payload.city = getValue(cityRef);
            payload.address = getValue(addressRef);
        }

        setLoading(true);
        try {
            const result = await register(payload);
            if (result.success) {
                router.push("/");
            } else {
                // نمایش خطاهای فارسی
                const errorMessage = getFriendlyErrorMessage(result.error);
                setError(errorMessage);
            }
        } catch (err) {
            console.error("❌ Error:", err);
            const errorMessage = getFriendlyErrorMessage(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

// تابع تبدیل خطاهای انگلیسی به فارسی
    function getFriendlyErrorMessage(error) {
        if (!error) return "خطایی رخ داده است. لطفاً دوباره تلاش کنید.";

        if (typeof error === 'object') {
            const messages = [];

            if (error.password) {
                const msg = Array.isArray(error.password) ? error.password.join(' ') : error.password;
                if (msg.includes('short') || msg.includes('کوتاه')) {
                    messages.push('🔑 رمز عبور باید حداقل ۸ کاراکتر باشد.');
                } else if (msg.includes('common') || msg.includes('رایج')) {
                    messages.push('🔑 رمز عبور خیلی ساده است. از ترکیب حروف بزرگ، کوچک، عدد و نماد استفاده کنید.');
                } else if (msg.includes('numeric')) {
                    messages.push('🔑 رمز عبور نمی‌تواند فقط عدد باشد.');
                } else {
                    messages.push(msg);
                }
            }

            if (error.username) {
                const msg = Array.isArray(error.username) ? error.username[0] : error.username;
                if (msg.includes('already exists')) {
                    messages.push('👤 این نام کاربری قبلاً ثبت شده است. نام دیگری انتخاب کنید.');
                } else {
                    messages.push(msg);
                }
            }

            if (error.phone) {
                const msg = Array.isArray(error.phone) ? error.phone[0] : error.phone;
                if (msg.includes('already exists')) {
                    messages.push('📱 این شماره تلفن قبلاً ثبت شده است. شماره دیگری وارد کنید.');
                } else {
                    messages.push(msg);
                }
            }

            if (error.email) {
                const msg = Array.isArray(error.email) ? error.email[0] : error.email;
                if (msg.includes('already exists')) {
                    messages.push('📧 این ایمیل قبلاً ثبت شده است. ایمیل دیگری وارد کنید.');
                } else if (msg.includes('valid')) {
                    messages.push('📧 لطفاً یک ایمیل معتبر وارد کنید.');
                } else {
                    messages.push(msg);
                }
            }

            if (error.license_number) {
                messages.push('🆔 شماره نظام پزشکی الزامی است.');
            }

            if (error.specialty_id) {
                messages.push('🏥 انتخاب تخصص الزامی است.');
            }

            if (error.consultation_fee) {
                messages.push('💰 هزینه ویزیت الزامی است.');
            }

            if (error.detail) {
                messages.push(error.detail);
            }

            if (messages.length > 0) {
                return messages.join('\n');
            }

            return 'اطلاعات وارد شده صحیح نیست. لطفاً همه فیلدها را بررسی کنید.';
        }

        if (typeof error === 'string') {
            return error;
        }

        return 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.';
    }

    function switchToSignUp() {
        setIsSignUp(true);
        setError("");
        setRole("patient");
        if (passwordRef.current) passwordRef.current.value = "";
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
    }

    function switchToLogin() {
        setIsSignUp(false);
        setError("");
        setRole("patient");
        if (passwordRef.current) passwordRef.current.value = "";
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
        if (usernameRef.current) usernameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (firstNameRef.current) firstNameRef.current.value = "";
        if (lastNameRef.current) lastNameRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
        if (loginIdentifierRef.current) loginIdentifierRef.current.value = "";
        if (roleRef.current) roleRef.current.value = "patient";
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[color:var(--color-background)]">
            {/* Floating back button */}
            <button
                onClick={() => router.push("/")}
                className="group fixed top-4 right-4 z-50 flex items-center bg-white/90 backdrop-blur-sm border border-[color:var(--border)] rounded-full shadow-md overflow-hidden transition-all duration-300 ease-in-out w-14 hover:w-36 h-14 hover:shadow-lg hover:border-[color:var(--color-primary)]"
                aria-label="بازگشت به صفحه اصلی"
            >
        <span className="flex items-center justify-center w-14 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg"
               className="w-6 h-6 text-[color:var(--color-primary)] transition-transform duration-300 group-hover:-translate-x-0.5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </span>
                <span
                    className="text-sm font-medium whitespace-nowrap text-[color:var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 pr-3">
          بازگشت
        </span>
            </button>

            {/* Left panel */}
            <div className="relative hidden md:flex w-1/2 flex-col justify-end">
                <Image src="/doctor-hero.jpg" alt="Healthcare professional" fill className="object-cover" priority/>
                <div
                    className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-primary)] via-[color:var(--color-primary)]/40 to-transparent"/>
                <div className="relative z-10 p-8 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Image src="/clinic-icon.jpg" alt="clinic logo" width={36} height={36}
                               className="rounded-full"/>
                        <span className="font-bold text-3xl tracking-widest uppercase">کلینیک</span>
                    </div>
                    <p className="text-md text-white/80 leading-relaxed max-w-xs">سلامت شما در اولویت است. با خدمات ما،
                        دسترسی آسان و امن به مراقبت‌های پزشکی خواهید داشت.</p>
                </div>
            </div>

            {/* Right panel — no justify-center, just overflow-y-auto */}
            <div
                className="flex flex-col w-full md:w-1/2 flex-1 min-h-0 bg-[color:var(--color-background)] px-8 md:px-16 overflow-y-auto">
                {/* Inner wrapper: my-auto centers when content fits, py-* gives breathing room when it scrolls */}
                <div className="flex flex-col my-auto py-16 pt-20 md:pt-24">

                    <div className="mb-8">
                        <Image src="/clinic-icon.jpg" alt="clinic icon" width={48} height={48}
                               className="rounded-full"/>
                    </div>

                    <h1 className="text-3xl font-bold text-[color:var(--color-foreground)] mb-1">
                        {isSignUp ? "ایجاد حساب کاربری" : "ورود به حساب"}
                    </h1>
                    <p className="text-sm text-[color:var(--color-muted)] mb-6">
                        {isSignUp ? "اطلاعات خود را وارد کنید تا حساب جدیدی برای شما ایجاد شود." : "برای دسترسی به خدمات کلینیک، اطلاعات حساب خود را وارد کنید."}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {!isSignUp && (
                        <div className="mb-4">
                            <label htmlFor="loginUsername"
                                   className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">نام
                                کاربری یا ایمیل</label>
                            <input id="loginUsername" ref={loginIdentifierRef} type="text"
                                   placeholder="نام کاربری یا ایمیل خود را وارد کنید" defaultValue=""
                                   className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                        </div>
                    )}

                    {isSignUp && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="username"
                                       className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">نام
                                    کاربری</label>
                                <input id="username" ref={usernameRef} type="text"
                                       placeholder="نام کاربری خود را وارد کنید"
                                       defaultValue=""
                                       className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email"
                                       className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">ایمیل</label>
                                <input id="email" ref={emailRef} type="email" placeholder="ایمیل خود را وارد کنید"
                                       defaultValue=""
                                       className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label htmlFor="firstName"
                                           className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">نام</label>
                                    <input id="firstName" ref={firstNameRef} type="text" placeholder="نام شما"
                                           defaultValue=""
                                           className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                                </div>
                                <div>
                                    <label htmlFor="lastName"
                                           className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">نام
                                        خانوادگی</label>
                                    <input id="lastName" ref={lastNameRef} type="text" placeholder="نام خانوادگی"
                                           defaultValue=""
                                           className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone"
                                       className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">شماره
                                    تلفن</label>
                                <input id="phone" ref={phoneRef} type="tel" placeholder="09123456789" defaultValue=""
                                       className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role"
                                       className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">نوع
                                    حساب</label>
                                <select
                                    id="role"
                                    ref={roleRef}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"
                                >
                                    <option value="patient">بیمار</option>
                                    <option value="doctor">پزشک</option>
                                </select>
                            </div>

                            {/* Doctor-specific fields */}
                            {role === "doctor" && (
                                <div className="doctor-fields border-t border-[color:var(--border)] pt-4 mt-2 space-y-4"
                                     style={{display: 'block'}}>
                                    <div className="mb-4">
                                        <label htmlFor="licenseNumber"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">شماره
                                            نظام پزشکی</label>
                                        <input id="licenseNumber" ref={licenseNumberRef} type="text"
                                               placeholder="شماره نظام پزشکی را وارد کنید" defaultValue=""
                                               className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="specialty"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">تخصص</label>
                                        <select id="specialty" ref={specialtyIdRef}
                                                className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"
                                                disabled={loadingSpecialties}>
                                            <option value="">انتخاب تخصص</option>
                                            {specialties.map((spec) => (
                                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                                            ))}
                                        </select>
                                        {loadingSpecialties &&
                                            <p className="text-xs text-[color:var(--color-muted)] mt-1">در حال بارگذاری
                                                تخصص‌ها...</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="consultationFee"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">هزینه
                                            ویزیت (تومان)</label>
                                        <input id="consultationFee" ref={consultationFeeRef} type="number"
                                               placeholder="مثلاً 150000" defaultValue=""
                                               className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <label htmlFor="gender"
                                                   className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">جنسیت</label>
                                            <select id="gender" ref={genderRef}
                                                    className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]">
                                                <option value="male">آقا</option>
                                                <option value="female">خانم</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="visitType"
                                                   className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">نوع
                                                ویزیت</label>
                                            <select id="visitType" ref={visitTypeRef}
                                                    className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]">
                                                <option value="in_person">حضوری</option>
                                                <option value="online">آنلاین</option>
                                                <option value="both">هر دو</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="bio"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">بیوگرافی</label>
                                        <textarea id="bio" ref={bioRef} rows="3" placeholder="درباره خودتان بنویسید..."
                                                  className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="experienceYears"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">سال
                                            سابقه</label>
                                        <input id="experienceYears" ref={experienceYearsRef} type="number"
                                               placeholder="مثلاً 5" defaultValue="0"
                                               className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="city"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">
                                            شهر مطب
                                        </label>
                                        <input id="city" ref={cityRef} type="text" placeholder="مثلاً تهران"
                                               defaultValue=""
                                               className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"/>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="address"
                                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">
                                            آدرس مطب
                                        </label>
                                        <textarea id="address" ref={addressRef} rows="2"
                                                  placeholder="آدرس دقیق مطب خود را وارد کنید..."
                                                  className="w-full border rounded-lg px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-[color:var(--color-background)]"></textarea>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Password field */}
                    <div className={isSignUp ? "mb-4" : "mb-2"}>
                        <label htmlFor="password"
                               className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">رمز
                            عبور</label>
                        <div className="relative">
                            <input id="password" ref={passwordRef} type={showPassword ? "text" : "password"}
                                   placeholder="رمز عبور خود را وارد کنید" defaultValue=""
                                   className="w-full border rounded-lg px-4 py-3 pr-11 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-white"/>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] transition"
                                    aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}>
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.06 0 2.08.175 3.025.5M15 12a3 3 0 01-3 3m6.364-5.364A9.956 9.956 0 0121 12c0 3-4 7-9 7m0 0L3 3m18 18L3 3"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {isSignUp && (
                        <div className="mb-2">
                            <label htmlFor="confirmPassword"
                                   className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1">تکرار
                                رمز
                                عبور</label>
                            <div className="relative">
                                <input id="confirmPassword" ref={confirmPasswordRef}
                                       type={showConfirmPassword ? "text" : "password"}
                                       placeholder="رمز عبور را دوباره وارد کنید" defaultValue=""
                                       className="w-full border rounded-lg px-4 py-3 pr-11 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] outline-none transition focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent border-[color:var(--border)] bg-white"/>
                                <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] transition"
                                        aria-label={showConfirmPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}>
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.06 0 2.08.175 3.025.5M15 12a3 3 0 01-3 3m6.364-5.364A9.956 9.956 0 0121 12c0 3-4 7-9 7m0 0L3 3m18 18L3 3"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {!isSignUp && (
                        <div className="text-right mb-6">
                            <a href="#"
                               className="text-sm font-medium text-[color:var(--color-primary)] hover:underline">فراموشی
                                رمز عبور؟</a>
                        </div>
                    )}

                    {isSignUp && <div className="mb-4"/>}

                    <button onClick={isSignUp ? handleSignUp : handleLogin} disabled={loading}
                            className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] font-medium py-3 rounded-full hover:opacity-90 active:scale-[0.98] transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? (isSignUp ? "در حال ثبت‌نام..." : "در حال ورود...") : (isSignUp ? "ثبت نام" : "ورود")}
                    </button>

                    <p className="text-center text-sm text-[color:var(--color-muted)]">
                        {isSignUp ? "قبلاً حساب کاربری دارید؟" : "هنوز حساب کاربری ندارید؟"}{" "}
                        <button type="button" onClick={isSignUp ? switchToLogin : switchToSignUp}
                                className="font-medium text-[color:var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer p-0">
                            {isSignUp ? "ورود" : "ثبت نام"}
                        </button>
                    </p>

                </div>
                {/* end my-auto inner wrapper */}
            </div>
            {/* end right panel */}
        </div>
    );
}
