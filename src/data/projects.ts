import { resumeFeedbackImages } from "../components/Projects/resumeFeedbackImages.generated";

const BASE_URL = "https://mbeuaportfolio-media.s3.us-east-2.amazonaws.com";
const GITHUB_LINK = "https://github.com/helenapedro";
const RESUME_FEEDBACK_MAIN_IMAGE =
  "/project-images/resume-feedback-platform/main.png";
const RESUME_FEEDBACK_HANDSHAKE_IMAGE =
  "/project-images/resume-feedback-platform/handshake_featured.png";
const RESUME_FEEDBACK_ARCHITECTURE_IMAGE =
  "/project-images/resume-feedback-platform/RFP_Architecture_Diagram.jpg";

export type DescriptionBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  highlightUrl?: string;
  summary: string;
  technologies: string[];
  url: string;
  images: string[];
  detailImages?: string[];
  descriptionBlocks: DescriptionBlock[];
  featured?: boolean;
  frontendUrl?: string;
  backendUrl?: string;
}

export const projects: Project[] = [
  {
    id: "resume-feedback-platform",
    featured: true,
    title: "Resume Feedback Platform",
    subtitle: "AI Resume Review with Version Tracking",
    highlight:
      "Featured in the Handshake AI Showcase through the OpenAI Developers x Handshake Codex Creator Challenge",
    highlightUrl:
      "https://app.joinhandshake.com/ai-showcase?project_id=3056375",
    summary:
      "Version-aware resume review platform backed by a Spring Boot API, asynchronous AI worker pipeline, polyglot persistence, and controlled sharing workflows.",
    technologies: [
      "Java",
      "Spring Boot",
      "Apache Kafka",
      "Debezium CDC",
      "Transactional Outbox",
      "MySQL",
      "MongoDB",
      "Redis",
      "REST APIs",
      "React",
      "TypeScript",
      "AI Orchestration",
      "AWS S3",
      "AWS Amplify",
      "Docker",
    ],
    url: "https://feedback.hmpedro.com/",
    images: [
      RESUME_FEEDBACK_HANDSHAKE_IMAGE,
      RESUME_FEEDBACK_MAIN_IMAGE,
    ].filter((image) => resumeFeedbackImages.includes(image)),
    detailImages: [RESUME_FEEDBACK_ARCHITECTURE_IMAGE].filter((image) =>
      resumeFeedbackImages.includes(image),
    ),
    descriptionBlocks: [
      {
        type: "heading",
        text: "Problem",
      },
      {
        type: "paragraph",
        text: "Most resume AI tools stop at a single file upload. This platform treats resume review as a backend workflow problem: every upload becomes a versioned domain event, every AI artifact is anchored to a specific resume version, and later versions can be compared against previous feedback to show whether the candidate actually improved.",
      },
      {
        type: "heading",
        text: "System boundary and backend ownership",
      },
      {
        type: "list",
        items: [
          "Designed the product around a Spring Boot resume-api module that owns authentication, resume/version metadata, file upload and preview endpoints, comments, share links, AI job creation, and public share access.",
          "Separated long-running AI work into a resume-worker module instead of letting HTTP requests call the LLM directly, keeping upload latency independent from provider response time, document parsing, and retry behavior.",
          "Used a common module for shared DTOs and error models so the API and worker can evolve around the same contracts without duplicating integration logic.",
        ],
      },
      {
        type: "heading",
        text: "Asynchronous AI pipeline",
      },
      {
        type: "list",
        items: [
          "On upload or regeneration, resume-api persists the resume/version metadata, creates an AI job with PENDING status, and publishes a Kafka event for background processing.",
          "resume-worker consumes the job event, loads the referenced resume version, extracts resume text, calls the LLM provider, validates and normalizes structured output, stores the AI document, and updates the relational job record.",
          "The job lifecycle is explicit: PENDING, PROCESSING, DONE, and FAILED states are exposed through REST so the UI, users, and operators can reason about delayed processing, unsupported documents, provider failures, and retry paths.",
        ],
      },
      {
        type: "heading",
        text: "Data model and persistence strategy",
      },
      {
        type: "list",
        items: [
          "Modeled resumes as stable parent records with ordered resume versions, allowing comments, downloads, previews, AI feedback, and progress analysis to target the exact document under review.",
          "Used MySQL for transactional state: users, resumes, resume versions, comments, share links, AI jobs, job attempts, status timestamps, and references to generated feedback.",
          "Used MongoDB for flexible AI payloads where schema evolution matters: recruiter-style summaries, strengths, improvements, progress scores, improved areas, unchanged issues, newly introduced issues, model metadata, and prompt versions.",
          "Stored source resume files in AWS S3 while keeping relational metadata and AI documents separate, avoiding large binary payloads in the database and preserving clean ownership boundaries.",
        ],
      },
      {
        type: "heading",
        text: "Controlled collaboration and public access",
      },
      {
        type: "list",
        items: [
          "Built share-link workflows with permissions, expiration, revocation, usage limits, preview/download endpoints, and version-specific comments so external reviewers can participate without full account access.",
          "Added Redis-backed rate limiting for public share endpoints, protecting tokenized access routes from abuse while keeping the authenticated resume API separate.",
          "Kept public collaboration scoped to tokens and permissions rather than exposing account-level resume access, reducing the blast radius of shared links.",
        ],
      },
      {
        type: "heading",
        text: "Frontend contract integration",
      },
      {
        type: "list",
        items: [
          "Built the React and TypeScript client around service modules, typed DTOs, feature hooks, and TanStack Query keys that mirror backend resources such as resumes, versions, AI jobs, feedback, progress, comments, and share links.",
          "Implemented polling against the latest AI job endpoint every few seconds while the job is PENDING or PROCESSING, then refetched feedback and progress only after the backend reports DONE.",
          "Handled backend failure modes explicitly in the UI, including unsupported documents, unreadable documents, 404 feedback/progress gaps, regeneration errors, and a two-minute polling timeout.",
        ],
      },
      {
        type: "heading",
        text: "Technical Complexity",
      },
      {
        type: "list",
        items: [
          "The system coordinates multiple consistency boundaries: HTTP upload completion, S3 object availability, relational job state, Kafka delivery, LLM execution, MongoDB AI document writes, and final MySQL references back to the generated feedback.",
          "Version-to-version progress requires the worker to reason across historical resume versions, compare the current AI output against a baseline, and persist both current-version feedback and delta analysis without overwriting older artifacts.",
          "The architecture balances transactional constraints and schema flexibility by keeping ownership, permissions, and job state relational while allowing AI response shapes to evolve in MongoDB as prompts and models change.",
          "Reliability work is surfaced as product behavior: users can continue after upload, see processing states, regenerate failed or stale analyses, and keep core resume management functional even when AI processing is delayed or unavailable.",
        ],
      },
      {
        type: "heading",
        text: "Backend tradeoffs",
      },
      {
        type: "list",
        items: [
          "Chose asynchronous Kafka-backed processing instead of synchronous LLM calls to isolate user-facing latency from document extraction, provider availability, and model response time.",
          "Used HTTP polling instead of WebSockets because AI jobs are short-lived, status transitions are coarse-grained, and polling keeps deployment and infrastructure requirements simpler.",
          "Split file storage, transactional metadata, and AI payloads across S3, MySQL, and MongoDB so each storage layer handles the workload it is best suited for instead of forcing all data into one database model.",
        ],
      },
      {
        type: "heading",
        text: "Result",
      },
      {
        type: "paragraph",
        text: "The final product demonstrates backend engineering beyond CRUD: event-driven processing, versioned domain modeling, controlled public access, job-state reliability, polyglot persistence, and AI output lifecycle management. Users can upload resume versions without waiting for AI processing, reviewers can comment through scoped share links, and every AI result remains traceable to the exact document version that produced it.",
      },
    ],
  },
  {
    id: "engineering-portfolio",
    title: "Engineering Project Showcase",
    subtitle: "Cloud Data Platform for Infrastructure Project Content",
    summary:
      "Infrastructure project showcase built as a scalable React-Firestore content platform with server-side query strategy, TTL caching, protected admin workflows, offline delivery, and secure S3 media ingestion.",
    technologies: [
      "React 18",
      "TypeScript",
      "Firebase Auth",
      "AWS S3",
      "CloudFront",
      "AWS Lambda",
      "Firebase",
      "Firestore",
      "PWA",
      "Three.js",
      "Leaflet",
      "Performance Optimization",
    ],
    url: "https://zepedro-portfolio.hmpedro.com/",
    images: [`${BASE_URL}/thisisengineering.jpg`],
    descriptionBlocks: [
      {
        type: "paragraph",
        text: "This project turns a civil engineering portfolio into a production-style content platform. Instead of loading static project pages, it models infrastructure work as queryable Firestore records, localized content, geospatial metadata, media references, optional 3D/BIM assets, and admin-managed project inventory.",
      },
      {
        type: "heading",
        text: "Backend data architecture",
      },
      {
        type: "list",
        items: [
          "Used Firestore as the managed backend for projects, categories, home/profile content, localized fields, map coordinates, public visibility flags, media references, and optional model asset metadata.",
          "Built server-side Firestore filtering with category constraints, document-id ordering, cursor-based pagination, page-size limits, and defensive handling for Firestore's 10-value IN filter limit.",
          "Used Firestore aggregate reads through getCountFromServer for total project and category counts, avoiding full collection reads when the UI only needs metadata.",
        ],
      },
      {
        type: "heading",
        text: "Cache and query efficiency",
      },
      {
        type: "list",
        items: [
          "Implemented a reusable cache store with in-memory reads first, localStorage persistence second, and a one-hour TTL so repeated navigation does not repeatedly bill or wait on Firestore.",
          "Cached cursor metadata per filter/page combination, letting later page navigation reuse known Firestore cursors instead of walking earlier pages from the beginning.",
          "Designed the cache to fail open: if browser storage is unavailable or JSON parsing fails, the app continues with memory-only behavior instead of breaking the user workflow.",
        ],
      },
      {
        type: "heading",
        text: "Protected Admin/CMS workflows",
      },
      {
        type: "list",
        items: [
          "Built a Firebase Auth protected admin dashboard for project inventory, create/update/delete workflows, localized metadata editing, visibility toggles, GPS coordinate entry, image references, and 3D model metadata.",
          "Added client-side admin allow-list support for operator ergonomics while documenting that production write protection belongs in Firestore Security Rules or an admins/{uid} model.",
          "Invalidated local cache entries after admin mutations so content management changes do not leave stale project data in the public experience.",
        ],
      },
      {
        type: "heading",
        text: "Secure media ingestion",
      },
      {
        type: "list",
        items: [
          "Implemented an AWS Lambda presign service that verifies Firebase ID tokens, checks an admins/{uid} Firestore document, validates file type and size, and returns short-lived S3 PUT upload URLs.",
          "Generated safe object keys from project IDs, timestamps, UUIDs, and sanitized file names, keeping high-resolution construction images organized under project-specific S3 paths.",
          "Separated metadata from heavy assets: Firestore stores public media references while S3 and CloudFront-ready URLs handle large images, videos, and future model assets.",
        ],
      },
      {
        type: "heading",
        text: "Global and field-ready delivery",
      },
      {
        type: "list",
        items: [
          "Implemented English and Portuguese routing with i18next, route translation helpers, Firestore localization adapters, and compatibility fallbacks for older flat string records.",
          "Added a custom service worker that precaches the application shell, map routes, manifest, offline fallback, fonts, and media assets, then serves cached navigation when the network is unavailable.",
          "Designed for field contexts where construction stakeholders may inspect project material on unreliable networks while still needing maps, images, and project details to remain usable.",
        ],
      },
      {
        type: "heading",
        text: "GIS and 3D/BIM capability",
      },
      {
        type: "list",
        items: [
          "Added a Leaflet/OpenStreetMap project map with numbered markers, localized project links, and fallback lists for projects that still need verified GPS coordinates.",
          "Built a Three.js GLTF/GLB model viewer with OrbitControls, lighting, responsive resizing, cleanup/disposal of WebGL resources, and preview fallback behavior for failed model loads.",
          "Extended the project content model with optional location and modelAsset fields so the same Firestore-backed platform can grow from a gallery into an infrastructure knowledge system.",
        ],
      },
      {
        type: "heading",
        text: "Technical Complexity",
      },
      {
        type: "list",
        items: [
          "The platform coordinates multiple backend-style concerns inside a managed-cloud architecture: Firestore query limits, count aggregation, cursor pagination, cache invalidation, auth-gated writes, S3 upload signing, CDN asset delivery, offline cache behavior, and localized schema evolution.",
          "The content model must support current flat Firestore strings and future localized maps without breaking existing project records, requiring adapter logic instead of one-off rendering assumptions.",
          "The media pipeline avoids exposing AWS credentials to the browser by moving trust decisions into Lambda, validating Firebase identity server-side, and issuing short-lived upload URLs only for approved admins.",
          "The project is built for scale in data volume and media complexity: paginated reads keep Firestore costs bounded, S3 handles large binary assets, and optional GIS/BIM metadata can be added without rewriting the core project schema.",
        ],
      },
      {
        type: "heading",
        text: "Backend tradeoffs",
      },
      {
        type: "list",
        items: [
          "Chose Firebase and Firestore for managed authentication, realtime-friendly metadata, and fast iteration instead of operating a custom CMS backend for a portfolio-scale system.",
          "Used client-side caching with TTL instead of a separate backend cache layer because the main cost driver is repeated visitor reads, not cross-user transactional coordination.",
          "Kept large project media outside Firestore so the database remains focused on queryable metadata while S3 and CDN infrastructure handle asset throughput.",
        ],
      },
      {
        type: "heading",
        text: "Result",
      },
      {
        type: "paragraph",
        text: "The result demonstrates backend engineering judgment in a full-stack product surface: managed identity, secured admin operations, query-efficient Firestore access, cache-aware data delivery, offline resilience, media pipeline separation, and extensible infrastructure-domain data modeling. It presents civil engineering work while proving the system can handle real-world content growth, multilingual audiences, field access, maps, and high-resolution technical assets.",
      },
    ],
    backendUrl: `${GITHUB_LINK}/zepedro-engineering-portfolio.git`,
  },
  {
    id: "fuel-station-explorer",
    title: "Angola Fuel Stations Explorer",
    summary:
      "Python data platform that turns fragmented Angolan fuel station data into a resilient, searchable map dashboard with API fallbacks, ETL support, and MySQL-ready ingestion.",
    url: "https://gaspump.hmpedro.com/",
    images: [`${BASE_URL}/gaspump.jpeg`],
    descriptionBlocks: [
      {
        type: "paragraph",
        text: "This project treats fuel station discovery as a data reliability problem, not just a map UI. It combines a timeout-bound public API client, cached station datasets, normalization helpers, interactive geospatial filtering, and supporting ETL scripts for converting scraped operator data into structured MySQL records.",
      },
      {
        type: "heading",
        text: "Backend data ingestion",
      },
      {
        type: "list",
        items: [
          "Built a Python fetch layer that consumes the public station API with a strict 5-second timeout, validates JSON parsing, converts responses into Pandas DataFrames, and returns safe empty results when no upstream data is available.",
          "Added a 5-minute in-memory cache that returns copies of cached DataFrames so downstream filtering cannot mutate shared cache state.",
          "When the upstream API fails after a successful fetch, the app continues serving the last cached dataset while surfacing the error to the UI instead of failing silently.",
        ],
      },
      {
        type: "heading",
        text: "ETL and MySQL preparation",
      },
      {
        type: "list",
        items: [
          "Developed a scraper for Pumangol station data that extracts a JavaScript stores object, sanitizes trailing commas and quote formats, parses coordinates, and writes normalized station records to JSON.",
          "Built a MySQL loader that reads scraped JSON, parses municipality/province values from location strings, creates missing municipalities, and upserts gas station records by station name, address, and operator.",
          "Wrapped database writes in an explicit transaction with commit/rollback behavior so partial imports do not leave the station dataset in an inconsistent state.",
        ],
      },
      {
        type: "heading",
        text: "Data normalization and filtering",
      },
      {
        type: "list",
        items: [
          "Centralized station cleanup by enforcing expected columns, trimming searchable text fields, building a lowercase search blob, and dropping invalid zero-coordinate records before map rendering.",
          "Implemented composable filters for free-text search, operator, province, municipality, and station selection, allowing the dashboard to narrow data without repeated backend round trips.",
          "Generated dependent dropdown options from the filtered dataset so province, municipality, and station choices stay consistent with the current search context.",
        ],
      },
      {
        type: "heading",
        text: "Operational dashboard",
      },
      {
        type: "list",
        items: [
          "Built a Dash and Plotly map-first interface with OpenStreetMap tiles, clickable station markers, selected-station highlighting, and a detail panel for brand, address, municipality, province, country, and coordinates.",
          "Added summary counters for stations, brands, and municipalities in the active result set, making the dashboard useful for logistics scanning as well as individual station lookup.",
          "Used a timed Dash interval to refresh data every three minutes while preserving a responsive UI through cached API results.",
        ],
      },
      {
        type: "heading",
        text: "Technical Complexity",
      },
      {
        type: "list",
        items: [
          "The system handles unreliable public data sources by combining timeout control, JSON validation, cache reuse, visible error propagation, empty-map fallbacks, and mutation-safe DataFrame copies.",
          "The ETL path converts semi-structured website JavaScript into structured station records, then maps those records into relational MySQL tables while avoiding duplicate station inserts.",
          "The app separates concerns across fetch, normalization, filtering, presentation, layout, scraping, and database loading modules so the dashboard can evolve without coupling UI callbacks to raw ingestion logic.",
          "Geospatial correctness is treated as a data-quality constraint: stations without usable coordinates are filtered before rendering, preventing misleading map markers and invalid center calculations.",
        ],
      },
      {
        type: "heading",
        text: "Backend tradeoffs",
      },
      {
        type: "list",
        items: [
          "Used an in-process cache instead of Redis because the deployment target is a lightweight Dash service and the main resilience need is short-term protection from repeated upstream API calls.",
          "Kept Pandas in the serving path because the dataset is small enough for fast in-memory filtering while still benefiting from reliable tabular normalization and aggregation.",
          "Maintained MySQL ingestion as a supporting pipeline so scraped operator data can be migrated into a relational source of truth when the public API is incomplete or unavailable.",
        ],
      },
      {
        type: "heading",
        text: "Result",
      },
      {
        type: "paragraph",
        text: "The final system demonstrates backend-oriented data engineering: resilient upstream integration, cache-aware serving, structured normalization, transaction-safe MySQL loading, and geospatial data quality controls. Users get a fast map dashboard, while the implementation shows how to turn fragile public station data into an operational interface.",
      },
    ],
    technologies: [
      "Python",
      "Dash",
      "Plotly",
      "Pandas",
      "Requests",
      "MySQL",
      "ETL",
      "Data Resilience",
      "Geospatial Data",
      "Gunicorn",
    ],
    backendUrl: `${GITHUB_LINK}/Angola-Fuel-Station-Explorer`,
  },
  {
    id: "predictive-analytics-platform",
    title: "Applied ML Launch Analytics Platform ",
    summary:
      "Python analytics platform that combines SpaceX API ingestion, web scraping, SQL-backed exploration, geospatial analysis, and supervised ML model comparison for launch-success prediction.",
    url: "https://predictive-analytics-for-rocket-launches.hmpedro.com/",
    images: [`${BASE_URL}/rocket_launch_img.jpg`],
    descriptionBlocks: [
      {
        type: "paragraph",
        text: "This project converts a notebook-style machine learning workflow into a deployed analytics application. It pulls SpaceX launch data from APIs and scraped web tables, normalizes CSV datasets, exposes exploratory dashboards, maps launch outcomes, and compares supervised models through cross-validation before presenting the results in Dash.",
      },
      {
        type: "heading",
        text: "Data ingestion pipeline",
      },
      {
        type: "list",
        items: [
          "Built generalized API fetch helpers for SpaceX v4 resources and static IBM course datasets, with logging, endpoint selection, HTTP error handling, and safe None/empty DataFrame fallbacks.",
          "Fetched and joined multiple operational domains: rockets, launchpads, payloads, cores, flight numbers, dates, booster names, payload masses, orbit categories, launch sites, and landing outcomes.",
          "Added a web scraping pipeline for historical Falcon 9/Falcon Heavy launches that parses Wikipedia tables with BeautifulSoup, extracts launch metadata, normalizes payload mass text, and converts semi-structured rows into Pandas DataFrames.",
        ],
      },
      {
        type: "heading",
        text: "Feature engineering and dataset preparation",
      },
      {
        type: "list",
        items: [
          "Filtered out multi-core and multi-payload records to keep the supervised learning dataset aligned with a single-core Falcon launch prediction problem.",
          "Converted nested API objects into tabular fields, normalized date columns, restricted historical records by cutoff date, and prepared clean CSV datasets for repeatable dashboard and model runs.",
          "Standardized numeric features with Scikit-learn preprocessing while converting date/object features into ordinal numeric representations so all selected models receive model-ready inputs.",
        ],
      },
      {
        type: "heading",
        text: "SQL and analytical backend",
      },
      {
        type: "list",
        items: [
          "Added MySQL utility functions for SQL-backed exploration, including distinct launch sites, launch counts by site, payload mass by customer, average payload by booster, mission outcome aggregation, and failed drone-ship landings.",
          "Parameterized user-provided query inputs such as launch site and customer to avoid string-built SQL while keeping the dashboard interactive.",
          "Separated DB connection logic behind environment-based configuration, allowing the app to run against external MySQL credentials without hard-coding secrets.",
        ],
      },
      {
        type: "heading",
        text: "Geospatial and exploratory analytics",
      },
      {
        type: "list",
        items: [
          "Built Plotly dashboards for payload-vs-flight, launch-site-vs-flight, payload-vs-site, orbit success rate, payload-vs-orbit, flight-vs-orbit, and yearly success trend analysis.",
          "Implemented a Folium launch-site map with date-range validation, success/failure filters, marker clustering, optional heatmap mode, launch-site labeling, and calculated success-rate statistics.",
          "Prepared dashboard controls for launch-site filtering and payload-mass ranges so users can inspect how site, payload, booster category, and mission outcome interact.",
        ],
      },
      {
        type: "heading",
        text: "ML model selection workflow",
      },
      {
        type: "list",
        items: [
          "Compared Logistic Regression, SVM, Decision Tree, and K-Nearest Neighbors using train/test splitting, 10-fold GridSearchCV, and explicit hyperparameter grids.",
          "Captured best parameters, cross-validation score, test score, accuracy score, confusion matrix, and fit time for each model instead of presenting a single opaque prediction result.",
          "Used parallel GridSearchCV jobs and cProfile/pstats profiling to surface training cost as an engineering concern, not only a model-quality concern.",
        ],
      },
      {
        type: "heading",
        text: "Technical Complexity",
      },
      {
        type: "list",
        items: [
          "The platform coordinates heterogeneous sources: live SpaceX APIs, static JSON datasets, scraped Wikipedia tables, local CSV artifacts, SQL-backed query results, and geospatial CSV data.",
          "Data quality work is central: nested API structures must be flattened, unsupported object types must be converted for Dash tables, invalid date values must be handled, and model inputs must be numeric and consistently shaped.",
          "The application bridges exploratory analytics and deployment by turning EDA, SQL queries, geospatial mapping, and model comparison into route-based Dash pages served through Gunicorn.",
          "Model evaluation is designed as a comparative system: hyperparameter search, cross-validation, holdout testing, confusion matrices, and fit-time profiling all feed the final model-selection story.",
        ],
      },
      {
        type: "heading",
        text: "Backend tradeoffs",
      },
      {
        type: "list",
        items: [
          "Used CSV artifacts as stable intermediate datasets so expensive scraping, API normalization, EDA, and model training do not need to run from scratch for every dashboard interaction.",
          "Kept model comparison in Python/Scikit-learn rather than a separate ML service because the project is batch-oriented and the value is transparent evaluation, not low-latency online inference.",
          "Combined Dash routes with Gunicorn deployment to keep the analytical product operationally simple while still exposing multiple workflows: EDA, web scraping, map analysis, SQL-backed summaries, and ML comparison.",
        ],
      },
      {
        type: "heading",
        text: "Result",
      },
      {
        type: "paragraph",
        text: "The final system demonstrates backend-oriented data science engineering: multi-source ingestion, reproducible dataset preparation, SQL query integration, geospatial analytics, model validation, and deployable analytical UX. It shows the ability to build the data pipeline and application layer around ML rather than treating the model as a standalone notebook artifact.",
      },
    ],
    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Machine Learning",
      "Scikit-learn",
      "Dash",
      "Plotly",
      "Folium",
      "BeautifulSoup",
      "MySQL",
      "Data Engineering",
      "MLOps",
      "Gunicorn",
    ],
    backendUrl: `${GITHUB_LINK}/rocket_launchs_predictive_analysis`,
  },
  {
    id: "helena-explora",
    title: "Helena Explora: Responsible AI Platform",
    summary:
      "AI-assisted educational platform designed to provide safe, bounded guidance for international students by translating complex product constraints into a resilient software architecture.",
    technologies: [
      "TypeScript",
      "React",
      "Express",
      "Supabase",
      "Cloud-Native",
      "Application Security",
      "Prompt Engineering",
      "Responsible AI",
    ],
    url: "https://helenaexplora.hmpedro.com/",
    images: [
      "https://raw.githubusercontent.com/helenaexplora/he-connect/main/src/assets/he-logo.jpg",
    ],
    descriptionBlocks: [
      {
        type: "list",
        items: [
          "Designed a scoped AI chatbot as a narrow assistant focused strictly on U.S. education topics, proactively reducing hallucination risk in sensitive areas such as immigration and legal guidance.",
          "Chose an API-oriented Express architecture instead of embedding AI logic in the frontend, creating a clear boundary for independent prompt and model evolution while centralizing backend safety and observability controls.",
          "Implemented explicit persistent sessions with UUIDs in localStorage and a stored conversationId, enabling full conversation restoration across sessions and page reloads.",
          "Integrated Supabase Edge Functions and Cloudflare Turnstile for secure lead-capture workflows, and refactored the chatbot into reusable TypeScript services and hooks to improve maintainability.",
        ],
      },
    ],
    backendUrl:
      "https://github.com/helenapedro/ai-chatbot-app/tree/main/packages/server",
  },
];
