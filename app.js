document.addEventListener('DOMContentLoaded', () => {

    // ==================== 1. STATE ====================
    let currentUser = null;
    let currentLang = localStorage.getItem('clozer-lang') || 'en';
    let currentTheme = localStorage.getItem('clozer-theme') || 'dark';
    let simState = {
        active: false,
        scenarioKey: null,
        questionIndex: 0,
        exchanges: [],
        scores: { structure: 0, clarity: 0, persuasion: 0, confidence: 0, relevance: 0 },
        totalScored: 0
    };
    let dashboardCache = null;
    let demoExchangeCount = 0;
    let isAnnual = false;
    let countersAnimated = false;
    let pendingLeaveAction = null;

    // ==================== 2. FIREBASE INIT ====================
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.firebasestorage.app",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    let fbReady = false, fbAuth = null, fbDb = null;
    if (typeof firebase !== 'undefined') {
        try {
            firebase.initializeApp(firebaseConfig);
            fbAuth = firebase.auth();
            fbDb = firebase.firestore();
            fbReady = firebaseConfig.apiKey !== "YOUR_API_KEY";
        } catch(e) { console.warn('Firebase init skipped', e); }
    }

    // ==================== 3. i18n SYSTEM ====================
    const T = {
        en: {
            'hero-badge-text': 'AI-Powered Conversation Training',
            'hero-title': 'Close Every Conversation<br><span class="gradient-text">With Confidence</span>',
            'hero-sub': 'The AI performance coach that transforms how you interview, negotiate, and persuade. Real-time simulation. Instant scoring. Measurable improvement.',
            'start-sim-text': 'Start Free Simulation',
            'watch-demo-text': 'Watch Demo',
            'how-tag': 'How It Works',
            'how-title': 'Five Steps to Mastery',
            'how-sub': 'From first attempt to peak performance in a structured, measurable flow.',
            'step1-title': 'Choose Your Scenario',
            'step1-desc': 'Select from job interviews, sales calls, negotiations, or custom scenarios tailored to your industry.',
            'step1-micro': 'Upload your resume for personalized questions',
            'step2-title': 'Start Live AI Simulation',
            'step2-desc': 'Engage in a dynamic conversation with our AI interviewer via voice or text. Every session is unique.',
            'step2-micro': 'Adaptive difficulty adjusts to your level',
            'step3-title': 'Real-Time Evaluation',
            'step3-desc': 'Watch your scores update live across structure, clarity, persuasiveness, confidence, and relevance.',
            'step3-micro': '5-dimensional AI scoring engine',
            'step4-title': 'Instant Detailed Feedback',
            'step4-desc': 'Get actionable insights on every answer: what worked, what didn\'t, and exactly how to improve.',
            'step4-micro': 'Suggested rewrites for every weak answer',
            'step5-title': 'Track & Improve',
            'step5-desc': 'Monitor your progress over time with analytics dashboards. Repeat until you hit your target score.',
            'step5-micro': 'Mastery loop: practice until you excel',
            'features-tag': 'Core Features',
            'features-title': 'Built for Peak Performance',
            'features-sub': 'Every feature is designed to accelerate your conversation mastery.',
            'demo-tag': 'Live Demo',
            'demo-title': 'See The Clozer in Action',
            'demo-sub': 'Experience a real simulation interface. Try it yourself.',
            'demo-hint': 'Tip: Use the STAR method. Quantify your results.',
            'who-tag': 'Who It\'s For',
            'who-title': 'Built for Anyone Who Needs to Perform',
            'who-sub': 'Whether you\'re landing your first job or closing a million-dollar deal.',
            'pricing-tag': 'Pricing',
            'pricing-title': 'Invest in Your Performance',
            'pricing-sub': 'Start free. Upgrade when you\'re ready to go all-in.',
            'toggle-monthly': 'Monthly',
            'toggle-annual': 'Annual <span class="save-badge">Save 33%</span>',
            'faq-tag': 'FAQ',
            'faq-title': 'Frequently Asked Questions',
            'final-cta-title': 'Ready to Close With Confidence?',
            'final-cta-sub': 'Start training today and transform your conversation skills.',
            'final-cta-btn': 'Start Your Free Simulation',
            'auth-modal-title': 'Welcome to The Clozer',
            'leave-modal-title': 'Leave Simulation?',
            'leave-modal-desc': 'Your current progress will be lost if you leave now.',
            'sim-hint': 'Tip: Be specific, use numbers, and structure your answer clearly.',
            _nav_signin: 'Sign In',
            _nav_signup: 'Sign Up',
            _leave_cancel: 'Continue Training',
            _leave_confirm: 'Leave',
            _scenario_modal_title: 'Choose Your Scenario',
            _scenario_modal_sub: 'Select a conversation type to begin your simulation.',
            _result_title: 'Simulation Complete',
            _result_overall: 'Overall Score',
            _result_dimensions: 'Dimension Breakdown',
            _result_exchanges: 'Exchange Details',
            _result_retry: 'Try Again',
            _result_home: 'Back to Home',
            _dash_total: 'Total Simulations',
            _dash_avg: 'Average Score',
            _dash_best: 'Best Score',
            _dash_streak: 'Current Streak',
            _demo_signup_prompt: 'Sign up for a full simulation with detailed scoring!',
            _toast_firebase: 'Firebase not configured. Auth features unavailable.',
            _toast_signedin: 'Signed in successfully!',
            _toast_signedout: 'Signed out.',
            _toast_account_created: 'Account created!',
            _toast_sim_saved: 'Session saved to your dashboard.',
            // Nav
            'nav-how': 'How It Works',
            'nav-features': 'Features',
            'nav-demo': 'Demo',
            'nav-pricing': 'Pricing',
            'nav-faq': 'FAQ',
            'nav-start-btn': 'Start Free',
            'nav-dashboard-text': 'Dashboard',
            'nav-settings-text': 'Settings',
            'nav-signout-text': 'Sign Out',
            'try-sim-text': 'Try a Full Simulation Free',
            // Features
            'feat1-title': 'AI Dynamic Question Engine',
            'feat1-desc': 'Never face the same interview twice. Our AI generates contextually relevant questions based on your target role, industry, and experience level.',
            'feat1-li1': 'Adapts in real-time based on your responses',
            'feat1-li2': 'Covers behavioral, technical, and situational questions',
            'feat1-li3': 'Growing question library across industries',
            'feat1-bar1': 'Behavioral',
            'feat1-bar2': 'Technical',
            'feat1-bar3': 'Situational',
            'feat1-bar4': 'Follow-up',
            'feat2-title': 'Resume & JD Personalization',
            'feat2-desc': 'Upload your resume and job description. The AI tailors every question to your exact situation.',
            'feat2-li1': 'Parses skills, experience, and gaps',
            'feat2-li2': 'Generates role-specific scenarios',
            'feat2-li3': 'Highlights areas to strengthen',
            'feat3-title': 'Voice & Text Simulation',
            'feat3-desc': 'Train the way you\'ll perform. Practice via voice for real interviews or text for quick drills.',
            'feat3-li1': 'Real-time speech-to-text',
            'feat3-li2': 'Tone and pace analysis',
            'feat3-li3': 'Filler word detection',
            'feat4-title': 'Multi-Dimensional AI Scoring',
            'feat4-desc': 'Go beyond "good" or "bad." Get precise scores across five critical dimensions.',
            'feat4-li1': 'Structure & Organization',
            'feat4-li2': 'Clarity & Articulation',
            'feat4-li3': 'Persuasiveness & Impact',
            'feat4-li4': 'Confidence & Delivery',
            'feat4-li5': 'Relevance & Precision',
            'feat5-title': 'Adaptive Difficulty',
            'feat5-desc': 'The AI adjusts challenge level based on your performance. Start easy, graduate to executive-level scenarios.',
            'feat5-li1': '3 difficulty tiers: Foundation, Advanced, Elite',
            'feat5-li2': 'Auto-escalation on high scores',
            'feat5-li3': 'Pressure simulation mode',
            'feat6-title': 'Performance Analytics',
            'feat6-desc': 'Track every metric that matters. See trends, identify weaknesses, and measure your growth.',
            'feat6-li1': 'Session-over-session comparison',
            'feat6-li2': 'Dimension-level trend charts',
            'feat6-li3': 'Exportable progress reports',
            'feat7-title': 'Simulation Replay',
            'feat7-desc': 'Review any past session with full transcript, scores, and AI-generated improvement suggestions.',
            'feat7-li1': 'Side-by-side answer comparison',
            'feat7-li2': 'AI-rewritten model answers',
            'feat7-li3': 'Bookmark key moments',
            'feat8-title': 'Mastery Loop System',
            'feat8-desc': 'Don\'t just practice. Master. Repeat scenarios until you consistently hit your target score threshold.',
            'feat8-li1': 'Set personal score targets',
            'feat8-li2': 'Unlock next difficulty on mastery',
            'feat8-li3': 'Achievement badges and streaks',
            // Scoring
            'scoring-tag': 'AI Scoring Engine',
            'scoring-title': 'Transparent 5-Dimension Evaluation',
            'scoring-sub': 'Every response is scored across five critical dimensions using our proprietary AI engine. No black boxes — see exactly where you stand and what to improve.',
            // Demo
            'demo-panel-ai': 'AI Interviewer',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': 'Senior Hiring Manager',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': 'Advanced',
            'demo-panel-sim': 'Simulation',
            'demo-panel-score': 'Live Score',
            'demo-score-label': 'Overall Score',
            'demo-keywords-label': 'Keywords Matched',
            // Audience
            'aud1-title': 'Job Seekers',
            'aud1-pain': 'Tired of freezing under pressure and fumbling through interviews?',
            'aud1-promise': 'Walk into every interview fully rehearsed, confident, and ready to close the offer.',
            'aud1-cta': 'Start Interview Training',
            'aud2-title': 'Sales Professionals',
            'aud2-pain': 'Losing deals because objections catch you off guard?',
            'aud2-promise': 'Sharpen your pitch, handle any objection, and increase your close rate by up to 40%.',
            'aud2-cta': 'Start Sales Training',
            'aud3-title': 'Founders & Executives',
            'aud3-pain': 'Need to nail investor pitches, board presentations, and high-stakes meetings?',
            'aud3-promise': 'Refine your executive presence and persuasion skills at the highest level.',
            'aud3-cta': 'Start Executive Training',
            'aud4-title': 'Students',
            'aud4-pain': 'Anxious about your first real interview or college admissions?',
            'aud4-promise': 'Build unshakable confidence with guided practice before it counts.',
            'aud4-cta': 'Start Student Training',
            'aud5-title': 'Negotiation Learners',
            'aud5-pain': 'Leaving money on the table because you don\'t know how to negotiate?',
            'aud5-promise': 'Learn proven frameworks and practice them until negotiation feels natural.',
            'aud5-cta': 'Start Negotiation Training',
            // Pricing
            'price-free-tier': 'Free',
            'price-free-period': '/month',
            'price-free-desc': 'Get started and experience the platform.',
            'price-free-f1': '3 simulations per month',
            'price-free-f2': 'Text-based simulation',
            'price-free-f3': 'Basic AI feedback',
            'price-free-f4': '3 scenario types',
            'price-free-f5': 'Voice simulation',
            'price-free-f6': 'Resume personalization',
            'price-free-f7': 'Analytics dashboard',
            'price-free-cta': 'Get Started Free',
            'price-pro-popular': 'Most Popular',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/month',
            'price-pro-desc': 'For serious preparation and consistent improvement.',
            'price-pro-f1': 'Unlimited simulations',
            'price-pro-f2': 'Voice + Text simulation',
            'price-pro-f3': 'Advanced AI feedback',
            'price-pro-f4': 'All scenario types',
            'price-pro-f5': 'Resume & JD upload',
            'price-pro-f6': 'Performance analytics',
            'price-pro-f7': 'Priority AI processing',
            'price-pro-cta': 'Start Pro Trial',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/month',
            'price-elite-desc': 'Maximum preparation for maximum stakes.',
            'price-elite-f1': 'Everything in Pro',
            'price-elite-f2': 'Priority AI processing',
            'price-elite-f3': 'Emotional tone detection',
            'price-elite-f4': 'Negotiation strategy scoring',
            'price-elite-f5': 'Personalized improvement roadmap',
            'price-elite-f6': 'AI performance ranking',
            'price-elite-f7': 'White-glove onboarding',
            'price-elite-cta': 'Start Elite Trial',
            'pricing-note': 'All plans include a 7-day free trial. No credit card required for Free tier. Cancel anytime.',
            // FAQ
            'faq-q1': 'How accurate is the AI evaluation?',
            'faq-a1': 'Our AI scoring engine evaluates across 5 dimensions — structure, clarity, persuasiveness, confidence, and relevance — providing detailed, actionable feedback on every response. The system continuously improves through feedback loops and model updates.',
            'faq-q2': 'Is my data private and secure?',
            'faq-a2': 'Absolutely. All simulation data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Firebase enterprise-grade security infrastructure. Your recordings and transcripts are never shared with third parties or used to train external models.',
            'faq-q3': 'How do I manage or cancel my subscription?',
            'faq-a3': 'You can manage your subscription directly from your account dashboard. Upgrade, downgrade, or cancel with one click. No hidden fees, no cancellation penalties, and your data remains accessible for 30 days after cancellation.',
            'faq-q4': 'Do you offer enterprise or team licensing?',
            'faq-a4': 'Yes. We offer custom enterprise plans with team management dashboards, bulk pricing, SSO integration, custom scenario libraries, and dedicated account management. Contact us for a tailored quote.',
            'faq-q5': 'Are voice recordings stored?',
            'faq-a5': 'Voice recordings are processed in real-time for evaluation and transcription. On Free and Pro plans, audio is deleted after processing. Elite users can opt in to save recordings for replay and self-review.',
            'faq-q6': 'What languages are supported?',
            'faq-a6': 'Currently, The Clozer supports full simulation and evaluation in English, Korean, Japanese, and Spanish. We\'re actively expanding to Mandarin, French, German, and Portuguese.',
            'faq-q7': 'How does performance tracking work?',
            'faq-a7': 'Every simulation generates scores across 5 dimensions. Your analytics dashboard shows session-over-session trends, dimension-level breakdowns, percentile rankings, and personalized improvement recommendations.',
            'faq-q8': 'Can I use The Clozer for non-interview scenarios?',
            'faq-a8': 'Yes. Beyond job interviews, The Clozer supports sales calls, salary negotiations, investor pitches, college admissions, client presentations, and any high-stakes conversation where persuasion and clarity matter.',
            // Final CTA
            'final-cta-note': 'No credit card required. Start in 30 seconds.',
            // Footer
            'footer-tagline': 'The AI Performance Coach for High-Stakes Conversations.',
            'footer-col1-title': 'Product',
            'footer-col1-l1': 'Features',
            'footer-col1-l2': 'Pricing',
            'footer-col1-l3': 'Demo',
            'footer-col1-l4': 'Enterprise',
            'footer-col2-title': 'Company',
            'footer-col2-l1': 'About',
            'footer-col2-l2': 'Careers',
            'footer-col2-l3': 'Blog',
            'footer-contact-link': 'Contact',
            'footer-col3-title': 'Legal',
            'footer-privacy-link': 'Privacy Policy',
            'footer-terms-link': 'Terms of Service',
            'footer-col3-l3': 'Cookie Policy',
            'footer-col3-l4': 'GDPR',
            'footer-copyright': '&copy; 2026 The Clozer. All rights reserved.',
            'footer-share-title': 'Spread the Word',
        },
        ko: {
            'hero-badge-text': 'AI 기반 대화 훈련',
            'hero-title': '모든 대화를<br><span class="gradient-text">자신감 있게 마무리하세요</span>',
            'hero-sub': '면접, 협상, 설득을 혁신하는 AI 퍼포먼스 코치. 실시간 시뮬레이션. 즉각 채점. 측정 가능한 향상.',
            'start-sim-text': '무료 시뮬레이션 시작',
            'watch-demo-text': '데모 보기',
            'how-tag': '작동 방식',
            'how-title': '마스터리를 위한 5단계',
            'how-sub': '첫 시도부터 최고 성과까지 체계적이고 측정 가능한 흐름으로.',
            'step1-title': '시나리오 선택',
            'step1-desc': '면접, 영업, 협상 등 산업에 맞춘 시나리오를 선택하세요.',
            'step1-micro': '맞춤 질문을 위해 이력서 업로드',
            'step2-title': 'AI 시뮬레이션 시작',
            'step2-desc': 'AI 면접관과 역동적인 대화에 참여하세요. 매 세션이 고유합니다.',
            'step2-micro': '적응형 난이도 조절',
            'step3-title': '실시간 평가',
            'step3-desc': '구조, 명확성, 설득력, 자신감, 관련성에 걸쳐 점수가 실시간으로 업데이트됩니다.',
            'step3-micro': '5차원 AI 채점 엔진',
            'step4-title': '즉각적인 상세 피드백',
            'step4-desc': '모든 답변에 대한 실행 가능한 인사이트를 받으세요.',
            'step4-micro': '약한 답변에 대한 개선 제안',
            'step5-title': '추적 및 개선',
            'step5-desc': '분석 대시보드로 진행 상황을 모니터링하세요.',
            'step5-micro': '마스터리 루프: 탁월해질 때까지 연습',
            'features-tag': '핵심 기능',
            'features-title': '최고 성과를 위해 설계',
            'features-sub': '모든 기능이 대화 마스터리를 가속합니다.',
            'demo-tag': '라이브 데모',
            'demo-title': 'The Clozer를 직접 체험하세요',
            'demo-sub': '실제 시뮬레이션 인터페이스를 경험해 보세요.',
            'demo-hint': '팁: STAR 방법을 사용하세요. 결과를 수치화하세요.',
            'who-tag': '대상 사용자',
            'who-title': '성과가 필요한 모든 분을 위해',
            'who-sub': '첫 취업부터 대형 딜 클로징까지.',
            'pricing-tag': '요금제',
            'pricing-title': '성과에 투자하세요',
            'pricing-sub': '무료로 시작. 준비되면 업그레이드.',
            'toggle-monthly': '월간',
            'toggle-annual': '연간 <span class="save-badge">33% 할인</span>',
            'faq-tag': '자주 묻는 질문',
            'faq-title': '자주 묻는 질문',
            'final-cta-title': '자신감 있게 마무리할 준비가 되셨나요?',
            'final-cta-sub': '오늘 훈련을 시작하고 대화 능력을 혁신하세요.',
            'final-cta-btn': '무료 시뮬레이션 시작',
            'auth-modal-title': 'The Clozer에 오신 것을 환영합니다',
            'leave-modal-title': '시뮬레이션을 떠나시겠습니까?',
            'leave-modal-desc': '지금 나가면 현재 진행 상황이 사라집니다.',
            'sim-hint': '팁: 구체적으로, 숫자를 사용하고, 답변을 명확하게 구성하세요.',
            _nav_signin: '로그인',
            _nav_signup: '회원가입',
            _leave_cancel: '계속 훈련',
            _leave_confirm: '나가기',
            _scenario_modal_title: '시나리오 선택',
            _scenario_modal_sub: '시뮬레이션을 시작할 대화 유형을 선택하세요.',
            _result_title: '시뮬레이션 완료',
            _result_overall: '종합 점수',
            _result_dimensions: '차원별 분석',
            _result_exchanges: '교환 상세',
            _result_retry: '다시 시도',
            _result_home: '홈으로',
            _dash_total: '총 시뮬레이션',
            _dash_avg: '평균 점수',
            _dash_best: '최고 점수',
            _dash_streak: '현재 연속 기록',
            _demo_signup_prompt: '상세 채점이 포함된 전체 시뮬레이션을 위해 가입하세요!',
            _toast_firebase: 'Firebase가 설정되지 않았습니다.',
            _toast_signedin: '로그인 성공!',
            _toast_signedout: '로그아웃 완료.',
            _toast_account_created: '계정 생성 완료!',
            _toast_sim_saved: '세션이 대시보드에 저장되었습니다.',
            // Nav
            'nav-how': '작동 방식',
            'nav-features': '기능',
            'nav-demo': '데모',
            'nav-pricing': '요금제',
            'nav-faq': 'FAQ',
            'nav-start-btn': '무료 시작',
            'nav-dashboard-text': '대시보드',
            'nav-settings-text': '설정',
            'nav-signout-text': '로그아웃',
            'try-sim-text': '무료 전체 시뮬레이션 체험',
            // Features
            'feat1-title': 'AI 동적 질문 엔진',
            'feat1-desc': '같은 면접을 두 번 겪지 않습니다. AI가 목표 직무, 산업, 경험 수준에 맞춰 맥락에 적합한 질문을 생성합니다.',
            'feat1-li1': '응답에 따라 실시간으로 적응',
            'feat1-li2': '행동, 기술, 상황별 질문 포함',
            'feat1-li3': '산업별 질문 라이브러리 지속 확대',
            'feat1-bar1': '행동면접',
            'feat1-bar2': '기술면접',
            'feat1-bar3': '상황별',
            'feat1-bar4': '후속질문',
            'feat2-title': '이력서 & JD 맞춤화',
            'feat2-desc': '이력서와 채용 공고를 업로드하세요. AI가 정확한 상황에 맞춰 모든 질문을 조정합니다.',
            'feat2-li1': '기술, 경험, 약점 분석',
            'feat2-li2': '직무별 시나리오 생성',
            'feat2-li3': '강화할 영역 하이라이트',
            'feat3-title': '음성 & 텍스트 시뮬레이션',
            'feat3-desc': '실제 수행 방식으로 훈련하세요. 실제 면접용 음성 또는 빠른 연습용 텍스트로 연습.',
            'feat3-li1': '실시간 음성-텍스트 변환',
            'feat3-li2': '톤과 속도 분석',
            'feat3-li3': '불필요한 말 감지',
            'feat4-title': '다차원 AI 채점',
            'feat4-desc': '"좋음" 또는 "나쁨"을 넘어서. 5가지 핵심 차원에서 정확한 점수를 받으세요.',
            'feat4-li1': '구조 & 조직',
            'feat4-li2': '명확성 & 표현',
            'feat4-li3': '설득력 & 영향력',
            'feat4-li4': '자신감 & 전달력',
            'feat4-li5': '관련성 & 정확성',
            'feat5-title': '적응형 난이도',
            'feat5-desc': 'AI가 성과에 따라 난이도를 조절합니다. 쉬운 것부터 시작하여 임원급 시나리오로 성장.',
            'feat5-li1': '3단계 난이도: 기초, 고급, 엘리트',
            'feat5-li2': '고득점 시 자동 상향',
            'feat5-li3': '압박 시뮬레이션 모드',
            'feat6-title': '성과 분석',
            'feat6-desc': '중요한 모든 지표를 추적하세요. 트렌드 확인, 약점 식별, 성장 측정.',
            'feat6-li1': '세션별 비교',
            'feat6-li2': '차원별 트렌드 차트',
            'feat6-li3': '내보내기 가능한 진행 보고서',
            'feat7-title': '시뮬레이션 리플레이',
            'feat7-desc': '전체 대본, 점수, AI 생성 개선 제안과 함께 과거 세션을 검토하세요.',
            'feat7-li1': '답변 나란히 비교',
            'feat7-li2': 'AI 재작성 모범 답변',
            'feat7-li3': '핵심 순간 북마크',
            'feat8-title': '마스터리 루프 시스템',
            'feat8-desc': '단순 연습이 아닌 마스터. 목표 점수를 꾸준히 달성할 때까지 시나리오를 반복하세요.',
            'feat8-li1': '개인 목표 점수 설정',
            'feat8-li2': '마스터 달성 시 다음 난이도 해제',
            'feat8-li3': '성취 배지와 연속 기록',
            // Scoring
            'scoring-tag': 'AI 채점 엔진',
            'scoring-title': '투명한 5차원 평가',
            'scoring-sub': '모든 응답은 자체 AI 엔진을 사용하여 5가지 핵심 차원에서 채점됩니다. 블랙박스 없이 — 정확히 어디에 있는지, 무엇을 개선해야 하는지 확인하세요.',
            // Demo
            'demo-panel-ai': 'AI 면접관',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': '시니어 채용 매니저',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': '고급',
            'demo-panel-sim': '시뮬레이션',
            'demo-panel-score': '실시간 점수',
            'demo-score-label': '종합 점수',
            'demo-keywords-label': '매칭된 키워드',
            // Audience
            'aud1-title': '취업 준비생',
            'aud1-pain': '압박감에 얼어붙고 면접에서 실수하는 것에 지치셨나요?',
            'aud1-promise': '모든 면접에 충분히 연습하고, 자신감 있게, 오퍼를 받을 준비가 된 상태로 들어가세요.',
            'aud1-cta': '면접 훈련 시작',
            'aud2-title': '영업 전문가',
            'aud2-pain': '예상치 못한 반대에 딜을 잃고 있나요?',
            'aud2-promise': '피치를 갈고닦고, 모든 반대를 처리하고, 성사율을 최대 40% 향상시키세요.',
            'aud2-cta': '영업 훈련 시작',
            'aud3-title': '창업자 & 임원',
            'aud3-pain': '투자자 피칭, 이사회 발표, 중요한 회의를 완벽하게 해야 하나요?',
            'aud3-promise': '최고 수준에서 임원 프레젠스와 설득력을 연마하세요.',
            'aud3-cta': '임원 훈련 시작',
            'aud4-title': '학생',
            'aud4-pain': '첫 실제 면접이나 대학 입시가 불안하신가요?',
            'aud4-promise': '중요한 순간 전에 가이드된 연습으로 흔들림 없는 자신감을 쌓으세요.',
            'aud4-cta': '학생 훈련 시작',
            'aud5-title': '협상 학습자',
            'aud5-pain': '협상 방법을 몰라서 돈을 놓치고 있나요?',
            'aud5-promise': '검증된 프레임워크를 배우고 협상이 자연스러울 때까지 연습하세요.',
            'aud5-cta': '협상 훈련 시작',
            // Pricing
            'price-free-tier': '무료',
            'price-free-period': '/월',
            'price-free-desc': '플랫폼을 시작하고 경험해 보세요.',
            'price-free-f1': '월 3회 시뮬레이션',
            'price-free-f2': '텍스트 기반 시뮬레이션',
            'price-free-f3': '기본 AI 피드백',
            'price-free-f4': '3가지 시나리오 유형',
            'price-free-f5': '음성 시뮬레이션',
            'price-free-f6': '이력서 맞춤화',
            'price-free-f7': '분석 대시보드',
            'price-free-cta': '무료로 시작',
            'price-pro-popular': '가장 인기',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/월',
            'price-pro-desc': '진지한 준비와 꾸준한 향상을 위해.',
            'price-pro-f1': '무제한 시뮬레이션',
            'price-pro-f2': '음성 + 텍스트 시뮬레이션',
            'price-pro-f3': '고급 AI 피드백',
            'price-pro-f4': '모든 시나리오 유형',
            'price-pro-f5': '이력서 & JD 업로드',
            'price-pro-f6': '성과 분석',
            'price-pro-f7': '우선 AI 처리',
            'price-pro-cta': 'Pro 체험 시작',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/월',
            'price-elite-desc': '최고의 준비로 최고의 성과를.',
            'price-elite-f1': 'Pro의 모든 기능 포함',
            'price-elite-f2': '우선 AI 처리',
            'price-elite-f3': '감정 톤 감지',
            'price-elite-f4': '협상 전략 채점',
            'price-elite-f5': '맞춤형 개선 로드맵',
            'price-elite-f6': 'AI 성과 랭킹',
            'price-elite-f7': '프리미엄 온보딩',
            'price-elite-cta': 'Elite 체험 시작',
            'pricing-note': '모든 플랜에 7일 무료 체험 포함. 무료 플랜은 신용카드 불필요. 언제든 취소 가능.',
            // FAQ
            'faq-q1': 'AI 평가는 얼마나 정확한가요?',
            'faq-a1': 'AI 채점 엔진은 구조, 명확성, 설득력, 자신감, 관련성의 5가지 차원에서 평가하며, 모든 응답에 대해 상세하고 실행 가능한 피드백을 제공합니다. 시스템은 피드백 루프와 모델 업데이트를 통해 지속적으로 개선됩니다.',
            'faq-q2': '내 데이터는 안전하고 보호되나요?',
            'faq-a2': '물론입니다. 모든 시뮬레이션 데이터는 전송 중(TLS 1.3)과 저장 시(AES-256) 암호화됩니다. Firebase 엔터프라이즈급 보안 인프라를 사용합니다. 녹음과 대본은 제3자와 공유되거나 외부 모델 훈련에 사용되지 않습니다.',
            'faq-q3': '구독을 어떻게 관리하거나 취소하나요?',
            'faq-a3': '계정 대시보드에서 직접 구독을 관리할 수 있습니다. 클릭 한 번으로 업그레이드, 다운그레이드 또는 취소할 수 있습니다. 숨겨진 수수료 없음, 취소 위약금 없음, 취소 후 30일간 데이터 접근 가능.',
            'faq-q4': '기업 또는 팀 라이선스를 제공하나요?',
            'faq-a4': '네. 팀 관리 대시보드, 대량 할인, SSO 통합, 맞춤 시나리오 라이브러리, 전담 계정 관리가 포함된 맞춤 기업 플랜을 제공합니다. 맞춤 견적은 문의해 주세요.',
            'faq-q5': '음성 녹음이 저장되나요?',
            'faq-a5': '음성 녹음은 평가 및 전사를 위해 실시간으로 처리됩니다. 무료 및 Pro 플랜에서는 처리 후 오디오가 삭제됩니다. Elite 사용자는 리플레이 및 자기 검토를 위해 녹음 저장을 선택할 수 있습니다.',
            'faq-q6': '어떤 언어가 지원되나요?',
            'faq-a6': '현재 The Clozer는 영어, 한국어, 일본어, 스페인어에서 전체 시뮬레이션과 평가를 지원합니다. 중국어, 프랑스어, 독일어, 포르투갈어로 적극 확장 중입니다.',
            'faq-q7': '성과 추적은 어떻게 작동하나요?',
            'faq-a7': '모든 시뮬레이션은 5개 차원에서 점수를 생성합니다. 분석 대시보드에서 세션별 트렌드, 차원별 분석, 백분위 순위, 맞춤형 개선 권장 사항을 보여줍니다.',
            'faq-q8': '면접 외 시나리오에서도 The Clozer를 사용할 수 있나요?',
            'faq-a8': '네. 취업 면접 외에도 영업 통화, 연봉 협상, 투자자 피칭, 대학 입시, 고객 프레젠테이션 등 설득과 명확성이 중요한 모든 중요 대화를 지원합니다.',
            // Final CTA
            'final-cta-note': '신용카드 불필요. 30초 만에 시작.',
            // Footer
            'footer-tagline': '중요한 대화를 위한 AI 퍼포먼스 코치.',
            'footer-col1-title': '제품',
            'footer-col1-l1': '기능',
            'footer-col1-l2': '요금제',
            'footer-col1-l3': '데모',
            'footer-col1-l4': '기업용',
            'footer-col2-title': '회사',
            'footer-col2-l1': '소개',
            'footer-col2-l2': '채용',
            'footer-col2-l3': '블로그',
            'footer-contact-link': '문의',
            'footer-col3-title': '법적 고지',
            'footer-privacy-link': '개인정보 처리방침',
            'footer-terms-link': '이용약관',
            'footer-col3-l3': '쿠키 정책',
            'footer-col3-l4': 'GDPR',
            'footer-copyright': '&copy; 2026 The Clozer. 무단 전재 금지.',
            'footer-share-title': '공유하기',
        },
        ja: {
            'hero-badge-text': 'AI搭載の会話トレーニング',
            'hero-title': 'すべての会話を<br><span class="gradient-text">自信を持って締めくくる</span>',
            'hero-sub': '面接、交渉、説得を変革するAIパフォーマンスコーチ。リアルタイムシミュレーション。即時スコアリング。測定可能な改善。',
            'start-sim-text': '無料シミュレーション開始',
            'watch-demo-text': 'デモを見る',
            'how-tag': '仕組み',
            'how-title': 'マスターへの5ステップ',
            'how-sub': '初回の試みから最高のパフォーマンスまで、構造的で測定可能なフロー。',
            'step1-title': 'シナリオを選択',
            'step1-desc': '面接、営業、交渉など、業界に合わせたシナリオを選択。',
            'step1-micro': 'パーソナライズされた質問のために履歴書をアップロード',
            'step2-title': 'AIシミュレーション開始',
            'step2-desc': 'AI面接官とダイナミックな会話に参加。各セッションはユニークです。',
            'step2-micro': '適応型難易度調整',
            'step3-title': 'リアルタイム評価',
            'step3-desc': '構造、明確さ、説得力、自信、関連性のスコアがリアルタイムで更新。',
            'step3-micro': '5次元AIスコアリングエンジン',
            'step4-title': '即時詳細フィードバック',
            'step4-desc': 'すべての回答に対する実行可能なインサイトを取得。',
            'step4-micro': '弱い回答に対する改善提案',
            'step5-title': '追跡と改善',
            'step5-desc': '分析ダッシュボードで進捗を監視。',
            'step5-micro': 'マスタリーループ：卓越するまで練習',
            'features-tag': 'コア機能',
            'features-title': '最高パフォーマンスのために構築',
            'features-sub': 'すべての機能が会話マスタリーを加速。',
            'demo-tag': 'ライブデモ',
            'demo-title': 'The Clozerを体験',
            'demo-sub': '実際のシミュレーションインターフェースを体験してください。',
            'demo-hint': 'ヒント：STAR法を使用。結果を数値化してください。',
            'who-tag': '対象ユーザー',
            'who-title': 'パフォーマンスが必要なすべての人のために',
            'who-sub': '初めての就職から大型取引のクロージングまで。',
            'pricing-tag': '料金プラン',
            'pricing-title': 'パフォーマンスに投資',
            'pricing-sub': '無料で開始。準備ができたらアップグレード。',
            'toggle-monthly': '月間',
            'toggle-annual': '年間 <span class="save-badge">33%OFF</span>',
            'faq-tag': 'よくある質問',
            'faq-title': 'よくある質問',
            'final-cta-title': '自信を持って締めくくる準備はできましたか？',
            'final-cta-sub': '今日からトレーニングを始めて、会話スキルを変革しましょう。',
            'final-cta-btn': '無料シミュレーション開始',
            'auth-modal-title': 'The Clozerへようこそ',
            'leave-modal-title': 'シミュレーションを終了しますか？',
            'leave-modal-desc': '今終了すると、現在の進捗が失われます。',
            'sim-hint': 'ヒント：具体的に、数字を使い、回答を明確に構成してください。',
            _nav_signin: 'サインイン',
            _nav_signup: '新規登録',
            _leave_cancel: 'トレーニングを続ける',
            _leave_confirm: '終了',
            _scenario_modal_title: 'シナリオを選択',
            _scenario_modal_sub: 'シミュレーションを開始する会話タイプを選択。',
            _result_title: 'シミュレーション完了',
            _result_overall: '総合スコア',
            _result_dimensions: '次元別分析',
            _result_exchanges: '交換詳細',
            _result_retry: 'もう一度',
            _result_home: 'ホームへ',
            _dash_total: '合計シミュレーション',
            _dash_avg: '平均スコア',
            _dash_best: '最高スコア',
            _dash_streak: '現在の連続記録',
            _demo_signup_prompt: '詳細スコアリング付きフルシミュレーションに登録！',
            _toast_firebase: 'Firebaseが設定されていません。',
            _toast_signedin: 'サインイン成功！',
            _toast_signedout: 'サインアウトしました。',
            _toast_account_created: 'アカウント作成完了！',
            _toast_sim_saved: 'セッションがダッシュボードに保存されました。',
            // Nav
            'nav-how': '仕組み',
            'nav-features': '機能',
            'nav-demo': 'デモ',
            'nav-pricing': '料金',
            'nav-faq': 'FAQ',
            'nav-start-btn': '無料で始める',
            'nav-dashboard-text': 'ダッシュボード',
            'nav-settings-text': '設定',
            'nav-signout-text': 'サインアウト',
            'try-sim-text': '無料でフルシミュレーション体験',
            // Features
            'feat1-title': 'AI動的質問エンジン',
            'feat1-desc': '同じ面接は二度とありません。AIが目標の役職、業界、経験レベルに基づいて文脈に適した質問を生成します。',
            'feat1-li1': '回答に基づいてリアルタイムで適応',
            'feat1-li2': '行動、技術、状況別の質問をカバー',
            'feat1-li3': '業界別質問ライブラリを継続拡大',
            'feat1-bar1': '行動面接',
            'feat1-bar2': '技術面接',
            'feat1-bar3': '状況別',
            'feat1-bar4': 'フォローアップ',
            'feat2-title': '履歴書・求人票パーソナライズ',
            'feat2-desc': '履歴書と求人票をアップロード。AIがあなたの状況に合わせてすべての質問を調整します。',
            'feat2-li1': 'スキル、経験、弱点を分析',
            'feat2-li2': '役職別シナリオを生成',
            'feat2-li3': '強化すべき分野をハイライト',
            'feat3-title': '音声 & テキストシミュレーション',
            'feat3-desc': '実際の方法でトレーニング。実際の面接用の音声や、素早い練習用のテキストで練習。',
            'feat3-li1': 'リアルタイム音声テキスト変換',
            'feat3-li2': 'トーンとペースの分析',
            'feat3-li3': 'フィラーワード検出',
            'feat4-title': '多次元AIスコアリング',
            'feat4-desc': '「良い」「悪い」を超えて。5つの重要な次元で正確なスコアを取得。',
            'feat4-li1': '構造 & 組織',
            'feat4-li2': '明確性 & 表現',
            'feat4-li3': '説得力 & インパクト',
            'feat4-li4': '自信 & 伝達力',
            'feat4-li5': '関連性 & 精度',
            'feat5-title': '適応型難易度',
            'feat5-desc': 'AIがパフォーマンスに基づいて難易度を調整。簡単なものから始めて、エグゼクティブレベルのシナリオへ。',
            'feat5-li1': '3段階の難易度：基礎、上級、エリート',
            'feat5-li2': '高スコア時の自動エスカレーション',
            'feat5-li3': 'プレッシャーシミュレーションモード',
            'feat6-title': 'パフォーマンス分析',
            'feat6-desc': '重要なすべての指標を追跡。トレンドの確認、弱点の特定、成長の測定。',
            'feat6-li1': 'セッション間比較',
            'feat6-li2': '次元別トレンドチャート',
            'feat6-li3': 'エクスポート可能な進捗レポート',
            'feat7-title': 'シミュレーションリプレイ',
            'feat7-desc': '完全なトランスクリプト、スコア、AI生成の改善提案とともに過去のセッションをレビュー。',
            'feat7-li1': '回答の並列比較',
            'feat7-li2': 'AI書き直しモデル回答',
            'feat7-li3': '重要な瞬間のブックマーク',
            'feat8-title': 'マスタリーループシステム',
            'feat8-desc': '単なる練習ではなくマスター。目標スコアを一貫して達成するまでシナリオを繰り返し。',
            'feat8-li1': '個人目標スコアの設定',
            'feat8-li2': 'マスター達成で次の難易度を解放',
            'feat8-li3': '達成バッジと連続記録',
            // Scoring
            'scoring-tag': 'AIスコアリングエンジン',
            'scoring-title': '透明な5次元評価',
            'scoring-sub': 'すべての回答は独自のAIエンジンを使用して5つの重要な次元でスコアリングされます。ブラックボックスなし — 正確に自分の位置と改善点を確認。',
            // Demo
            'demo-panel-ai': 'AI面接官',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': 'シニア採用マネージャー',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': '上級',
            'demo-panel-sim': 'シミュレーション',
            'demo-panel-score': 'ライブスコア',
            'demo-score-label': '総合スコア',
            'demo-keywords-label': 'マッチしたキーワード',
            // Audience
            'aud1-title': '求職者',
            'aud1-pain': 'プレッシャーで固まったり、面接でしどろもどろになるのに疲れましたか？',
            'aud1-promise': 'すべての面接に十分なリハーサルを積んで、自信を持って、オファーを獲得する準備万端で臨みましょう。',
            'aud1-cta': '面接トレーニング開始',
            'aud2-title': '営業プロフェッショナル',
            'aud2-pain': '予期せぬ反論で取引を失っていますか？',
            'aud2-promise': 'ピッチを磨き、あらゆる反論に対応し、成約率を最大40%向上させましょう。',
            'aud2-cta': '営業トレーニング開始',
            'aud3-title': '創業者 & 経営者',
            'aud3-pain': '投資家ピッチ、取締役会プレゼン、重要な会議を完璧にこなす必要がありますか？',
            'aud3-promise': '最高レベルでエグゼクティブプレゼンスと説得力を磨きましょう。',
            'aud3-cta': 'エグゼクティブトレーニング開始',
            'aud4-title': '学生',
            'aud4-pain': '初めての本番面接や大学入試が不安ですか？',
            'aud4-promise': '本番前にガイド付き練習で揺るぎない自信を築きましょう。',
            'aud4-cta': '学生トレーニング開始',
            'aud5-title': '交渉学習者',
            'aud5-pain': '交渉の仕方がわからず、お金を逃していますか？',
            'aud5-promise': '実証済みのフレームワークを学び、交渉が自然に感じるまで練習しましょう。',
            'aud5-cta': '交渉トレーニング開始',
            // Pricing
            'price-free-tier': '無料',
            'price-free-period': '/月',
            'price-free-desc': 'プラットフォームを始めて体験しましょう。',
            'price-free-f1': '月3回のシミュレーション',
            'price-free-f2': 'テキストベースシミュレーション',
            'price-free-f3': '基本AIフィードバック',
            'price-free-f4': '3つのシナリオタイプ',
            'price-free-f5': '音声シミュレーション',
            'price-free-f6': '履歴書パーソナライズ',
            'price-free-f7': '分析ダッシュボード',
            'price-free-cta': '無料で始める',
            'price-pro-popular': '最も人気',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/月',
            'price-pro-desc': '真剣な準備と着実な向上のために。',
            'price-pro-f1': '無制限シミュレーション',
            'price-pro-f2': '音声 + テキストシミュレーション',
            'price-pro-f3': '高度なAIフィードバック',
            'price-pro-f4': 'すべてのシナリオタイプ',
            'price-pro-f5': '履歴書 & JDアップロード',
            'price-pro-f6': 'パフォーマンス分析',
            'price-pro-f7': '優先AI処理',
            'price-pro-cta': 'Proトライアル開始',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/月',
            'price-elite-desc': '最大の準備で最大の成果を。',
            'price-elite-f1': 'Proのすべてを含む',
            'price-elite-f2': '優先AI処理',
            'price-elite-f3': '感情トーン検出',
            'price-elite-f4': '交渉戦略スコアリング',
            'price-elite-f5': 'パーソナライズ改善ロードマップ',
            'price-elite-f6': 'AIパフォーマンスランキング',
            'price-elite-f7': 'プレミアムオンボーディング',
            'price-elite-cta': 'Eliteトライアル開始',
            'pricing-note': 'すべてのプランに7日間の無料トライアル付き。無料プランはクレジットカード不要。いつでもキャンセル可能。',
            // FAQ
            'faq-q1': 'AI評価はどの程度正確ですか？',
            'faq-a1': 'AIスコアリングエンジンは構造、明確性、説得力、自信、関連性の5つの次元で評価し、すべての回答に対して詳細で実行可能なフィードバックを提供します。システムはフィードバックループとモデル更新を通じて継続的に改善されます。',
            'faq-q2': 'データは安全に保護されていますか？',
            'faq-a2': 'もちろんです。すべてのシミュレーションデータは転送中（TLS 1.3）と保存時（AES-256）に暗号化されています。Firebaseエンタープライズグレードのセキュリティインフラを使用しています。録音やトランスクリプトは第三者と共有されたり、外部モデルのトレーニングに使用されることはありません。',
            'faq-q3': 'サブスクリプションの管理やキャンセルはどうしますか？',
            'faq-a3': 'アカウントダッシュボードから直接サブスクリプションを管理できます。ワンクリックでアップグレード、ダウングレード、キャンセルが可能です。隠れた手数料なし、キャンセルペナルティなし、キャンセル後30日間データにアクセス可能。',
            'faq-q4': 'エンタープライズやチームライセンスはありますか？',
            'faq-a4': 'はい。チーム管理ダッシュボード、一括価格設定、SSO統合、カスタムシナリオライブラリ、専任アカウント管理を含むカスタムエンタープライズプランを提供しています。お見積もりはお問い合わせください。',
            'faq-q5': '音声録音は保存されますか？',
            'faq-a5': '音声録音は評価とトランスクリプションのためにリアルタイムで処理されます。無料およびProプランでは、処理後にオーディオが削除されます。Eliteユーザーはリプレイと自己レビューのために録音を保存することを選択できます。',
            'faq-q6': 'どの言語がサポートされていますか？',
            'faq-a6': '現在、The Clozerは英語、韓国語、日本語、スペイン語でフルシミュレーションと評価をサポートしています。中国語、フランス語、ドイツ語、ポルトガル語に積極的に拡大中です。',
            'faq-q7': 'パフォーマンス追跡はどう機能しますか？',
            'faq-a7': 'すべてのシミュレーションは5つの次元でスコアを生成します。分析ダッシュボードはセッション間のトレンド、次元別の内訳、パーセンタイルランキング、パーソナライズされた改善推奨事項を表示します。',
            'faq-q8': '面接以外のシナリオでもThe Clozerを使えますか？',
            'faq-a8': 'はい。就職面接以外にも、営業コール、給与交渉、投資家ピッチ、大学入試、クライアントプレゼンテーション、説得力と明確性が重要なあらゆる重要な会話をサポートします。',
            // Final CTA
            'final-cta-note': 'クレジットカード不要。30秒で開始。',
            // Footer
            'footer-tagline': '重要な会話のためのAIパフォーマンスコーチ。',
            'footer-col1-title': '製品',
            'footer-col1-l1': '機能',
            'footer-col1-l2': '料金',
            'footer-col1-l3': 'デモ',
            'footer-col1-l4': 'エンタープライズ',
            'footer-col2-title': '会社',
            'footer-col2-l1': '会社概要',
            'footer-col2-l2': '採用情報',
            'footer-col2-l3': 'ブログ',
            'footer-contact-link': 'お問い合わせ',
            'footer-col3-title': '法的情報',
            'footer-privacy-link': 'プライバシーポリシー',
            'footer-terms-link': '利用規約',
            'footer-col3-l3': 'クッキーポリシー',
            'footer-col3-l4': 'GDPR',
            'footer-copyright': '&copy; 2026 The Clozer. 無断複製禁止。',
            'footer-share-title': 'シェアする',
        },
        es: {
            'hero-badge-text': 'Entrenamiento de Conversaciones con IA',
            'hero-title': 'Cierra Cada Conversacion<br><span class="gradient-text">Con Confianza</span>',
            'hero-sub': 'El coach de rendimiento con IA que transforma tus entrevistas, negociaciones y persuasion. Simulacion en tiempo real. Puntuacion instantanea. Mejora medible.',
            'start-sim-text': 'Simulacion Gratuita',
            'watch-demo-text': 'Ver Demo',
            'how-tag': 'Como Funciona',
            'how-title': 'Cinco Pasos Hacia el Dominio',
            'how-sub': 'Del primer intento al maximo rendimiento en un flujo estructurado y medible.',
            'step1-title': 'Elige Tu Escenario',
            'step1-desc': 'Selecciona entre entrevistas, ventas, negociaciones o escenarios personalizados.',
            'step1-micro': 'Sube tu curriculum para preguntas personalizadas',
            'step2-title': 'Inicia la Simulacion con IA',
            'step2-desc': 'Participa en una conversacion dinamica con nuestro entrevistador IA.',
            'step2-micro': 'Dificultad adaptativa segun tu nivel',
            'step3-title': 'Evaluacion en Tiempo Real',
            'step3-desc': 'Observa tus puntuaciones actualizarse en estructura, claridad, persuasion, confianza y relevancia.',
            'step3-micro': 'Motor de puntuacion IA de 5 dimensiones',
            'step4-title': 'Retroalimentacion Detallada Instantanea',
            'step4-desc': 'Obtiene informacion accionable sobre cada respuesta.',
            'step4-micro': 'Reescrituras sugeridas para respuestas debiles',
            'step5-title': 'Rastrea y Mejora',
            'step5-desc': 'Monitorea tu progreso con paneles analiticos.',
            'step5-micro': 'Bucle de maestria: practica hasta sobresalir',
            'features-tag': 'Funciones Principales',
            'features-title': 'Disenado para el Maximo Rendimiento',
            'features-sub': 'Cada funcion esta disenada para acelerar tu dominio conversacional.',
            'demo-tag': 'Demo en Vivo',
            'demo-title': 'Mira The Clozer en Accion',
            'demo-sub': 'Experimenta una interfaz de simulacion real. Pruebalo tu mismo.',
            'demo-hint': 'Consejo: Usa el metodo STAR. Cuantifica tus resultados.',
            'who-tag': 'Para Quien Es',
            'who-title': 'Para Cualquiera Que Necesite Rendir',
            'who-sub': 'Ya sea tu primer empleo o un trato de un millon de dolares.',
            'pricing-tag': 'Precios',
            'pricing-title': 'Invierte en Tu Rendimiento',
            'pricing-sub': 'Comienza gratis. Mejora cuando estes listo.',
            'toggle-monthly': 'Mensual',
            'toggle-annual': 'Anual <span class="save-badge">Ahorra 33%</span>',
            'faq-tag': 'Preguntas Frecuentes',
            'faq-title': 'Preguntas Frecuentes',
            'final-cta-title': 'Listo para Cerrar con Confianza?',
            'final-cta-sub': 'Comienza a entrenar hoy y transforma tus habilidades de conversacion.',
            'final-cta-btn': 'Inicia Tu Simulacion Gratis',
            'auth-modal-title': 'Bienvenido a The Clozer',
            'leave-modal-title': 'Salir de la simulacion?',
            'leave-modal-desc': 'Tu progreso actual se perdera si sales ahora.',
            'sim-hint': 'Consejo: Se especifico, usa numeros y estructura tu respuesta claramente.',
            _nav_signin: 'Iniciar Sesion',
            _nav_signup: 'Registrarse',
            _leave_cancel: 'Continuar Entrenando',
            _leave_confirm: 'Salir',
            _scenario_modal_title: 'Elige Tu Escenario',
            _scenario_modal_sub: 'Selecciona un tipo de conversacion para comenzar.',
            _result_title: 'Simulacion Completa',
            _result_overall: 'Puntuacion General',
            _result_dimensions: 'Desglose por Dimension',
            _result_exchanges: 'Detalles del Intercambio',
            _result_retry: 'Intentar de Nuevo',
            _result_home: 'Volver al Inicio',
            _dash_total: 'Simulaciones Totales',
            _dash_avg: 'Puntuacion Promedio',
            _dash_best: 'Mejor Puntuacion',
            _dash_streak: 'Racha Actual',
            _demo_signup_prompt: 'Registrate para una simulacion completa con puntuacion detallada!',
            _toast_firebase: 'Firebase no configurado.',
            _toast_signedin: 'Sesion iniciada correctamente!',
            _toast_signedout: 'Sesion cerrada.',
            _toast_account_created: 'Cuenta creada!',
            _toast_sim_saved: 'Sesion guardada en tu panel.',
            // Nav
            'nav-how': 'Como Funciona',
            'nav-features': 'Funciones',
            'nav-demo': 'Demo',
            'nav-pricing': 'Precios',
            'nav-faq': 'FAQ',
            'nav-start-btn': 'Empezar Gratis',
            'nav-dashboard-text': 'Panel',
            'nav-settings-text': 'Ajustes',
            'nav-signout-text': 'Cerrar Sesion',
            'try-sim-text': 'Prueba una Simulacion Completa Gratis',
            // Features
            'feat1-title': 'Motor de Preguntas Dinamicas con IA',
            'feat1-desc': 'Nunca enfrentes la misma entrevista dos veces. Nuestra IA genera preguntas contextualmente relevantes basadas en tu rol objetivo, industria y nivel de experiencia.',
            'feat1-li1': 'Se adapta en tiempo real segun tus respuestas',
            'feat1-li2': 'Cubre preguntas conductuales, tecnicas y situacionales',
            'feat1-li3': 'Biblioteca de preguntas en crecimiento por industria',
            'feat1-bar1': 'Conductual',
            'feat1-bar2': 'Tecnica',
            'feat1-bar3': 'Situacional',
            'feat1-bar4': 'Seguimiento',
            'feat2-title': 'Personalizacion de CV y JD',
            'feat2-desc': 'Sube tu curriculum y descripcion del puesto. La IA adapta cada pregunta a tu situacion exacta.',
            'feat2-li1': 'Analiza habilidades, experiencia y brechas',
            'feat2-li2': 'Genera escenarios especificos del rol',
            'feat2-li3': 'Destaca areas a fortalecer',
            'feat3-title': 'Simulacion por Voz y Texto',
            'feat3-desc': 'Entrena como lo haras. Practica por voz para entrevistas reales o por texto para ejercicios rapidos.',
            'feat3-li1': 'Conversion voz a texto en tiempo real',
            'feat3-li2': 'Analisis de tono y ritmo',
            'feat3-li3': 'Deteccion de muletillas',
            'feat4-title': 'Puntuacion IA Multidimensional',
            'feat4-desc': 'Ve mas alla de "bien" o "mal." Obtiene puntuaciones precisas en cinco dimensiones criticas.',
            'feat4-li1': 'Estructura y Organizacion',
            'feat4-li2': 'Claridad y Articulacion',
            'feat4-li3': 'Persuasion e Impacto',
            'feat4-li4': 'Confianza y Entrega',
            'feat4-li5': 'Relevancia y Precision',
            'feat5-title': 'Dificultad Adaptativa',
            'feat5-desc': 'La IA ajusta el nivel de desafio segun tu rendimiento. Comienza facil, gradua a escenarios de nivel ejecutivo.',
            'feat5-li1': '3 niveles de dificultad: Base, Avanzado, Elite',
            'feat5-li2': 'Escalamiento automatico con puntajes altos',
            'feat5-li3': 'Modo de simulacion bajo presion',
            'feat6-title': 'Analiticas de Rendimiento',
            'feat6-desc': 'Rastrea cada metrica que importa. Ve tendencias, identifica debilidades y mide tu crecimiento.',
            'feat6-li1': 'Comparacion sesion a sesion',
            'feat6-li2': 'Graficos de tendencia por dimension',
            'feat6-li3': 'Reportes de progreso exportables',
            'feat7-title': 'Replay de Simulacion',
            'feat7-desc': 'Revisa cualquier sesion pasada con transcripcion completa, puntuaciones y sugerencias de mejora generadas por IA.',
            'feat7-li1': 'Comparacion lado a lado de respuestas',
            'feat7-li2': 'Respuestas modelo reescritas por IA',
            'feat7-li3': 'Marcar momentos clave',
            'feat8-title': 'Sistema de Bucle de Maestria',
            'feat8-desc': 'No solo practiques. Domina. Repite escenarios hasta alcanzar consistentemente tu umbral de puntaje objetivo.',
            'feat8-li1': 'Establece objetivos de puntaje personales',
            'feat8-li2': 'Desbloquea la siguiente dificultad al dominar',
            'feat8-li3': 'Insignias de logro y rachas',
            // Scoring
            'scoring-tag': 'Motor de Puntuacion IA',
            'scoring-title': 'Evaluacion Transparente de 5 Dimensiones',
            'scoring-sub': 'Cada respuesta se puntua en cinco dimensiones criticas usando nuestro motor de IA propietario. Sin cajas negras — ve exactamente donde estas y que mejorar.',
            // Demo
            'demo-panel-ai': 'Entrevistador IA',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': 'Gerente Senior de Contratacion',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': 'Avanzado',
            'demo-panel-sim': 'Simulacion',
            'demo-panel-score': 'Puntaje en Vivo',
            'demo-score-label': 'Puntaje General',
            'demo-keywords-label': 'Palabras Clave Encontradas',
            // Audience
            'aud1-title': 'Buscadores de Empleo',
            'aud1-pain': 'Cansado de congelarte bajo presion y tropezar en las entrevistas?',
            'aud1-promise': 'Entra a cada entrevista completamente ensayado, con confianza y listo para cerrar la oferta.',
            'aud1-cta': 'Iniciar Entrenamiento de Entrevistas',
            'aud2-title': 'Profesionales de Ventas',
            'aud2-pain': 'Perdiendo tratos porque las objeciones te toman desprevenido?',
            'aud2-promise': 'Perfecciona tu presentacion, maneja cualquier objecion y aumenta tu tasa de cierre hasta un 40%.',
            'aud2-cta': 'Iniciar Entrenamiento de Ventas',
            'aud3-title': 'Fundadores y Ejecutivos',
            'aud3-pain': 'Necesitas dominar pitch a inversores, presentaciones de junta y reuniones de alto impacto?',
            'aud3-promise': 'Refina tu presencia ejecutiva y habilidades de persuasion al mas alto nivel.',
            'aud3-cta': 'Iniciar Entrenamiento Ejecutivo',
            'aud4-title': 'Estudiantes',
            'aud4-pain': 'Ansioso por tu primera entrevista real o admision universitaria?',
            'aud4-promise': 'Construye una confianza inquebrantable con practica guiada antes de que cuente.',
            'aud4-cta': 'Iniciar Entrenamiento Estudiantil',
            'aud5-title': 'Aprendices de Negociacion',
            'aud5-pain': 'Dejando dinero sobre la mesa porque no sabes negociar?',
            'aud5-promise': 'Aprende marcos probados y practicalos hasta que negociar se sienta natural.',
            'aud5-cta': 'Iniciar Entrenamiento de Negociacion',
            // Pricing
            'price-free-tier': 'Gratis',
            'price-free-period': '/mes',
            'price-free-desc': 'Comienza y experimenta la plataforma.',
            'price-free-f1': '3 simulaciones por mes',
            'price-free-f2': 'Simulacion basada en texto',
            'price-free-f3': 'Retroalimentacion basica de IA',
            'price-free-f4': '3 tipos de escenario',
            'price-free-f5': 'Simulacion por voz',
            'price-free-f6': 'Personalizacion de curriculum',
            'price-free-f7': 'Panel de analiticas',
            'price-free-cta': 'Comenzar Gratis',
            'price-pro-popular': 'Mas Popular',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/mes',
            'price-pro-desc': 'Para preparacion seria y mejora constante.',
            'price-pro-f1': 'Simulaciones ilimitadas',
            'price-pro-f2': 'Simulacion voz + texto',
            'price-pro-f3': 'Retroalimentacion IA avanzada',
            'price-pro-f4': 'Todos los tipos de escenario',
            'price-pro-f5': 'Carga de CV y JD',
            'price-pro-f6': 'Analiticas de rendimiento',
            'price-pro-f7': 'Procesamiento IA prioritario',
            'price-pro-cta': 'Iniciar Prueba Pro',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/mes',
            'price-elite-desc': 'Maxima preparacion para lo que mas importa.',
            'price-elite-f1': 'Todo en Pro incluido',
            'price-elite-f2': 'Procesamiento IA prioritario',
            'price-elite-f3': 'Deteccion de tono emocional',
            'price-elite-f4': 'Puntuacion de estrategia de negociacion',
            'price-elite-f5': 'Hoja de ruta de mejora personalizada',
            'price-elite-f6': 'Ranking de rendimiento IA',
            'price-elite-f7': 'Onboarding premium',
            'price-elite-cta': 'Iniciar Prueba Elite',
            'pricing-note': 'Todos los planes incluyen 7 dias de prueba gratis. No se requiere tarjeta para el plan Gratis. Cancela cuando quieras.',
            // FAQ
            'faq-q1': 'Que tan precisa es la evaluacion de IA?',
            'faq-a1': 'Nuestro motor de puntuacion IA evalua en 5 dimensiones — estructura, claridad, persuasion, confianza y relevancia — proporcionando retroalimentacion detallada y accionable en cada respuesta. El sistema mejora continuamente a traves de ciclos de retroalimentacion y actualizaciones de modelo.',
            'faq-q2': 'Mis datos estan seguros y protegidos?',
            'faq-a2': 'Absolutamente. Todos los datos de simulacion estan encriptados en transito (TLS 1.3) y en reposo (AES-256). Usamos infraestructura de seguridad de nivel empresarial de Firebase. Tus grabaciones y transcripciones nunca se comparten con terceros ni se usan para entrenar modelos externos.',
            'faq-q3': 'Como gestiono o cancelo mi suscripcion?',
            'faq-a3': 'Puedes gestionar tu suscripcion directamente desde tu panel de cuenta. Actualiza, reduce o cancela con un clic. Sin cargos ocultos, sin penalizaciones por cancelacion, y tus datos permanecen accesibles por 30 dias despues de la cancelacion.',
            'faq-q4': 'Ofrecen licencias empresariales o de equipo?',
            'faq-a4': 'Si. Ofrecemos planes empresariales personalizados con paneles de gestion de equipos, precios por volumen, integracion SSO, bibliotecas de escenarios personalizados y gestion de cuentas dedicada. Contactanos para una cotizacion personalizada.',
            'faq-q5': 'Se almacenan las grabaciones de voz?',
            'faq-a5': 'Las grabaciones de voz se procesan en tiempo real para evaluacion y transcripcion. En los planes Gratis y Pro, el audio se elimina despues del procesamiento. Los usuarios Elite pueden optar por guardar las grabaciones para reproduccion y auto-revision.',
            'faq-q6': 'Que idiomas son compatibles?',
            'faq-a6': 'Actualmente, The Clozer soporta simulacion y evaluacion completa en ingles, coreano, japones y espanol. Estamos expandiendo activamente a mandarin, frances, aleman y portugues.',
            'faq-q7': 'Como funciona el seguimiento de rendimiento?',
            'faq-a7': 'Cada simulacion genera puntuaciones en 5 dimensiones. Tu panel de analiticas muestra tendencias sesion a sesion, desgloses por dimension, rankings de percentil y recomendaciones de mejora personalizadas.',
            'faq-q8': 'Puedo usar The Clozer para escenarios que no sean entrevistas?',
            'faq-a8': 'Si. Mas alla de entrevistas de trabajo, The Clozer soporta llamadas de ventas, negociaciones salariales, pitch a inversores, admisiones universitarias, presentaciones a clientes y cualquier conversacion de alto impacto donde la persuasion y la claridad importan.',
            // Final CTA
            'final-cta-note': 'No se requiere tarjeta de credito. Comienza en 30 segundos.',
            // Footer
            'footer-tagline': 'El Coach de Rendimiento IA para Conversaciones de Alto Impacto.',
            'footer-col1-title': 'Producto',
            'footer-col1-l1': 'Funciones',
            'footer-col1-l2': 'Precios',
            'footer-col1-l3': 'Demo',
            'footer-col1-l4': 'Empresas',
            'footer-col2-title': 'Empresa',
            'footer-col2-l1': 'Acerca de',
            'footer-col2-l2': 'Carreras',
            'footer-col2-l3': 'Blog',
            'footer-contact-link': 'Contacto',
            'footer-col3-title': 'Legal',
            'footer-privacy-link': 'Politica de Privacidad',
            'footer-terms-link': 'Terminos de Servicio',
            'footer-col3-l3': 'Politica de Cookies',
            'footer-col3-l4': 'GDPR',
            'footer-copyright': '&copy; 2026 The Clozer. Todos los derechos reservados.',
            'footer-share-title': 'Compartir',
        },
        zh: {
            'hero-badge-text': 'AI 驱动的对话训练',
            'hero-title': '自信地结束<br><span class="gradient-text">每一次对话</span>',
            'hero-sub': '改变你的面试、谈判和说服方式的AI表现教练。实时模拟。即时评分。可衡量的进步。',
            'start-sim-text': '免费模拟开始',
            'watch-demo-text': '观看演示',
            'how-tag': '工作原理',
            'how-title': '掌握的五个步骤',
            'how-sub': '从第一次尝试到最佳表现的结构化、可衡量的流程。',
            'step1-title': '选择场景',
            'step1-desc': '从职场面试、销售通话、谈判或行业定制场景中选择。',
            'step1-micro': '上传简历获得个性化问题',
            'step2-title': '开始AI模拟',
            'step2-desc': '通过语音或文字与AI面试官进行动态对话。每次会话都是独特的。',
            'step2-micro': '自适应难度调整',
            'step3-title': '实时评估',
            'step3-desc': '实时查看结构、清晰度、说服力、自信心和相关性的得分更新。',
            'step3-micro': '5维AI评分引擎',
            'step4-title': '即时详细反馈',
            'step4-desc': '获取每个回答的可执行洞察：什么有效、什么无效，以及如何改进。',
            'step4-micro': '针对弱项的改写建议',
            'step5-title': '跟踪与提升',
            'step5-desc': '通过分析仪表板监控进度。重复练习直到达到目标分数。',
            'step5-micro': '掌握循环：练习直到卓越',
            'features-tag': '核心功能',
            'features-title': '为卓越表现而构建',
            'features-sub': '每项功能都旨在加速你的对话掌握。',
            'demo-tag': '实时演示',
            'demo-title': '体验 The Clozer',
            'demo-sub': '体验真实的模拟界面。亲自试试。',
            'demo-hint': '提示：使用STAR方法。量化你的结果。',
            'who-tag': '适合人群',
            'who-title': '为需要表现的每个人而构建',
            'who-sub': '无论是找第一份工作还是达成百万美元交易。',
            'pricing-tag': '定价',
            'pricing-title': '投资于你的表现',
            'pricing-sub': '免费开始。准备好时再升级。',
            'toggle-monthly': '月付',
            'toggle-annual': '年付 <span class="save-badge">节省33%</span>',
            'faq-tag': '常见问题',
            'faq-title': '常见问题',
            'final-cta-title': '准备好自信地结束每次对话了吗？',
            'final-cta-sub': '今天开始训练，改变你的对话技巧。',
            'final-cta-btn': '开始免费模拟',
            'auth-modal-title': '欢迎来到 The Clozer',
            'leave-modal-title': '退出模拟？',
            'leave-modal-desc': '如果现在离开，当前进度将丢失。',
            'sim-hint': '提示：具体一点，使用数字，清晰地组织你的回答。',
            _nav_signin: '登录',
            _nav_signup: '注册',
            _leave_cancel: '继续训练',
            _leave_confirm: '离开',
            _scenario_modal_title: '选择你的场景',
            _scenario_modal_sub: '选择对话类型开始模拟。',
            _result_title: '模拟完成',
            _result_overall: '综合得分',
            _result_dimensions: '维度分析',
            _result_exchanges: '交流详情',
            _result_retry: '再试一次',
            _result_home: '返回首页',
            _dash_total: '总模拟次数',
            _dash_avg: '平均得分',
            _dash_best: '最高得分',
            _dash_streak: '当前连续记录',
            _demo_signup_prompt: '注册获得带详细评分的完整模拟！',
            _toast_firebase: 'Firebase未配置。',
            _toast_signedin: '登录成功！',
            _toast_signedout: '已退出登录。',
            _toast_account_created: '账户创建成功！',
            _toast_sim_saved: '会话已保存到仪表板。',
            'nav-how': '工作原理',
            'nav-features': '功能',
            'nav-demo': '演示',
            'nav-pricing': '定价',
            'nav-faq': '常见问题',
            'nav-start-btn': '免费开始',
            'nav-dashboard-text': '仪表板',
            'nav-settings-text': '设置',
            'nav-signout-text': '退出登录',
            'try-sim-text': '免费体验完整模拟',
            'feat1-title': 'AI动态问题引擎',
            'feat1-desc': '永远不会面对相同的面试。我们的AI根据你的目标职位、行业和经验水平生成上下文相关的问题。',
            'feat1-li1': '根据你的回答实时调整',
            'feat1-li2': '涵盖行为、技术和情境问题',
            'feat1-li3': '不断扩展的行业问题库',
            'feat1-bar1': '行为',
            'feat1-bar2': '技术',
            'feat1-bar3': '情境',
            'feat1-bar4': '跟进',
            'feat2-title': '简历与职位描述个性化',
            'feat2-desc': '上传你的简历和职位描述。AI针对你的具体情况定制每个问题。',
            'feat2-li1': '解析技能、经验和差距',
            'feat2-li2': '生成职位特定场景',
            'feat2-li3': '突出需要加强的领域',
            'feat3-title': '语音与文字模拟',
            'feat3-desc': '以你将要表现的方式训练。通过语音练习真实面试或通过文字快速练习。',
            'feat3-li1': '实时语音转文字',
            'feat3-li2': '语调和语速分析',
            'feat3-li3': '口头禅检测',
            'feat4-title': '多维AI评分',
            'feat4-desc': '超越"好"或"差"。在五个关键维度获得精确分数。',
            'feat4-li1': '结构与组织',
            'feat4-li2': '清晰度与表达',
            'feat4-li3': '说服力与影响力',
            'feat4-li4': '自信心与表现',
            'feat4-li5': '相关性与准确性',
            'feat5-title': '自适应难度',
            'feat5-desc': 'AI根据你的表现调整挑战级别。从简单开始，逐步达到高管级别场景。',
            'feat5-li1': '3个难度等级：基础、进阶、精英',
            'feat5-li2': '高分时自动升级',
            'feat5-li3': '压力模拟模式',
            'feat6-title': '表现分析',
            'feat6-desc': '追踪每一个重要指标。查看趋势、识别弱点、衡量成长。',
            'feat6-li1': '会话间比较',
            'feat6-li2': '维度级趋势图',
            'feat6-li3': '可导出的进度报告',
            'feat7-title': '模拟回放',
            'feat7-desc': '查看任何过去的会话，包含完整记录、得分和AI生成的改进建议。',
            'feat7-li1': '答案并排比较',
            'feat7-li2': 'AI重写的模范答案',
            'feat7-li3': '书签关键时刻',
            'feat8-title': '掌握循环系统',
            'feat8-desc': '不只是练习。而是掌握。重复场景直到持续达到目标分数阈值。',
            'feat8-li1': '设置个人目标分数',
            'feat8-li2': '掌握后解锁下一难度',
            'feat8-li3': '成就徽章和连续记录',
            'scoring-tag': 'AI评分引擎',
            'scoring-title': '透明的5维评估',
            'scoring-sub': '每个回答都使用我们专有的AI引擎在五个关键维度评分。没有黑箱——清楚地看到你的位置和需要改进的地方。',
            'demo-panel-ai': 'AI面试官',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': '高级招聘经理',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': '进阶',
            'demo-panel-sim': '模拟',
            'demo-panel-score': '实时得分',
            'demo-score-label': '综合得分',
            'demo-keywords-label': '匹配关键词',
            'aud1-title': '求职者',
            'aud1-pain': '厌倦了在压力下僵住和在面试中磕磕绊绊吗？',
            'aud1-promise': '充分准备好进入每次面试，自信满满，随时准备好拿到录用通知。',
            'aud1-cta': '开始面试训练',
            'aud2-title': '销售专业人员',
            'aud2-pain': '因为被异议打得措手不及而失去交易吗？',
            'aud2-promise': '磨练你的演讲，处理任何异议，将成交率提高40%。',
            'aud2-cta': '开始销售训练',
            'aud3-title': '创始人和高管',
            'aud3-pain': '需要搞定投资者路演、董事会演示和高风险会议吗？',
            'aud3-promise': '在最高水平磨练你的高管气场和说服技巧。',
            'aud3-cta': '开始高管训练',
            'aud4-title': '学生',
            'aud4-pain': '对第一次真正的面试或大学录取感到焦虑吗？',
            'aud4-promise': '在关键时刻前通过引导练习建立不可动摇的自信。',
            'aud4-cta': '开始学生训练',
            'aud5-title': '谈判学习者',
            'aud5-pain': '因不知道如何谈判而让钱溜走吗？',
            'aud5-promise': '学习经过验证的框架，练习直到谈判感觉自然。',
            'aud5-cta': '开始谈判训练',
            'price-free-tier': '免费',
            'price-free-period': '/月',
            'price-free-desc': '开始体验平台。',
            'price-free-f1': '每月3次模拟',
            'price-free-f2': '文字模拟',
            'price-free-f3': '基础AI反馈',
            'price-free-f4': '3种场景类型',
            'price-free-f5': '语音模拟',
            'price-free-f6': '简历个性化',
            'price-free-f7': '分析仪表板',
            'price-free-cta': '免费开始',
            'price-pro-popular': '最受欢迎',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/月',
            'price-pro-desc': '为认真准备和持续进步而设。',
            'price-pro-f1': '无限模拟',
            'price-pro-f2': '语音+文字模拟',
            'price-pro-f3': '高级AI反馈',
            'price-pro-f4': '所有场景类型',
            'price-pro-f5': '简历和JD上传',
            'price-pro-f6': '表现分析',
            'price-pro-f7': '优先AI处理',
            'price-pro-cta': '开始Pro试用',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/月',
            'price-elite-desc': '最大准备迎接最大挑战。',
            'price-elite-f1': 'Pro的所有功能',
            'price-elite-f2': '优先AI处理',
            'price-elite-f3': '情感语调检测',
            'price-elite-f4': '谈判策略评分',
            'price-elite-f5': '个性化改进路线图',
            'price-elite-f6': 'AI表现排名',
            'price-elite-f7': '高端入职服务',
            'price-elite-cta': '开始Elite试用',
            'pricing-note': '所有方案包含7天免费试用。免费方案无需信用卡。随时可取消。',
            'faq-q1': 'AI评估有多准确？',
            'faq-a1': '我们的AI评分引擎在5个维度评估——结构、清晰度、说服力、自信心和相关性——为每个回答提供详细、可执行的反馈。系统通过反馈循环和模型更新持续改进。',
            'faq-q2': '我的数据安全吗？',
            'faq-a2': '当然。所有模拟数据在传输（TLS 1.3）和存储（AES-256）时均加密。我们使用Firebase企业级安全基础设施。你的录音和记录不会与第三方共享或用于训练外部模型。',
            'faq-q3': '如何管理或取消订阅？',
            'faq-a3': '你可以直接从账户仪表板管理订阅。一键升级、降级或取消。没有隐藏费用，没有取消罚款，取消后30天内仍可访问数据。',
            'faq-q4': '是否提供企业或团队许可？',
            'faq-a4': '是的。我们提供自定义企业方案，包含团队管理仪表板、批量定价、SSO集成、自定义场景库和专属账户管理。请联系我们获取定制报价。',
            'faq-q5': '语音录音会被保存吗？',
            'faq-a5': '语音录音实时处理用于评估和转录。在免费和Pro方案中，处理后音频会被删除。Elite用户可以选择保存录音以供回放和自我回顾。',
            'faq-q6': '支持哪些语言？',
            'faq-a6': '目前，The Clozer支持英语、韩语、日语、西班牙语、中文、法语和葡萄牙语的完整模拟和评估。',
            'faq-q7': '表现跟踪如何工作？',
            'faq-a7': '每次模拟在5个维度生成得分。你的分析仪表板显示会话间趋势、维度级分析、百分位排名和个性化改进建议。',
            'faq-q8': '可以将The Clozer用于非面试场景吗？',
            'faq-a8': '是的。除职场面试外，The Clozer还支持销售通话、薪资谈判、投资者路演、大学录取、客户演示以及任何说服力和清晰度重要的高风险对话。',
            'final-cta-note': '无需信用卡。30秒内开始。',
            'footer-tagline': '高风险对话的AI表现教练。',
            'footer-col1-title': '产品',
            'footer-col1-l1': '功能',
            'footer-col1-l2': '定价',
            'footer-col1-l3': '演示',
            'footer-col1-l4': '企业',
            'footer-col2-title': '公司',
            'footer-col2-l1': '关于我们',
            'footer-col2-l2': '招聘',
            'footer-col2-l3': '博客',
            'footer-contact-link': '联系我们',
            'footer-col3-title': '法律',
            'footer-privacy-link': '隐私政策',
            'footer-terms-link': '服务条款',
            'footer-col3-l3': 'Cookie政策',
            'footer-col3-l4': 'GDPR',
            'footer-copyright': '&copy; 2026 The Clozer. 版权所有。',
            'footer-share-title': '分享',
        },
        fr: {
            'hero-badge-text': 'Formation aux Conversations par IA',
            'hero-title': 'Concluez Chaque Conversation<br><span class="gradient-text">Avec Confiance</span>',
            'hero-sub': 'Le coach de performance IA qui transforme vos entretiens, négociations et persuasion. Simulation en temps réel. Score instantané. Amélioration mesurable.',
            'start-sim-text': 'Simulation Gratuite',
            'watch-demo-text': 'Voir la Démo',
            'how-tag': 'Comment ça Marche',
            'how-title': 'Cinq Étapes vers la Maîtrise',
            'how-sub': 'Du premier essai aux performances maximales dans un flux structuré et mesurable.',
            'step1-title': 'Choisissez votre Scénario',
            'step1-desc': 'Sélectionnez parmi des entretiens, appels de vente, négociations ou scénarios personnalisés.',
            'step1-micro': 'Téléchargez votre CV pour des questions personnalisées',
            'step2-title': 'Lancez la Simulation IA',
            'step2-desc': 'Participez à une conversation dynamique avec notre intervieweur IA via voix ou texte.',
            'step2-micro': 'Difficulté adaptative selon votre niveau',
            'step3-title': 'Évaluation en Temps Réel',
            'step3-desc': 'Regardez vos scores se mettre à jour en direct : structure, clarté, persuasion, confiance et pertinence.',
            'step3-micro': 'Moteur de notation IA à 5 dimensions',
            'step4-title': 'Retour Détaillé Instantané',
            'step4-desc': "Obtenez des insights actionnables sur chaque réponse : ce qui a fonctionné, ce qui n'a pas marché et comment s'améliorer.",
            'step4-micro': 'Réécriture suggérée pour les réponses faibles',
            'step5-title': 'Suivez et Améliorez',
            'step5-desc': "Surveillez vos progrès avec des tableaux de bord analytiques. Répétez jusqu'à atteindre votre score cible.",
            'step5-micro': "Boucle de maîtrise : entraînez-vous jusqu'à exceller",
            'features-tag': 'Fonctionnalités Principales',
            'features-title': 'Conçu pour la Performance Maximale',
            'features-sub': 'Chaque fonctionnalité est conçue pour accélérer votre maîtrise conversationnelle.',
            'demo-tag': 'Démo en Direct',
            'demo-title': 'Découvrez The Clozer en Action',
            'demo-sub': 'Expérimentez une interface de simulation réelle. Essayez vous-même.',
            'demo-hint': 'Conseil : Utilisez la méthode STAR. Quantifiez vos résultats.',
            'who-tag': "Pour Qui C'est",
            'who-title': 'Conçu pour Quiconque Doit Performer',
            'who-sub': "Que vous décrochiez votre premier emploi ou concluiez un contrat d'un million de dollars.",
            'pricing-tag': 'Tarifs',
            'pricing-title': 'Investissez dans Votre Performance',
            'pricing-sub': 'Commencez gratuitement. Passez à la version supérieure quand vous êtes prêt.',
            'toggle-monthly': 'Mensuel',
            'toggle-annual': 'Annuel <span class="save-badge">Économisez 33%</span>',
            'faq-tag': 'FAQ',
            'faq-title': 'Questions Fréquentes',
            'final-cta-title': 'Prêt à Conclure avec Confiance ?',
            'final-cta-sub': "Commencez à vous entraîner aujourd'hui et transformez vos compétences conversationnelles.",
            'final-cta-btn': 'Démarrez Votre Simulation Gratuite',
            'auth-modal-title': 'Bienvenue sur The Clozer',
            'leave-modal-title': 'Quitter la Simulation ?',
            'leave-modal-desc': 'Votre progression actuelle sera perdue si vous partez maintenant.',
            'sim-hint': 'Conseil : Soyez précis, utilisez des chiffres et structurez clairement votre réponse.',
            _nav_signin: 'Connexion',
            _nav_signup: "S'inscrire",
            _leave_cancel: "Continuer l'Entraînement",
            _leave_confirm: 'Quitter',
            _scenario_modal_title: 'Choisissez Votre Scénario',
            _scenario_modal_sub: 'Sélectionnez un type de conversation pour commencer.',
            _result_title: 'Simulation Terminée',
            _result_overall: 'Score Global',
            _result_dimensions: 'Détail par Dimension',
            _result_exchanges: 'Détail des Échanges',
            _result_retry: 'Réessayer',
            _result_home: "Retour à l'Accueil",
            _dash_total: 'Simulations Totales',
            _dash_avg: 'Score Moyen',
            _dash_best: 'Meilleur Score',
            _dash_streak: 'Série en Cours',
            _demo_signup_prompt: 'Inscrivez-vous pour une simulation complète avec notation détaillée !',
            _toast_firebase: 'Firebase non configuré.',
            _toast_signedin: 'Connexion réussie !',
            _toast_signedout: 'Déconnecté.',
            _toast_account_created: 'Compte créé !',
            _toast_sim_saved: 'Session sauvegardée dans votre tableau de bord.',
            'nav-how': 'Comment ça Marche',
            'nav-features': 'Fonctionnalités',
            'nav-demo': 'Démo',
            'nav-pricing': 'Tarifs',
            'nav-faq': 'FAQ',
            'nav-start-btn': 'Commencer Gratuitement',
            'nav-dashboard-text': 'Tableau de Bord',
            'nav-settings-text': 'Paramètres',
            'nav-signout-text': 'Déconnexion',
            'try-sim-text': 'Essayez une Simulation Complète Gratuitement',
            'feat1-title': 'Moteur de Questions Dynamiques par IA',
            'feat1-desc': "Ne faites jamais face deux fois au même entretien. Notre IA génère des questions contextuellement pertinentes basées sur votre rôle cible, secteur et niveau d'expérience.",
            'feat1-li1': "S'adapte en temps réel selon vos réponses",
            'feat1-li2': 'Couvre les questions comportementales, techniques et situationnelles',
            'feat1-li3': 'Bibliothèque de questions en croissance par secteur',
            'feat1-bar1': 'Comportemental',
            'feat1-bar2': 'Technique',
            'feat1-bar3': 'Situationnel',
            'feat1-bar4': 'Suivi',
            'feat2-title': 'Personnalisation CV & Offre',
            'feat2-desc': "Téléchargez votre CV et description de poste. L'IA adapte chaque question à votre situation exacte.",
            'feat2-li1': 'Analyse compétences, expérience et lacunes',
            'feat2-li2': 'Génère des scénarios spécifiques au rôle',
            'feat2-li3': 'Met en évidence les domaines à renforcer',
            'feat3-title': 'Simulation Voix & Texte',
            'feat3-desc': "Entraînez-vous comme vous allez performer. Pratiquez par voix pour les vrais entretiens ou par texte pour des exercices rapides.",
            'feat3-li1': 'Parole-en-texte en temps réel',
            'feat3-li2': 'Analyse du ton et du rythme',
            'feat3-li3': 'Détection des mots de remplissage',
            'feat4-title': 'Notation IA Multidimensionnelle',
            'feat4-desc': "Allez au-delà de « bien » ou « mal ». Obtenez des scores précis sur cinq dimensions critiques.",
            'feat4-li1': 'Structure & Organisation',
            'feat4-li2': 'Clarté & Articulation',
            'feat4-li3': 'Persuasion & Impact',
            'feat4-li4': 'Confiance & Présentation',
            'feat4-li5': 'Pertinence & Précision',
            'feat5-title': 'Difficulté Adaptative',
            'feat5-desc': "L'IA ajuste le niveau de difficulté selon vos performances. Commencez facilement, progressez vers des scénarios de niveau exécutif.",
            'feat5-li1': '3 niveaux de difficulté : Base, Avancé, Élite',
            'feat5-li2': 'Escalade automatique sur scores élevés',
            'feat5-li3': 'Mode simulation sous pression',
            'feat6-title': 'Analytique de Performance',
            'feat6-desc': 'Suivez chaque métrique importante. Observez les tendances, identifiez les faiblesses et mesurez votre croissance.',
            'feat6-li1': 'Comparaison session par session',
            'feat6-li2': 'Graphiques de tendance par dimension',
            'feat6-li3': 'Rapports de progression exportables',
            'feat7-title': 'Replay de Simulation',
            'feat7-desc': "Révisez n'importe quelle session passée avec la transcription complète, les scores et des suggestions d'amélioration générées par IA.",
            'feat7-li1': 'Comparaison de réponses côte à côte',
            'feat7-li2': 'Réponses modèles réécrites par IA',
            'feat7-li3': 'Marquer les moments clés',
            'feat8-title': 'Système de Boucle de Maîtrise',
            'feat8-desc': "Ne vous contentez pas de pratiquer. Maîtrisez. Répétez les scénarios jusqu'à atteindre votre seuil de score cible de manière constante.",
            'feat8-li1': 'Définissez des objectifs de score personnels',
            'feat8-li2': 'Débloquez la difficulté suivante à la maîtrise',
            'feat8-li3': 'Badges de réussite et séries',
            'scoring-tag': 'Moteur de Notation IA',
            'scoring-title': 'Évaluation Transparente à 5 Dimensions',
            'scoring-sub': "Chaque réponse est notée sur cinq dimensions critiques à l'aide de notre moteur IA propriétaire. Pas de boîtes noires — voyez exactement où vous en êtes et quoi améliorer.",
            'demo-panel-ai': 'Intervieweur IA',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': 'Responsable Recrutement Senior',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': 'Avancé',
            'demo-panel-sim': 'Simulation',
            'demo-panel-score': 'Score en Direct',
            'demo-score-label': 'Score Global',
            'demo-keywords-label': 'Mots-clés Trouvés',
            'aud1-title': "Chercheurs d'Emploi",
            'aud1-pain': 'Fatigué de vous figer sous pression et de bégayer lors des entretiens ?',
            'aud1-promise': "Entrez dans chaque entretien pleinement préparé, confiant et prêt à décrocher l'offre.",
            'aud1-cta': 'Démarrer la Formation Entretien',
            'aud2-title': 'Professionnels de la Vente',
            'aud2-pain': 'Perdez des deals parce que les objections vous prennent de court ?',
            'aud2-promise': "Affûtez votre pitch, gérez toute objection et augmentez votre taux de closing jusqu'à 40%.",
            'aud2-cta': 'Démarrer la Formation Vente',
            'aud3-title': 'Fondateurs & Dirigeants',
            'aud3-pain': 'Besoin de maîtriser les pitchs investisseurs, présentations au conseil et réunions à forts enjeux ?',
            'aud3-promise': 'Affinez votre présence exécutive et vos compétences de persuasion au plus haut niveau.',
            'aud3-cta': 'Démarrer la Formation Exécutif',
            'aud4-title': 'Étudiants',
            'aud4-pain': 'Anxieux face à votre premier vrai entretien ou admission universitaire ?',
            'aud4-promise': "Construisez une confiance inébranlable avec une pratique guidée avant que ça compte.",
            'aud4-cta': 'Démarrer la Formation Étudiant',
            'aud5-title': 'Apprenants en Négociation',
            'aud5-pain': "Laissez de l'argent sur la table parce que vous ne savez pas négocier ?",
            'aud5-promise': "Apprenez des cadres éprouvés et pratiquez-les jusqu'à ce que la négociation soit naturelle.",
            'aud5-cta': 'Démarrer la Formation Négociation',
            'price-free-tier': 'Gratuit',
            'price-free-period': '/mois',
            'price-free-desc': 'Commencez et découvrez la plateforme.',
            'price-free-f1': '3 simulations par mois',
            'price-free-f2': 'Simulation textuelle',
            'price-free-f3': 'Retour IA basique',
            'price-free-f4': '3 types de scénarios',
            'price-free-f5': 'Simulation vocale',
            'price-free-f6': 'Personnalisation CV',
            'price-free-f7': 'Tableau de bord analytique',
            'price-free-cta': 'Commencer Gratuitement',
            'price-pro-popular': 'Plus Populaire',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/mois',
            'price-pro-desc': 'Pour une préparation sérieuse et une amélioration constante.',
            'price-pro-f1': 'Simulations illimitées',
            'price-pro-f2': 'Simulation voix + texte',
            'price-pro-f3': 'Retour IA avancé',
            'price-pro-f4': 'Tous les types de scénarios',
            'price-pro-f5': 'Téléchargement CV & JD',
            'price-pro-f6': 'Analytique de performance',
            'price-pro-f7': 'Traitement IA prioritaire',
            'price-pro-cta': 'Essai Pro',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/mois',
            'price-elite-desc': 'Préparation maximale pour les enjeux maximaux.',
            'price-elite-f1': 'Tout ce qui est dans Pro',
            'price-elite-f2': 'Traitement IA prioritaire',
            'price-elite-f3': 'Détection du ton émotionnel',
            'price-elite-f4': 'Notation de la stratégie de négociation',
            'price-elite-f5': "Feuille de route d'amélioration personnalisée",
            'price-elite-f6': 'Classement de performance IA',
            'price-elite-f7': 'Onboarding premium',
            'price-elite-cta': 'Essai Elite',
            'pricing-note': "Tous les plans incluent 7 jours d'essai gratuit. Aucune carte requise pour le plan Gratuit. Annulez à tout moment.",
            'faq-q1': "Quelle est la précision de l'évaluation IA ?",
            'faq-a1': "Notre moteur de notation IA évalue sur 5 dimensions — structure, clarté, persuasion, confiance et pertinence — fournissant des retours détaillés et actionnables sur chaque réponse.",
            'faq-q2': 'Mes données sont-elles sécurisées ?',
            'faq-a2': "Absolument. Toutes les données de simulation sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous utilisons l'infrastructure de sécurité d'entreprise Firebase.",
            'faq-q3': 'Comment gérer ou annuler mon abonnement ?',
            'faq-a3': "Vous pouvez gérer votre abonnement directement depuis votre tableau de bord. Mettez à niveau, réduisez ou annulez en un clic. Sans frais cachés ni pénalités.",
            'faq-q4': 'Proposez-vous des licences entreprise ou équipe ?',
            'faq-a4': "Oui. Nous proposons des plans entreprise personnalisés avec tableaux de bord de gestion d'équipe, tarification en volume, intégration SSO et bibliothèques de scénarios personnalisés.",
            'faq-q5': 'Les enregistrements vocaux sont-ils stockés ?',
            'faq-a5': "Les enregistrements vocaux sont traités en temps réel pour évaluation et transcription. Dans les plans Gratuit et Pro, l'audio est supprimé après traitement.",
            'faq-q6': 'Quelles langues sont supportées ?',
            'faq-a6': 'Actuellement, The Clozer supporte la simulation et l\'évaluation complètes en anglais, coréen, japonais, espagnol, chinois, français et portugais.',
            'faq-q7': 'Comment fonctionne le suivi des performances ?',
            'faq-a7': 'Chaque simulation génère des scores sur 5 dimensions. Votre tableau de bord analytique affiche les tendances session par session, les détails par dimension et les recommandations personnalisées.',
            'faq-q8': 'Puis-je utiliser The Clozer pour des scénarios hors entretien ?',
            'faq-a8': "Oui. Au-delà des entretiens d'embauche, The Clozer supporte les appels de vente, négociations salariales, pitchs investisseurs, admissions universitaires et toute conversation à forts enjeux.",
            'final-cta-note': 'Aucune carte de crédit requise. Commencez en 30 secondes.',
            'footer-tagline': 'Le Coach de Performance IA pour les Conversations à Forts Enjeux.',
            'footer-col1-title': 'Produit',
            'footer-col1-l1': 'Fonctionnalités',
            'footer-col1-l2': 'Tarifs',
            'footer-col1-l3': 'Démo',
            'footer-col1-l4': 'Entreprise',
            'footer-col2-title': 'Société',
            'footer-col2-l1': 'À Propos',
            'footer-col2-l2': 'Carrières',
            'footer-col2-l3': 'Blog',
            'footer-contact-link': 'Contact',
            'footer-col3-title': 'Légal',
            'footer-privacy-link': 'Politique de Confidentialité',
            'footer-terms-link': "Conditions d'Utilisation",
            'footer-col3-l3': 'Politique de Cookies',
            'footer-col3-l4': 'RGPD',
            'footer-copyright': '&copy; 2026 The Clozer. Tous droits réservés.',
            'footer-share-title': 'Partager',
        },
        pt: {
            'hero-badge-text': 'Treinamento de Conversas com IA',
            'hero-title': 'Feche Cada Conversa<br><span class="gradient-text">Com Confiança</span>',
            'hero-sub': 'O coach de desempenho com IA que transforma suas entrevistas, negociações e persuasão. Simulação em tempo real. Pontuação instantânea. Melhoria mensurável.',
            'start-sim-text': 'Iniciar Simulação Gratuita',
            'watch-demo-text': 'Ver Demonstração',
            'how-tag': 'Como Funciona',
            'how-title': 'Cinco Passos para o Domínio',
            'how-sub': 'Da primeira tentativa ao desempenho máximo em um fluxo estruturado e mensurável.',
            'step1-title': 'Escolha Seu Cenário',
            'step1-desc': 'Selecione entre entrevistas, ligações de vendas, negociações ou cenários personalizados.',
            'step1-micro': 'Envie seu currículo para perguntas personalizadas',
            'step2-title': 'Inicie a Simulação com IA',
            'step2-desc': 'Participe de uma conversa dinâmica com nosso entrevistador IA por voz ou texto.',
            'step2-micro': 'Dificuldade adaptativa ao seu nível',
            'step3-title': 'Avaliação em Tempo Real',
            'step3-desc': 'Veja suas pontuações atualizarem ao vivo em estrutura, clareza, persuasão, confiança e relevância.',
            'step3-micro': 'Motor de pontuação IA de 5 dimensões',
            'step4-title': 'Feedback Detalhado Instantâneo',
            'step4-desc': 'Obtenha insights acionáveis em cada resposta: o que funcionou, o que não funcionou e como melhorar.',
            'step4-micro': 'Reescritas sugeridas para respostas fracas',
            'step5-title': 'Acompanhe e Melhore',
            'step5-desc': 'Monitore seu progresso com painéis de análise. Repita até atingir sua pontuação alvo.',
            'step5-micro': 'Ciclo de domínio: pratique até se destacar',
            'features-tag': 'Funcionalidades Principais',
            'features-title': 'Construído para o Máximo Desempenho',
            'features-sub': 'Cada funcionalidade é projetada para acelerar seu domínio conversacional.',
            'demo-tag': 'Demo ao Vivo',
            'demo-title': 'Veja The Clozer em Ação',
            'demo-sub': 'Experimente uma interface de simulação real. Tente você mesmo.',
            'demo-hint': 'Dica: Use o método STAR. Quantifique seus resultados.',
            'who-tag': 'Para Quem É',
            'who-title': 'Construído para Quem Precisa Performar',
            'who-sub': 'Seja seu primeiro emprego ou um negócio de um milhão de dólares.',
            'pricing-tag': 'Preços',
            'pricing-title': 'Invista em Seu Desempenho',
            'pricing-sub': 'Comece grátis. Atualize quando estiver pronto.',
            'toggle-monthly': 'Mensal',
            'toggle-annual': 'Anual <span class="save-badge">Economize 33%</span>',
            'faq-tag': 'Perguntas Frequentes',
            'faq-title': 'Perguntas Frequentes',
            'final-cta-title': 'Pronto para Fechar com Confiança?',
            'final-cta-sub': 'Comece a treinar hoje e transforme suas habilidades de conversação.',
            'final-cta-btn': 'Inicie Sua Simulação Gratuita',
            'auth-modal-title': 'Bem-vindo ao The Clozer',
            'leave-modal-title': 'Sair da Simulação?',
            'leave-modal-desc': 'Seu progresso atual será perdido se você sair agora.',
            'sim-hint': 'Dica: Seja específico, use números e estruture sua resposta claramente.',
            _nav_signin: 'Entrar',
            _nav_signup: 'Cadastrar',
            _leave_cancel: 'Continuar Treinando',
            _leave_confirm: 'Sair',
            _scenario_modal_title: 'Escolha Seu Cenário',
            _scenario_modal_sub: 'Selecione um tipo de conversa para começar.',
            _result_title: 'Simulação Concluída',
            _result_overall: 'Pontuação Geral',
            _result_dimensions: 'Detalhamento por Dimensão',
            _result_exchanges: 'Detalhes das Trocas',
            _result_retry: 'Tentar Novamente',
            _result_home: 'Voltar ao Início',
            _dash_total: 'Total de Simulações',
            _dash_avg: 'Pontuação Média',
            _dash_best: 'Melhor Pontuação',
            _dash_streak: 'Sequência Atual',
            _demo_signup_prompt: 'Cadastre-se para uma simulação completa com pontuação detalhada!',
            _toast_firebase: 'Firebase não configurado.',
            _toast_signedin: 'Login realizado com sucesso!',
            _toast_signedout: 'Logout realizado.',
            _toast_account_created: 'Conta criada!',
            _toast_sim_saved: 'Sessão salva no seu painel.',
            'nav-how': 'Como Funciona',
            'nav-features': 'Funcionalidades',
            'nav-demo': 'Demo',
            'nav-pricing': 'Preços',
            'nav-faq': 'FAQ',
            'nav-start-btn': 'Começar Grátis',
            'nav-dashboard-text': 'Painel',
            'nav-settings-text': 'Configurações',
            'nav-signout-text': 'Sair',
            'try-sim-text': 'Experimente uma Simulação Completa Grátis',
            'feat1-title': 'Motor de Perguntas Dinâmicas com IA',
            'feat1-desc': 'Nunca enfrente a mesma entrevista duas vezes. Nossa IA gera perguntas contextualmente relevantes com base em sua função alvo, setor e nível de experiência.',
            'feat1-li1': 'Adapta-se em tempo real com base em suas respostas',
            'feat1-li2': 'Cobre perguntas comportamentais, técnicas e situacionais',
            'feat1-li3': 'Biblioteca de perguntas crescente por setor',
            'feat1-bar1': 'Comportamental',
            'feat1-bar2': 'Técnica',
            'feat1-bar3': 'Situacional',
            'feat1-bar4': 'Acompanhamento',
            'feat2-title': 'Personalização de Currículo e Vaga',
            'feat2-desc': 'Envie seu currículo e descrição de cargo. A IA adapta cada pergunta à sua situação exata.',
            'feat2-li1': 'Analisa habilidades, experiência e lacunas',
            'feat2-li2': 'Gera cenários específicos para o cargo',
            'feat2-li3': 'Destaca áreas a fortalecer',
            'feat3-title': 'Simulação por Voz e Texto',
            'feat3-desc': 'Treine da forma que vai performar. Pratique por voz para entrevistas reais ou por texto para exercícios rápidos.',
            'feat3-li1': 'Voz para texto em tempo real',
            'feat3-li2': 'Análise de tom e ritmo',
            'feat3-li3': 'Detecção de palavras de preenchimento',
            'feat4-title': 'Pontuação IA Multidimensional',
            'feat4-desc': 'Vá além de "bom" ou "ruim". Obtenha pontuações precisas em cinco dimensões críticas.',
            'feat4-li1': 'Estrutura & Organização',
            'feat4-li2': 'Clareza & Articulação',
            'feat4-li3': 'Persuasão & Impacto',
            'feat4-li4': 'Confiança & Entrega',
            'feat4-li5': 'Relevância & Precisão',
            'feat5-title': 'Dificuldade Adaptativa',
            'feat5-desc': 'A IA ajusta o nível de desafio com base em seu desempenho. Comece fácil, avance para cenários de nível executivo.',
            'feat5-li1': '3 níveis de dificuldade: Base, Avançado, Elite',
            'feat5-li2': 'Escalada automática em pontuações altas',
            'feat5-li3': 'Modo de simulação sob pressão',
            'feat6-title': 'Análise de Desempenho',
            'feat6-desc': 'Acompanhe cada métrica que importa. Veja tendências, identifique fraquezas e meça seu crescimento.',
            'feat6-li1': 'Comparação sessão por sessão',
            'feat6-li2': 'Gráficos de tendência por dimensão',
            'feat6-li3': 'Relatórios de progresso exportáveis',
            'feat7-title': 'Replay de Simulação',
            'feat7-desc': 'Revise qualquer sessão passada com transcrição completa, pontuações e sugestões de melhoria geradas por IA.',
            'feat7-li1': 'Comparação de respostas lado a lado',
            'feat7-li2': 'Respostas modelo reescritas por IA',
            'feat7-li3': 'Marcar momentos-chave',
            'feat8-title': 'Sistema de Ciclo de Domínio',
            'feat8-desc': 'Não apenas pratique. Domine. Repita cenários até atingir consistentemente seu limite de pontuação alvo.',
            'feat8-li1': 'Defina metas de pontuação pessoais',
            'feat8-li2': 'Desbloqueie a próxima dificuldade ao dominar',
            'feat8-li3': 'Emblemas de conquista e sequências',
            'scoring-tag': 'Motor de Pontuação IA',
            'scoring-title': 'Avaliação Transparente de 5 Dimensões',
            'scoring-sub': 'Cada resposta é pontuada em cinco dimensões críticas usando nosso motor IA proprietário. Sem caixas pretas — veja exatamente onde você está e o que melhorar.',
            'demo-panel-ai': 'Entrevistador IA',
            'demo-avatar-name': 'Sarah Chen',
            'demo-avatar-role': 'Gerente Sênior de Contratação',
            'demo-avatar-company': 'Tech Corp International',
            'demo-difficulty': 'Avançado',
            'demo-panel-sim': 'Simulação',
            'demo-panel-score': 'Pontuação ao Vivo',
            'demo-score-label': 'Pontuação Geral',
            'demo-keywords-label': 'Palavras-chave Encontradas',
            'aud1-title': 'Candidatos a Emprego',
            'aud1-pain': 'Cansado de travar sob pressão e tropeçar em entrevistas?',
            'aud1-promise': 'Entre em cada entrevista completamente preparado, confiante e pronto para fechar a oferta.',
            'aud1-cta': 'Iniciar Treinamento de Entrevista',
            'aud2-title': 'Profissionais de Vendas',
            'aud2-pain': 'Perdendo negócios porque objeções te pegam de surpresa?',
            'aud2-promise': 'Afine seu pitch, lide com qualquer objeção e aumente sua taxa de fechamento em até 40%.',
            'aud2-cta': 'Iniciar Treinamento de Vendas',
            'aud3-title': 'Fundadores e Executivos',
            'aud3-pain': 'Precisa dominar pitches para investidores, apresentações para conselho e reuniões de alto impacto?',
            'aud3-promise': 'Refine sua presença executiva e habilidades de persuasão no mais alto nível.',
            'aud3-cta': 'Iniciar Treinamento Executivo',
            'aud4-title': 'Estudantes',
            'aud4-pain': 'Ansioso com sua primeira entrevista real ou admissão universitária?',
            'aud4-promise': 'Construa confiança inabalável com prática guiada antes que importe.',
            'aud4-cta': 'Iniciar Treinamento de Estudante',
            'aud5-title': 'Aprendizes de Negociação',
            'aud5-pain': 'Deixando dinheiro na mesa porque não sabe negociar?',
            'aud5-promise': 'Aprenda frameworks comprovados e pratique-os até negociar parecer natural.',
            'aud5-cta': 'Iniciar Treinamento de Negociação',
            'price-free-tier': 'Grátis',
            'price-free-period': '/mês',
            'price-free-desc': 'Comece e experimente a plataforma.',
            'price-free-f1': '3 simulações por mês',
            'price-free-f2': 'Simulação baseada em texto',
            'price-free-f3': 'Feedback básico de IA',
            'price-free-f4': '3 tipos de cenário',
            'price-free-f5': 'Simulação por voz',
            'price-free-f6': 'Personalização de currículo',
            'price-free-f7': 'Painel de análise',
            'price-free-cta': 'Começar Grátis',
            'price-pro-popular': 'Mais Popular',
            'price-pro-tier': 'Pro',
            'price-pro-period': '/mês',
            'price-pro-desc': 'Para preparação séria e melhoria consistente.',
            'price-pro-f1': 'Simulações ilimitadas',
            'price-pro-f2': 'Simulação voz + texto',
            'price-pro-f3': 'Feedback IA avançado',
            'price-pro-f4': 'Todos os tipos de cenário',
            'price-pro-f5': 'Upload de currículo e JD',
            'price-pro-f6': 'Análise de desempenho',
            'price-pro-f7': 'Processamento IA prioritário',
            'price-pro-cta': 'Iniciar Teste Pro',
            'price-elite-tier': 'Elite',
            'price-elite-period': '/mês',
            'price-elite-desc': 'Máxima preparação para máximos desafios.',
            'price-elite-f1': 'Tudo no Pro incluído',
            'price-elite-f2': 'Processamento IA prioritário',
            'price-elite-f3': 'Detecção de tom emocional',
            'price-elite-f4': 'Pontuação de estratégia de negociação',
            'price-elite-f5': 'Roteiro de melhoria personalizado',
            'price-elite-f6': 'Ranking de desempenho IA',
            'price-elite-f7': 'Onboarding premium',
            'price-elite-cta': 'Iniciar Teste Elite',
            'pricing-note': 'Todos os planos incluem 7 dias de teste grátis. Sem cartão para o plano Grátis. Cancele a qualquer momento.',
            'faq-q1': 'Quão precisa é a avaliação da IA?',
            'faq-a1': 'Nosso motor de pontuação IA avalia em 5 dimensões — estrutura, clareza, persuasão, confiança e relevância — fornecendo feedback detalhado e acionável em cada resposta.',
            'faq-q2': 'Meus dados estão seguros?',
            'faq-a2': 'Com certeza. Todos os dados de simulação são criptografados em trânsito (TLS 1.3) e em repouso (AES-256). Usamos infraestrutura de segurança empresarial do Firebase.',
            'faq-q3': 'Como gerenciar ou cancelar minha assinatura?',
            'faq-a3': 'Você pode gerenciar sua assinatura diretamente do seu painel de conta. Atualize, reduza ou cancele com um clique. Sem taxas ocultas, sem penalidades de cancelamento.',
            'faq-q4': 'Oferecem licenças empresariais ou de equipe?',
            'faq-a4': 'Sim. Oferecemos planos empresariais personalizados com painéis de gerenciamento de equipe, precificação em volume, integração SSO e bibliotecas de cenários personalizados.',
            'faq-q5': 'As gravações de voz são armazenadas?',
            'faq-a5': 'As gravações de voz são processadas em tempo real para avaliação e transcrição. Nos planos Grátis e Pro, o áudio é excluído após o processamento.',
            'faq-q6': 'Quais idiomas são suportados?',
            'faq-a6': 'Atualmente, The Clozer suporta simulação e avaliação completas em inglês, coreano, japonês, espanhol, chinês, francês e português.',
            'faq-q7': 'Como funciona o acompanhamento de desempenho?',
            'faq-a7': 'Cada simulação gera pontuações em 5 dimensões. Seu painel de análise mostra tendências sessão por sessão, detalhamentos por dimensão e recomendações personalizadas de melhoria.',
            'faq-q8': 'Posso usar The Clozer para cenários além de entrevistas?',
            'faq-a8': 'Sim. Além de entrevistas de emprego, The Clozer suporta ligações de vendas, negociações salariais, pitchs para investidores, admissões universitárias e qualquer conversa de alto impacto.',
            'final-cta-note': 'Sem cartão de crédito necessário. Comece em 30 segundos.',
            'footer-tagline': 'O Coach de Desempenho IA para Conversas de Alto Impacto.',
            'footer-col1-title': 'Produto',
            'footer-col1-l1': 'Funcionalidades',
            'footer-col1-l2': 'Preços',
            'footer-col1-l3': 'Demo',
            'footer-col1-l4': 'Empresas',
            'footer-col2-title': 'Empresa',
            'footer-col2-l1': 'Sobre',
            'footer-col2-l2': 'Carreiras',
            'footer-col2-l3': 'Blog',
            'footer-contact-link': 'Contato',
            'footer-col3-title': 'Legal',
            'footer-privacy-link': 'Política de Privacidade',
            'footer-terms-link': 'Termos de Serviço',
            'footer-col3-l3': 'Política de Cookies',
            'footer-col3-l4': 'LGPD',
            'footer-copyright': '&copy; 2026 The Clozer. Todos os direitos reservados.',
            'footer-share-title': 'Compartilhar',
        }
    };

    function t(key) {
        const lang = T[currentLang] || T['en'];
        return lang[key] || T['en'][key] || key;
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem('clozer-lang', lang);

        // Update all elements that have matching translation keys by ID
        const langData = T[lang] || T['en'];
        Object.keys(langData).forEach(key => {
            if (key.startsWith('_')) return; // Skip internal keys
            const el = document.getElementById(key);
            if (el) el.innerHTML = langData[key];
        });

        // Update lang button text
        const langBtn = document.getElementById('lang-btn');
        if (langBtn) langBtn.textContent = lang.toUpperCase();

        // Update active state on lang options
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });

        // Update leave modal buttons text
        const leaveCancel = document.getElementById('leave-cancel');
        const leaveConfirm = document.getElementById('leave-confirm');
        if (leaveCancel) leaveCancel.textContent = t('_leave_cancel');
        if (leaveConfirm) leaveConfirm.textContent = t('_leave_confirm');

        // Update auth buttons text
        const navSigninBtn = document.getElementById('nav-signin-btn');
        const navSignupBtn = document.getElementById('nav-signup-btn');
        if (navSigninBtn) navSigninBtn.textContent = t('_nav_signin');
        if (navSignupBtn) navSignupBtn.textContent = t('_nav_signup');

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Update Userback widget language
        if (window.Userback && typeof window.Userback.setLocale === 'function') {
            try { window.Userback.setLocale(lang); } catch(e) {}
        } else if (window.Userback) {
            window.Userback.locale = lang;
        }
    }

    // ==================== 4. SCENARIOS ====================
    const SCENARIOS = {
        restaurant: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
            label: { en: 'Restaurant Interview', ko: '음식점 면접', ja: '飲食店面接', es: 'Entrevista Restaurante', zh: '餐厅面试', fr: 'Entretien Restaurant', pt: 'Entrevista Restaurante' },
            difficulty: 'Foundation',
            questions: [
                {
                    text: '음식점에서 일한 경험이 있으신가요? 손님에게 최고의 서비스를 제공하기 위해 어떤 노력을 하시겠습니까?',
                    keywords: ['서비스', '친절', '경험', '손님', '노력', '책임', '성실'],
                    hints: ['구체적인 경험을 말하세요', '고객 만족을 위한 본인만의 방법을 설명하세요', '적극적인 태도를 보여주세요'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.20, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: '바쁜 피크 타임에 손님이 음식이 늦다고 불만을 제기한다면 어떻게 대처하시겠습니까?',
                    keywords: ['사과', '해결', '소통', '침착', '친절', '빠른', '처리'],
                    hints: ['먼저 진심으로 사과하세요', '상황을 솔직하게 설명하세요', '해결책을 제시하세요'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.20, confidence: 0.25, relevance: 0.15 }
                },
                {
                    text: '주문을 받다가 실수를 했을 때 어떻게 처리하시겠습니까?',
                    keywords: ['솔직', '사과', '빠른', '수정', '책임', '해결', '보상'],
                    hints: ['즉시 사과하고 책임지는 모습을 보이세요', '빠르게 문제를 해결하는 방법을 말하세요', '같은 실수를 반복하지 않겠다는 의지를 보이세요'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.15, confidence: 0.25, relevance: 0.20 }
                },
                {
                    text: '함께 일하는 동료와 의견 충돌이 생겼을 때 어떻게 해결하시겠습니까?',
                    keywords: ['대화', '협력', '이해', '팀워크', '소통', '양보', '해결'],
                    hints: ['대화를 통한 해결 의지를 보이세요', '팀 분위기를 중요시한다는 것을 강조하세요', '구체적인 해결 방법을 제시하세요'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: '이 음식점에서 일하고 싶은 이유는 무엇인가요? 앞으로 어떻게 기여하고 싶으신가요?',
                    keywords: ['열정', '성장', '기여', '배움', '노력', '성실', '책임감'],
                    hints: ['이 매장을 선택한 구체적인 이유를 말하세요', '본인이 기여할 수 있는 점을 강조하세요', '장기적으로 일할 의지를 보이세요'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.25, confidence: 0.20, relevance: 0.10 }
                }
            ]
        },
        cafe: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
            label: { en: 'Cafe Interview', ko: '카페 면접', ja: 'カフェ面接', es: 'Entrevista Cafetería', zh: '咖啡店面试', fr: 'Entretien Café', pt: 'Entrevista Cafeteria' },
            difficulty: 'Foundation',
            questions: [
                {
                    text: '커피나 음료 제조 경험이 있으신가요? 없다면 새로운 기술을 배우기 위해 어떻게 노력하시겠습니까?',
                    keywords: ['경험', '배움', '노력', '적극', '연습', '습득', '성장'],
                    hints: ['있다면 구체적인 경험을 말하세요', '없다면 빠르게 배우려는 의지를 보이세요', '커피에 대한 관심이나 열정을 표현하세요'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.20, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: '아침 러시 타임에 주문이 밀려 있을 때 어떻게 효율적으로 처리하시겠습니까?',
                    keywords: ['효율', '침착', '우선순위', '빠른', '정확', '팀워크', '소통'],
                    hints: ['침착하게 우선순위를 정하는 방법을 설명하세요', '동료와의 협력을 강조하세요', '정확성을 잃지 않는 방법을 말하세요'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.15, confidence: 0.25, relevance: 0.15 }
                },
                {
                    text: '손님이 주문한 음료가 잘못 나왔다고 항의한다면 어떻게 대응하시겠습니까?',
                    keywords: ['사과', '확인', '재제조', '친절', '신속', '해결', '만족'],
                    hints: ['즉시 사과하고 주문을 다시 확인하세요', '빠르게 올바른 음료를 제공하겠다고 말하세요', '손님이 만족할 수 있도록 배려하는 자세를 보이세요'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.20, confidence: 0.25, relevance: 0.15 }
                },
                {
                    text: '카페의 청결과 위생 관리에 대해 어떻게 생각하시나요? 구체적으로 어떻게 실천하시겠습니까?',
                    keywords: ['청결', '위생', '정리', '점검', '규정', '철저', '습관'],
                    hints: ['위생의 중요성을 강조하세요', '구체적인 청소 및 위생 관리 방법을 말하세요', '규정을 철저히 따르겠다는 의지를 보이세요'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: '단골 손님과 좋은 관계를 유지하고 재방문을 유도하기 위해 어떤 노력을 하시겠습니까?',
                    keywords: ['기억', '친근', '서비스', '관심', '소통', '재방문', '만족'],
                    hints: ['손님을 기억하고 개인화된 서비스를 강조하세요', '작은 배려가 단골을 만든다는 것을 설명하세요', '긍정적인 경험을 만들기 위한 구체적인 방법을 제시하세요'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.25, confidence: 0.20, relevance: 0.15 }
                }
            ]
        },
        convenience: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
            label: { en: 'Convenience Store Interview', ko: '편의점 면접', ja: 'コンビニ面接', es: 'Entrevista Tienda', zh: '便利店面试', fr: 'Entretien Épicerie', pt: 'Entrevista Conveniência' },
            difficulty: 'Foundation',
            questions: [
                {
                    text: '편의점 아르바이트에 지원하게 된 동기가 무엇인가요? 본인이 이 일에 적합한 이유를 말씀해 주세요.',
                    keywords: ['동기', '적합', '성실', '책임감', '시간관리', '서비스', '노력'],
                    hints: ['진솔한 지원 동기를 말하세요', '본인의 장점과 이 일의 연관성을 설명하세요', '열심히 하겠다는 의지를 보이세요'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.25, confidence: 0.20, relevance: 0.10 }
                },
                {
                    text: '야간 근무나 주말 근무가 가능하신가요? 본인의 가능한 스케줄에 대해 말씀해 주세요.',
                    keywords: ['가능', '유연', '스케줄', '조율', '약속', '출근', '성실'],
                    hints: ['가능한 시간을 구체적으로 말하세요', '스케줄 변경 시 미리 알리겠다는 책임감을 보이세요', '근무에 적극적으로 임하겠다는 의지를 표현하세요'],
                    weights: { structure: 0.20, clarity: 0.30, persuasion: 0.15, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: '재고 정리 중 유통기한이 지난 제품을 발견했을 때 어떻게 처리하시겠습니까?',
                    keywords: ['즉시', '보고', '분리', '폐기', '규정', '정직', '책임'],
                    hints: ['즉시 해당 제품을 분리하고 담당자에게 보고하세요', '규정에 따라 폐기 처리하는 절차를 말하세요', '정직하고 책임감 있게 처리하겠다는 자세를 보이세요'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: '손님이 거스름돈이 잘못됐다고 항의한다면 어떻게 대응하시겠습니까?',
                    keywords: ['침착', '확인', '사과', '해결', '정확', '정직', '신뢰'],
                    hints: ['먼저 침착하게 상황을 확인하세요', '실수가 맞다면 즉시 사과하고 수정하세요', '영수증이나 POS 기록을 확인하는 방법을 말하세요'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.15, confidence: 0.25, relevance: 0.20 }
                },
                {
                    text: '혼자 매장을 관리하게 될 때 가장 중요하게 여겨야 할 것은 무엇이라고 생각하십니까?',
                    keywords: ['책임감', '안전', '청결', '재고', '서비스', '판단', '보고'],
                    hints: ['혼자 일할 때 필요한 자기 관리 능력을 강조하세요', '돌발 상황에 대한 대처 방법을 말하세요', '필요 시 책임자에게 보고하는 것의 중요성을 언급하세요'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.15, confidence: 0.25, relevance: 0.15 }
                }
            ]
        }
    };

    // ==================== 5. SCORING ENGINE ====================
    function scoreResponse(text, question) {
        const words = text.trim().split(/\s+/);
        const wordCount = words.length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const lowerText = text.toLowerCase();

        // -- Structure --
        let structureScore = 50;
        const starIndicators = ['situation', 'task', 'action', 'result', 'context', 'challenge', 'approach', 'outcome'];
        let starCount = 0;
        starIndicators.forEach(w => { if (lowerText.includes(w)) starCount++; });
        structureScore += Math.min(starCount * 6, 24);
        // Multiple sentences = better structure
        if (sentences.length >= 3) structureScore += 10;
        if (sentences.length >= 5) structureScore += 8;
        // Paragraph-like organization (line breaks or long enough)
        if (wordCount > 40) structureScore += 5;
        if (wordCount > 80) structureScore += 3;

        // -- Clarity --
        let clarityScore = 50;
        // Ideal word count range
        if (wordCount >= 50 && wordCount <= 200) {
            clarityScore += 20;
        } else if (wordCount >= 30 && wordCount <= 250) {
            clarityScore += 10;
        } else if (wordCount < 20) {
            clarityScore -= 15;
        }
        // Sentence variety (different lengths)
        if (sentences.length > 1) {
            const lengths = sentences.map(s => s.split(/\s+/).length);
            const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
            const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) / lengths.length;
            if (variance > 10) clarityScore += 10;
        }
        // Specificity bonus: numbers, names, proper nouns
        const numberMatches = text.match(/\d+/g);
        if (numberMatches) clarityScore += Math.min(numberMatches.length * 4, 16);
        // Transition words
        const transitions = ['therefore', 'however', 'additionally', 'furthermore', 'consequently', 'specifically', 'for example', 'as a result', 'first', 'second', 'finally'];
        transitions.forEach(tw => { if (lowerText.includes(tw)) clarityScore += 2; });

        // -- Persuasion --
        let persuasionScore = 50;
        // Numbers and metrics
        if (numberMatches) persuasionScore += Math.min(numberMatches.length * 5, 20);
        // Data references
        const dataWords = ['percent', '%', 'increased', 'decreased', 'improved', 'grew', 'reduced', 'saved', 'revenue', 'profit', 'ROI', 'conversion', 'metric', 'KPI', 'data', 'benchmark'];
        dataWords.forEach(dw => { if (lowerText.includes(dw.toLowerCase())) persuasionScore += 3; });
        // Impact words
        const impactWords = ['achieved', 'delivered', 'launched', 'transformed', 'drove', 'spearheaded', 'led', 'exceeded', 'surpassed', 'pioneered', 'generated', 'secured', 'built'];
        impactWords.forEach(iw => { if (lowerText.includes(iw)) persuasionScore += 2; });

        // -- Confidence --
        let confidenceScore = 65;
        // Penalty for hedge words
        const hedgeWords = ['maybe', 'i think', 'kind of', 'sort of', 'probably', 'perhaps', 'i guess', 'i feel like', 'not sure', 'might', 'could be', 'i suppose'];
        hedgeWords.forEach(hw => {
            if (lowerText.includes(hw)) confidenceScore -= 4;
        });
        // Bonus for assertive language
        const assertiveWords = ['i led', 'i drove', 'i built', 'i delivered', 'i achieved', 'i managed', 'i created', 'i ensured', 'i designed', 'i implemented', 'clearly', 'definitely', 'directly', 'successfully'];
        assertiveWords.forEach(aw => { if (lowerText.includes(aw)) confidenceScore += 3; });
        // Good length shows confidence
        if (wordCount >= 50) confidenceScore += 5;
        if (wordCount >= 100) confidenceScore += 5;

        // -- Relevance --
        let relevanceScore = 40;
        const keywordsMatched = [];
        const keywordsMissed = [];
        question.keywords.forEach(kw => {
            if (lowerText.includes(kw.toLowerCase().replace(/-/g, ' ')) || lowerText.includes(kw.toLowerCase())) {
                keywordsMatched.push(kw);
                relevanceScore += Math.floor(40 / question.keywords.length);
            } else {
                keywordsMissed.push(kw);
            }
        });
        // Bonus for directly addressing the question
        if (wordCount > 30) relevanceScore += 5;

        // Clamp all scores to 0-100
        structureScore = Math.max(0, Math.min(100, structureScore));
        clarityScore = Math.max(0, Math.min(100, clarityScore));
        persuasionScore = Math.max(0, Math.min(100, persuasionScore));
        confidenceScore = Math.max(0, Math.min(100, confidenceScore));
        relevanceScore = Math.max(0, Math.min(100, relevanceScore));

        const dimensions = { structure: structureScore, clarity: clarityScore, persuasion: persuasionScore, confidence: confidenceScore, relevance: relevanceScore };
        const w = question.weights;
        const overall = Math.round(
            dimensions.structure * w.structure +
            dimensions.clarity * w.clarity +
            dimensions.persuasion * w.persuasion +
            dimensions.confidence * w.confidence +
            dimensions.relevance * w.relevance
        );

        // Generate feedback
        let feedback = '';
        const dimEntries = Object.entries(dimensions).sort((a, b) => a[1] - b[1]);
        const weakest = dimEntries[0];
        const strongest = dimEntries[dimEntries.length - 1];
        feedback += 'Strongest: ' + strongest[0] + ' (' + strongest[1] + '). ';
        feedback += 'Needs work: ' + weakest[0] + ' (' + weakest[1] + '). ';
        if (keywordsMissed.length > 0) {
            feedback += 'Consider mentioning: ' + keywordsMissed.slice(0, 3).join(', ') + '.';
        }

        return {
            overall: overall,
            dimensions: dimensions,
            keywordsMatched: keywordsMatched,
            keywordsMissed: keywordsMissed,
            feedback: feedback
        };
    }

    // ==================== 6. AUTH MODULE ====================
    function openAuthModal(tab) {
        if (!fbReady) {
            showToast(t('_toast_firebase'), 'warning');
            return;
        }
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthTab(tab || 'signin');
        clearAuthError();
    }

    function closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        clearAuthError();
    }

    function clearAuthError() {
        const err = document.getElementById('auth-error');
        if (err) { err.textContent = ''; err.style.display = 'none'; }
    }

    function showAuthError(msg) {
        const err = document.getElementById('auth-error');
        if (err) { err.textContent = msg; err.style.display = 'block'; }
    }

    function switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        const signinForm = document.getElementById('auth-signin-form');
        const signupForm = document.getElementById('auth-signup-form');
        if (signinForm) signinForm.classList.toggle('active', tab === 'signin');
        if (signupForm) signupForm.classList.toggle('active', tab === 'signup');
        clearAuthError();
    }

    // Auth tab clicks
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
    });

    // Auth modal close
    const authModalClose = document.getElementById('auth-modal-close');
    if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);

    // Google sign-in
    function handleGoogleSignIn() {
        if (!fbReady || !fbAuth) { showToast(t('_toast_firebase'), 'warning'); return; }
        const provider = new firebase.auth.GoogleAuthProvider();
        fbAuth.signInWithPopup(provider)
            .then(() => {
                closeAuthModal();
                showToast(t('_toast_signedin'), 'success');
            })
            .catch(e => showAuthError(e.message));
    }

    const googleSignInBtn = document.getElementById('google-signin-btn');
    const googleSignUpBtn = document.getElementById('google-signup-btn');
    if (googleSignInBtn) googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    if (googleSignUpBtn) googleSignUpBtn.addEventListener('click', handleGoogleSignIn);

    // Email sign-in form
    const signinForm = document.getElementById('signin-email-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!fbReady || !fbAuth) { showToast(t('_toast_firebase'), 'warning'); return; }
            const email = document.getElementById('signin-email').value.trim();
            const password = document.getElementById('signin-password').value;
            fbAuth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    closeAuthModal();
                    showToast(t('_toast_signedin'), 'success');
                })
                .catch(e => showAuthError(e.message));
        });
    }

    // Email sign-up form
    const signupForm = document.getElementById('signup-email-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!fbReady || !fbAuth) { showToast(t('_toast_firebase'), 'warning'); return; }
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            fbAuth.createUserWithEmailAndPassword(email, password)
                .then((cred) => {
                    return cred.user.updateProfile({ displayName: name });
                })
                .then(() => {
                    closeAuthModal();
                    showToast(t('_toast_account_created'), 'success');
                })
                .catch(e => showAuthError(e.message));
        });
    }

    // Auth state change listener
    if (fbAuth) {
        fbAuth.onAuthStateChanged((user) => {
            currentUser = user;
            updateNavAuth(user);
            if (user && fbReady && fbDb) {
                const userRef = fbDb.collection('users').doc(user.uid);
                userRef.set({
                    name: user.displayName || '',
                    email: user.email || '',
                    photoURL: user.photoURL || '',
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true }).catch(e => console.warn('User doc update failed', e));
            }
        });
    }

    function updateNavAuth(user) {
        const authBtns = document.getElementById('nav-auth-btns');
        const userMenu = document.getElementById('nav-user-menu');
        const userName = document.getElementById('nav-user-name');
        const userEmail = document.getElementById('nav-user-email');
        const avatar = document.getElementById('nav-avatar');

        if (user) {
            if (authBtns) authBtns.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = user.displayName || 'User';
            if (userEmail) userEmail.textContent = user.email || '';
            if (avatar) {
                const initials = (user.displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                avatar.textContent = initials;
            }
        } else {
            if (authBtns) authBtns.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    function signOutUser() {
        if (!fbAuth) return;
        fbAuth.signOut().then(() => {
            currentUser = null;
            dashboardCache = null;
            showToast(t('_toast_signedout'), 'info');
            closeDropdown();
            // Close any overlays
            closeDashboard();
        }).catch(e => console.warn('Sign out error', e));
    }

    // Logout button
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', signOutUser);

    // CTA buttons: go directly to scenario modal (no auth required)
    document.querySelectorAll('.cta-open-auth').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openScenarioModal();
        });
    });

    // ==================== 7. SIMULATION ENGINE ====================
    function openScenarioModal() {
        const modal = document.getElementById('scenario-modal');
        const grid = document.getElementById('scenario-grid');
        if (!modal || !grid) return;

        grid.innerHTML = '';
        Object.keys(SCENARIOS).forEach(key => {
            const sc = SCENARIOS[key];
            const langLabel = sc.label[currentLang] || sc.label.en;
            const card = document.createElement('div');
            card.className = 'scenario-card';
            card.innerHTML = `
                <div class="scenario-icon">${sc.icon}</div>
                <h3 class="scenario-name">${langLabel}</h3>
                <div class="scenario-meta">
                    <span>${sc.questions.length} questions</span>
                    <span class="scenario-diff">${sc.difficulty}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                closeScenarioModal();
                startSimulation(key);
            });
            grid.appendChild(card);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeScenarioModal() {
        const modal = document.getElementById('scenario-modal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    const scenarioModalClose = document.getElementById('scenario-modal-close');
    if (scenarioModalClose) scenarioModalClose.addEventListener('click', closeScenarioModal);

    function startSimulation(scenarioKey) {
        const scenario = SCENARIOS[scenarioKey];
        if (!scenario) return;

        simState = {
            active: true,
            scenarioKey: scenarioKey,
            questionIndex: 0,
            exchanges: [],
            scores: { structure: 0, clarity: 0, persuasion: 0, confidence: 0, relevance: 0 },
            totalScored: 0
        };

        // Show simulation overlay
        const simPage = document.getElementById('simulation');
        const landing = document.querySelector('main');
        const hero = document.getElementById('hero');
        const nav = document.getElementById('nav-bar');
        const footer = document.querySelector('.site-footer');

        if (simPage) simPage.style.display = 'flex';
        if (landing) landing.style.display = 'none';
        if (hero) hero.style.display = 'none';
        if (footer) footer.style.display = 'none';

        // Set title
        const simTitle = document.getElementById('sim-title');
        const langLabel = scenario.label[currentLang] || scenario.label.en;
        if (simTitle) simTitle.textContent = langLabel;

        // Clear chat
        const chatArea = document.getElementById('sim-chat-area');
        if (chatArea) chatArea.innerHTML = '';

        // Reset scores display
        updateSimScores(null);

        // Enable input
        const simInput = document.getElementById('sim-input');
        const simSendBtn = document.getElementById('sim-send-btn');
        if (simInput) { simInput.disabled = false; simInput.value = ''; }
        if (simSendBtn) simSendBtn.disabled = false;

        // Show first question
        showQuestion(0);
    }

    function showQuestion(index) {
        const scenario = SCENARIOS[simState.scenarioKey];
        if (!scenario || index >= scenario.questions.length) {
            finishSimulation();
            return;
        }

        simState.questionIndex = index;
        const q = scenario.questions[index];

        // Update progress bar
        const progressBar = document.getElementById('sim-progress-bar');
        if (progressBar) {
            const pct = ((index) / scenario.questions.length) * 100;
            progressBar.style.width = pct + '%';
        }

        // Add AI bubble
        addChatBubble('ai', q.text);

        // Show hint
        const hintEl = document.getElementById('sim-hint');
        if (hintEl && q.hints && q.hints.length > 0) {
            hintEl.textContent = q.hints[Math.floor(Math.random() * q.hints.length)];
            hintEl.style.display = 'block';
        }

        // Focus input
        const simInput = document.getElementById('sim-input');
        if (simInput) simInput.focus();

        // Scroll chat to bottom
        const chatArea = document.getElementById('sim-chat-area');
        if (chatArea) setTimeout(() => chatArea.scrollTop = chatArea.scrollHeight, 100);
    }

    function submitAnswer() {
        const simInput = document.getElementById('sim-input');
        if (!simInput) return;
        const text = simInput.value.trim();
        if (!text) return;

        const scenario = SCENARIOS[simState.scenarioKey];
        if (!scenario) return;
        const q = scenario.questions[simState.questionIndex];

        // Add user bubble
        addChatBubble('user', text);

        // Score the response
        const result = scoreResponse(text, q);

        // Store exchange
        simState.exchanges.push({
            questionIndex: simState.questionIndex,
            question: q.text,
            answer: text,
            score: result
        });

        // Update running averages
        simState.totalScored++;
        Object.keys(simState.scores).forEach(dim => {
            simState.scores[dim] = Math.round(
                ((simState.scores[dim] * (simState.totalScored - 1)) + result.dimensions[dim]) / simState.totalScored
            );
        });

        // Show score feedback bubble
        const feedbackHtml = `<div class="score-feedback">
            <div class="score-feedback-overall"><strong>${result.overall}</strong>/100</div>
            <div class="score-feedback-dims">
                <span>STR ${result.dimensions.structure}</span>
                <span>CLR ${result.dimensions.clarity}</span>
                <span>PER ${result.dimensions.persuasion}</span>
                <span>CON ${result.dimensions.confidence}</span>
                <span>REL ${result.dimensions.relevance}</span>
            </div>
            <div class="score-feedback-text">${result.feedback}</div>
            ${result.keywordsMatched.length > 0 ? '<div class="score-keywords-row">' + result.keywordsMatched.map(k => '<span class="kw-tag kw-hit">' + k + '</span>').join('') + result.keywordsMissed.slice(0, 3).map(k => '<span class="kw-tag kw-miss">' + k + '</span>').join('') + '</div>' : ''}
        </div>`;
        addChatBubble('system', feedbackHtml, true);

        // Update sidebar scores
        updateSimScores(simState.scores);

        // Clear input
        simInput.value = '';
        autoResizeTextarea(simInput);

        // Advance to next question
        const nextIndex = simState.questionIndex + 1;
        if (nextIndex < scenario.questions.length) {
            setTimeout(() => showQuestion(nextIndex), 800);
        } else {
            setTimeout(() => finishSimulation(), 1000);
        }
    }

    function addChatBubble(speaker, text, isHtml) {
        const chatArea = document.getElementById('sim-chat-area');
        if (!chatArea) return;

        const bubble = document.createElement('div');
        bubble.className = 'sim-bubble sim-bubble-' + speaker;

        if (speaker === 'ai') {
            bubble.innerHTML = '<span class="sim-speaker">AI Interviewer</span><p>' + text + '</p>';
        } else if (speaker === 'user') {
            bubble.innerHTML = '<span class="sim-speaker">You</span><p>' + text + '</p>';
        } else {
            bubble.innerHTML = isHtml ? text : '<p>' + text + '</p>';
        }

        chatArea.appendChild(bubble);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function updateSimScores(scores) {
        const scoresEl = document.getElementById('sim-scores');
        const overallEl = document.getElementById('sim-score-overall');
        if (!scoresEl) return;

        if (!scores) {
            if (overallEl) overallEl.textContent = '--';
            return;
        }

        const overall = Math.round(
            (scores.structure + scores.clarity + scores.persuasion + scores.confidence + scores.relevance) / 5
        );
        if (overallEl) overallEl.textContent = overall;

        // Remove existing dimension cards (keep the overall card)
        scoresEl.querySelectorAll('.sim-dim-card').forEach(c => c.remove());

        const dims = [
            { key: 'structure', label: 'Structure' },
            { key: 'clarity', label: 'Clarity' },
            { key: 'persuasion', label: 'Persuasion' },
            { key: 'confidence', label: 'Confidence' },
            { key: 'relevance', label: 'Relevance' }
        ];
        dims.forEach(d => {
            const card = document.createElement('div');
            card.className = 'sim-dim-card';
            card.innerHTML = `<span class="sim-dim-label">${d.label}</span><span class="sim-dim-val">${scores[d.key]}</span>`;
            scoresEl.appendChild(card);
        });
    }

    function finishSimulation() {
        simState.active = false;

        // Disable input
        const simInput = document.getElementById('sim-input');
        const simSendBtn = document.getElementById('sim-send-btn');
        if (simInput) simInput.disabled = true;
        if (simSendBtn) simSendBtn.disabled = true;

        // Update progress bar to 100%
        const progressBar = document.getElementById('sim-progress-bar');
        if (progressBar) progressBar.style.width = '100%';

        // Calculate final scores
        const finalOverall = Math.round(
            (simState.scores.structure + simState.scores.clarity + simState.scores.persuasion + simState.scores.confidence + simState.scores.relevance) / 5
        );

        const sessionData = {
            scenarioKey: simState.scenarioKey,
            scenarioLabel: (SCENARIOS[simState.scenarioKey].label[currentLang] || SCENARIOS[simState.scenarioKey].label.en),
            exchanges: simState.exchanges,
            scores: { ...simState.scores },
            overall: finalOverall,
            timestamp: new Date().toISOString(),
            questionCount: SCENARIOS[simState.scenarioKey].questions.length
        };

        // Save to Firestore
        if (fbReady && fbDb && currentUser) {
            fbDb.collection('users').doc(currentUser.uid).collection('sessions').add(sessionData)
                .then(() => {
                    showToast(t('_toast_sim_saved'), 'success');
                    dashboardCache = null; // Invalidate cache
                })
                .catch(e => console.warn('Session save failed', e));
        }

        // Show result page
        setTimeout(() => showResultPage(sessionData), 500);
    }

    function showResultPage(sessionData) {
        const simPage = document.getElementById('simulation');
        const resultPage = document.getElementById('result-page');
        const container = document.getElementById('result-container');
        if (!resultPage || !container) return;

        if (simPage) simPage.style.display = 'none';
        resultPage.style.display = 'flex';

        const pct = sessionData.overall / 100;
        const circumference = 2 * Math.PI * 70;
        const offset = circumference * (1 - pct);

        let dimBarsHtml = '';
        const dimLabels = { structure: 'Structure', clarity: 'Clarity', persuasion: 'Persuasion', confidence: 'Confidence', relevance: 'Relevance' };
        Object.keys(dimLabels).forEach(dim => {
            const val = sessionData.scores[dim];
            dimBarsHtml += `
                <div class="result-dim">
                    <div class="result-dim-header">
                        <span>${dimLabels[dim]}</span>
                        <span class="result-dim-val">${val}</span>
                    </div>
                    <div class="result-dim-bar"><div class="result-dim-fill" style="width: ${val}%"></div></div>
                </div>`;
        });

        let exchangeHtml = '';
        sessionData.exchanges.forEach((ex, i) => {
            exchangeHtml += `
                <div class="result-exchange">
                    <div class="result-exchange-q"><strong>Q${i + 1}:</strong> ${ex.question}</div>
                    <div class="result-exchange-a"><strong>Your Answer:</strong> ${ex.answer}</div>
                    <div class="result-exchange-score">
                        <span class="result-exchange-overall">${ex.score.overall}/100</span>
                        <span class="result-exchange-feedback">${ex.score.feedback}</span>
                    </div>
                </div>`;
        });

        container.innerHTML = `
            <div class="result-card">
                <button class="result-close-btn" id="result-close-btn">&times;</button>
                <h2 class="result-title">${t('_result_title')}</h2>
                <p class="result-scenario">${sessionData.scenarioLabel}</p>
                <div class="result-ring-wrap">
                    <svg class="result-ring" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--bg-card-border, rgba(255,255,255,0.1))" stroke-width="10"/>
                        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--accent, #6C5CE7)" stroke-width="10"
                            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                            stroke-linecap="round" transform="rotate(-90 80 80)"/>
                    </svg>
                    <div class="result-ring-text">
                        <span class="result-ring-score">${sessionData.overall}</span>
                        <span class="result-ring-label">${t('_result_overall')}</span>
                    </div>
                </div>
                <h3 class="result-section-title">${t('_result_dimensions')}</h3>
                <div class="result-dims">${dimBarsHtml}</div>
                <h3 class="result-section-title">${t('_result_exchanges')}</h3>
                <div class="result-exchanges">${exchangeHtml}</div>
                <div class="result-actions">
                    <button class="btn btn-primary" id="result-retry-btn">${t('_result_retry')}</button>
                    <button class="btn btn-ghost" id="result-home-btn">${t('_result_home')}</button>
                </div>
            </div>`;

        // Wire up result buttons
        const retryBtn = document.getElementById('result-retry-btn');
        const homeBtn = document.getElementById('result-home-btn');
        const closeBtn = document.getElementById('result-close-btn');

        if (retryBtn) retryBtn.addEventListener('click', () => {
            resultPage.style.display = 'none';
            startSimulation(sessionData.scenarioKey);
        });

        const goHome = () => {
            resultPage.style.display = 'none';
            showLanding();
        };
        if (homeBtn) homeBtn.addEventListener('click', goHome);
        if (closeBtn) closeBtn.addEventListener('click', goHome);
    }

    // Leave confirmation
    const simBackBtn = document.getElementById('sim-back-btn');
    const leaveModal = document.getElementById('leave-modal');
    const leaveCancel = document.getElementById('leave-cancel');
    const leaveConfirm = document.getElementById('leave-confirm');

    if (simBackBtn) {
        simBackBtn.addEventListener('click', () => {
            if (simState.active || simState.exchanges.length > 0) {
                if (leaveModal) leaveModal.classList.add('active');
            } else {
                exitSimulation();
            }
        });
    }

    if (leaveCancel) {
        leaveCancel.addEventListener('click', () => {
            if (leaveModal) leaveModal.classList.remove('active');
        });
    }

    if (leaveConfirm) {
        leaveConfirm.addEventListener('click', () => {
            if (leaveModal) leaveModal.classList.remove('active');
            exitSimulation();
        });
    }

    function exitSimulation() {
        simState.active = false;
        const simPage = document.getElementById('simulation');
        if (simPage) simPage.style.display = 'none';
        showLanding();
    }

    function showLanding() {
        const landing = document.querySelector('main');
        const hero = document.getElementById('hero');
        const footer = document.querySelector('.site-footer');
        const dashboard = document.getElementById('dashboard');
        const resultPage = document.getElementById('result-page');
        const simPage = document.getElementById('simulation');

        if (landing) landing.style.display = '';
        if (hero) hero.style.display = '';
        if (footer) footer.style.display = '';
        if (dashboard) dashboard.style.display = 'none';
        if (resultPage) resultPage.style.display = 'none';
        if (simPage) simPage.style.display = 'none';
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
    }

    // Sim send button and enter key
    const simSendBtn = document.getElementById('sim-send-btn');
    if (simSendBtn) simSendBtn.addEventListener('click', submitAnswer);

    const simInput = document.getElementById('sim-input');
    if (simInput) {
        simInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitAnswer();
            }
        });
    }

    // ==================== 8. DEMO INTERACTIVITY ====================
    const demoResponses = [
        "That's a strong response. You effectively used data to support your claim. I notice you mentioned a 30% improvement - that kind of specificity is exactly what interviewers look for. For your next answer, try to also address the emotional aspect of stakeholder management. How did you build trust with the VP beyond just the data?",
        "Good follow-up. You're showing strong persuasion skills. Your mention of the prototype demonstration was particularly effective - showing rather than telling is a powerful technique. One area to improve: try to quantify the final business impact. What were the measurable results after your proposal was implemented?"
    ];

    const demoSendBtn = document.getElementById('demo-send-btn');
    const demoInput = document.getElementById('demo-input');
    const demoChatArea = document.getElementById('demo-chat-area');

    if (demoSendBtn && demoInput && demoChatArea) {
        demoSendBtn.addEventListener('click', handleDemoSend);
        demoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleDemoSend();
            }
        });
    }

    function handleDemoSend() {
        if (!demoInput || !demoChatArea) return;
        const text = demoInput.value.trim();
        if (!text) return;

        if (demoExchangeCount >= 2) {
            showToast(t('_demo_signup_prompt'), 'info');
            return;
        }

        // Add user bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'demo-bubble demo-bubble-user';
        userBubble.innerHTML = `<span class="demo-speaker">You</span><p>${escapeHtml(text)}</p>`;
        demoChatArea.appendChild(userBubble);

        demoInput.value = '';
        autoResizeTextarea(demoInput);
        demoChatArea.scrollTop = demoChatArea.scrollHeight;

        // Show typing indicator
        const typing = document.createElement('div');
        typing.className = 'demo-bubble demo-bubble-ai demo-typing';
        typing.innerHTML = '<span class="demo-speaker">Sarah Chen</span><p><span class="typing-dots"><span></span><span></span><span></span></span></p>';
        demoChatArea.appendChild(typing);
        demoChatArea.scrollTop = demoChatArea.scrollHeight;

        // AI response after delay
        setTimeout(() => {
            typing.remove();
            const aiBubble = document.createElement('div');
            aiBubble.className = 'demo-bubble demo-bubble-ai';
            const response = demoResponses[demoExchangeCount] || demoResponses[0];
            aiBubble.innerHTML = `<span class="demo-speaker">Sarah Chen</span><p>${response}</p>`;
            demoChatArea.appendChild(aiBubble);
            demoChatArea.scrollTop = demoChatArea.scrollHeight;

            demoExchangeCount++;

            // Update demo scores slightly
            updateDemoScores();

            if (demoExchangeCount >= 2) {
                setTimeout(() => {
                    const promptBubble = document.createElement('div');
                    promptBubble.className = 'demo-bubble demo-bubble-system';
                    promptBubble.innerHTML = `<p>${t('_demo_signup_prompt')}</p><button class="btn btn-primary btn-sm cta-open-auth demo-signup-btn">Sign Up Free</button>`;
                    demoChatArea.appendChild(promptBubble);
                    demoChatArea.scrollTop = demoChatArea.scrollHeight;

                    const signupBtn = promptBubble.querySelector('.demo-signup-btn');
                    if (signupBtn) {
                        signupBtn.addEventListener('click', () => {
                            openScenarioModal();
                        });
                    }
                }, 500);
            }
        }, 1500);
    }

    function updateDemoScores() {
        const scorePanel = document.querySelector('.demo-score-panel');
        if (!scorePanel) return;
        const dimValues = scorePanel.querySelectorAll('.dim-value');
        const dimFills = scorePanel.querySelectorAll('.dim-fill');
        dimValues.forEach((el, i) => {
            const current = parseInt(el.textContent) || 0;
            const bump = Math.floor(Math.random() * 4) + 1;
            const newVal = Math.min(99, current + bump);
            el.textContent = newVal;
            if (dimFills[i]) dimFills[i].style.width = newVal + '%';
        });
        const scoreValue = scorePanel.querySelector('.score-value');
        if (scoreValue) {
            const current = parseInt(scoreValue.textContent) || 0;
            scoreValue.textContent = Math.min(99, current + Math.floor(Math.random() * 3) + 1);
        }
    }

    // ==================== 9. DASHBOARD ====================
    function openDashboard() {
        const dashboard = document.getElementById('dashboard');
        const landing = document.querySelector('main');
        const hero = document.getElementById('hero');
        const footer = document.querySelector('.site-footer');

        if (dashboard) dashboard.style.display = 'flex';
        if (landing) landing.style.display = 'none';
        if (hero) hero.style.display = 'none';
        if (footer) footer.style.display = 'none';

        loadDashboardData();
    }

    function closeDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard && dashboard.style.display !== 'none') {
            showLanding();
        }
    }

    function loadDashboardData() {
        if (!fbReady || !fbDb || !currentUser) {
            renderDashboard({ sessions: [], stats: { total: 0, avg: 0, best: 0, streak: 0 }, progress: {} });
            return;
        }

        if (dashboardCache) {
            renderDashboard(dashboardCache);
            return;
        }

        fbDb.collection('users').doc(currentUser.uid).collection('sessions')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get()
            .then(snapshot => {
                const sessions = [];
                snapshot.forEach(doc => sessions.push({ id: doc.id, ...doc.data() }));

                let total = sessions.length;
                let sumOverall = 0;
                let best = 0;
                const progress = {};

                sessions.forEach(s => {
                    sumOverall += (s.overall || 0);
                    if ((s.overall || 0) > best) best = s.overall;
                    const key = s.scenarioKey || 'unknown';
                    if (!progress[key]) progress[key] = { scores: [], best: 0 };
                    progress[key].scores.push(s.overall || 0);
                    if ((s.overall || 0) > progress[key].best) progress[key].best = s.overall;
                });

                // Calculate streak (consecutive days with sessions)
                let streak = 0;
                if (sessions.length > 0) {
                    streak = 1;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    for (let i = 0; i < sessions.length - 1; i++) {
                        const d1 = new Date(sessions[i].timestamp);
                        const d2 = new Date(sessions[i + 1].timestamp);
                        d1.setHours(0, 0, 0, 0);
                        d2.setHours(0, 0, 0, 0);
                        const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
                        if (diff <= 1) streak++;
                        else break;
                    }
                }

                const data = {
                    sessions: sessions,
                    stats: {
                        total: total,
                        avg: total > 0 ? Math.round(sumOverall / total) : 0,
                        best: best,
                        streak: streak
                    },
                    progress: progress
                };

                dashboardCache = data;
                renderDashboard(data);
            })
            .catch(e => {
                console.warn('Dashboard load failed', e);
                renderDashboard({ sessions: [], stats: { total: 0, avg: 0, best: 0, streak: 0 }, progress: {} });
            });
    }

    function renderDashboard(data) {
        const statsEl = document.getElementById('dash-stats');
        const sessionsEl = document.getElementById('dash-sessions');
        const progressEl = document.getElementById('dash-progress');

        // Stats
        if (statsEl) {
            statsEl.innerHTML = `
                <div class="dash-stat-card">
                    <span class="dash-stat-val">${data.stats.total}</span>
                    <span class="dash-stat-label">${t('_dash_total')}</span>
                </div>
                <div class="dash-stat-card">
                    <span class="dash-stat-val">${data.stats.avg}</span>
                    <span class="dash-stat-label">${t('_dash_avg')}</span>
                </div>
                <div class="dash-stat-card">
                    <span class="dash-stat-val">${data.stats.best}</span>
                    <span class="dash-stat-label">${t('_dash_best')}</span>
                </div>
                <div class="dash-stat-card">
                    <span class="dash-stat-val">${data.stats.streak}</span>
                    <span class="dash-stat-label">${t('_dash_streak')}</span>
                </div>`;
        }

        // Sessions
        if (sessionsEl) {
            if (data.sessions.length === 0) {
                sessionsEl.innerHTML = '<p class="dash-empty">No sessions yet. Start a simulation to see your results here.</p>';
            } else {
                sessionsEl.innerHTML = data.sessions.map(s => {
                    const date = s.timestamp ? new Date(s.timestamp).toLocaleDateString() : '';
                    return `
                        <div class="dash-session-card">
                            <div class="dash-session-info">
                                <span class="dash-session-scenario">${s.scenarioLabel || s.scenarioKey || 'Session'}</span>
                                <span class="dash-session-date">${date}</span>
                            </div>
                            <div class="dash-session-score">${s.overall || 0}</div>
                        </div>`;
                }).join('');
            }
        }

        // Progress by scenario
        if (progressEl) {
            const keys = Object.keys(data.progress);
            if (keys.length === 0) {
                progressEl.innerHTML = '<p class="dash-empty">Complete simulations in different scenarios to track progress.</p>';
            } else {
                progressEl.innerHTML = keys.map(key => {
                    const p = data.progress[key];
                    const sc = SCENARIOS[key];
                    const label = sc ? (sc.label[currentLang] || sc.label.en) : key;
                    const avg = Math.round(p.scores.reduce((a, b) => a + b, 0) / p.scores.length);
                    return `
                        <div class="dash-progress-card">
                            <h4>${label}</h4>
                            <div class="dash-progress-stats">
                                <span>Best: ${p.best}</span>
                                <span>Avg: ${avg}</span>
                                <span>Sessions: ${p.scores.length}</span>
                            </div>
                            <div class="dash-progress-bar">
                                <div class="dash-progress-fill" style="width: ${avg}%"></div>
                            </div>
                        </div>`;
                }).join('');
            }
        }
    }

    // Dashboard buttons
    const dashBtn = document.getElementById('nav-dashboard-btn');
    if (dashBtn) dashBtn.addEventListener('click', () => { closeDropdown(); openDashboard(); });

    const dashBackBtn = document.getElementById('dash-back-btn');
    if (dashBackBtn) dashBackBtn.addEventListener('click', () => showLanding());

    // ==================== 10. UI UTILITIES ====================

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            // Close all
            document.querySelectorAll('.faq-item').forEach(fi => fi.classList.remove('active'));
            // Toggle clicked
            if (!isActive) item.classList.add('active');
        });
    });

    // --- Pricing Toggle ---
    const pricingSwitch = document.getElementById('pricing-switch');
    const toggleMonthly = document.getElementById('toggle-monthly');
    const toggleAnnual = document.getElementById('toggle-annual');

    if (pricingSwitch) {
        pricingSwitch.addEventListener('click', () => {
            isAnnual = !isAnnual;
            pricingSwitch.classList.toggle('active', isAnnual);
            if (toggleMonthly) toggleMonthly.classList.toggle('pricing-toggle-active', !isAnnual);
            if (toggleAnnual) toggleAnnual.classList.toggle('pricing-toggle-active', isAnnual);

            document.querySelectorAll('.price-amount[data-monthly]').forEach(el => {
                const price = isAnnual ? el.dataset.annual : el.dataset.monthly;
                el.textContent = '$' + price;
            });
        });
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Close mobile nav
                const navLinks = document.getElementById('nav-links');
                if (navLinks) navLinks.classList.remove('active');
                const hamburger = document.getElementById('nav-hamburger');
                if (hamburger) hamburger.classList.remove('active');

                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Watch Demo button smooth scroll ---
    const watchDemoBtn = document.getElementById('watch-demo-btn');
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', () => {
            const demoSection = document.getElementById('demo');
            if (demoSection) demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- IntersectionObserver for animations ---
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll, .step-card, .feature-card, .audience-card, .testimonial-card, .pricing-card, .faq-item').forEach(el => {
        animObserver.observe(el);
    });

    // --- Hero Counter Animation ---
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        document.querySelectorAll('.metric-number[data-target]').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const isPercent = counter.classList.contains('metric-percent');
            const duration = 2000;
            const start = performance.now();

            function updateCounter(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);

                if (target >= 1000) {
                    counter.textContent = current.toLocaleString();
                } else {
                    counter.textContent = current;
                }

                if (isPercent) {
                    counter.textContent = current + '%';
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 1000) {
                        counter.textContent = target.toLocaleString();
                    } else if (isPercent) {
                        counter.textContent = target + '%';
                    } else {
                        counter.textContent = target;
                    }
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) animateCounters();
        });
    }, { threshold: 0.3 });

    const heroMetrics = document.querySelector('.hero-metrics');
    if (heroMetrics) heroObserver.observe(heroMetrics);

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Apply saved theme
        applyTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('clozer-theme', currentTheme);
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const moonIcon = document.querySelector('.icon-moon');
        const sunIcon = document.querySelector('.icon-sun');
        if (moonIcon) moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
        if (sunIcon) sunIcon.style.display = theme === 'light' ? 'block' : 'none';
    }

    // --- Language Selector ---
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => {
                setLang(opt.dataset.lang);
                langDropdown.classList.remove('active');
            });
        });
    }

    // --- Mobile Nav Hamburger ---
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- User dropdown ---
    const avatarBtn = document.getElementById('nav-avatar-btn');
    const userDropdown = document.getElementById('nav-user-dropdown');

    if (avatarBtn && userDropdown) {
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
    }

    function closeDropdown() {
        if (userDropdown) userDropdown.classList.remove('active');
    }

    // --- Toast ---
    function showToast(msg, type) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.className = 'toast';
        if (type) toast.classList.add('toast-' + type);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- Textarea Auto-Resize ---
    function autoResizeTextarea(el) {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    }

    if (simInput) {
        simInput.addEventListener('input', () => autoResizeTextarea(simInput));
    }
    if (demoInput) {
        demoInput.addEventListener('input', () => autoResizeTextarea(demoInput));
    }

    // --- Modal overlay click to close ---
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Privacy / Terms Modal ---
    const privacyLink = document.getElementById('footer-privacy-link');
    const privacyModal = document.getElementById('privacy-modal');
    const privacyClose = document.getElementById('privacy-close');

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (privacyClose && privacyModal) {
        privacyClose.addEventListener('click', () => {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    const termsLink = document.getElementById('footer-terms-link');
    const termsModal = document.getElementById('terms-modal');
    const termsClose = document.getElementById('terms-close');

    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (termsClose && termsModal) {
        termsClose.addEventListener('click', () => {
            termsModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // --- Nav Scroll Effect ---
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const navBar = document.getElementById('nav-bar');
        if (!navBar) return;
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    }, { passive: true });

    // --- Close dropdowns on outside click ---
    document.addEventListener('click', (e) => {
        // Close lang dropdown
        if (langDropdown && !langDropdown.contains(e.target) && langBtn && !langBtn.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
        // Close user dropdown
        if (userDropdown && !userDropdown.contains(e.target) && avatarBtn && !avatarBtn.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
        // Close mobile nav on link click
        if (navLinks && navLinks.classList.contains('active') && e.target.closest('.nav-links a')) {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });

    // --- Settings button placeholder ---
    const settingsBtn = document.getElementById('nav-settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            closeDropdown();
            showToast('Settings coming soon.', 'info');
        });
    }

    // --- Escape key closes modals ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                m.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });

    // --- HTML escape utility ---
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ==================== INIT ====================
    // Apply saved language
    setLang(currentLang);
    // Apply saved theme
    applyTheme(currentTheme);

});
