import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Configure postgres client with timeout and connection settings
const client = postgres(env.DATABASE_URL, {
	max: 1, // Limit connections for serverless
	idle_timeout: 20,
	connect_timeout: 10,
	prepare: false // Required for Supabase Transaction pool mode
});

export const db = drizzle(client, { schema });

// Test database connection with raw SQL
export async function testConnection() {
	try {
		console.log('[DB] Testing connection with raw SQL...');
		const result = await client`SELECT 1 as test`;
		console.log('[DB] Connection test successful:', result);
		return true;
	} catch (err) {
		console.error('[DB] Connection test failed:', err);
		if (err instanceof Error) {
			console.error('[DB] Error message:', err.message);
			console.error('[DB] Error stack:', err.stack);
		}
		return false;
	}
}

// Test if we can query the posts table
export async function testPostsTable() {
	try {
		console.log('[DB] Testing posts table query...');
		const result = await db.select().from(schema.posts).limit(1);
		console.log('[DB] Posts table query successful, found', result.length, 'posts');
		return true;
	} catch (err) {
		console.error('[DB] Posts table query failed:', err);
		if (err instanceof Error) {
			console.error('[DB] Error message:', err.message);
		}
		return false;
	}
}

// Test a simple insert (without committing)
export async function testInsert() {
	try {
		console.log('[DB] Testing insert capability...');
		// This will help us see if the issue is with the insert specifically
		const testResult = await db
			.insert(schema.posts)
			.values({
				title: 'TEST',
				content: '<p>Test</p>',
				slug: `test-${Date.now()}`,
				status: 'pending'
			})
			.returning();
		console.log('[DB] Test insert successful:', testResult);
		return true;
	} catch (err) {
		console.error('[DB] Test insert failed:', err);
		if (err instanceof Error) {
			console.error('[DB] Error message:', err.message);
			console.error('[DB] Error stack:', err.stack);
		}
		return false;
	}
}
