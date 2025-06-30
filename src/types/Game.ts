export interface Game {
  id: number
  name: string
  image?: {
    icon_url: string
    medium_url: string
    screen_url: string
  }
  description?: string
  [key: string]: any // optional catch-all
}