import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await prisma.emailCapture.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email já registado' },
        { status: 200 }
      )
    }

    // Save email to database
    await prisma.emailCapture.create({
      data: {
        email,
        source: 'newsletter'
      }
    })

    // TODO: Send welcome email with discount code
    // await sendWelcomeEmail(email)

    return NextResponse.json(
      { message: 'Subscrito com sucesso!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar subscrição' },
      { status: 500 }
    )
  }
}