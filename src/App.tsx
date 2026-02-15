import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface AgentSession {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'working' | 'completed';
  task: string;
  progress: number;
  tokens: number;
  model: string;
  lastUpdated: Date;
}

const MOCK_AGENTS: AgentSession[] = [
  {
    id: '1',
    name: '調査エージェント',
    status: 'working',
    task: 'React 19の新機能を調査中...',
    progress: 75,
    tokens: 12500,
    model: 'GLM-5',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'コード生成エージェント',
    status: 'working',
    task: 'タスクスケジューラのコンポーネントを生成中...',
    progress: 45,
    tokens: 8200,
    model: 'GLM-5',
    lastUpdated: new Date(Date.now() - 30000),
  },
  {
    id: '3',
    name: 'ドキュメント作成エージェント',
    status: 'idle',
    task: '待機中',
    progress: 0,
    tokens: 3200,
    model: 'GLM-5',
    lastUpdated: new Date(Date.now() - 60000),
  },
  {
    id: '4',
    name: 'テストエージェント',
    status: 'completed',
    task: '単体テスト完了',
    progress: 100,
    tokens: 15000,
    model: 'GLM-5',
    lastUpdated: new Date(Date.now() - 120000),
  },
];

export default function App() {
  const [agents, setAgents] = useState<AgentSession[]>(MOCK_AGENTS);
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'working') {
          const newProgress = Math.min(100, agent.progress + Math.random() * 5);
          const newTokens = agent.tokens + Math.random() * 100;
          return {
            ...agent,
            progress: newProgress,
            tokens: Math.floor(newTokens),
            lastUpdated: new Date(),
            status: newProgress >= 100 ? 'completed' : 'working',
            task: newProgress >= 100 ? '完了' : agent.task,
          };
        }
        return agent;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-apple-blue';
      case 'completed':
        return 'bg-apple-green';
      case 'idle':
        return 'bg-apple-gray';
      default:
        return 'bg-apple-orange';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return '作業中';
      case 'completed':
        return '完了';
      case 'idle':
        return '待機中';
      default:
        return 'アクティブ';
    }
  };

  const totalTokens = agents.reduce((sum, agent) => sum + agent.tokens, 0);
  const activeAgents = agents.filter(a => a.status === 'working').length;

  return (
    <div className="min-h-screen bg-apple-background dark:bg-apple-background-dark transition-colors duration-300">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-apple-card dark:bg-apple-card-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-apple-text-primary dark:text-apple-text-primary-dark">
                エージェントダッシュボード
              </h1>
              <p className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                サブエージェントの作業状況をリアルタイム監視
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-apple-blue rounded focus:ring-apple-blue"
                />
                <span className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                  自動更新
                </span>
              </label>
              <button
                className="px-4 py-2 rounded-lg bg-apple-gray-light text-apple-text-primary hover:bg-gray-300 transition-all duration-200"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* サマリーカード */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center text-white text-xl">
                🤖
              </div>
              <div>
                <p className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                  アクティブエージェント
                </p>
                <p className="text-3xl font-semibold text-apple-text-primary dark:text-apple-text-primary-dark">
                  {activeAgents}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-apple-green flex items-center justify-center text-white text-xl">
                📊
              </div>
              <div>
                <p className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                  総トークン使用量
                </p>
                <p className="text-3xl font-semibold text-apple-text-primary dark:text-apple-text-primary-dark">
                  {totalTokens.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-apple-orange flex items-center justify-center text-white text-xl">
                ⚡
              </div>
              <div>
                <p className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                  平均進捗率
                </p>
                <p className="text-3xl font-semibold text-apple-text-primary dark:text-apple-text-primary-dark">
                  {Math.round(agents.reduce((sum, a) => sum + a.progress, 0) / agents.length)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* エージェントカード */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                {/* ヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${getStatusColor(agent.status)} flex items-center justify-center text-white`}
                    >
                      {agent.status === 'working' && '⚙️'}
                      {agent.status === 'completed' && '✅'}
                      {agent.status === 'idle' && '⏸️'}
                      {agent.status === 'active' && '🚀'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-apple-text-primary dark:text-apple-text-primary-dark">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                        {agent.model}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'working'
                        ? 'bg-apple-blue/20 text-apple-blue'
                        : agent.status === 'completed'
                        ? 'bg-apple-green/20 text-apple-green'
                        : agent.status === 'idle'
                        ? 'bg-apple-gray/20 text-apple-gray'
                        : 'bg-apple-orange/20 text-apple-orange'
                    }`}
                  >
                    {getStatusText(agent.status)}
                  </span>
                </div>

                {/* タスク */}
                <div className="mb-4">
                  <p className="text-sm text-apple-text-primary dark:text-apple-text-primary-dark mb-2">
                    タスク
                  </p>
                  <p className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                    {agent.task}
                  </p>
                </div>

                {/* 進捗バー */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-apple-text-secondary dark:text-apple-text-secondary-dark">
                      進捗率
                    </span>
                    <span className="text-sm font-medium text-apple-text-primary dark:text-apple-text-primary-dark">
                      {Math.round(agent.progress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getStatusColor(agent.status)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* トークン */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-apple-text-secondary dark:text-apple-text-secondary-dark">
                      トークン使用量
                    </p>
                    <p className="text-lg font-semibold text-apple-text-primary dark:text-apple-text-primary-dark">
                      {agent.tokens.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-apple-text-secondary dark:text-apple-text-secondary-dark">
                      最終更新
                    </p>
                    <p className="text-xs text-apple-text-primary dark:text-apple-text-primary-dark">
                      {format(agent.lastUpdated, 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
