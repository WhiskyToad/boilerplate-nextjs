import { supabase } from '@/lib/supabase/client'

export interface AuditLogEntry {
  id?: string
  event_type: string
  user_id?: string
  user_email?: string
  resource_type?: string
  resource_id?: string
  action: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  session_id?: string
  timestamp?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  success: boolean
  error_message?: string
}

// Audit event types
export const AuditEventTypes = {
  AUTH: {
    LOGIN: 'auth.login',
    LOGOUT: 'auth.logout',
    SIGNUP: 'auth.signup',
    PASSWORD_RESET: 'auth.password_reset',
    PASSWORD_CHANGE: 'auth.password_change',
    EMAIL_VERIFICATION: 'auth.email_verification',
    FAILED_LOGIN: 'auth.failed_login',
    ACCOUNT_LOCKED: 'auth.account_locked',
    TWO_FACTOR_ENABLED: 'auth.2fa_enabled',
    TWO_FACTOR_DISABLED: 'auth.2fa_disabled',
  },
  USER: {
    PROFILE_UPDATE: 'user.profile_update',
    EMAIL_CHANGE: 'user.email_change',
    AVATAR_UPLOAD: 'user.avatar_upload',
    ACCOUNT_DELETION: 'user.account_deletion',
    PREFERENCES_UPDATE: 'user.preferences_update',
  },
  SECURITY: {
    SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
    RATE_LIMIT_EXCEEDED: 'security.rate_limit_exceeded',
    CSRF_VIOLATION: 'security.csrf_violation',
    SQL_INJECTION_ATTEMPT: 'security.sql_injection_attempt',
    XSS_ATTEMPT: 'security.xss_attempt',
    UNAUTHORIZED_ACCESS: 'security.unauthorized_access',
    PRIVILEGE_ESCALATION: 'security.privilege_escalation',
  },
  ADMIN: {
    USER_CREATED: 'admin.user_created',
    USER_SUSPENDED: 'admin.user_suspended',
    USER_DELETED: 'admin.user_deleted',
    ROLE_CHANGED: 'admin.role_changed',
    SYSTEM_SETTING_CHANGED: 'admin.system_setting_changed',
    BACKUP_CREATED: 'admin.backup_created',
    MAINTENANCE_MODE: 'admin.maintenance_mode',
  },
  DATA: {
    EXPORT: 'data.export',
    IMPORT: 'data.import',
    BACKUP: 'data.backup',
    RESTORE: 'data.restore',
    DELETION: 'data.deletion',
  },
  SUBSCRIPTION: {
    CREATED: 'subscription.created',
    UPDATED: 'subscription.updated',
    CANCELED: 'subscription.canceled',
    PAYMENT_FAILED: 'subscription.payment_failed',
    TRIAL_STARTED: 'subscription.trial_started',
    TRIAL_ENDED: 'subscription.trial_ended',
  },
} as const

export class AuditLogger {
  // Create audit log entry
  static async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      }

      // In production, you might want to use a dedicated audit log table
      // For now, we'll use console logging and optional database storage
      console.log('AUDIT_LOG:', JSON.stringify(auditEntry, null, 2))

      // Store in database (optional - implement based on your needs)
      if (process.env.ENABLE_AUDIT_DB_LOGGING === 'true') {
        await this.storeInDatabase(auditEntry)
      }

      // Send to external logging service (optional)
      if (process.env.AUDIT_WEBHOOK_URL) {
        await this.sendToWebhook(auditEntry)
      }

    } catch (error) {
      console.error('Failed to create audit log:', error)
      // Don't throw - audit logging should not break the main flow
    }
  }

  // Store audit log in database
  private static async storeInDatabase(entry: AuditLogEntry): Promise<void> {
    try {
      // In production, this would insert into the audit_logs table
      // For now, just console log since the table doesn't exist in current schema
      console.log('Would store audit log in database:', {
        event_type: entry.event_type,
        user_id: entry.user_id,
        action: entry.action,
        severity: entry.severity,
        success: entry.success,
      })
    } catch (error) {
      console.error('Database audit logging error:', error)
    }
  }

  // Send audit log to external webhook
  private static async sendToWebhook(entry: AuditLogEntry): Promise<void> {
    try {
      const webhookUrl = process.env.AUDIT_WEBHOOK_URL
      if (!webhookUrl) return

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AUDIT_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      console.error('Webhook audit logging error:', error)
    }
  }

  // Helper methods for common audit scenarios
  static async logAuthEvent(
    eventType: string,
    success: boolean,
    userId?: string,
    email?: string,
    details?: Record<string, any>,
    request?: {
      ip?: string
      userAgent?: string
    }
  ): Promise<void> {
    await this.log({
      event_type: eventType,
      user_id: userId,
      user_email: email,
      action: eventType.split('.')[1],
      details,
      ip_address: request?.ip,
      user_agent: request?.userAgent,
      severity: success ? 'low' : 'medium',
      success,
    })
  }

  static async logSecurityEvent(
    eventType: string,
    details: Record<string, any>,
    request?: {
      ip?: string
      userAgent?: string
    },
    userId?: string
  ): Promise<void> {
    await this.log({
      event_type: eventType,
      user_id: userId,
      action: 'security_violation',
      details,
      ip_address: request?.ip,
      user_agent: request?.userAgent,
      severity: 'high',
      success: false,
    })
  }

  static async logAdminAction(
    action: string,
    adminUserId: string,
    targetResourceType: string,
    targetResourceId: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.log({
      event_type: `admin.${action}`,
      user_id: adminUserId,
      resource_type: targetResourceType,
      resource_id: targetResourceId,
      action,
      details,
      severity: 'medium',
      success: true,
    })
  }

  static async logDataOperation(
    operation: string,
    resourceType: string,
    resourceId: string,
    userId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.log({
      event_type: `data.${operation}`,
      user_id: userId,
      resource_type: resourceType,
      resource_id: resourceId,
      action: operation,
      details,
      severity: operation === 'deletion' ? 'high' : 'low',
      success: true,
    })
  }

  // Query audit logs (for admin interfaces)
  static async queryLogs(filters: {
    userId?: string
    eventType?: string
    dateFrom?: string
    dateTo?: string
    severity?: string
    limit?: number
  }): Promise<AuditLogEntry[]> {
    // In production, this would query the actual audit_logs table
    // For now, return empty array since the table doesn't exist in current schema
    console.log('Query audit logs with filters:', filters)
    return []
  }

  // Get audit log statistics
  static async getStats(dateFrom?: string, dateTo?: string): Promise<{
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    securityEvents: number
  }> {
    // In production, this would query the actual audit_logs table
    // For now, return mock statistics
    console.log('Get audit stats for date range:', dateFrom, dateTo)
    
    return {
      totalEvents: 150,
      eventsByType: {
        'auth.login': 45,
        'auth.logout': 23,
        'security.suspicious_activity': 5,
        'user.profile_update': 12,
      },
      eventsBySeverity: {
        low: 120,
        medium: 25,
        high: 5,
        critical: 0,
      },
      securityEvents: 8,
    }
  }
}