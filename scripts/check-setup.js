#!/usr/bin/env node

/**
 * Setup Validation Script
 *
 * Run this script to check if your environment is properly configured.
 * Usage: node scripts/check-setup.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const { red, green, yellow, blue, cyan, bright, reset } = colors;

console.log(`\n${bright}${cyan}🚀 SaaS Boilerplate Setup Checker${reset}\n`);

// Track results
let errors = 0;
let warnings = 0;
let success = 0;

// Helper functions
function checkmark() {
  return `${green}✓${reset}`;
}

function crossmark() {
  return `${red}✗${reset}`;
}

function warningmark() {
  return `${yellow}⚠${reset}`;
}

function printSuccess(message) {
  console.log(`${checkmark()} ${message}`);
  success++;
}

function printError(message) {
  console.log(`${crossmark()} ${red}${message}${reset}`);
  errors++;
}

function printWarning(message) {
  console.log(`${warningmark()} ${yellow}${message}${reset}`);
  warnings++;
}

function printInfo(message) {
  console.log(`  ${blue}→${reset} ${message}`);
}

// Check if .env.local exists
function checkEnvFile() {
  console.log(`\n${bright}Checking environment file...${reset}`);

  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    printError('.env.local file not found');
    printInfo('Run: cp .env.local.example .env.local');
    return false;
  }

  printSuccess('.env.local file exists');
  return true;
}

// Load and check environment variables
function checkEnvVariables() {
  console.log(`\n${bright}Checking environment variables...${reset}`);

  // Load .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');

  // Parse environment variables
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });

  // Required variables
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': 'Supabase project URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase anon key',
    'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key',
    'NEXT_PUBLIC_APP_URL': 'Application URL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Stripe publishable key',
    'STRIPE_SECRET_KEY': 'Stripe secret key',
    'STRIPE_WEBHOOK_SECRET': 'Stripe webhook secret',
    'STRIPE_PRO_MONTHLY_PRICE_ID': 'Stripe Pro monthly price ID',
    'STRIPE_PRO_ANNUAL_PRICE_ID': 'Stripe Pro annual price ID',
    'STRIPE_TEAMS_MONTHLY_PRICE_ID': 'Stripe Teams monthly price ID',
    'STRIPE_TEAMS_ANNUAL_PRICE_ID': 'Stripe Teams annual price ID',
  };

  // Optional variables
  const optional = {
    'RESEND_API_KEY': 'Resend API key (for emails)',
    'RESEND_FROM_EMAIL': 'Resend from email',
    'NEXT_PUBLIC_POSTHOG_KEY': 'PostHog API key (for analytics)',
    'NEXT_PUBLIC_POSTHOG_HOST': 'PostHog host',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID': 'Google OAuth client ID',
    'GOOGLE_CLIENT_SECRET': 'Google OAuth client secret',
  };

  // Check required variables
  console.log(`\n${cyan}Required variables:${reset}`);
  Object.entries(required).forEach(([key, description]) => {
    const value = env[key];

    if (!value || value.includes('your-') || value.includes('xxx')) {
      printError(`${key} is not set or contains placeholder value`);
      printInfo(`Description: ${description}`);
    } else {
      printSuccess(`${key} is set`);
    }
  });

  // Check optional variables
  console.log(`\n${cyan}Optional variables:${reset}`);
  Object.entries(optional).forEach(([key, description]) => {
    const value = env[key];

    if (!value || value.includes('your-') || value.includes('xxx')) {
      printWarning(`${key} is not set (${description})`);
    } else {
      printSuccess(`${key} is set`);
    }
  });
}

// Check if dependencies are installed
function checkDependencies() {
  console.log(`\n${bright}Checking dependencies...${reset}`);

  const nodeModulesPath = path.join(process.cwd(), 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    printError('node_modules not found');
    printInfo('Run: npm install');
    return false;
  }

  printSuccess('Dependencies are installed');
  return true;
}

// Check if site-config is customized
function checkSiteConfig() {
  console.log(`\n${bright}Checking site configuration...${reset}`);

  const configPath = path.join(process.cwd(), 'src/config/site-config.ts');

  if (!fs.existsSync(configPath)) {
    printError('site-config.ts not found');
    return false;
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');

  // Check if default values are still present
  if (configContent.includes('SaaS Boilerplate') && configContent.includes('hello@yoursaas.com')) {
    printWarning('site-config.ts contains default values');
    printInfo('Edit src/config/site-config.ts to customize your site');
  } else {
    printSuccess('site-config.ts has been customized');
  }
}

// Check if Supabase migrations need to be run
function checkMigrations() {
  console.log(`\n${bright}Checking database migrations...${reset}`);

  const migrationsPath = path.join(process.cwd(), 'supabase/migrations');

  if (!fs.existsSync(migrationsPath)) {
    printWarning('No migrations directory found');
    return false;
  }

  const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'));

  if (migrations.length === 0) {
    printWarning('No migration files found');
    return false;
  }

  printSuccess(`Found ${migrations.length} migration file(s)`);
  printInfo('Make sure to run: npx supabase db push');
}

// Print summary
function printSummary() {
  console.log(`\n${bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${reset}`);
  console.log(`${bright}Summary${reset}\n`);

  console.log(`${green}✓ Passed:${reset} ${success}`);
  console.log(`${yellow}⚠ Warnings:${reset} ${warnings}`);
  console.log(`${red}✗ Errors:${reset} ${errors}`);

  console.log(`\n${bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${reset}`);

  if (errors === 0 && warnings === 0) {
    console.log(`\n${green}${bright}🎉 Your setup looks great! You're ready to go!${reset}`);
    console.log(`\n${cyan}Next steps:${reset}`);
    console.log(`  1. ${blue}npm run dev${reset} - Start development server`);
    console.log(`  2. Visit ${blue}http://localhost:3000${reset}`);
    console.log(`  3. Sign up and test the authentication flow`);
  } else if (errors === 0) {
    console.log(`\n${yellow}${bright}⚠️  Setup is functional but has warnings${reset}`);
    console.log(`\n${cyan}Optional improvements:${reset}`);
    console.log(`  - Add email configuration (Resend)`);
    console.log(`  - Add analytics (PostHog)`);
    console.log(`  - Configure OAuth providers`);
    console.log(`\n${green}You can still run:${reset} ${blue}npm run dev${reset}`);
  } else {
    console.log(`\n${red}${bright}❌ Setup has errors that need to be fixed${reset}`);
    console.log(`\n${cyan}Next steps:${reset}`);
    console.log(`  1. Fix the errors listed above`);
    console.log(`  2. Run this script again: ${blue}node scripts/check-setup.js${reset}`);
    console.log(`  3. See ${blue}SETUP.md${reset} for detailed instructions`);
  }

  console.log('');
}

// Run all checks
function runChecks() {
  const hasEnv = checkEnvFile();

  if (hasEnv) {
    checkEnvVariables();
  }

  checkDependencies();
  checkSiteConfig();
  checkMigrations();

  printSummary();

  // Exit with error code if there are errors
  process.exit(errors > 0 ? 1 : 0);
}

// Run the checks
runChecks();
