pod: {
    title: 'Pod 深度解析',
    content: `
        <p>Pod 是 Kubernetes 中最小的可部署计算单元，可以包含一个或多个容器。Pod 代表了集群中运行的一个进程组。</p>
        
        <h5>为什么需要 Pod？</h5>
        <p>Pod 的设计理念是将多个紧密协作的容器组合在一起，它们共享相同的网络和存储命名空间。这种方式比单独管理每个容器更加高效和自然。</p>
        
        <h5>核心特性</h5>
        <ul>
            <li><strong>共享网络命名空间</strong>：同一 Pod 内的容器共享网络栈，使用相同的 IP 地址和端口空间，容器间可以通过 localhost 相互通信</li>
            <li><strong>共享存储卷</strong>：可以通过 EmptyDir 卷实现容器间数据共享，多个容器可以同时读写同一文件</li>
            <li><strong>共享 IPC 命名空间</strong>：容器间可以使用 SystemV IPC 或 POSIX 消息队列进行通信</li>
            <li><strong>生命周期短暂</strong>：Pod 可以被创建、删除和重建，通常由控制器（如 Deployment）管理</li>
            <li><strong>原子性调度</strong>：Pod 总是作为一个整体被调度到同一个 Node 上</li>
        </ul>
        
        <h5>多容器 Pod 模式</h5>
        <ul>
            <li><strong>Sidecar 模式</strong>：主容器负责业务逻辑，sidecar 容器负责辅助功能（如日志收集、监控、代理）</li>
            <li><strong>Ambassador 模式</strong>：容器作为代理，简化主容器与外部系统的交互</li>
            <li><strong>Adapter 模式</strong>：容器标准化或转换主容器的输出，使其符合外部系统的接口规范</li>
        </ul>
        
        <h5>生命周期状态</h5>
        <ul>
            <li><strong>Pending</strong>：Pod 已被 API Server 接受，但容器尚未创建（可能因为镜像下载、调度等待等）</li>
            <li><strong>Running</strong>：Pod 已绑定到 Node，所有容器都已创建，至少一个容器正在运行或正在启动/重启</li>
            <li><strong>Succeeded</strong>：Pod 中所有容器都已成功终止，不会重启（用于一次性任务）</li>
            <li><strong>Failed</strong>：Pod 中所有容器都已终止，至少一个容器异常终止</li>
            <li><strong>Unknown</strong>：Pod 状态无法确定（通常因为通信问题）</li>
        </ul>
        
        <h5>Pod 条件（Conditions）</h5>
        <ul>
            <li><strong>PodScheduled</strong>：Pod 已被调度到某个节点</li>
            <li><strong>Initialized</strong>：所有 Init Container 已成功完成</li>
            <li><strong>Ready</strong>：Pod 可以为请求提供服务（所有容器都 Ready）</li>
            <li><strong>ContainersReady</strong>：所有容器都已就绪</li>
            <li><strong>Unschedulable</strong>：调度器无法调度该 Pod</li>
        </ul>
        
        <h5>资源限制</h5>
        <pre><code>resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"</code></pre>
        
        <h5>探针（Probes）</h5>
        <ul>
            <li><strong>Liveness Probe</strong>：存活探针，检测容器是否运行，失败则重启容器</li>
            <li><strong>Readiness Probe</strong>：就绪探针，检测容器是否可以接收流量，失败则从 Service 中移除</li>
            <li><strong>Startup Probe</strong>：启动探针，检测容器是否启动成功，用于慢启动应用</li>
        </ul>
        
        <h5>常用命令</h5>
        <pre><code># 创建 Pod
kubectl run nginx --image=nginx

# 查看 Pod 详情
kubectl describe pod nginx

# 查看 Pod 日志
kubectl logs nginx

# 进入 Pod 容器
kubectl exec -it nginx -- /bin/bash

# 删除 Pod
kubectl delete pod nginx</code></pre>
        
        <h5>最佳实践</h5>
        <ul>
            <li>每个 Pod 通常只运行一个主容器，必要时添加 sidecar 容器</li>
            <li>始终设置资源请求和限制，避免资源争抢</li>
            <li>使用合适的探针确保应用健康</li>
            <li>不要在 Pod 中存储重要数据，Pod 可能随时被删除</li>
            <li>使用控制器（Deployment）而不是直接管理 Pod</li>
        </ul>
    `
}