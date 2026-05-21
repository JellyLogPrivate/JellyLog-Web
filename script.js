// script.js
document.addEventListener("DOMContentLoaded", function() {
    
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
                
                // 데모 애니메이션 실행 트리거 (데모 섹션)
                if (entry.target.id === "demo") {
                    startDemoTyping();
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
        demoTriggered = true;
        
        const textInputBox = document.getElementById("demo-typing-input");
        const petReply = document.getElementById("demo-pet-reply");
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