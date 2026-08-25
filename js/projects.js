/**
 * Projects Data & Modal Detail Manager
 * Reusable project architecture for case studies and interactive demonstrations.
 */
const PROJECTS_DATA = [
  {
    id: 'store-rag-assistant',
    index: '01',
    title: 'Store RAG Assistant',
    summary: 'An intelligent retrieval-augmented generation system designed for retail environments, enabling natural language querying of inventory and product data.',
    description: 'Store RAG Assistant is an enterprise-focused Retrieval-Augmented Generation (RAG) backend engineered to bridge unstructured store catalogs with instant conversational retrieval. It orchestrates vector search over inventory databases, enforces prompt boundaries for accurate product specifications, and delivers sub-second query responses through optimized embeddings and stateful graph agents.',
    architecture: [
      'Document chunking and metadata enrichment pipeline for store inventory.',
      'Vector indexing utilizing FAISS / Qdrant with semantic dense retrieval.',
      'LangGraph multi-step agent for disambiguating product variants and store stock.',
      'FastAPI REST endpoints for seamless frontend integration.'
    ],
    technologies: ['Python', 'FastAPI', 'LangGraph', 'FAISS', 'LangChain', 'Pydantic'],
    githubUrl: 'https://github.com/shazmalsaif',
    demoUrl: '#',
    hasInteractiveDemo: true,
    demoPrompt: 'Can you show me how the Store RAG Assistant handles multi-attribute inventory queries?'
  },
  {
    id: 'ecommerce-ai-assistant',
    index: '02',
    title: 'E-Commerce AI Assistant',
    summary: 'A smart shopping assistant integrated directly into the storefront, providing personalized recommendations and answering product-specific inquiries in real-time.',
    description: 'E-Commerce AI Assistant acts as an autonomous digital sales consultant on web storefronts. It leverages conversational intent classification to recommend cross-sell products, answer warranty/compatibility inquiries, and track customer browsing context to boost conversion rates.',
    architecture: [
      'Context-aware session memory managing visitor browsing history.',
      'LLM function calling to dynamically fetch live pricing and stock availability.',
      'Clean reactive frontend interface with accessible conversational stream.',
      'Strict guardrails ensuring on-topic brand guidance.'
    ],
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'OpenAI API', 'Supabase'],
    githubUrl: 'https://github.com/shazmalsaif',
    demoUrl: '#',
    hasInteractiveDemo: true,
    demoPrompt: 'How does the E-Commerce AI Assistant personalize product recommendations?'
  },
  {
    id: 'automation-systems',
    index: '03',
    title: 'Automation Systems',
    summary: 'Custom workflows connecting disparate business tools to streamline data entry, communication, and reporting processes with minimal human intervention.',
    description: 'Production automation backend workflows orchestrated via n8n and Python microservices. Designed to automate complex multi-app data synchronization, customer onboarding notifications, error reporting pipelines, and automated report generation between CRMs, email gateways, and relational databases.',
    architecture: [
      'Webhook-triggered n8n workflow engine with automated retry policies.',
      'Bidirectional sync between Airtable, PostgreSQL, and CRM APIs.',
      'Automated email parsing and ticket classification with LLM filters.',
      'Dockerized deployment with healthcheck telemetry.'
    ],
    technologies: ['n8n', 'Python', 'REST APIs', 'PostgreSQL', 'Docker', 'Airtable'],
    githubUrl: 'https://github.com/shazmalsaif',
    demoUrl: '#',
    hasInteractiveDemo: true,
    demoPrompt: 'Tell me about the workflow automation pipelines you build with n8n.'
  }
];

class ProjectsManager {
  constructor() {
    this.projects = PROJECTS_DATA;
    this.modalEl = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.modalEl = document.getElementById('project-modal');
      this.setupModalListeners();
      this.setupCaseStudyButtons();
    });
  }

  setupModalListeners() {
    if (!this.modalEl) return;

    const closeBtn = document.getElementById('close-project-modal');
    const backdrop = document.getElementById('project-modal-backdrop');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeModal());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }

  setupCaseStudyButtons() {
    document.querySelectorAll('[data-project-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project-id');
        this.openProjectModal(projectId);
      });
    });
  }

  openProjectModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project || !this.modalEl) return;

    // Populate modal data
    const titleEl = document.getElementById('modal-project-title');
    const indexEl = document.getElementById('modal-project-index');
    const descEl = document.getElementById('modal-project-desc');
    const archListEl = document.getElementById('modal-project-arch');
    const tagsEl = document.getElementById('modal-project-tags');
    const githubLink = document.getElementById('modal-github-link');
    const demoBtn = document.getElementById('modal-demo-btn');

    if (titleEl) titleEl.textContent = project.title;
    if (indexEl) indexEl.textContent = `Project ${project.index}`;
    if (descEl) descEl.textContent = project.description;

    if (archListEl) {
      archListEl.innerHTML = project.architecture
        .map(point => `<li class="flex items-start"><span class="material-symbols-outlined text-[18px] mr-2 text-primary dark:text-primary-fixed mt-0.5">check_circle</span><span>${point}</span></li>`)
        .join('');
    }

    if (tagsEl) {
      tagsEl.innerHTML = project.technologies
        .map(tech => `<span class="px-3 py-1 bg-surface-container-high dark:bg-surface-container rounded font-label-sm text-label-sm text-primary dark:text-text-on-dark">${tech}</span>`)
        .join('');
    }

    if (githubLink) {
      githubLink.href = project.githubUrl;
    }

    if (demoBtn) {
      demoBtn.onclick = () => {
        this.closeModal();
        if (window.chatManager) {
          window.chatManager.openChat();
          window.chatManager.sendMessage(project.demoPrompt);
        }
      };
    }

    // Show modal
    this.modalEl.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      this.modalEl.classList.add('active');
    }, 10);
  }

  closeModal() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    setTimeout(() => {
      this.modalEl.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }
}

window.projectsManager = new ProjectsManager();
