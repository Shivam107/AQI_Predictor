import React, { useState } from 'react';
import { HelpCircle, Search, Book, MessageCircle, Mail, Phone, FileText, Video } from 'lucide-react';

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Book,
      questions: [
        {
          q: 'How do I set up my first sensor?',
          a: 'To set up your first sensor, navigate to the Dashboard and click "Connect Device". Follow the on-screen instructions to pair your ESP8266 sensor with the platform.',
        },
        {
          q: 'What is AQI and how is it calculated?',
          a: 'AQI (Air Quality Index) is a numerical scale used to communicate how polluted the air currently is. It is calculated based on major air pollutants like PM2.5, PM10, O3, NO2, SO2, and CO.',
        },
        {
          q: 'How do I read the dashboard?',
          a: 'The dashboard shows real-time sensor data including temperature, humidity, gas levels, and current AQI. The color coding helps you quickly identify air quality levels: Green (Good), Yellow (Moderate), Orange (Unhealthy), Red (Very Unhealthy).',
        },
      ],
    },
    {
      title: 'Sensors & Data',
      icon: MessageCircle,
      questions: [
        {
          q: 'What sensors are supported?',
          a: 'We support ESP8266 with various air quality sensors including MQ135, DHT11/DHT22 for temperature and humidity, and GPS modules for location tracking.',
        },
        {
          q: 'How often is data updated?',
          a: 'Sensor data is updated every 3-5 seconds by default. You can configure this interval in the settings based on your requirements.',
        },
        {
          q: 'Can I export my data?',
          a: 'Yes! You can export your historical data in CSV or JSON format from the Analytics page. Click on the export button and select your preferred format and date range.',
        },
      ],
    },
    {
      title: 'Alerts & Notifications',
      icon: Mail,
      questions: [
        {
          q: 'How do I set up AQI alerts?',
          a: 'Go to Settings > Notifications and enable AQI Alerts. You can set custom thresholds under Alert Thresholds to receive notifications when air quality reaches concerning levels.',
        },
        {
          q: 'Can I get SMS notifications?',
          a: 'Yes, SMS notifications are available. Enable them in Settings > Notifications. Note that SMS alerts may incur additional charges based on your plan.',
        },
        {
          q: 'What types of alerts are available?',
          a: 'We offer email alerts, SMS alerts, push notifications, and weekly reports. You can customize which alerts you receive in the Settings page.',
        },
      ],
    },
  ];

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Documentation',
      description: 'Read detailed documentation',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Community Forum',
      description: 'Ask questions and get answers',
      icon: MessageCircle,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-500 mt-1">Find answers and get support</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, FAQs, tutorials..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
          />
        </div>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <button
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition text-left"
          >
            <div className={`p-3 rounded-lg ${resource.color} inline-block mb-4`}>
              <resource.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.title}</h3>
            <p className="text-sm text-gray-500">{resource.description}</p>
          </button>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {faqCategories.map((category, catIndex) => (
          <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <category.icon size={24} className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {category.questions.map((item, qIndex) => (
                <details key={qIndex} className="group">
                  <summary className="p-6 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.q}</span>
                    <HelpCircle size={20} className="text-gray-400 group-open:text-emerald-600 transition" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 bg-gray-50">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="text-emerald-100 mb-6">
            Our support team is here to help you 24/7
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center gap-2">
              <Mail size={20} />
              Email Support
            </button>
            <button className="px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition flex items-center gap-2">
              <Phone size={20} />
              Call Us
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-emerald-400">
            <p className="text-sm text-emerald-100">
              Email: support@aqimonitor.com | Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

