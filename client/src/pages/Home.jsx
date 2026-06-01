import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-[#f6f1ea] overflow-hidden">

      {/* HERO SECTION */}

      <section className="min-h-screen flex items-center">

        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">

          <div>

            <p className="uppercase tracking-[5px] text-[#8a6a50] font-semibold text-sm">
              Crafted For Modern Living
            </p>

            <h1 className="mt-8 text-6xl lg:text-8xl font-black leading-[1.05] text-[#2b1d14]">

              Furniture

              <span className="block text-[#7b5a43]">
                That Feels
              </span>

              Like Home

            </h1>

            <p className="mt-10 text-xl text-gray-600 leading-10 max-w-2xl">

              Premium furniture designed to transform
              ordinary spaces into timeless interiors.

              Experience luxury comfort, modern aesthetics,
              and AI-powered room inspiration built for
              your lifestyle.

            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <Link to="/products">

                <button className="bg-[#5c3d2e] hover:bg-[#4b3024] text-white px-10 py-5 rounded-2xl text-lg font-semibold shadow-lg transition">

                  Explore Collection

                </button>

              </Link>

              <Link to="/ai-room">

                <button className="border-2 border-[#5c3d2e] text-[#5c3d2e] hover:bg-[#5c3d2e] hover:text-white px-10 py-5 rounded-2xl text-lg font-semibold transition">

                  Try AI Room Analyzer

                </button>

              </Link>

            </div>

          </div>

          <div className="relative">

            <div className="absolute top-10 -left-10 w-64 h-64 bg-[#d9c1ac] rounded-full blur-3xl opacity-40"></div>

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#c8a78b] rounded-full blur-3xl opacity-30"></div>

            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Interior"
              className="relative z-10 rounded-[40px] shadow-2xl h-[750px] w-full object-cover"
            />

            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl z-20 max-w-sm">

              <p className="text-sm text-gray-500">
                Featured Collection
              </p>

              <h3 className="text-2xl font-bold text-[#2b1d14] mt-2 leading-9">
                Scandinavian Wooden Lounge Set
              </h3>

              <p className="mt-4 text-[#7b5a43] font-semibold text-lg">
                Starting from ₹24,999
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <img
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop"
              alt="Interior"
              className="rounded-[40px] shadow-2xl h-[650px] w-full object-cover"
            />

          </div>

          <div>

            <p className="uppercase tracking-[4px] text-[#8a6a50] font-semibold text-sm">

              Smart Living Experience

            </p>

            <h2 className="mt-6 text-5xl font-black leading-tight text-[#2b1d14]">

              Discover Furniture
              That Matches Your Style

            </h2>

            <p className="mt-8 text-xl text-gray-600 leading-10">

              Our AI-powered system analyzes your
              room aesthetics and helps you find
              furniture that perfectly blends with
              your space, lighting, and interior mood.

            </p>

            <div className="mt-12 space-y-6">

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <h3 className="text-2xl font-bold text-[#2b1d14]">

                  Personalized Recommendations

                </h3>

                <p className="mt-3 text-gray-600 leading-8">

                  Furniture suggestions based on
                  your room design and ambience.

                </p>

              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <h3 className="text-2xl font-bold text-[#2b1d14]">

                  Seamless Shopping Experience

                </h3>

                <p className="mt-3 text-gray-600 leading-8">

                  Explore, analyze, and purchase —
                  all in one smooth experience.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="pt-10 pb-24">

  <div className="max-w-7xl mx-auto px-6 border-t border-[#e5d7c8] pt-16">

    <div className="grid lg:grid-cols-2 gap-20 items-center">

      <div>

        <p className="uppercase tracking-[4px] text-[#8a6a50] font-semibold text-sm">

          FurniSelect Experience

        </p>

        <h2 className="mt-6 text-6xl font-black leading-tight text-[#2b1d14]">

          Furniture Chosen
          For Your Space,
          Not Just Your Cart

        </h2>

        <p className="mt-8 text-xl text-gray-600 leading-10">

          Great interiors are not created by buying
          random furniture. They are built through
          thoughtful choices that complement your
          lifestyle, space, and personal taste.

          FurniSelect combines premium furniture
          collections with AI-powered room analysis
          to help you make confident design decisions.

        </p>

        <div className="mt-16 grid grid-cols-3 gap-10">

          <div>

            <h3 className="text-4xl font-black text-[#2b1d14]">

              500+

            </h3>

            <p className="mt-2 text-gray-500">

              Premium Designs

            </p>

          </div>

          <div>

            <h3 className="text-4xl font-black text-[#2b1d14]">

              AI

            </h3>

            <p className="mt-2 text-gray-500">

              Smart Matching

            </p>

          </div>

          <div>

            <h3 className="text-4xl font-black text-[#2b1d14]">

              24/7

            </h3>

            <p className="mt-2 text-gray-500">

              Support Team

            </p>

          </div>

        </div>

      </div>

      <div className="relative">

        <img
          src="https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop"
          alt="Modern Interior"
          className="rounded-[40px] shadow-xl h-[650px] w-full object-cover"
        />

        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-lg">

          <p className="text-sm text-gray-500">

            AI Powered Recommendation

          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#2b1d14]">

            Perfect Match For
            Modern Interiors

          </h3>

        </div>

      </div>

    </div>

  </div>

</section>
<section className="py-32">

  <div className="max-w-5xl mx-auto px-6">

    <div className="bg-[#2b1d14] rounded-[50px] p-16 text-center text-white">

      <p className="uppercase tracking-[4px] text-[#d8b99f] text-sm">

        Start Your Design Journey

      </p>

      <h2 className="mt-6 text-6xl font-black leading-tight">

        Create A Home
        You'll Love Coming Back To

      </h2>

      <p className="mt-8 text-lg text-gray-300 max-w-2xl mx-auto leading-8">

        Browse curated furniture collections,
        discover AI-powered recommendations,
        and transform your living space with
        confidence.

      </p>

      <Link to="/products">

        <button className="mt-10 bg-white text-[#2b1d14] px-10 py-5 rounded-2xl font-bold hover:scale-105 transition">

          Explore Collection

        </button>

      </Link>

    </div>

  </div>

</section>

    </div>
  );
}

export default Home;