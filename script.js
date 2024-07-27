const data = {
    AT: [0.030, 0.060, 0.090, 0.140, 0.190, 0.240, 0.340, 0.440, 0.540, 0.690, 0.840, 0.990, 1.140, 1.290, 1.440],
    HP: [0.020, 0.040, 0.060, 0.090, 0.120, 0.150, 0.190, 0.230, 0.270, 0.310, 0.340, 0.390, 0.440, 0.490, 0.540],
    CT: [0.150, 0.300, 0.450, 0.700, 0.950, 1.200, 1.700, 2.200, 2.700, 3.450, 4.200, 4.950, 5.700, 6.450, 7.200],
    BL: [0.020, 0.040, 0.060, 0.090, 0.120, 0.150, 0.210, 0.270, 0.330, 0.420, 0.510, 0.600, 0.690, 0.780, 0.870],
    EV: [0.120, 0.240, 0.360, 0.560, 0.760, 0.960, 1.360, 1.760, 2.160, 2.760, 3.360, 3.960, 4.560, 5.160, 5.760]
};

const colors = {
    AT: '#61dafb',
    HP: '#ff6347',
    CT: '#32cd32',
    BL: '#ff4500',
    EV: '#1e90ff'
};

let selectedLevel = {
    AT: 1,
    HP: 1,
    CT: 1,
    BL: 1,
    EV: 1
};

document.addEventListener('DOMContentLoaded', () => {
    ['AT', 'HP', 'CT', 'BL', 'EV'].forEach(type => {
        createButtons(type);
        selectLevel(type, 1);
    });

    document.getElementById('chat-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const message = event.target.value;
            if (message.trim() !== '') {
                const chatMessages = document.getElementById('chat-messages');
                const newMessage = document.createElement('div');
                newMessage.classList.add('chat-message');
                const activeTab = document.querySelector('.tab.active').textContent;
                const selectedLevelValue = selectedLevel[activeTab];
                const prefix = `${activeTab}→${selectedLevelValue}`;
                newMessage.innerHTML = `<span class="chat-prefix" data-level="${selectedLevelValue}">${prefix}</span>${message}`;
                chatMessages.appendChild(newMessage);
                event.target.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    });

    const tabs = document.querySelectorAll('.tab');
    const contentSections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contentSections.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');

            document.documentElement.style.setProperty('--text-color', colors[tab.dataset.target]);
            document.documentElement.style.setProperty('--button-color', colors[tab.dataset.target]);
            
            const buttonColor = colors[tab.dataset.target];
            const darkenedColor = darkenColor(buttonColor, 20);
            document.documentElement.style.setProperty('--button-color-hover', darkenedColor);
        });
    });

    // 모달 초기 숨기기
    const modal = document.getElementById("message-modal");
    modal.style.display = "none";
});

const buttonColor = getComputedStyle(document.documentElement).getPropertyValue('--button-color').trim();
const darkenedColor = darkenColor(buttonColor, 20);

document.documentElement.style.setProperty('--button-color-hover', darkenedColor);

function darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1).toUpperCase()}`;
}

function createButtons(type) {
    const container = document.getElementById(`${type.toLowerCase()}-buttons`);
    for (let i = 1; i <= 15; i++) {
        const button = document.createElement('button');
        button.className = 'button';
        button.innerHTML = `<span>${i}</span>`;
        button.onclick = () => selectLevel(type, i);
        container.appendChild(button);
    }
}

function selectLevel(type, level) {
    const currentLevel = selectedLevel[type];
    if (currentLevel === level) {
        selectedLevel[type] = 1;
    } else {
        selectedLevel[type] = level;
    }
    
    const buttons = document.querySelectorAll(`#${type.toLowerCase()}-buttons .button`);
    buttons.forEach(button => button.classList.remove('active'));
    if (selectedLevel[type] !== 1) {
        buttons[selectedLevel[type] - 1].classList.add('active');
    } else {
        buttons[0].classList.add('active');
    }
    document.getElementById(`selected-level-${type.toLowerCase()}`).innerHTML = `선택된 강화 단계:<br>${selectedLevel[type]}`;
}

function checkExtreme(type) {
    const valueElement = document.getElementById(`${type.toLowerCase()}-value`);
    const baseElement = document.getElementById(`${type.toLowerCase()}-base`);
    
    const value = parseFloat(valueElement.value);
    const base = parseFloat(baseElement.value);
    
    if (isNaN(value) || isNaN(base)) {
        showMessage("값을 입력해주세요.");
        return;
    }
    
    const level = selectedLevel[type];

    const ratio = (value / base).toFixed(3);
    const expected = data[type][level - 1];
    const qwe = Math.abs(expected - ratio);

    let state = "극";

    if (qwe < 0.005) {
        state = "극";
    } else if (qwe <= 0.010) {
        state = "상급";
    } else if (qwe <= 0.020) {
        state = "중상급";
    } else if (qwe <= 0.030) {
        state = "중급";
    } else if (qwe <= 0.040) {
        state = "중하급";
    } else {
        state = "하급";
    }

    if (base * expected < value) {
        state = "극";
    }

    const resultElement = document.getElementById(`${type.toLowerCase()}-result`);
    resultElement.textContent = `${state} (계산된 값: ${ratio}, 예상 값: ${expected})`;
}

function showMessage(message) {
    const modal = document.getElementById("message-modal");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    modal.style.display = "flex";
    document.addEventListener('keydown', handleKeydown);
}

function closeModal() {
    const modal = document.getElementById("message-modal");
    modal.style.display = "none";
    document.removeEventListener('keydown', handleKeydown);
}

function handleKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Enter') {
        closeModal();
    }
}

window.onclick = function(event) {
    const modal = document.getElementById("message-modal");
    if (event.target === modal) {
        closeModal();
    }
}
