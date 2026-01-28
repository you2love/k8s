// Concept detail data
const conceptDetails = {
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
    },
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
    },
    service: {
        title: 'Service 深度解析',
        content: `
            <p>Service 为一组 Pod 提供稳定的网络访问入口，实现服务发现和负载均衡。由于 Pod 的 IP 是动态变化的，Service 提供了一个稳定的访问点。</p>
            
            <h5>为什么需要 Service？</h5>
            <ul>
                <li>Pod 的 IP 是临时的，重启后会改变</li>
                <li>需要统一的入口访问一组功能相同的 Pod</li>
                <li>需要负载均衡，将流量分发到多个 Pod</li>
                <li>需要服务发现机制，让应用能够相互找到</li>
            </ul>
            
            <h5>Service 类型</h5>
            <ul>
                <li><strong>ClusterIP（默认）</strong>：仅在集群内部可访问，分配一个集群内部的虚拟 IP，适合内部服务通信</li>
                <li><strong>NodePort</strong>：通过每个节点的 IP 和端口（默认 30000-32767）暴露服务，适合开发测试环境</li>
                <li><strong>LoadBalancer</strong>：使用云提供商的负载均衡器暴露服务，自动创建外部负载均衡器，适合生产环境</li>
                <li><strong>ExternalName</strong>：将服务映射到外部 DNS 名称，返回 CNAME 记录，不设置代理</li>
            </ul>
            
            <h5>选择器（Selector）</h5>
            <p>Service 通过标签选择器（Label Selector）来匹配目标 Pod：</p>
            <pre><code>selector:
  app: nginx
  tier: frontend</code></pre>
            
            <h5>无选择器 Service</h5>
            <p>Service 可以不指定选择器，此时需要手动创建 Endpoints：</p>
            <pre><code>kind: Service
metadata:
  name: external-service
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
kind: Endpoints
metadata:
  name: external-service
subsets:
  - addresses:
    - ip: 192.168.1.100
    ports:
    - port: 8080</code></pre>
            
            <h5>负载均衡策略</h5>
            <ul>
                <li><strong>默认</strong>：随机选择（iptables 模式）或轮询（IPVS 模式）</li>
                <li><strong>会话保持</strong>：将同一客户端的请求路由到同一个 Pod，基于 Client IP</li>
            </ul>
            <pre><code>sessionAffinity: ClientIP
sessionAffinityConfig:
  clientIP:
    timeoutSeconds: 10800</code></pre>
            
            <h5>端口配置</h5>
            <pre><code>ports:
- name: http
  protocol: TCP
  port: 80          # Service 端口
  targetPort: 8080  # Pod 端口（可以是名称）
  nodePort: 30080   # NodePort 端口（仅 NodePort 类型）</code></pre>
            
            <h5>服务发现</h5>
            <p>集群内部的 Pod 可以通过以下方式访问 Service：</p>
            <ul>
                <li><strong>环境变量</strong>：创建 Service 时自动注入</li>
                <li><strong>DNS</strong>：推荐方式，使用 CoreDNS</li>
            </ul>
            <pre><code># DNS 格式
<service-name>.<namespace>.svc.cluster.local

# 简写（同一 namespace）
<service-name>

# 跨 namespace 访问
<service-name>.<namespace></code></pre>
            
            <h5>Headless Service</h5>
            <p>不分配 ClusterIP，DNS 返回所有 Pod 的 IP：</p>
            <pre><code>spec:
  clusterIP: None  # 设置为 None</code></pre>
            <p>适用于 StatefulSet 和需要直接连接 Pod 的场景。</p>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Service
kubectl expose deployment nginx --port=80 --target-port=80

# 创建 NodePort 服务
kubectl expose deployment nginx --port=80 --type=NodePort

# 创建 LoadBalancer 服务
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# 查看 Service
kubectl get services
kubectl describe service nginx

# 查看 Service 的 endpoints
kubectl get endpoints nginx

# 删除 Service
kubectl delete service nginx

# 通过端口转发访问服务
kubectl port-forward service/nginx 8080:80</code></pre>
            
            <h5>最佳实践</h5>
            <ul>
                <li>为 Service 设置有意义的名称</li>
                <li>使用有意义的端口名称，便于后续引用</li>
                <li>生产环境使用 LoadBalancer 或 Ingress 暴露服务</li>
                <li>了解不同类型的适用场景，选择合适的类型</li>
                <li>监控 Service 的 Endpoints，确保后端 Pod 健康</li>
                <li>考虑使用 ExternalName 集成外部服务</li>
            </ul>
            
            <h5>Service 与 Ingress</h5>
            <ul>
                <li><strong>Service</strong>：L4 层负载均衡（TCP/UDP），支持基本的端口转发</li>
                <li><strong>Ingress</strong>：L7 层负载均衡（HTTP/HTTPS），支持基于域名的路由、SSL 终止等</li>
            </ul>
        `
    },
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
    },
    configmap: {
        title: 'ConfigMap 深度解析',
        content: `
            <p>ConfigMap 用于存储非敏感的配置数据，实现配置与代码分离。ConfigMap 让你可以在不重新构建镜像的情况下更新应用配置。</p>
            
            <h5>为什么使用 ConfigMap？</h5>
            <ul>
                <li><strong>配置与代码分离</strong>：避免将配置硬编码到镜像中</li>
                <li><strong>动态更新</strong>：无需重启 Pod 即可更新配置（挂载方式）</li>
                <li><strong>环境差异</strong>：不同环境使用不同配置</li>
                <li><strong>团队协作</strong>：开发人员可以修改配置，无需运维介入</li>
            </ul>
            
            <h5>使用方式</h5>
            <ul>
                <li><strong>环境变量</strong>：将 ConfigMap 的值注入到 Pod 的环境变量，适合少量配置</li>
                <li><strong>命令行参数</strong>：在容器启动命令中引用 ConfigMap 值</li>
                <li><strong>配置文件</strong>：将 ConfigMap 挂载为文件或目录，适合复杂配置</li>
            </ul>
            
            <h5>从字面值创建 ConfigMap</h5>
            <pre><code># 创建单个键值对
kubectl create configmap app-config \
  --from-literal=database_host=localhost \
  --from-literal=database_port=5432

# YAML 定义
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_host: "localhost"
  database_port: "5432"
  app_name: "myapp"</code></pre>
            
            <h5>从文件创建 ConfigMap</h5>
            <pre><code># 从单个文件创建
kubectl create configmap nginx-config \
  --from-file=nginx.conf

# 从多个文件创建
kubectl create configmap app-config \
  --from-file=config.yaml \
  --from-file=app.properties

# YAML 定义
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  nginx.conf: |
    server {
      listen 80;
      server_name localhost;
      location / {
        root /usr/share/nginx/html;
      }
    }</code></pre>
            
            <h5>从目录创建 ConfigMap</h5>
            <pre><code># 从目录创建所有文件
kubectl create configmap app-settings \
  --from-file=./config/

# 每个文件成为一个键，文件内容为值</code></pre>
            
            <h5>在 Pod 中使用 - 环境变量</h5>
            <pre><code>apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_host
    - name: DB_PORT
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_port
    # 注入所有键值对作为环境变量
    envFrom:
    - configMapRef:
        name: app-config</code></pre>
            
            <h5>在 Pod 中使用 - 挂载为文件</h5>
            <pre><code>apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
      readOnly: true
  volumes:
  - name: config-volume
    configMap:
      name: nginx-config
      items:
      - key: nginx.conf
        path: nginx.conf</code></pre>
            
            <h5>ConfigMap 不可变性</h5>
            <pre><code>apiVersion: v1
kind: ConfigMap
metadata:
  name: immutable-config
immutable: true  # 设置为不可变
data:
  key: "value"</code></pre>
            <p>不可变的 ConfigMap 可以提高性能和安全性，但更新需要创建新的 ConfigMap。</p>
            
            <h5>常用命令</h5>
            <pre><code># 创建 ConfigMap
kubectl create configmap my-config --from-literal=key=value

# 从文件创建
kubectl create configmap my-config --from-file=config.txt

# 查看 ConfigMap
kubectl get configmaps
kubectl describe configmap my-config

# 查看 ConfigMap 内容
kubectl get configmap my-config -o yaml

# 编辑 ConfigMap
kubectl edit configmap my-config

# 删除 ConfigMap
kubectl delete configmap my-config</code></pre>
            
            <h5>配置更新</h5>
            <ul>
                <li><strong>环境变量方式</strong>：更新 ConfigMap 后，需要重启 Pod 才能生效</li>
                <li><strong>挂载文件方式</strong>：更新 ConfigMap 后，文件会自动更新（有延迟），Pod 不需要重启</li>
            </ul>
            
            <h5>最佳实践</h5>
            <ul>
                <li>敏感信息使用 Secret，非敏感信息使用 ConfigMap</li>
                <li>为 ConfigMap 使用清晰的命名和标签</li>
                <li>使用版本控制管理 ConfigMap 的 YAML 文件</li>
                <li>考虑使用不可变 ConfigMap 提高性能</li>
                <li>定期审查和清理不再使用的 ConfigMap</li>
                <li>使用命名空间隔离不同环境的配置</li>
            </ul>
            
            <h5>注意事项</h5>
            <ul>
                <li>ConfigMap 有大小限制（1MB）</li>
                <li>ConfigMap 不适合存储大量数据</li>
                <li>挂载文件时，会隐藏容器中的原始目录</li>
                <li>环境变量方式不支持配置更新</li>
            </ul>
        `
    },
    secret: {
        title: 'Secret 深度解析',
        content: `
            <p>Secret 用于存储敏感信息如密码、密钥、证书等。Secret 数据以 Base64 编码存储，在 etcd 中加密保存。</p>
            
            <h5>为什么使用 Secret？</h5>
            <ul>
                <li><strong>安全性</strong>：敏感信息不会明文存储在 Pod 定义或镜像中</li>
                <li><strong>加密存储</strong>：Secret 在 etcd 中加密存储</li>
                <li><strong>访问控制</strong>：通过 RBAC 控制谁可以访问 Secret</li>
                <li><strong>自动挂载</strong>：可以自动挂载到 Pod 的文件系统</li>
            </ul>
            
            <h5>Secret 类型</h5>
            <ul>
                <li><strong>Opaque</strong>：通用类型，用于任意用户数据（密码、API 密钥等）</li>
                <li><strong>kubernetes.io/dockerconfigjson</strong>：Docker 镜像仓库凭证</li>
                <li><strong>kubernetes.io/tls</strong>：TLS 证书，包含证书和私钥</li>
                <li><strong>kubernetes.io/service-account-token</strong>：服务账户令牌，自动创建</li>
                <li><strong>kubernetes.io/basic-auth</strong>：基本认证凭证</li>
                <li><strong>kubernetes.io/ssh-auth</strong>：SSH 认证凭证</li>
                <li><strong>bootstrap.kubernetes.io/token</strong>：Bootstrap token</li>
            </ul>
            
            <h5>创建 Opaque Secret</h5>
            <pre><code># 从字面值创建（数据会自动 Base64 编码）
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123

# 从文件创建
kubectl create secret generic app-secret \
  --from-file=app.key \
  --from-file=app.crt

# YAML 定义（需要手动 Base64 编码）
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=      # Base64 编码的 "admin"
  password: c2VjcmV0MTIz  # Base64 编码的 "secret123"</code></pre>
            
            <h5>创建 Docker Registry Secret</h5>
            <pre><code># 从 Docker 配置创建
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=user \
  --docker-password=pass \
  --docker-email=user@example.com

# 从 ~/.docker/config.json 创建
kubectl create secret docker-registry regcred \
  --from-file=.dockerconfigjson=/root/.docker/config.json

# YAML 定义
apiVersion: v1
kind: Secret
metadata:
  name: regcred
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: eyJhdXRocyI6ey...}</code></pre>
            
            <h5>创建 TLS Secret</h5>
            <pre><code># 从证书文件创建
kubectl create secret tls tls-secret \
  --cert=tls.crt \
  --key=tls.key

# YAML 定义
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # Base64 编码的证书
  tls.key: LS0tLS1CRUdJTi... # Base64 编码的私钥</code></pre>
            
            <h5>在 Pod 中使用 Secret</h5>
            <pre><code># 作为环境变量
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password

# 挂载为文件
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret

# 镜像拉拉取凭证
spec:
  imagePullSecrets:
  - name: regcred</code></pre>
            
            <h5>Secret 加密</h5>
            <ul>
                <li><strong>静态加密</strong>：在 etcd 中加密存储，需要配置 EncryptionConfiguration</li>
                <li><strong>传输加密</strong>：API Server 通信使用 HTTPS</li>
                <li><strong>内存加密</strong>：Secret 在内存中加密（部分云提供商支持）</li>
            </ul>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Secret
kubectl create secret generic my-secret --from-literal=key=value

# 查看 Secret（不显示内容）
kubectl get secrets

# 查看 Secret 详情（显示内容）
kubectl describe secret my-secret

# 查看 Secret 内容（Base64 解码）
kubectl get secret my-secret -o jsonpath='{.data.password}' | base64 -d

# 编辑 Secret
kubectl edit secret my-secret

# 删除 Secret
kubectl delete secret my-secret

# 从文件解码 Secret
echo "c2VjcmV0MTIz" | base64 -d</code></pre>
            
            <h5>安全最佳实践</h5>
            <ul>
                <li><strong>避免提交到版本控制</strong>：不要将 Secret YAML 文件提交到 Git</li>
                <li><strong>使用 RBAC</strong>：限制 Secret 的访问权限，遵循最小权限原则</li>
                <li><strong>启用静态加密</strong>：配置 etcd 加密存储 Secret</li>
                <li><strong>定期轮换</strong>：定期更新密码和密钥</li>
                <li><strong>使用外部密钥管理</strong>：考虑使用 HashiCorp Vault、AWS Secrets Manager 等</li>
                <li><strong>命名空间隔离</strong>：使用命名空间隔离不同环境的 Secret</li>
                <li><strong>审计日志</strong>：启用审计日志跟踪 Secret 访问</li>
            </ul>
            
            <h5>Secret 与 ConfigMap 对比</h5>
            <ul>
                <li><strong>用途</strong>：Secret 存储敏感信息，ConfigMap 存储非敏感配置</li>
                <li><strong>编码</strong>：Secret 使用 Base64 编码，ConfigMap 纯文本</li>
                <li><strong>大小限制</strong>：Secret 最大 1MB，ConfigMap 最大 1MB</li>
                <li><strong>访问控制</strong>：Secret 有更严格的访问控制</li>
            </ul>
            
            <h5>注意事项</h5>
            <ul>
                <li>Base64 不是加密，只是编码</li>
                <li>Secret 数据可以被任何能够访问 Secret 的人解码</li>
                <li>挂载 Secret 为文件时，文件权限默认为 0444</li>
                <li>不要在命令行或 Pod 定义中明文传递敏感信息</li>
                <li>考虑使用外部密钥管理系统管理 Secret</li>
            </ul>
            
            <h5>高级特性</h5>
            <ul>
                <li><strong>不可变 Secret</strong>：提高性能和安全性</li>
                <li><strong>Secret 供应商</strong>：支持从外部系统注入 Secret</li>
                <li><strong>CSP（Cloud Service Provider）集成</strong>：云厂商提供的 Secret 管理</li>
            </ul>
        `
    }
};

// Initialize concept details
document.addEventListener('DOMContentLoaded', function() {
    const conceptButtons = document.querySelectorAll('.concept-btn');
    
    conceptButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            const details = conceptDetails[topic];
            const detailContainer = document.getElementById(topic + '-detail');
            
            if (details && detailContainer) {
                const isHidden = detailContainer.classList.contains('d-none');
                
                // Close all other detail containers
                document.querySelectorAll('.concept-detail-content').forEach(container => {
                    container.classList.add('d-none');
                });
                
                // Reset all button text
                conceptButtons.forEach(btn => {
                    btn.textContent = '了解更多';
                });
                
                // Toggle current detail container
                if (isHidden) {
                    detailContainer.innerHTML = details.content;
                    detailContainer.classList.remove('d-none');
                    this.textContent = '收起内容';
                } else {
                    this.textContent = '了解更多';
                }
            }
        });
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Add hover effect to resource cards
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

// Copy code functionality
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'CODE' || e.target.closest('pre')) {
        const pre = e.target.closest('pre');
        if (pre && !pre.dataset.copyAdded) {
            pre.dataset.copyAdded = 'true';
            
            const copyButton = document.createElement('button');
            copyButton.className = 'btn btn-sm btn-light position-absolute top-0 end-0 m-2';
            copyButton.innerHTML = '<i class="material-icons fs-6">content_copy</i>';
            copyButton.style.opacity = '0.7';
            
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
            
            copyButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const code = pre.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerHTML = '<i class="material-icons fs-6">check</i>';
                    copyButton.style.opacity = '1';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="material-icons fs-6">content_copy</i>';
                        copyButton.style.opacity = '0.7';
                    }, 2000);
                });
            });
        }
    }
});
});