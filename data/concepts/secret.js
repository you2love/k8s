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