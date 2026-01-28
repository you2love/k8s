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
}