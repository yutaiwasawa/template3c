import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ServiceModal from './ServiceModal';

interface Service {
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
}

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      title: "Webサイト改善・コンサルティング",
      description: "データに基づく戦略的なサイト改善で、CVR向上を実現",
      price: "180,000",
      icon: "🎯",
      features: [
        "Webサイトの現状分析と改善提案",
        "ユーザー行動分析とUX/UI改善",
        "コンバージョン率の向上施策",
        "A/Bテストの実施と効果測定",
      ]
    },
    {
      title: "SNSマーケティング支援",
      description: "ソーシャルメディアを通じたブランド価値の向上と集客支援",
      price: "200,000",
      icon: "📱",
      features: [
        "SNSアカウントの戦略立案・運用代行",
        "エンゲージメント率を高めるコンテンツ制作",
        "インフルエンサーマーケティング",
        "広告運用とターゲティング最適化",
      ]
    },
    {
      title: "統合デジタルマーケティング",
      description: "オンライン上の全てのタッチポイントを最適化",
      price: "200,000",
      icon: "📊",
      features: [
        "包括的なデジタルマーケティング戦略の立案",
        "SEO/MEO対策による自然検索流入の強化",
        "コンテンツマーケティングの企画・実施",
        "全チャネルの統合分析とROI最大化",
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">サービス</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            お客様第一で売上にコミットできるサービス内容です。
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl hover:border-purple-500/50 transition duration-300"
            >
              {/* <div className="text-4xl mb-6">{service.icon}</div> */}
              <h3 className="text-xl font-bold mb-4 text-white">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">¥{service.price}</span>
                <span className="text-gray-400 ml-2">/ 月</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition duration-300 uppercase tracking-wider text-sm"
                onClick={() => setSelectedService(service)}
              >
                詳しく見る
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        {...(selectedService || {
          title: '',
          description: '',
          price: '',
          features: [],
          icon: ''
        })}
      />
    </section>
  );
};

export default Services;