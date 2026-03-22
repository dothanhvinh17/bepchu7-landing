// Thay link CSV của file Google Sheets mới của ông vào đây
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzu59wxJFb6QsQI9xznuKuY38prjdfZ9YZibp4LYFGzaDiFlACCEMbLrkFYRStbqLyEHxarPSTIQ_j/pub?output=csv";

async function fetchBếpChú7Data() {
    try {
        const response = await fetch(sheetUrl + '&cb=' + new Date().getTime());
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        let rawData = [];
        
        rows.forEach(row => {
            const cols = row.split(',');
            if (cols[0] && cols[0].trim() !== "") {
                rawData.push({ 
                    name: cols[0].trim(), 
                    value: parseInt(cols[1]) || 0 
                });
            }
        });

        // Sắp xếp để lấy Top sản phẩm/đại lý
        rawData.sort((a, b) => b.value - a.value);

        return {
            names: rawData.map(item => item.name),
            values: rawData.map((item, index) => {
                // Đổi tông màu sang Đỏ/Vàng/Nâu cho hợp chất Mắm
                let color = '#8b4513'; // Màu nâu mắm mặc định
                if (index === 0) color = '#e63946'; // Top 1: Đỏ nổi bật
                else if (index === 1) color = '#f4a261'; // Top 2: Cam vàng
                else if (index === 2) color = '#e9c46a'; // Top 3: Vàng nhạt

                return { 
                    value: item.value, 
                    itemStyle: { color: color, borderRadius: [0, 10, 10, 0] } 
                };
            })
        };
    } catch (err) { return null; }
}

// Cấu hình biểu đồ cho Landing Page
var optionBepChu7 = {
    grid: { top: 20, bottom: 20, left: 150, right: 80 },
    xAxis: { max: 'dataMax', splitLine: { show: false }, axisLabel: { show: false } },
    yAxis: { 
        type: 'category', 
        data: [], 
        inverse: true, 
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#1d3557', fontSize: 14, fontWeight: 'bold' } 
    },
    series: [{
        realtimeSort: true,
        type: 'bar',
        data: [],
        label: { 
            show: true, 
            position: 'right', 
            valueAnimation: true, 
            formatter: '{c} hũ', // Thêm đơn vị "hũ" cho nó thực tế
            color: '#1d3557',
            fontWeight: 'bold'
        }
    }],
    animationDurationUpdate: 2000,
    animationEasingUpdate: 'linear'
};

async function startBếpChú7Race(chartInstance) {
    async function update() {
        const data = await fetchBếpChú7Data();
        if (data) {
            chartInstance.setOption({
                yAxis: { data: data.names },
                series: [{ data: data.values }]
            });
        }
    }
    update();
    setInterval(update, 10000); // 10 giây cập nhật sản lượng một lần
}