import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import ThemeToggle from './components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, ShieldIcon } from 'lucide-react';

type View = 'user' | 'admin';

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentView, setCurrentView] = useState<View>('user');

  const handleFeedbackSubmit = () => {
    // Increment the key to force a refresh of the FeedbackList
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster />
      <ThemeToggle />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.h1 
          className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Feedback System
        </motion.h1>
        
        <motion.p
          className="text-center text-gray-600 dark:text-gray-300 mb-8"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Share your thoughts and help us improve
        </motion.p>
        
        <div className="flex justify-center mb-8">
          <motion.div 
            className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-md flex"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              className={`px-6 py-2 rounded-full flex items-center ${
                currentView === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setCurrentView('user')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserIcon size={18} className="mr-2" />
              Submit Feedback
            </motion.button>
            <motion.button
              className={`px-6 py-2 rounded-full flex items-center ${
                currentView === 'admin'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setCurrentView('admin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShieldIcon size={18} className="mr-2" />
              Admin View
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {currentView === 'user' ? (
            <motion.div
              key="user-view"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Submit Your Feedback
              </h2>
              <FeedbackForm onSubmit={handleFeedbackSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="admin-view"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                All Feedback
              </h2>
              <FeedbackList key={refreshKey} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <motion.footer 
        className="mt-12 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        © {new Date().getFullYear()} Feedback System. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default App;