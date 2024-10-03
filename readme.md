# Installation Steps

- Clone the repository:

```Bash
git clone https://github.com/saiyedimtiaj/Tech-Hub-Server
cd Owner avatar
Tech-Hub-Server
npm install
```

# Environment Variables

Create a .env file in the root directory with the following:

```Bash
PORT=port
DB_URL=your mongodb uri

JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES_IN=5d
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES_IN=1y
NODE_ENV=production

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY= stripe secret key
```

## start

```Bash
npm run start:dev
```
