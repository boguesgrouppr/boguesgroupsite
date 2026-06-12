export const runtime = 'edge'

export async function GET() {
  return Response.json({
    hasApiKey: !!process.env.MAILCHIMP_API_KEY,
    hasListId: !!process.env.MAILCHIMP_LIST_ID,
    hasPrefix: !!process.env.MAILCHIMP_SERVER_PREFIX,
    hasSlugTag: !!process.env.MAILCHIMP_DOWNLOAD_SLUG_MERGE_TAG,
  })
}