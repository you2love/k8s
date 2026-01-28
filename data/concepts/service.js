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
}