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

        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    // ==================== 4. SCENARIOS ====================
    const SCENARIOS = {
        behavioral: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
            label: { en: 'Behavioral Interview', ko: '행동 면접', ja: '行動面接', es: 'Entrevista Conductual' },
            difficulty: 'Intermediate',
            questions: [
                {
                    text: 'Tell me about a time you had to lead a team through a difficult situation. What was the outcome?',
                    keywords: ['leadership', 'team', 'challenge', 'outcome', 'result', 'strategy', 'communication'],
                    hints: ['Use the STAR method', 'Mention specific metrics or results', 'Describe your leadership approach'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: 'Describe a situation where you had to deal with a conflict between team members. How did you resolve it?',
                    keywords: ['conflict', 'resolution', 'mediation', 'communication', 'empathy', 'compromise', 'team'],
                    hints: ['Show emotional intelligence', 'Explain the resolution process', 'Highlight the positive outcome'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: 'Give me an example of when you failed at something. What did you learn from it?',
                    keywords: ['failure', 'learning', 'growth', 'improvement', 'reflection', 'adaptation', 'resilience'],
                    hints: ['Be honest about the failure', 'Focus on what you learned', 'Show growth mindset'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.20, confidence: 0.25, relevance: 0.15 }
                },
                {
                    text: 'Tell me about a time you had to make a decision with incomplete information. What was your approach?',
                    keywords: ['decision', 'uncertainty', 'analysis', 'risk', 'judgment', 'data', 'stakeholder'],
                    hints: ['Explain your decision framework', 'Show analytical thinking', 'Mention the outcome'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: 'Describe a situation where you went above and beyond what was expected. Why did you do it?',
                    keywords: ['initiative', 'ownership', 'impact', 'motivation', 'excellence', 'proactive', 'value'],
                    hints: ['Quantify the impact', 'Explain your motivation', 'Show passion for the work'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.20, confidence: 0.20, relevance: 0.20 }
                }
            ]
        },
        technical: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
            label: { en: 'Technical Interview', ko: '기술 면접', ja: '技術面接', es: 'Entrevista Tecnica' },
            difficulty: 'Advanced',
            questions: [
                {
                    text: 'Walk me through a complex technical project you led. What architecture decisions did you make and why?',
                    keywords: ['architecture', 'scalability', 'trade-off', 'design', 'performance', 'system', 'decision'],
                    hints: ['Explain the technical constraints', 'Discuss trade-offs', 'Mention scale and performance'],
                    weights: { structure: 0.25, clarity: 0.25, persuasion: 0.10, confidence: 0.15, relevance: 0.25 }
                },
                {
                    text: 'How would you design a system that handles 10 million requests per second with 99.99% uptime?',
                    keywords: ['scalability', 'redundancy', 'load-balancing', 'caching', 'microservices', 'monitoring', 'failover'],
                    hints: ['Think about horizontal scaling', 'Discuss caching strategies', 'Mention monitoring and alerting'],
                    weights: { structure: 0.30, clarity: 0.25, persuasion: 0.05, confidence: 0.15, relevance: 0.25 }
                },
                {
                    text: 'Describe a time you had to debug a critical production issue. What was your systematic approach?',
                    keywords: ['debugging', 'systematic', 'logs', 'monitoring', 'root-cause', 'incident', 'resolution'],
                    hints: ['Walk through your process step by step', 'Mention tools you used', 'Explain the root cause'],
                    weights: { structure: 0.25, clarity: 0.25, persuasion: 0.10, confidence: 0.15, relevance: 0.25 }
                },
                {
                    text: 'How do you approach testing and quality assurance in your projects? Give a specific example.',
                    keywords: ['testing', 'unit-test', 'integration', 'CI/CD', 'coverage', 'quality', 'automation'],
                    hints: ['Discuss your testing philosophy', 'Mention specific frameworks', 'Show coverage awareness'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.10, confidence: 0.20, relevance: 0.25 }
                },
                {
                    text: 'Explain a technical concept you recently learned to me as if I were a non-technical stakeholder.',
                    keywords: ['simplification', 'analogy', 'communication', 'clarity', 'audience', 'translation', 'example'],
                    hints: ['Use a real-world analogy', 'Avoid jargon', 'Check for understanding'],
                    weights: { structure: 0.20, clarity: 0.35, persuasion: 0.10, confidence: 0.15, relevance: 0.20 }
                }
            ]
        },
        salary: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
            label: { en: 'Salary Negotiation', ko: '연봉 협상', ja: '給与交渉', es: 'Negociacion Salarial' },
            difficulty: 'Advanced',
            questions: [
                {
                    text: 'We\'d like to offer you $95,000 for this role. How do you feel about that number?',
                    keywords: ['market-rate', 'value', 'research', 'contribution', 'experience', 'competitive', 'range'],
                    hints: ['Don\'t accept the first offer', 'Reference market data', 'Express enthusiasm for the role first'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.25, relevance: 0.10 }
                },
                {
                    text: 'Our budget for this position is firm. We really can\'t go higher than the offer. What are your thoughts?',
                    keywords: ['alternative', 'benefits', 'equity', 'signing-bonus', 'flexibility', 'review', 'total-compensation'],
                    hints: ['Explore non-salary compensation', 'Ask about equity or bonuses', 'Propose a performance review timeline'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.25, relevance: 0.10 }
                },
                {
                    text: 'What salary range are you expecting, and how did you arrive at that figure?',
                    keywords: ['data', 'market', 'Glassdoor', 'experience', 'skills', 'impact', 'range', 'benchmark'],
                    hints: ['Give a range, not a single number', 'Back it up with data', 'Tie it to the value you bring'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.25, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: 'You\'re asking for more than what others at this level make here. Can you justify that?',
                    keywords: ['differentiation', 'unique', 'skills', 'impact', 'revenue', 'track-record', 'ROI'],
                    hints: ['Highlight unique qualifications', 'Quantify your past impact', 'Stay collaborative, not adversarial'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.25, relevance: 0.10 }
                },
                {
                    text: 'We have another candidate willing to accept a lower offer. Why should we pay you more?',
                    keywords: ['value', 'unique', 'long-term', 'quality', 'retention', 'investment', 'ROI', 'fit'],
                    hints: ['Don\'t compete on price', 'Focus on long-term value', 'Highlight cultural and skill fit'],
                    weights: { structure: 0.15, clarity: 0.15, persuasion: 0.35, confidence: 0.25, relevance: 0.10 }
                }
            ]
        },
        sales: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            label: { en: 'Sales Call', ko: '영업 통화', ja: '営業コール', es: 'Llamada de Ventas' },
            difficulty: 'Intermediate',
            questions: [
                {
                    text: 'I appreciate the demo, but we\'re currently using a competitor\'s solution and it works fine. Why should we switch?',
                    keywords: ['differentiation', 'ROI', 'integration', 'support', 'savings', 'performance', 'migration'],
                    hints: ['Acknowledge their current solution', 'Highlight unique advantages', 'Quantify the switching benefit'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: 'Your pricing seems high compared to alternatives. Can you help me understand the value?',
                    keywords: ['value', 'ROI', 'TCO', 'savings', 'quality', 'support', 'features', 'cost-per-use'],
                    hints: ['Don\'t apologize for pricing', 'Reframe cost as investment', 'Use specific ROI examples'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: 'I need to get buy-in from my team before making a decision. What would you suggest?',
                    keywords: ['stakeholder', 'champion', 'pilot', 'trial', 'presentation', 'case-study', 'decision-maker'],
                    hints: ['Offer to help with internal buy-in', 'Suggest a pilot program', 'Provide relevant case studies'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.25, confidence: 0.15, relevance: 0.20 }
                },
                {
                    text: 'We had a bad experience with a similar product before. How is yours different?',
                    keywords: ['reliability', 'support', 'track-record', 'guarantee', 'SLA', 'testimonial', 'improvement'],
                    hints: ['Empathize with their experience', 'Provide concrete differentiators', 'Offer risk-reduction options'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: 'This looks promising, but the timing isn\'t right. Can we revisit in Q3?',
                    keywords: ['urgency', 'cost-of-delay', 'competitive', 'early-adopter', 'pilot', 'ROI', 'momentum'],
                    hints: ['Create urgency without pressure', 'Quantify cost of waiting', 'Offer flexible start options'],
                    weights: { structure: 0.15, clarity: 0.20, persuasion: 0.30, confidence: 0.20, relevance: 0.15 }
                }
            ]
        },
        investor: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
            label: { en: 'Investor Pitch', ko: '투자자 피칭', ja: '投資家ピッチ', es: 'Pitch a Inversores' },
            difficulty: 'Elite',
            questions: [
                {
                    text: 'You have 60 seconds. Tell me why I should invest in your company.',
                    keywords: ['market', 'traction', 'team', 'vision', 'revenue', 'growth', 'problem', 'solution'],
                    hints: ['Lead with the problem and market size', 'Mention traction or revenue', 'End with the ask'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.25, confidence: 0.20, relevance: 0.10 }
                },
                {
                    text: 'What makes your team uniquely qualified to win this market?',
                    keywords: ['experience', 'domain', 'track-record', 'exits', 'expertise', 'network', 'unfair-advantage'],
                    hints: ['Highlight relevant experience', 'Mention any exits or successes', 'Show domain expertise'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.25, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: 'Your market has several well-funded competitors. What\'s your moat?',
                    keywords: ['moat', 'defensibility', 'network-effect', 'IP', 'data', 'brand', 'switching-cost', 'technology'],
                    hints: ['Be specific about your competitive advantage', 'Explain why it\'s defensible', 'Use concrete examples'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.25, confidence: 0.20, relevance: 0.15 }
                },
                {
                    text: 'Walk me through your unit economics and path to profitability.',
                    keywords: ['CAC', 'LTV', 'margin', 'burn-rate', 'runway', 'breakeven', 'revenue', 'growth-rate'],
                    hints: ['Know your key metrics cold', 'Show a clear path to profitability', 'Be honest about current stage'],
                    weights: { structure: 0.30, clarity: 0.25, persuasion: 0.15, confidence: 0.15, relevance: 0.15 }
                },
                {
                    text: 'What happens if your primary growth channel stops working tomorrow?',
                    keywords: ['diversification', 'resilience', 'channels', 'organic', 'retention', 'pivot', 'contingency'],
                    hints: ['Show you\'ve thought about this', 'Discuss channel diversification', 'Highlight organic growth'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.20, confidence: 0.25, relevance: 0.15 }
                }
            ]
        },
        executive: {
            icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            label: { en: 'Executive Presence', ko: '임원 프레젠스', ja: 'エグゼクティブプレゼンス', es: 'Presencia Ejecutiva' },
            difficulty: 'Elite',
            questions: [
                {
                    text: 'The board is concerned about our declining market share. Present your strategic plan in 2 minutes.',
                    keywords: ['strategy', 'data', 'market', 'competitive', 'innovation', 'timeline', 'KPI', 'accountability'],
                    hints: ['Start with the situation analysis', 'Present 3 strategic pillars', 'End with measurable outcomes'],
                    weights: { structure: 0.30, clarity: 0.20, persuasion: 0.20, confidence: 0.20, relevance: 0.10 }
                },
                {
                    text: 'Your division is over budget and behind schedule on the flagship project. Explain to the CEO.',
                    keywords: ['accountability', 'root-cause', 'mitigation', 'timeline', 'resources', 'priority', 'recovery'],
                    hints: ['Own the situation', 'Explain root causes clearly', 'Present a concrete recovery plan'],
                    weights: { structure: 0.25, clarity: 0.20, persuasion: 0.15, confidence: 0.25, relevance: 0.15 }
                },
                {
                    text: 'We need to lay off 15% of the workforce. How would you communicate this to the organization?',
                    keywords: ['empathy', 'transparency', 'plan', 'support', 'vision', 'severance', 'morale', 'future'],
                    hints: ['Lead with empathy', 'Be transparent about reasons', 'Outline support for affected employees'],
                    weights: { structure: 0.20, clarity: 0.25, persuasion: 0.15, confidence: 0.20, relevance: 0.20 }
                },
                {
                    text: 'A major client is threatening to leave due to a service failure. How do you handle this meeting?',
                    keywords: ['accountability', 'solution', 'relationship', 'compensation', 'prevention', 'trust', 'commitment'],
                    hints: ['Acknowledge the issue immediately', 'Present concrete remediation', 'Commit to preventing recurrence'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.20, confidence: 0.25, relevance: 0.15 }
                },
                {
                    text: 'You disagree with the CEO\'s new strategic direction. How do you constructively push back in front of the executive team?',
                    keywords: ['respect', 'data', 'alternative', 'risk', 'alignment', 'constructive', 'evidence', 'proposal'],
                    hints: ['Show respect while disagreeing', 'Use data to support your position', 'Offer a constructive alternative'],
                    weights: { structure: 0.20, clarity: 0.20, persuasion: 0.25, confidence: 0.25, relevance: 0.10 }
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

    // CTA buttons: open auth modal or scenario modal
    document.querySelectorAll('.cta-open-auth').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                openScenarioModal();
            } else {
                const tab = btn.dataset.tab || 'signup';
                openAuthModal(tab);
            }
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
                            if (currentUser) openScenarioModal();
                            else openAuthModal('signup');
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
