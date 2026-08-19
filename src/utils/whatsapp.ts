import { getUnitById, type UnitId } from '../config/site'

export const WHATSAPP_MESSAGES = {
  geral:
    'Olá! 👋 Vim pelo site da INFO CENTER e gostaria de solicitar um orçamento.\n\n📱 Aparelho:\n🔧 Problema apresentado:',
  assistenciaTecnica:
    'Olá! 👋 Vim pelo site da INFO CENTER e preciso de assistência técnica.\n\n📱 Aparelho:\n🔧 Problema apresentado:',
  celulares:
    'Olá! 👋 Vim pelo site da INFO CENTER e gostaria de saber mais sobre os celulares disponíveis.',
  informatica:
    'Olá! 👋 Vim pelo site da INFO CENTER e preciso de assistência para computador ou notebook.\n\n💻 Equipamento:\n🔧 Problema apresentado:',
  acessorios:
    'Olá! 👋 Vim pelo site da INFO CENTER e gostaria de saber mais sobre os acessórios disponíveis.',
} as const

export type WhatsAppMessageKey = keyof typeof WHATSAPP_MESSAGES

export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

/** Gera o link de WhatsApp de uma unidade específica com a mensagem do botão de origem. */
export function getWhatsAppLink(unitId: UnitId, key: WhatsAppMessageKey): string | null {
  const unit = getUnitById(unitId)
  if (!unit) return null
  return buildWhatsAppLink(unit.whatsappNumber, WHATSAPP_MESSAGES[key])
}
