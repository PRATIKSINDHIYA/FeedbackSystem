import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

interface Feedback {
  id: string;
  full_name: string;
  email: string;
  message: string;
  rating: number;
  created_at: string;
}

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feedbackName: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  feedbackName
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex items-center mb-4 text-amber-500">
          <AlertTriangle size={24} className="mr-2" />
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        </div>
        
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete the feedback from <span className="font-semibold">{feedbackName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <motion.button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          
          <motion.button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onConfirm}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({ 
    isOpen: false, 
    feedbackId: '', 
    feedbackName: '' 
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching feedbacks from Firestore...");
        const feedbacksCollection = collection(db, 'feedbacks');
        const feedbacksSnapshot = await getDocs(feedbacksCollection);
        
        const feedbacksData = feedbacksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Feedback[];
        
        console.log(`Successfully loaded ${feedbacksData.length} feedbacks from Firestore`);
        setFeedbacks(feedbacksData);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to load feedbacks. Please try again later.');
        toast.error('Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      feedbackId: id,
      feedbackName: name
    });
  };

  const handleCloseDialog = () => {
    setDeleteDialog({
      isOpen: false,
      feedbackId: '',
      feedbackName: ''
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.feedbackId) return;
    
    try {
      console.log(`Deleting feedback with ID: ${deleteDialog.feedbackId}`);
      const feedbackRef = doc(db, 'feedbacks', deleteDialog.feedbackId);
      await deleteDoc(feedbackRef);
      
      // Update the local state to remove the deleted feedback
      setFeedbacks(prev => prev.filter(feedback => feedback.id !== deleteDialog.feedbackId));
      
      toast.success('Feedback deleted successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
        icon: '🗑️',
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
        },
      });
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No feedback yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {feedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{feedback.full_name}</h3>
                <p className="text-sm text-gray-500">{feedback.email}</p>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{feedback.message}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-red-500">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Not Helpful</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <motion.button
                onClick={() => handleDeleteClick(feedback.id, feedback.full_name)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        feedbackName={deleteDialog.feedbackName}
      />
    </div>
  );
};

export default FeedbackList;