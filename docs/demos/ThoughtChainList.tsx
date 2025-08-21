import { ThoughtChainList } from '@ant-design/md-editor';
import React from 'react';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: 64,
        fontSize: 14,
      }}
    >
      <ThoughtChainList
        loading={false}
        thoughtChainList={[
          {
            category: 'TableSql',
            info: '查看 ${tableName} 数据',
            input: {
              sql: 'SELECT * FROM table_name',
            },
            meta: {
              data: {
                tableName: [
                  {
                    name: '用户表',
                  },
                ],
              },
            },
            runId: '1',
            output: {
              columns: ['name', 'age', 'address'],
              tableData: {
                name: ['Tom', 'Jim', 'Lucy'],
                age: ['18', '20', '22'],
                address: ['Shanghai', 'Beijing', 'Hangzhou'],
              },
            },
          },
          {
            category: 'RagRetrieval',
            info: '查询 ${article} 相关文章',
            input: {
              searchQueries: ['内容', '标题'],
            },
            meta: {
              data: {
                article: [
                  {
                    name: '文章标题',
                  },
                  {
                    name: '文章内容',
                  },
                ],
              },
            },
            runId: '2',
            output: {
              chunks: [
                {
                  content: '产品介绍',
                  originUrl: 'https://www.alipay.com',
                  docMeta: { doc_name: '产品手册', doc_id: '1', type: 'doc' },
                },
                {
                  content: '产品使用',
                  originUrl: 'https://www.alipay.com',
                  docMeta: {
                    doc_name: '产品使用说明',
                    doc_id: '2',
                    type: 'doc',
                  },
                },
              ],
            },
          },
          {
            category: 'DeepThink',
            info: '如何解决工作效率问题',
            runId: '3',
            output: {
              data: '工作效率问题解决方案，提高工作效率，提高工作效率，工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率工作效率问题解决方案 ，提高工作效率 ，提高工作效率',
              type: 'END',
            },
          },
          {
            category: 'ToolCall',
            info: '调用 ${toolName} 工具',
            input: {
              inputArgs: {
                params: { name: '参数' },
              },
            },
            meta: {
              data: {
                toolName: [
                  {
                    name: '工具1',
                  },
                  {
                    name: '工具2',
                  },
                ],
              },
            },
            runId: '4',
            output: {
              response: {
                error: false,
                data: '调用工具成功',
              },
              type: 'END',
            },
          },
        ]}
      />

      <ThoughtChainList
        thoughtChainList={[
          {
            category: 'DeepThink',
            info: '正在执行: brave_web_search',
            runId: '0',
            output: {
              data: '```json\n{"query": "研究员提到拼多多风险点 知乎 CFRA", "count": 5}\n```\n\n\n `table` \n',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在推理',
            runId: '1',
            output: {
              data: '\nTitle: 知乎热榜 - 知乎\nDescription: <strong>知乎</strong>，中文互联网高质量的问答社区和创作者聚集的原创内容平台，于 2011 年 1 月正式上线，以「让人们更好的分享知识、经验和见解，找到自己的解答」为品牌使命。知乎凭借认真、专业、友善的社区氛围、独特的产品...\nURL: https://www.zhihu.com/billboard\n\nTitle: 发现 - 知乎\nDescription: <strong>知乎</strong>，中文互联网高质量的问答社区和创作者聚集的原创内容平台，于 2011 年 1 月正式上线，以「让人们更好的分享知识、经验和见解，找到自己的解答」为品牌使命。知乎凭借认真、专业、友善的社区氛围、独特的产品...\nURL: https://www.zhihu.com/explore\n\nTitle: 美国国债：特朗普关税战贸易战开启后的动荡到底是怎么回事？ - BBC News 中文\nDescription: 图像来源，Getty Images · 全球股市在经历了一段由美国贸易关税引发的混乱时期之后，本周已显得相对平稳。\nURL: https://www.bbc.com/zhongwen/articles/cx2vdp1vl7ro/simp\n\nTitle: Stocks tumble and dollar hits three-year low as Trump bashes Powell again - ABC17NEWS\nDescription: By John Towfighi, CNN New York (CNN) — US stocks ended the day sharply lower Monday and the dollar tumbled as investors assessed continued tariff uncertainty and the implications of President Donald Trump’s ongoing mission to try and oust Federal Reserve Chair Jerome Powell.\nURL: https://abc17news.com/money/cnn-business-consumer/2025/04/21/us-stocks-tumble-and-dollar-hits-three-year-low-as-trump-continues-to-bash-fed-chair-powell/\n\nTitle: US stocks tumble and dollar hits three-year low as Trump continues to bash Fed Chair Powell | KRDO\nDescription: By John Towfighi, CNN New York (CNN) — US stocks and the dollar tumbled Monday as investors assessed continued tariff uncertainty and the\nURL: https://krdo.com/news/2025/04/21/us-stocks-tumble-and-dollar-hits-three-year-low-as-trump-continues-to-bash-fed-chair-powell/\n\n\n\n',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: get_company_profile',
            runId: '2',
            output: {
              data: '```json\n{"symbol": "0700.HK"}\n```\n\n\n\x3C!-- {"type": "card","icon":"https://know2.co/api/spaces/images/84caf516-230e-460b-a9f1-bc2955f642e1.svg","title":"腾讯","description":"Internet Content & Information/Communication Services" } -->\n[腾讯](https://know2.co/company/10 "公司信息")\n\n\n\n',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: get_company_profile',
            runId: '3',
            output: {
              data: '```json\n{"symbol": "NTES"}\n```\n\n\n\x3C!-- {"type": "card","icon":"https://know2.co/api/spaces/images/156cec9a-6f55-45d6-bda6-ec37d388d8e0.svg","title":"网易","description":"Electronic Gaming & Multimedia/Communication Services" } -->\n[网易](https://know2.co/company/49 "公司信息")\n\n\n\n',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: brave_web_search',
            runId: '4',
            output: {
              data: '```json\n{"query": "拼多多风险点 研究员报告 中金 华创 国泰君安", "count": 10}\n```\n\nTitle: 国泰君安-拉普拉斯-688726-IPO专题：新股精要—高效光伏电池片核心工艺设备领先提供商拉普拉斯-241014_坚果研报下载\nDescription: 2024-10-14王政之,施怡昀,王思琪924K8页其他报告国泰君安 · 上一篇：紫金天风-动力煤周报：煤价进入淡季模式-241011\nURL: https://www.52jg.com/report/other/2621255.html\n\nTitle: 万得 - 金融终端\nDescription: 全方位洞察财经资讯 · Wind金融终端 · 覆盖全球金融市场的数据与信息 · 内容包括股票、债券、期货、外汇、基金、指数、权证、宏观行业等多项品种，7×24×365不间断地为金融机构、政府组织、企业、媒体提供准确、及时...\nURL: https://www.wind.com.cn/mobile/WFT/zh.html\n\nTitle: Zhihu\nDescription: 知乎，让每一次点击都充满意义 —— 欢迎来到知乎，发现问题背后的世界。\nURL: https://www.zhihu.com/question/38008546\n\nTitle: 永辉超市的最新研报、机构研究报告_SH601933_乌龟量化\nDescription: 永辉超市的最新研报、机构研究报告 SH601933.主板 可融资 沪股通 · 04月29日： 财报发布 · 切换自选 · + 自 选 · 价： 3.20 (+0.95%) · 估值日期： 今天 · PE/扣非PE： 亏损/亏损 · 市净率PB： 3.65 · 股息率： 0.63% · ROE： -\nURL: https://wglh.com/stock/report/sh601933/\n\nTitle: 财联社深度：重大政策事件及时分析解读_供给侧改革\nDescription: 关于我们网站声明联系方式用户反馈网站地图帮助 · 首页 · 电报 · 话题 · 盯盘 · 投研 · 下载 · 头条 · 港股 · 环球\nURL: https://www.cls.cn/depth/825182\n\nTitle: 2023-2029年富锂锰基正极材料市场竞争战略研究及投资前景可行性评估预测报告 2023-2029年富锂锰基正极材料市场竞争战略研究及投资前景可行性评估预测报告1） 中金 企信国际咨询（全称：中金企信... - 雪球\nDescription: 来源：雪球App，作者： 善行的金条小耳环，（https://xueqiu.com/1234692718/260196787） · 2023-2029年富锂锰基正极材料市场竞争战略研究及投资前景可行性评估预测报告\nURL: https://xueqiu.com/1234692718/260196787\n\nTitle: 资管圈风向又变！雪球结构产品再迎强监管 信托公司雪球发行被叫停 影响多大？ _ 东方财富网\nDescription: 【资管圈风向又变！雪球结构产品再迎强监管 信托公司雪球发行被叫停 影响多大？】券商中国获悉，1月5日，部分涉及衍生品业务的信托公司(主要是雪球类)收到监管窗口指导，暂停涉及雪球类券商收益凭证产品的发行。...\nURL: https://finance.eastmoney.com/a/202201072239307540.html\n\nTitle: PDD Holdings Inc DRC Stock Price Today | NASDAQ: PDD Live - Investing.com\nDescription: View today&#x27;s PDD Holdings Inc DRC stock price and latest PDD news and analysis. Create real-time notifications to follow any changes in the live stock price.\nURL: https://www.investing.com/equities/pinduoduo\n\nTitle: 404 - 知乎\nDescription: 知乎，中文互联网高质量的问答社区和创作者聚集的原创内容平台，于 2011 年 1 月正式上线，以「让人们更好的分享知识、经验和见解，找到自己的解答」为品牌使命。知乎凭借认真、专业、友善的社区氛围、独特的产品...\nURL: https://zhuanlan.zhihu.com/p/692760179\n\nTitle: 华尔街见闻\nDescription: We cannot provide a description for this page right now\nURL: https://wallstreetcn.com/articles/3726042\n\n\n\n让我收集更多关于这两家公司的财务和业务信息，以便进行更全面的对比分析。',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: rag_local_search',
            runId: '5',
            output: {
              data: '```json\n{"query": "腾讯 网易 对比 业务模式 收入结构", "limit": 5}\n```\n\n\n\n\n\n',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: brave_web_search',
            runId: '6',
            output: {
              data: '```json\n{"query": "拼多多 风险点 招股书 SWOT", "count": 5}\n```\n\nTitle: 一文看懂拼多多招股书：急于上市的它还需跨三道坎|拼多多|黄峥|招股书_新浪科技_新浪网\nDescription: 截至2017年12月31日和2018年3月31日，拼多多的应收账款余额分别为4.427亿元和5.515亿元，腾讯的应付余额分别是5600万元和1.227亿元。 ... 招股书披露，2018年第一季度，拼多多平均月活跃用户达到1.66亿，而在2017年第四季度平均...\nURL: https://tech.sina.com.cn/roll/2018-07-01/doc-ihespqrx8709596.shtml\n\nTitle: 拼多多公布招股书：三年亏损13亿 收入靠广告和佣金|拼多多_新浪财经_新浪网\nDescription: 定位为一家高速增长的“新电商”平台。众所周知，拼多多的快速增长受益于中国社交网络的红利，同时，“拼单”模式也是由拼多多首创。 · 招股书中进一步解释其平台定位是为买家提供“物美价廉的商品和充满乐趣的...\nURL: https://finance.sina.com.cn/stock/usstock/gsyj/2018-07-01/doc-ihespqrx7981348.shtml\n\nTitle: 拼多多更新了招股书，估值可能超过 200 亿美元 | 爱范儿\nDescription: 6 月 30 日向美国证交会递交了招股书后，拼多多于 7 月 16 日更新了招股书，披露了不少 IPO 的具体信息。 · 招股书显示，拼多多计划在纳斯达克挂牌，股票代码为 PDD，计划发行 8560 万股美国存托股票（ADS），招股区间为 ...\nURL: https://www.ifanr.com/1067669\n\nTitle: 提示信息 - 中国会计视野论坛 -\nDescription: 微信扫一扫，快速登录 · 如果您的浏览器没有自动跳转，请点击此链接\nURL: https://bbs.esnai.com/thread-5351732-1-1.html\n\nTitle: 一文看懂拼多多招股书：腾讯18.5% 为何急于上市|拼多多|腾讯|招股书_新浪科技_新浪网\nDescription: 另外，拼多多主要股东在IPO申请文件提交之前的持股情况如下：黄峥附属实体实益持有约21亿股普通股，持股比例为50.7%；腾讯附属实体实益持有约7.5亿股普通股，持股比例为18.5%；Banyan Partners Funds实益持有约4.1亿股普通股，持股比例为10.1%；红杉资本旗下基金实益持有约3亿股普通股，持股比例为7.4%。 ... 招股书披露...\nURL: http://tech.sina.com.cn/i/2018-06-30/doc-iheqpwqz3565374.shtml\n\n\n\n让我重试另一种搜索方式：',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: rag_local_search',
            runId: '7',
            output: {
              data: '```json\n{"query": "腾讯业务模式", "company_id": 10, "limit": 5}\n```\n\n\n\n\n\n看来我们遇到了连接问题。我将使用网络搜索获取更多资料：',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: brave_web_search',
            runId: '8',
            output: {
              data: '```json\n{"query": "腾讯与网易业务模式收入结构对比分析", "count": 10}\n```\n\nTitle: 被腾讯围堵，20年涨138倍，“慢”网易凭什么？\nDescription: 网易2000年登陆纳斯达克，20年后回归港股。创始人丁磊2003年就成为中国首富，那一年，现中国最富两人马云、马化腾还在蛰伏。 · 电商和搜索，网易和阿里、百度短兵相接过。在多个赛道，网易和腾讯都狭路相逢。网易游...\nURL: https://www.stcn.com/article/detail/221655.html\n\nTitle: 腾讯VS网易：一场不见终局的游戏未来之战 - 21经济网\nDescription: 国内游戏霸主腾讯最近赚足了眼球。 · 总体上看，腾讯手握“游戏+社交”两大王牌，最近发布的财报十分亮眼，其2023年总营收和净利润分别同比增长10%和36%，展现了互联网巨头的强劲活力。\nURL: https://www.21jingji.com/article/20240327/herald/a1e32b3c044c144ccfa60fa205c46ea1.html\n\nTitle: 都是靠产品起家，腾讯和网易有什么不同？ - 数英\nDescription: 扫描,分享朋友圈 · 原标题：腾讯“赛马机制”，网易“一厂两制” 本文为数英用户原创，转载请联系作者 编辑对内容有所改动\nURL: https://www.digitaling.com/articles/43538.html\n\nTitle: 八张图看懂搜狐、新浪、网易的变与不变-36氪\nDescription: 科技大厂掀起医疗界的AI革命，谁更有胜算？ · 在《黑镜》的衍生游戏里，我已经分不清谁在戏弄谁\nURL: https://www.36kr.com/p/1721264652289\n\nTitle: 腾讯游戏VS网易游戏 腾讯游戏遥遥领先_行业研究报告 - 前瞻网\nDescription: 报告服务热线400-068-7188 · 据游戏工委数据，2019年中国游戏市场实际销售收入2308.8亿元，同比增长7.7%。其中移动游戏营销收入1581.1亿元，同比增长18.0%，成为拉动游戏市场整体增长的主要因素。其用户规模6.2亿人，增速明显...\nURL: https://www.qianzhan.com/analyst/detail/220/200327-c52da0ad.html\n\nTitle: 腾讯网易业绩全面PK，万亿巨头集火4个赛道，整套打法变了？|界面新闻 · JMedia\nDescription: 腾讯网易业绩全面PK，万亿巨头集火4个赛道，整套打法变了？ · 扫一扫下载界面新闻APP\nURL: https://www.jiemian.com/article/7177594.html\n\nTitle: 干货！2021年中国游戏行业企业对比：腾讯游戏VS网易游戏 谁是“游戏之王”？_行业研究报告 - 前瞻网\nDescription: 报告服务热线400-068-7188 · 近年来，随着我国经济的发展，人们的生活水平逐步提升开始注重文化层面的追求，游戏产业也随之发展起来，目前除了传统游戏公司外，腾讯和网易两大互联网巨头也加入到了游戏行业当中，并...\nURL: https://www.qianzhan.com/analyst/detail/220/210705-d3b870ae.html\n\nTitle: 网易是如何在这场战争中败给腾讯的？_新浪财经_新浪网\nDescription: 股市瞬息万变，投资难以决策？来#A股参谋部#超话聊一聊，[点击进入超话] · 来源|互联网怪盗团（ID：TMTphantom）\nURL: https://finance.sina.com.cn/chanjing/gsnews/2021-06-11/doc-ikqciyzi9109539.shtml\n\nTitle: 腾讯网易业绩全面PK，万亿巨头集火4个赛道，整套打法变了？-蓝鲸财经\nDescription: 文|DataEye研究院 Ellie · 最新财报季已来临，腾讯、网易两大头部玩家表现如何？\nURL: https://m.lanjinger.com/d/178286\n\nTitle: 干货！2022年中国移动游戏行业龙头企业对比：腾讯VS网易 谁是中国“移动游戏之王”？_新浪财经_新浪网\nDescription: 转自：前瞻产业研究院 · 移动游戏行业主要上市公司：腾讯控股(00700.HK);网易(09999.HK);哔哩哔哩(09626.HK);友谊时光(06820.HK);中手游(00302.HK);ST天润(002113.SZ);惠程科技(002168.SZ);游族网络(002174.SZ);天娱数科(002354.SZ);凯撒文化(002425...\nURL: https://finance.sina.com.cn/roll/2022-09-15/doc-imqqsmrn9194115.shtml\n\n\n\n让我查看一些有价值的文章内容：',
              type: 'END',
            },
          },
          {
            category: 'DeepThink',
            info: '正在执行: fetch',
            runId: '9',
            output: {
              data: '```json\n{"url": "https://www.21jingji.com/article/20240327/herald/a1e32b3c044c144ccfa60fa205c46ea1.html"}\n```\n\n\n\n\n',
              type: 'END',
            },
          },
          { category: 'DeepThink', info: '推理完成', runId: '10' },
          {
            category: 'DeepThink',
            info: '正在推理',
            runId: '11',
            output: {
              data: '\nError: Tool execution timed out after 30 seconds: fetch\n\n\n\n',
              type: 'END',
            },
          },
        ]}
      />
      <div>
        <h4>Props 说明</h4>
        <ul>
          <li>
            <code>loading</code> - 加载状态，设置为 false 表示已加载完成
          </li>
          <li>
            <code>thoughtChainList</code> -
            思维链列表数据，包含多个不同类型的思维节点
          </li>
          <li>
            <code>thoughtChainList[].category</code> - 思维节点类型，如
            TableSql、RagRetrieval、DeepThink、ToolCall
          </li>
          <li>
            <code>thoughtChainList[].info</code> -
            思维节点信息描述，支持模板变量
          </li>
          <li>
            <code>thoughtChainList[].input</code> - 输入参数，包含具体的输入数据
          </li>
          <li>
            <code>thoughtChainList[].meta</code> - 元数据，包含模板变量的具体值
          </li>
          <li>
            <code>thoughtChainList[].runId</code> - 运行
            ID，用于标识不同的执行实例
          </li>
          <li>
            <code>thoughtChainList[].output</code> - 输出结果，包含执行后的数据
          </li>
          <li>
            <code>output.data</code> - 输出数据内容
          </li>
          <li>
            <code>output.type</code> - 输出类型，如 END 表示执行完成
          </li>
          <li>
            <code>output.columns</code> - 表格列名数组
          </li>
          <li>
            <code>output.tableData</code> - 表格数据对象
          </li>
          <li>
            <code>output.chunks</code> - 检索结果块数组
          </li>
          <li>
            <code>output.response</code> - 工具调用响应
          </li>
        </ul>
      </div>
    </div>
  );
}
