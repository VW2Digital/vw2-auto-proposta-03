import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const PROPOSAL_PASSWORD = process.env.PROPOSAL_ACCESS_PASSWORD || 'nexo2026'

type Body = {
  password?: string
  action?: 'accept' | 'negotiate'
  message?: string
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const body = (await request.json().catch(() => ({}))) as Body

  if (!body.password || body.password !== PROPOSAL_PASSWORD) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'proposals',
    where: { accessToken: { equals: token } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const proposal = found.docs[0]
  if (!proposal) {
    return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 })
  }

  const viewable = ['enviada', 'aceita', 'negociacao', 'fechada']
  if (!viewable.includes(String(proposal.status))) {
    return NextResponse.json(
      { error: 'Proposta ainda não disponível' },
      { status: 403 },
    )
  }

  // Unlock only — return sanitized proposal
  if (!body.action) {
    return NextResponse.json({
      id: proposal.id,
      company: proposal.company,
      fullName: proposal.fullName,
      status: proposal.status,
      services: proposal.services,
      formalPrice: proposal.formalPrice,
      contentBlocks: proposal.contentBlocks || [],
      sentAt: proposal.sentAt,
      clientResponse: proposal.clientResponse,
      negotiateMessage: proposal.negotiateMessage,
      clientRespondedAt: proposal.clientRespondedAt,
    })
  }

  if (proposal.clientResponse) {
    return NextResponse.json(
      { error: 'Esta proposta já foi respondida' },
      { status: 409 },
    )
  }

  if (body.action === 'accept') {
    const updated = await payload.update({
      collection: 'proposals',
      id: proposal.id,
      data: {
        status: 'aceita',
        clientResponse: 'accept',
        clientRespondedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })
    return NextResponse.json({
      ok: true,
      status: updated.status,
      clientResponse: updated.clientResponse,
    })
  }

  if (body.action === 'negotiate') {
    const updated = await payload.update({
      collection: 'proposals',
      id: proposal.id,
      data: {
        status: 'negociacao',
        clientResponse: 'negotiate',
        negotiateMessage: body.message || '',
        clientRespondedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })
    return NextResponse.json({
      ok: true,
      status: updated.status,
      clientResponse: updated.clientResponse,
      negotiateMessage: updated.negotiateMessage,
    })
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
}
