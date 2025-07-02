// components/account/EditAddressForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EditAddressFormProps {
  user: {
    id: number;
    phoneNumber: string | null;
    address: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
  };
}

export default function EditAddressForm({ user }: EditAddressFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    addressLine2: user.addressLine2 || '',
    city: user.city || '',
    state: user.state || '',
    country: user.country || '',
    postalCode: user.postalCode || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/account/update-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update address');
      }

      toast.success('Address updated successfully');
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="addressLine2" className="block text-sm font-medium mb-1">
                Address Line 2
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                value={formData.addressLine2}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State/Province *
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Country *
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
                required
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                Postal Code *
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                )}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="mt-2"
        >
          {user.address ? 'Edit Address' : 'Add Address'}
        </Button>
      )}
    </div>
  );
}