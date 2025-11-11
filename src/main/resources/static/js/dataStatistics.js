/**
 * 数据统计图表 V2 - 紧凑嵌入版
 * 专为文章和侧边栏嵌入设计
 * 使用 Chart.js 4.x
 * 
 * 使用方法：
 * <div class="xhhaocom-dataStatistics-v2-traffic" data-type="weekly"></div>
 * <div class="xhhaocom-dataStatistics-v2-tag"></div>
 * <div class="xhhaocom-dataStatistics-v2-category"></div>
 * <div class="xhhaocom-dataStatistics-v2-article"></div>
 * <div class="xhhaocom-dataStatistics-v2-comment"></div>
 * <div class="xhhaocom-dataStatistics-v2-popular"></div>
 */

(function() {
    'use strict';

    // 确保 Chart.js 已加载
    if (typeof Chart === 'undefined') {
        console.error('[DataStatistics V2] Chart.js 未加载');
        return;
    }

    // 图表实例存储
    const chartInstances = new Map();
    
    // 紧凑模式配置
    const compactConfig = {
        font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            size: 11
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 10,
                    padding: 6,
                    font: { size: 10 }
        }
    },
    tooltip: {
                padding: 8,
                titleFont: { size: 11 },
                bodyFont: { size: 10 },
                cornerRadius: 4
            }
        },
        scales: {
            x: {
                ticks: { font: { size: 10 }, maxRotation: 45 },
                grid: { display: false }
            },
            y: {
                ticks: { font: { size: 10 } },
                grid: { color: 'rgba(0,0,0,0.05)' }
            }
        }
    };

    // 检测嵌入模式
    function detectEmbedMode(element) {
        const isInArticle = element.closest('article') || 
                           element.closest('.post-content') || 
                           element.closest('.content') ||
                           element.closest('[class*="content"]');
        const isInSidebar = element.closest('aside') || 
                           element.closest('.sidebar') ||
                           element.closest('[class*="sidebar"]');
        
        return {
            isEmbed: isInArticle || isInSidebar,
            isArticle: isInArticle,
            isSidebar: isInSidebar
        };
    }

    // 显示加载状态
    function showLoading(element) {
        if (element.classList.contains('xhhaocom-dataStatistics-v2-traffic')) {
            element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-traffic-loading">加载中</div>';
        } else if (element.classList.contains('xhhaocom-dataStatistics-v2-activity')) {
            element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-activity-loading">加载中</div>';
        } else {
            element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-loading">加载中</div>';
        }
    }

    // 显示错误
    function showError(element, message) {
        element.innerHTML = `<div class="xhhaocom-dataStatistics-v2-error">${message || '加载失败'}</div>`;
    }

    // 显示空数据
    function showEmpty(element) {
        element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-loading">暂无数据</div>';
    }

    // 初始化图表组件
    function initChartComponent(element, componentType) {
        const embedMode = detectEmbedMode(element);
        const chartId = `v2-${componentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // 设置容器属性
        element.classList.add('xhhaocom-dataStatistics-v2-chart');
        if (embedMode.isEmbed) {
            element.setAttribute('data-embed', 'true');
        }
        if (embedMode.isSidebar) {
            element.setAttribute('data-sidebar', 'true');
        }
        
        // 设置默认高度
        if (!element.style.height) {
            element.style.height = embedMode.isEmbed ? '200px' : '240px';
        }

        showLoading(element);

        // 创建 canvas
        const canvas = document.createElement('canvas');
        element.innerHTML = '';
        element.appendChild(canvas);

        // 根据类型初始化
        switch (componentType) {
            case 'tag':
                initTagChart(canvas, element, chartId, embedMode);
                break;
            case 'category':
                initCategoryChart(canvas, element, chartId, embedMode);
                break;
            case 'article':
                initArticleChart(canvas, element, chartId, embedMode);
                break;
            case 'comment':
                initCommentChart(canvas, element, chartId, embedMode);
                break;
            case 'popular':
                initPopularChart(canvas, element, chartId, embedMode);
                break;
        }
    }

    // 格式化数字
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // SVG 图标定义 - 优化后的简洁图标
    const icons = {
        'chart-line': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
        'account-group': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        'account': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        'fire': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
        'lightning-bolt': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
        'eye': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
    };

    const activityAvatarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 50 50"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke="#344054" d="M18.75 31.25h12.5a10.417 10.417 0 0 1 10.417 10.417a2.083 2.083 0 0 1-2.084 2.083H10.417a2.083 2.083 0 0 1-2.084-2.083A10.417 10.417 0 0 1 18.75 31.25"/><path stroke="#306cfe" d="M25 22.917A8.333 8.333 0 1 0 25 6.25a8.333 8.333 0 0 0 0 16.667"/></g></svg>';

    // 创建 SVG 图标
    function createIcon(iconName, size = 24) {
        const svg = icons[iconName];
        if (!svg) return '';
        return svg.replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24" width="${size}" height="${size}"`);
    }

    // 创建统计卡片
    function createStatCard(iconName, value, label, isRealtime = false) {
        const card = document.createElement('div');
        card.className = 'xhhaocom-dataStatistics-v2-traffic-card';
        
        const iconEl = document.createElement('span');
        iconEl.className = 'xhhaocom-dataStatistics-v2-traffic-icon';
        iconEl.innerHTML = createIcon(iconName, 24);
        
        const valueEl = document.createElement('div');
        valueEl.className = 'xhhaocom-dataStatistics-v2-traffic-value';
        valueEl.textContent = formatNumber(value);
        
        const labelEl = document.createElement('div');
        labelEl.className = 'xhhaocom-dataStatistics-v2-traffic-label';
        labelEl.textContent = label;
        
        card.appendChild(iconEl);
        card.appendChild(valueEl);
        card.appendChild(labelEl);
        
        if (isRealtime) {
            const realtimeEl = document.createElement('div');
            realtimeEl.className = 'xhhaocom-dataStatistics-v2-traffic-realtime';
            realtimeEl.textContent = '实时';
            card.appendChild(realtimeEl);
        }
        
        return card;
    }

    // 流量统计（访问统计）
    function initTrafficStats(element, embedMode) {
        element.className = 'xhhaocom-dataStatistics-v2-traffic';
        showLoading(element);
        
        const type = element.getAttribute('data-type') || 'weekly';
        const visitUrl = `/apis/api.data.statistics.xhhao.com/v1alpha1/umami/visits?type=${type}`;
        const realtimeUrl = '/apis/api.data.statistics.xhhao.com/v1alpha1/umami/realtime';
        
        // 同时获取访问统计和实时数据
        Promise.all([
            fetch(visitUrl).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))),
            fetch(realtimeUrl).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
        ])
        .then(([visitData, realtimeData]) => {
            if (!visitData && !realtimeData) {
                element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-traffic-loading">暂无数据</div>';
                return;
            }
            
            element.innerHTML = '';
            
            // 访问统计数据（历史统计）
            if (visitData) {
                const pageviews = parseInt(visitData.pageviews) || 0;
                const visits = parseInt(visitData.visits) || 0;
                const visitors = parseInt(visitData.visitors) || 0;
                
                element.appendChild(createStatCard('chart-line', pageviews, '页面浏览量'));
                element.appendChild(createStatCard('account-group', visits, '访问次数'));
                element.appendChild(createStatCard('account', visitors, '访客数'));
            }
            
            // 实时数据（从 totals 获取）
            if (realtimeData && realtimeData.totals) {
                const realtimeViews = parseInt(realtimeData.totals.views) || 0;
                const realtimeVisitors = parseInt(realtimeData.totals.visitors) || 0;
                
                if (realtimeViews > 0 || realtimeVisitors > 0) {
                    element.appendChild(createStatCard('fire', realtimeViews, '实时浏览量', true));
                    element.appendChild(createStatCard('lightning-bolt', realtimeVisitors, '实时访客', true));
                }
            }
            
            // 如果没有数据，显示空状态
            if (element.children.length === 0) {
                element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-traffic-loading">暂无数据</div>';
            }
        })
        .catch(err => {
            console.error('[Traffic Stats]', err);
            element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-traffic-error">加载失败</div>';
        });
        
        // 实时数据每30秒更新一次
        const updateRealtime = () => {
            fetch(realtimeUrl)
                .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
                .then(realtimeData => {
                    if (realtimeData && realtimeData.totals) {
                        const realtimeCards = element.querySelectorAll('.xhhaocom-dataStatistics-v2-traffic-card');
                        const realtimeViews = parseInt(realtimeData.totals.views) || 0;
                        const realtimeVisitors = parseInt(realtimeData.totals.visitors) || 0;
                        
                        // 更新实时数据卡片
                        realtimeCards.forEach(card => {
                            const label = card.querySelector('.xhhaocom-dataStatistics-v2-traffic-label').textContent;
                            if (label === '实时浏览量') {
                                card.querySelector('.xhhaocom-dataStatistics-v2-traffic-value').textContent = formatNumber(realtimeViews);
                            } else if (label === '实时访客') {
                                card.querySelector('.xhhaocom-dataStatistics-v2-traffic-value').textContent = formatNumber(realtimeVisitors);
                            }
                        });
                    }
                })
                .catch(err => console.error('[Realtime Update]', err));
        };
        
        // 立即更新一次，然后每30秒更新
        setTimeout(updateRealtime, 1000);
        const interval = setInterval(updateRealtime, 30000);
        element.setAttribute('data-cleanup', interval);
    }

    // 格式化时间为中文格式（上午/下午）
    function formatTimeChinese(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const period = hours >= 12 ? '下午' : '上午';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        return `${period} ${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // 格式化设备信息
    function formatDeviceInfo(event) {
        // 国家映射
        const countryMap = {
            'CN': '中国',
            'US': '美国',
            'JP': '日本',
            'KR': '韩国',
            'GB': '英国',
            'DE': '德国',
            'FR': '法国',
            'CA': '加拿大',
            'AU': '澳大利亚',
            'IN': '印度'
        };
        
        // 操作系统映射
        const osMap = {
            'Mac OS': 'macOS',
            'Windows': 'Windows',
            'Android': 'Android',
            'iOS': 'iOS',
            'Linux': 'Linux'
        };
        
        // 设备类型映射
        const deviceMap = {
            'desktop': '桌面电脑',
            'mobile': '手机',
            'tablet': '平板电脑',
            'laptop': '笔记本'
        };
        
        // 浏览器格式化
        let browser = event.browser || '';
        // 处理 webview 格式，如 "Chrome (webview)" 或 "Chrome webview"
        if (browser && browser.toLowerCase().includes('webview')) {
            // 如果已经是 "Chrome (webview)" 格式，保持不变
            if (browser.includes('(') && browser.includes(')')) {
                // 已经是正确格式
            } else {
                // 将 "Chrome webview" 转换为 "Chrome (webview)"
                browser = browser.replace(/\s*webview\s*/gi, ' (webview)');
            }
        }
        
        // 构建描述
        const country = event.country ? (countryMap[event.country] || event.country) : '';
        const os = event.os ? (osMap[event.os] || event.os) : '';
        const device = event.device ? (deviceMap[event.device] || event.device) : '';
        
        let description = '';
        
        if (country) {
            description = `来自 ${country} 的访客`;
        } else {
            description = '一位访客';
        }
        
        if (os && device) {
            description += `在搭载 ${os} 的 ${device} 上`;
        } else if (os) {
            description += `在搭载 ${os} 的设备上`;
        } else if (device) {
            description += `在 ${device} 上`;
        }
        
        if (browser) {
            description += `使用 ${browser} 浏览器进行访问。`;
        } else {
            description += '进行访问。';
        }
        
        return description;
    }

    // 近30分钟网站活动
    function initRealtimeActivity(element, embedMode) {
        element.className = 'xhhaocom-dataStatistics-v2-activity';
        showLoading(element);
        
        const realtimeUrl = '/apis/api.data.statistics.xhhao.com/v1alpha1/umami/realtime';
        
        const updateActivity = () => {
            fetch(realtimeUrl)
                .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
                .then(data => {
                    if (!data || !data.events || !Array.isArray(data.events) || data.events.length === 0) {
                        element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-activity-empty">暂无活动</div>';
                        return;
                    }
                    
                    // 限制显示最近20条
                    const events = data.events.slice(0, 20);
                    
                    element.innerHTML = '';
                    
                    // 创建活动列表容器
                    const list = document.createElement('div');
                    list.className = 'xhhaocom-dataStatistics-v2-activity-list';
                    
                    events.forEach(event => {
                        const item = document.createElement('div');
                        item.className = 'xhhaocom-dataStatistics-v2-activity-item';
                        
                        // 格式化时间
                        const time = new Date(event.createdAt);
                        const timeStr = formatTimeChinese(time);
                        
                        // 获取路径，如果没有则显示 /
                        const urlPath = event.urlPath || '/';
                        
                        item.innerHTML = `
                            <div class="xhhaocom-dataStatistics-v2-activity-avatar">
                                ${activityAvatarSvg}
                            </div>
                            <div class="xhhaocom-dataStatistics-v2-activity-content">
                                <div class="xhhaocom-dataStatistics-v2-activity-time-line">
                                    <span class="xhhaocom-dataStatistics-v2-activity-time">${timeStr}</span>
                                    <span class="xhhaocom-dataStatistics-v2-activity-separator">
                                        ${createIcon('eye', 14)}
                                        <span>${urlPath}</span>
                                    </span>
                                </div>
                                <div class="xhhaocom-dataStatistics-v2-activity-detail">
                                    <span class="xhhaocom-dataStatistics-v2-activity-person">
                                        ${createIcon('account', 14)}
                                    </span>
                                    <span class="xhhaocom-dataStatistics-v2-activity-text">${formatDeviceInfo(event)}</span>
                                </div>
                            </div>
                        `;
                        
                        list.appendChild(item);
                    });
                    
                    element.appendChild(list);
                })
                .catch(err => {
                    console.error('[Activity]', err);
                    element.innerHTML = '<div class="xhhaocom-dataStatistics-v2-activity-error">加载失败</div>';
                });
        };
        
        // 立即加载一次，然后每30秒更新
        updateActivity();
        const interval = setInterval(updateActivity, 30000);
        element.setAttribute('data-cleanup', interval);
    }

    // 标签统计
    function initTagChart(canvas, element, chartId, embedMode) {
        fetch('/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data')
            .then(r => r.json())
            .then(data => {
                if (!data?.tags?.length) {
                    showEmpty(element);
                    return;
                }

                const tagData = data.tags.slice(0, 8);
                const labels = tagData.map(t => t.name || 'Unknown');
                const values = tagData.map(t => t.count || 0);
                
                const colors = [
                    'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)',
                    'rgba(20, 184, 166, 0.8)', 'rgba(251, 146, 60, 0.8)'
                ];

                const chart = new Chart(canvas, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: values,
                            backgroundColor: colors.slice(0, values.length),
                            borderWidth: 1,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        ...compactConfig,
                        plugins: {
                            ...compactConfig.plugins,
                            legend: {
                                ...compactConfig.plugins.legend,
                                position: embedMode.isEmbed ? 'bottom' : 'right'
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.set(chartId, chart);
            })
            .catch(err => {
                console.error('[Tag Chart]', err);
                showError(element, '加载失败');
            });
    }

    // 分类统计
    function initCategoryChart(canvas, element, chartId, embedMode) {
        fetch('/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data')
            .then(r => r.json())
            .then(data => {
                if (!data?.categories?.length) {
                    showEmpty(element);
                    return;
                }

                const labels = data.categories.map(c => c.name || 'Unknown');
                const values = data.categories.map(c => c.total || 0);

                const chart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Articles',
                            data: values,
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        ...compactConfig,
                        plugins: {
                            ...compactConfig.plugins,
                            legend: { display: false },
                            title: { display: false }
                        },
                        indexAxis: embedMode.isEmbed ? 'y' : 'x',
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.set(chartId, chart);
            })
            .catch(err => {
                console.error('[Category Chart]', err);
                showError(element, '加载失败');
            });
    }

    // 文章统计
    function initArticleChart(canvas, element, chartId, embedMode) {
        fetch('/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data')
            .then(r => r.json())
            .then(data => {
                if (!data?.articles?.length) {
                    showEmpty(element);
                    return;
                }

                // 按月聚合
                const monthly = {};
                data.articles.forEach(article => {
                    if (article.publishTime) {
                        const month = article.publishTime.substring(0, 7);
                        monthly[month] = (monthly[month] || 0) + 1;
                    }
                });

                const labels = Object.keys(monthly).sort();
                const values = labels.map(m => monthly[m]);

                const chart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Articles',
                            data: values,
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        ...compactConfig,
                        plugins: {
                            ...compactConfig.plugins,
                            legend: { display: false },
                            title: { display: false }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.set(chartId, chart);
            })
            .catch(err => {
                console.error('[Article Chart]', err);
                showError(element, '加载失败');
            });
    }

    // 评论统计
    function initCommentChart(canvas, element, chartId, embedMode) {
        fetch('/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data')
            .then(r => r.json())
            .then(data => {
                if (!data?.comments?.length) {
                    showEmpty(element);
                    return;
                }

                // 按月聚合
                const monthly = {};
                data.comments.forEach(comment => {
                    if (comment.createTime) {
                        const month = comment.createTime.substring(0, 7);
                        monthly[month] = (monthly[month] || 0) + 1;
                    }
                });

                const labels = Object.keys(monthly).sort();
                const values = labels.map(m => monthly[m]);

                const chart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Comments',
                            data: values,
                            backgroundColor: 'rgba(245, 158, 11, 0.8)',
                            borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        ...compactConfig,
                        plugins: {
                            ...compactConfig.plugins,
                            legend: { display: false },
                            title: { display: false }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.set(chartId, chart);
            })
            .catch(err => {
                console.error('[Comment Chart]', err);
                showError(element, '加载失败');
            });
    }

    // 热门文章
    function initPopularChart(canvas, element, chartId, embedMode) {
        fetch('/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data')
            .then(r => r.json())
            .then(data => {
                if (!data?.articles?.length) {
                    showEmpty(element);
        return;
    }

                // 按访问量排序
                const sorted = [...data.articles]
                    .sort((a, b) => (b.visits || 0) - (a.visits || 0))
                    .slice(0, 10);

                const labels = sorted.map(a => a.title || 'Unknown').map(t => 
                    t.length > 20 ? t.substring(0, 20) + '...' : t
                );
                const values = sorted.map(a => a.visits || 0);

                const chart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Visits',
                            data: values,
                            backgroundColor: 'rgba(239, 68, 68, 0.8)',
                            borderColor: 'rgb(239, 68, 68)',
                            borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        ...compactConfig,
                        plugins: {
                            ...compactConfig.plugins,
                            legend: { display: false },
                            title: { display: false }
                        },
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                chartInstances.set(chartId, chart);
            })
            .catch(err => {
                console.error('[Popular Chart]', err);
                showError(element, '加载失败');
            });
    }


    // 自动初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        return;
    }

        // 扫描所有 v2 组件
        const selectors = [
            '.xhhaocom-dataStatistics-v2-traffic',
            '.xhhaocom-dataStatistics-v2-activity',
            '.xhhaocom-dataStatistics-v2-tag',
            '.xhhaocom-dataStatistics-v2-category',
            '.xhhaocom-dataStatistics-v2-article',
            '.xhhaocom-dataStatistics-v2-comment',
            '.xhhaocom-dataStatistics-v2-popular'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const className = element.className;
                let componentType = '';
                
                if (className.includes('traffic')) componentType = 'traffic';
                else if (className.includes('activity')) componentType = 'activity';
                else if (className.includes('tag')) componentType = 'tag';
                else if (className.includes('category')) componentType = 'category';
                else if (className.includes('article')) componentType = 'article';
                else if (className.includes('comment')) componentType = 'comment';
                else if (className.includes('popular')) componentType = 'popular';

                if (componentType && !element.hasAttribute('data-initialized')) {
                    element.setAttribute('data-initialized', 'true');
                    if (componentType === 'traffic') {
                        initTrafficStats(element, detectEmbedMode(element));
                    } else if (componentType === 'activity') {
                        initRealtimeActivity(element, detectEmbedMode(element));
                    } else {
                        initChartComponent(element, componentType);
                    }
                }
            });
        });
    }

    // 导出初始化函数
    window.xhhaocomDataStatisticsV2Init = init;

    // 自动初始化
    init();

    // 支持动态内容
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => {
            init();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();

