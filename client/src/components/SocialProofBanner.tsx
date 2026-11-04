import { Building2, Bed, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function SocialProofBanner() {
  return null;
  const stats = [
    {
      icon: Building2,
      value: "100+",
      label: "PBSA Operators",
      testId: "stat-operators"
    },
    {
      icon: Bed,
      value: "20,000+",
      label: "Student Beds Automated",
      testId: "stat-beds"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Average Occupancy Rate",
      testId: "stat-occupancy"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900 py-12" data-testid="social-proof-banner">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2" data-testid="text-social-proof-heading">
            Built for UK Student Accommodation Providers
          </h3>
          <p className="text-tf-lime text-lg font-semibold" data-testid="text-social-proof-subtitle">
            Join the AI automation revolution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.testId}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-testid={stat.testId}
              >
                <div className="w-16 h-16 rounded-full bg-tf-lime/10 border-2 border-tf-lime flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-tf-lime" />
                </div>
                <div className="text-4xl font-bold text-white mb-2" data-testid={`${stat.testId}-value`}>
                  {stat.value}
                </div>
                <div className="text-base text-gray-300 font-medium" data-testid={`${stat.testId}-label`}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
