const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const swapBtn = document.getElementById('swap-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const copyStatus = document.getElementById('copy-status');
const leftLabel = document.getElementById('left-label');
const rightLabel = document.getElementById('right-label');

// true = 中文轉 Base64；false = Base64 還原中文
let isEncodeMode = true;

// 支援中文的 Base64 編碼函式
function encodeBase64(str) {
    if (!str) return '';
    const bytes = new TextEncoder().encode(str);
    let binString = '';
    bytes.forEach((byte) => {
        binString += String.fromCharCode(byte);
    });
    return btoa(binString);
}

// 支援中文的 Base64 解碼函式
function decodeBase64(base64) {
    if (!base64) return '';
    try {
        const binString = atob(base64.trim());
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
        return new TextDecoder().decode(bytes);
    } catch (e) {
        return '⚠️ 無法解碼：這不是有效的 Base64 格式';
    }
}

// 執行即時轉換
function processText() {
    const raw = inputText.value;
    if (isEncodeMode) {
        outputText.value = encodeBase64(raw);
    } else {
        outputText.value = decodeBase64(raw);
    }
}

// 監聽輸入框打字事件（即時翻譯）
inputText.addEventListener('input', processText);

// 點擊中間「⇄」切換加密/解密方向
swapBtn.addEventListener('click', () => {
    isEncodeMode = !isEncodeMode;

    if (isEncodeMode) {
        leftLabel.textContent = '中文原文 (髒話模式)';
        rightLabel.textContent = 'Base64 亂碼';
        inputText.placeholder = '在這裡輸入想說的話...';
    } else {
        leftLabel.textContent = 'Base64 亂碼';
        rightLabel.textContent = '中文原文 (還原模式)';
        inputText.placeholder = '貼上要還原的 Base64 亂碼...';
    }

    // 順便把左右內容對調，方便直接反向測試
    const temp = inputText.value;
    if (!outputText.value.startsWith('⚠️')) {
        inputText.value = outputText.value;
        outputText.value = temp;
    } else {
        inputText.value = '';
        outputText.value = '';
    }
});

// 清除按鈕
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    inputText.focus();
});

// 複製按鈕
copyBtn.addEventListener('click', () => {
    if (!outputText.value) return;
    navigator.clipboard.writeText(outputText.value).then(() => {
        copyStatus.textContent = '已複製！';
        setTimeout(() => {
            copyStatus.textContent = '';
        }, 2000);
    });
});
