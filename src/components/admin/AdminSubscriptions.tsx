'use client'

import { useState } from 'react'
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions'
import { SearchInput } from '@/components/ui/search/SearchInput'
import { ExportButton } from '@/components/ui/export/ExportButton'
import { FiDollarSign, FiCalendar, FiUser, FiSettings } from 'react-icons/fi'
import { formatDate } from '@/lib/export/csv-export'

export function AdminSubscriptions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const { data: subscriptions, isLoading, error } = useAdminSubscriptions({
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter
  })

  const exportColumns = [
    { key: 'user_email', label: 'User Email' },
    { key: 'user_name', label: 'User Name' },
    { key: 'status', label: 'Status' },
    { key: 'plan_name', label: 'Plan' },
    { 
      key: 'amount', 
      label: 'Amount',
      format: (value: any) => `$${(value / 100).toFixed(2)}`
    },
    { key: 'interval', label: 'Billing Interval' },
    { 
      key: 'created_at', 
      label: 'Created Date',
      format: (value: any) => formatDate(value, 'date')
    },
    { 
      key: 'current_period_end', 
      label: 'Next Billing',
      format: (value: any) => formatDate(value, 'date')
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-base-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-base-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Failed to load subscriptions: {error.message}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-base-content/70 mt-2">
            Monitor subscription status and billing
          </p>
        </div>
        
        <ExportButton
          data={subscriptions || []}
          columns={exportColumns}
          filename="subscriptions-export"
          title="Subscriptions Export"
          variant="single"
          format="both"
        />
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by user email or plan name..."
                className="w-full"
              />
            </div>
            
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Subscriptions</option>
              <option value="active">Active</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Next Billing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions?.map((subscription) => (
                  <tr key={subscription.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-xs">
                              {subscription.user_email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {subscription.user_name || 'No name'}
                          </div>
                          <div className="text-sm opacity-50 flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            {subscription.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold">{subscription.plan_name}</div>
                        <div className="text-sm opacity-50">
                          {subscription.interval}ly
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${
                        subscription.status === 'active' ? 'badge-success' :
                        subscription.status === 'past_due' ? 'badge-warning' :
                        subscription.status === 'canceled' ? 'badge-error' :
                        subscription.status === 'unpaid' ? 'badge-error' :
                        'badge-ghost'
                      }`}>
                        {subscription.status}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FiDollarSign className="w-4 h-4" />
                        <span className="font-semibold">
                          ${(subscription.amount / 100).toFixed(2)}
                        </span>
                        <span className="text-sm opacity-50">
                          /{subscription.interval}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FiCalendar className="w-3 h-3" />
                        {subscription.current_period_end 
                          ? new Date(subscription.current_period_end).toLocaleDateString()
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                          <FiSettings className="w-4 h-4" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                          <li>
                            <button className="gap-2">
                              <FiUser className="w-4 h-4" />
                              View Customer
                            </button>
                          </li>
                          <li>
                            <button className="gap-2">
                              <FiDollarSign className="w-4 h-4" />
                              Billing Portal
                            </button>
                          </li>
                          <li>
                            <button className="gap-2 text-warning">
                              Cancel Subscription
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!subscriptions?.length && (
              <div className="text-center py-8 text-base-content/50">
                No subscriptions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}