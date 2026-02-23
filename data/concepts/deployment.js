deployment: {
    title: 'Deployment 深度解析',
    content: `
        <p>Deployment 管理无状态应用的部署和更新，提供声明式更新和回滚能力。它是最常用的控制器之一，用于管理 Pod 和 ReplicaSet。此外，Kubernetes 还提供了多种其他部署类型来满足不同场景的需求。</p>
        
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
        
        <h4 class="mt-4">其他部署类型</h4>
        
        <h5>CronJob (定时任务)</h5>
        <p>CronJob 用于创建定时任务，按照预定的时间表运行 Job，适用于周期性执行的任务（如备份、清理、报表生成等）。</p>
        <pre><code># 创建定时任务（每分钟执行一次）
apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "* * * * *"  # Cron 表达式
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cronjob
            image: busybox:1.28
            args:
            - /bin/sh
            - -c
            - date; echo "Running a scheduled task"
          restartPolicy: OnFailure
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1</code></pre>
        
        <h6>Cron 表达式格式</h6>
        <ul>
            <li>分钟 (0-59)</li>
            <li>小时 (0-23)</li>
            <li>日期 (1-31)</li>
            <li>月份 (1-12)</li>
            <li>星期 (0-7, 0 和 7 都代表星期日)</li>
        </ul>
        <p>常见表达式示例：</p>
        <ul>
            <li><code>0 0 * * *</code> - 每天午夜执行</li>
            <li><code>0 */2 * * *</code> - 每两小时执行</li>
            <li><code>0 22 * * 1-5</code> - 每个工作日 22:00 执行</li>
            <li><code>*/10 * * * *</code> - 每10分钟执行</li>
        </ul>
        
        <h5>StatefulSet (有状态应用)</h5>
        <p>StatefulSet 管理有状态应用的部署和扩展，为每个 Pod 提供稳定的标识符（如持久化存储、网络标识等），适用于数据库、分布式系统等需要稳定网络标识和持久化存储的应用。</p>
        <pre><code># 创建有状态应用
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: my-statefulset
spec:
  serviceName: my-service
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: nginx:1.21
        volumeMounts:
        - name: storage
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi</code></pre>
        
        <h6>StatefulSet 特点</h6>
        <ul>
            <li><strong>稳定有序的部署</strong>：Pod 按顺序创建和删除</li>
            <li><strong>稳定网络标识</strong>：每个 Pod 有稳定的 DNS 名称</li>
            <li><strong>稳定存储标识</strong>：每个 Pod 有稳定的持久化卷</li>
            <li><strong>有序的滚动更新</li>
        </ul>
        
        <h5>DaemonSet (守护进程集)</h5>
        <p>DaemonSet 确保所有（或部分）节点上都运行一个 Pod 副本，适用于需要在每个节点上运行的系统级应用，如日志收集、监控、网络代理等。</p>
        <pre><code># 创建守护进程集
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: my-daemonset
spec:
  selector:
    matchLabels:
      app: my-daemon
  template:
    metadata:
      labels:
        app: my-daemon
    spec:
      containers:
      - name: daemon
        image: fluent/fluent-bit:1.8
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log</code></pre>
        
        <h6>DaemonSet 应用场景</h6>
        <ul>
            <li><strong>日志收集</strong>：如 Fluentd, Filebeat</li>
            <li><strong>监控代理</strong>：如 Prometheus Node Exporter</li>
            <li><strong>网络插件</strong>：如 Calico, Flannel</li>
            <li><strong>存储插件</strong>：如 GlusterFS, Ceph</li>
        </ul>
        
        <h5>Deployment vs CronJob vs StatefulSet vs DaemonSet</h5>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead class="table-primary">
                    <tr>
                        <th>特性</th>
                        <th>Deployment</th>
                        <th>CronJob</th>
                        <th>StatefulSet</th>
                        <th>DaemonSet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>用途</td>
                        <td>无状态应用</td>
                        <td>定时任务</td>
                        <td>有状态应用</td>
                        <td>节点级服务</td>
                    </tr>
                    <tr>
                        <td>Pod 标识</td>
                        <td>临时、无序</td>
                        <td>临时</td>
                        <td>稳定、有序</td>
                        <td>节点相关</td>
                    </tr>
                    <td>运行模式</td>
                    <td>持续运行</td>
                    <td>周期性运行</td>
                    <td>持续运行</td>
                    <td>持续运行</td>
                    </tr>
                    <tr>
                        <td>存储</td>
                        <td>共享存储</td>
                        <td>无或临时</td>
                        <td>独立持久卷</td>
                        <td>主机卷</td>
                    </tr>
                    <tr>
                        <td>网络标识</td>
                        <td>动态分配</td>
                        <td>动态分配</td>
                        <td>稳定 DNS</td>
                        <td>动态分配</td>
                    </tr>
                    <tr>
                        <td>扩展方式</td>
                        <td>按副本数</td>
                        <td>按时间表</td>
                        <td>按副本数</td>
                        <td>按节点数</td>
                    </tr>
                    <tr>
                        <td>典型应用</td>
                        <td>Web 服务、API</td>
                        <td>备份、清理</td>
                        <td>数据库、集群</td>
                        <td>监控、代理</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <h5>常用命令</h5>
        <pre><code># Deployment 相关命令
kubectl create deployment nginx --image=nginx:1.21
kubectl scale deployment nginx --replicas=3
kubectl set image deployment/nginx nginx=nginx:1.22
kubectl rollout status deployment/nginx
kubectl rollout undo deployment/nginx

# CronJob 相关命令
kubectl create cronjob my-cronjob --image=busybox --schedule="*/5 * * * *" -- /bin/sh -c "date; echo 'Hello from CronJob'"
kubectl get cronjob
kubectl describe cronjob my-cronjob

# StatefulSet 相关命令
kubectl create -f statefulset.yaml
kubectl get statefulset
kubectl delete statefulset my-statefulset

# DaemonSet 相关命令
kubectl create -f daemonset.yaml
kubectl get daemonset
kubectl describe daemonset my-daemonset</code></pre>
        
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
            <li>根据应用特性选择合适的控制器类型（Deployment、StatefulSet、DaemonSet、CronJob）</li>
        </ul>
        
        <h5>常见问题</h5>
        <ul>
            <li><strong>镜像拉取失败</strong>：检查镜像名称、tag 和仓库访问权限</li>
            <li><strong>资源不足</strong>：检查节点资源，增加副本数或升级节点</li>
            <li><strong>健康检查失败</strong>：检查探针配置和应用健康状态</li>
            <li><strong>更新卡住</strong>：检查 progressDeadlineSeconds 和错误日志</li>
            <li><strong>StatefulSet 无法删除</strong>：检查 PersistentVolume 的回收策略</li>
            <li><strong>CronJob 错过执行</strong>：检查时区设置和调度策略</li>
        </ul>
    `
}