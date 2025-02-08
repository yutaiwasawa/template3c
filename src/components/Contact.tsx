import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    const mailtoUrl = `mailto:lightblue1212@gmail.com?subject=Contact from ${data.name}&body=Name: ${data.name}%0D%0APhone: ${data.phone}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMessage:%0D%0A${data.message}`;
    
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-purple-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Let's Create Something Amazing</h2>
            <div className="mb-6">
              <p className="text-gray-400">〒106-0032</p>
              <p className="text-gray-400">東京都港区六本木3-2-1 デジタルタワー15階</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-400">info@digital-marketing.co.jp</p>
              <p className="text-gray-400">03-1234-5678</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                name="name"
                placeholder="お名前"
                required
                className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="メールアドレス"
                required
                className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="電話番号"
                required
                className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="お問い合わせ内容"
                rows={4}
                required
                className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-purple-500 transition-colors"
              ></textarea>
            </div>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition duration-300 uppercase tracking-wider text-sm"
            >
              送信する
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;