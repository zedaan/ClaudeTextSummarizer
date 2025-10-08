# Microservices Architecture Migration Plan

## Project Overview
Convert the monolithic text summarizer application into a microservices-based architecture with two AI-powered services:
1. **Text Summarizer Service** (existing)
2. **Image Describer Service** (new - from Scrim-s06imut codebase)

Both services will share a unified dashboard UI while maintaining independent backend microservices.

---

## Phase 1: Repository & Infrastructure Setup
### 1.1 Monorepo Structure
- [x] Create root-level monorepo structure
- [x] Set up pnpm workspace configuration
- [x] Create `/services` directory for backend microservices
- [x] Create `/apps` directory for frontend applications
- [x] Create `/packages` directory for shared libraries
- [ ] Set up Docker Compose orchestration for all services

### 1.2 Shared Packages
- [ ] Extract shared UI components to `/packages/ui`
  - [ ] Sidebar, Footer, Logo components
  - [ ] Form components (FormCard, ToggleSwitch, PasswordInput)
  - [ ] Common layouts and utilities
- [x] Create shared TypeScript types package `/packages/types`
- [ ] Create shared utilities package `/packages/utils`
- [ ] Create shared stores package `/packages/stores` (for user, usage data)

---

## Phase 2: Backend Microservices
### 2.1 Text Summarizer Service
- [x] Create `/services/text-summarizer` directory
- [x] Extract API endpoint to standalone Express/Fastify service
- [x] Set up independent package.json and dependencies
- [x] Configure service-specific environment variables
- [x] Implement health check endpoint
- [ ] Dockerize the service
- [ ] Add to docker-compose.yml (port 3001)

### 2.2 Image Describer Service
- [x] Create `/services/image-describer` directory
- [x] Port Scrim-s06imut logic to backend service
- [x] Implement Claude Vision API integration
- [x] Create `/api/describe` endpoint
  - [x] Accept base64 image data
  - [x] Process with Claude Vision API
  - [x] Return image description
- [x] Set up independent package.json and dependencies
- [x] Configure service-specific environment variables
- [x] Implement health check endpoint
- [ ] Dockerize the service
- [ ] Add to docker-compose.yml (port 3002)

### 2.3 API Gateway (Optional - Future Enhancement)
- [ ] Consider adding API Gateway for routing
- [ ] Rate limiting and authentication middleware
- [ ] Service discovery

---

## Phase 3: Frontend Unified Dashboard
### 3.1 Dashboard Integration
- [ ] Update main dashboard layout to accommodate both features
- [ ] Add Image Describer section below Text Summarizer
- [ ] Implement tabbed or side-by-side layout
- [ ] Share the same Sidebar navigation
- [ ] Maintain consistent styling and branding

### 3.2 Image Describer Frontend Component
- [ ] Create `/src/routes/describer` or integrate into main page
- [ ] Convert Scrim-s06imut HTML/CSS/JS to Svelte components
  - [ ] Image upload component with drag & drop
  - [ ] Description length slider
  - [ ] Describe button and controls
  - [ ] Loading states
  - [ ] Error handling
  - [ ] Copy/Clear functionality
- [ ] Integrate with `/services/image-describer` API
- [ ] Add to history/saved stores
- [ ] Update sidebar stats to include image descriptions

### 3.3 Shared Navigation & Features
- [ ] Update sidebar to show combined stats (summaries + descriptions)
- [ ] Extend History page to show both text summaries and image descriptions
- [ ] Extend Saved page to support both types
- [ ] Update Usage & Billing to track both services
- [ ] Add filter/tabs to separate text vs image items

---

## Phase 4: Data Layer
### 4.1 Unified Store Updates
- [ ] Extend `summaryStore` or create `activityStore` for both types
  - [ ] Support `type: 'text' | 'image'`
  - [ ] Store image thumbnails for descriptions
  - [ ] Unified timestamp and metadata
- [ ] Update `usageStore` to track both APIs separately
  - [ ] Text summarization tokens
  - [ ] Image description tokens
  - [ ] Combined cost calculations

### 4.2 localStorage Schema
- [ ] Design unified data schema
  ```typescript
  interface Activity {
    id: string
    type: 'text-summary' | 'image-description'
    timestamp: number
    isSaved: boolean
    // Text-specific
    originalText?: string
    summary?: string
    wordCount?: number
    summaryLength?: number
    // Image-specific
    imageUrl?: string
    imageThumbnail?: string
    description?: string
    descriptionLength?: number
    // Common
    tags?: string[]
    demoMode?: boolean
  }
  ```

---

## Phase 5: Docker & Orchestration
### 5.1 Docker Configuration
- [ ] Create Dockerfile for each service:
  - [ ] `/services/text-summarizer/Dockerfile`
  - [ ] `/services/image-describer/Dockerfile`
  - [ ] `/apps/frontend/Dockerfile` (SvelteKit app)
- [ ] Update root `docker-compose.yml`
  - [ ] Frontend service (port 3000)
  - [ ] Text Summarizer service (port 3001)
  - [ ] Image Describer service (port 3002)
  - [ ] Shared network configuration
  - [ ] Volume mounts for development
  - [ ] Health checks for all services

### 5.2 Environment Configuration
- [ ] Root `.env.example` with all service variables
- [x] Service-specific `.env` files
  - [x] `ANTHROPIC_API_KEY` (shared or separate)
  - [ ] `TEXT_SUMMARIZER_URL`
  - [ ] `IMAGE_DESCRIBER_URL`
  - [x] Service ports and configs

---

## Phase 6: Documentation
### 6.1 Architecture Documentation
- [ ] Create `/docs/architecture.md`
  - [ ] Microservices diagram
  - [ ] Service communication flow
  - [ ] Data flow diagrams
- [ ] Update main README.md
  - [ ] Monorepo structure explanation
  - [ ] Development setup instructions
  - [ ] Docker commands

### 6.2 API Documentation
- [ ] Document Text Summarizer API
  - [ ] Endpoints, request/response formats
  - [ ] Error codes
- [ ] Document Image Describer API
  - [ ] Endpoints, request/response formats
  - [ ] Image format requirements
  - [ ] Error codes

### 6.3 Developer Guide
- [ ] Update CODEBASE_GUIDE.md
  - [ ] Monorepo navigation
  - [ ] Adding new services
  - [ ] Shared package usage
- [ ] Create service-specific READMEs

---

## Phase 7: Testing & Quality Assurance
### 7.1 Service Testing
- [ ] Test text summarizer service independently
- [ ] Test image describer service independently
- [ ] Test frontend integration with both services
- [ ] Test error scenarios and edge cases

### 7.2 Performance Testing
- [ ] Test concurrent requests to both services
- [ ] Measure response times
- [ ] Test Docker container resource usage

### 7.3 User Acceptance Testing
- [ ] Test complete user workflows
- [ ] Verify localStorage persistence
- [ ] Test cross-browser compatibility
- [ ] Mobile responsiveness testing

---

## Phase 8: Deployment & CI/CD
### 8.1 Deployment Preparation
- [ ] Create production Docker builds
- [ ] Optimize image sizes
- [ ] Set up environment-specific configs

### 8.2 Git & Version Control
- [ ] Update .gitignore for monorepo
- [ ] Create git commit for microservices migration
- [ ] Tag release version
- [ ] Push to repository

---

## Phase 9: Migration & Rollout
### 9.1 Data Migration
- [ ] Migrate existing localStorage data
- [ ] Backward compatibility for old data format
- [ ] Migration script if needed

### 9.2 Rollout
- [ ] Deploy to development environment
- [ ] Staging environment testing
- [ ] Production deployment
- [ ] Monitor for issues

---

## Success Criteria
- ✅ Both services run independently as Docker containers
- ✅ Unified frontend accesses both services via API calls
- ✅ Shared UI components reduce code duplication
- ✅ Each service can be scaled independently
- ✅ All existing features (history, saved, settings) work with both types
- ✅ Documentation is complete and up-to-date
- ✅ No regression in existing text summarizer functionality
- ✅ Image describer has same UX quality as text summarizer

---

## Future Enhancements (Post-Migration)
- [ ] Add service-to-service communication for advanced features
- [ ] Implement API Gateway with Kong or similar
- [ ] Add message queue (RabbitMQ/Redis) for async processing
- [ ] Implement caching layer (Redis)
- [ ] Add monitoring and logging (Prometheus, Grafana, ELK stack)
- [ ] Implement authentication service
- [ ] Add more AI services (e.g., translation, sentiment analysis)

---

## Notes
- Maintain backward compatibility during migration
- Keep .env files out of version control
- Follow existing code style and conventions
- Test thoroughly at each phase before proceeding
- Update this document as tasks are completed (mark with [x])

---

**Last Updated:** October 7, 2025
**Status:** In Progress - Phase 2 Backend Microservices
**Next Steps:** Complete Phase 1.2 (Shared Packages), then continue Phase 2 Docker Configuration
