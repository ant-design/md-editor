import { MarkdownEditor, MarkdownEditorInstance } from '@ant-design/md-editor';
import React from 'react';

const defaultValue = `<!--{"mergeCells":[{"row":1,"col":0,"rowspan":13,"colspan":1}],"colWidths":[152,373,300,88]}-->
| 大类别   | 子问题                          | 详情 | 是否符合 |
|--------|-----------------------------|----|------|
| **商业模式** | 要求行业空间大，至少得是千亿rmb利润规模以上，最好是万亿规模 | 中国游戏行业2023年市场规模超3000亿，网易作为头部企业直接受益 | 符合 |
|        | 行业规>模会随着时间上升             | 移动游戏、云音乐等细分领域持续增长 | 符合 |
|        | 显性进入壁垒：政策、牌照             | 游戏版号审批制形成政策壁垒 | 符合 |
|        | 隐性进入壁垒                     | 长期积累的IP资源（如《梦幻西游》）和用户生态 | 优秀 |
|        | 用户使用偏好                     | 多款游戏MAU超千万，云音乐月活1.9亿 | 优秀 |
|        | 专利、技术优势                   | AI语音合成、游戏引擎等6000+专利 | 符合 |
|        | 是否有网络效应                   | 游戏社交生态、云音乐社区形成网络效应 | 符合 |
|        | 毛利率 > 40%                   | 2023年毛利率61% | 优秀 |
|        | ROE > 20%                    | 2023年ROE 22.9% | 符合 |
|        | 净利润 > 15%                   | 2023年净利润率28.4% | 优秀 |
|        | 品牌优势                       | 中国第二大游戏厂商，多款国民级游戏 | 优秀 |
|        | 成本优势                       | 自研引擎降低开发成本，规模效应显著 | 符合 |
|        | 转换成本 | 游戏账号体系、社交关系链形成黏性 | 符合 |
| **企业文化** | 是否股东导向                     | 连续6年分红，2023年股息支付率40% | 优秀 |
|        | 是否言行一致                     | 战略聚焦"精品化"路线十年未变 | 符合 |
|        | 是否行事风格谨慎                   | 资产负债率31%，现金占比超总资产65% | 优秀 |
|        | 是否专注                       | 游戏业务占比73%，教育/音乐等协同发展 | 符合 |
|        | 是否乱投资、乱花钱                 | 研发费用率16%，资本开支聚焦核心业务 | 符合 |
|        | 是否有道德败坏的行为                 | 未出现重大伦理争议 | 符合 |
|        | 是否强调用户导向，为消费者提供优质的产品与服务 | "游戏热爱者"品牌主张持续践行 | 优秀 |
|        | 对员工是否权责到位                 | 实施"游戏制作人工作室"制度 | 符合 |
|        | 是否内部选拔                     | CEO丁磊任职超20年，核心团队稳定 | 优秀 |
|        | 是否公平合理、对等互利的对待上下游商业合作伙伴 | 与暴雪等国际大厂长期合作 | 符合 |
| **估值**   | 当前P/S, P/E 在历史水平         | 当前PE 17.1倍，处于5年估值中枢低位 | 符合 |
|        | FCF/Market Cap 与10年期国债收益率比较 | FCF收益率6.1% vs 国债4.7% | 优秀 |
| **杂项**   | 是否不是政策不鼓励行业               | 游戏行业受版号监管但属合法经营 | 符合 |
|        | 是否是政策支持行业                 | 数字文创入选"十四五"规划 | 符合 |
|        | 不受关税影响                      | 主要市场在国内 | 优秀 |
|        | 不受技术封锁影响                    | 自主引擎技术降低依赖 | 符合 |
|        | 不受战争影响                      | 无直接关联 | 符合 |
|        | 不受疫情影响                      | 线上业务受益 | 优秀 |

**关键亮点**：
1. 财务指标全面达标：毛利率61%/ROE22.9%/现金流充沛，展现优质印
钞机属性
2. 护城河立体化：政策壁垒+IP矩阵+自研技术+用户生态构建多维防御
3. 估值安全边际：PE处于历史低位，FCF收益率显著高于无风险利率

**潜在风险**：
版号审批节奏影响新游上线，需持续跟>踪《永劫无间》等旗舰产品表现
`;

export default () => {
  const markdownEditorRef = React.useRef<MarkdownEditorInstance>();
  const markdownEditor2Ref = React.useRef<MarkdownEditorInstance>();

  return (
    <div
      style={{
        paddingTop: 32,
      }}
    >
      <MarkdownEditor
        editorRef={markdownEditor2Ref}
        width={'100vw'}
        height={'50vh'}
        reportMode
        style={{ padding: 0 }}
        contentStyle={{
          padding: 0,
          margin: 0,
          paddingLeft: 0,
        }}
        onChange={(e) => {
          console.log(e);
          markdownEditorRef.current?.store?.setMDContent?.(e);
        }}
        tableConfig={{
          excelMode: true,
        }}
        initValue={defaultValue}
      />

      <MarkdownEditor
        editorRef={markdownEditorRef}
        width={'100vw'}
        height={'50vh'}
        reportMode
        readonly
        style={{ padding: 0 }}
        contentStyle={{
          padding: 0,
          margin: 0,
          paddingLeft: 0,
        }}
        tableConfig={{
          minColumn: 20,
          minRows: 10,
        }}
        initValue={defaultValue}
      />
    </div>
  );
};
