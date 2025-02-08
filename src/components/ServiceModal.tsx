import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon?: string;
}

const ServiceModal = ({ isOpen, onClose, title, description, price, features, icon }: ServiceModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-8 max-w-md w-full relative border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* <div className="text-4xl mb-4">{icon}</div> */}
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-gray-400 mb-6">{description}</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">¥{price}</span>
              <span className="text-gray-400 ml-2">/ 月</span>
            </div>

            <div className="mb-8">
              <h4 className="font-semibold mb-3 text-white">サービス内容:</h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition duration-300 uppercase tracking-wider text-sm"
              onClick={() => {
                window.location.href = '#contact';
                onClose();
              }}
            >
              申し込む
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;