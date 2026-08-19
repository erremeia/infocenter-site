/**
 * Dados centrais da empresa. Edite apenas este arquivo para atualizar
 * Instagram e os dados de cada unidade (WhatsApp, endereço, link do Maps).
 */
export type UnitId = 'corregoDoOuro' | 'trapiche'

export interface CompanyUnit {
  id: UnitId
  name: string
  shortName: string
  whatsappNumber: string
  phoneDisplay: string
  address: string
  reference: string
  mapsUrl: string
}

const buildMapsSearchUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

export const UNITS: CompanyUnit[] = [
  {
    id: 'corregoDoOuro',
    name: 'INFO CENTER Córrego do Ouro',
    shortName: 'Córrego do Ouro',
    whatsappNumber: '5522988098818',
    phoneDisplay: '(22) 98809-8818',
    address: 'Av. Miguel Peixoto Guimarães, nº 349 - Córrego do Ouro, Macaé - RJ',
    reference: '',
    // TODO: substituir pelo link exato do Google Maps desta unidade
    // (no Google Maps, abra o local e use "Compartilhar" > "Copiar link")
    mapsUrl: buildMapsSearchUrl(
      'Av. Miguel Peixoto Guimarães, nº 349 - Córrego do Ouro, Macaé - RJ',
    ),
  },
  {
    id: 'trapiche',
    name: 'INFO CENTER Trapiche',
    shortName: 'Trapiche',
    whatsappNumber: '5522981593659',
    phoneDisplay: '(22) 98159-3659',
    address: 'RJ-162, nº 767 — Trapiche, Rio de Janeiro - RJ',
    reference: 'Em frente à Madeireira Paraíso e ao Campo de Futebol',
    // TODO: substituir pelo link exato do Google Maps desta unidade
    // (no Google Maps, abra o local e use "Compartilhar" > "Copiar link")
    mapsUrl: buildMapsSearchUrl('RJ-162, nº 767 — Trapiche, Rio de Janeiro - RJ'),
  },
]

export const SITE_CONFIG = {
  companyName: 'INFO CENTER',

  instagramHandle: '@iinfocenter_',
  instagramUrl: 'https://instagram.com/iinfocenter_',

  units: UNITS,
}

export function getUnitById(id: UnitId): CompanyUnit | undefined {
  return UNITS.find((unit) => unit.id === id)
}
