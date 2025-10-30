import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeTeams = searchParams.get('teams') === 'true';
    const includeAdmin = searchParams.get('admin') === 'true';
    const includeSecurity = searchParams.get('security') === 'true';

    const migrationsPath = join(process.cwd(), 'supabase', 'migrations');

    // Always include base
    const base = readFileSync(join(migrationsPath, 'core', '00_base.sql'), 'utf8');

    const parts = [base];

    // Add optional modules
    if (includeTeams) {
      const teams = readFileSync(join(migrationsPath, 'core', '01_teams.sql'), 'utf8');
      parts.push(teams);
    }

    if (includeAdmin) {
      const admin = readFileSync(join(migrationsPath, 'optional', 'admin.sql'), 'utf8');
      parts.push(admin);
    }

    if (includeSecurity) {
      const security = readFileSync(join(migrationsPath, 'optional', 'security.sql'), 'utf8');
      parts.push(security);
    }

    // Combine with separators
    const combined = parts.join('\n\n-- =============================================================================\n-- NEXT MODULE\n-- =============================================================================\n\n');

    return Response.json({
      sql: combined,
      modules: {
        base: true,
        teams: includeTeams,
        admin: includeAdmin,
        security: includeSecurity,
      }
    });

  } catch (error) {
    console.error('Migration API error:', error);
    return Response.json({ error: 'Failed to read migration files' }, { status: 500 });
  }
}
