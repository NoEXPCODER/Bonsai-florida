import { readFile } from 'fs/promises'
import path from 'path'

const AVENIR_EMAIL_PATH = path.join(
  process.cwd(),
  'public',
  'email',
  'avenir-bonsai-workshop.html',
)

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '')
}

export async function getAvenirWorkshopEmailHtml(baseUrl: string): Promise<string> {
  const html = await readFile(AVENIR_EMAIL_PATH, 'utf8')
  const origin = normalizeBaseUrl(baseUrl)

  return html
    .replaceAll('src="../logo.png"', `src="${origin}/logo.png"`)
    .replaceAll('src="../avenir-workshop-hero.png"', `src="${origin}/avenir-workshop-hero.png"`)
    .replaceAll('src="../avenir-workshop-detail.png"', `src="${origin}/avenir-workshop-detail.png"`)
}
