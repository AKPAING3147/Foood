import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="gradient-text">Delicious Food</span>
              <br />
              <span className="text-gray-900 dark:text-white">Delivered to Your Door</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Order from the best restaurants in town. Fast delivery, secure payments, and amazing food await you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg btn-hover-lift shadow-lg"
              >
                Order Now
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg btn-hover-lift shadow-lg border-2 border-gray-200 dark:border-gray-700"
              >
                Create Account
              </Link>
            </div>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Why Choose FoodieOrder?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 card-hover animate-fade-in">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your food delivered hot and fresh in 30 minutes or less!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Secure Payments</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pay with Stripe or cash on delivery. Your choice, your convenience!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 card-hover animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Quality Food</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Only the best restaurants and highest quality ingredients!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in">
            Join thousands of happy customers enjoying delicious food every day!
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg btn-hover-lift shadow-xl"
          >
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 gradient-text">FoodieOrder</h3>
          <p className="text-gray-400 mb-6">
            Delicious food delivered to your door. Fast, fresh, and fantastic!
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            © 2026 FoodieOrder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

