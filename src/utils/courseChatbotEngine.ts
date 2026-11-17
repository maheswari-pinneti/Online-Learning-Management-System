import { Course } from '@/types';

export interface CourseQuizQuestion {
  question: string;
  category: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface CourseTutorPersona {
  tutorName: string;
  roleTitle: string;
  categoryTag: string;
  avatarBadge: string;
  welcomeMessage: string;
  recapText: string;
  interviewQuestion: CourseQuizQuestion;
  quizQuestion: CourseQuizQuestion;
  suggestedPrompts: string[];
  generateReply: (userText: string, course: Course, studentName: string) => string;
}

/**
 * Returns a complete course-specific AI tutor persona and knowledge base
 * based on whichever course the student is currently studying or has enrolled in.
 */
export function getCourseTutorPersona(course?: Course): CourseTutorPersona {
  const cat = (course?.category || '').toLowerCase();
  const title = (course?.title || '').toLowerCase();
  const cleanTitle = course?.title ? course.title.split(',')[0].split(':')[0].trim() : 'Active Curriculum';

  // 1. Cybersecurity & CyberGenius
  if (cat.includes('cyber') || cat.includes('security') || title.includes('breach') || title.includes('cybergenius')) {
    return {
      tutorName: 'Cyber Cat',
      roleTitle: 'CyberGenius Security Fellow',
      categoryTag: 'Cloud Threat Intelligence & Defense',
      avatarBadge: '🛡️ Cyber Sentinel',
      welcomeMessage:
        "Meow! Ready to hunt threats and secure the cloud? I'm your AI fellow, Cyber Cat. Ask me anything about AWS IAM breach forensics, Wireshark packet analysis, or zero-trust architecture!",
      recapText:
        `In '${cleanTitle}', you investigated real-world attack vectors, AWS IAM credential leaks, and automated containment lambdas. Next milestone: execute hands-on threat hunting on VPC flow logs!`,
      interviewQuestion: {
        question:
          'When an attacker compromises an EC2 instance metadata service (IMDSv1), which mechanism best mitigates credential theft?',
        category: 'Cloud Threat Defense',
        options: [
          { label: 'A', text: 'Enforce IMDSv2 requiring session-oriented PUT requests with hop limits', isCorrect: true },
          { label: 'B', text: 'Disable IAM roles on EC2 entirely and hardcode credentials', isCorrect: false },
          { label: 'C', text: 'Increase security group open ingress ports to scan for attackers', isCorrect: false },
          { label: 'D', text: 'Allow public unauthenticated access to storage buckets', isCorrect: false },
        ],
        explanation:
          'IMDSv2 enforces session-oriented tokens acquired via PUT requests, preventing SSRF attacks from stealing IAM instance profile credentials.',
      },
      quizQuestion: {
        question:
          'In network intrusion forensics, what is the strongest indicator of DNS tunneling command-and-control (C2)?',
        category: 'Network Packet Forensics',
        options: [
          { label: 'A', text: 'Occasional standard A record lookups for search engines', isCorrect: false },
          { label: 'B', text: 'Abnormally high frequency of base64-encoded subdomains queried to an authoritative nameserver', isCorrect: true },
          { label: 'C', text: 'Standard ICMP echo ping replies with zero packet loss', isCorrect: false },
          { label: 'D', text: 'HTTP 404 response on an unmapped resource', isCorrect: false },
        ],
        explanation:
          'Attackers tunnel data over DNS by querying long encoded subdomains (e.g. base64 payloads) to an attacker-controlled authoritative nameserver.',
      },
      suggestedPrompts: [
        'How do I detect IAM privilege escalation?',
        'Explain IMDSv2 vs IMDSv1 with examples',
        'Review Wireshark packet capture techniques',
      ],
      generateReply: (userText, _crs, studentName) => {
        const q = userText.toLowerCase();
        if (q.includes('privilege') || q.includes('iam') || q.includes('role')) {
          return `Paws up, ${studentName}! In AWS IAM defense, always audit 'iam:PassRole' and 'sts:AssumeRole' permissions. An attacker with PassRole on an EC2 instance can launch workloads with admin IAM policies attached!`;
        }
        if (q.includes('wireshark') || q.includes('packet') || q.includes('network') || q.includes('dns')) {
          return `Great network question! When inspecting PCAPs with Wireshark, filter for 'dns.qry.name.len > 50' to uncover suspicious DNS tunneling, and check TCP syn floods for port scan attempts.`;
        }
        if (q.includes('breach') || q.includes('cloud') || q.includes('incident')) {
          return `In incident response, step 1 is containment: isolate the compromised EC2/Container instance immediately by applying an empty quarantine security group while preserving memory state for forensic acquisition.`;
        }
        if (q.includes('quiz') || q.includes('practice') || q.includes('interview')) {
          return `Let's test your skills! What HTTP status code does an unauthorized AWS S3 request return? (Answer: 403 Forbidden). Try the 'Interview Practice' button above for interactive challenges!`;
        }
        return `Cat claws ready, ${studentName}! In cloud breach forensics for '${cleanTitle}', always correlate CloudTrail events with VPC Flow Logs. What technical topic shall we dissect next?`;
      },
    };
  }

  // 2. React / Frontend
  if (cat.includes('frontend') || cat.includes('development') || title.includes('react')) {
    return {
      tutorName: 'React Architect AI',
      roleTitle: 'Modern Frontend & React Fellow',
      categoryTag: 'React 18, Hooks & UI Engineering',
      avatarBadge: '⚛️ React Mentor',
      welcomeMessage:
        "Hello! I'm your React & Frontend Architecture AI Tutor. Ask me anything about React 18 concurrency, custom hooks, state management, or production SPA architecture!",
      recapText:
        `In '${cleanTitle}', you mastered component decomposition, custom hooks, and React Context architecture. Next milestone: implement optimistic UI updates with automated error rollback!`,
      interviewQuestion: {
        question:
          'Which React hook should be prioritized to defer re-rendering a slow non-urgent component without blocking immediate user typing?',
        category: 'React Concurrency',
        options: [
          { label: 'A', text: 'useLayoutEffect', isCorrect: false },
          { label: 'B', text: 'useDeferredValue', isCorrect: true },
          { label: 'C', text: 'useImperativeHandle', isCorrect: false },
          { label: 'D', text: 'useRef', isCorrect: false },
        ],
        explanation:
          'useDeferredValue lets you defer updating a part of the UI to keep high-priority user interactions (like text typing in search bars) ultra-responsive.',
      },
      quizQuestion: {
        question:
          'Why should React Context providers be granular rather than one single monolithic state object?',
        category: 'State Orchestration',
        options: [
          { label: 'A', text: 'Because React throws an exception if a context object exceeds 3 keys', isCorrect: false },
          { label: 'B', text: 'To prevent all consuming components from re-rendering whenever an unrelated state property changes', isCorrect: true },
          { label: 'C', text: 'Because Tailwind CSS requires separate contexts to compile', isCorrect: false },
          { label: 'D', text: 'To force re-mounting the entire DOM on every state update', isCorrect: false },
        ],
        explanation:
          'Every component subscribed to a React context re-renders whenever the context value changes; splitting contexts localizes re-renders strictly to affected consumers.',
      },
      suggestedPrompts: [
        'When should I use useMemo vs useCallback?',
        'How does React 18 reconciliation work?',
        'Best practices for Context API without lag',
      ],
      generateReply: (userText, _crs, studentName) => {
        const q = userText.toLowerCase();
        if (q.includes('hook') || q.includes('usememo') || q.includes('usecallback')) {
          return `Great React question, ${studentName}! Remember: 'useMemo' caches the *result* of a costly computation, while 'useCallback' caches the *function instance* itself to avoid breaking child component reference equality.`;
        }
        if (q.includes('effect') || q.includes('useeffect') || q.includes('cleanup')) {
          return `In modern React, every useEffect that sets up a subscription, interval, or WebSocket MUST return a cleanup function to prevent memory leaks and zombie event handlers!`;
        }
        if (q.includes('state') || q.includes('context') || q.includes('reducer')) {
          return `For state architecture in '${cleanTitle}', split state logically into UI-local state (useState), complex multi-action transactions (useReducer), and cross-cutting global state (granular Contexts).`;
        }
        return `Awesome! For '${cleanTitle}', focus on component purity, immutable state updates, and accessible keyboard navigation. What component or hook challenge are we solving?`;
      },
    };
  }

  // 3. Java / Backend
  if (cat.includes('backend') || title.includes('java') || title.includes('spring')) {
    return {
      tutorName: 'Spring & Java Fellow',
      roleTitle: 'Enterprise Java Systems Tutor',
      categoryTag: 'Spring Boot 3, REST & Microservices',
      avatarBadge: '☕ Java Specialist',
      welcomeMessage:
        "Welcome! I'm your Java Backend & Spring Boot AI Fellow. Ask me about designing REST controllers, Spring Data JPA repositories, Hibernate entity mapping, or Spring Security filter chains!",
      recapText:
        `In '${cleanTitle}', you built robust REST microservices and secured endpoints with JWT authentication. Next milestone: configure connection pooling and database indexing for high throughput!`,
      interviewQuestion: {
        question:
          'In Spring Boot 3, which annotation binds an incoming HTTP POST request JSON body directly to a validated Java DTO?',
        category: 'Spring MVC & Validation',
        options: [
          { label: 'A', text: '@RequestParam', isCorrect: false },
          { label: 'B', text: '@RequestBody with @Valid', isCorrect: true },
          { label: 'C', text: '@PathVariable', isCorrect: false },
          { label: 'D', text: '@ModelAttribute', isCorrect: false },
        ],
        explanation:
          '@RequestBody deserializes the JSON body via Jackson into the DTO, and @Valid triggers Jakarta Bean Validation annotations like @NotNull and @Email.',
      },
      quizQuestion: {
        question:
          'How does Spring Boot prevent the classic N+1 query problem when fetching parent entities with related child collections in JPA?',
        category: 'Spring Data JPA & Hibernate',
        options: [
          { label: 'A', text: 'By disabling lazy loading completely on all models', isCorrect: false },
          { label: 'B', text: 'By utilizing JOIN FETCH in JPQL queries or using @EntityGraph', isCorrect: true },
          { label: 'C', text: 'By using raw SQL with string concatenation', isCorrect: false },
          { label: 'D', text: 'By deleting child foreign key relationships', isCorrect: false },
        ],
        explanation:
          'JOIN FETCH forces Hibernate to fetch both the parent and related children in a single SQL query instead of firing N individual queries for each child row.',
      },
      suggestedPrompts: [
        'How do I configure Spring Security 6 with JWT?',
        'Explain JOIN FETCH vs @EntityGraph in JPA',
        'How do Java 21 Virtual Threads improve I/O?',
      ],
      generateReply: (userText, _crs, studentName) => {
        const q = userText.toLowerCase();
        if (q.includes('security') || q.includes('jwt') || q.includes('token') || q.includes('auth')) {
          return `In Spring Security 6, configure a 'SecurityFilterChain' bean, disable session creation ('SessionCreationPolicy.STATELESS'), and register an 'OncePerRequestFilter' to parse and validate JWT bearer tokens.`;
        }
        if (q.includes('jpa') || q.includes('hibernate') || q.includes('database') || q.includes('query')) {
          return `When designing entities for '${cleanTitle}', always use '@ManyToOne(fetch = FetchType.LAZY)' to avoid eager cascading loads, and declare JPQL with 'JOIN FETCH' to solve N+1 bottlenecks.`;
        }
        return `Hello ${studentName}! Java 21 and Spring Boot 3 give you massive throughput via Virtual Threads and GraalVM native images. What backend endpoint or architecture are we building today?`;
      },
    };
  }

  // 4. Data Science & AI
  if (cat.includes('data') || cat.includes('ai') || cat.includes('machine') || title.includes('learning')) {
    return {
      tutorName: 'Neural Net & ML Fellow',
      roleTitle: 'Machine Learning & PyTorch Tutor',
      categoryTag: 'PyTorch, Deep Learning & Transformers',
      avatarBadge: '🧠 ML Specialist',
      welcomeMessage:
        "Welcome! I'm your PyTorch & Deep Learning AI Fellow. Ask me about tensor dimension manipulation, backpropagation calculus, CNN convolutions, or Transformer attention mechanisms!",
      recapText:
        `In '${cleanTitle}', you implemented gradient descent from scratch and trained convolutional image classifiers. Next milestone: fine-tune a Transformer model using cross-entropy loss!`,
      interviewQuestion: {
        question:
          'In PyTorch, why is it mandatory to call optimizer.zero_grad() prior to executing loss.backward() in a training loop?',
        category: 'PyTorch Autograd',
        options: [
          { label: 'A', text: 'To reset the learning rate to zero', isCorrect: false },
          { label: 'B', text: 'Because PyTorch accumulates gradients by default on tensor backward calls', isCorrect: true },
          { label: 'C', text: 'To delete all GPU tensors from memory', isCorrect: false },
          { label: 'D', text: 'To force stochastic dropout activation', isCorrect: false },
        ],
        explanation:
          'PyTorch accumulates gradients on .backward() rather than overwriting them, which facilitates mini-batch accumulation; zero_grad() flushes previous batch gradients.',
      },
      quizQuestion: {
        question:
          'In the Transformer architecture, what is the role of scaling by sqrt(d_k) in Scaled Dot-Product Attention?',
        category: 'Transformer Attention',
        options: [
          { label: 'A', text: 'To increase the model parameter count', isCorrect: false },
          { label: 'B', text: 'To prevent large dot products from pushing softmax into regions with tiny gradients', isCorrect: true },
          { label: 'C', text: 'To convert floating points into 8-bit integers', isCorrect: false },
          { label: 'D', text: 'To invert the positional encoding sequence', isCorrect: false },
        ],
        explanation:
          'For large projection dimensions d_k, dot products grow large in magnitude, driving the softmax function into regions with extremely small gradients; dividing by sqrt(d_k) stabilizes training.',
      },
      suggestedPrompts: [
        'How does Scaled Dot-Product Attention work?',
        'How to prevent overfitting in PyTorch models?',
        'Explain learning rate scheduling with CosineAnnealing',
      ],
      generateReply: (userText, _crs, studentName) => {
        const q = userText.toLowerCase();
        if (q.includes('gradient') || q.includes('backward') || q.includes('autograd')) {
          return `In autograd, ${studentName}, each Tensor records an execution graph. Calling 'loss.backward()' populates the '.grad' attribute for all parameters with 'requires_grad=True'.`;
        }
        if (q.includes('attention') || q.includes('transformer') || q.includes('llm')) {
          return `Attention computes: Softmax((Q * K^T) / sqrt(d_k)) * V. Query matches Key to generate relevance weights, which then compute a weighted average of Values!`;
        }
        return `Great AI focus! For '${cleanTitle}', always verify tensor batch dimensions ('batch_size, seq_len, embed_dim') before tensor operations to avoid dimension mismatch bugs. What model are we working on?`;
      },
    };
  }

  // 5. Design & UI/UX
  if (cat.includes('design') || title.includes('ui') || title.includes('ux')) {
    return {
      tutorName: 'Design Systems Mentor',
      roleTitle: 'UI/UX & Product Design Fellow',
      categoryTag: 'Design Tokens, Figma & Accessibility',
      avatarBadge: '🎨 Design Architect',
      welcomeMessage:
        "Hi! I'm your Design Systems & UI Engineering Mentor. Ask me about Figma auto-layout, design tokens, WCAG 2.2 accessibility, responsive scales, or dark mode palettes!",
      recapText:
        `In '${cleanTitle}', you established accessible color primitives, typographic scales, and Figma component libraries. Next milestone: build keyboard focus management for modal drawers!`,
      interviewQuestion: {
        question:
          'Under WCAG 2.2 Level AA standards, what is the minimum required contrast ratio for standard body text against its background?',
        category: 'WCAG Accessibility',
        options: [
          { label: 'A', text: '2:1', isCorrect: false },
          { label: 'B', text: '4.5:1', isCorrect: true },
          { label: 'C', text: '7:1', isCorrect: false },
          { label: 'D', text: '10:1', isCorrect: false },
        ],
        explanation:
          'WCAG 2.2 Level AA requires a contrast ratio of at least 4.5:1 for normal text (under 18pt or 14pt bold), and 3:1 for large text.',
      },
      quizQuestion: {
        question:
          'What is the key benefit of semantic design tokens over hardcoded hex values in large multi-brand design systems?',
        category: 'Design Tokens & Theming',
        options: [
          { label: 'A', text: 'Tokens make CSS bundle files twice as large', isCorrect: false },
          { label: 'B', text: 'Tokens decouple design intent from raw values, allowing seamless light/dark mode and multi-brand themes', isCorrect: true },
          { label: 'C', text: 'Tokens eliminate the need for HTML markup', isCorrect: false },
          { label: 'D', text: 'Tokens prevent fonts from downloading', isCorrect: false },
        ],
        explanation:
          'Semantic tokens (e.g. --color-surface-primary instead of #ffffff) let you switch palettes and dark mode with zero component modifications.',
      },
      suggestedPrompts: [
        'How do I calculate WCAG 2.2 color contrast?',
        'Best practices for Figma Auto-Layout nesting',
        'How to design accessible keyboard focus states',
      ],
      generateReply: (userText, _crs, studentName) => {
        const q = userText.toLowerCase();
        if (q.includes('contrast') || q.includes('wcag') || q.includes('accessibility') || q.includes('a11y')) {
          return `Accessibility tip, ${studentName}: Always test interactive states with keyboard navigation (Tab/Shift+Tab) and maintain a visible focus ring (e.g. 'ring-2 ring-purple-500 ring-offset-2').`;
        }
        if (q.includes('figma') || q.includes('layout') || q.includes('component')) {
          return `In Figma and Tailwind CSS, build layout components from inside out: start with atomic buttons and inputs, then assemble molecules, maintaining consistent 4px/8px spacing scales.`;
        }
        return `Design matters! In '${cleanTitle}', great UI engineering pairs visual elegance with WCAG AAA accessibility. What interface or typography decision shall we refine?`;
      },
    };
  }

  // 6. DevOps & Cloud
  if (cat.includes('devops') || title.includes('cloud') || title.includes('kubernetes') || title.includes('docker')) {
    return {
      tutorName: 'DevOps & Cloud Sentinel',
      roleTitle: 'Cloud Native & Kubernetes Fellow',
      categoryTag: 'Docker, Kubernetes & GitOps Pipelines',
      avatarBadge: '⚡ DevOps Engineer',
      welcomeMessage:
        "Greetings! I'm your Cloud Native DevOps & Kubernetes AI Tutor. Ask me about multi-stage Docker builds, Kubernetes Pod/Ingress manifests, Helm charts, or GitOps pipelines!",
      recapText:
        `In '${cleanTitle}', you containerized microservices and deployed Kubernetes cluster workloads. Next milestone: configure horizontal pod autoscaling (HPA) and Prometheus telemetry!`,
      interviewQuestion: {
        question:
          'In Kubernetes, which workload controller is specifically designed for stateful applications (like databases) requiring persistent identities and ordered deployments?',
        category: 'Kubernetes Workloads',
        options: [
          { label: 'A', text: 'Deployment', isCorrect: false },
          { label: 'B', text: 'StatefulSet', isCorrect: true },
          { label: 'C', text: 'DaemonSet', isCorrect: false },
          { label: 'D', text: 'ReplicaSet', isCorrect: false },
        ],
        explanation:
          'StatefulSets manage stateful applications with unique network identifiers (e.g. pod-0, pod-1) and dedicated persistent volume claims across restarts.',
      },
      quizQuestion: {
        question:
          'What is the primary operational advantage of multi-stage Docker builds in production CI/CD?',
        category: 'Docker Containerization',
        options: [
          { label: 'A', text: 'They install unnecessary build compilers in the final container image', isCorrect: false },
          { label: 'B', text: 'They produce ultra-minimal runtime images by discarding build-time SDKs and dependencies, reducing attack surface and image size', isCorrect: true },
          { label: 'C', text: 'They bypass image registry authentication', isCorrect: false },
          { label: 'D', text: 'They force containers to run as the root user', isCorrect: false },
        ],
        explanation:
          'Multi-stage builds leave behind compilers, source code, and intermediate caches, copying only the compiled binary or dist files into a minimal distroless or alpine runner image.',
      },
      suggestedPrompts: [
        'How does Kubernetes Ingress routing work?',
        'How to write minimal multi-stage Dockerfiles',
        'Best practices for GitOps with ArgoCD',
      ],
      generateReply: (userText, _crs, studentName) => {
        const q = userText.toLowerCase();
        if (q.includes('docker') || q.includes('container') || q.includes('image')) {
          return `In container engineering, ${studentName}, always run your container as a non-root user ('USER 10001') and use '.dockerignore' to keep node_modules and secret keys out of image layers!`;
        }
        if (q.includes('kubernetes') || q.includes('k8s') || q.includes('pod') || q.includes('helm')) {
          return `Kubernetes best practice: Always define both 'resources.requests' and 'resources.limits' on your containers so the kube-scheduler can make informed node placement decisions without OOM-killing critical services.`;
        }
        return `Systems green! For '${cleanTitle}', reliability is achieved through automated health probes (liveness & readiness) and immutable GitOps declarations. What cluster challenge are we solving?`;
      },
    };
  }

  // 7. General Fallback for Any Enrolled Course (Health, Music, Productivity, etc.)
  return {
    tutorName: `${cleanTitle} AI Fellow`,
    roleTitle: `${cleanTitle} Learning Tutor`,
    categoryTag: `${course?.category || 'Curriculum'} Specialist`,
    avatarBadge: '🎓 Masterclass Tutor',
    welcomeMessage:
      `Hello! I'm your dedicated AI Fellow for '${cleanTitle}'. Ask me any concept, technique, practice drill, or project milestone from this track!`,
    recapText:
      `In '${cleanTitle}', you have been progressing through core modules. Next milestone: review the latest lecture recording and complete your practical submission!`,
    interviewQuestion: {
      question: `What is the core foundational principle taught in '${cleanTitle}'?`,
      category: `${course?.category || 'Core Concepts'}`,
      options: [
        { label: 'A', text: 'Consistent daily deliberate practice and technique mastery', isCorrect: true },
        { label: 'B', text: 'Skipping prerequisite modules and jumping to conclusions', isCorrect: false },
        { label: 'C', text: 'Ignoring feedback loops from mentors', isCorrect: false },
        { label: 'D', text: 'Memorizing without hands-on application', isCorrect: false },
      ],
      explanation: 'Mastery in this discipline requires consistent hands-on repetition, feedback integration, and deep practice.',
    },
    quizQuestion: {
      question: `Which approach best guarantees retention and real-world application in '${cleanTitle}'?`,
      category: 'Practical Application',
      options: [
        { label: 'A', text: 'Passive observation without taking notes', isCorrect: false },
        { label: 'B', text: 'Active project implementation and spaced repetition review', isCorrect: true },
        { label: 'C', text: 'Rushing through all videos in one sitting', isCorrect: false },
        { label: 'D', text: 'Avoiding peer collaborations', isCorrect: false },
      ],
      explanation: 'Spaced repetition and hands-on capstone projects build lasting muscle memory and practical capability.',
    },
    suggestedPrompts: [
      `Summarize the key objectives of ${cleanTitle}`,
      'Give me a 5-minute study breakdown for today',
      'What are the common pitfalls beginners make here?',
    ],
    generateReply: (_userText, crs, studentName) => {
      return `Great question, ${studentName}! In '${crs.title}', consistency is key. Review the module syllabus and lecture recordings, and focus on applying each concept in your practice exercises. What topic would you like to explore next?`;
    },
  };
}

