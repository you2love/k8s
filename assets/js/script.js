// Concept detail data
const conceptDetails = {
    pod: {
        title: 'Pod 深度解析',
        content: `
            <p>Pod 是 Kubernetes 中最小的可部署计算单元，可以包含一个或多个容器。Pod 代表了集群中运行的一个进程组。</p>
            
            <h5>Pod 内部架构</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    subgraph Pod[Pod]
        subgraph Network[共享网络命名空间]
            IP[单一 IP 地址]
            Port[共享端口空间]
        end
        subgraph Storage[共享存储卷]
            Vol1[EmptyDir]
            Vol2[HostPath]
        end
        subgraph Containers[容器组]
            C1[主容器<br/>业务逻辑]
            C2[Sidecar 容器<br/>辅助功能]
        end
        subgraph IPC[共享 IPC]
            Msg[消息队列]
            Shm[共享内存]
        end
    end
    
    Network --> Containers
    Storage --> Containers
    IPC --> Containers
    
    style Pod fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style Network fill:#fff3e0,stroke:#f57c00
    style Storage fill:#e8f5e9,stroke:#388e3c
    style Containers fill:#fce4ec,stroke:#c2185b
    style IPC fill:#f3e5f5,stroke:#7b1fa2
                </pre>
            </div>
            
            <h5>Pod 生命周期状态流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
stateDiagram-v2
    [*] --> Pending: 创建请求
    Pending --> Running: 调度成功<br/>容器启动
    Pending --> Failed: 调度失败
    Running --> Succeeded: 任务完成
    Running --> Failed: 容器崩溃
    Running --> Running: 重启策略
    Succeeded --> [*]
    Failed --> [*]
    
    note right of Pending
        等待调度
        拉取镜像
    end note
    
    note right of Running
        容器运行中
        就绪探针检查
    end note
                </pre>
            </div>
            
            <h5>多容器 Pod 模式</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart LR
    subgraph Sidecar[Sidecar 模式]
        App1[应用容器] --> Log[日志收集]
        App1 --> Monitor[监控代理]
    end
    
    subgraph Ambassador[Ambassador 模式]
        App2[应用容器] --> Proxy[代理容器]
        Proxy --> External[外部服务]
    end
    
    subgraph Adapter[Adapter 模式]
        App3[应用容器] --> Adapter1[适配器]
        Adapter1 --> StdOut[标准化输出]
    end
    
    style Sidecar fill:#e3f2fd,stroke:#1976d2
    style Ambassador fill:#e8f5e9,stroke:#388e3c
    style Adapter fill:#fff3e0,stroke:#f57c00
                </pre>
            </div>
            
            <h5>探针工作流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant Kubelet
    participant Container
    participant Service
    
    Note over Kubelet,Container: Liveness Probe - 存活检查
    Kubelet->>Container: HTTP/TCP/Exec 检查
    alt 检查成功
        Container-->>Kubelet: 成功响应
        Kubelet->>Kubelet: 继续运行
    else 检查失败
        Container-->>Kubelet: 失败/超时
        Kubelet->>Container: 重启容器
    end
    
    Note over Kubelet,Service: Readiness Probe - 就绪检查
    Kubelet->>Container: HTTP/TCP 检查
    alt 就绪成功
        Container-->>Kubelet: 成功响应
        Kubelet->>Service: 添加到后端
    else 就绪失败
        Container-->>Kubelet: 失败响应
        Kubelet->>Service: 从后端移除
    end
                </pre>
            </div>
            
            <h5>Pod 资源配置对比</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>配置项</th>
                        <th>requests</th>
                        <th>limits</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>作用</strong></td>
                        <td>调度时的最小资源保证</td>
                        <td>运行时的最大资源限制</td>
                    </tr>
                    <tr>
                        <td><strong>CPU</strong></td>
                        <td>保证分配的 CPU 时间</td>
                        <td>最大 CPU 使用量（可被限流）</td>
                    </tr>
                    <tr>
                        <td><strong>内存</strong></td>
                        <td>保证可用的内存</td>
                        <td>最大内存（超出会被 OOM Kill）</td>
                    </tr>
                    <tr>
                        <td><strong>示例</strong></td>
                        <td>cpu: 250m, memory: 64Mi</td>
                        <td>cpu: 500m, memory: 128Mi</td>
                    </tr>
                </tbody>
            </table>
            
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
        `
    },
    deployment: {
        title: 'Deployment 深度解析',
        content: `
            <p>Deployment 管理无状态应用的部署和更新，提供声明式更新和回滚能力。它是最常用的控制器之一，用于管理 Pod 和 ReplicaSet。</p>
            
            <h5>Deployment 架构关系</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    subgraph Deployment[Deployment]
        Spec[期望状态: 3 副本]
    end
    
    subgraph RS1[ReplicaSet v1]
        RS1_Spec[副本: 0]
        P1[Pod v1-1]
        P2[Pod v1-2]
        P3[Pod v1-3]
    end
    
    subgraph RS2[ReplicaSet v2 当前]
        RS2_Spec[副本: 3]
        P4[Pod v2-1]
        P5[Pod v2-2]
        P6[Pod v2-3]
    end
    
    Deployment --> RS1
    Deployment --> RS2
    RS1_Spec --> P1
    RS1_Spec --> P2
    RS1_Spec --> P3
    RS2_Spec --> P4
    RS2_Spec --> P5
    RS2_Spec --> P6
    
    style Deployment fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style RS1 fill:#ffcdd2,stroke:#c62828,stroke-dasharray: 5 5
    style RS2 fill:#c8e6c9,stroke:#388e3c
                </pre>
            </div>
            
            <h5>滚动更新流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant User as 用户
    participant Deploy as Deployment
    participant RS1 as ReplicaSet v1
    participant RS2 as ReplicaSet v2
    participant Pod as Pods
    
    User->>Deploy: kubectl set image
    Deploy->>Deploy: 创建 RS2 (新版本)
    
    loop 滚动更新
        Deploy->>RS2: 创建新 Pod
        RS2->>Pod: 启动 v2 Pod
        Deploy->>RS1: 删除旧 Pod
        RS1->>Pod: 终止 v1 Pod
    end
    
    Note over Deploy,Pod: maxSurge: 最多超出期望副本数<br/>maxUnavailable: 最多不可用副本数
                </pre>
            </div>
            
            <h5>更新策略对比</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>策略</th>
                        <th>RollingUpdate</th>
                        <th>Recreate</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>更新方式</strong></td>
                        <td>逐步替换，新旧共存</td>
                        <td>先删后建，全部替换</td>
                    </tr>
                    <tr>
                        <td><strong>停机时间</strong></td>
                        <td>无（零停机）</td>
                        <td>有（短暂中断）</td>
                    </tr>
                    <tr>
                        <td><strong>资源占用</strong></td>
                        <td>较高（新旧 Pod 共存）</td>
                        <td>较低</td>
                    </tr>
                    <tr>
                        <td><strong>回滚能力</strong></td>
                        <td>支持</td>
                        <td>支持</td>
                    </tr>
                    <tr>
                        <td><strong>适用场景</strong></td>
                        <td>生产环境，需持续服务</td>
                        <td>开发测试，可接受中断</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Deployment
kubectl create deployment nginx --image=nginx:1.21

# 扩展副本
kubectl scale deployment nginx --replicas=3

# 更新镜像
kubectl set image deployment/nginx nginx=nginx:1.22

# 查看更新状态
kubectl rollout status deployment/nginx

# 查看更新历史
kubectl rollout history deployment/nginx

# 回滚到上一版本
kubectl rollout undo deployment/nginx

# 回滚到指定版本
kubectl rollout undo deployment/nginx --to-revision=2</code></pre>
        `
    },
    service: {
        title: 'Service 深度解析',
        content: `
            <p>Service 为一组 Pod 提供稳定的网络访问入口，实现服务发现和负载均衡。由于 Pod 的 IP 是动态变化的，Service 提供了一个稳定的访问点。</p>
            
            <h5>Service 工作原理</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart LR
    subgraph Client[客户端]
        C1[请求]
    end
    
    subgraph Service[Service]
        VIP[ClusterIP: 10.0.0.1]
        Selector[app=nginx]
    end
    
    subgraph Nodes[Worker Nodes]
        subgraph Node1[Node 1]
            P1[Pod 1<br/>10.244.1.1]
            P2[Pod 2<br/>10.244.1.2]
        end
        subgraph Node2[Node 2]
            P3[Pod 3<br/>10.244.2.1]
        end
    end
    
    C1 -->|负载均衡| VIP
    VIP --> Selector
    Selector --> P1
    Selector --> P2
    Selector --> P3
    
    style Service fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style Client fill:#fff3e0,stroke:#f57c00
    style Nodes fill:#e8f5e9,stroke:#388e3c
                </pre>
            </div>
            
            <h5>Service 类型对比</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>类型</th>
                        <th>访问范围</th>
                        <th>端口范围</th>
                        <th>适用场景</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>ClusterIP</strong></td>
                        <td>集群内部</td>
                        <td>内部端口</td>
                        <td>内部服务通信</td>
                    </tr>
                    <tr>
                        <td><strong>NodePort</strong></td>
                        <td>集群外部</td>
                        <td>30000-32767</td>
                        <td>开发测试环境</td>
                    </tr>
                    <tr>
                        <td><strong>LoadBalancer</strong></td>
                        <td>公网访问</td>
                        <td>云厂商分配</td>
                        <td>生产环境</td>
                    </tr>
                    <tr>
                        <td><strong>ExternalName</strong></td>
                        <td>外部服务</td>
                        <td>DNS 映射</td>
                        <td>外部服务集成</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>服务发现流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant App as 应用 Pod
    participant DNS as CoreDNS
    participant SVC as Service
    participant Backend as 后端 Pod
    
    App->>DNS: 解析 nginx.default.svc
    DNS-->>App: 返回 ClusterIP
    App->>SVC: 请求 ClusterIP:80
    SVC->>Backend: 负载均衡转发
    Backend-->>SVC: 响应
    SVC-->>App: 返回响应
                </pre>
            </div>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Service
kubectl expose deployment nginx --port=80 --target-port=80

# 创建 NodePort 服务
kubectl expose deployment nginx --port=80 --type=NodePort

# 查看 Service
kubectl get services

# 查看 endpoints
kubectl get endpoints nginx

# 端口转发
kubectl port-forward service/nginx 8080:80</code></pre>
        `
    },
    node: {
        title: 'Node 深度解析',
        content: `
            <p>Node 是 Kubernetes 集群中的工作节点，可以是物理机或虚拟机。Node 运行容器化应用，由 Master 节点管理和调度。</p>
            
            <h5>Node 组件架构</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    subgraph Master[Master 节点]
        API[API Server]
    end
    
    subgraph Worker[Worker Node]
        subgraph Components[核心组件]
            Kubelet[kubelet<br/>节点代理]
            Proxy[kube-proxy<br/>网络代理]
            Runtime[Container Runtime<br/>容器运行时]
        end
        
        subgraph Pods[运行中的 Pod]
            Pod1[Pod 1]
            Pod2[Pod 2]
            Pod3[Pod 3]
        end
        
        subgraph Resources[节点资源]
            CPU[CPU]
            Mem[内存]
            Disk[磁盘]
        end
    end
    
    Master -->|指令| Kubelet
    Kubelet --> Runtime
    Runtime --> Pods
    Kubelet --> Pods
    Proxy --> Pods
    Resources --> Pods
    
    style Master fill:#e3f2fd,stroke:#1976d2
    style Worker fill:#e8f5e9,stroke:#388e3c
    style Components fill:#fff3e0,stroke:#f57c00
                </pre>
            </div>
            
            <h5>Node 状态流转</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
stateDiagram-v2
    [*] --> Ready: 节点启动成功
    Ready --> NotReady: 资源不足/网络故障
    NotReady --> Ready: 问题恢复
    Ready --> Unknown: 通信中断
    Unknown --> Ready: 通信恢复
    NotReady --> Unknown: 通信中断
    
    note right of Ready
        节点健康
        可调度 Pod
    end note
    
    note right of NotReady
        节点异常
        暂停调度
    end note
                </pre>
            </div>
            
            <h5>Node 条件状态</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>条件</th>
                        <th>说明</th>
                        <th>影响</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Ready</strong></td>
                        <td>节点健康状态</td>
                        <td>False 时暂停调度</td>
                    </tr>
                    <tr>
                        <td><strong>MemoryPressure</strong></td>
                        <td>内存压力</td>
                        <td>触发 Pod 驱逐</td>
                    </tr>
                    <tr>
                        <td><strong>DiskPressure</strong></td>
                        <td>磁盘压力</td>
                        <td>触发清理/驱逐</td>
                    </tr>
                    <tr>
                        <td><strong>PIDPressure</strong></td>
                        <td>进程数压力</td>
                        <td>限制新进程</td>
                    </tr>
                    <tr>
                        <td><strong>NetworkUnavailable</strong></td>
                        <td>网络不可用</td>
                        <td>影响网络通信</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>污点与容忍度</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart LR
    subgraph Node[节点]
        Taint[污点<br/>key=value:NoSchedule]
    end
    
    subgraph Pods[Pods]
        P1[Pod A<br/>无容忍]
        P2[Pod B<br/>有容忍]
    end
    
    Taint -->|阻止| P1
    Taint -->|允许| P2
    P1 -.->|无法调度| Node
    P2 -->|可调度| Node
    
    style Node fill:#ffcdd2,stroke:#c62828
    style P1 fill:#fff3e0,stroke:#f57c00
    style P2 fill:#c8e6c9,stroke:#388e3c
                </pre>
            </div>
            
            <h5>常用命令</h5>
            <pre><code># 查看节点
kubectl get nodes

# 节点详情
kubectl describe node node-1

# 标记不可调度
kubectl cordon node-1

# 驱逐 Pod
kubectl drain node-1 --ignore-daemonsets

# 添加标签
kubectl label node node-1 disktype=ssd

# 添加污点
kubectl taint node node-1 key=value:NoSchedule</code></pre>
        `
    },
    configmap: {
        title: 'ConfigMap 深度解析',
        content: `
            <p>ConfigMap 用于存储非敏感的配置数据，实现配置与代码分离。ConfigMap 让你可以在不重新构建镜像的情况下更新应用配置。</p>
            
            <h5>ConfigMap 使用方式</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    subgraph CM[ConfigMap]
        Data[配置数据<br/>database_host: localhost<br/>database_port: 5432]
    end
    
    subgraph Methods[使用方式]
        subgraph Env[环境变量]
            E1[注入单个键]
            E2[注入所有键]
        end
        subgraph File[配置文件]
            F1[挂载为文件]
            F2[挂载为目录]
        end
        subgraph Cmd[命令行]
            C1[启动参数引用]
        end
    end
    
    subgraph Pod[Pod]
        Container[容器]
    end
    
    CM --> Env
    CM --> File
    CM --> Cmd
    Env --> Container
    File --> Container
    Cmd --> Container
    
    style CM fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style Methods fill:#fff3e0,stroke:#f57c00
    style Pod fill:#e8f5e9,stroke:#388e3c
                </pre>
            </div>
            
            <h5>配置更新流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant User as 用户
    participant API as API Server
    participant CM as ConfigMap
    participant Kubelet as kubelet
    participant Pod as Pod
    
    User->>API: 更新 ConfigMap
    API->>CM: 保存更新
    CM-->>Kubelet: Watch 通知
    Kubelet->>Pod: 更新挂载文件
    
    Note over Kubelet,Pod: 挂载方式: 自动更新(有延迟)
    Note over User,Pod: 环境变量: 需重启 Pod
                </pre>
            </div>
            
            <h5>使用方式对比</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>方式</th>
                        <th>优点</th>
                        <th>缺点</th>
                        <th>场景</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>环境变量</strong></td>
                        <td>简单直接</td>
                        <td>更新需重启</td>
                        <td>少量配置</td>
                    </tr>
                    <tr>
                        <td><strong>命令行参数</strong></td>
                        <td>灵活覆盖</td>
                        <td>复杂配置不便</td>
                        <td>启动参数</td>
                    </tr>
                    <tr>
                        <td><strong>挂载文件</strong></td>
                        <td>支持热更新</td>
                        <td>需应用监听</td>
                        <td>复杂配置</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>常用命令</h5>
            <pre><code># 创建 ConfigMap
kubectl create configmap app-config --from-literal=key=value

# 从文件创建
kubectl create configmap app-config --from-file=config.yaml

# 查看 ConfigMap
kubectl get configmaps
kubectl describe configmap app-config

# 编辑 ConfigMap
kubectl edit configmap app-config</code></pre>
        `
    },
    secret: {
        title: 'Secret 深度解析',
        content: `
            <p>Secret 用于存储敏感信息如密码、密钥、证书等。Secret 数据以 Base64 编码存储，在 etcd 中加密保存。</p>
            
            <h5>Secret 类型与用途</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    subgraph Secrets[Secret 类型]
        Opaque[Opaque<br/>通用敏感数据]
        Docker[dockerconfigjson<br/>镜像仓库凭证]
        TLS[tls<br/>TLS 证书]
        SA[service-account-token<br/>服务账户令牌]
    end
    
    subgraph Usage[使用场景]
        U1[数据库密码]
        U2[私有镜像仓库]
        U3[HTTPS 证书]
        U4[集群认证]
    end
    
    Opaque --> U1
    Docker --> U2
    TLS --> U3
    SA --> U4
    
    style Secrets fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style Usage fill:#fff3e0,stroke:#f57c00
                </pre>
            </div>
            
            <h5>Secret 使用流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant Admin as 管理员
    participant API as API Server
    participant Secret as Secret
    participant Pod as Pod
    
    Admin->>API: 创建 Secret (Base64)
    API->>Secret: 加密存储到 etcd
    
    Admin->>API: 创建 Pod 引用 Secret
    API->>Pod: 调度 Pod
    Pod->>Secret: 挂载/注入
    Secret-->>Pod: 解码后数据
    
    Note over API,Secret: etcd 中加密存储
    Note over Secret,Pod: 传输时 Base64 解码
                </pre>
            </div>
            
            <h5>Secret vs ConfigMap</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>对比项</th>
                        <th>Secret</th>
                        <th>ConfigMap</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>用途</strong></td>
                        <td>敏感信息</td>
                        <td>非敏感配置</td>
                    </tr>
                    <tr>
                        <td><strong>编码</strong></td>
                        <td>Base64</td>
                        <td>纯文本</td>
                    </tr>
                    <tr>
                        <td><strong>存储</strong></td>
                        <td>加密存储</td>
                        <td>明文存储</td>
                    </tr>
                    <tr>
                        <td><strong>大小限制</strong></td>
                        <td>1MB</td>
                        <td>1MB</td>
                    </tr>
                    <tr>
                        <td><strong>访问控制</strong></td>
                        <td>更严格</td>
                        <td>常规 RBAC</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Secret
kubectl create secret generic db-secret \\
  --from-literal=username=admin \\
  --from-literal=password=secret123

# 创建 Docker 仓库凭证
kubectl create secret docker-registry regcred \\
  --docker-server=registry.example.com \\
  --docker-username=user \\
  --docker-password=pass

# 创建 TLS Secret
kubectl create secret tls tls-secret \\
  --cert=tls.crt --key=tls.key

# 查看 Secret
kubectl get secrets

# 解码 Secret
kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 -d</code></pre>
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
                    
                    // Render mermaid diagrams in the expanded content
                    if (typeof mermaid !== 'undefined') {
                        detailContainer.querySelectorAll('pre.mermaid').forEach(pre => {
                            mermaid.run({ nodes: [pre] });
                        });
                    }
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

// Sidebar submenu toggle
document.querySelectorAll('.nav-item.has-submenu > .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#concepts') {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('open');
        }
    });
});

// Auto-expand submenu when clicking on concepts section
document.querySelectorAll('.sidebar-submenu a').forEach(link => {
    link.addEventListener('click', function() {
        const parent = this.closest('.nav-item.has-submenu');
        if (parent) {
            parent.classList.add('open');
        }
    });
});
});