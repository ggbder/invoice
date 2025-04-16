
import React from 'react';
import { 
  Clipboard, 
  FilePlus2, 
  FileCheck, 
  FileSpreadsheet, 
  FileWarning, 
  Bell, 
  UserCheck,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    name: 'Manual Invoice Creation',
    description: 'Easily create detailed invoices with supplier data, types, dates, amounts, and references.',
    icon: FilePlus2,
    color: 'bg-blue-50 text-blue-600',
    delay: '0ms'
  },
  {
    name: 'Smart Validation',
    description: 'Powerful validation workflows to match invoices with contracts and purchase orders.',
    icon: FileCheck,
    color: 'bg-green-50 text-green-600',
    delay: '100ms'
  },
  {
    name: 'Batch Invoice Processing',
    description: 'Import invoice data from Excel files and validate against active contracts.',
    icon: FileSpreadsheet,
    color: 'bg-indigo-50 text-indigo-600',
    delay: '200ms'
  },
  {
    name: 'Rejection Handling',
    description: 'Streamlined rejection with statuses like "Revised," "Cancelled," or "Returned to Supplier."',
    icon: FileWarning,
    color: 'bg-amber-50 text-amber-600',
    delay: '300ms'
  },
  {
    name: 'Intelligent Reconciliation',
    description: 'Automatically match invoices with purchase orders or contracts to ensure compliance.',
    icon: ClipboardCheck,
    color: 'bg-purple-50 text-purple-600',
    delay: '400ms'
  },
  {
    name: 'Automated Notifications',
    description: 'Stay informed with alerts for validation steps, rejections, or approval confirmations.',
    icon: Bell,
    color: 'bg-rose-50 text-rose-600',
    delay: '500ms'
  },
  {
    name: 'Role-Based Approvals',
    description: 'Multi-level approval matrix customized per organizational structure.',
    icon: UserCheck,
    color: 'bg-teal-50 text-teal-600',
    delay: '600ms'
  },
  {
    name: 'Comprehensive Audit Trail',
    description: 'Track all actions from creation to approval or rejection for compliance.',
    icon: Clipboard,
    color: 'bg-cyan-50 text-cyan-600',
    delay: '700ms'
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-heading">
            Powerful features for efficient invoice management
          </h2>
          <p className="text-lg text-muted-foreground">
            RapproInvoice combines intelligent workflow automation with precision validation to streamline your entire invoice process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover-card animate-fade-in opacity-0" 
              style={{ animationDelay: feature.delay, animationFillMode: 'forwards' }}
            >
              <div className={cn("p-2 w-12 h-12 rounded-lg mb-5 flex items-center justify-center", feature.color)}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.name}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
