// Initialize Mermaid
if (typeof mermaid !== 'undefined') {
    mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default'
    });
}

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
    subgraph P[Pod]
        N[Network Namespace]
        S[Storage Volumes]
        C1[Container 1]
        C2[Container 2]
    end
    N --> C1
    N --> C2
    S --> C1
    S --> C2
                </pre>
            </div>
            
            <h5>Pod 生命周期状态流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
stateDiagram-v2
    [*] --> Pending
    Pending --> Running
    Pending --> Failed
    Running --> Succeeded
    Running --> Failed
    Succeeded --> [*]
    Failed --> [*]
                </pre>
            </div>
            
            <h5>多容器 Pod 模式</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart LR
    subgraph Sidecar
        A1[App] --> L[Log Agent]
    end
    subgraph Ambassador
        A2[App] --> P[Proxy]
    end
    subgraph Adapter
        A3[App] --> Ad[Adapter]
    end
                </pre>
            </div>
            
            <h5>探针工作流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant K as Kubelet
    participant C as Container
    K->>C: Liveness Check
    C-->>K: Response
    K->>C: Readiness Check
    C-->>K: Response
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
                        <td>最大 CPU 使用量</td>
                    </tr>
                    <tr>
                        <td><strong>内存</strong></td>
                        <td>保证可用的内存</td>
                        <td>最大内存限制</td>
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
    D[Deployment] --> RS1[ReplicaSet v1]
    D --> RS2[ReplicaSet v2]
    RS1 --> P1[Pod v1]
    RS2 --> P2[Pod v2]
                </pre>
            </div>
            
            <h5>滚动更新流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant U as User
    participant D as Deployment
    participant R as ReplicaSet
    participant P as Pod
    U->>D: kubectl set image
    D->>R: create new RS
    R->>P: create new Pod
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
                        <td><strong>适用场景</strong></td>
                        <td>生产环境</td>
                        <td>开发测试</td>
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

# 回滚
kubectl rollout undo deployment/nginx</code></pre>
        `
    },
    service: {
        title: 'Service 深度解析',
        content: `
            <p>Service 为一组 Pod 提供稳定的网络访问入口，实现服务发现和负载均衡。</p>
            
            <h5>Service 工作原理</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart LR
    C[Client] --> S[Service]
    S --> P1[Pod 1]
    S --> P2[Pod 2]
    S --> P3[Pod 3]
                </pre>
            </div>
            
            <h5>Service 类型对比</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>类型</th>
                        <th>访问范围</th>
                        <th>适用场景</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>ClusterIP</strong></td>
                        <td>集群内部</td>
                        <td>内部服务通信</td>
                    </tr>
                    <tr>
                        <td><strong>NodePort</strong></td>
                        <td>集群外部</td>
                        <td>开发测试</td>
                    </tr>
                    <tr>
                        <td><strong>LoadBalancer</strong></td>
                        <td>公网访问</td>
                        <td>生产环境</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>服务发现流程</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
sequenceDiagram
    participant A as App Pod
    participant D as DNS
    participant S as Service
    participant B as Backend Pod
    A->>D: resolve service name
    D-->>A: return ClusterIP
    A->>S: request
    S->>B: forward
    B-->>A: response
                </pre>
            </div>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Service
kubectl expose deployment nginx --port=80 --target-port=80

# 创建 NodePort
kubectl expose deployment nginx --port=80 --type=NodePort

# 查看 Service
kubectl get services

# 查看 endpoints
kubectl get endpoints nginx</code></pre>
        `
    },
    node: {
        title: 'Node 深度解析',
        content: `
            <p>Node 是 Kubernetes 集群中的工作节点，可以是物理机或虚拟机。</p>
            
            <h5>Node 组件架构</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    M[Master] --> K[kubelet]
    K --> R[Runtime]
    R --> P[Pods]
    K --> P
                </pre>
            </div>
            
            <h5>Node 状态流转</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
stateDiagram-v2
    [*] --> Ready
    Ready --> NotReady
    NotReady --> Ready
    Ready --> Unknown
    Unknown --> Ready
                </pre>
            </div>
            
            <h5>Node 条件状态</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>条件</th>
                        <th>说明</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Ready</strong></td>
                        <td>节点健康状态</td>
                    </tr>
                    <tr>
                        <td><strong>MemoryPressure</strong></td>
                        <td>内存压力</td>
                    </tr>
                    <tr>
                        <td><strong>DiskPressure</strong></td>
                        <td>磁盘压力</td>
                    </tr>
                    <tr>
                        <td><strong>PIDPressure</strong></td>
                        <td>进程数压力</td>
                    </tr>
                </tbody>
            </table>
            
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
kubectl label node node-1 disktype=ssd</code></pre>
        `
    },
    configmap: {
        title: 'ConfigMap 深度解析',
        content: `
            <p>ConfigMap 用于存储非敏感的配置数据，实现配置与代码分离。</p>
            
            <h5>ConfigMap 使用方式</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart TB
    CM[ConfigMap] --> E[Env Variables]
    CM --> F[Files]
    CM --> C[Command Args]
    E --> P[Pod]
    F --> P
    C --> P
                </pre>
            </div>
            
            <h5>使用方式对比</h5>
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>方式</th>
                        <th>优点</th>
                        <th>缺点</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>环境变量</strong></td>
                        <td>简单直接</td>
                        <td>更新需重启</td>
                    </tr>
                    <tr>
                        <td><strong>挂载文件</strong></td>
                        <td>支持热更新</td>
                        <td>需应用监听</td>
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

# 编辑 ConfigMap
kubectl edit configmap app-config</code></pre>
        `
    },
    secret: {
        title: 'Secret 深度解析',
        content: `
            <p>Secret 用于存储敏感信息如密码、密钥、证书等。</p>
            
            <h5>Secret 类型与用途</h5>
            <div class="mermaid-diagram">
                <pre class="mermaid">
flowchart LR
    O[Opaque] --> D[Database Password]
    D[dockerconfigjson] --> R[Registry Credential]
    T[tls] --> C[TLS Certificate]
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
                </tbody>
            </table>
            
            <h5>常用命令</h5>
            <pre><code># 创建 Secret
kubectl create secret generic db-secret --from-literal=password=secret123

# 创建 Docker 凭证
kubectl create secret docker-registry regcred --docker-server=registry.example.com --docker-username=user --docker-password=pass

# 创建 TLS Secret
kubectl create secret tls tls-secret --cert=tls.crt --key=tls.key

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
                        var mermaidElements = detailContainer.querySelectorAll('pre.mermaid');
                        if (mermaidElements.length > 0) {
                            // Reset and re-render all mermaid elements
                            mermaidElements.forEach(function(el) {
                                el.removeAttribute('data-processed');
                            });
                            // Use mermaid.run() for v10
                            try {
                                mermaid.run({ nodes: mermaidElements });
                            } catch(e) {
                                console.log('Mermaid render error:', e);
                            }
                        }
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