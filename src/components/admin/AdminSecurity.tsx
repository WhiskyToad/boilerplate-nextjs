'use client'

import { useState, useEffect } from 'react'
import { FiShield, FiAlertTriangle, FiActivity, FiEye, FiClock, FiGlobe } from 'react-icons/fi'
import { AuditLogger, AuditEventTypes } from '@/lib/security/audit-log'
import { supabase } from '@/lib/supabase/client'

interface SecurityMetrics {
  totalEvents: number
  securityEvents: number
  failedLogins: number
  rateLimitViolations: number
  suspiciousActivity: number
  blockedIPs: number
}

interface SecurityEvent {
  id: string
  event_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  ip_address: string
  user_id?: string
  created_at: string
  resolved: boolean
}

export function AdminSecurity() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    securityEvents: 0,
    failedLogins: 0,
    rateLimitViolations: 0,
    suspiciousActivity: 0,
    blockedIPs: 0,
  })
  
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    setIsLoading(true)
    try {
      // Load security metrics
      const [auditStats, securityEvents, failedLogins, rateLimits] = await Promise.all([
        AuditLogger.getStats(),
        loadSecurityEvents(),
        loadFailedLogins(),
        loadRateLimitViolations(),
      ])

      setMetrics({
        totalEvents: auditStats.totalEvents,
        securityEvents: auditStats.securityEvents,
        failedLogins: failedLogins.length,
        rateLimitViolations: rateLimits.length,
        suspiciousActivity: auditStats.eventsBySeverity['high'] || 0,
        blockedIPs: 0, // Would need to implement IP blocking
      })

      setRecentEvents(securityEvents.slice(0, 10))
    } catch (error) {
      console.error('Failed to load security data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSecurityEvents = async (): Promise<SecurityEvent[]> => {
    // Simulate security events for demo purposes
    // In production, these would come from actual security tables
    return [
      {
        id: '1',
        event_type: 'suspicious_activity',
        severity: 'high',
        description: 'Multiple failed login attempts from single IP',
        ip_address: '192.168.1.100',
        created_at: new Date().toISOString(),
        resolved: false,
      },
      {
        id: '2', 
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        description: 'API rate limit exceeded for endpoint /api/users',
        ip_address: '10.0.0.1',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        resolved: true,
      },
    ]
  }

  const loadFailedLogins = async () => {
    // Simulate failed login data
    return [
      { id: '1', email: 'test@example.com', ip_address: '192.168.1.100' },
      { id: '2', email: 'user@example.com', ip_address: '10.0.0.1' },
    ]
  }

  const loadRateLimitViolations = async () => {
    // Simulate rate limit violations
    return [
      { id: '1', ip_address: '192.168.1.100', endpoint: '/api/auth/login' },
      { id: '2', ip_address: '10.0.0.1', endpoint: '/api/users' },
    ]
  }

  const handleResolveEvent = async (eventId: string) => {
    try {
      // In production, this would update the security_events table
      // For now, just update local state
      setRecentEvents(events =>
        events.map(event =>
          event.id === eventId ? { ...event, resolved: true } : event
        )
      )
      setSelectedEvent(null)
      
      console.log('Resolved security event:', eventId)
    } catch (error) {
      console.error('Failed to resolve security event:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error'
      case 'high':
        return 'text-warning'
      case 'medium':
        return 'text-info'
      case 'low':
      default:
        return 'text-success'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'badge-error'
      case 'high':
        return 'badge-warning'
      case 'medium':
        return 'badge-info'
      case 'low':
      default:
        return 'badge-success'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-base-300 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-base-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FiShield className="w-8 h-8 text-primary" />
            Security Dashboard
          </h1>
          <p className="text-base-content/70 mt-2">
            Monitor security events and system health
          </p>
        </div>
        
        <button
          onClick={loadSecurityData}
          className="btn btn-primary gap-2"
        >
          <FiActivity className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm">Total Events (24h)</p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
              <div className="p-3 rounded-lg bg-base-200">
                <FiActivity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm">Security Violations</p>
                <p className="text-2xl font-bold text-error">{metrics.securityEvents}</p>
              </div>
              <div className="p-3 rounded-lg bg-error/10">
                <FiAlertTriangle className="w-6 h-6 text-error" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm">Failed Logins</p>
                <p className="text-2xl font-bold text-warning">{metrics.failedLogins}</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <FiEye className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm">Rate Limit Hits</p>
                <p className="text-2xl font-bold text-info">{metrics.rateLimitViolations}</p>
              </div>
              <div className="p-3 rounded-lg bg-info/10">
                <FiClock className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm">Suspicious Activity</p>
                <p className="text-2xl font-bold text-warning">{metrics.suspiciousActivity}</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <FiAlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/70 text-sm">Blocked IPs</p>
                <p className="text-2xl font-bold">{metrics.blockedIPs}</p>
              </div>
              <div className="p-3 rounded-lg bg-base-200">
                <FiGlobe className="w-6 h-6 text-neutral" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Security Events</h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event Type</th>
                  <th>Severity</th>
                  <th>IP Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="text-sm">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{event.event_type}</div>
                      <div className="text-sm text-base-content/70 truncate max-w-xs">
                        {event.description}
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getSeverityBadge(event.severity)}`}>
                        {event.severity}
                      </div>
                    </td>
                    <td>
                      <code className="text-sm">{event.ip_address}</code>
                    </td>
                    <td>
                      {event.resolved ? (
                        <div className="badge badge-success">Resolved</div>
                      ) : (
                        <div className="badge badge-warning">Pending</div>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="btn btn-ghost btn-sm"
                        >
                          View
                        </button>
                        {!event.resolved && (
                          <button
                            onClick={() => handleResolveEvent(event.id)}
                            className="btn btn-success btn-sm"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentEvents.length === 0 && (
              <div className="text-center py-8 text-base-content/50">
                No security events found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Security Event Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Event Type</span>
                  </label>
                  <div className="text-sm">{selectedEvent.event_type}</div>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Severity</span>
                  </label>
                  <div className={`badge ${getSeverityBadge(selectedEvent.severity)}`}>
                    {selectedEvent.severity}
                  </div>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">IP Address</span>
                  </label>
                  <code className="text-sm">{selectedEvent.ip_address}</code>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Time</span>
                  </label>
                  <div className="text-sm">
                    {new Date(selectedEvent.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <div className="text-sm bg-base-200 p-3 rounded">
                  {selectedEvent.description}
                </div>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                onClick={() => setSelectedEvent(null)}
                className="btn"
              >
                Close
              </button>
              {!selectedEvent.resolved && (
                <button
                  onClick={() => handleResolveEvent(selectedEvent.id)}
                  className="btn btn-success"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}