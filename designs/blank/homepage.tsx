/**
 * MXGP.store — news-first homepage (mxgp.com style).
 *
 * Layout:
 *   1. Hero — latest published post, full-bleed with cover image
 *   2. News grid — the next latest posts
 *   3. Featured products — "Shop the news" merch row (webshop mode)
 *   4. Red CTA band — link into the shop
 *
 * React Server Component. Internal links are prefixed with `/${locale}`.
 * The engine wraps this in <main>, so we render <div>/<section> only.
 */
import Link from "next/link";
import { Archivo } from "next/font/google";
import { prisma } from "@/lib/db";
import { brand } from "@/brand.config";
import { formatPrice } from "@/lib/format";
import type { DesignHomepageProps, DesignProduct } from "../types";
import "./blank.css";

const display = Archivo({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

function formatDate(d: Date | null | undefined): string {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

function productImage(p: DesignProduct): string | null {
  if (p.imageUrl) return p.imageUrl;
  try {
    const arr = JSON.parse(p.images) as unknown;
    if (Array.isArray(arr) && typeof arr[0] === "string" && arr[0]) return arr[0];
  } catch {
    /* malformed images JSON → no image, never a fabricated fallback */
  }
  return null;
}

export default async function MxgpHomepage({
  locale,
  featured,
}: DesignHomepageProps) {
  // DB errors must not 500 the homepage — render empty news sections instead.
  let posts: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    author: string | null;
    publishedAt: Date | null;
  }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 7,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        author: true,
        publishedAt: true,
      },
    });
  } catch {
    /* database unreachable — page renders with empty news sections */
  }

  const [heroPost, ...restPosts] = posts;
  const products = (featured ?? []).slice(0, 4);

  return (
    <div className={`blank-canvas ${display.className}`}>
      {/* ── 1. HERO — latest news ─────────────────────────────────── */}
      {heroPost ? (
        <section className="mxgp-hero" aria-label="Tin nổi bật">
          {heroPost.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroPost.coverImage}
              alt=""
              aria-hidden
              className="mxgp-hero-bg"
            />
          )}
          <div className="mxgp-hero-shade" aria-hidden />
          <div className="mxgp-hero-inner">
            <p className="mxgp-kicker">Tin nổi bật</p>
            <h1 className="mxgp-hero-title">{heroPost.title}</h1>
            {heroPost.excerpt && (
              <p className="mxgp-hero-excerpt">{heroPost.excerpt}</p>
            )}
            <div className="mxgp-hero-meta">
              {heroPost.author && <span>{heroPost.author}</span>}
              {heroPost.publishedAt && (
                <time>{formatDate(heroPost.publishedAt)}</time>
              )}
            </div>
            <Link
              href={`/${locale}/blog/${heroPost.slug}`}
              className="mxgp-btn"
            >
              Đọc bài viết
            </Link>
          </div>
        </section>
      ) : (
        <section className="mxgp-hero mxgp-hero-empty" aria-label="Chào mừng">
          <div className="mxgp-hero-inner">
            <p className="mxgp-kicker">{brand.storeName}</p>
            <h1 className="mxgp-hero-title">
              Tin tức MXGP mới nhất, mỗi ngày
            </h1>
            <p className="mxgp-hero-excerpt">
              {brand.tagline || "Tin tức MXGP & cửa hàng chính hãng"}
            </p>
          </div>
        </section>
      )}

      {/* ── 2. NEWS GRID ──────────────────────────────────────────── */}
      <section className="mxgp-section" aria-label="Tin mới nhất">
        <div className="mxgp-section-head">
          <h2 className="mxgp-section-title">Tin mới nhất</h2>
          <Link href={`/${locale}/blog`} className="mxgp-section-link">
            Xem tất cả →
          </Link>
        </div>
        {restPosts.length > 0 ? (
          <div className="mxgp-newsgrid">
            {restPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="mxgp-newscard"
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    aria-hidden
                    className="mxgp-newscard-img"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="mxgp-newscard-img mxgp-newscard-img-empty"
                    aria-hidden
                  />
                )}
                <div className="mxgp-newscard-body">
                  {post.publishedAt && (
                    <time className="mxgp-newscard-date">
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  <h3 className="mxgp-newscard-title">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mxgp-newscard-excerpt">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mxgp-empty">
            Chưa có bài viết nào. Đăng bài đầu tiên trong trang quản trị /admin.
          </p>
        )}
      </section>

      {/* ── 3. FEATURED PRODUCTS ──────────────────────────────────── */}
      {products.length > 0 && (
        <section
          className="mxgp-section mxgp-section-alt"
          aria-label="Sản phẩm nổi bật"
        >
          <div className="mxgp-section-head">
            <h2 className="mxgp-section-title">Sản phẩm nổi bật</h2>
            <Link href={`/${locale}/produkter`} className="mxgp-section-link">
              Vào cửa hàng →
            </Link>
          </div>
          <div className="mxgp-productgrid">
            {products.map((p) => {
              const img = productImage(p);
              return (
                <Link
                  key={p.id}
                  href={`/${locale}/produkter/${p.slug}`}
                  className="mxgp-productcard"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={p.name}
                      className="mxgp-productcard-img"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="mxgp-productcard-img mxgp-productcard-img-empty"
                      aria-hidden
                    />
                  )}
                  <div className="mxgp-productcard-body">
                    <h3 className="mxgp-productcard-name">{p.name}</h3>
                    <p className="mxgp-productcard-price">
                      {formatPrice(p.priceDkk)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 4. CTA BAND ───────────────────────────────────────────── */}
      <section className="mxgp-cta" aria-label="Mua sắm">
        <h2 className="mxgp-cta-title">Đồ MXGP chính hãng</h2>
        <p className="mxgp-cta-text">
          Áo, mũ và phụ kiện từ thế giới Motocross Grand Prix.
        </p>
        <Link href={`/${locale}/produkter`} className="mxgp-btn mxgp-btn-light">
          Mua sắm ngay
        </Link>
      </section>
    </div>
  );
}
