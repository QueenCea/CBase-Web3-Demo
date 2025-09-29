# 🔢 Web3 计数器 DApp

这是一个简单的Web3去中心化应用（DApp）演示项目，包含一个Solidity智能合约和一个前端界面。

## 📋 项目概述

这个项目演示了：
- **智能合约开发**: 使用Solidity编写的简单计数器合约
- **前端交互**: 使用JavaScript和ethers.js与区块链交互
- **钱包集成**: 集成MetaMask钱包进行交易签名
- **事件监听**: 实时监听合约事件更新

## 🚀 功能特性

### 智能合约功能
- ✅ 计数器增加/减少
- ✅ 设置特定计数值
- ✅ 重置计数（仅合约所有者）
- ✅ 事件日志记录
- ✅ 访问控制

### 前端功能
- 🦊 MetaMask钱包连接
- 📊 实时计数显示
- 🔄 交互式按钮操作
- 📱 响应式设计
- 🎯 事件监听和状态更新

## 🛠️ 技术栈

- **智能合约**: Solidity ^0.8.19
- **合约开发框架**: Hardhat
- **前端框架**: HTML5, CSS3, JavaScript
- **Web3库**: ethers.js v5.7.2
- **钱包**: MetaMask

## 📁 项目结构

```
web3-demo/
├── contracts/          # 智能合约
│   └── Counter.sol
├── scripts/            # 部署脚本
│   └── deploy.js
├── test/              # 测试文件
│   └── Counter.test.js
├── index.html         # 前端页面
├── app.js            # 前端JavaScript
├── package.json      # 项目配置
├── hardhat.config.js # Hardhat配置
└── README.md         # 说明文档
```

## 🚀 快速开始

前端命令:
### 1. 安装依赖

```bash
# 安装Node.js依赖
npm install

# 或使用yarn
yarn install
```

合约命令:

### 2. 编译合约

```bash
npx hardhat compile
```

### 3. 运行测试

```bash
npx hardhat test
```
### 5. 部署合约

在新的终端窗口中：

```bash
# 部署到本地网络
npx hardhat run scripts/deploy.js --network localhost
```

记下输出的合约地址，例如：`0x5FbDB2315678afecb367f032d93F642f64180aa3`

### 6. 配置前端

打开 `app.js` 文件，找到 `CONTRACT_ADDRESS` 变量，将其设置为部署后的合约地址：

```javascript
let CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为实际地址
```

### 7. 启动前端服务器

```bash

# 使用http-server
npm run serve
```

### 8. 配置MetaMask

1. 在浏览器中打开 MetaMask
2. 添加本地网络：
   - 网络名称: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - 链ID: `31337`
   - 货币符号: `ETH`

3. 导入测试账户：
   - 从Hardhat节点输出中复制私钥
   - 在MetaMask中导入账户

### 9. 访问应用

在浏览器中访问 `http://localhost:8000`

## 🔗 使用说明

1. **连接钱包**: 点击"连接MetaMask钱包"按钮
2. **查看计数**: 当前计数值会显示在中央区域
3. **操作计数**: 
   - 点击"➕ 增加"按钮增加计数
   - 点击"➖ 减少"按钮减少计数
   - 输入数值并点击"设置"来设置特定计数
   - 点击"🔄 重置"来重置计数（仅合约所有者）

## 🌐 部署到测试网

### Sepolia 测试网部署

1. 获取Sepolia测试ETH：https://arbitrum-sepolia-faucet.com/
2. 获取Alchemy API密钥：https://alchemy.com/
3. 修改 `hardhat.config.js` 配置：

```javascript
const PRIVATE_KEY = "your-private-key-here";
const SEPOLIA_RPC_URL = "https://arbitrum-sepolia-rpc.publicnode.com";

module.exports = {
  // ... 其他配置
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 421614
    }
  }
};
```

4. 部署到Sepolia：

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 🧪 测试

运行完整的测试套件：

```bash
# 运行所有测试
npx hardhat test

# 运行特定测试文件
npx hardhat test test/Counter.test.js

# 显示详细信息
npx hardhat test --verbose
```

## 📝 智能合约接口

### 主要函数

- `getCount()`: 获取当前计数值
- `increment()`: 增加计数
- `decrement()`: 减少计数
- `setCount(uint256 _count)`: 设置特定计数值
- `reset()`: 重置计数为0（仅所有者）

### 事件

- `CountChanged(uint256 newCount, address changedBy)`: 计数改变时触发

## ⚠️ 注意事项

1. **私钥安全**: 永远不要在代码中硬编码私钥
2. **Gas费用**: 每次交易都需要支付Gas费用
3. **网络配置**: 确保MetaMask连接到正确的网络
4. **合约地址**: 部署后需要更新前端中的合约地址

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [Solidity官方文档](https://docs.soliditylang.org/)
- [Hardhat官方文档](https://hardhat.org/docs)
- [ethers.js文档](https://docs.ethers.io/)
- [MetaMask文档](https://docs.metamask.io/)

## 🆘 常见问题

### Q: 无法连接到合约
A: 检查合约地址是否正确，以及MetaMask是否连接到正确的网络。

### Q: 交易失败
A: 确保账户有足够的ETH支付Gas费用，并且网络连接正常。

### Q: 计数不更新
A: 检查浏览器控制台是否有错误信息，确认合约事件监听是否正常。

---

🎉 **恭喜！你现在有了一个完整的Web3 DApp！**
