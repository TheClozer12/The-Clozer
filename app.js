document.addEventListener('DOMContentLoaded', () => {

    // ==================== i18n TRANSLATIONS ====================
    const translations = {
        ko: {
            nav_home: '홈', nav_about: '소개', nav_train: '훈련하기', nav_tips: '면접 꿀팁', nav_contact: '문의',
            hero_badge: '무료 면접 훈련',
            hero_title: '결정적인 대화,<br>미리 연습하세요',
            hero_sub: '면접, 협상, 설득 — 한 번의 말이 결과를 바꾸는 순간.<br>실패해도 괜찮은 환경에서, 실전처럼 훈련하세요.',
            start_btn: '훈련 시작하기',
            stats_suffix: '명이 훈련했어요',
            about_heading: '왜 The Clozer인가?',
            about_lead: '대부분의 사람들은 준비 없이 면접에 들어가고, 실패의 비용을 직접 감당합니다.<br>The Clozer는 이 구조를 바꿉니다.',
            about_card1_title: '실전형 훈련', about_card1_desc: '실제 면접 상황을 그대로 재현합니다. 면접관의 질문, 압박, 돌발 상황까지. 현실과 동일한 긴장감 속에서 대화를 경험하세요.',
            about_card2_title: '반복 학습', about_card2_desc: '한 번으로 끝나지 않습니다. 실패하고, 수정하고, 다시 도전하세요. 반복 훈련을 통해 자신만의 대화법을 체화할 수 있습니다.',
            about_card3_title: '결과 중심', about_card3_desc: '말하는 기술이 아닌, 원하는 결과를 만들어내는 능력을 키웁니다. 매 훈련 후 구체적인 피드백과 점수를 제공합니다.',
            scenario_heading: '훈련 시나리오 선택',
            scenario_lead: '상황을 골라 실전처럼 면접을 연습하세요.',
            training_back: '← 시나리오 선택',
            chat_placeholder: '답변을 입력하세요...',
            chat_send: '전송',
            speaker_interviewer: '면접관',
            speaker_me: '나',
            result_score: '점수',
            result_pass_title: '합격!',
            result_fail_title: '불합격',
            result_good_points: '잘한 점',
            result_improve_points: '개선할 점',
            retry_btn: '다시 도전하기',
            home_btn: '다른 시나리오 선택',
            tips_heading: '알바 면접 꿀팁',
            tips_lead: '처음 면접 보는 사람도 합격할 수 있도록, 핵심만 정리했습니다.',
            faq_heading: '자주 묻는 질문',
            contact_heading: '문의하기',
            contact_desc: '제휴, 시나리오 제안, 기타 문의를 남겨주세요.',
            contact_name: '이름', contact_name_ph: '홍길동',
            contact_email: '이메일', contact_email_ph: 'example@email.com',
            contact_message: '내용', contact_message_ph: '문의 내용을 입력해주세요...',
            contact_submit: '보내기', contact_sending: '전송 중...',
            contact_success: '문의가 전송되었습니다!',
            privacy_link: '개인정보처리방침', terms_link: '이용약관',
            difficulty: '초급', time_min: '분', questions_suffix: '문항'
        },
        en: {
            nav_home: 'Home', nav_about: 'About', nav_train: 'Train', nav_tips: 'Tips', nav_contact: 'Contact',
            hero_badge: 'Free Interview Training',
            hero_title: 'Practice the<br>conversations that matter',
            hero_sub: 'Interviews, negotiations, persuasion — moments where one word changes everything.<br>Train like it\'s real, in a safe environment.',
            start_btn: 'Start Training',
            stats_suffix: ' people have trained',
            about_heading: 'Why The Clozer?',
            about_lead: 'Most people walk into interviews unprepared and pay the price of failure directly.<br>The Clozer changes that.',
            about_card1_title: 'Realistic Training', about_card1_desc: 'We recreate real interview situations — tough questions, pressure, and curveballs. Experience the same tension as the real thing.',
            about_card2_title: 'Learn by Repetition', about_card2_desc: 'One try isn\'t enough. Fail, adjust, and try again. Build your own conversation skills through repeated practice.',
            about_card3_title: 'Results-Focused', about_card3_desc: 'We don\'t just teach speaking skills — we build the ability to achieve your desired outcome. Get concrete feedback and scores after each session.',
            scenario_heading: 'Choose a Scenario',
            scenario_lead: 'Pick a situation and practice like it\'s real.',
            training_back: '← Choose Scenario',
            chat_placeholder: 'Type your answer...',
            chat_send: 'Send',
            speaker_interviewer: 'Interviewer',
            speaker_me: 'Me',
            result_score: 'Score',
            result_pass_title: 'Passed!',
            result_fail_title: 'Failed',
            result_good_points: 'What you did well',
            result_improve_points: 'What to improve',
            retry_btn: 'Try Again',
            home_btn: 'Choose Another Scenario',
            tips_heading: 'Interview Tips',
            tips_lead: 'Essential tips to help first-timers ace their interviews.',
            faq_heading: 'FAQ',
            contact_heading: 'Contact Us',
            contact_desc: 'Partnerships, scenario suggestions, or general inquiries.',
            contact_name: 'Name', contact_name_ph: 'John Doe',
            contact_email: 'Email', contact_email_ph: 'example@email.com',
            contact_message: 'Message', contact_message_ph: 'Write your message here...',
            contact_submit: 'Send', contact_sending: 'Sending...',
            contact_success: 'Your message has been sent!',
            privacy_link: 'Privacy Policy', terms_link: 'Terms of Service',
            difficulty: 'Beginner', time_min: 'min', questions_suffix: ' questions'
        },
        ja: {
            nav_home: 'ホーム', nav_about: '紹介', nav_train: 'トレーニング', nav_tips: 'ヒント', nav_contact: 'お問合せ',
            hero_badge: '無料面接トレーニング',
            hero_title: '大事な会話を、<br>事前に練習しよう',
            hero_sub: '面接、交渉、説得 — 一言が結果を変える瞬間。<br>失敗しても大丈夫な環境で、本番のように練習しましょう。',
            start_btn: 'トレーニング開始',
            stats_suffix: '人がトレーニング済み',
            about_heading: 'なぜThe Clozerなのか？',
            about_lead: 'ほとんどの人は準備なく面接に臨み、失敗のコストを直接負担します。<br>The Clozerはこの構造を変えます。',
            about_card1_title: '実践型トレーニング', about_card1_desc: '実際の面接状況をそのまま再現します。面接官の質問、プレッシャー、突発的な状況まで。現実と同じ緊張感の中で会話を体験してください。',
            about_card2_title: '反復学習', about_card2_desc: '一回で終わりではありません。失敗して、修正して、再挑戦しましょう。反復練習を通じて自分だけの会話法を身につけることができます。',
            about_card3_title: '結果重視', about_card3_desc: '話す技術ではなく、望む結果を生み出す能力を育てます。毎回のトレーニング後に具体的なフィードバックとスコアを提供します。',
            scenario_heading: 'シナリオ選択',
            scenario_lead: '状況を選んで本番のように面接を練習しましょう。',
            training_back: '← シナリオ選択',
            chat_placeholder: '回答を入力してください...',
            chat_send: '送信',
            speaker_interviewer: '面接官',
            speaker_me: '私',
            result_score: 'スコア',
            result_pass_title: '合格！',
            result_fail_title: '不合格',
            result_good_points: '良かった点',
            result_improve_points: '改善点',
            retry_btn: '再挑戦する',
            home_btn: '他のシナリオを選ぶ',
            tips_heading: 'バイト面接のヒント',
            tips_lead: '初めての面接でも合格できるよう、要点をまとめました。',
            faq_heading: 'よくある質問',
            contact_heading: 'お問い合わせ',
            contact_desc: '提携、シナリオ提案、その他のお問い合わせをどうぞ。',
            contact_name: '名前', contact_name_ph: '山田太郎',
            contact_email: 'メール', contact_email_ph: 'example@email.com',
            contact_message: '内容', contact_message_ph: 'お問い合わせ内容を入力してください...',
            contact_submit: '送信', contact_sending: '送信中...',
            contact_success: 'お問い合わせが送信されました！',
            privacy_link: 'プライバシーポリシー', terms_link: '利用規約',
            difficulty: '初級', time_min: '分', questions_suffix: '問'
        },
        es: {
            nav_home: 'Inicio', nav_about: 'Acerca de', nav_train: 'Entrenar', nav_tips: 'Consejos', nav_contact: 'Contacto',
            hero_badge: 'Entrenamiento de entrevista gratis',
            hero_title: 'Practica las<br>conversaciones que importan',
            hero_sub: 'Entrevistas, negociaciones, persuasión — momentos donde una palabra lo cambia todo.<br>Entrena como si fuera real, en un entorno seguro.',
            start_btn: 'Comenzar entrenamiento',
            stats_suffix: ' personas han entrenado',
            about_heading: '¿Por qué The Clozer?',
            about_lead: 'La mayoría de las personas van a entrevistas sin preparación y pagan el precio directamente.<br>The Clozer cambia eso.',
            about_card1_title: 'Entrenamiento realista', about_card1_desc: 'Recreamos situaciones de entrevista reales — preguntas difíciles, presión y situaciones inesperadas. Experimenta la misma tensión que en la realidad.',
            about_card2_title: 'Aprender repitiendo', about_card2_desc: 'Un intento no es suficiente. Falla, ajusta y vuelve a intentar. Desarrolla tus habilidades de conversación mediante la práctica repetida.',
            about_card3_title: 'Enfocado en resultados', about_card3_desc: 'No solo enseñamos a hablar — desarrollamos la capacidad de lograr el resultado deseado. Obtén retroalimentación concreta y puntuaciones después de cada sesión.',
            scenario_heading: 'Elige un escenario',
            scenario_lead: 'Elige una situación y practica como si fuera real.',
            training_back: '← Elegir escenario',
            chat_placeholder: 'Escribe tu respuesta...',
            chat_send: 'Enviar',
            speaker_interviewer: 'Entrevistador',
            speaker_me: 'Yo',
            result_score: 'Puntuación',
            result_pass_title: '¡Aprobado!',
            result_fail_title: 'No aprobado',
            result_good_points: 'Lo que hiciste bien',
            result_improve_points: 'Qué mejorar',
            retry_btn: 'Intentar de nuevo',
            home_btn: 'Elegir otro escenario',
            tips_heading: 'Consejos para entrevistas',
            tips_lead: 'Consejos esenciales para que los principiantes superen sus entrevistas.',
            faq_heading: 'Preguntas frecuentes',
            contact_heading: 'Contáctanos',
            contact_desc: 'Colaboraciones, sugerencias de escenarios o consultas generales.',
            contact_name: 'Nombre', contact_name_ph: 'Juan Pérez',
            contact_email: 'Correo', contact_email_ph: 'ejemplo@email.com',
            contact_message: 'Mensaje', contact_message_ph: 'Escribe tu mensaje aquí...',
            contact_submit: 'Enviar', contact_sending: 'Enviando...',
            contact_success: '¡Tu mensaje ha sido enviado!',
            privacy_link: 'Política de privacidad', terms_link: 'Términos de servicio',
            difficulty: 'Principiante', time_min: 'min', questions_suffix: ' preguntas'
        }
    };

    // ==================== SCENARIO DATA (multilingual) ====================
    const allScenarios = {
        ko: {
            cafe: {
                title: '카페 알바 면접', icon: '☕', difficulty: '초급', time: '3분', desc: '동네 카페 사장님과의 면접',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: '안녕하세요, 지원해주셔서 감사합니다. 간단하게 자기소개 해주실래요?',
                        hint: '💡 이름, 지원동기, 장점 등을 포함해서 답변해보세요.',
                        goodKeywords: ['안녕하세요', '지원', '관심', '성실', '커피', '좋아', '경험', '배우', '열심히', '학생', '근처'],
                        badKeywords: ['몰라', '그냥', '돈', '할 줄 모르']
                    },
                    {
                        speaker: 'interviewer',
                        text: '왜 저희 카페에 지원하게 됐어요?',
                        hint: '💡 구체적인 이유 (위치, 분위기, 관심 등)를 말해보세요.',
                        goodKeywords: ['가깝', '분위기', '좋아', '오래', '경험', '배우', '후기', '관심', '커피', '서비스'],
                        badKeywords: ['돈', '아무데나', '몰라', '그냥']
                    },
                    {
                        speaker: 'interviewer',
                        text: '근무 가능한 시간대가 어떻게 돼요?',
                        hint: '💡 구체적인 요일과 시간대를 말하고, 조율 가능하다고 표현해보세요.',
                        goodKeywords: ['평일', '주말', '오후', '오전', '가능', '조율', '시간', '미리', '말씀', '시험'],
                        badKeywords: ['아무때나', '몰라', '상관없']
                    },
                    {
                        speaker: 'interviewer',
                        text: '만약 손님이 음료가 맛이 없다고 화를 내면 어떻게 하겠어요?',
                        hint: '💡 사과 → 경청 → 해결 → 보고 순서로 답변해보세요.',
                        goodKeywords: ['사과', '죄송', '여쭤', '다시', '새로', '만들', '도움', '사장님', '해결', '불편'],
                        badKeywords: ['화', '모르', '무시', '그냥']
                    },
                    {
                        speaker: 'interviewer',
                        text: '마지막으로 궁금한 거 있으면 물어봐도 돼요.',
                        hint: '💡 유니폼, 교육기간, 근무환경 등에 대해 질문해보세요.',
                        goodKeywords: ['유니폼', '교육', '근무', '궁금', '시간', '교통', '복지', '메뉴', '어떻게'],
                        badKeywords: ['없습니다', '없어요', '아뇨', '괜찮']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '합격!', message: '축하합니다! 면접을 잘 보셨어요. 사장님이 함께 일하고 싶다고 느꼈을 겁니다.', tips: ['자기소개에서 성실함을 잘 어필했어요', '구체적인 근무 시간 답변이 좋았어요', '돌발 상황 대처 답변이 논리적이에요'] },
                    fail: { emoji: '😥', status: '불합격', message: '아쉽지만 이번에는 떨어졌어요. 하지만 괜찮아요, 다시 연습하면 됩니다!', tips: ['자기소개를 좀 더 구체적으로 준비해보세요', '지원 동기에 "돈" 외의 이유를 추가하세요', '근무 시간은 구체적으로 말하는 게 좋아요', '돌발 상황 대처 공식: 사과 → 경청 → 해결 → 보고'] }
                }
            },
            convenience: {
                title: '편의점 알바 면접', icon: '🏪', difficulty: '초급', time: '3분', desc: '편의점 점장님과의 면접',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: '반갑습니다. 자기소개 간단하게 해주세요.',
                        hint: '💡 이름, 성격적 장점, 지원 이유를 포함해보세요.',
                        goodKeywords: ['안녕하세요', '꼼꼼', '책임감', '성실', '근처', '정리', '지원', '잘할'],
                        badKeywords: ['몰라', '그냥', '알바']
                    },
                    {
                        speaker: 'interviewer',
                        text: '편의점 알바 경험이 있어요?',
                        hint: '💡 경험이 없어도 배우려는 자세를 보여주세요.',
                        goodKeywords: ['경험', '배우', 'POS', '계산', '재고', '정리', '진열', '빠르게', '익숙', '자주'],
                        badKeywords: ['없어요', '처음', '모르']
                    },
                    {
                        speaker: 'interviewer',
                        text: '야간 근무도 가능해요?',
                        hint: '💡 가능/불가능을 정직하게 말하되, 대안을 제시해보세요.',
                        goodKeywords: ['가능', '주말', '야간', '조율', '미리', '유연', '말씀', '대신', '저녁', '시간'],
                        badKeywords: ['싫', '못', '안 돼', '절대']
                    },
                    {
                        speaker: 'interviewer',
                        text: '유통기한 지난 상품을 발견했는데, 어떻게 하겠어요?',
                        hint: '💡 발견 → 분리 → 보고 순서를 기억하세요.',
                        goodKeywords: ['제거', '분리', '보고', '점장', '확인', '진열대', '즉시', '주변', '알려'],
                        badKeywords: ['버리', '몰라', '그냥', '무시']
                    },
                    {
                        speaker: 'interviewer',
                        text: '마지막으로 하고 싶은 말 있으면 해주세요.',
                        hint: '💡 성실함과 오래 일하고 싶다는 의지를 보여주세요.',
                        goodKeywords: ['성실', '오래', '적응', '빠르게', '열심히', '부담', '줄여', '감사', '기회'],
                        badKeywords: ['없습니다', '없어요', '특별히']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '합격!', message: '잘 하셨어요! 점장님이 성실한 인상을 받았을 겁니다.', tips: ['경험이 없어도 배우려는 자세가 좋았어요', '근무 시간에 대해 정직하게 답변한 점이 좋아요', '유통기한 문제 대처가 체계적이에요'] },
                    fail: { emoji: '😥', status: '불합격', message: '이번엔 아쉬웠어요. 몇 가지만 개선하면 다음엔 합격할 수 있어요!', tips: ['경험이 없으면 "빠르게 배우겠다"는 의지를 보여주세요', '근무 조건은 정직하되 긍정적으로 답하세요', '문제 상황 대처: 발견 → 분리 → 보고 순서를 기억하세요', '마지막에 의욕을 보여주면 좋은 인상을 남겨요'] }
                }
            },
            restaurant: {
                title: '음식점 알바 면접', icon: '🍽️', difficulty: '초급', time: '3분', desc: '음식점 매니저와의 면접',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: '어서오세요. 자기소개 부탁해요.',
                        hint: '💡 체력, 소통 능력, 서비스 관심 등을 포함해보세요.',
                        goodKeywords: ['안녕하세요', '체력', '소통', '서비스', '밝은', '성격', '서빙', '경험', '자신'],
                        badKeywords: ['몰라', '그냥', '알바']
                    },
                    {
                        speaker: 'interviewer',
                        text: '음식점은 체력적으로 힘든데, 괜찮아요?',
                        hint: '💡 체력에 자신 있다는 근거를 구체적으로 말해보세요.',
                        goodKeywords: ['운동', '체력', '자신', '집중', '서 있', '행사', '경험', '괜찮', '장시간'],
                        badKeywords: ['아마', '모르', '힘들', '걱정']
                    },
                    {
                        speaker: 'interviewer',
                        text: '바쁜 시간에 동시에 여러 테이블에서 주문이 들어오면 어떻게 하겠어요?',
                        hint: '💡 우선순위 → 소통 → 협력 순서로 답변해보세요.',
                        goodKeywords: ['순서', '먼저', '기다려', '금방', '도움', '요청', '우선', '말씀', '협력', '선배'],
                        badKeywords: ['빨리', '모르', '천천히', '하나씩']
                    },
                    {
                        speaker: 'interviewer',
                        text: '손님이 주문한 음식이 아닌 다른 메뉴가 나갔어요. 어떻게 하겠어요?',
                        hint: '💡 사과 → 해결 → 추가 서비스로 만회하는 순서를 기억하세요.',
                        goodKeywords: ['사과', '죄송', '주방', '다시', '전달', '기다리', '물', '반찬', '리필', '정중'],
                        badKeywords: ['주방 실수', '모르', '그냥', '몰라']
                    },
                    {
                        speaker: 'interviewer',
                        text: '같이 일하는 동료가 자기 일을 안 하고 핸드폰만 보고 있으면 어떻게 하겠어요?',
                        hint: '💡 직접 대화 시도 → 그래도 안되면 매니저에게 보고하는 순서를 기억하세요.',
                        goodKeywords: ['같이', '하자', '자연스럽', '매니저', '말씀', '대화', '조용히', '도움', '팀'],
                        badKeywords: ['사장님', '바로', '무시', '내 일만']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '합격!', message: '훌륭해요! 체력, 상황 대처, 팀워크까지 잘 답변했습니다.', tips: ['체력과 의지를 잘 어필했어요', '돌발 상황에서 논리적으로 대처했어요', '팀워크를 고려한 답변이 인상적이에요'] },
                    fail: { emoji: '😥', status: '불합격', message: '아쉽지만 다시 도전해보세요. 음식점 면접의 핵심은 체력 + 상황대처 + 팀워크입니다.', tips: ['체력에 대한 자신감을 구체적으로 표현하세요', '바쁜 상황: 우선순위 → 소통 → 협력 순서를 기억하세요', '실수 대처: 사과 → 해결 → 추가 서비스로 만회하세요', '동료 갈등: 직접 대화 → 그래도 안 되면 보고'] }
                }
            }
        },
        en: {
            cafe: {
                title: 'Cafe Interview', icon: '☕', difficulty: 'Beginner', time: '3 min', desc: 'Interview with a local cafe owner',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'Hi, thanks for coming in. Could you briefly introduce yourself?',
                        hint: '💡 Include your name, why you applied, and your strengths.',
                        goodKeywords: ['hello', 'hi', 'apply', 'interest', 'coffee', 'experience', 'learn', 'hard-working', 'student', 'nearby', 'passionate', 'friendly', 'reliable'],
                        badKeywords: ['money', 'dunno', 'whatever', 'idk', 'need cash']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Why did you choose to apply at our cafe?',
                        hint: '💡 Mention specific reasons: location, atmosphere, interest in coffee, etc.',
                        goodKeywords: ['close', 'atmosphere', 'love', 'coffee', 'experience', 'learn', 'reviews', 'enjoy', 'long-term', 'vibe', 'neighborhood'],
                        badKeywords: ['money', 'anywhere', 'dunno', 'whatever', 'idk']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'What hours are you available to work?',
                        hint: '💡 Give specific days and times, and mention flexibility.',
                        goodKeywords: ['weekday', 'weekend', 'afternoon', 'morning', 'available', 'flexible', 'schedule', 'advance', 'exam', 'adjust', 'hours'],
                        badKeywords: ['anytime', 'dunno', 'whatever', 'idk']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'What would you do if a customer complained that their drink tastes bad?',
                        hint: '💡 Follow: Apologize → Listen → Resolve → Report to manager.',
                        goodKeywords: ['apologize', 'sorry', 'listen', 'ask', 'remake', 'new', 'manager', 'resolve', 'help', 'understand', 'replace'],
                        badKeywords: ['angry', 'ignore', 'whatever', 'not my fault']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Do you have any questions for me?',
                        hint: '💡 Ask about uniform, training period, or work environment.',
                        goodKeywords: ['uniform', 'training', 'schedule', 'team', 'menu', 'tips', 'environment', 'how', 'what', 'learn'],
                        badKeywords: ['no', 'nope', 'nothing', 'none', 'i\'m good']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: 'Passed!', message: 'Congratulations! You did great. The owner would love to work with you.', tips: ['Great self-introduction with clear motivation', 'Specific availability shows reliability', 'Logical approach to handling complaints'] },
                    fail: { emoji: '😥', status: 'Failed', message: 'Not quite there yet, but that\'s okay — practice makes perfect!', tips: ['Make your self-introduction more specific', 'Add reasons beyond "money" for applying', 'Be specific about your available hours', 'Complaint formula: Apologize → Listen → Resolve → Report'] }
                }
            },
            convenience: {
                title: 'Convenience Store Interview', icon: '🏪', difficulty: 'Beginner', time: '3 min', desc: 'Interview with a store manager',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'Nice to meet you. Please introduce yourself briefly.',
                        hint: '💡 Include personality strengths and why you applied.',
                        goodKeywords: ['hello', 'detail-oriented', 'responsible', 'reliable', 'nearby', 'organized', 'apply', 'experience'],
                        badKeywords: ['dunno', 'whatever', 'just', 'idk']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Do you have any convenience store experience?',
                        hint: '💡 Even without experience, show willingness to learn quickly.',
                        goodKeywords: ['experience', 'learn', 'POS', 'register', 'stock', 'organize', 'display', 'quickly', 'familiar', 'customer'],
                        badKeywords: ['no', 'never', 'first time', 'nope']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Are you available for night shifts?',
                        hint: '💡 Be honest but offer alternatives if you can\'t.',
                        goodKeywords: ['available', 'weekend', 'night', 'flexible', 'advance', 'adjust', 'instead', 'evening', 'schedule', 'possible'],
                        badKeywords: ['hate', 'can\'t', 'never', 'refuse', 'no way']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'You found an expired product on the shelf. What would you do?',
                        hint: '💡 Remember: Remove → Separate → Report to manager.',
                        goodKeywords: ['remove', 'separate', 'report', 'manager', 'check', 'shelf', 'immediately', 'surrounding', 'notify', 'pull'],
                        badKeywords: ['throw', 'dunno', 'whatever', 'ignore']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Any final words you\'d like to add?',
                        hint: '💡 Show dedication and willingness to work long-term.',
                        goodKeywords: ['reliable', 'long-term', 'adapt', 'quickly', 'hard', 'dedicated', 'grateful', 'opportunity', 'team', 'eager'],
                        badKeywords: ['nothing', 'no', 'nope', 'that\'s it']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: 'Passed!', message: 'Great job! The manager was impressed by your sincerity.', tips: ['Great attitude despite lacking experience', 'Honest and positive about work hours', 'Systematic approach to expired products'] },
                    fail: { emoji: '😥', status: 'Failed', message: 'Not this time, but a few improvements and you\'ll pass next time!', tips: ['Show willingness to "learn quickly" even without experience', 'Be honest but positive about work conditions', 'Problem handling: Find → Separate → Report', 'Show enthusiasm at the end for a good impression'] }
                }
            },
            restaurant: {
                title: 'Restaurant Interview', icon: '🍽️', difficulty: 'Beginner', time: '3 min', desc: 'Interview with a restaurant manager',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'Welcome! Please introduce yourself.',
                        hint: '💡 Highlight stamina, communication skills, and service interest.',
                        goodKeywords: ['hello', 'stamina', 'communicate', 'service', 'friendly', 'energetic', 'serving', 'experience', 'confident', 'people'],
                        badKeywords: ['dunno', 'whatever', 'just', 'idk']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Restaurant work is physically demanding. Are you okay with that?',
                        hint: '💡 Give specific reasons for your physical confidence.',
                        goodKeywords: ['exercise', 'stamina', 'confident', 'focus', 'standing', 'event', 'experience', 'fine', 'long hours', 'fit', 'active'],
                        badKeywords: ['maybe', 'not sure', 'worried', 'difficult']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'During rush hour, multiple tables order at once. How would you handle it?',
                        hint: '💡 Follow: Prioritize → Communicate → Collaborate.',
                        goodKeywords: ['order', 'first', 'wait', 'moment', 'help', 'ask', 'priority', 'communicate', 'team', 'colleague'],
                        badKeywords: ['fast', 'dunno', 'slowly', 'one by one']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'A wrong dish was served to a customer. What would you do?',
                        hint: '💡 Apologize → Fix → Provide extra service to make up for it.',
                        goodKeywords: ['apologize', 'sorry', 'kitchen', 'correct', 'replace', 'waiting', 'water', 'refill', 'politely', 'fix'],
                        badKeywords: ['kitchen fault', 'not my', 'dunno', 'ignore']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'If a coworker kept using their phone instead of working, what would you do?',
                        hint: '💡 Try talking to them first → If it continues, report to manager.',
                        goodKeywords: ['together', 'let\'s', 'naturally', 'manager', 'talk', 'conversation', 'quietly', 'help', 'team', 'approach'],
                        badKeywords: ['boss', 'immediately', 'ignore', 'my own work']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: 'Passed!', message: 'Excellent! You nailed stamina, crisis management, and teamwork.', tips: ['Great demonstration of stamina and motivation', 'Logical approach to unexpected situations', 'Impressive teamwork-oriented answers'] },
                    fail: { emoji: '😥', status: 'Failed', message: 'Not quite, but try again! Key areas: stamina + crisis management + teamwork.', tips: ['Express confidence in your physical stamina specifically', 'Rush hour: Prioritize → Communicate → Collaborate', 'Mistake handling: Apologize → Fix → Extra service', 'Coworker issues: Direct conversation → Then report if needed'] }
                }
            }
        },
        ja: {
            cafe: {
                title: 'カフェバイト面接', icon: '☕', difficulty: '初級', time: '3分', desc: 'カフェオーナーとの面接',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'こんにちは、ご応募ありがとうございます。簡単に自己紹介をお願いします。',
                        hint: '💡 名前、志望動機、長所を含めて答えてみましょう。',
                        goodKeywords: ['こんにちは', '応募', '興味', 'コーヒー', '好き', '経験', '学び', '真面目', '学生', '近く', '頑張'],
                        badKeywords: ['わからない', '別に', 'お金', '特にない']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'なぜ当店に応募されたんですか？',
                        hint: '💡 具体的な理由（立地、雰囲気、興味）を述べましょう。',
                        goodKeywords: ['近い', '雰囲気', '好き', '長く', '経験', '学び', '口コミ', '興味', 'コーヒー', 'サービス'],
                        badKeywords: ['お金', 'どこでも', 'わからない', '別に']
                    },
                    {
                        speaker: 'interviewer',
                        text: '勤務可能な時間帯を教えてください。',
                        hint: '💡 具体的な曜日と時間を伝え、調整可能と表現しましょう。',
                        goodKeywords: ['平日', '週末', '午後', '午前', '可能', '調整', '時間', '事前', '試験', 'シフト'],
                        badKeywords: ['いつでも', 'わからない', '関係ない']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'お客様がドリンクがまずいと怒ったら、どうしますか？',
                        hint: '💡 謝罪 → 傾聴 → 解決 → 報告の順序で答えましょう。',
                        goodKeywords: ['謝', 'すみません', 'お聞き', '作り直', '新しい', 'オーナー', '解決', 'お伺い', '対応'],
                        badKeywords: ['怒り', 'わからない', '無視', '別に']
                    },
                    {
                        speaker: 'interviewer',
                        text: '最後に何か質問はありますか？',
                        hint: '💡 制服、研修期間、職場環境について質問してみましょう。',
                        goodKeywords: ['制服', '研修', '勤務', '質問', '時間', '交通', 'メニュー', 'どう', 'チーム'],
                        badKeywords: ['ない', 'ありません', '大丈夫', '特にない']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '合格！', message: 'おめでとうございます！素晴らしい面接でした。', tips: ['自己紹介で誠実さをよくアピールしました', '具体的な勤務時間の回答が良かったです', '突発状況への対応が論理的でした'] },
                    fail: { emoji: '😥', status: '不合格', message: '残念ですが、また練習すれば大丈夫です！', tips: ['自己紹介をもっと具体的に準備しましょう', '志望動機に「お金」以外の理由を加えましょう', '勤務時間は具体的に言うのが良いです', '対応の公式：謝罪 → 傾聴 → 解決 → 報告'] }
                }
            },
            convenience: {
                title: 'コンビニバイト面接', icon: '🏪', difficulty: '初級', time: '3分', desc: 'コンビニ店長との面接',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'はじめまして。簡単に自己紹介をお願いします。',
                        hint: '💡 性格の長所と応募理由を含めましょう。',
                        goodKeywords: ['こんにちは', '几帳面', '責任感', '真面目', '近く', '整理', '応募', '自信'],
                        badKeywords: ['わからない', '別に', 'バイト']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'コンビニでのバイト経験はありますか？',
                        hint: '💡 経験がなくても学ぶ姿勢を見せましょう。',
                        goodKeywords: ['経験', '学び', 'レジ', '計算', '在庫', '整理', '陳列', '早く', '慣れ', 'よく利用'],
                        badKeywords: ['ない', '初めて', 'わからない']
                    },
                    {
                        speaker: 'interviewer',
                        text: '夜勤もできますか？',
                        hint: '💡 正直に答えつつ、代替案を提示しましょう。',
                        goodKeywords: ['可能', '週末', '夜勤', '調整', '事前', '柔軟', '代わり', '夕方', '時間', 'できます'],
                        badKeywords: ['嫌', 'できない', '絶対', '無理']
                    },
                    {
                        speaker: 'interviewer',
                        text: '賞味期限切れの商品を見つけたら、どうしますか？',
                        hint: '💡 発見 → 撤去 → 報告の順序を覚えておきましょう。',
                        goodKeywords: ['撤去', '分離', '報告', '店長', '確認', '棚', 'すぐ', '周り', '知らせ'],
                        badKeywords: ['捨てる', 'わからない', '別に', '無視']
                    },
                    {
                        speaker: 'interviewer',
                        text: '最後に何か言いたいことはありますか？',
                        hint: '💡 誠実さと長く働きたい意志を見せましょう。',
                        goodKeywords: ['真面目', '長く', '適応', '早く', '頑張', '負担', '減らし', '感謝', '機会'],
                        badKeywords: ['ない', 'ありません', '特にない']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '合格！', message: 'よくできました！店長に誠実な印象を与えたはずです。', tips: ['経験がなくても学ぶ姿勢が良かったです', '勤務時間に正直に答えた点が良いです', '期限切れ対応が体系的でした'] },
                    fail: { emoji: '😥', status: '不合格', message: '今回は残念でした。少し改善すれば次は合格できます！', tips: ['経験がなくても「早く学びます」という意志を見せましょう', '勤務条件は正直かつ前向きに答えましょう', '問題対応：発見 → 撤去 → 報告の順序を覚えましょう', '最後に意欲を見せると良い印象を残せます'] }
                }
            },
            restaurant: {
                title: 'レストランバイト面接', icon: '🍽️', difficulty: '初級', time: '3分', desc: 'レストランマネージャーとの面接',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'いらっしゃいませ。自己紹介をお願いします。',
                        hint: '💡 体力、コミュニケーション能力、サービスへの関心を含めましょう。',
                        goodKeywords: ['こんにちは', '体力', 'コミュニケーション', 'サービス', '明るい', '性格', '接客', '経験', '自信', '人'],
                        badKeywords: ['わからない', '別に', 'バイト']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'レストランは体力的にきついですが、大丈夫ですか？',
                        hint: '💡 体力に自信がある具体的な根拠を述べましょう。',
                        goodKeywords: ['運動', '体力', '自信', '集中', '立ち', 'イベント', '経験', '大丈夫', '長時間', '元気'],
                        badKeywords: ['たぶん', 'わからない', '大変', '心配']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'ピーク時に複数のテーブルから同時に注文が来たら、どうしますか？',
                        hint: '💡 優先順位 → コミュニケーション → 協力の順で答えましょう。',
                        goodKeywords: ['順番', '先に', '待って', 'すぐ', '助け', 'お願い', '優先', 'お声がけ', '協力', '先輩'],
                        badKeywords: ['急いで', 'わからない', 'ゆっくり', '一つずつ']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'お客様に間違った料理を出してしまいました。どうしますか？',
                        hint: '💡 謝罪 → 修正 → 追加サービスで挽回しましょう。',
                        goodKeywords: ['謝', 'すみません', 'キッチン', '正しい', '作り直し', '待って', 'お水', 'おかわり', '丁寧', '対応'],
                        badKeywords: ['キッチンのせい', 'わからない', '別に', '知らない']
                    },
                    {
                        speaker: 'interviewer',
                        text: '同僚が仕事をせずスマホばかり見ていたら、どうしますか？',
                        hint: '💡 まず直接話す → それでもダメならマネージャーに報告。',
                        goodKeywords: ['一緒に', 'やろう', '自然に', 'マネージャー', '話し', '会話', '静かに', '助け', 'チーム', '声をかけ'],
                        badKeywords: ['店長に', 'すぐ', '無視', '自分の仕事']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '合格！', message: '素晴らしい！体力、状況対応、チームワークすべて良い回答でした。', tips: ['体力と意欲をよくアピールしました', '突発状況に論理的に対応しました', 'チームワークを考慮した回答が印象的でした'] },
                    fail: { emoji: '😥', status: '不合格', message: '残念ですが再挑戦してください。レストラン面接の核心は体力＋状況対応＋チームワークです。', tips: ['体力への自信を具体的に表現しましょう', 'ピーク時：優先順位 → コミュニケーション → 協力の順序', '失敗対応：謝罪 → 解決 → 追加サービスで挽回', '同僚問題：直接会話 → ダメなら報告'] }
                }
            }
        },
        es: {
            cafe: {
                title: 'Entrevista en cafetería', icon: '☕', difficulty: 'Principiante', time: '3 min', desc: 'Entrevista con el dueño de una cafetería',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'Hola, gracias por venir. ¿Podrías presentarte brevemente?',
                        hint: '💡 Incluye tu nombre, por qué aplicaste y tus fortalezas.',
                        goodKeywords: ['hola', 'aplicar', 'interés', 'café', 'experiencia', 'aprender', 'trabajador', 'estudiante', 'cerca', 'responsable', 'amable'],
                        badKeywords: ['dinero', 'no sé', 'cualquier', 'da igual']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Por qué elegiste aplicar en nuestra cafetería?',
                        hint: '💡 Menciona razones específicas: ubicación, ambiente, interés en café.',
                        goodKeywords: ['cerca', 'ambiente', 'gusta', 'café', 'experiencia', 'aprender', 'reseñas', 'tiempo', 'barrio', 'acogedor'],
                        badKeywords: ['dinero', 'cualquier', 'no sé', 'da igual']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Qué horarios tienes disponibles?',
                        hint: '💡 Da días y horas específicos y menciona flexibilidad.',
                        goodKeywords: ['semana', 'fin de semana', 'tarde', 'mañana', 'disponible', 'flexible', 'horario', 'aviso', 'examen', 'ajustar'],
                        badKeywords: ['cualquier', 'no sé', 'da igual', 'cuando sea']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Qué harías si un cliente se queja de que su bebida sabe mal?',
                        hint: '💡 Sigue: Disculparse → Escuchar → Resolver → Informar al gerente.',
                        goodKeywords: ['disculp', 'perdón', 'escuchar', 'preguntar', 'preparar', 'nuevo', 'gerente', 'resolver', 'ayuda', 'reemplazar'],
                        badKeywords: ['enojar', 'ignorar', 'da igual', 'no es mi culpa']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Tienes alguna pregunta para mí?',
                        hint: '💡 Pregunta sobre uniforme, capacitación o ambiente de trabajo.',
                        goodKeywords: ['uniforme', 'capacitación', 'horario', 'equipo', 'menú', 'propinas', 'ambiente', 'cómo', 'qué', 'aprender'],
                        badKeywords: ['no', 'nada', 'ninguna', 'estoy bien']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '¡Aprobado!', message: '¡Felicidades! Lo hiciste muy bien. El dueño querría trabajar contigo.', tips: ['Excelente presentación con motivación clara', 'Disponibilidad específica muestra confiabilidad', 'Enfoque lógico para manejar quejas'] },
                    fail: { emoji: '😥', status: 'No aprobado', message: 'Aún no, pero está bien — ¡la práctica hace al maestro!', tips: ['Haz tu presentación más específica', 'Agrega razones más allá del "dinero" para aplicar', 'Sé específico sobre tus horarios disponibles', 'Fórmula para quejas: Disculparse → Escuchar → Resolver → Informar'] }
                }
            },
            convenience: {
                title: 'Entrevista en tienda', icon: '🏪', difficulty: 'Principiante', time: '3 min', desc: 'Entrevista con el gerente de tienda',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: 'Mucho gusto. Preséntate brevemente, por favor.',
                        hint: '💡 Incluye fortalezas de personalidad y razón de aplicación.',
                        goodKeywords: ['hola', 'detallista', 'responsable', 'confiable', 'cerca', 'organizado', 'aplicar', 'experiencia'],
                        badKeywords: ['no sé', 'da igual', 'solo', 'cualquier']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Tienes experiencia trabajando en tiendas?',
                        hint: '💡 Aunque no tengas experiencia, muestra disposición para aprender.',
                        goodKeywords: ['experiencia', 'aprender', 'caja', 'registradora', 'inventario', 'organizar', 'estantes', 'rápido', 'familiar', 'cliente'],
                        badKeywords: ['no', 'nunca', 'primera vez', 'nada']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Puedes trabajar en turno nocturno?',
                        hint: '💡 Sé honesto pero ofrece alternativas.',
                        goodKeywords: ['disponible', 'fin de semana', 'noche', 'flexible', 'aviso', 'ajustar', 'cambio', 'tarde', 'horario', 'posible'],
                        badKeywords: ['odio', 'no puedo', 'nunca', 'rechazo', 'imposible']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Encontraste un producto caducado en el estante. ¿Qué harías?',
                        hint: '💡 Recuerda: Retirar → Separar → Informar al gerente.',
                        goodKeywords: ['retirar', 'separar', 'informar', 'gerente', 'verificar', 'estante', 'inmediatamente', 'alrededor', 'notificar', 'quitar'],
                        badKeywords: ['tirar', 'no sé', 'da igual', 'ignorar']
                    },
                    {
                        speaker: 'interviewer',
                        text: '¿Algo más que quieras agregar?',
                        hint: '💡 Muestra dedicación y disposición a largo plazo.',
                        goodKeywords: ['confiable', 'largo plazo', 'adaptar', 'rápido', 'esfuerzo', 'dedicado', 'agradecido', 'oportunidad', 'equipo', 'ganas'],
                        badKeywords: ['nada', 'no', 'eso es todo', 'ninguna']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '¡Aprobado!', message: '¡Bien hecho! El gerente quedó impresionado con tu sinceridad.', tips: ['Buena actitud a pesar de falta de experiencia', 'Honesto y positivo sobre horarios', 'Enfoque sistemático con productos caducados'] },
                    fail: { emoji: '😥', status: 'No aprobado', message: 'Esta vez no, pero con algunas mejoras lo lograrás.', tips: ['Muestra disposición de "aprender rápido" aunque no tengas experiencia', 'Sé honesto pero positivo sobre condiciones de trabajo', 'Manejo de problemas: Encontrar → Separar → Informar', 'Muestra entusiasmo al final para dejar buena impresión'] }
                }
            },
            restaurant: {
                title: 'Entrevista en restaurante', icon: '🍽️', difficulty: 'Principiante', time: '3 min', desc: 'Entrevista con el gerente del restaurante',
                steps: [
                    {
                        speaker: 'interviewer',
                        text: '¡Bienvenido! Preséntate, por favor.',
                        hint: '💡 Destaca resistencia física, comunicación e interés en servicio.',
                        goodKeywords: ['hola', 'resistencia', 'comunicar', 'servicio', 'amable', 'energético', 'atención', 'experiencia', 'confianza', 'personas'],
                        badKeywords: ['no sé', 'da igual', 'solo', 'cualquier']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'El trabajo en restaurante es físicamente exigente. ¿Estás bien con eso?',
                        hint: '💡 Da razones específicas de tu confianza física.',
                        goodKeywords: ['ejercicio', 'resistencia', 'confianza', 'concentrar', 'pie', 'evento', 'experiencia', 'bien', 'horas', 'activo', 'forma'],
                        badKeywords: ['quizás', 'no sé', 'preocupado', 'difícil']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'En hora punta, varias mesas piden al mismo tiempo. ¿Cómo lo manejarías?',
                        hint: '💡 Sigue: Priorizar → Comunicar → Colaborar.',
                        goodKeywords: ['orden', 'primero', 'esperar', 'momento', 'ayuda', 'pedir', 'prioridad', 'comunicar', 'equipo', 'compañero'],
                        badKeywords: ['rápido', 'no sé', 'despacio', 'una por una']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Se sirvió el plato equivocado a un cliente. ¿Qué harías?',
                        hint: '💡 Disculparse → Corregir → Servicio extra para compensar.',
                        goodKeywords: ['disculp', 'perdón', 'cocina', 'correcto', 'reemplazar', 'esperando', 'agua', 'cortesía', 'amablemente', 'corregir'],
                        badKeywords: ['culpa cocina', 'no es mi', 'no sé', 'ignorar']
                    },
                    {
                        speaker: 'interviewer',
                        text: 'Si un compañero no trabaja y solo usa su teléfono, ¿qué harías?',
                        hint: '💡 Hablar primero → Si continúa, informar al gerente.',
                        goodKeywords: ['juntos', 'vamos', 'naturalmente', 'gerente', 'hablar', 'conversación', 'discretamente', 'ayuda', 'equipo', 'acercar'],
                        badKeywords: ['jefe', 'inmediatamente', 'ignorar', 'mi trabajo']
                    }
                ],
                passThreshold: 10,
                results: {
                    pass: { emoji: '🎉', status: '¡Aprobado!', message: '¡Excelente! Dominaste resistencia, manejo de crisis y trabajo en equipo.', tips: ['Gran demostración de resistencia y motivación', 'Enfoque lógico ante situaciones inesperadas', 'Respuestas impresionantes orientadas al equipo'] },
                    fail: { emoji: '😥', status: 'No aprobado', message: 'No esta vez, ¡pero inténtalo de nuevo! Áreas clave: resistencia + manejo de crisis + trabajo en equipo.', tips: ['Expresa confianza en tu resistencia física específicamente', 'Hora punta: Priorizar → Comunicar → Colaborar', 'Manejo de errores: Disculparse → Corregir → Servicio extra', 'Problemas con compañeros: Conversación directa → Si no funciona, informar'] }
                }
            }
        }
    };

    // ==================== STATE ====================
    let currentLang = localStorage.getItem('clozer-lang') || 'ko';
    let currentScenario = null;
    let currentScenarioKey = null;
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
    const chatInputArea = document.getElementById('chat-input-area');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatHint = document.getElementById('chat-hint');
    const trainingBack = document.getElementById('training-back');
    const resultContainer = document.getElementById('result-container');
    const themeToggle = document.getElementById('theme-toggle');
    const heroStats = document.getElementById('hero-stats');
    const navHamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    // ==================== LANGUAGE ====================
    const langLabels = { ko: 'KO', en: 'EN', ja: 'JA', es: 'ES' };

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('clozer-lang', lang);

        // Update lang button
        langBtn.textContent = '🌐 ' + langLabels[lang];

        // Update active state
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });

        // Update html lang
        document.documentElement.lang = lang === 'ko' ? 'ko' : lang === 'ja' ? 'ja' : lang === 'es' ? 'es' : 'en';

        // Apply translations
        applyTranslations();
        renderScenarioCards();
        updateStats();

        // Close dropdown
        langDropdown.classList.remove('open');
    }

    function t(key) {
        return translations[currentLang]?.[key] || translations.ko[key] || key;
    }

    function applyTranslations() {
        // Nav links
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[currentLang]?.[key]) {
                el.textContent = translations[currentLang][key];
            }
        });

        // Hero section
        const heroBadge = document.querySelector('.hero-badge');
        const heroTitle = document.querySelector('.hero-title');
        const heroSub = document.querySelector('.hero-sub');
        if (heroBadge) heroBadge.textContent = t('hero_badge');
        if (heroTitle) heroTitle.innerHTML = t('hero_title');
        if (heroSub) heroSub.innerHTML = t('hero_sub');
        if (startBtn) startBtn.textContent = t('start_btn');

        // About section
        const aboutHeading = document.querySelector('#about .info-heading');
        const aboutLead = document.querySelector('#about .info-lead');
        if (aboutHeading) aboutHeading.textContent = t('about_heading');
        if (aboutLead) aboutLead.innerHTML = t('about_lead');

        const aboutCards = document.querySelectorAll('#about .info-card');
        if (aboutCards[0]) { aboutCards[0].querySelector('h3').textContent = t('about_card1_title'); aboutCards[0].querySelector('p').textContent = t('about_card1_desc'); }
        if (aboutCards[1]) { aboutCards[1].querySelector('h3').textContent = t('about_card2_title'); aboutCards[1].querySelector('p').textContent = t('about_card2_desc'); }
        if (aboutCards[2]) { aboutCards[2].querySelector('h3').textContent = t('about_card3_title'); aboutCards[2].querySelector('p').textContent = t('about_card3_desc'); }

        // Scenario section
        const scenarioHeading = document.querySelector('#scenarios .info-heading');
        const scenarioLead = document.querySelector('#scenarios .info-lead');
        if (scenarioHeading) scenarioHeading.textContent = t('scenario_heading');
        if (scenarioLead) scenarioLead.textContent = t('scenario_lead');

        // Tips section
        const tipsHeading = document.querySelector('#tips .info-heading');
        const tipsLead = document.querySelector('#tips .info-lead');
        if (tipsHeading) tipsHeading.textContent = t('tips_heading');
        if (tipsLead) tipsLead.textContent = t('tips_lead');

        // FAQ
        const faqHeading = document.querySelector('#faq .info-heading');
        if (faqHeading) faqHeading.textContent = t('faq_heading');

        // Contact
        const contactHeading = document.querySelector('.section-heading');
        const contactDesc = document.querySelector('.section-desc');
        if (contactHeading) contactHeading.textContent = t('contact_heading');
        if (contactDesc) contactDesc.textContent = t('contact_desc');

        const contactNameLabel = document.querySelector('label[for="contact-name"]');
        const contactEmailLabel = document.querySelector('label[for="contact-email"]');
        const contactMsgLabel = document.querySelector('label[for="contact-message"]');
        if (contactNameLabel) contactNameLabel.textContent = t('contact_name');
        if (contactEmailLabel) contactEmailLabel.textContent = t('contact_email');
        if (contactMsgLabel) contactMsgLabel.textContent = t('contact_message');

        const contactNameInput = document.getElementById('contact-name');
        const contactEmailInput = document.getElementById('contact-email');
        const contactMsgInput = document.getElementById('contact-message');
        if (contactNameInput) contactNameInput.placeholder = t('contact_name_ph');
        if (contactEmailInput) contactEmailInput.placeholder = t('contact_email_ph');
        if (contactMsgInput) contactMsgInput.placeholder = t('contact_message_ph');

        const contactSubmitBtn = document.querySelector('.contact-submit-btn');
        if (contactSubmitBtn && !contactSubmitBtn.disabled) contactSubmitBtn.textContent = t('contact_submit');

        // Footer
        const privacyLink = document.getElementById('footer-privacy-link');
        const termsLink = document.getElementById('footer-terms-link');
        if (privacyLink) privacyLink.textContent = t('privacy_link');
        if (termsLink) termsLink.textContent = t('terms_link');

        // Training
        if (trainingBack) trainingBack.textContent = t('training_back');
        if (chatInput) chatInput.placeholder = t('chat_placeholder');
    }

    // Language selector events
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => setLanguage(opt.dataset.lang));
    });

    document.addEventListener('click', () => langDropdown.classList.remove('open'));

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
    function updateStats() {
        const baseCount = 3241;
        const daysSinceBase = Math.floor((Date.now() - new Date('2025-02-14').getTime()) / 86400000);
        const totalCount = baseCount + Math.max(0, daysSinceBase * 47);
        heroStats.textContent = totalCount.toLocaleString() + t('stats_suffix');
    }

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
        const scenarios = allScenarios[currentLang] || allScenarios.ko;
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
                    <span>${s.steps.length}${t('questions_suffix')}</span>
                </div>
            `;
            card.addEventListener('click', () => startTraining(key));
            scenarioGrid.appendChild(card);
        });
    }

    // ==================== SCORING ====================
    function scoreResponse(userText, step) {
        const text = userText.toLowerCase();
        let score = 2; // default: okay

        // Check bad keywords first
        let badCount = 0;
        for (const kw of (step.badKeywords || [])) {
            if (text.includes(kw.toLowerCase())) badCount++;
        }

        // Check good keywords
        let goodCount = 0;
        for (const kw of (step.goodKeywords || [])) {
            if (text.includes(kw.toLowerCase())) goodCount++;
        }

        // Very short answers are bad
        if (text.length < 8) {
            score = 1;
        } else if (badCount >= 2 && goodCount === 0) {
            score = 1;
        } else if (badCount > 0 && goodCount <= 1) {
            score = 1;
        } else if (goodCount >= 3) {
            score = 3;
        } else if (goodCount >= 2) {
            score = 3;
        } else if (goodCount === 1 && badCount === 0) {
            score = 2;
        }

        return score;
    }

    // ==================== START TRAINING ====================
    function startTraining(scenarioKey) {
        const scenarios = allScenarios[currentLang] || allScenarios.ko;
        currentScenario = scenarios[scenarioKey];
        currentScenarioKey = scenarioKey;
        currentStep = 0;
        totalScore = 0;
        chatArea.innerHTML = '';
        chatOptions.innerHTML = '';
        chatInputArea.style.display = 'block';
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
            chatInputArea.style.display = 'none';
            showTrainingResult();
            return;
        }

        const step = currentScenario.steps[currentStep];
        updateProgress();

        // Add interviewer bubble
        addChatBubble('interviewer', step.text);

        // Show hint
        chatHint.textContent = step.hint || '';

        // Enable input
        chatInput.value = '';
        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        chatInput.focus();

        // Scroll to bottom
        setTimeout(() => chatArea.scrollTop = chatArea.scrollHeight, 100);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        const step = currentScenario.steps[currentStep];
        const score = scoreResponse(text, step);
        totalScore += score;

        // Add user bubble
        addChatBubble('user', text);

        // Disable input while transitioning
        chatInput.value = '';
        chatInput.disabled = true;
        chatSendBtn.disabled = true;
        chatHint.textContent = '';

        // Next step
        setTimeout(() => {
            currentStep++;
            showNextStep();
        }, 600);
    }

    // Send button click
    chatSendBtn.addEventListener('click', handleSend);

    // Enter to send (Shift+Enter for newline)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    function addChatBubble(speaker, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${speaker}`;
        const label = speaker === 'interviewer' ? t('speaker_interviewer') : t('speaker_me');
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
                <div class="result-score">${t('result_score')}: ${totalScore}/${maxScore} (${pct}${currentLang === 'ko' || currentLang === 'ja' ? '점' : '%'})</div>
                <p class="result-feedback">${r.message}</p>
            </div>

            <div class="result-details">
                <h3>${passed ? t('result_good_points') : t('result_improve_points')}</h3>
                ${r.tips.map(tip => `<div class="feedback-item"><span>${passed ? '✅' : '💡'}</span><span>${tip}</span></div>`).join('')}
            </div>

            <div class="result-actions">
                <button class="retry-btn" id="retry-btn">${t('retry_btn')}</button>
                <button class="home-btn" id="home-btn">${t('home_btn')}</button>
            </div>
        `;

        document.getElementById('retry-btn').addEventListener('click', () => {
            if (currentScenarioKey) startTraining(currentScenarioKey);
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
            btn.textContent = t('contact_sending');
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
                    contactSuccess.textContent = t('contact_success');
                    contactSuccess.style.display = 'block';
                } else {
                    btn.textContent = t('contact_submit');
                    btn.disabled = false;
                }
            } catch {
                btn.textContent = t('contact_submit');
                btn.disabled = false;
            }
        });
    }

    // ==================== INIT ====================
    // Hide chat input initially
    chatInputArea.style.display = 'none';

    // Set initial language
    setLanguage(currentLang);
});
