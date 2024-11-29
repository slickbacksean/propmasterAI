import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">PropMaster AI</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced AI-driven insights for smarter prop betting.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h4>
          <nav className="space-y-2">
            <Link href="/insights" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Insights Explorer
            </Link>
            <Link href="/trends" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Trend Analysis
            </Link>
            <Link href="/builder" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Prop Builder
            </Link>
          </nav>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Legal</h4>
          <nav className="space-y-2">
            <Link href="/terms" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Terms of Service
            </Link>
            <Link href="/privacy" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 py-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © {currentYear} PropMaster AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;