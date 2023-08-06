// https://vite-plugin-ssr.com/onRenderHtml
export default onRenderHtml

import { escapeInject } from 'vite-plugin-ssr/server'
import logoUrl from './favicon.ico'

async function onRenderHtml(pageContext) {
  const { stream } = pageContext

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">
        <link href="https://www.cheshireeast.gov.uk/siteelements/css/bs5/400-cec-styles.css" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&amp;family=Open+Sans+Condensed:wght@700&amp;display=swap" rel="stylesheet"
    />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Listing of the events organised by Cheshire East Ranger Service" />
        <title>Ranger Events</title>
      </head>
      <body>
        <div id="app">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true
    }
  }
}
