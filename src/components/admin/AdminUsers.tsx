'use client'

import { useState } from 'react'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { SearchInput } from '@/components/ui/search/SearchInput'
import { ExportButton } from '@/components/ui/export/ExportButton'
import { FiMail, FiCalendar, FiUser, FiSettings } from 'react-icons/fi'
import { formatDate } from '@/lib/export/csv-export'

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const { data: users, isLoading, error } = useAdminUsers({
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter
  })

  const exportColumns = [
    { key: 'id', label: 'User ID' },
    { key: 'email', label: 'Email' },
    { key: 'display_name', label: 'Display Name' },
    { key: 'subscription_status', label: 'Subscription' },
    { 
      key: 'created_at', 
      label: 'Created Date',
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
        <span>Failed to load users: {error.message}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-base-content/70 mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        
        <ExportButton
          data={users || []}
          columns={exportColumns}
          filename="users-export"
          title="Users Export"
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
                placeholder="Search users by email, name..."
                className="w-full"
              />
            </div>
            
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="with_subscription">With Subscription</option>
              <option value="free">Free Users</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Subscription</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-12">
                            <span className="text-xs">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.display_name || 'No name'}</div>
                          <div className="text-sm opacity-50 flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${
                        user.subscription_status === 'active' ? 'badge-success' :
                        user.subscription_status === 'past_due' ? 'badge-warning' :
                        user.subscription_status === 'canceled' ? 'badge-error' :
                        'badge-ghost'
                      }`}>
                        {user.subscription_status || 'free'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString()}
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
                              View Profile
                            </button>
                          </li>
                          <li>
                            <button className="gap-2">
                              <FiMail className="w-4 h-4" />
                              Send Email
                            </button>
                          </li>
                          <li>
                            <button className="gap-2 text-warning">
                              Suspend User
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!users?.length && (
              <div className="text-center py-8 text-base-content/50">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}