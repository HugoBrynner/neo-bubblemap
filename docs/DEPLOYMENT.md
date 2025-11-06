# Deployment Guide

This guide covers deploying the Neo BubbleMap application to various environments.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Access to Neo RPC endpoint (public or private)

## Docker Deployment (Recommended)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/HugoBrynner/neo-bubblemap.git
cd neo-bubblemap
```

2. Configure environment variables (optional):
```bash
# Edit docker-compose.yml to customize Neo RPC endpoints
# Default uses public Neo N3 mainnet endpoints
```

3. Build and start the containers:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:3001

5. View logs:
```bash
docker-compose logs -f
```

6. Stop the application:
```bash
docker-compose down
```

### Production Deployment

For production, consider:

1. **Use HTTPS**: Configure SSL/TLS certificates in Nginx
2. **Environment Variables**: Use Docker secrets or .env files for sensitive data
3. **Resource Limits**: Set memory and CPU limits in docker-compose.yml
4. **Monitoring**: Add health checks and monitoring tools
5. **Backup**: Regular backups of any cached data

Example production docker-compose.yml modifications:

```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
    restart: always

  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    restart: always
```

## Cloud Platform Deployment

### AWS (EC2)

1. Launch an EC2 instance (t3.medium recommended)
2. Install Docker and Docker Compose
3. Clone the repository
4. Configure security groups (ports 80, 443, 3001)
5. Run docker-compose up -d
6. Optional: Use AWS Application Load Balancer

### Google Cloud Platform (GCP)

1. Use Google Compute Engine or Cloud Run
2. For Cloud Run, build and push Docker images:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/neo-bubblemap-backend backend/
gcloud builds submit --tag gcr.io/PROJECT_ID/neo-bubblemap-frontend frontend/
```
3. Deploy services with appropriate environment variables

### Azure

1. Use Azure Container Instances or App Service
2. Create container registry
3. Push Docker images
4. Deploy with Azure CLI or Portal

### DigitalOcean

1. Create a Droplet (2GB RAM minimum)
2. Install Docker and Docker Compose
3. Clone and deploy with docker-compose
4. Optional: Use DigitalOcean App Platform for managed deployment

## Local Development Deployment

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend will be available at http://localhost:3001

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env to point to backend API
npm run dev
```

Frontend will be available at http://localhost:3000

## Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=production

# Neo Blockchain Configuration
NEO_RPC_URL=https://mainnet1.neo.coz.io:443
NEO_EXPLORER_API=https://api.neoscan.io/api/main_net/v1
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

For production, set VITE_API_URL to your backend domain.

## Nginx Configuration

If deploying without Docker, here's a sample Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/neo-bubblemap/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Maintenance

### Health Checks

- Backend health: `http://your-domain/api/health`
- Backend status: `http://your-domain/api/status`

### Logs

View Docker logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Cache Management

Clear API cache:
```bash
curl -X POST http://localhost:3001/api/cache/clear
```

### Updates

To update the application:

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

## Performance Optimization

1. **Caching**: API responses are cached for 5 minutes by default
2. **CDN**: Consider using a CDN for frontend static assets
3. **Database**: For high traffic, consider adding Redis for caching
4. **Load Balancing**: Use multiple backend instances with a load balancer
5. **Compression**: Gzip is enabled in Nginx configuration

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS properly in backend
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Firewall**: Configure firewall rules appropriately
5. **Updates**: Keep dependencies updated regularly

## Troubleshooting

### Backend not starting

- Check Neo RPC endpoint is accessible
- Verify environment variables are set correctly
- Check logs: `docker-compose logs backend`

### Frontend not loading

- Verify backend is running and accessible
- Check VITE_API_URL is set correctly
- Clear browser cache

### API errors

- Check Neo blockchain endpoints are accessible
- Verify contract addresses are correct
- Check API rate limits on Neo explorer

## Support

For issues and questions:
- GitHub Issues: https://github.com/HugoBrynner/neo-bubblemap/issues
- Documentation: See README.md for more details
