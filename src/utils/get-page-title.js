import defaultSettings from '@/settings'

const title = defaultSettings.title || 'AI艺术图像生成'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
