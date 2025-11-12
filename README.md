# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/05de3424-f462-450a-80ee-6cb3602d0cee

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/05de3424-f462-450a-80ee-6cb3602d0cee) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- i18next (for internationalization - English & Arabic)

## API Configuration

The website is configured to connect to a backend API running on `http://localhost:8080/api`.

### Setting up the API connection:

1. **Default Configuration**: The app defaults to `http://localhost:8080/api` - no configuration needed if your backend runs on this URL.

2. **Custom API URL**: If your backend runs on a different URL, create a `.env` file in the project root:
   ```
   VITE_API_BASE_URL=http://your-api-url:port/api
   ```

3. **Development**: When running in development mode, the API base URL will be logged to the console for verification.

### Backend Requirements:

- The backend API should be running on `http://localhost:8080`
- API endpoints should be prefixed with `/api`
- CORS should be enabled to allow requests from the frontend (running on port 8090 by default)

### Testing the Connection:

1. Start your backend server on `http://localhost:8080`
2. Start the frontend with `npm run dev`
3. Check the browser console for "API Base URL: http://localhost:8080/api"
4. Try logging in or browsing products to verify the connection

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/05de3424-f462-450a-80ee-6cb3602d0cee) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
