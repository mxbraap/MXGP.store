import Link from "next/link";
import { prisma } from "@/lib/db";
import { getBrand } from "@/lib/brand";

export const dynamic = "force-dynamic";

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 7,
      select: { slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true, author: true },
    });
  } catch { return []; }
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true, priceDkk: true, images: true },
    });
  } catch { return []; }
}

function formatPrice(priceDkk: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(priceDkk / 100);
}

export default async function HomePage() {
  const brand = await getBrand();
  const posts = await getLatestPosts();
  const products = await getFeaturedProducts();
  const [hero, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white font-sans">
      {hero && (
        <section className="relative h-[85vh] min-h-[500px] w-full overflow-hidden bg-black">
          {hero.coverImage && (
            <img src={hero.coverImage} alt={hero.title}
              className="absolute inset-0 h-full w-full object-cover opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6">
            <span className="mb-3 inline-block w-fit bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Latest News
            </span>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            {hero.excerpt && (
              <p className="mt-4 max-w-2xl text-lg text-white/80 line-clamp-2">{hero.excerpt}</p>
            )}
            <Link href={`/blog/${hero.slug}`}
              className="mt-6 inline-block w-fit bg-red-600 px-8 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-red-700">
              Read More
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight">Latest News</h2>
          <Link href="/blog" className="font-bold text-red-600 hover:underline">View All →</Link>
        </div>
        {rest.length === 0 ? (
          <p className="text-gray-500">No articles yet. Publish your first post in /admin.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="overflow-hidden bg-gray-100 aspect-[16/9]">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title}
                      className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <h3 className="mt-4 text-xl font-bold leading-snug group-hover:text-red-600">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight">Featured Products</h2>
            <Link href="/produkter" className="font-bold text-red-600 hover:underline">Shop All →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => {
              let imgs: string[] = [];
              try { imgs = JSON.parse(p.images || "[]"); } catch {}
              return (
                <Link key={p.id} href={`/produkter/${p.slug}`} className="group bg-white p-4 shadow-sm">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {imgs[0] && (
                      <img src={imgs[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
                    )}
                  </div>
                  <h3 className="mt-3 font-bold group-hover:text-red-600">{p.name}</h3>
                  <p className="mt-1 font-black">{formatPrice(p.priceDkk)}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-red-600 py-16 text-center text-white">
        <h2 className="text-3xl font-black uppercase">MXGP News & Online Store</h2>
        <p className="mt-3 text-white/90">Stay updated with the latest from the FIM Motocross World Championship.</p>
        <Link href="/produkter"
          className="mt-6 inline-block bg-black px-8 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-900">
          Visit Shop
        </Link>
      </section>
    </div>
  );
}
