import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { collection, addDoc, Firestore } from 'firebase/firestore';
import { db } from '../firebase';

interface FeedbackFormProps {
  onSubmit: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.full_name || !formData.email || !formData.message) {
        throw new Error('All fields are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      // Validate rating
      if (formData.rating < 1) {
        throw new Error('Please select a rating');
      }

      // Check Firestore connection
      if (!db) {
        throw new Error('Database connection not available. Please try again later.');
      }

      // Submit feedback to Firebase
      console.log("Submitting feedback to Firestore...");
      const feedbacksCollection = collection(db, 'feedbacks');
      const feedbackData = {
        ...formData,
        created_at: new Date().toISOString()
      };
      
      const docRef = await addDoc(feedbacksCollection, feedbackData);
      console.log("Feedback submitted successfully to Firestore with ID:", docRef.id);
      
      // Show success toast
      toast.success('Feedback submitted successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        icon: '🎉',
      });

      // Clear form
      setFormData({
        full_name: '',
        email: '',
        message: '',
        rating: 0
      });

      // Call onSubmit callback
      onSubmit();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while submitting feedback';
      setError(errorMessage);
      console.error('Error submitting feedback:', err);
      
      // Show error toast with more specific message
      toast.error(
        errorMessage === 'Please select a rating' 
          ? 'Please select a rating before submitting'
          : errorMessage,
        {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="max-w-lg mx-auto p-6 glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error && (
        <motion.div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.div>
      )}
      
      <div className="mb-6">
        <label htmlFor="full_name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Full Name
        </label>
        <motion.input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="glass-input w-full"
          required
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Email
        </label>
        <motion.input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="glass-input w-full"
          required
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Message
        </label>
        <motion.textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="glass-input w-full h-32 resize-none"
          required
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Rating
        </label>
        <div 
          className="flex items-center" 
          onMouseLeave={handleRatingLeave}
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              onMouseEnter={() => handleRatingHover(rating)}
              className="p-1 mr-1 focus:outline-none"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star
                fill={
                  rating <= (hoveredRating || formData.rating)
                    ? '#FFD700'
                    : 'transparent'
                }
                stroke={
                  rating <= (hoveredRating || formData.rating)
                    ? '#FFD700'
                    : '#9CA3AF'
                }
                size={24}
              />
            </motion.button>
          ))}
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {formData.rating > 0 ? `${formData.rating} of 5` : 'Select a rating'}
          </span>
        </div>
      </div>
      
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="glass-button w-full flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          'Submit Feedback'
        )}
      </motion.button>
    </motion.form>
  );
};

export default FeedbackForm;