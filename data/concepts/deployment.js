deployment: {
    title: 'Deployment 深度解析',
    content: `
        <p>Deployment 管理无状态应用的部署和更新，提供声明式更新和回滚能力。它是最常用的控制器之一，用于管理 Pod 和 ReplicaSet。</p>
        
        <h5>核心功能</h5>
        <ul>
            <li><strong>Pod 副本管理</strong>：自动维护指定数量的 Pod 副本，确保应用可用性</li>
            <li><strong>滚动更新</strong>：零停机更新应用版本，逐步替换旧 Pod</li>
            <li><strong>自动回滚</strong>：更新失败时自动回滚到稳定版本</li>
            <li><strong>扩展和缩减</strong>：根据负载动态调整副本数，支持手动和自动伸缩</li>
            <li><strong>版本管理</strong>：保留 Deployment 历史版本，便于回滚</li>
            <li><strong>暂停和恢复</strong>：可以暂停更新过程，便于调试</li>
        </ul>
        
        <h5>Deployment 工作原理</h5>
        <p>Deployment 通过管理 ReplicaSet 来实现其功能。每次 Deployment 更新都会创建一个新的 ReplicaSet，Deployment 会控制新旧 ReplicaSet 之间的 Pod 切换过程。</p>
        
        <h5>更新策略</h5>
        <ul>
            <li><strong>RollingUpdate（默认）</strong>：逐步替换旧 Pod，确保服务始终可用</li>
            <li><strong>Recreate</strong>：先删除所有旧 Pod，再创建新 Pod，会有短暂的服务中断</li>
        </ul>
        
        <h5>RollingUpdate 配置</h5>
        <pre><code>strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%       # 更新过程中可以超过期望副本数的最大比例或数量
    maxUnavailable: 25% # 更新过程中不可用副本数的最大比例或数量</code></pre>
        
        <h5>健康检查</h5>
        <pre><code>spec:
  minReadySeconds: 10   # Pod 就绪后至少等待 10 秒才认为可用
  progressDeadlineSeconds: 600 # 更新超时时间</code></pre>
        
        <h5>常用命令</h5>
        <pre><code># 创建 Deployment
kubectl create deployment nginx --image=nginx:1.21

# 扩展副本
kubectl scale deployment nginx --replicas=3

# 更新镜像
kubectl set image deployment/nginx nginx=nginx:1.22

# 编辑 Deployment
kubectl edit deployment nginx

# 查看更新状态
kubectl rollout status deployment/nginx

# 查看更新历史
kubectl rollout history deployment/nginx

# 查看特定版本的详情
kubectl rollout history deployment/nginx --revision=2

# 回滚到上一版本
kubectl rollout undo deployment/nginx

# 回滚到指定版本
kubectl rollout undo deployment/nginx --to-revision=2

# 暂停 Deployment 更新
kubectl rollout pause deployment/nginx

# 恢复 Deployment 更新
kubectl rollout resume deployment/nginx

# 查看 Deployment 事件
kubectl describe deployment nginx</code></pre>
        
        <h5>声明式 vs 命令式</h5>
        <ul>
            <li><strong>命令式</strong>：使用 kubectl 命令直接操作（适合快速测试和学习）</li>
            <li><strong>声明式</strong>：使用 YAML 文件定义期望状态（推荐用于生产环境）</li>
        </ul>
        
        <h5>最佳实践</h5>
        <ul>
            <li>始终使用 YAML 文件管理 Deployment，便于版本控制</li>
            <li>设置合理的资源请求和限制</li>
            <li>配置适当的健康检查探针</li>
            <li>使用标签（Labels）组织和选择资源</li>
            <li>定期测试更新和回滚流程</li>
            <li>考虑使用 HPA（Horizontal Pod Autoscaler）实现自动伸缩</li>
        </ul>
        
        <h5>常见问题</h5>
        <ul>
            <li><strong>镜像拉取失败</strong>：检查镜像名称、tag 和仓库访问权限</li>
            <li><strong>资源不足</strong>：检查节点资源，增加副本数或升级节点</li>
            <li><strong>健康检查失败</strong>：检查探针配置和应用健康状态</li>
            <li><strong>更新卡住</strong>：检查 progressDeadlineSeconds 和错误日志</li>
        </ul>
    `
}