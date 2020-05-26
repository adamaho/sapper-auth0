# Sapper Auth0 Example

Simple example of using sapper with auth0 as the authentication service. 

## Development

1. `npx degit "adamaho/sapper-auth0" my-app`
2. `npm install`
3. Configure a `.env` file in the root of your project with the following:

```
  AUTH0_CLIENT_ID=your_client_id
  AUTH0_DOMAIN=your_auth0_domain
  AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

4. `npm run dev`

## Authentication Flow
1. Navigate to `/app` to be redirected to login prompt
2. Login/Signup
3. Redirect back to `/app`
4. To logout: navigate to `/auth/logout`