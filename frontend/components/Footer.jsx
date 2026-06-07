import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-8 shadow-[0_-16px_28px_-16px_rgba(24,20,67,0.15)]">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Top Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-3xl font-bold text-foreground">
              عضویت در خبرنامه ما
            </h3>

            <p className="mb-8 max-w-md text-[17px] leading-8 text-muted">
              برای دریافت جدیدترین اخبار و پیشنهادات ایمیل خود را وارد کنید.
            </p>

            <form className="flex max-w-md overflow-hidden rounded-xl bg-background shadow-sm">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="w-full bg-transparent px-5 py-4 text-foreground outline-none"
              />

              <button
                type="submit"
                className="m-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                عضویت
              </button>
            </form>
          </div>

          {/* Menu */}
          <div>
            <h4 className="mb-6 text-xl font-semibold text-foreground">
              منو
            </h4>

            <ul className="space-y-4 text-muted">
              <li>
                <Link
                  href="/"
                  className="inline-block rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground"
                >
                  صفحه اصلی
                </Link>
              </li>

              <li>
                <Link href="/about">درباره ما</Link>
              </li>

              <li>
                <Link href="/services">خدمات</Link>
              </li>

              <li>
                <Link href="/service-single">خدمات تک</Link>
              </li>

              <li>
                <Link href="/blog">بلاگ</Link>
              </li>

              <li>
                <Link href="/blog-post">پست بلاگ</Link>
              </li>
            </ul>
          </div>

          {/* Utility Pages */}
          <div>
            <h4 className="mb-6 text-xl font-semibold text-foreground">
              صفحات کمکی
            </h4>

            <ul className="space-y-4 text-muted">
              <li>
                <Link href="/contact">تماس</Link>
              </li>

              <li>
                <Link href="/style-guide">راهنمای سبک</Link>
              </li>

              <li>
                <Link href="/password-protected">محافظت‌شده با رمز</Link>
              </li>

              <li>
                <Link href="/404">۴۰۴ یافت نشد</Link>
              </li>

              <li>
                <Link href="/start-here">از اینجا شروع کنید</Link>
              </li>

              <li>
                <Link href="/licenses">مجوزها</Link>
              </li>

              <li>
                <Link href="/changelog">تغییرات</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-xl font-semibold text-foreground">
              ارتباط
            </h4>

            <ul className="space-y-6 text-muted">
              <li className="flex items-start gap-3">
                <HiOutlineMail
                  size={20}
                  className="mt-1 text-primary"
                />
                <span>contact@dentalic.com</span>
              </li>

              <li className="flex items-start gap-3">
                <FiPhone size={20} className="mt-1 text-primary" />
                <span>(487) 120 - 7980</span>
              </li>

              <li className="flex items-start gap-3">
                <FiMapPin size={20} className="mt-1 text-primary" />
                <span>
                  24 Broadcast Drive
                  <br />
                  Charlotte NC 28202, USA
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-border" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--primary)]">
              <span className="text-xl">🦷</span>
            </div>

            <span className="text-4xl font-bold text-foreground">
              کلینیک
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-5 text-muted">
            <FaFacebookF size={18} />
            <FaTwitter size={18} />
            <FaInstagram size={18} />
            <FaLinkedinIn size={18} />
            <FaYoutube size={18} />
            <FaTelegramPlane size={18} />
            <FaWhatsapp size={18} />
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-muted lg:text-right">
            کپی‌رایت © Dentalic طراحی شده توسط{" "}
            <span className="text-primary">BRIX Templates</span> · اجرا شده توسط{" "}
            <span className="text-primary">Webflow</span>
          </p>
        </div>
      </div>
    </footer>
  );
}