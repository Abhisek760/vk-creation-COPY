'use client';

import React from 'react';

interface CustomerFormProps {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  onChange: (updatedCustomer: any) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer = {}, onChange }) => {
  const safeCustomer = {
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
  };

  return (
    <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-5">
      <h3 className="text-lg font-semibold text-stone-200">Customer Details</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Full Name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="e.g. Rahul Sharma"
            value={safeCustomer.name}
            onChange={(e) =>
              onChange({
                ...safeCustomer,
                name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Phone Number</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="e.g. +91 9876543210"
            value={safeCustomer.phone}
            onChange={(e) =>
              onChange({
                ...safeCustomer,
                phone: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Email Address</label>
          <input
            type="email"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="rahul@example.com"
            value={safeCustomer.email}
            onChange={(e) =>
              onChange({
                ...safeCustomer,
                email: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-400">Address / City</label>
          <input
            type="text"
            className="w-full rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            placeholder="e.g. Mumbai, Maharashtra"
            value={safeCustomer.address}
            onChange={(e) =>
              onChange({
                ...safeCustomer,
                address: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
