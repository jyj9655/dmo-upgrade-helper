document.addEventListener('DOMContentLoaded', () => {
    const emojiLeft = document.getElementById('emoji-left');
    const emojiRight = document.getElementById('emoji-right');

    // 초기 랜덤 위치 설정
    setRandomPosition(emojiLeft);
    setRandomPosition(emojiRight);

    // 랜덤 위치 설정 함수
    function setRandomPosition(element) {
        const maxWidth = window.innerWidth - element.offsetWidth;
        const maxHeight = window.innerHeight - element.offsetHeight;
        const randomX = Math.random() * maxWidth;
        const randomY = Math.random() * maxHeight;
        element.style.left = `${randomX}px`;
        element.style.top = `${randomY}px`;
        element.style.zIndex = -1; // 화면 맨 뒤로 배치
    }

    // 이동 애니메이션 설정 함수
    function setRandomMovement(element) {
        const moveX = (Math.random() - 0.5) * 200;
        const moveY = (Math.random() - 0.5) * 200;
        const duration = 3000; // 이동 시간 (3초)

        let left = parseFloat(element.style.left) + moveX;
        let top = parseFloat(element.style.top) + moveY;

        // 화면을 벗어나면 반대편으로 위치 설정
        if (left < 0) left = window.innerWidth + left;
        if (left > window.innerWidth - element.offsetWidth) left = left - window.innerWidth;
        if (top < 0) top = window.innerHeight + top;
        if (top > window.innerHeight - element.offsetHeight) top = top - window.innerHeight;

        element.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;

        // 새로운 이동 설정을 위해 재귀 호출
        setTimeout(() => setRandomMovement(element), duration);
    }

    // 초기 이동 설정
    setRandomMovement(emojiLeft);
    setRandomMovement(emojiRight);
});
