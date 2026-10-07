/**
 * MXGP.store — site-wide chrome (Header + Footer).
 *
 * Racing-inspired chrome: black header with red accents, condensed display
 * font, Vietnamese navigation. Renders on every storefront page via
 * DesignPack.siteChrome (designs/blank/index.ts).
 */
import Link from "next/link";
import { Archivo } from "next/font/google";
import { brand } from "@/brand.config";
import type { DesignChromeProps } from "../types";
import "./blank.css";

const display = Archivo({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const NAV = [
  { label: "Tin tức", href: "blog" },
  { label: "Cửa hàng", href: "produkter" },
  { label: "Giỏ hàng", href: "cart" },
  { label: "Tài khoản", href: "account" },
] as const;

export function BlankHeader({ locale }: DesignChromeProps) {
  const home = `/${locale}`;
  return (
    <header className={`blank-canvas ${display.className}`}>
      {/* Top red strip */}
      <div aria-hidden className="mxgp-topstrip" />
      <div className="mxgp-headerbar">
        <nav aria-label="Primary" className="mxgp-nav">
          <Link href={home} className="mxgp-logo" aria-label={brand.storeName}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mxgp-store-logo.png"
              alt="MXGP.store"
              className="mxgp-logo-img"
            />
          </Link>
          <div className="mxgp-navlinks">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={`${home}/${item.href}`}
                className="mxgp-navlink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function BlankFooter({ locale }: DesignChromeProps) {
  const home = `/${locale}`;
  const year = new Date().getFullYear();
  return (
    <footer className={`blank-canvas ${display.className}`}>
      <div className="mxgp-footer">
        <div className="mxgp-footer-grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mxgp-store-logo.png"
              alt="MXGP.store"
              className="mxgp-logo-img"
            />
            <p className="mxgp-footer-blurb">
              {brand.tagline || "Tin tức MXGP & cửa hàng chính hãng"}
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="mxgp-footer-title">Khám phá</p>
            <ul className="mxgp-footer-links">
              <li>
                <Link href={`${home}/blog`}>Tin tức</Link>
              </li>
              <li>
                <Link href={`${home}/produkter`}>Cửa hàng</Link>
              </li>
              <li>
                <Link href={`${home}/cart`}>Giỏ hàng</Link>
              </li>
              <li>
                <Link href={`${home}/account`}>Tài khoản</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <p className="mxgp-footer-title">Thông tin</p>
            <ul className="mxgp-footer-links">
              <li>
                <Link href={`${home}/info/fragt`}>Vận chuyển</Link>
              </li>
              <li>
                <Link href={`${home}/info/returnering`}>Đổi trả</Link>
              </li>
              <li>
                <Link href={`${home}/privacy`}>Bảo mật</Link>
              </li>
              <li>
                <Link href={`${home}/contact`}>Liên hệ</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mxgp-footer-bottom">
          © {year} {brand.storeName} — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
