import { Course } from '@/types';

export interface CourseVideo {
  id: string;
  title: string;
  type: 'recording' | 'reference' | 'lesson';
  duration: string;
  durationMinutes: number;
  date: string;
  tag: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  chapters: { time: string; label: string }[];
}

export interface CourseVideoLibrary {
  recordings: CourseVideo[];
  references: CourseVideo[];
  allVideos: CourseVideo[];
}

// Sample video stream for interactive playback
const SAMPLE_STREAM_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

/**
 * Dynamically builds a rich, fully populated video recordings and reference library
 * for ANY course in the catalog, ensuring every single course has complete video access.
 */
export function getCourseVideoLibrary(course: Course): CourseVideoLibrary {
  if (!course) {
    return { recordings: [], references: [], allVideos: [] };
  }

  const cleanTitle = course.title.split(',')[0].split(':')[0].trim();

  // 1. Generate video recordings based on the actual course lessons
  const recordings: CourseVideo[] = course.lessons && course.lessons.length > 0
    ? course.lessons.map((lesson, idx) => {
        const mins = lesson.durationMinutes || 45;
        const durFormatted = `${mins}:00`;
        const dateStr = `Session ${idx + 1} · Recorded Cohort Lecture`;

        return {
          id: `vid-rec-${course.id}-${lesson.id || idx}`,
          title: `Lesson ${idx + 1}: ${lesson.title}`,
          type: 'recording' as const,
          duration: durFormatted,
          durationMinutes: mins,
          date: dateStr,
          tag: idx === 0 ? 'Orientation & Core' : idx === course.lessons.length - 1 ? 'Capstone & Review' : 'Applied Workshop',
          views: `${1450 + (idx + 1) * 120} views`,
          thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
          videoUrl: lesson.videoUrl || SAMPLE_STREAM_URL,
          description: lesson.content || `In-depth streamable lecture recording covering ${lesson.title} with live demonstrations and real-world implementation exercises.`,
          chapters: [
            { time: '00:00', label: 'Overview & Agenda' },
            { time: '12:30', label: 'Core Technical Concepts' },
            { time: '28:15', label: 'Hands-on Implementation & Lab' },
            { time: `${Math.max(1, mins - 8)}:00`, label: 'Q&A & Key Takeaways' },
          ],
        };
      })
    : [
        {
          id: `vid-rec-${course.id}-1`,
          title: `${cleanTitle} — Session 1: Orientation & Technical Roadmap`,
          type: 'recording' as const,
          duration: '45:00',
          durationMinutes: 45,
          date: 'Recorded Live Session',
          tag: 'Foundation',
          views: '1,420 views',
          thumbnail: course.thumbnail,
          videoUrl: SAMPLE_STREAM_URL,
          description: 'Comprehensive orientation covering course prerequisites, engineering toolchain setup, and syllabus roadmap.',
          chapters: [
            { time: '00:00', label: 'Welcome & Introduction' },
            { time: '15:00', label: 'Architecture Overview' },
            { time: '30:00', label: 'Live Demonstration' },
          ],
        },
        {
          id: `vid-rec-${course.id}-2`,
          title: `${cleanTitle} — Session 2: Practical Lab & Hands-on Implementation`,
          type: 'recording' as const,
          duration: '52:00',
          durationMinutes: 52,
          date: 'Recorded Live Session',
          tag: 'Applied Lab',
          views: '1,180 views',
          thumbnail: course.thumbnail,
          videoUrl: SAMPLE_STREAM_URL,
          description: 'Step-by-step technical walkthrough demonstrating industry best practices and edge case error mitigation.',
          chapters: [
            { time: '00:00', label: 'Lab Setup' },
            { time: '20:00', label: 'Building the Solution' },
            { time: '40:00', label: 'Verification & Testing' },
          ],
        },
      ];

  // 2. Generate curated category-specific reference videos & blueprints
  const references: CourseVideo[] = getCategoryReferences(course);

  return {
    recordings,
    references,
    allVideos: [...recordings, ...references],
  };
}

function getCategoryReferences(course: Course): CourseVideo[] {
  const cat = (course.category || '').toLowerCase();
  const cleanTitle = course.title.split(',')[0].split(':')[0].trim();

  if (cat.includes('cyber') || cat.includes('security')) {
    return [
      {
        id: `ref-${course.id}-1`,
        title: 'Reference Video: AWS IAM Privilege Escalation & Breach Detection Walkthrough',
        type: 'reference',
        duration: '24:15',
        durationMinutes: 24,
        date: 'Cloud Security Blueprint',
        tag: 'Threat Intelligence',
        views: '3,420 views',
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
        videoUrl: SAMPLE_STREAM_URL,
        description: 'Deep dive into real-world breach forensics: inspecting compromised instance metadata, tracing attacker lateral movement, and applying automated lambda remediation.',
        chapters: [
          { time: '00:00', label: 'Incident Discovery' },
          { time: '08:30', label: 'IMDSv2 Analysis' },
          { time: '17:40', label: 'Remediation Pipeline' },
        ],
      },
      {
        id: `ref-${course.id}-2`,
        title: 'Reference Video: Wireshark Packet Inspection & C2 Traffic Analysis',
        type: 'reference',
        duration: '31:40',
        durationMinutes: 31,
        date: 'Network Forensics Guide',
        tag: 'Hands-on Lab',
        views: '2,890 views',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
        videoUrl: SAMPLE_STREAM_URL,
        description: 'Analyzing PCAP network captures to detect beaconing malware, DNS tunneling anomalies, and TLS handshake indicators.',
        chapters: [
          { time: '00:00', label: 'Packet Ingestion' },
          { time: '12:15', label: 'Detecting Anomalies' },
          { time: '24:00', label: 'Threat Signatures' },
        ],
      },
      {
        id: `ref-${course.id}-3`,
        title: 'Reference Video: Production Terraform Blueprints for Zero Trust Access',
        type: 'reference',
        duration: '18:50',
        durationMinutes: 19,
        date: 'Architecture Blueprint',
        tag: 'Zero Trust',
        views: '2,150 views',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
        videoUrl: SAMPLE_STREAM_URL,
        description: 'Declarative Terraform code review constructing mutual TLS service meshes, VPC endpoints, and strict security group policies.',
        chapters: [
          { time: '00:00', label: 'IaC Structure' },
          { time: '07:20', label: 'mTLS Mesh Setup' },
          { time: '14:30', label: 'Audit & Compliance' },
        ],
      },
    ];
  }

  if (cat.includes('data') || cat.includes('ai') || cat.includes('machine')) {
    return [
      {
        id: `ref-${course.id}-1`,
        title: 'Reference Video: PyTorch Tensor Operations & Autograd Mathematical Intuition',
        type: 'reference',
        duration: '26:10',
        durationMinutes: 26,
        date: 'AI Architecture Guide',
        tag: 'Mathematics & PyTorch',
        views: '3,800 views',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600',
        videoUrl: SAMPLE_STREAM_URL,
        description: 'Visual walkthrough of computational graphs, backward propagation gradients, and tensor memory layouts.',
        chapters: [
          { time: '00:00', label: 'Tensors & Memory' },
          { time: '11:00', label: 'Computational Graphs' },
          { time: '20:00', label: 'Gradient Calculations' },
        ],
      },
      {
        id: `ref-${course.id}-2`,
        title: 'Reference Video: Transformer Attention Mechanism & Multi-Head Projections',
        type: 'reference',
        duration: '35:20',
        durationMinutes: 35,
        date: 'Deep Learning Blueprint',
        tag: 'Transformers',
        views: '4,100 views',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
        videoUrl: SAMPLE_STREAM_URL,
        description: 'Step-by-step matrix derivation of Scaled Dot-Product Attention, query-key-value projections, and causal masking.',
        chapters: [
          { time: '00:00', label: 'Attention Overview' },
          { time: '14:30', label: 'Q, K, V Matrices' },
          { time: '26:00', label: 'Self-Attention in Action' },
        ],
      },
      {
        id: `ref-${course.id}-3`,
        title: 'Reference Video: Model Serving, ONNX Quantization & GPU Latency Optimization',
        type: 'reference',
        duration: '22:15',
        durationMinutes: 22,
        date: 'Production ML Guide',
        tag: 'Inference Tuning',
        views: '2,450 views',
        thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
        videoUrl: SAMPLE_STREAM_URL,
        description: 'Exporting PyTorch weights to ONNX format, FP16/INT8 post-training quantization, and Triton inference benchmarks.',
        chapters: [
          { time: '00:00', label: 'Quantization Concepts' },
          { time: '09:40', label: 'ONNX Export' },
          { time: '18:00', label: 'Benchmarking Results' },
        ],
      },
    ];
  }

  // Default / Development / Design / General reference library
  return [
    {
      id: `ref-${course.id}-1`,
      title: `Reference Video: ${cleanTitle} — Fast-Track 15-Minute Architecture Blueprint`,
      type: 'reference',
      duration: '16:45',
      durationMinutes: 17,
      date: 'Executive Architecture Summary',
      tag: 'Cheat Sheet',
      views: '3,210 views',
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      videoUrl: SAMPLE_STREAM_URL,
      description: 'High-yield reference walkthrough highlighting syntax patterns, architectural structure, and common pitfalls.',
      chapters: [
        { time: '00:00', label: 'Core Architecture' },
        { time: '06:00', label: 'Key Implementation Rules' },
        { time: '12:00', label: 'Production Checklist' },
      ],
    },
    {
      id: `ref-${course.id}-2`,
      title: 'Reference Video: Production Performance Benchmarks, Profiling & Memory Tuning',
      type: 'reference',
      duration: '27:10',
      durationMinutes: 27,
      date: 'Engineering Case Study',
      tag: 'Performance Tuning',
      views: '2,640 views',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      videoUrl: SAMPLE_STREAM_URL,
      description: 'Diagnostic profiling session identifying bottlenecks, flamegraphs, memory leaks, and render latency mitigations.',
      chapters: [
        { time: '00:00', label: 'Profiling Setup' },
        { time: '10:30', label: 'Flamegraph Analysis' },
        { time: '20:15', label: 'Applied Fixes' },
      ],
    },
    {
      id: `ref-${course.id}-3`,
      title: 'Reference Video: Automated Testing Workflows, CI/CD Hardening & Deployment',
      type: 'reference',
      duration: '21:30',
      durationMinutes: 22,
      date: 'DevOps & Quality Assurance',
      tag: 'Best Practices',
      views: '1,980 views',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
      videoUrl: SAMPLE_STREAM_URL,
      description: 'Implementing end-to-end unit and integration test suites with zero-downtime automated deployment pipelines.',
      chapters: [
        { time: '00:00', label: 'Testing Philosophy' },
        { time: '09:00', label: 'CI Pipeline Configuration' },
        { time: '17:00', label: 'Release Verification' },
      ],
    },
  ];
}
