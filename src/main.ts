import './style.css'
import { SITE_CONFIG, getUnitById, type CompanyUnit, type UnitId } from './config/site'
import { getWhatsAppLink, type WhatsAppMessageKey } from './utils/whatsapp'
import unitPhotoCorregoDoOuro from './assets/unit-corrego-do-ouro.png'
import unitPhotoTrapiche from './assets/unit-trapiche.png'
import logoFull from './assets/logo-infocenter.png'
import logoIcon from './assets/logo-infocenter-icon.png'

/* ---------- Dados centrais (nome da empresa, Instagram) ---------- */

function renderSiteInfo() {
  const fields: Record<string, string> = {
    companyName: SITE_CONFIG.companyName,
    instagramHandle: SITE_CONFIG.instagramHandle,
  }

  Object.entries(fields).forEach(([field, value]) => {
    document.querySelectorAll(`[data-field="${field}"]`).forEach((el) => {
      el.textContent = value
    })
  })
}

const BRAND_LOGOS: Record<string, string> = {
  full: logoFull,
  icon: logoIcon,
}

function wireBrandLogos() {
  document.querySelectorAll<HTMLImageElement>('[data-brand-logo]').forEach((img) => {
    const variant = img.dataset.brandLogo
    const src = variant ? BRAND_LOGOS[variant] : undefined
    if (src) {
      img.src = src
    }
  })
}

function wireInstagramLinks() {
  document.querySelectorAll<HTMLAnchorElement>('[data-instagram-link]').forEach((link) => {
    link.href = SITE_CONFIG.instagramUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
}

/* ---------- Dados por unidade (nome, endereço, telefone, mapa) ---------- */

function renderUnitFields() {
  document.querySelectorAll<HTMLElement>('[data-unit-field]').forEach((el) => {
    const unitId = el.dataset.unit as UnitId | undefined
    const field = el.dataset.unitField as keyof CompanyUnit | undefined
    if (!unitId || !field) return

    const unit = getUnitById(unitId)
    const value = unit?.[field]
    if (typeof value === 'string') {
      el.textContent = value
    }
  })
}

const UNIT_PHOTOS: Record<UnitId, string> = {
  corregoDoOuro: unitPhotoCorregoDoOuro,
  trapiche: unitPhotoTrapiche,
}

function wireUnitPhotos() {
  document.querySelectorAll<HTMLImageElement>('[data-unit-photo]').forEach((img) => {
    const unitId = img.dataset.unitPhoto as UnitId | undefined
    const src = unitId ? UNIT_PHOTOS[unitId] : undefined
    if (src) {
      img.src = src
    }
  })
}

function wireUnitMapsLinks() {
  document.querySelectorAll<HTMLAnchorElement>('[data-unit-maps-link]').forEach((link) => {
    const unitId = link.dataset.unit as UnitId | undefined
    const unit = unitId ? getUnitById(unitId) : undefined
    if (!unit) return

    link.href = unit.mapsUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
}

/** Botões de WhatsApp que já pertencem a uma unidade específica (ex.: card da unidade). */
function wireUnitWhatsAppLinks() {
  document.querySelectorAll<HTMLAnchorElement>('[data-unit-wa-link]').forEach((link) => {
    const unitId = link.dataset.unit as UnitId | undefined
    if (!unitId) return

    const href = getWhatsAppLink(unitId, 'geral')
    if (!href) return

    link.href = href
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
}

/* ---------- Modal seletor de unidade ---------- */

const unitModal = document.querySelector<HTMLElement>('#unitModal')
let pendingMessageKey: WhatsAppMessageKey = 'geral'
let lastFocusedTrigger: HTMLElement | null = null

function handleModalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeUnitModal()
}

function openUnitModal(key: WhatsAppMessageKey, trigger: HTMLElement | null) {
  if (!unitModal) return

  pendingMessageKey = key
  lastFocusedTrigger = trigger

  unitModal.hidden = false
  unitModal.classList.add('is-open')
  unitModal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
  document.addEventListener('keydown', handleModalKeydown)

  unitModal.querySelector<HTMLElement>('[data-modal-unit]')?.focus()
}

function closeUnitModal() {
  if (!unitModal) return

  unitModal.classList.remove('is-open')
  unitModal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('modal-open')
  document.removeEventListener('keydown', handleModalKeydown)

  lastFocusedTrigger?.focus()
  lastFocusedTrigger = null
}

function wireUnitModal() {
  if (!unitModal) return

  // Qualquer botão "Solicitar orçamento" / "Falar no WhatsApp" abre o modal.
  document.querySelectorAll<HTMLElement>('[data-wa-key]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      const key = trigger.dataset.waKey as WhatsAppMessageKey
      openUnitModal(key, trigger)
    })
  })

  // Fecha ao clicar no X ou no fundo escurecido.
  unitModal.querySelectorAll<HTMLElement>('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeUnitModal)
  })

  // Escolha da unidade dentro do modal: abre o WhatsApp certo e fecha o modal.
  unitModal.querySelectorAll<HTMLButtonElement>('[data-modal-unit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const unitId = btn.dataset.modalUnit as UnitId
      const href = getWhatsAppLink(unitId, pendingMessageKey)
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer')
      }
      closeUnitModal()
    })
  })
}

/* ---------- Cabeçalho / navegação ---------- */

const header = document.querySelector<HTMLElement>('#header')
const nav = document.querySelector<HTMLElement>('#nav')
const navToggle = document.querySelector<HTMLButtonElement>('#navToggle')
const yearEl = document.querySelector<HTMLSpanElement>('#year')

function setHeaderScrolled() {
  header?.classList.toggle('is-scrolled', window.scrollY > 8)
}

function closeNav() {
  nav?.classList.remove('is-open')
  navToggle?.setAttribute('aria-expanded', 'false')
  navToggle?.setAttribute('aria-label', 'Abrir menu')
}

function toggleNav() {
  const isOpen = Boolean(nav?.classList.toggle('is-open'))
  navToggle?.setAttribute('aria-expanded', String(isOpen))
  navToggle?.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu')
}

navToggle?.addEventListener('click', toggleNav)

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNav)
})

window.addEventListener('scroll', setHeaderScrolled, { passive: true })
setHeaderScrolled()

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear())
}

renderSiteInfo()
wireBrandLogos()
wireInstagramLinks()
renderUnitFields()
wireUnitPhotos()
wireUnitMapsLinks()
wireUnitWhatsAppLinks()
wireUnitModal()
