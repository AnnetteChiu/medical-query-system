pharmacometrics/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types.ts
    └── components/
        ├── SearchBar.tsx
        ├── ArticleList.tsx
        └── ArticleDetail.tsx

完成。開啟 http://localhost:5173 後點「⛏️ 劑量探勘」頁籤，預設搜尋詞是 Polysorbate 80 dosage，點「開始探勘」會：

從 PubMed 抓取 30 篇相關文獻
自動解析摘要中的劑量數據（mg/kg、%、mg/mL 等格式）
彙整出現頻率，高頻劑量用藍色標示
每篇文章列出擷取到的劑量數值，可點擊連結到 PubMed 原文

完成。「⛏️ 劑量探勘」頁籤頂部現在有一個換算器，功能：

依體重換算：輸入體重（kg），自動算出各文獻標準下的每日上限（mg/day）
依用量反推：輸入實際用量，顯示佔各標準上限的百分比，超標會標紅色警示
數據來源包含 FDA、EMA、ICH Q3C、WHO 的公開文件。

在劑量探勘頁面加入一個計算器，根據從論文擷取的劑量數據，輸入體重或用量來換算 Polysorbate 80 的劑量範圍

你想計算哪種藥物或成分的劑量？可以說得更具體嗎，例如：

某藥物的體重換算劑量（mg/kg）
根據論文數據做劑量範圍統計
特定適應症的建議劑量比較
