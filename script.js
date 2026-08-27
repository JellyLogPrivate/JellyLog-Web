// script.js
document.addEventListener("DOMContentLoaded", function() {

    // 약관/개인정보 링크를 새 창이 아닌 현재 페이지의 정책 패널에서 표시
    const policyPanel = document.getElementById("policy-panel");
    const policyFrame = document.getElementById("policy-frame");
    const policyTitle = document.getElementById("policy-panel-title");
    const policyBack = document.getElementById("policy-back");
    const policyLinks = document.querySelectorAll("[data-policy]");
    let policyOpen = false;

    function openPolicy(kind, updateHistory = true) {
        if (!policyPanel || !policyFrame) return;
        const isTerms = kind === "terms";
        policyTitle.textContent = isTerms ? "젤리로그 서비스 이용약관" : "젤리로그 개인정보처리방침";
        policyFrame.src = isTerms ? "terms.html" : "privacy.html";
        policyPanel.classList.add("is-open");
        policyPanel.setAttribute("aria-hidden", "false");
        document.body.classList.add("policy-is-open");
        policyOpen = true;
        if (updateHistory) history.pushState({ policy: kind }, "", "#" + kind);
    }

    function closePolicy(updateHistory = true) {
        if (!policyPanel) return;
        policyPanel.classList.remove("is-open");
        policyPanel.setAttribute("aria-hidden", "true");
        document.body.classList.remove("policy-is-open");
        policyOpen = false;
        if (updateHistory && location.hash) history.pushState({}, "", location.pathname + location.search);
    }

    policyLinks.forEach(link => link.addEventListener("click", event => {
        event.preventDefault();
        openPolicy(link.dataset.policy);
    }));
    if (policyBack) policyBack.addEventListener("click", () => closePolicy());
    window.addEventListener("popstate", () => {
        const kind = location.hash.slice(1);
        if (kind === "terms" || kind === "privacy") openPolicy(kind, false);
        else if (policyOpen) closePolicy(false);
    });
    const initialPolicy = location.hash.slice(1);
    if (initialPolicy === "terms" || initialPolicy === "privacy") openPolicy(initialPolicy, false);

    // FAQ를 5개 단위 화면으로 전환
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const faqStatus = document.querySelector(".faq-page-status");
    const faqPrev = document.querySelector(".faq-prev");
    const faqNext = document.querySelector(".faq-next");
    const faqSize = 5;
    let faqPage = 0;
    const faqPages = Math.ceil(faqItems.length / faqSize);
    function renderFaqPage() {
        faqItems.forEach((item, index) => {
            item.hidden = Math.floor(index / faqSize) !== faqPage;
        });
        if (faqStatus) faqStatus.textContent = `${faqPage + 1} / ${faqPages}`;
        if (faqPrev) faqPrev.disabled = faqPage === 0;
        if (faqNext) faqNext.disabled = faqPage === faqPages - 1;
    }
    if (faqItems.length) {
        faqPrev?.addEventListener("click", () => { if (faqPage > 0) { faqPage--; renderFaqPage(); } });
        faqNext?.addEventListener("click", () => { if (faqPage < faqPages - 1) { faqPage++; renderFaqPage(); } });
        renderFaqPage();
    }
    
    // 1. 스크롤 애니메이션 (Intersection Observer - 화면에 나타날 때 효과)
    const reveals = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                
                // 해당 섹션 내부에 카운트다운 숫자가 있다면 실행 (문제 제기 섹션)
                const statNumbers = entry.target.querySelectorAll(".stat-number");
                if (statNumbers.length > 0) {
                    animateStats(statNumbers);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // 2. 문제제기 섹션 숫자 카운트업 효과
    function animateStats(elements) {
        elements.forEach(el => {
            const target = parseInt(el.getAttribute("data-target"));
            let current = 0;
            const duration = 1500; // 1.5초 동안 진행
            const stepTime = Math.max(Math.floor(duration / target), 15);
            
            const timer = setInterval(() => {
                current += 1;
                el.textContent = current;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                }
            }, stepTime);
        });
    }

    // 3. 데모 세션 자동 타이핑 및 펫 반응 인터랙션
    let demoTriggered = false;
    function startDemoTyping() {
        if (demoTriggered) return;
        const textInputBox = document.getElementById("demo-typing-input");
        const petReply = document.getElementById("demo-pet-reply");
        // index.html의 인라인 데모 함수와 중복 실행되지 않도록 잠금
        if (!textInputBox || textInputBox.dataset.typingStarted === "true") return;
        textInputBox.dataset.typingStarted = "true";
        demoTriggered = true;

        const demoText = "오늘 하늘을 아주 잠깐 올려다보았는데 파랗고 예뻤어. 바빴지만 숨통이 트이는 기분이었어.";
        
        let index = 0;
        textInputBox.textContent = "";
        
        function type() {
            if (index < demoText.length) {
                textInputBox.textContent += demoText.charAt(index);
                index++;
                setTimeout(type, 50); // 글자 입력 속도
            } else {
                // 타이핑 완료 후 펫 말풍선 등장 효과
                setTimeout(() => {
                    petReply.style.opacity = "1";
                }, 500);
            }
        }
        
        // 섹션 진입 후 살짝 대기했다가 시작
        setTimeout(type, 800); 
    }
});
