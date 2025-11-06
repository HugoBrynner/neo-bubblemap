# Deployment Guide

This guide covers different deployment options for the Neo Bubblemap application.

## Docker Deployment (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

1. Clone the repository:
```bash
git clone https://github.com/HugoBrynner/neo-bubblemap.git
cd neo-bubblemap
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Build and start containers:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3001

5. View logs:
```bash
docker-compose logs -f
```

6. Stop containers:
```bash
docker-compose down
```

## Manual Deployment

### Backend Deployment

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Build:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

The backend will run on port 3001 (or your configured PORT).

### Frontend Deployment

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure API endpoint:
```bash
# Set VITE_API_URL in .env or environment variables
echo "VITE_API_URL=https://your-backend-api.com/api" > .env
```

3. Build:
```bash
npm run build
```

4. Deploy the `dist/` folder to your web server (Nginx, Apache, or static hosting service).

## Cloud Deployment Options

### AWS

#### Using ECS (Elastic Container Service)
1. Push Docker images to ECR
2. Create ECS task definitions
3. Deploy to ECS cluster
4. Configure Application Load Balancer

#### Using Elastic Beanstalk
1. Install EB CLI
2. Initialize application: `eb init`
3. Create environment: `eb create neo-bubblemap-env`
4. Deploy: `eb deploy`

### Google Cloud Platform

#### Using Cloud Run
1. Build Docker images
2. Push to Google Container Registry
3. Deploy to Cloud Run:
```bash
gcloud run deploy neo-bubblemap-backend --image gcr.io/PROJECT_ID/backend
gcloud run deploy neo-bubblemap-frontend --image gcr.io/PROJECT_ID/frontend
```

### Azure

#### Using Azure Container Instances
1. Build and push images to Azure Container Registry
2. Deploy containers:
```bash
az container create --resource-group neo-bubblemap \
  --name neo-bubblemap-backend \
  --image REGISTRY/backend:latest
```

### Heroku

1. Install Heroku CLI
2. Create apps:
```bash
heroku create neo-bubblemap-backend
heroku create neo-bubblemap-frontend
```

3. Configure buildpacks and deploy

### Vercel (Frontend only)

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel --cwd frontend`
3. Configure environment variables in Vercel dashboard

### DigitalOcean

#### Using App Platform
1. Connect your GitHub repository
2. Configure build settings
3. Deploy from the App Platform dashboard

#### Using Droplets
1. Create a droplet with Docker
2. Clone repository
3. Run `docker-compose up -d`

## Nginx Configuration

If you're serving the frontend with Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `NEO_RPC_URL` - Neo blockchain RPC endpoint
- `NEO_NETWORK` - Network type (mainnet/testnet)
- `CORS_ORIGIN` - Allowed CORS origin
- `CACHE_TIMEOUT` - Cache timeout in seconds

### Frontend
- `VITE_API_URL` - Backend API URL

## SSL/TLS Configuration

For production, always use HTTPS:

1. Obtain SSL certificates (Let's Encrypt, CloudFlare, etc.)
2. Configure your reverse proxy (Nginx, Caddy) with SSL
3. Update CORS settings to allow HTTPS origin

## Monitoring and Logging

### Application Logs
- Backend logs to stdout/stderr
- Use a log aggregation service (CloudWatch, Stackdriver, etc.)

### Health Checks
- Backend: `GET /api/health`
- Configure your load balancer to use this endpoint

### Metrics
- Monitor API response times
- Track error rates
- Monitor cache hit rates
- Monitor blockchain RPC latency

## Scaling

### Horizontal Scaling
- Backend is stateless and can be horizontally scaled
- Use a load balancer to distribute traffic
- Consider Redis for distributed caching

### Database
- Currently uses in-memory cache
- For production, consider Redis or Memcached

### CDN
- Use a CDN (CloudFlare, CloudFront) for frontend assets

## Backup and Recovery

1. Backup configuration files
2. Document environment variables
3. Keep Docker images versioned
4. Regular testing of deployment process

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong CORS policies
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Monitor security advisories
- [ ] Use security headers (CSP, HSTS, etc.)
- [ ] Regular security audits

## Troubleshooting

### Backend won't start
- Check environment variables
- Verify Neo RPC endpoint is accessible
- Check port availability

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS settings
- Verify backend is running

### Docker issues
- Clear Docker cache: `docker system prune`
- Rebuild images: `docker-compose build --no-cache`

## Support

For deployment issues, please open an issue on GitHub.
