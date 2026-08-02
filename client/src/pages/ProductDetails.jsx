import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://furniselect-ai.onrender.com/api/products/${id}`);
        setProduct(data);
        const related = await axios.get(`https://furniselect-ai.onrender.com/api/products/${id}/related`);
        setRelatedProducts(related.data);
      } catch (error) { console.log(error); }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await axios.post("https://furniselect-ai.onrender.com/api/cart", { product: product._id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      window.alert("Added to cart");
    } catch { window.alert("Could not add this product to your cart"); }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      setReviewLoading(true);
      await axios.post(`https://furniselect-ai.onrender.com/api/products/${id}/review`, { rating, comment }, { headers: { Authorization: `Bearer ${token}` } });
      const { data } = await axios.get(`https://furniselect-ai.onrender.com/api/products/${id}`);
      setProduct(data); setComment("");
    } catch (error) { window.alert(error.response?.data?.message || "Could not submit review"); }
    finally { setReviewLoading(false); }
  };

  if (!product) return <main className="min-h-[70vh] bg-[#f8f6f2] px-5 py-20"><div className="mx-auto max-w-[1200px] animate-pulse"><div className="h-8 w-32 rounded bg-[#e8ded4]"/><div className="mt-8 grid gap-10 lg:grid-cols-2"><div className="h-[560px] rounded-[2rem] bg-[#e8ded4]"/><div className="space-y-5"><div className="h-14 rounded bg-[#e8ded4]"/><div className="h-24 rounded bg-[#e8ded4]"/><div className="h-52 rounded bg-[#e8ded4]"/></div></div></div></main>;

  const average = Number(product.averageRating || 0).toFixed(1);
  const isSoldOut = product.stock === 0;
  return <main className="bg-[#f8f6f2] text-[#27221e]"><div className="mx-auto max-w-[1320px] px-5 py-10 lg:px-8 lg:py-16"><Link to="/products" className="text-sm font-semibold text-[#8a5a3c]">&lt;- Back to collection</Link><div className="mt-8 grid gap-10 lg:grid-cols-[1.04fr_.96fr] lg:items-start"><div><div className="overflow-hidden rounded-[2rem] bg-[#e9dfd5] p-2 shadow-[0_22px_70px_rgba(77,54,37,.12)]"><img src={product.image} alt={product.title} className="aspect-[.95] max-h-[680px] w-full rounded-[1.55rem] object-cover"/></div><div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[.15em] text-[#897e75]"><span>FurniSelect collection</span><span>{product.category}</span></div></div><div className="lg:sticky lg:top-24"><p className="eyebrow">{product.category}</p><h1 className="serif mt-4 text-5xl leading-[1.05] tracking-[-.05em] sm:text-6xl">{product.title}</h1><div className="mt-5 flex items-center gap-3"><span className="rounded-full bg-[#e2f1e5] px-3 py-1.5 text-sm font-semibold text-[#397a4f]">★ {average}</span><span className="text-sm text-[#897e75]">{product.numReviews || 0} customer reviews</span></div><p className="mt-7 text-3xl font-semibold text-[#9a6038]">₹{Number(product.price).toLocaleString("en-IN")}</p><p className="mt-6 max-w-xl text-base leading-8 text-[#716861]">{product.description || "A considered piece designed to bring warmth, comfort and character to your home."}</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Material", product.material], ["Colour", product.color], ["Size", product.dimensions], ["Stock", isSoldOut ? "Sold out" : `${product.stock} available`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#e7ddd4] bg-white p-4"><p className="text-[10px] uppercase tracking-[.14em] text-[#897e75]">{label}</p><p className="mt-2 truncate text-sm font-semibold">{value || "—"}</p></div>)}</div>{product.tags?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full bg-[#efe4da] px-3 py-1.5 text-xs font-semibold text-[#815436]">{tag}</span>)}</div>}<div className="mt-8 flex flex-col gap-3 sm:flex-row"><button disabled={isSoldOut} onClick={addToCart} className="flex-1 rounded-xl bg-[#9a6038] px-6 py-4 font-semibold text-white transition hover:bg-[#7d4829] disabled:cursor-not-allowed disabled:bg-[#b9aaa0]">{isSoldOut ? "Sold out" : "Add to cart"}</button><button disabled={isSoldOut} onClick={() => navigate("/checkout", { state: { product, quantity: 1, buyNow: true } })} className="flex-1 rounded-xl bg-[#27221e] px-6 py-4 font-semibold text-white transition hover:bg-[#9a6038] disabled:cursor-not-allowed disabled:bg-[#b9aaa0]">Buy now</button></div><div className="mt-7 flex gap-4 border-t border-[#e1d7ce] pt-5 text-xs text-[#897e75]"><span>✓ Secure checkout</span><span>✓ Designed to last</span><span>✓ Made for living</span></div></div></div><section className="mt-20 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[1.75rem] bg-[#ede6dd] p-7 sm:p-10"><p className="eyebrow">The details</p><h2 className="serif mt-3 text-4xl">Made for your everyday.</h2><p className="mt-5 max-w-2xl leading-8 text-[#716861]">Every FurniSelect piece is chosen to bring comfort and character to your space. Pair it with natural textures, warm light and the pieces you already love.</p></div><div className="rounded-[1.75rem] border border-[#e7ddd4] bg-white p-7 sm:p-10"><p className="eyebrow">Care note</p><h2 className="serif mt-3 text-3xl">Live with it well.</h2><p className="mt-4 leading-7 text-[#716861]">Keep materials clean with gentle care and let the natural finish develop its own story over time.</p></div></section><section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[1.75rem] border border-[#e7ddd4] bg-white p-7 sm:p-10"><div className="flex items-end justify-between"><div><p className="eyebrow">Customer voice</p><h2 className="serif mt-3 text-4xl">Reviews</h2></div><span className="text-sm text-[#897e75]">{product.numReviews || 0} total</span></div>{product.reviews?.length ? <div className="mt-8 space-y-6">{product.reviews.map((review) => <div key={review._id} className="border-b border-[#eee6de] pb-5 last:border-0"><div className="flex justify-between gap-4"><p className="font-semibold">{review.name}</p><span className="text-sm tracking-widest text-[#b9794d]">{"★".repeat(review.rating)}</span></div><p className="mt-2 leading-7 text-[#716861]">{review.comment}</p></div>)}</div> : <p className="mt-8 text-[#897e75]">No reviews yet. Be the first to share your experience.</p>}</div><form onSubmit={submitReview} className="rounded-[1.75rem] bg-[#27221e] p-7 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d9a274]">Share your experience</p><h2 className="serif mt-3 text-3xl">Tell us what you think.</h2><div className="mt-7 flex gap-2">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} className={`text-2xl ${value <= rating ? "text-[#e1aa76]" : "text-white/25"}`}>★</button>)}</div><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How does this piece feel in your space?" rows="5" className="mt-5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#d9a274]"/><button disabled={reviewLoading} className="mt-4 w-full rounded-xl bg-[#d9a274] py-3.5 font-semibold text-[#27221e] transition hover:bg-white">{reviewLoading ? "Submitting..." : "Submit review"}</button></form></section><section className="mt-20"><div className="flex items-end justify-between"><div><p className="eyebrow">Keep browsing</p><h2 className="serif mt-3 text-4xl">You may also like.</h2></div><Link to="/products" className="text-sm font-semibold text-[#8a5a3c]">View collection -&gt;</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <Link key={item._id} to={`/products/${item._id}`} className="group"><div className="overflow-hidden rounded-2xl bg-[#e9dfd5]"><img src={item.image} alt={item.title} className="image-hover aspect-[.9] w-full object-cover"/></div><p className="mt-4 font-semibold">{item.title}</p><p className="mt-1 text-sm text-[#897e75]">₹{Number(item.price).toLocaleString("en-IN")}</p></Link>)}</div></section></div></main>;
}

export default ProductDetails;
