// Database utility functions
// For now, using JSON file storage. Can be easily migrated to MongoDB, PostgreSQL, etc.

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper function to read JSON file
export function readDataFile<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) {
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

// Helper function to write JSON file
export function writeDataFile<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, filename)
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

// Database collections
export const collections = {
  users: 'users.json',
  lessons: 'lessons.json',
  teachers: 'teachers.json',
  products: 'products.json',
  orders: 'orders.json',
  carts: 'carts.json',
} as const
