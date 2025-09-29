// 合约ABI - 这个需要从编译后的合约中获取
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newCount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "changedBy",
                "type": "address"
            }
        ],
        "name": "CountChanged",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "decrement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "setCount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 合约地址 - 部署后需要更新这个地址
let CONTRACT_ADDRESS = "0xCC3a01C5dc2781dfC5C2773290611546b941AD8f"; // 已部署的合约地址

// 全局变量
let provider;
let signer;
let contract;
let userAddress;

// DOM 元素
const connectWalletBtn = document.getElementById('connectWallet');
const walletInfo = document.getElementById('walletInfo');
const walletAddressSpan = document.getElementById('walletAddress');
const networkNameSpan = document.getElementById('networkName');
const counterValue = document.getElementById('counterValue');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const refreshBtn = document.getElementById('refreshBtn');
const setCountInput = document.getElementById('setCountInput');
const setCountBtn = document.getElementById('setCountBtn');
const statusDiv = document.getElementById('status');
const contractAddressSpan = document.getElementById('contractAddress');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经连接钱包
    checkWalletConnection();
    
    // 绑定事件监听器
    connectWalletBtn.addEventListener('click', connectWallet);
    incrementBtn.addEventListener('click', incrementCounter);
    decrementBtn.addEventListener('click', decrementCounter);
    resetBtn.addEventListener('click', resetCounter);
    refreshBtn.addEventListener('click', refreshCount);
    setCountBtn.addEventListener('click', setCounter);
    
    // 如果有合约地址，更新显示
    if (CONTRACT_ADDRESS) {
        contractAddressSpan.textContent = CONTRACT_ADDRESS;
    }
});

// 检查钱包连接状态
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await initializeWeb3();
            }
        } catch (error) {
            console.error('检查钱包连接时出错:', error);
        }
    }
}

// 连接钱包
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        showStatus('请安装 MetaMask 钱包!', 'error');
        return;
    }

    try {
        showStatus('正在连接钱包...', 'warning');
        
        // 请求连接钱包
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        await initializeWeb3();
        
        showStatus('钱包连接成功!', 'success');
    } catch (error) {
        console.error('连接钱包失败:', error);
        showStatus('连接钱包失败: ' + error.message, 'error');
    }
}

// 初始化Web3
async function initializeWeb3() {
    try {
        // 创建provider和signer (ethers v6语法)
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        
        // 获取网络信息
        const network = await provider.getNetwork();
        
        // 更新UI
        updateWalletInfo(userAddress, network.name);
        
        // 如果有合约地址，初始化合约
        if (CONTRACT_ADDRESS) {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            enableButtons();
            await refreshCount();
            
            // 监听合约事件
            listenToContractEvents();
        } else {
            showStatus('请先设置合约地址', 'warning');
        }
        
        // 监听账户变化
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
    } catch (error) {
        console.error('初始化Web3失败:', error);
        showStatus('初始化Web3失败: ' + error.message, 'error');
    }
}

// 更新钱包信息显示
function updateWalletInfo(address, networkName) {
    walletAddressSpan.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
    networkNameSpan.textContent = networkName || '未知';
    walletInfo.classList.remove('hidden');
    connectWalletBtn.textContent = '✅ 钱包已连接';
    connectWalletBtn.disabled = true;
}

// 启用按钮
function enableButtons() {
    incrementBtn.disabled = false;
    decrementBtn.disabled = false;
    resetBtn.disabled = false;
    refreshBtn.disabled = false;
    setCountInput.disabled = false;
    setCountBtn.disabled = false;
}

// 禁用按钮
function disableButtons() {
    incrementBtn.disabled = true;
    decrementBtn.disabled = true;
    resetBtn.disabled = true;
    refreshBtn.disabled = true;
    setCountInput.disabled = true;
    setCountBtn.disabled = true;
}

// 增加计数
async function incrementCounter() {
    if (!contract) return;
    
    try {
        showStatus('正在增加计数...', 'warning');
        
        const tx = await contract.increment();
        showStatus('交易已发送，等待确认...', 'warning');
        
        await tx.wait();
        showStatus('计数增加成功!', 'success');
        
        await refreshCount();
    } catch (error) {
        console.error('增加计数失败:', error);
        showStatus('增加计数失败: ' + error.message, 'error');
    }
}

// 减少计数
async function decrementCounter() {
    if (!contract) return;
    
    try {
        showStatus('正在减少计数...', 'warning');
        
        const tx = await contract.decrement();
        showStatus('交易已发送，等待确认...', 'warning');
        
        await tx.wait();
        showStatus('计数减少成功!', 'success');
        
        await refreshCount();
    } catch (error) {
        console.error('减少计数失败:', error);
        showStatus('减少计数失败: ' + error.message, 'error');
    }
}

// 重置计数
async function resetCounter() {
    if (!contract) return;
    
    try {
        showStatus('正在重置计数...', 'warning');
        
        const tx = await contract.reset();
        showStatus('交易已发送，等待确认...', 'warning');
        
        await tx.wait();
        showStatus('计数重置成功!', 'success');
        
        await refreshCount();
    } catch (error) {
        console.error('重置计数失败:', error);
        showStatus('重置计数失败: ' + error.message, 'error');
    }
}

// 设置计数
async function setCounter() {
    if (!contract) return;
    
    const newCount = setCountInput.value;
    if (!newCount || newCount < 0) {
        showStatus('请输入有效的计数值', 'error');
        return;
    }
    
    try {
        showStatus('正在设置计数...', 'warning');
        
        const tx = await contract.setCount(newCount);
        showStatus('交易已发送，等待确认...', 'warning');
        
        await tx.wait();
        showStatus('计数设置成功!', 'success');
        
        setCountInput.value = '';
        await refreshCount();
    } catch (error) {
        console.error('设置计数失败:', error);
        showStatus('设置计数失败: ' + error.message, 'error');
    }
}

// 刷新计数显示
async function refreshCount() {
    if (!contract) return;
    
    try {
        const count = await contract.getCount();
        counterValue.textContent = count.toString();
    } catch (error) {
        console.error('获取计数失败:', error);
        showStatus('获取计数失败: ' + error.message, 'error');
    }
}

// 监听合约事件
function listenToContractEvents() {
    if (!contract) return;
    
    contract.on('CountChanged', (newCount, changedBy) => {
        console.log('计数已改变:', newCount.toString(), '改变者:', changedBy);
        counterValue.textContent = newCount.toString();
        
        if (changedBy.toLowerCase() === userAddress.toLowerCase()) {
            showStatus('你的操作已确认!', 'success');
        } else {
            showStatus('计数被其他用户更改', 'warning');
        }
    });
}

// 显示状态消息
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.classList.remove('hidden');
    
    // 3秒后自动隐藏成功消息
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 3000);
    }
}

// 处理账户变化
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // 用户断开了钱包连接
        walletInfo.classList.add('hidden');
        connectWalletBtn.textContent = '🦊 连接 MetaMask 钱包';
        connectWalletBtn.disabled = false;
        disableButtons();
        counterValue.textContent = '-';
        showStatus('钱包已断开连接', 'warning');
    } else {
        // 用户切换了账户
        initializeWeb3();
    }
}

// 处理网络变化
function handleChainChanged(chainId) {
    // 网络变化时重新加载页面
    window.location.reload();
}

// 设置合约地址的函数（用于动态设置）
function setContractAddress(address) {
    CONTRACT_ADDRESS = address;
    contractAddressSpan.textContent = address;
    
    if (signer) {
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        enableButtons();
        refreshCount();
        listenToContractEvents();
        showStatus('合约已连接!', 'success');
    }
}

// 暴露给全局作用域，以便在控制台中使用
window.setContractAddress = setContractAddress;
