// 获取图表数据的函数
function xhhaocomDataStatisticsGetChartData() {
    return fetch('/apis/api.data.statistics.xhhao.com/v1alpha1/chart/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应错误');
            }
            return response.json();
        })
        .catch(error => {
            console.error('获取图表数据失败:', error);
            return null;
        });
}

// 标签统计
const xhhaocomDataStatisticsTagChart = echarts.init(document.getElementById('xhhaocom-dataStatistics-tagChart'));
const xhhaocomDataStatisticsTagOption = {
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    backgroundColor: 'transparent',
    title: {
        top: 10,
        left: 'center',
        text: '标签统计',
        textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: 600
        }
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderColor: '#5470c6',
        borderWidth: 1,
        textStyle: {
            color: '#fff',
            fontSize: 13
        },
        padding: [10, 15],
        borderRadius: 8,
        formatter: '{b}<br/>文章数: <span style="color: #5470c6; font-weight: 600;">{c}</span> ({d}%)'
    },
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6'],
    series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 3
        },
        label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 12,
            fontWeight: 500,
            color: '#2c3e50'
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 15,
                shadowOffsetX: 0,
                shadowColor: 'rgba(84, 112, 198, 0.5)',
                borderWidth: 4
            },
            label: {
                fontSize: 14,
                fontWeight: 600
            }
        },
        data: []
    }]
};

// 标签名转换为URL友好格式：中文转拼音，英文转小写，用连字符连接
function xhhaocomDataStatisticsConvertTagToUrl(xhhaocomDataStatisticsTagName) {
    if (!xhhaocomDataStatisticsTagName) return '';

    // 判断是否包含中文字符
    const xhhaocomDataStatisticsHasChinese = /[\u4e00-\u9fa5]/.test(xhhaocomDataStatisticsTagName);

    if (xhhaocomDataStatisticsHasChinese) {
        // 中文转拼音
        try {
            // 检查 pinyin-pro 库的全局变量
            let xhhaocomDataStatisticsPinyinFunc = null;

            if (typeof pinyinPro !== 'undefined' && pinyinPro.pinyin) {
                xhhaocomDataStatisticsPinyinFunc = pinyinPro.pinyin;
            } else if (typeof window !== 'undefined' && window.pinyinPro && window.pinyinPro.pinyin) {
                xhhaocomDataStatisticsPinyinFunc = window.pinyinPro.pinyin;
            } else if (typeof pinyin !== 'undefined') {
                xhhaocomDataStatisticsPinyinFunc = pinyin;
            }

            if (!xhhaocomDataStatisticsPinyinFunc) {
                console.error('pinyin-pro 库未加载，当前全局变量:', typeof pinyinPro, typeof pinyin, typeof window?.pinyinPro);
                return encodeURIComponent(xhhaocomDataStatisticsTagName).toLowerCase();
            }

            const xhhaocomDataStatisticsPinyinArray = xhhaocomDataStatisticsPinyinFunc(xhhaocomDataStatisticsTagName, {
                toneType: 'none',
                type: 'array'
            });

            if (xhhaocomDataStatisticsPinyinArray && xhhaocomDataStatisticsPinyinArray.length > 0) {
                return xhhaocomDataStatisticsPinyinArray.join('-').toLowerCase();
            } else {
                return encodeURIComponent(xhhaocomDataStatisticsTagName).toLowerCase();
            }
        } catch (xhhaocomDataStatisticsError) {
            console.error('拼音转换失败:', xhhaocomDataStatisticsError);
            // 如果转换失败，使用原始名称的编码
            return encodeURIComponent(xhhaocomDataStatisticsTagName).toLowerCase();
        }
    } else {
        // 英文转小写，处理空格和特殊字符
        return xhhaocomDataStatisticsTagName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
}

// 标签点击跳转事件
xhhaocomDataStatisticsTagChart.on('click', function(xhhaocomDataStatisticsParams) {
    if (xhhaocomDataStatisticsParams.data && xhhaocomDataStatisticsParams.data.name) {
        const xhhaocomDataStatisticsOriginalName = xhhaocomDataStatisticsParams.data.name;
        const xhhaocomDataStatisticsTagName = xhhaocomDataStatisticsConvertTagToUrl(xhhaocomDataStatisticsOriginalName);
        console.log('原始标签名:', xhhaocomDataStatisticsOriginalName, '转换后:', xhhaocomDataStatisticsTagName);
        const xhhaocomDataStatisticsBaseUrl = window.location.origin;
        window.open(xhhaocomDataStatisticsBaseUrl + '/tags/' + xhhaocomDataStatisticsTagName, '_blank');
    }
});

// 文章统计 - 日历热力图
const xhhaocomDataStatisticsPostChart = echarts.init(document.getElementById('xhhaocom-dataStatistics-postChart'));
const xhhaocomDataStatisticsCurrentYear = new Date().getFullYear();
const xhhaocomDataStatisticsLastYear = xhhaocomDataStatisticsCurrentYear - 1;
const xhhaocomDataStatisticsPostOption = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
    animationDelay: function (idx) {
        return idx * 2;
    },
    backgroundColor: 'transparent',
    title: {
        top: 10,
        left: 'center',
        text: '文章统计',
        textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: 600
        }
    },
    tooltip: {
        position: 'top',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderColor: '#5470c6',
        borderWidth: 1,
        textStyle: {
            color: '#fff',
            fontSize: 13
        },
        padding: [10, 15],
        borderRadius: 6,
        formatter: function (params) {
            return '<div style="font-weight: 600; margin-bottom: 4px;">' + params.value[0] + '</div><div>文章数: <span style="color: #5470c6; font-weight: 600;">' + params.value[1].toLocaleString() + '</span></div>';
        }
    },
    visualMap: {
        min: 0,
        max: 10,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 50,
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 8,
        pieces: [
            { min: 9, max: 10, color: '#0a2463' },
            { min: 7, max: 8, color: '#1e3a8a' },
            { min: 5, max: 6, color: '#3b82f6' },
            { min: 3, max: 4, color: '#60a5fa' },
            { min: 1, max: 2, color: '#93c5fd' },
            { min: 0, max: 0, color: '#dbeafe' }
        ],
        textStyle: {
            color: '#666',
            fontSize: 11,
            fontWeight: 500
        },
        borderColor: '#e0e0e0',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: [8, 12],
        borderRadius: 6
    },
    calendar: {
        top: 100,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: [
            xhhaocomDataStatisticsLastYear + '-01-01',
            echarts.time.format(new Date(), '{yyyy}-{MM}-{dd}', false)
        ],
        itemStyle: {
            borderWidth: 0.5,
            borderColor: '#fff'
        },
        dayLabel: {
            nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            color: '#666',
            fontSize: 11,
            fontWeight: 500
        },
        monthLabel: {
            nameMap: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            color: '#666',
            fontSize: 11,
            fontWeight: 500
        },
        yearLabel: {
            show: false
        }
    },
    series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: [],
        universalTransition: {
            enabled: true
        }
    }]
};

// 分类统计
const xhhaocomDataStatisticsCategoryChart = echarts.init(document.getElementById('xhhaocom-dataStatistics-categoryChart'));
const xhhaocomDataStatisticsCategoryOption = {
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    backgroundColor: 'transparent',
    title: {
        top: 10,
        left: 'center',
        text: '分类统计',
        textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: 600
        }
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderColor: '#5470c6',
        borderWidth: 1,
        textStyle: {
            color: '#fff',
            fontSize: 13
        },
        padding: [10, 15],
        borderRadius: 8,
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#5470c6'
            }
        }
    },
    grid: {
        left: '5%',
        right: '5%',
        bottom: '8%',
        top: '15%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#666',
            fontSize: 12,
            fontWeight: 500
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#666',
            fontSize: 12,
            fontWeight: 500
        },
        splitLine: {
            lineStyle: {
                color: '#f0f0f0',
                type: 'solid',
                width: 1
            }
        }
    },
    series: [{
        name: '文章数',
        type: 'line',
        smooth: true,
        data: [],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
            width: 4,
            color: '#5470c6',
            shadowBlur: 8,
            shadowColor: 'rgba(84, 112, 198, 0.3)'
        },
        itemStyle: {
            color: '#5470c6',
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 6,
            shadowColor: 'rgba(84, 112, 198, 0.4)'
        },
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: 'rgba(84, 112, 198, 0.4)'
                }, {
                    offset: 1,
                    color: 'rgba(84, 112, 198, 0.05)'
                }]
            }
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(84, 112, 198, 0.5)'
            }
        }
    }]
};

// 评论者排行 Top 10
const xhhaocomDataStatisticsCommentChart = echarts.init(document.getElementById('xhhaocom-dataStatistics-commentChart'));
const xhhaocomDataStatisticsCommentGrid = {
    left: 80,
    right: 50,
    top: 60,
    bottom: 50
};

const xhhaocomDataStatisticsCommentOption = {
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    backgroundColor: 'transparent',
    title: {
        top: 10,
        left: 'center',
        text: '评论者排行 Top 10',
        textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: 600
        }
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderColor: '#5470c6',
        borderWidth: 1,
        textStyle: {
            color: '#fff',
            fontSize: 13
        },
        padding: [10, 15],
        borderRadius: 8,
        formatter: function(params) {
            const xhhaocomDataStatisticsUserIndex = Math.floor(params.value[0]);
            const xhhaocomDataStatisticsCommentUsers = xhhaocomDataStatisticsCommentOption.xAxis.data;
            const xhhaocomDataStatisticsUserName = xhhaocomDataStatisticsCommentUsers[xhhaocomDataStatisticsUserIndex] || '';
            const xhhaocomDataStatisticsCount = Math.round(params.value[2]);
            return xhhaocomDataStatisticsUserName + '<br/>评论数: <span style="color: #5470c6; font-weight: 600;">' + xhhaocomDataStatisticsCount + '</span>';
        }
    },
    grid: xhhaocomDataStatisticsCommentGrid,
    xAxis: {
        type: 'category',
        jitter: 0,
        data: [],
        axisLine: {
            lineStyle: {
                color: '#e0e0e0'
            }
        },
        axisLabel: {
            color: '#666',
            fontSize: 12,
            rotate: 45
        }
    },
    yAxis: {
        type: 'value',
        name: '评论数',
        min: 0,
        axisLine: {
            lineStyle: {
                color: '#e0e0e0'
            }
        },
        axisLabel: {
            color: '#666',
            fontSize: 12
        },
        splitLine: {
            lineStyle: {
                color: '#f0f0f0',
                type: 'dashed'
            }
        }
    },
    series: [{
        name: '评论数',
        type: 'scatter',
        data: [],
        colorBy: 'data',
        itemStyle: {
            opacity: 0.6
        },
        symbolSize: function(data) {
            return Math.sqrt(data[2]) * 2;
        },
        emphasis: {
            itemStyle: {
                opacity: 1,
                shadowBlur: 10,
                shadowColor: 'rgba(84, 112, 198, 0.5)'
            }
        }
    }]
};

// 文章最受欢迎 Top 10
const xhhaocomDataStatisticsPopularChart = echarts.init(document.getElementById('xhhaocom-dataStatistics-popularChart'));
const xhhaocomDataStatisticsPopularOption = {
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    backgroundColor: 'transparent',
    title: {
        top: 10,
        left: 'center',
        text: '文章最受欢迎 Top 10',
        textStyle: {
            color: '#2c3e50',
            fontSize: 18,
            fontWeight: 600
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderColor: '#5470c6',
        borderWidth: 1,
        textStyle: {
            color: '#fff',
            fontSize: 13
        },
        padding: [10, 15],
        borderRadius: 8,
        formatter: function(params) {
            const xhhaocomDataStatisticsIndex = params[0].dataIndex;
            const xhhaocomDataStatisticsFullTitles = xhhaocomDataStatisticsPopularOption.xAxis[0].fullTitles || [];
            const xhhaocomDataStatisticsFullTitle = xhhaocomDataStatisticsFullTitles[xhhaocomDataStatisticsIndex] || params[0].name;
            return xhhaocomDataStatisticsFullTitle + '<br/>访问量: <span style="color: #5470c6; font-weight: 600;">' + params[0].value.toLocaleString() + '</span>';
        }
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '15%',
        top: '15%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        data: [],
        fullTitles: [],
        axisTick: {
            alignWithLabel: true,
            show: false
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            color: '#666',
            fontSize: 11,
            rotate: 45,
            margin: 8,
            fontWeight: 500,
            interval: 0,
            formatter: function(value) {
                if (value.length > 12) {
                    return value.substring(0, 12) + '...';
                }
                return value;
            }
        }
    }],
    yAxis: [{
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#666',
            fontSize: 12,
            fontWeight: 500
        },
        splitLine: {
            lineStyle: {
                color: '#f0f0f0',
                type: 'solid',
                width: 1
            }
        }
    }],
    series: [{
        name: '访问量',
        type: 'bar',
        barWidth: '65%',
        data: [],
        label: {
            show: true,
            position: 'top',
            color: '#666',
            fontSize: 11,
            fontWeight: 500,
            formatter: '{c}'
        },
        itemStyle: {
            color: '#5470c6',
            borderRadius: [8, 8, 0, 0],
            shadowBlur: 8,
            shadowColor: 'rgba(84, 112, 198, 0.3)',
            shadowOffsetY: 2
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 15,
                shadowColor: 'rgba(84, 112, 198, 0.5)',
                shadowOffsetY: 4
            },
            label: {
                fontSize: 13,
                fontWeight: 600
            }
        }
    }]
};

// 处理并更新所有图表数据
function xhhaocomDataStatisticsUpdateCharts(data) {
    if (!data) {
        console.error('数据为空，使用默认数据');
        return;
    }

    // 1. 更新标签图表
    if (data.tags && Array.isArray(data.tags)) {
        const xhhaocomDataStatisticsTagData = data.tags
            .map(tag => ({
                value: tag.count || 0,
                name: tag.name || '未知'
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
        
        xhhaocomDataStatisticsTagOption.series[0].data = xhhaocomDataStatisticsTagData;
        xhhaocomDataStatisticsTagChart.setOption(xhhaocomDataStatisticsTagOption);
    }

    // 2. 更新文章统计（日历热力图）
    if (data.articles && Array.isArray(data.articles)) {
        const xhhaocomDataStatisticsPostData = data.articles.map(article => {
            // 将日期字符串转换为 YYYY-MM-DD 格式
            let dateStr = article.name || article.date;
            if (dateStr && dateStr.includes('T')) {
                dateStr = dateStr.split('T')[0];
            }
            return [dateStr, article.total || 0];
        });

        // 计算最大值用于 visualMap
        const xhhaocomDataStatisticsMaxValue = Math.max(...xhhaocomDataStatisticsPostData.map(d => d[1]), 1);
        xhhaocomDataStatisticsPostOption.visualMap.max = Math.max(xhhaocomDataStatisticsMaxValue, 10);
        xhhaocomDataStatisticsPostOption.series[0].data = xhhaocomDataStatisticsPostData;
        xhhaocomDataStatisticsPostChart.setOption(xhhaocomDataStatisticsPostOption);
    }

    // 3. 更新分类统计
    if (data.categories && Array.isArray(data.categories)) {
        const xhhaocomDataStatisticsCategoryNames = data.categories.map(cat => cat.name || '未知');
        const xhhaocomDataStatisticsCategoryValues = data.categories.map(cat => cat.total || 0);
        
        xhhaocomDataStatisticsCategoryOption.xAxis.data = xhhaocomDataStatisticsCategoryNames;
        xhhaocomDataStatisticsCategoryOption.series[0].data = xhhaocomDataStatisticsCategoryValues;
        xhhaocomDataStatisticsCategoryChart.setOption(xhhaocomDataStatisticsCategoryOption);
    }

    // 4. 更新评论统计
    if (data.comments && Array.isArray(data.comments)) {
        const xhhaocomDataStatisticsCommentUsers = data.comments
            .slice(0, 10)
            .map(comment => {
                // 显示用户名，如果用户名太长则截断
                let displayName = comment.username || comment.email || '未知用户';
                if (displayName.includes('@')) {
                    displayName = displayName.split('@')[0];
                }
                if (displayName.length > 15) {
                    displayName = displayName.substring(0, 15) + '...';
                }
                return displayName;
            });
        
        const xhhaocomDataStatisticsCommentData = [];
        data.comments.slice(0, 10).forEach((comment, index) => {
            const count = comment.count || 0;
            // 为每个评论者生成多个数据点，模拟抖动效果
            for (let i = 0; i < 20; ++i) {
                xhhaocomDataStatisticsCommentData.push([
                    index,
                    count + (Math.random() - 0.5) * 5,
                    count
                ]);
            }
        });

        const xhhaocomDataStatisticsCommentWidth = xhhaocomDataStatisticsCommentChart.getWidth() - xhhaocomDataStatisticsCommentGrid.left - xhhaocomDataStatisticsCommentGrid.right;
        xhhaocomDataStatisticsCommentOption.xAxis.data = xhhaocomDataStatisticsCommentUsers;
        xhhaocomDataStatisticsCommentOption.xAxis.jitter = (xhhaocomDataStatisticsCommentWidth / Math.max(xhhaocomDataStatisticsCommentUsers.length, 1)) * 0.8;
        xhhaocomDataStatisticsCommentOption.series[0].data = xhhaocomDataStatisticsCommentData;
        xhhaocomDataStatisticsCommentChart.setOption(xhhaocomDataStatisticsCommentOption);
    }

    // 5. 更新 top10 文章
    if (data.top10Articles && Array.isArray(data.top10Articles)) {
        const xhhaocomDataStatisticsPopularArticles = data.top10Articles.map(article => article.name || '未知文章');
        const xhhaocomDataStatisticsPopularViews = data.top10Articles.map(article => article.views || 0);
        
        // 保存完整标题用于 tooltip
        xhhaocomDataStatisticsPopularOption.xAxis[0].fullTitles = xhhaocomDataStatisticsPopularArticles;
        xhhaocomDataStatisticsPopularOption.xAxis[0].data = xhhaocomDataStatisticsPopularArticles.map(title => {
            if (title.length > 12) {
                return title.substring(0, 12) + '...';
            }
            return title;
        });
        xhhaocomDataStatisticsPopularOption.series[0].data = xhhaocomDataStatisticsPopularViews;
        xhhaocomDataStatisticsPopularChart.setOption(xhhaocomDataStatisticsPopularOption);
    }
}

// 初始化：获取数据并更新所有图表
xhhaocomDataStatisticsGetChartData().then(data => {
    xhhaocomDataStatisticsUpdateCharts(data);
});

// 窗口大小改变时调整图表
const xhhaocomDataStatisticsResizeHandler = function() {
    xhhaocomDataStatisticsTagChart.resize();
    xhhaocomDataStatisticsPostChart.resize();
    xhhaocomDataStatisticsCategoryChart.resize();
    xhhaocomDataStatisticsCommentChart.resize();
    xhhaocomDataStatisticsPopularChart.resize();
    
    // 重新计算评论者图表的 jitter 值
    if (xhhaocomDataStatisticsCommentOption.xAxis.data && xhhaocomDataStatisticsCommentOption.xAxis.data.length > 0) {
        const xhhaocomDataStatisticsCommentNewWidth = xhhaocomDataStatisticsCommentChart.getWidth() - xhhaocomDataStatisticsCommentGrid.left - xhhaocomDataStatisticsCommentGrid.right;
        xhhaocomDataStatisticsCommentOption.xAxis.jitter = (xhhaocomDataStatisticsCommentNewWidth / xhhaocomDataStatisticsCommentOption.xAxis.data.length) * 0.8;
        xhhaocomDataStatisticsCommentChart.setOption(xhhaocomDataStatisticsCommentOption);
    }
};
window.addEventListener('resize', xhhaocomDataStatisticsResizeHandler);
