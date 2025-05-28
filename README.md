# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

To connect your application to a Sanity.io backend, you'll need to set up the following environment variables. Create or update your `.env` file (or preferably `.env.local` for local development, which is typically gitignored) in the root of your project with the following:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"
NEXT_PUBLIC_SANITY_DATASET="your_sanity_dataset"
SANITY_API_TOKEN="your_sanity_api_token_with_write_permissions"
```

-   `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID. You can find this in your Sanity project settings.
-   `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset name (e.g., "production", "development").
-   `SANITY_API_TOKEN`: (Optional, but required for write operations like submitting the product enquiry form) A Sanity API token with write permissions. Create this token from your Sanity project management console (manage.sanity.io). **Keep this token secure and ensure it's not exposed in client-side code.**

The application is configured to use these variables to fetch data from and, if the token is provided, send data to your Sanity project.
