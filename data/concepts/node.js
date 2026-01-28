node: {
    title: 'Node 深度解析',
    content: `
        <p>Node 是 Kubernetes 集群中的工作节点，可以是物理机或虚拟机。Node 运行容器化应用，由 Master 节点管理和调度。</p>
        
        <h5>Node 组件</h5>
        <ul>
            <li><strong>kubelet</strong>：Node 上的主要代理，负责与 Master 通信，管理 Pod 生命周期，上报节点状态</li>
            <li><strong>kube-proxy</strong>：维护网络规则，实现 Service 负载均衡，支持 iptables 和 IPVS 模式</li>
            <li><strong>Container Runtime</strong>：运行容器，支持 Docker、containerd、CRI-O 等</li>
            <li><strong>kubelet-cadvisor</strong>：集成在 kubelet 中，收集容器和节点资源使用情况</li>
        </ul>
        
        <h5>Node 状态</h5>
        <ul>
            <li><strong>Ready</strong>：节点健康，可用于调度 Pod</li>
            <li><strong>NotReady</strong>：节点不可用（资源不足、网络问题、kubelet 故障等）</li>
            <li><strong>Unknown</strong>：控制器无法与节点通信（通常网络问题）</li>
        </ul>
        
        <h5>Node 条件（Conditions）</h5>
        <ul>
            <li><strong>Ready</strong>：节点是否健康</li>
            <li><strong>MemoryPressure</strong>：节点内存压力</li>
            <li><strong>DiskPressure</strong>：节点磁盘压力</li>
            <li><strong>PIDPressure</strong>：节点进程数量压力</li>
            <li><strong>NetworkUnavailable</strong>：节点网络不可用</li>
        </ul>
        
        <h5>节点容量与可分配资源</h5>
        <ul>
            <li><strong>容量（Capacity）</strong>：节点的总资源（CPU、内存、存储）</li>
            <li><strong>可分配（Allocatable）</strong>：可供 Pod 使用的资源（扣除系统预留）</li>
        </ul>
        <p>系统预留包括：kubelet、系统进程、操作系统开销等。</p>
        
        <h5>节点标签和污点</h5>
        <ul>
            <li><strong>标签（Labels）</strong>：用于组织和选择节点</li>
            <li><strong>污点（Taints）</strong>：阻止 Pod 调度到节点，除非 Pod 有对应的容忍度</li>
            <li><strong>容忍度（Tolerations）</strong>：允许 Pod 调度到有污点的节点</li>
        </ul>
        
        <h5>常见污点</h5>
        <pre><code># Master 节点默认污点
key: node-role.kubernetes.io/control-plane
effect: NoSchedule

# 专用节点污点
key: dedicated
value: gpu
effect: NoSchedule

# 内存不足污点
key: node.kubernetes.io/memory-pressure
effect: NoSchedule</code></pre>
        
        <h5>污点效果（Taint Effects）</h5>
        <ul>
            <li><strong>NoSchedule</strong>：Pod 必须有容忍度才能调度</li>
            <li><strong>PreferNoSchedule</strong>：尽量不调度，但不是必须</li>
            <li><strong>NoExecute</strong>：立即驱逐没有容忍度的 Pod</li>
        </ul>
        
        <h5>节点亲和性（Node Affinity）</h5>
        <ul>
            <li><strong>requiredDuringSchedulingIgnoredDuringExecution</strong>：必须满足，否则不调度</li>
            <li><strong>preferredDuringSchedulingIgnoredDuringExecution</strong>：优先满足</li>
        </ul>
        
        <h5>Pod 亲和性与反亲和性</h5>
        <ul>
            <li><strong>Pod Affinity</strong>：Pod 优先调度到有特定 Pod 的节点</li>
            <li><strong>Pod Anti-Affinity</strong>：Pod 避免调度到有特定 Pod 的节点</li>
        </ul>
        
        <h5>常用命令</h5>
        <pre><code># 查看节点
kubectl get nodes
kubectl describe node node-1

# 查看节点详情
kubectl get node node-1 -o yaml

# 标记节点为不可调度
kubectl cordon node-1

# 取消标记
kubectl uncordon node-1

# 驱逐节点上的 Pod
kubectl drain node-1 --ignore-daemonsets

# 添加标签
kubectl label node node-1 disktype=ssd

# 添加污点
kubectl taint node node-1 key=value:NoSchedule

# 删除污点
kubectl taint node node-1 key:NoSchedule-</code></pre>
        
        <h5>节点维护</h5>
        <ul>
            <li><strong>Cordon</strong>：标记节点为不可调度，不影响现有 Pod</li>
            <li><strong>Drain</strong>：安全驱逐所有 Pod，标记为不可调度</li>
            <li><strong>Delete</strong>：删除节点（物理节点需要清理）</li>
        </ul>
        
        <h5>最佳实践</h5>
        <ul>
            <li>使用标签和污点合理规划节点资源</li>
            <li>定期监控节点健康状态和资源使用</li>
            <li>为不同类型的工作负载使用专用节点（如 GPU 节点）</li>
            <li>合理设置资源请求和限制，避免资源争抢</li>
            <li>使用自动伸缩（Cluster Autoscaler）管理节点数量</li>
            <li>定期维护和更新节点组件</li>
        </ul>
        
        <h5>节点问题检测</h5>
        <p>Node Problem Detector（NPD）是一个守护进程，用于检测和报告节点问题，包括：</p>
        <ul>
            <li>硬件问题（磁盘、内存、CPU）</li>
            <li>内核问题</li>
            <li>容器运行时问题</li>
            <li>文件系统问题</li>
        </ul>
    `
}