document.addEventListener('DOMContentLoaded', () => {

    // ==================== SCENARIO DATA ====================
    const scenarios = {
        cafe: {
            title: '카페 알바 면접',
            icon: '☕',
            difficulty: '초급',
            time: '3분',
            desc: '동네 카페 사장님과의 면접',
            steps: [
                {
                    speaker: 'interviewer',
                    text: '안녕하세요, 지원해주셔서 감사합니다. 간단하게 자기소개 해주실래요?',
                    options: [
                        { text: '안녕하세요! 저는 근처에 사는 학생이고, 카페 일에 관심이 많아서 지원했습니다. 성실하게 일하겠습니다.', score: 3, next: 1 },
                        { text: '네... 저는... 알바 구하고 있어서요...', score: 1, next: 1 },
                        { text: '안녕하세요. 평소에 커피를 좋아하고, 이 카페 분위기가 좋아서 여기서 일하고 싶었습니다.', score: 3, next: 1 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '왜 저희 카페에 지원하게 됐어요?',
                    options: [
                        { text: '집에서 가까워서 출퇴근이 편할 것 같고, 이 카페 분위기가 좋아서 오래 일하고 싶습니다.', score: 3, next: 2 },
                        { text: '돈이 필요해서요.', score: 1, next: 2 },
                        { text: '카페에서 일하는 경험을 쌓고 싶었고, 사장님 가게가 후기가 좋아서 지원했습니다.', score: 3, next: 2 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '근무 가능한 시간대가 어떻게 돼요?',
                    options: [
                        { text: '평일은 오후 2시부터 저녁까지 가능하고, 주말은 종일 가능합니다. 시험 기간에는 미리 말씀드리겠습니다.', score: 3, next: 3 },
                        { text: '아무 때나 다 돼요.', score: 1, next: 3 },
                        { text: '수업이 끝나는 평일 오후와 주말 오전에 가능합니다. 구체적인 스케줄은 조율 가능합니다.', score: 3, next: 3 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '만약 손님이 음료가 맛이 없다고 화를 내면 어떻게 하겠어요?',
                    options: [
                        { text: '먼저 죄송하다고 사과하고, 어떤 부분이 불편하셨는지 여쭤본 후 새로 만들어 드리겠습니다. 해결이 안 되면 사장님께 도움을 요청하겠습니다.', score: 3, next: 4 },
                        { text: '그냥 새로 만들어 드리면 되지 않을까요?', score: 2, next: 4 },
                        { text: '저도 화가 날 것 같은데... 참아야겠죠?', score: 1, next: 4 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '마지막으로 궁금한 거 있으면 물어봐도 돼요.',
                    options: [
                        { text: '근무할 때 유니폼이 따로 있나요? 그리고 교육 기간이 어느 정도인지 궁금합니다.', score: 3, next: -1 },
                        { text: '시급이 얼마인지 다시 한번 확인해도 될까요? 그리고 교통비 지원이 되나요?', score: 2, next: -1 },
                        { text: '아뇨, 없습니다.', score: 1, next: -1 }
                    ]
                }
            ],
            passThreshold: 10,
            results: {
                pass: {
                    emoji: '🎉',
                    status: '합격!',
                    message: '축하합니다! 면접을 잘 보셨어요. 사장님이 함께 일하고 싶다고 느꼈을 겁니다.',
                    tips: [
                        '자기소개에서 성실함을 잘 어필했어요',
                        '구체적인 근무 시간 답변이 좋았어요',
                        '돌발 상황 대처 답변이 논리적이에요'
                    ]
                },
                fail: {
                    emoji: '😥',
                    status: '불합격',
                    message: '아쉽지만 이번에는 떨어졌어요. 하지만 괜찮아요, 다시 연습하면 됩니다!',
                    tips: [
                        '자기소개를 좀 더 구체적으로 준비해보세요',
                        '지원 동기에 "돈" 외의 이유를 추가하세요',
                        '근무 시간은 구체적으로 말하는 게 좋아요',
                        '돌발 상황 대처 공식: 사과 → 경청 → 해결 → 보고'
                    ]
                }
            }
        },
        convenience: {
            title: '편의점 알바 면접',
            icon: '🏪',
            difficulty: '초급',
            time: '3분',
            desc: '편의점 점장님과의 면접',
            steps: [
                {
                    speaker: 'interviewer',
                    text: '반갑습니다. 자기소개 간단하게 해주세요.',
                    options: [
                        { text: '안녕하세요! 꼼꼼하고 책임감 있는 성격이라 편의점 업무에 잘 맞을 것 같아 지원했습니다.', score: 3, next: 1 },
                        { text: '안녕하세요. 저는 학생이고 알바 하려고요.', score: 1, next: 1 },
                        { text: '안녕하세요. 근처에 살고 있고, 편의점에서 정리 정돈하는 일을 잘할 자신이 있습니다.', score: 3, next: 1 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '편의점 알바 경험이 있어요?',
                    options: [
                        { text: '직접 경험은 없지만, 평소 편의점을 자주 이용해서 업무 흐름은 어느 정도 알고 있습니다. 빠르게 배우겠습니다.', score: 3, next: 2 },
                        { text: '네, 이전에 6개월 정도 해봤습니다. POS 계산, 재고 정리, 진열 등 기본 업무는 익숙합니다.', score: 3, next: 2 },
                        { text: '아뇨, 처음이에요.', score: 1, next: 2 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '야간 근무도 가능해요?',
                    options: [
                        { text: '주말 야간은 가능합니다. 평일 야간은 수업 일정에 따라 조율이 필요한데, 미리 말씀드리겠습니다.', score: 3, next: 3 },
                        { text: '야간은 좀 어렵습니다. 대신 주간과 저녁 시간대에 최대한 유연하게 근무할 수 있습니다.', score: 2, next: 3 },
                        { text: '야간은 싫어요.', score: 1, next: 3 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '유통기한 지난 상품을 발견했는데, 어떻게 하겠어요?',
                    options: [
                        { text: '즉시 진열대에서 제거하고, 따로 분리해 놓은 후 점장님께 보고하겠습니다. 주변 상품도 함께 확인하겠습니다.', score: 3, next: 4 },
                        { text: '버리면 되지 않나요?', score: 1, next: 4 },
                        { text: '진열대에서 빼놓고 점장님께 말씀드리겠습니다.', score: 2, next: 4 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '마지막으로 하고 싶은 말 있으면 해주세요.',
                    options: [
                        { text: '성실하게 오래 일하고 싶습니다. 빠르게 적응해서 점장님의 부담을 줄여드리겠습니다.', score: 3, next: -1 },
                        { text: '열심히 하겠습니다. 언제부터 출근하면 될까요?', score: 2, next: -1 },
                        { text: '특별히 없습니다.', score: 1, next: -1 }
                    ]
                }
            ],
            passThreshold: 10,
            results: {
                pass: {
                    emoji: '🎉',
                    status: '합격!',
                    message: '잘 하셨어요! 점장님이 성실한 인상을 받았을 겁니다. 바로 일할 준비가 됐네요.',
                    tips: [
                        '경험이 없어도 배우려는 자세가 좋았어요',
                        '근무 시간에 대해 정직하게 답변한 점이 좋아요',
                        '유통기한 문제 대처가 체계적이에요'
                    ]
                },
                fail: {
                    emoji: '😥',
                    status: '불합격',
                    message: '이번엔 아쉬웠어요. 몇 가지만 개선하면 다음엔 합격할 수 있어요!',
                    tips: [
                        '경험이 없으면 "빠르게 배우겠다"는 의지를 보여주세요',
                        '근무 조건은 정직하되 긍정적으로 답하세요',
                        '문제 상황 대처: 발견 → 분리 → 보고 순서를 기억하세요',
                        '마지막에 의욕을 보여주면 좋은 인상을 남겨요'
                    ]
                }
            }
        },
        restaurant: {
            title: '음식점 알바 면접',
            icon: '🍽️',
            difficulty: '초급',
            time: '3분',
            desc: '음식점 매니저와의 면접',
            steps: [
                {
                    speaker: 'interviewer',
                    text: '어서오세요. 자기소개 부탁해요.',
                    options: [
                        { text: '안녕하세요! 체력에 자신 있고, 사람들과 소통하는 걸 좋아해서 홀 서빙에 지원했습니다.', score: 3, next: 1 },
                        { text: '안녕하세요. 알바 지원한 학생입니다.', score: 1, next: 1 },
                        { text: '안녕하세요. 음식점에서 일하면서 서비스 경험을 쌓고 싶어서 지원했습니다. 밝은 성격이라 손님 응대에 자신 있습니다.', score: 3, next: 1 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '음식점은 체력적으로 힘든데, 괜찮아요?',
                    options: [
                        { text: '네, 평소에 운동을 해서 체력에는 자신 있습니다. 바쁜 시간대에도 집중해서 일할 수 있어요.', score: 3, next: 2 },
                        { text: '아마... 괜찮을 것 같아요.', score: 1, next: 2 },
                        { text: '체력은 자신 있습니다. 이전에 행사 스태프를 해본 적이 있어서 장시간 서 있는 것도 괜찮습니다.', score: 3, next: 2 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '바쁜 시간에 동시에 여러 테이블에서 주문이 들어오면 어떻게 하겠어요?',
                    options: [
                        { text: '먼저 온 순서대로 주문을 받되, 잠깐 기다려야 하는 테이블에는 "금방 갈게요!"라고 먼저 말씀드리겠습니다. 선후배님들이 바쁘지 않으면 도움도 요청하겠습니다.', score: 3, next: 3 },
                        { text: '빨리빨리 돌아다니면서 받겠습니다.', score: 2, next: 3 },
                        { text: '한 테이블씩 천천히 받겠습니다.', score: 1, next: 3 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '손님이 주문한 음식이 아닌 다른 메뉴가 나갔어요. 어떻게 하겠어요?',
                    options: [
                        { text: '먼저 손님께 정중히 사과드리고, 주방에 올바른 주문을 다시 전달하겠습니다. 기다리시는 동안 물이나 반찬을 리필해드리겠습니다.', score: 3, next: 4 },
                        { text: '죄송하다고 하고 바꿔드리겠습니다.', score: 2, next: 4 },
                        { text: '주방 실수니까 주방에 얘기하겠습니다.', score: 1, next: 4 }
                    ]
                },
                {
                    speaker: 'interviewer',
                    text: '같이 일하는 동료가 자기 일을 안 하고 핸드폰만 보고 있으면 어떻게 하겠어요?',
                    options: [
                        { text: '먼저 "같이 이거 하자"라고 자연스럽게 말해보고, 그래도 계속되면 매니저님께 조용히 말씀드리겠습니다.', score: 3, next: -1 },
                        { text: '제가 할 일만 하겠습니다.', score: 2, next: -1 },
                        { text: '사장님한테 바로 말하겠습니다.', score: 1, next: -1 }
                    ]
                }
            ],
            passThreshold: 10,
            results: {
                pass: {
                    emoji: '🎉',
                    status: '합격!',
                    message: '훌륭해요! 체력, 상황 대처, 팀워크까지 잘 답변했습니다. 실전 면접에서도 이렇게 하면 합격!',
                    tips: [
                        '체력과 의지를 잘 어필했어요',
                        '돌발 상황에서 논리적으로 대처했어요',
                        '팀워크를 고려한 답변이 인상적이에요'
                    ]
                },
                fail: {
                    emoji: '😥',
                    status: '불합격',
                    message: '아쉽지만 다시 도전해보세요. 음식점 면접의 핵심은 체력 + 상황대처 + 팀워크입니다.',
                    tips: [
                        '체력에 대한 자신감을 구체적으로 표현하세요',
                        '바쁜 상황: 우선순위 → 소통 → 협력 순서를 기억하세요',
                        '실수 대처: 사과 → 해결 → 추가 서비스로 만회하세요',
                        '동료 갈등: 직접 대화 → 그래도 안 되면 보고'
                    ]
                }
            }
        }
    };

    // ==================== STATE ====================
    let currentScenario = null;
    let currentStep = 0;
    let totalScore = 0;

    // ==================== DOM ====================
    const pages = {
        hero: document.getElementById('hero'),
        training: document.getElementById('training'),
        result: document.getElementById('result')
    };

    const startBtn = document.getElementById('start-btn');
    const scenarioGrid = document.getElementById('scenario-grid');
    const trainingTitle = document.getElementById('training-title');
    const trainingProgressBar = document.getElementById('training-progress-bar');
    const chatArea = document.getElementById('chat-area');
    const chatOptions = document.getElementById('chat-options');
    const trainingBack = document.getElementById('training-back');
    const resultContainer = document.getElementById('result-container');
    const themeToggle = document.getElementById('theme-toggle');
    const heroStats = document.getElementById('hero-stats');
    const navHamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');

    // ==================== THEME ====================
    const savedTheme = localStorage.getItem('clozer-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('clozer-theme', isLight ? 'light' : 'dark');
    });

    // ==================== STATS ====================
    const baseCount = 3241;
    const daysSinceBase = Math.floor((Date.now() - new Date('2025-02-14').getTime()) / 86400000);
    const totalCount = baseCount + Math.max(0, daysSinceBase * 47);
    heroStats.textContent = `${totalCount.toLocaleString()}명이 훈련했어요`;

    // ==================== PAGE NAV ====================
    function showPage(pageId) {
        Object.values(pages).forEach(p => p.classList.remove('active'));
        pages[pageId].classList.add('active');
        window.scrollTo(0, 0);

        const infoSections = document.querySelectorAll('.info-section');
        const footer = document.querySelector('.footer-sections');
        if (pageId === 'hero') {
            infoSections.forEach(s => s.style.display = '');
            if (footer) footer.style.display = '';
        } else {
            infoSections.forEach(s => s.style.display = 'none');
            if (footer) footer.style.display = 'none';
        }
    }

    // ==================== RENDER SCENARIO CARDS ====================
    function renderScenarioCards() {
        scenarioGrid.innerHTML = '';
        Object.entries(scenarios).forEach(([key, s]) => {
            const card = document.createElement('div');
            card.className = 'scenario-card';
            card.innerHTML = `
                <div class="scenario-icon">${s.icon}</div>
                <h3>${s.title}</h3>
                <p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.3rem;">${s.desc}</p>
                <div class="scenario-meta">
                    <span>${s.difficulty}</span>
                    <span>${s.time}</span>
                    <span>${s.steps.length}문항</span>
                </div>
            `;
            card.addEventListener('click', () => startTraining(key));
            scenarioGrid.appendChild(card);
        });
    }

    renderScenarioCards();

    // ==================== START TRAINING ====================
    function startTraining(scenarioKey) {
        currentScenario = scenarios[scenarioKey];
        currentStep = 0;
        totalScore = 0;
        chatArea.innerHTML = '';
        showPage('training');
        trainingTitle.textContent = currentScenario.title;
        updateProgress();
        showNextStep();
    }

    function updateProgress() {
        const pct = ((currentStep + 1) / currentScenario.steps.length) * 100;
        trainingProgressBar.style.width = pct + '%';
    }

    function showNextStep() {
        if (currentStep >= currentScenario.steps.length) {
            showTrainingResult();
            return;
        }

        const step = currentScenario.steps[currentStep];
        updateProgress();

        // Add interviewer bubble
        addChatBubble('interviewer', step.text);

        // Show options
        chatOptions.innerHTML = '';
        step.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => selectOption(opt, i));
            chatOptions.appendChild(btn);
        });

        // Scroll to bottom
        setTimeout(() => chatArea.scrollTop = chatArea.scrollHeight, 100);
    }

    function selectOption(opt, index) {
        totalScore += opt.score;

        // Add user bubble
        addChatBubble('user', opt.text);

        // Disable options
        chatOptions.innerHTML = '';

        // Next step
        setTimeout(() => {
            if (opt.next === -1 || currentStep >= currentScenario.steps.length - 1) {
                currentStep = currentScenario.steps.length;
                showNextStep();
            } else {
                currentStep = opt.next;
                showNextStep();
            }
        }, 500);
    }

    function addChatBubble(speaker, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${speaker}`;
        const label = speaker === 'interviewer' ? '면접관' : '나';
        bubble.innerHTML = `<span class="speaker-label">${label}</span>${text}`;
        chatArea.appendChild(bubble);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // ==================== TRAINING RESULT ====================
    function showTrainingResult() {
        const maxScore = currentScenario.steps.length * 3;
        const pct = Math.round((totalScore / maxScore) * 100);
        const passed = totalScore >= currentScenario.passThreshold;
        const r = passed ? currentScenario.results.pass : currentScenario.results.fail;

        showPage('result');

        resultContainer.innerHTML = `
            <div class="result-card">
                <div class="result-emoji">${r.emoji}</div>
                <div class="result-status">${r.status}</div>
                <div class="result-score">점수: ${totalScore}/${maxScore} (${pct}점)</div>
                <p class="result-feedback">${r.message}</p>
            </div>

            <div class="result-details">
                <h3>${passed ? '잘한 점' : '개선할 점'}</h3>
                ${r.tips.map(t => `<div class="feedback-item"><span>${passed ? '✅' : '💡'}</span><span>${t}</span></div>`).join('')}
            </div>

            <div class="result-actions">
                <button class="retry-btn" id="retry-btn">다시 도전하기</button>
                <button class="home-btn" id="home-btn">다른 시나리오 선택</button>
            </div>
        `;

        document.getElementById('retry-btn').addEventListener('click', () => {
            const key = Object.entries(scenarios).find(([, v]) => v === currentScenario)?.[0];
            if (key) startTraining(key);
        });

        document.getElementById('home-btn').addEventListener('click', () => showPage('hero'));
    }

    // ==================== EVENT LISTENERS ====================
    startBtn.addEventListener('click', () => {
        document.getElementById('scenarios').scrollIntoView({ behavior: 'smooth' });
    });

    trainingBack.addEventListener('click', () => showPage('hero'));

    // ==================== NAVIGATION ====================
    if (navHamburger && navLinks) {
        navHamburger.addEventListener('click', () => {
            navHamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navHamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==================== FAQ ====================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // ==================== MODALS ====================
    function openModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.add('active');
    }
    function closeModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.remove('active');
    }

    document.getElementById('footer-privacy-link')?.addEventListener('click', e => { e.preventDefault(); openModal('privacy-modal'); });
    document.getElementById('footer-terms-link')?.addEventListener('click', e => { e.preventDefault(); openModal('terms-modal'); });
    document.getElementById('privacy-close')?.addEventListener('click', () => closeModal('privacy-modal'));
    document.getElementById('terms-close')?.addEventListener('click', () => closeModal('terms-modal'));

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    });

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.contact-submit-btn');
            btn.textContent = '전송 중...';
            btn.disabled = true;
            try {
                const resp = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (resp.ok) {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    contactSuccess.style.display = 'block';
                } else {
                    btn.textContent = '보내기';
                    btn.disabled = false;
                }
            } catch {
                btn.textContent = '보내기';
                btn.disabled = false;
            }
        });
    }
});
