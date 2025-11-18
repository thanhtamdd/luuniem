import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Type session có user
type SessionWithUser = {
  user: {
    id: string
    email: string
    role: string
  }
}

// Kiểm tra quyền admin
async function checkAdmin() {
  // Cast authOptions as any để TS không complain
  const session = (await getServerSession(authOptions as any)) as SessionWithUser | null
  if (!session || session.user.role !== 'admin') return false
  return true
}

// GET: lấy danh sách sản phẩm
export async function GET(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pool = await getConnection()
  if (!pool)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })

  const result = await pool.request().query('SELECT * FROM Products')
  return NextResponse.json(result.recordset)
}

// POST: thêm sản phẩm
export async function POST(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, price, description } = await req.json()
  const pool = await getConnection()
  if (!pool)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })

  await pool.request()
    .input('Name', name)
    .input('Price', price)
    .input('Description', description)
    .query(
      'INSERT INTO Products (Name, Price, Description) VALUES (@Name, @Price, @Description)'
    )

  return NextResponse.json({ message: 'Product added successfully' })
}

// PUT: cập nhật sản phẩm (query ?id=)
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const { name, price, description } = await req.json()

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const pool = await getConnection()
  if (!pool)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })

  await pool.request()
    .input('Id', id)
    .input('Name', name)
    .input('Price', price)
    .input('Description', description)
    .query(
      'UPDATE Products SET Name=@Name, Price=@Price, Description=@Description WHERE Id=@Id'
    )

  return NextResponse.json({ message: 'Product updated successfully' })
}

// DELETE: xóa sản phẩm (query ?id=)
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const pool = await getConnection()
  if (!pool)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })

  await pool.request().input('Id', id).query('DELETE FROM Products WHERE Id=@Id')

  return NextResponse.json({ message: 'Product deleted successfully' })
}
