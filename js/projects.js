/**
 * Projects Data & Modal Detail Manager
 * Reusable project architecture for case studies and interactive demonstrations.
 */
const PROJECTS_DATA = [
  {
    id: 'offline-rag-benchmark',
    index: '01',
    title: 'Offline RAG with Evaluation Benchmark',
    summary: 'An offline Retrieval-Augmented Generation (RAG) system with an automated evaluation pipeline for comparing different language models.',
    description: 'An offline Retrieval-Augmented Generation (RAG) system with an automated evaluation pipeline for comparing different language models. The project uses RAGAS to evaluate generated answers across Faithfulness, Answer Relevancy, Context Precision, and Context Recall, helping analyze answer quality and retrieval performance.',
    architecture: [
      'Offline RAG pipeline with dense vector indexing via FAISS and sentence embeddings.',
      'Local LLM inference and serving powered by Ollama (evaluating Llama 3.1:8B, Mistral 7B, and Qwen 2.5:7B).',
      'Automated RAGAS evaluation pipeline tracking Faithfulness, Answer Relevancy, Context Precision, and Context Recall.',
      'FastAPI REST endpoints for question answering, inference orchestration, and automated benchmarking.',
      'Empirical resource profiling capturing memory usage (~4,000 MB in Ollama) and per-query response latency (median, 95th percentile, and cold start).'
    ],
    technologies: ['Python', 'FastAPI', 'Ollama', 'FAISS', 'RAGAS', 'LangChain'],
    githubUrl: 'https://github.com/shazmalsaif/offline-rag-benchmark.git',
    demoUrl: 'https://github.com/shazmalsaif/offline-rag-benchmark.git',
    hasInteractiveDemo: true,
    demoPrompt: 'Explain the Offline RAG with Evaluation Benchmark and how the models performed under RAGAS evaluation.'
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

const BENCHMARK_SCREENSHOTS = [
  {
    id: 'metrics',
    tabLabel: 'Evaluation Metrics',
    title: 'RAGAS Evaluation: Faithfulness, Answer Relevancy & Refusals',
    src: 'assets/images/rag-benchmark-metrics.png',
    alt: 'RAGAS benchmark table and charts comparing Llama 3.1:8B, Mistral 7B, and Qwen 2.5:7B across Faithfulness and Answer Relevancy',
    caption: 'RAGAS Evaluation across 41 test questions. Compares Faithfulness (Llama: 0.88, Mistral: 0.79, Qwen: 0.80), Answer Relevancy (0.63–0.70 raw, 0.72–0.75 excluding refusals), and Refusals (Llama: 5, Mistral: 3, Qwen: 5). Differences between rows mix model generation quality with judge strictness.'
  },
  {
    id: 'latency',
    tabLabel: 'Latency & Memory',
    title: 'Latency & Memory Footprint Profile',
    src: 'assets/images/rag-benchmark-latency.png',
    alt: 'Response time per question with 95th percentile whisker chart and Ollama RAM footprint table',
    caption: 'Performance profiling across 41 questions. Compares median response times (Qwen: 5.1s, Mistral: 6.2s, Llama: 6.4s), 95th percentile latency (Qwen: 7.0s vs Llama: 11.4s), first-query cold start (14.5s to 38.8s), and Ollama model RAM memory (~4,000 MB each).'
  },
  {
    id: 'precision-recall',
    tabLabel: 'Precision & Recall',
    title: 'Retriever Assessment: Context Precision & Context Recall',
    src: 'assets/images/rag-benchmark-precision-recall.png',
    alt: 'Context precision and context recall bar chart across judge models with identical FAISS retriever',
    caption: 'Retriever evaluation under identical FAISS dense retrieval conditions. Demonstrates how scores vary by LLM judge (Context Precision: 0.90 to 0.98; Context Recall: 0.92 to 0.94), providing empirical evidence of judge model strictness and variance.'
  }
];

class ProjectsManager {
  constructor() {
    this.projects = PROJECTS_DATA;
    this.benchmarkData = BENCHMARK_SCREENSHOTS;
    this.currentBenchmarkIndex = 0;
    this.modalEl = null;
    this.benchmarkModalEl = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.modalEl = document.getElementById('project-modal');
      this.benchmarkModalEl = document.getElementById('benchmark-modal');
      this.setupModalListeners();
      this.setupCaseStudyButtons();
      this.setupBenchmarkCardViewer();
      this.setupBenchmarkModalListeners();
    });
  }

  /* ---------------- Project Architecture Modal ---------------- */

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
        .map(tech => `<span class="px-3 py-1 bg-surface-container-high dark:bg-neutral-800 border border-border-muted dark:border-neutral-700 rounded font-label-sm text-label-sm text-primary dark:text-gray-200 font-medium">${tech}</span>`)
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

  /* ---------------- In-Card Benchmark Preview ---------------- */

  setupBenchmarkCardViewer() {
    const tabs = document.querySelectorAll('.benchmark-tab-btn');
    const activeImg = document.getElementById('benchmark-active-img');
    const activeCaption = document.getElementById('benchmark-active-caption');
    const cardWrapper = document.getElementById('benchmark-card-image-wrapper');
    const expandBtn = document.getElementById('trigger-benchmark-modal-btn');
    const viewBtn = document.getElementById('btn-view-benchmarks');

    if (tabs.length > 0) {
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const idx = parseInt(tab.getAttribute('data-index'), 10) || 0;
          this.setCardBenchmarkIndex(idx);
        });
      });
    }

    if (cardWrapper) {
      cardWrapper.addEventListener('click', () => {
        this.openBenchmarkModal(this.currentBenchmarkIndex);
      });
    }

    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBenchmarkModal(this.currentBenchmarkIndex);
      });
    }

    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBenchmarkModal(this.currentBenchmarkIndex);
      });
    }
  }

  setCardBenchmarkIndex(idx) {
    if (idx < 0 || idx >= this.benchmarkData.length) return;
    this.currentBenchmarkIndex = idx;
    const item = this.benchmarkData[idx];

    const activeImg = document.getElementById('benchmark-active-img');
    const activeCaption = document.getElementById('benchmark-active-caption');
    const tabs = document.querySelectorAll('.benchmark-tab-btn');

    if (activeImg) {
      activeImg.style.opacity = '0.4';
      setTimeout(() => {
        activeImg.src = item.src;
        activeImg.alt = item.alt;
        activeImg.style.opacity = '1';
      }, 120);
    }

    if (activeCaption) {
      activeCaption.textContent = item.caption;
    }

    tabs.forEach((tab, i) => {
      if (i === idx) {
        tab.className = 'benchmark-tab-btn active px-2.5 py-1 rounded text-[11px] font-medium transition-colors bg-white text-black dark:bg-white dark:text-black';
      } else {
        tab.className = 'benchmark-tab-btn px-2.5 py-1 rounded text-[11px] font-medium transition-colors text-gray-400 hover:text-white';
      }
    });
  }

  /* ---------------- Dedicated Benchmark Results Modal ---------------- */

  setupBenchmarkModalListeners() {
    if (!this.benchmarkModalEl) return;

    const closeBtn = document.getElementById('close-benchmark-modal');
    const backdrop = document.getElementById('benchmark-modal-backdrop');
    const prevBtn = document.getElementById('benchmark-prev-btn');
    const nextBtn = document.getElementById('benchmark-next-btn');
    const modalTabs = document.querySelectorAll('.benchmark-modal-tab-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeBenchmarkModal());
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeBenchmarkModal());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIdx = (this.currentBenchmarkIndex - 1 + this.benchmarkData.length) % this.benchmarkData.length;
        this.updateBenchmarkModalContent(newIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIdx = (this.currentBenchmarkIndex + 1) % this.benchmarkData.length;
        this.updateBenchmarkModalContent(newIdx);
      });
    }

    modalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-index'), 10) || 0;
        this.updateBenchmarkModalContent(idx);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (this.benchmarkModalEl && !this.benchmarkModalEl.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          this.closeBenchmarkModal();
        } else if (e.key === 'ArrowLeft') {
          const newIdx = (this.currentBenchmarkIndex - 1 + this.benchmarkData.length) % this.benchmarkData.length;
          this.updateBenchmarkModalContent(newIdx);
        } else if (e.key === 'ArrowRight') {
          const newIdx = (this.currentBenchmarkIndex + 1) % this.benchmarkData.length;
          this.updateBenchmarkModalContent(newIdx);
        }
      }
    });
  }

  openBenchmarkModal(index = 0) {
    if (!this.benchmarkModalEl) return;
    this.updateBenchmarkModalContent(index);

    this.benchmarkModalEl.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      this.benchmarkModalEl.classList.add('active');
    }, 10);
  }

  closeBenchmarkModal() {
    if (!this.benchmarkModalEl) return;
    this.benchmarkModalEl.classList.remove('active');
    setTimeout(() => {
      this.benchmarkModalEl.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 250);
  }

  updateBenchmarkModalContent(idx) {
    if (idx < 0 || idx >= this.benchmarkData.length) return;
    this.currentBenchmarkIndex = idx;
    const item = this.benchmarkData[idx];

    const titleEl = document.getElementById('benchmark-modal-title');
    const imgEl = document.getElementById('benchmark-modal-img');
    const captionEl = document.getElementById('benchmark-modal-caption');
    const counterEl = document.getElementById('benchmark-counter');
    const modalTabs = document.querySelectorAll('.benchmark-modal-tab-btn');

    if (titleEl) titleEl.textContent = item.title;
    if (captionEl) captionEl.textContent = item.caption;
    if (counterEl) counterEl.textContent = `${idx + 1} / ${this.benchmarkData.length}`;

    if (imgEl) {
      imgEl.style.opacity = '0.3';
      setTimeout(() => {
        imgEl.src = item.src;
        imgEl.alt = item.alt;
        imgEl.style.opacity = '1';
      }, 100);
    }

    modalTabs.forEach((tab, i) => {
      if (i === idx) {
        tab.className = 'benchmark-modal-tab-btn active px-3 py-1.5 rounded font-label-sm text-xs font-semibold uppercase tracking-wider bg-primary text-white dark:bg-white dark:text-black transition-all';
      } else {
        tab.className = 'benchmark-modal-tab-btn px-3 py-1.5 rounded font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-neutral-800 transition-all';
      }
    });

    // Also sync the card index
    this.setCardBenchmarkIndex(idx);
  }
}

window.projectsManager = new ProjectsManager();
